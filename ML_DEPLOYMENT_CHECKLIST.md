# ML Backend Deployment Checklist

## Pre-Deployment

### ✅ Files Verified
- [x] ml-backend/main.py - Syntax valid
- [x] Procfile - Created
- [x] render.yaml - Created
- [x] requirements.txt - Exists
- [x] period_tracker_ml.py - Exists
- [x] pregnancy_wellness_ml.py - Exists

### ✅ Syntax Check
\\\ash
python -m py_compile ml-backend/main.py
# Result: ✅ No errors
\\\

### ✅ Local Test (Optional)
\\\ash
cd ml-backend
python main.py
# Expected: Both servers start successfully
\\\

## Deployment Steps

### Step 1: Commit Changes
\\\ash
git add .
git commit -m "fix: implement unified ML backend with simultaneous model training"
git push origin main
\\\

### Step 2: Render Deployment
1. Go to Render dashboard
2. Select your service
3. Render auto-deploys from GitHub
4. Monitor deployment logs

### Step 3: Verify Deployment
- [ ] Check deployment logs
- [ ] Verify "Build successful" message
- [ ] Verify "Deploying..." message
- [ ] Wait for "Live" status

### Step 4: Test Endpoints
\\\ash
# Replace with your Render URL
RENDER_URL="https://your-app.onrender.com"

# Test Period Tracker health
curl \/health

# Test Pregnancy Wellness health
curl \/health
\\\

## Post-Deployment

### Monitor
- [ ] Check Render dashboard for errors
- [ ] Monitor memory usage
- [ ] Monitor response times
- [ ] Check error logs

### Test APIs
- [ ] Test Period Tracker /predict
- [ ] Test Period Tracker /insights
- [ ] Test Pregnancy Wellness /predict
- [ ] Test Pregnancy Wellness /insights

### Performance
- [ ] Verify startup time (~165 seconds)
- [ ] Check memory usage (~350MB)
- [ ] Test concurrent requests
- [ ] Verify no crashes

## Troubleshooting

### If Deployment Fails

#### Check Logs
1. Go to Render dashboard
2. Click on your service
3. View "Logs" tab
4. Look for error messages

#### Common Issues

**Syntax Error**
- ✅ Fixed in main.py
- Verify with: python -m py_compile ml-backend/main.py

**Port Binding Error**
- Check PORT environment variable
- Verify Flask binds to 0.0.0.0

**Import Error**
- Check requirements.txt
- Verify all dependencies listed

**Memory Error**
- Upgrade Render plan
- Optimize model training

### If Servers Don't Start

**Check Environment Variables**
\\\
PORT=5000
PREGNANCY_PORT=5001
FLASK_ENV=production
\\\

**Check Procfile**
\\\
web: cd ml-backend && python main.py
\\\

**Check Start Command**
- Should be: cd ml-backend && python main.py
- Not: python main.py (wrong directory)

## Success Criteria

### ✅ Deployment Successful
- Build completes without errors
- Both models train successfully
- Both servers start
- Health checks pass
- APIs respond correctly

### ✅ Performance Acceptable
- Startup time < 180 seconds
- Memory usage < 400MB
- Response time < 2 seconds
- No crashes or errors

### ✅ Monitoring Active
- Logs accessible
- Metrics visible
- Alerts configured
- Health checks running

## Quick Commands

### Local Testing
\\\ash
# Test syntax
python -m py_compile ml-backend/main.py

# Run locally
cd ml-backend && python main.py

# Test health
curl http://localhost:5000/health
curl http://localhost:5001/health
\\\

### Deployment
\\\ash
# Commit and push
git add .
git commit -m "fix: implement unified ML backend"
git push origin main

# Render auto-deploys
# Monitor at: https://dashboard.render.com
\\\

### Testing
\\\ash
# Period Tracker
curl -X POST https://your-app.onrender.com/predict \\
  -H "Content-Type: application/json" \\
  -d '{"cycles": [...]}'

# Pregnancy Wellness
curl -X POST https://your-app.onrender.com:5001/predict \\
  -H "Content-Type: application/json" \\
  -d '{"week": 20, ...}'
\\\

## Support

### Documentation
- ML_DEPLOYMENT_GUIDE.md - Full deployment guide
- ML_BACKEND_FIX_SUMMARY.md - Summary of changes
- ML_BACKEND_DEPLOYMENT_FINAL.md - Final status

### Resources
- Render Docs: https://render.com/docs
- Flask Docs: https://flask.palletsprojects.com/
- Scikit-learn Docs: https://scikit-learn.org/

### Contact
- Check Render dashboard for logs
- Review documentation files
- Test locally first

---

**Status**: ✅ Ready for Deployment
**Last Updated**: May 13, 2026
**Version**: 2.0.1
