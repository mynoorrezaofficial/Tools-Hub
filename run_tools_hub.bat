@echo off
TITLE Tools Hub - Starter
COLOR 0B

echo ===================================================
echo   Tools Hub - All-in-One Student Toolkit
echo ===================================================
echo.

:: Start Backend
echo Starting Backend API...
cd /d "%~dp0backend"
start "Tools Hub Backend" cmd /c ".\venv\Scripts\python app.py"

:: Go back and Start Frontend
echo Starting Frontend React UI...
cd /d "%~dp0frontend"
start "Tools Hub Frontend" cmd /c "npm.cmd run dev"

echo.
echo ===================================================
echo   System is launching!
echo   Backend: http://127.0.0.1:5000
echo   Frontend: http://localhost:5173
echo ===================================================
pause
