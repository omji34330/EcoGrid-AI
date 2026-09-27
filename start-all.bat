@echo off
echo ========================================================
echo Launching EcoGrid AI Full-Stack Platform (SIH 2026)
echo ========================================================
start "EcoGrid AI - Backend (Port 8000)" start-backend.bat
start "EcoGrid AI - Frontend (Port 5173)" start-frontend.bat
echo Both services launched in separate windows!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000
echo Docs:     http://localhost:8000/docs
