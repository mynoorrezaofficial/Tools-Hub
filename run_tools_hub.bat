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

if not exist "venv\Scripts\python.exe" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat
pip install -r requirements.txt

start "Tools Hub Backend" cmd /k "cd /d "%~dp0backend" && call venv\Scripts\activate.bat && python app.py"

:: Go back and Start Frontend
echo Starting Frontend React UI...
cd /d "%~dp0frontend"

if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
)

start "Tools Hub Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ===================================================
echo   System is launching!
echo   Backend: http://127.0.0.1:5000
echo   Frontend: http://localhost:5173
echo ===================================================
pause
