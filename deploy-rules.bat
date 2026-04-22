@echo off
echo ========================================
echo Deploying Firestore Rules
echo ========================================
echo.

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Firebase CLI is not installed
    echo.
    echo Install it with: npm install -g firebase-tools
    echo Then run this script again
    pause
    exit /b 1
)

echo Firebase CLI found!
echo.

REM Check if logged in
firebase projects:list >nul 2>&1
if errorlevel 1 (
    echo You need to login to Firebase first
    echo.
    firebase login
    if errorlevel 1 (
        echo Login failed
        pause
        exit /b 1
    )
)

echo Deploying Firestore rules...
echo.

firebase deploy --only firestore:rules

if errorlevel 1 (
    echo.
    echo ========================================
    echo Deployment FAILED
    echo ========================================
    echo.
    echo Try these steps:
    echo 1. Make sure you're in the mompulse directory
    echo 2. Run: firebase init firestore
    echo 3. Run this script again
    pause
    exit /b 1
) else (
    echo.
    echo ========================================
    echo Deployment SUCCESSFUL!
    echo ========================================
    echo.
    echo Firestore rules have been deployed.
    echo Users can now log and track their cycles!
    echo.
    pause
)
