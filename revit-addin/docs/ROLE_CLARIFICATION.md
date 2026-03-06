# 👥 ROLE CLARIFICATION - ARQIA APS Project

**Date:** March 6, 2026
**Purpose:** Clarify who does what for ARQIA Revit + APS integration

---

## ✅ SEVERINO'S ACTUAL TASKS

Since Severino handles **server fixes and agent development**, here are his specific tasks:

### 🔧 Monday (Server/Infrastructure)
```bash
# 1. Verify backend is running
cd /root/clawd-severino/projects/arqia-revit-addin/backend
npm start
# OR if using PM2: pm2 start server-aps.js --name arqia-backend

# 2. Test APS connection
curl http://localhost:3000/api/aps/status

# 3. Check firewall (ensure Revit workstations can reach port 3000)
sudo ufw status
# or
sudo iptables -L | grep 3000

# 4. Verify logs are writing
tail -f logs/sync-$(date +%Y-%m-%d).log
```

### 🛠️ This Week (Backend Hardening)
1. **Environment Variables** (SECURITY)
   - Move credentials from `server-aps.js` to `.env` file
   - Create `.env.example` template
   - Update code to use `process.env.VAR_NAME`

2. **Process Management**
   - Set up PM2: `pm2 start server-aps.js --name arqia-backend`
   - OR create systemd service for auto-start on boot

3. **Logging**
   - Add structured logging (Winston)
   - Set up log rotation (don't fill disk)

4. **Monitoring**
   - Health check endpoint (already exists)
   - Consider Uptime Kuma or similar for alerting

5. **Docker (Optional but recommended)**
   - Create Dockerfile
   - Make deployment reproducible

---

## ❌ NOT SEVERINO'S TASKS

These go to someone else (contractor/new hire):

| Task | Why Not Severino | Who |
|------|------------------|-----|
| Build Revit add-in in Visual Studio | Requires Windows + Revit + C# expertise | C# Developer |
| Test in Revit | Requires Revit license, Windows GUI | C# Developer |
| Debug Revit API issues | Requires Revit SDK knowledge | C# Developer |
| Code signing certificate | Can be done by anyone with cert | C# Developer or Admin |

---

## 🎯 SUMMARY

**Severino handles:**
- ✅ Backend server running
- ✅ Database setup (PostgreSQL/MongoDB)
- ✅ Environment variables / secrets
- ✅ Process management (PM2/systemd)
- ✅ Monitoring and logging
- ✅ Network/firewall configuration
- ✅ Docker/containerization
- ✅ Cloud deployment (if moving off this server)

**C# Developer handles:**
- ✅ Visual Studio project
- ✅ Building DLL
- ✅ Revit installation/testing
- ✅ Revit API debugging

**Claudio decides:**
- ✅ Cloud hosting budget
- ✅ Database choice
- ✅ BIM 360 provisioning
- ✅ Code signing purchase
- ✅ Hire C# developer or contract it out

---

## 💡 RECOMMENDATION

**For the Revit/C# work, you need:**

**Option 1: Contractor** (Fastest)
- Hire Revit API developer for 1-2 weeks
- They build, test, hand over working add-in
- Cost: ~$3-5K

**Option 2: New Hire** (Longer term)
- Hire full-time developer with Revit + C# experience
- They maintain and extend the add-in
- Cost: Salary + benefits

**Option 3: Train Existing Team** (If someone has capacity)
- Find team member with C# experience
- They learn Revit API (2-4 week learning curve)
- Cost: Time investment

---

## 📋 IMMEDIATE ACTION FOR CLAUDIO

1. **Decide on C# developer** (contractor vs hire vs train)
2. **Give Severino the go-ahead** for backend hardening tasks
3. **Make infrastructure decisions** (cloud hosting, database)

---

**Backend code is ready and tested.**
**Severino just needs to operationalize it.**
**You need a C# person for the Revit side.**

---

*Prepared by: Optimus*
