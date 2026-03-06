/**
 * ARQIA Backend Server - REAL APS INTEGRATION
 * 
 * Connects to Autodesk Platform Services (APS)
 * - OAuth 2.0 authentication
 * - OSS file storage
 * - Model Derivative translation
 * - Webhooks for job status
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== APS CONFIGURATION ====================
const APS_CLIENT_ID = process.env.APS_CLIENT_ID || '69PtbpOgvyFrnGAXzWTj4kMHl8ztAAM34aIqX5nt52U9Nr4R';
const APS_CLIENT_SECRET = process.env.APS_CLIENT_SECRET || 'CluCNFiOkZbtckdQraB9GFJyH7yofu0Cqkl6wZJn3jjQvLBsxKzb9Ct65Q3DA6Jh';
const APS_BASE_URL = 'https://developer.api.autodesk.com';

// Cache for APS tokens
let apsTokenCache = {
    access_token: null,
    expires_at: 0
};

// In-memory storage
const syncStore = new Map();
const uploadJobs = new Map();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ==================== STATIC FILES ====================
app.use(express.static(path.join(__dirname, 'public')));

// ==================== APS AUTHENTICATION ====================

/**
 * Get APS 2-legged token (client credentials)
 */
async function getAPSToken() {
    const now = Date.now();
    
    // Return cached token if still valid (with 5 min buffer)
    if (apsTokenCache.access_token && apsTokenCache.expires_at > now + 300000) {
        return apsTokenCache.access_token;
    }
    
    try {
        const response = await axios.post(
            `${APS_BASE_URL}/authentication/v2/token`,
            new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: APS_CLIENT_ID,
                client_secret: APS_CLIENT_SECRET,
                scope: 'data:read data:write bucket:create bucket:read bucket:delete code:all'
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        
        apsTokenCache = {
            access_token: response.data.access_token,
            expires_at: now + (response.data.expires_in * 1000)
        };
        
        console.log('[APS] Token refreshed successfully');
        return apsTokenCache.access_token;
    } catch (error) {
        console.error('[APS] Token error:', error.response?.data || error.message);
        throw error;
    }
}

// ==================== HEALTH & STATUS ====================

app.get('/api/health', async (req, res) => {
    try {
        const token = await getAPSToken();
        res.json({
            status: 'ok',
            service: 'ARQIA APS Backend',
            version: '1.0.0-aps',
            aps_connected: true,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: 'APS connection failed',
            message: error.message
        });
    }
});

app.get('/api/aps/status', async (req, res) => {
    try {
        const token = await getAPSToken();
        
        // Check Model Derivative availability
        const mdResponse = await axios.get(
            `${APS_BASE_URL}/modelderivative/v2/designdata/formats`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        
        res.json({
            connected: true,
            token_valid: true,
            model_derivative: {
                available: true,
                formats_count: Object.keys(mdResponse.data.formats).length
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            connected: false,
            error: error.message
        });
    }
});

/**
 * Get APS token for viewer
 */
app.get('/api/aps/token', async (req, res) => {
    try {
        const token = await getAPSToken();
        res.json({
            access_token: token,
            token_type: 'Bearer',
            expires_in: 3600
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to get token',
            message: error.message
        });
    }
});

// ==================== OSS (STORAGE) ENDPOINTS ====================

/**
 * List all buckets
 */
app.get('/api/aps/buckets', async (req, res) => {
    try {
        const token = await getAPSToken();
        const response = await axios.get(
            `${APS_BASE_URL}/oss/v2/buckets?region=US`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: 'Failed to list buckets',
            details: error.response?.data || error.message
        });
    }
});

/**
 * Create a new bucket
 */
app.post('/api/aps/buckets', async (req, res) => {
    try {
        const { bucketKey, policy = 'transient' } = req.body;
        const token = await getAPSToken();
        
        const response = await axios.post(
            `${APS_BASE_URL}/oss/v2/buckets`,
            {
                bucketKey: bucketKey || `arqia-${Date.now()}`,
                policyKey: policy
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        
        res.json({
            success: true,
            bucket: response.data
        });
    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: 'Failed to create bucket',
            details: error.response?.data || error.message
        });
    }
});

/**
 * Upload file to OSS
 */
app.post('/api/aps/upload', async (req, res) => {
    try {
        const { bucketKey, objectName, fileData, contentType = 'application/octet-stream' } = req.body;
        
        if (!bucketKey || !objectName || !fileData) {
            return res.status(400).json({
                error: 'Missing required fields: bucketKey, objectName, fileData'
            });
        }
        
        const token = await getAPSToken();
        
        // Decode base64 file data
        const buffer = Buffer.from(fileData, 'base64');
        
        // Upload to OSS
        const uploadUrl = `${APS_BASE_URL}/oss/v2/buckets/${bucketKey}/objects/${encodeURIComponent(objectName)}`;
        const response = await axios.put(uploadUrl, buffer, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': contentType,
                'Content-Length': buffer.length
            }
        });
        
        // Store upload record
        const uploadId = uuidv4();
        uploadJobs.set(uploadId, {
            uploadId,
            bucketKey,
            objectName,
            objectId: response.data.objectId,
            size: buffer.length,
            uploadedAt: new Date().toISOString()
        });
        
        res.json({
            success: true,
            uploadId,
            objectId: response.data.objectId,
            location: response.data.location,
            size: buffer.length
        });
        
    } catch (error) {
        console.error('[UPLOAD ERROR]', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: 'Upload failed',
            details: error.response?.data || error.message
        });
    }
});

