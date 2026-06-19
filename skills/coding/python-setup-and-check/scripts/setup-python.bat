@echo off
REM setup-python.bat - Python virtual environment setup for Windows
REM
REM This script automates Python venv creation and dependency installation
REM for non-technical Windows users.
REM
REM Usage:
REM   scripts\setup-python.bat
REM   scripts\setup-python.bat custom-requirements.txt
REM
REM Based on best practices from the Python community (2024)

setlocal enabledelayedexpansion

REM Parse arguments
set "REQUIREMENTS_FILE=requirements.txt"
set "VENV_DIR=.venv"
set "CHECK_ONLY=0"
for %%A in (%*) do (
    if /I "%%~A"=="--check" set "CHECK_ONLY=1"
)
if not "%~1"=="" (
    if not "%~1"=="--check" set "REQUIREMENTS_FILE=%~1"
)

echo.
echo ===^> Checking Python installation...
echo.

REM Prefer the Python launcher if available
set "PY_CMD=python"
where py >nul 2>&1
if %ERRORLEVEL%==0 (
    set "PY_CMD=py"
)

%PY_CMD% --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo.
    echo Please install Python from: https://www.python.org/downloads/windows/
    echo.
    echo IMPORTANT: During installation, make sure to check the box:
    echo   [X] Add Python to PATH
    echo.
    echo After installation, restart this terminal and try again.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('%PY_CMD% --version') do set PYTHON_VERSION=%%i
echo [OK] Found: %PYTHON_VERSION%

REM Check if we're already in a virtual environment
if defined VIRTUAL_ENV (
    echo.
    echo [WARNING] Already in a virtual environment: %VIRTUAL_ENV%
    echo Please deactivate it first with: deactivate
    pause
    exit /b 1
)

REM Decide venv directory: prefer existing .venv, else existing venv
if exist ".venv\" (
    set "VENV_DIR=.venv"
) else if exist "venv\" (
    set "VENV_DIR=venv"
)

if %CHECK_ONLY%==1 (
    echo.
    echo ===^> Running checks (no changes will be made)...
    set "STATUS=0"
    if exist "%VENV_DIR%\" (
        echo [OK] Found virtual environment at "%VENV_DIR%"
        if exist "%VENV_DIR%\Scripts\python.exe" (
            "%VENV_DIR%\Scripts\python.exe" -c "import sys; print(sys.executable)" 1>nul
            if exist "%REQUIREMENTS_FILE%" (
                for /f "delims=" %%F in ('"%VENV_DIR%\Scripts\python.exe" -m pip freeze') do (
                    set "LINE=%%F"
                    echo !LINE!>> "%TEMP%\pip_freeze_tmp.txt"
                )
                set "MISSING=0"
                for /f "usebackq delims=" %%R in ("%REQUIREMENTS_FILE%") do (
                    set "REQ=%%R"
                    if not "!REQ!"=="" if not "!REQ:~0,1!"=="#" (
                        for /f "tokens=1 delims=<>=!~ " %%B in ("!REQ!") do set "BASE=%%B"
                        findstr /I /R "^!BASE!==.*" "%TEMP%\pip_freeze_tmp.txt" >nul
                        if errorlevel 1 (
                            echo [WARN] Requirement not satisfied (approx): !REQ!
                            set "MISSING=1"
                        )
                    )
                )
                del "%TEMP%\pip_freeze_tmp.txt" >nul 2>&1
                if "!MISSING!"=="0" (
                    echo [OK] Requirements appear satisfied (approximate)
                ) else (
                    set "STATUS=1"
                )
                "%VENV_DIR%\Scripts\python.exe" -m pip check >nul 2>&1
                if errorlevel 1 (
                    echo [WARN] pip check reported issues
                    set "STATUS=1"
                ) else (
                    echo [OK] pip check passed
                )
            ) else (
                echo [WARN] No %REQUIREMENTS_FILE% present to validate
            )
        ) else (
            echo [ERROR] Could not find Python interpreter inside venv
            set "STATUS=1"
        )
    ) else (
        echo [WARN] No virtual environment found at "%VENV_DIR%"
        set "STATUS=1"
    )
    if "%STATUS%"=="0" (
        echo [OK] All checks passed
        exit /b 0
    ) else (
        echo [WARN] One or more checks failed. Re-run without --check to set up.
        exit /b 1
    )
)

