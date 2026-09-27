@echo off
setlocal
echo ===================================================
echo     EcoGrid AI - Push to GitHub Utility
echo ===================================================
echo.

set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/omji34330/EcoGrid-AI.git): "

if "%REPO_URL%"=="" (
    echo Error: No URL provided. Aborting.
    pause
    exit /b 1
)

echo.
echo [*] Checking existing remotes...
git remote remove origin 2>nul

echo [*] Linking remote origin to %REPO_URL%...
git remote add origin %REPO_URL%

echo [*] Setting branch to main...
git branch -M main

echo [*] Pushing code to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================
    echo  [SUCCESS] EcoGrid AI successfully uploaded to GitHub!
    echo ===================================================
) else (
    echo.
    echo [ERROR] Push failed. Make sure:
    echo   1. The repository exists on GitHub.
    echo   2. You are logged into GitHub in your browser/Git Credential Manager.
)

echo.
pause
