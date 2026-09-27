@echo off
echo ========================================================
echo Starting EcoGrid AI Backend (FastAPI + Uvicorn)
echo ========================================================
cd server
if exist .venv\Scripts\uvicorn.exe (
    .\.venv\Scripts\uvicorn.exe main:app --reload --port 8000
) else (
    uvicorn main:app --reload --port 8000
)
pause