REM Create virtual environment if it doesn't exist
if not exist "%VENV_DIR%\" (
    echo.
    echo ===^> Creating virtual environment...
    if "%PY_CMD%"=="py" (
        rem Prefer Python 3.11 if available; fallback to latest 3.x
        py -3.11 -m venv "%VENV_DIR%" >nul 2>&1
        if %ERRORLEVEL% neq 0 (
            py -3 -m venv "%VENV_DIR%"
        )
    ) else (
        python -m venv "%VENV_DIR%"
    )
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Failed to create virtual environment
        pause
        exit /b 1
    )
    echo [OK] Virtual environment created in .\%VENV_DIR%\
) else (
    echo.
    echo ===^> Using existing virtual environment: %VENV_DIR%
)

REM Activate virtual environment
echo.
echo ===^> Activating virtual environment...
call "%VENV_DIR%\Scripts\activate.bat"
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to activate virtual environment
    echo.
    echo If you're using PowerShell, try running:
    echo   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
    echo Then run this script again.
    pause
    exit /b 1
)
echo [OK] Activated

REM Upgrade pip, setuptools, and wheel
echo.
echo ===^> Upgrading pip, setuptools, and wheel...
python -m pip install --quiet --upgrade pip setuptools wheel
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Failed to upgrade tooling, continuing anyway...
) else (
    for /f "tokens=*" %%i in ('pip --version') do set PIP_VERSION=%%i
    echo [OK] Tooling upgraded: !PIP_VERSION!
)

REM Install dependencies if requirements.txt exists
if exist "%REQUIREMENTS_FILE%" (
    echo.
    echo ===^> Installing dependencies from %REQUIREMENTS_FILE%...
    pip install --quiet -r "%REQUIREMENTS_FILE%"
    if %ERRORLEVEL% neq 0 (
        echo [WARNING] Some dependencies may have failed to install
        echo Check the output above for details
    ) else (
        echo [OK] Dependencies installed
        echo.
        echo ===^> Validating installed packages...
        pip check >nul 2>&1
        if %ERRORLEVEL%==0 (
            echo [OK] Dependency integrity check passed
        ) else (
            echo [WARNING] Dependency integrity check reported issues
        )
    )
) else (
    echo.
    echo [WARNING] No %REQUIREMENTS_FILE% found - skipping dependency installation
    echo Create a requirements.txt file to list your project dependencies
)

REM Create .gitignore if it doesn't exist, or ensure venv is ignored
echo.
echo ===^> Checking .gitignore...
if not exist ".gitignore" (
    (
        echo .venv/
        echo venv/
        echo __pycache__/
        echo *.pyc
    ) > .gitignore
    echo [OK] Created .gitignore
) else (
    findstr /C:"venv/" .gitignore >nul
    if %ERRORLEVEL% neq 0 (
        echo venv/>> .gitignore
        set "GI_UPDATED=1"
    )
    findstr /C:".venv/" .gitignore >nul
    if %ERRORLEVEL% neq 0 (
        echo .venv/>> .gitignore
        set "GI_UPDATED=1"
    )
    if defined GI_UPDATED (
        echo [OK] Updated .gitignore with venv entries
    ) else (
        echo [OK] .gitignore already configured
    )
)

REM Final success message
echo.
echo ============================================================
echo [SUCCESS] Python environment setup complete!
echo ============================================================
echo.
echo Next steps:
echo   1. Activate the environment:
echo      %VENV_DIR%\Scripts\activate.bat
echo   2. Run your Python scripts
echo   3. When done, deactivate with: deactivate
echo.
echo Interpreter path check:
python -c "import sys; print(sys.executable)"
echo.
pause

