@echo off
setlocal EnableExtensions EnableDelayedExpansion
title MANABU - Khoi dong web hoc tieng Nhat
cd /d "%~dp0"

echo.
echo ================================================
echo   MANABU - HOC TIENG NHAT THEO CUM
echo ================================================
echo.

set "PROJECT_DIR=%~dp0"
set "PYTHON_EXE=%PROJECT_DIR%.venv\Scripts\python.exe"
set "CODEX_RUNTIME=C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies"

rem Tim Python cua du an.
if not exist "%PYTHON_EXE%" (
    echo [1/4] Chua co moi truong Python. Dang chuan bi...
    where python >nul 2>nul
    if errorlevel 1 (
        echo.
        echo LOI: Khong tim thay Python.
        echo Hay cai Python 3.12, sau do bam lai file nay.
        pause
        exit /b 1
    )

    python -m venv "%PROJECT_DIR%.venv"
    if errorlevel 1 goto :python_error

    "%PYTHON_EXE%" -m pip install -r "%PROJECT_DIR%requirements.txt"
    if errorlevel 1 goto :python_error
) else (
    echo [1/5] Python da san sang.
)

rem Tim Node.js. Uu tien runtime di kem Codex, sau do den Node tren may.
if exist "%CODEX_RUNTIME%\node\bin\node.exe" (
    set "PATH=%CODEX_RUNTIME%\node\bin;%CODEX_RUNTIME%\bin\fallback;%PATH%"
) else (
    where node >nul 2>nul
    if errorlevel 1 (
        echo.
        echo LOI: Khong tim thay Node.js.
        echo Hay cai Node.js 22 tro len, sau do bam lai file nay.
        pause
        exit /b 1
    )
)

if not exist "%PROJECT_DIR%node_modules\.bin\vinext.cmd" (
    echo [2/4] Dang cai thu vien giao dien lan dau...
    where pnpm >nul 2>nul
    if errorlevel 1 (
        echo.
        echo LOI: Khong tim thay pnpm de cai thu vien giao dien.
        echo Hay cai pnpm, sau do bam lai file nay.
        pause
        exit /b 1
    )
    call pnpm install
    if errorlevel 1 goto :frontend_error
) else (
    echo [2/5] Giao dien da san sang.
)

if /I "%~1"=="--check" (
    echo.
    echo Kiem tra thanh cong.
    exit /b 0
)

echo [3/5] Dang cap nhat du lieu bai hoc...
"%PYTHON_EXE%" "%PROJECT_DIR%seed.py"
if errorlevel 1 goto :python_error
"%PYTHON_EXE%" "%PROJECT_DIR%scripts\export_edge_data.py"
if errorlevel 1 goto :python_error

echo [4/5] Dang khoi dong API...
set "API_NEEDS_START=1"
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$line = netstat -ano | Select-String -Pattern '127\.0\.0\.1:8000\s+' | Select-Object -First 1; if ($line) { $parts = ($line.ToString() -split '\s+') | Where-Object { $_ -ne '' }; $pidToKill = $parts[-1]; taskkill /PID $pidToKill /F | Out-Null }"
if "!API_NEEDS_START!"=="1" (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$runtimePath=[Environment]::GetEnvironmentVariable('PATH','Process'); [Environment]::SetEnvironmentVariable('Path',$null,'Process'); [Environment]::SetEnvironmentVariable('PATH',$runtimePath,'Process'); Start-Process -FilePath '%PYTHON_EXE%' -ArgumentList @('-m','uvicorn','main:app','--host','127.0.0.1','--port','8000') -WorkingDirectory '%PROJECT_DIR%' -WindowStyle Hidden -RedirectStandardOutput '%PROJECT_DIR%backend.log' -RedirectStandardError '%PROJECT_DIR%backend.err'"
)

set /a API_WAIT=0
:wait_for_api
powershell.exe -NoProfile -Command "try { $r=Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:8000/api/health' -TimeoutSec 1; if ($r.StatusCode -eq 200) { exit 0 } } catch {}; exit 1" >nul 2>nul
if not errorlevel 1 goto :start_frontend
set /a API_WAIT+=1
if %API_WAIT% GEQ 30 goto :api_error
timeout /t 1 /nobreak >nul
goto :wait_for_api

:start_frontend
echo [5/5] Dang khoi dong trang web...
powershell.exe -NoProfile -Command "try { $r=Invoke-WebRequest -UseBasicParsing 'http://localhost:3000' -TimeoutSec 1; if ($r.Content -match 'MANABU') { exit 0 } } catch {}; exit 1" >nul 2>nul
if errorlevel 1 (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$runtimePath=[Environment]::GetEnvironmentVariable('PATH','Process'); [Environment]::SetEnvironmentVariable('Path',$null,'Process'); [Environment]::SetEnvironmentVariable('PATH','%CODEX_RUNTIME%\node\bin;%CODEX_RUNTIME%\bin\fallback;'+$runtimePath,'Process'); Start-Process -FilePath 'cmd.exe' -ArgumentList @('/d','/c','node_modules\.bin\vinext.cmd dev 1^>frontend.log 2^>frontend.err') -WorkingDirectory '%PROJECT_DIR%' -WindowStyle Hidden"
)

set /a WEB_WAIT=0
:wait_for_web
powershell.exe -NoProfile -Command "try { $r=Invoke-WebRequest -UseBasicParsing 'http://localhost:3000' -TimeoutSec 1; if ($r.StatusCode -eq 200 -and $r.Content -match 'MANABU') { exit 0 } } catch {}; exit 1" >nul 2>nul
if not errorlevel 1 goto :open_web
set /a WEB_WAIT+=1
if %WEB_WAIT% GEQ 60 goto :web_error
timeout /t 1 /nobreak >nul
goto :wait_for_web

:open_web
echo.
echo Web da san sang. Dang mo trinh duyet...
if /I "%~1"=="--no-open" exit /b 0
start "" "http://localhost:3000"
timeout /t 2 /nobreak >nul
exit /b 0

:python_error
echo.
echo LOI: Khong the chuan bi backend Python.
echo Xem chi tiet trong cua so nay hoac file backend.err.
pause
exit /b 1

:frontend_error
echo.
echo LOI: Khong the cai hoac chay thu vien giao dien.
pause
exit /b 1

:api_error
echo.
echo LOI: API khong khoi dong duoc trong 30 giay.
echo Hay xem file backend.err trong thu muc du an.
pause
exit /b 1

:web_error
echo.
echo LOI: Trang web khong khoi dong duoc trong 60 giay.
echo Hay xem file frontend.err trong thu muc du an.
pause
exit /b 1
