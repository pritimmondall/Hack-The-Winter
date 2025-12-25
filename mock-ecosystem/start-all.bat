@echo off
REM Start Mock Pharmacy Ecosystem

echo.
echo ============================================
echo   Mock Medicine E-Commerce Ecosystem
echo ============================================
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)

REM Install dependencies if needed
echo Installing dependencies...
call npm install >nul 2>&1

cd site-a
call npm install >nul 2>&1
cd ..

cd site-b
call npm install >nul 2>&1
cd ..

echo Dependencies installed!
echo.

REM Open three command windows for each server
echo Starting servers...
echo.

echo [1/3] Starting Site A (Premium) on port 3001...
start "Site A - Premium Store (Port 3001)" cmd /k "cd site-a && npm start"
timeout /t 2 >nul

echo [2/3] Starting Site B (Budget) on port 3002...
start "Site B - Budget Store (Port 3002)" cmd /k "cd site-b && npm start"
timeout /t 2 >nul

echo [3/3] Starting MCV Server (Orchestrator) on port 3000...
start "MCV Server (Port 3000)" cmd /k "npm start"
timeout /t 2 >nul

echo.
echo ============================================
echo   All servers are starting!
echo ============================================
echo.
echo Available URLs:
echo   - MCV Server:  http://localhost:3000
echo   - Site A:      http://localhost:3001
echo   - Site B:      http://localhost:3002
echo.
echo Health Check:
echo   curl http://localhost:3000/health
echo   curl http://localhost:3001/health
echo   curl http://localhost:3002/health
echo.
echo Press any key to close this window...
pause >nul
