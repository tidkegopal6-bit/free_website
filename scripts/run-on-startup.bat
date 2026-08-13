@echo off
cd /d "%~dp0.."
echo ===================================================
echo   AUTOMATED MULTILINGUAL AI BLOG GENERATOR
echo ===================================================

:: Check for Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not available in the PATH.
    echo Please install Git and try again.
    pause
    exit /b 1
)

:: Pull latest updates to prevent merge conflicts
echo [1/4] Pulling latest changes from Git...
git pull origin main

:: Check if GEMINI_API_KEY is available
if "%GEMINI_API_KEY%"=="" (
    echo [WARNING] GEMINI_API_KEY environment variable is not defined.
    echo If the generation fails, please set the GEMINI_API_KEY variable in your Windows User Environment Variables.
)

:: Execute the generator
echo [2/4] Running the generator script...
node scripts/generate-blog.js

:: Commit and push changes
echo [3/4] Checking for generated content...
git status --porcelain | findstr /R "^??" >nul
if %errorlevel% equ 0 (
    echo [4/4] Committing and pushing new blog posts...
    git add src/content/blog/* public/assets/blog/*
    git commit -m "chore: auto-generate blog post from local startup [skip ci]"
    git push origin main
    echo [SUCCESS] Blog post generated and pushed to GitHub!
) else (
    echo [INFO] No new files generated or no changes detected.
)

echo ===================================================
echo   PROCESS COMPLETED
echo ===================================================
timeout /t 5
