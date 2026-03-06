/**
 * ARQIA Stub Backend Server
 * 
 * MVP testing server that echoes Revit sync payloads
 * and returns mock tokens/status without calling real APS APIs
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// In-memory storage for sync data (clears on restart)
const syncStore = new Map();
const oauthTokens = new Map();

// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'ARQIA Stub Backend',
        version: '1.0.0-mvp',
        timestamp: new Date().toISOString()
    });
});

// ============ MOCK OAUTH ENDPOINTS ============

// OAuth token endpoint (mock)
app.post('/api/oauth/token', (req, res) => {
    const { grant_type, client_id, client_secret } = req.body;
    
    // Mock validation
    if (client_id === '69PtbpOgvyFrnGAXzWTj4kMHl8ztAAM34aIqX5nt52U9Nr4R') {
        const token = `arqia-mvp-token-${uuidv4().substring(0, 8)}`;
        oauthTokens.set(token, {
            client_id,
            created_at: new Date().toISOString(),
            expires_in: 3600
        });
        
        res.json({
            access_token: token,
            token_type: 'Bearer',
            expires_in: 3600,
            scope: 'data:read data:write'
        });
    } else {
        res.status(401).json({
            error: 'invalid_client',
            error_description: 'Client authentication failed'
        });
    }
});

// OAuth authorize endpoint (mock)
app.get('/api/oauth/authorize', (req, res) => {
    const { client_id, redirect_uri, response_type, scope } = req.query;
    
    // Mock authorization code flow
    const code = `arqia-auth-code-${uuidv4().substring(0, 8)}`;
    
    // In real flow, redirect to callback with code
    res.json({
        message: 'Mock OAuth Authorization',
        client_id,
        response_type,
        mock_code: code,
        note: 'In production, this would redirect to Autodesk login'
    });
});

// ============ ARQIA SYNC ENDPOINT ============

app.post('/api/arqia/sync', (req, res) => {
    try {
        const payload = req.body;
        const syncId = uuidv4();
        const token = `arqia-sync-${Date.now()}`;
        
        // Validate payload structure
        if (!payload.ProjectId || !payload.ProjectName) {
            return res.status(400).json({
                success: false,
                error: 'Invalid payload: Missing required fields (ProjectId, ProjectName)'
            });
        }
        
        // Store sync data
        const syncRecord = {
            syncId,
            token,
            receivedAt: new Date().toISOString(),
            payload: {
                projectId: payload.ProjectId,
                projectName: payload.ProjectName,
                projectNumber: payload.ProjectNumber,
                filePath: payload.FilePath,
                documentTitle: payload.DocumentTitle,
                revitVersion: payload.RevitVersion,
                elementCount: payload.ElementCount,
                syncTimestamp: payload.SyncTimestamp,
                levels: payload.LevelData?.length || 0,
                elements: payload.Elements?.length || 0
            },
            status: 'received'
        };
        
        syncStore.set(syncId, syncRecord);
        
        // Log to file (append mode)
        const logDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        
        const logFile = path.join(logDir, `sync-${new Date().toISOString().split('T')[0]}.log`);
        fs.appendFileSync(logFile, JSON.stringify({
            timestamp: new Date().toISOString(),
            syncId,
            projectName: payload.ProjectName,
            elementCount: payload.ElementCount
        }) + '\n');
        
        // Simulate processing delay (async would happen here)
        setTimeout(() => {
            const record = syncStore.get(syncId);
            if (record) {
                record.status = 'processed';
                syncStore.set(syncId, record);
            }
        }, 1000);
        
        console.log(`[SYNC] Received project: ${payload.ProjectName} (${payload.ElementCount} elements)`);
        
        // Return success response
        res.json({
            success: true,
            token: token,
            status: 'received',
            syncId: syncId,
            timestamp: new Date().toISOString(),
            message: 'Project data received and queued for processing',
            elementsReceived: payload.ElementCount
        });
        
    } catch (error) {
        console.error('[SYNC ERROR]', error);
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Get sync status
app.get('/api/arqia/sync/:syncId/status', (req, res) => {
    const { syncId } = req.params;
    const record = syncStore.get(syncId);
    
    if (!record) {
        return res.status(404).json({
            error: 'Sync record not found'
        });
    }
    
    res.json({
        syncId: record.syncId,
        status: record.status,
        receivedAt: record.receivedAt,
        projectName: record.payload.projectName
    });
});

// List recent syncs
app.get('/api/arqia/syncs', (req, res) => {
    const syncs = Array.from(syncStore.values())
        .sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt))
        .slice(0, 10); // Last 10
    
    res.json({
        count: syncStore.size,
        recent: syncs
    });
});

// ============ APS MOCK ENDPOINTS ============

// Mock APS hubs listing
app.get('/api/aps/hubs', (req, res) => {
    res.json({
        data: [{
            id: 'arqia-mvp-hub',
            type: 'hubs',
            attributes: {
                name: 'ARQIA MVP Hub'
            }
        }]
    });
});

// Mock APS projects listing
app.get('/api/aps/hubs/:hubId/projects', (req, res) => {
    res.json({
        data: [{
            id: 'arqia-mvp-project',
            type: 'projects',
            attributes: {
                name: 'ARQIA Master Project'
            }
        }]
    });
});

// ============ ERROR HANDLING ============

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        path: req.path
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   ARQIA Stub Backend Server                                ║
║   Version: 1.0.0-mvp                                       ║
║                                                            ║
║   Listening on: http://localhost:${PORT}                      ║
║                                                            ║
║   Endpoints:                                               ║
║   • GET  /api/health          - Health check               ║
║   • POST /api/arqia/sync      - Revit sync endpoint        ║
║   • POST /api/oauth/token     - Mock OAuth token           ║
║   • GET  /api/arqia/syncs     - List recent syncs          ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
