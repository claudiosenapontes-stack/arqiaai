# 🎯 ARQIA + APS Integration - Action Items by Role

**Date:** March 6, 2026 (Friday night - READY FOR MONDAY)
**Project:** ARQIA Revit Add-in with Autodesk Platform Services
**Status:** APS Connected ✅ | Backend Live ✅ | All Code Ready

---

## 👤 ROLE ASSIGNMENTS

| Role | Who | Responsibilities |
|------|-----|------------------|
| **Backend/DevOps** | Severino | Server infrastructure, backend deployment, agent systems |
| **Revit/C# Developer** | *Contractor/New Hire* | Build Revit add-in in Visual Studio, test in Revit |
| **Decision Maker** | Claudio | Architecture decisions, cloud hosting, BIM 360 provisioning |
| **Integration** | Optimus | Code, APIs, documentation (done for this phase) |

---

## 🔴 CRITICAL - Monday Tasks

### For Revit/C# Developer (NOT Severino)
**Time Estimate:** 2-4 hours

- [ ] Set up Windows workstation with Revit 2026 + Visual Studio 2022
- [ ] Copy project from server: `/root/clawd-severino/projects/arqia-revit-addin/`
- [ ] Open `src/ARQIARevitAddin.csproj` in Visual Studio
- [ ] Update RevitAPI.dll path if using Revit 2024/2025 instead of 2026
- [ ] Build solution in **Release** mode
- [ ] Copy output to `%APPDATA%\Autodesk\Revit\Addins\2026\`:
  - `ARQIARevitAddin.dll`
  - `ARQIARevitAddin.addin`
  - `Newtonsoft.Json.dll`
- [ ] **TEST:** Open Revit → Look for **ARQIA** tab in ribbon
- [ ] **TEST:** Click all buttons (Sync, Upload, View, Settings, Compliance)
- [ ] **TEST:** Upload a .rvt file, wait for translation, view in browser

### For Severino (Backend/Server)
**Time Estimate:** 1 hour

- [ ] Verify backend is running on server: `pm2 status` or `systemctl status arqia-backend`
- [ ] Ensure port 3000 is accessible from Revit workstation
- [ ] Check firewall rules allow Revit → server communication
- [ ] Verify logs directory is writable: `backend/logs/`
- [ ] Test APS token refresh is working (auto-refresh every 50 min)
- [ ] **Optional:** Docker containerize backend for easier deployment
- [ ] **Optional:** Set up PM2 or systemd for auto-restart

---

## 🟡 HIGH PRIORITY - This Week

### Backend Enhancements (Severino)
- [ ] Move APS credentials to environment variables (`.env` file)
- [ ] Add `.env.example` template for documentation
- [ ] Implement rate limiting (express-rate-limit)
- [ ] Add request logging (Winston or similar)
- [ ] Set up log rotation (winston-daily-rotate-file)
- [ ] Add health check endpoint for monitoring
- [ ] **Stretch:** Deploy backend to cloud server (AWS/GCP/Azure)

### Database Setup (Severino)
- [ ] Install PostgreSQL or MongoDB
- [ ] Create database schema for:
  - Sync history
  - File uploads
  - Translation jobs
  - User accounts (future)
- [ ] Add database connection to backend
- [ ] Migrate from in-memory storage to database

### Revit Testing (C# Developer)
- [ ] Test with multiple Revit versions (2024, 2025, 2026)
- [ ] Test with large models (50MB+, 100MB+)
- [ ] Test file upload with slow network
- [ ] Verify error handling in all commands
- [ ] Document any Revit-specific quirks

---

## 🟢 MEDIUM PRIORITY - Next Sprint

### BIM 360 / ACC Integration (Claudio to initiate, Severino to implement)
- [ ] **Claudio:** Log into Autodesk Developer Portal → verify APIs enabled
- [ ] **Claudio:** Go to ACC account admin → Custom Integrations
- [ ] **Claudio:** Add Client ID: `69PtbpOgvyFrnGAXzWTj4kMHl8ztAAM34aIqX5nt52U9Nr4R`
- [ ] **Severino:** Update backend to query BIM 360 hubs/projects
- [ ] **Severino:** Add endpoints for hub/project listing
- [ ] **C# Dev:** Add BIM 360 project selector in Revit

### Security Hardening (Severino)
- [ ] Implement JWT authentication for API
- [ ] Add user login system
- [ ] Role-based access control (RBAC)
- [ ] HTTPS/TLS for production
- [ ] API key management for external integrations
- [ ] Secrets management (AWS Secrets Manager, etc.)

### Code Signing (C# Developer + Claudio decision)
- [ ] **Claudio:** Purchase code signing certificate?
- [ ] **C# Dev:** Sign the DLL for trusted Revit installation
- [ ] **C# Dev:** Test signed add-in on clean machine

---

## 🔵 INFRASTRUCTURE DECISIONS (Need Claudio Input)

| Decision | Options | Impact | Claudio Action |
|----------|---------|--------|----------------|
| **Cloud hosting?** | AWS / GCP / Azure / Stay on-prem | Backend availability | Choose by March 10 |
| **Database?** | PostgreSQL / MongoDB / Supabase | Data persistence | Choose by March 10 |
| **BIM 360 access?** | Use existing ACC / Create new account | Project integration | Decide by March 12 |
| **Code signing?** | Yes ($) / No (manual install) | User experience | Decide by March 15 |
| **First pilot?** | Which project/file to test with | Testing scope | Provide by March 8 |
| **Revit versions?** | 2026 only / 2024+2025+2026 | Build complexity | Decide by March 10 |

---

## 📋 SEVERINO'S SPECIFIC TASKS

### Immediate (Monday)
```bash
# 1. Verify backend is running
cd /root/clawd-severino/projects/arqia-revit-addin/backend
pm2 status
# or
systemctl status arqia-backend