// ==================== MODEL DERIVATIVE ====================

/**
 * Get supported formats
 */
app.get('/api/aps/formats', async (req, res) => {
    try {
        const token = await getAPSToken();
        const response = await axios.get(
            `${APS_BASE_URL}/modelderivative/v2/designdata/formats`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Start translation job
 */
app.post('/api/aps/translate', async (req, res) => {
    try {
        const { urn, outputFormat = 'svf2', rootFilename } = req.body;
        
        if (!urn) {
            return res.status(400).json({ error: 'URN is required' });
        }
        
        const token = await getAPSToken();
        
        const jobPayload = {
            input: { urn },
            output: {
                formats: [{
                    type: outputFormat,
                    views: ['2d', '3d']
                }]
            }
        };
        
        if (rootFilename) {
            jobPayload.input.rootFilename = rootFilename;
            jobPayload.input.compressedUrn = true;
        }
        
        const response = await axios.post(
            `${APS_BASE_URL}/modelderivative/v2/designdata/job`,
            jobPayload,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        
        res.json({
            success: true,
            job: response.data
        });
        
    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: 'Translation job failed',
            details: error.response?.data || error.message
        });
    }
});

/**
 * Get translation job status
 */
app.get('/api/aps/translate/:urn/status', async (req, res) => {
    try {
        const { urn } = req.params;
        const token = await getAPSToken();
        
        const response = await axios.get(
            `${APS_BASE_URL}/modelderivative/v2/designdata/${encodeURIComponent(urn)}/manifest`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: 'Failed to get status',
            details: error.response?.data || error.message
        });
    }
});

// ==================== ARQIA SYNC (With APS Integration) ====================

app.post('/api/arqia/sync', async (req, res) => {
    try {
        const payload = req.body;
        const syncId = uuidv4();
        
        // Validate
        if (!payload.ProjectId || !payload.ProjectName) {
            return res.status(400).json({
                success: false,
                error: 'Invalid payload: Missing required fields'
            });
        }
        
        // Get APS token (verifies connection)
        let apsStatus = 'not_connected';
        try {
            await getAPSToken();
            apsStatus = 'connected';
        } catch (e) {
            console.warn('[SYNC] APS not connected:', e.message);
        }
        
        // Store sync record
        const syncRecord = {
            syncId,
            receivedAt: new Date().toISOString(),
            projectId: payload.ProjectId,
            projectName: payload.ProjectName,
            projectNumber: payload.ProjectNumber,
            filePath: payload.FilePath,
            revitVersion: payload.RevitVersion,
            elementCount: payload.ElementCount,
            apsStatus,
            status: 'received'
        };
        
        syncStore.set(syncId, syncRecord);
        
        // Log
        const logDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
        const logFile = path.join(logDir, `sync-${new Date().toISOString().split('T')[0]}.log`);
        fs.appendFileSync(logFile, JSON.stringify({
            timestamp: new Date().toISOString(),
            syncId,
            projectName: payload.ProjectName,
            elementCount: payload.ElementCount,
            apsStatus
        }) + '\n');
        
        console.log(`[SYNC] ${payload.ProjectName} (${payload.ElementCount} elements) - APS: ${apsStatus}`);
        
        res.json({
            success: true,
            syncId,
            token: `arqia-sync-${Date.now()}`,
            status: 'received',
            apsStatus,
            timestamp: new Date().toISOString(),
            message: 'Project synced to ARQIA',
            elementsReceived: payload.ElementCount
        });
        
    } catch (error) {
        console.error('[SYNC ERROR]', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/arqia/syncs', (req, res) => {
    const syncs = Array.from(syncStore.values())
        .sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt))
        .slice(0, 20);
    
    res.json({ count: syncStore.size, recent: syncs });
});

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not found', path: req.path });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   ARQIA Backend Server - APS INTEGRATION                         ║
║   Version: 1.0.0-aps                                             ║
║                                                                  ║
║   Listening on: http://localhost:${PORT}                            ║
║                                                                  ║
║   APS Client ID: ${APS_CLIENT_ID.substring(0, 20)}...           ║
║                                                                  ║
║   Endpoints:                                                     ║
║   • GET  /api/health              - Health + APS status          ║
║   • GET  /api/aps/status          - Detailed APS connection      ║
║   • GET  /api/aps/buckets         - List OSS buckets             ║
║   • POST /api/aps/buckets         - Create bucket                ║
║   • POST /api/aps/upload          - Upload file to OSS           ║
║   • GET  /api/aps/formats         - Supported formats            ║
║   • POST /api/aps/translate       - Start translation job        ║
║   • POST /api/arqia/sync          - Revit project sync           ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
