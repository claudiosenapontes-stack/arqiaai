# ARQIA Revit Add-in + APS Integration

Local Revit Add-in with ARQIA cloud sync and **LIVE Autodesk Platform Services (APS)** integration.

## ✅ APS Status: CONNECTED

Your app (`69PtbpOgvyFrnGAX...`) is authenticated and ready for:
- ☁️ OSS file storage (upload .rvt files)
- 🔄 Model translation (RVT → SVF2 web viewer)
- 📊 Data Management (BIM 360/ACC when provisioned)

## 📁 Project Structure

```
arqia-revit-addin/
├── src/                          # C# Revit Add-in source
│   ├── ARQIARevitAddin.csproj   # .NET project file
│   ├── ARQIARevitAddin.addin    # Revit manifest
│   ├── ARQIARibbonApp.cs        # Ribbon UI setup
│   ├── ARQIASyncCommand.cs      # Main sync functionality
│   ├── ARQIASettingsCommand.cs  # Settings dialog
│   └── ARQIAComplianceCommand.cs # Local compliance checks
├── backend/                      # Node.js stub API
│   ├── package.json
│   └── server.js
├── docs/                         # Documentation
└── README.md                     # This file
```

## 🚀 Quick Start

### Step 1: Start the Backend (APS Integrated)

**On Server (Severino):**
```bash
cd backend
npm install
npm start        # Uses server-aps.js (LIVE APS)
npm run start:stub  # Uses server.js (mock/stub mode)
```

Server runs at `http://localhost:3000`

Test APS connection:
```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/aps/status
```

### Step 2: Build Revit Add-in

**Option A: GitHub Actions (Automated - RECOMMENDED)**
- Push code to GitHub
- CI automatically builds on every commit
- Download artifacts from GitHub Actions

**Option B: Windows Machine (Manual)**
```powershell
# Install Visual Studio Build Tools or full VS 2022
# Then build:
msbuild src/ARQIARevitAddin.csproj /p:Configuration=Release
```

**Option C: Cloud VM (One-time)**
- Spin up Windows VM in Azure/GCP/AWS
- Install Visual Studio Community (free)
- Build and download artifacts

See `docs/BUILD_SOLUTIONS.md` for detailed instructions.

### Step 2: Build the Revit Add-in

**Prerequisites:**
- Visual Studio 2019/2022 or MSBuild
- Revit 2026 (or modify .csproj for 2024/2025)
- .NET Framework 4.8

**Build:**
```bash
cd src
# Using MSBuild (adjust path as needed)
msbuild ARQIARevitAddin.csproj /p:Configuration=Release

# Or open in Visual Studio and build
```

### Step 3: Install the Add-in

**Option A: Automated Install (PowerShell)**
```powershell
# Run as Administrator or standard user
.\install.ps1 -RevitVersion 2026
```

**Option B: Manual Install**
1. Copy build output to Revit add-ins folder:
   ```
   %APPDATA%\Autodesk\Revit\Addins\2026\
   ```

2. Copy files:
   - `ARQIARevitAddin.dll`
   - `ARQIARevitAddin.addin`
   - `Newtonsoft.Json.dll`

3. Restart Revit

### Step 4: Test

1. Open any Revit project
2. Look for **ARQIA** tab in the ribbon
3. Click **"Sync to ARQIA"**
4. Check backend logs for received payload

## 🔧 Configuration

### Change API Endpoint

Edit `src/ARQIASyncCommand.cs`:
```csharp
private const string API_BASE_URL = "http://your-server:3000/api";
```

### Zoning Rules

Rules are hardcoded in `ARQIAComplianceCommand.cs`. Edit:
```csharp
private const double FRONT_SETBACK = 25.25;  // Modify as needed
private const double MAX_HEIGHT = 27.0;
```

## 📡 API Endpoints (APS Backend)

### ARQIA Core
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check + APS status |
| POST | `/api/arqia/sync` | Revit project sync |
| GET | `/api/arqia/syncs` | List recent syncs |

### Autodesk Platform Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/aps/status` | APS connection status |
| GET | `/api/aps/buckets` | List OSS storage buckets |
| POST | `/api/aps/buckets` | Create storage bucket |
| POST | `/api/aps/upload` | Upload file to OSS |
| GET | `/api/aps/formats` | Supported translation formats |
| POST | `/api/aps/translate` | Start Model Derivative job |
| GET | `/api/aps/translate/:urn/status` | Check translation status |

## 📊 Sync Payload Structure

```json
{
  "ProjectId": "unique-project-id",
  "ProjectName": "Project Name",
  "ProjectNumber": "12345",
  "FilePath": "C:\\Projects\\file.rvt",
  "DocumentTitle": "file.rvt",
  "SyncTimestamp": "2026-03-06T12:00:00Z",
  "RevitVersion": "2026",
  "ElementCount": 150,
  "Elements": [...],
  "LevelData": [...],
  "ComplianceChecks": {...}
}
```

## 🎯 Features

### Current (MVP)
- ✅ Ribbon UI with ARQIA tab
- ✅ Sync button extracts model data
- ✅ Sends to local backend API
- ✅ **LIVE APS OAuth** (auto-refreshing tokens)
- ✅ **Model Derivative API** connected (60+ formats)
- ✅ Local compliance checks (zoning, height)
- ✅ Settings dialog
- ✅ Payload logging

### In Progress
- 🔄 OSS file upload from Revit
- 🔄 RVT → SVF2 translation
- 🔄 Web viewer integration

### Next Phase
- 🔲 BIM 360/ACC provisioning
- 🔲 DM/DA data management
- 🔲 Real-time collaboration

## 🐛 Troubleshooting

**Add-in not loading:**
- Check Revit version matches .csproj
- Verify all DLLs are in addins folder
- Check Revit journal files for errors

**Sync fails:**
- Ensure backend is running: `curl http://localhost:3000/api/health`
- Check firewall settings
- Verify API_BASE_URL in code

**Build errors:**
- Update RevitAPI.dll path in .csproj
- Install .NET Framework 4.8 developer pack

## 📚 Resources

- [Revit API Docs](https://www.autodesk.com/developer-network/platform-technologies/revit)
- [APS Docs](https://aps.autodesk.com/)
- ARQIA Config: `/root/clawd-sophia/arqia/`

## 🏗️ Handoff Notes for Severino

1. ✅ **APS is LIVE** - Backend connects to real Autodesk Platform Services
2. Backend is ready for Docker containerization
3. Add-in ready for code signing (optional)
4. Test data logs to `backend/logs/`
5. Extend `ARQIASyncCommand.cs` for file upload + translation
6. **APS Client ID**: `69PtbpOgvyFrnGAXzWTj4kMHl8ztAAM34aIqX5nt52U9Nr4R`
7. **Next**: Build add-in and test end-to-end with real APS

---

Built by Optimus for ARQIA 🚀