# 2. Check logs
tail -f logs/sync-$(date +%Y-%m-%d).log

# 3. Test APS connection
curl http://localhost:3000/api/aps/status

# 4. Ensure network accessibility from Revit workstation
# (Revit machine needs to reach server:3000)
```

### This Week
```bash
# 1. Environment variables setup
cp .env.example .env
# Edit .env with real credentials

# 2. Docker setup (optional but recommended)
docker build -t arqia-backend .
docker run -p 3000:3000 --env-file .env arqia-backend

# 3. Database setup
# Install PostgreSQL
sudo apt install postgresql
# Create database, user
# Run migration scripts

# 4. Production deployment
# If using cloud: Deploy to EC2/Compute Engine/VM
# If on-prem: Set up systemd service for auto-start
```

### Systemd Service Template (for Severino)
```ini
# /etc/systemd/system/arqia-backend.service
[Unit]
Description=ARQIA Backend API
After=network.target

[Service]
Type=simple
User=arqia
WorkingDirectory=/opt/arqia/backend
ExecStart=/usr/bin/node server-aps.js
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production
EnvironmentFile=/opt/arqia/backend/.env

[Install]
WantedBy=multi-user.target
```

---

## 🐛 KNOWN ISSUES & WORKAROUNDS

| Issue | Impact | Workaround | Owner |
|-------|--------|------------|-------|
| OSS buckets need unique names | Low | Backend auto-appends timestamp | ✅ Backend handles |
| Token expires hourly | None | ✅ Auto-refresh implemented | Backend |
| No BIM 360 hub access | Blocks hub features | Use OSS storage for now | Claudio to provision |
| Revit 2026 only in .csproj | Limits users | C# Dev can add 2024/2025 configs | C# Developer |
| Large file uploads (>50MB) | May timeout | Implement chunked upload | Future enhancement |
| Windows-only build | Can't build on Linux | Need Windows VM or workstation | Infrastructure |

---

## 📞 ESCALATION PATH

| Issue | Contact | When |
|-------|---------|------|
| APS API errors | Optimus | Backend integration issues |
| Revit API questions | C# Developer | Add-in functionality |
| Server/infrastructure | Severino | Backend deployment, databases |
| Strategic decisions | Claudio | Architecture, hosting, budget |
| Autodesk support | Autodesk | APS platform issues |

---

## ✅ SUCCESS CRITERIA

**Backend Ready (Severino):**
- [x] APS authentication working
- [x] Server running on port 3000
- [x] All API endpoints responding
- [ ] Environment variables configured
- [ ] Database connected (optional for MVP)
- [ ] Monitoring/logging set up

**Revit Add-in Ready (C# Developer):**
- [ ] Builds without errors
- [ ] Installs to Revit
- [ ] Ribbon visible
- [ ] Sync button works
- [ ] Upload button works
- [ ] View in Browser works

**Integration Complete:**
- [ ] End-to-end test: Revit → Upload → Viewer works

---

## 📝 DAILY STANDUP TEMPLATE

**Severino:**
- Yesterday:
- Today:
- Blockers:

**C# Developer:**
- Yesterday:
- Today:
- Blockers:

---

**Last Updated:** March 6, 2026 04:25 UTC
**Prepared by:** Optimus for Claudio Sena
