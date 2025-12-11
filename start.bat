@echo off
echo ========================================
echo   Constructor - E-commerce Builder
echo   Iniciando todos los servicios...
echo ========================================
echo.

REM Verificar si Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js no está instalado
    echo Por favor instala Node.js desde https://nodejs.org
    pause
    exit /b 1
)

REM Verificar si las dependencias están instaladas
if not exist "node_modules" (
    echo [INFO] Instalando dependencias...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Fallo al instalar dependencias
        pause
        exit /b 1
    )
)

echo [1/4] Iniciando Backend (Puerto 3001)...
start "Constructor Backend" cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 5 /nobreak >nul

echo [2/4] Iniciando Admin Panel (Puerto 5173)...
start "Constructor Admin" cmd /k "cd /d %~dp0admin && npm run dev"
timeout /t 3 /nobreak >nul

echo [3/5] Iniciando Storefront (Puerto 3000)...
start "Constructor Storefront" cmd /k "cd /d %~dp0storefront && npm run dev"
timeout /t 5 /nobreak >nul

echo [4/5] Iniciando Store Viewer (Puerto 3002)...
start "Constructor Store Viewer" cmd /k "cd /d %~dp0storefront && npm run dev:stores"
timeout /t 5 /nobreak >nul

echo [5/5] Abriendo navegadores...
echo.
echo ========================================
echo   Servicios iniciados correctamente
echo ========================================
echo.
echo Backend:     http://localhost:3001
echo Admin:       http://localhost:5173
echo Storefront:  http://localhost:3000
echo Stores:      http://localhost:3002
echo.
echo Presiona Ctrl+C en cada ventana para detener los servicios
echo ========================================
echo.

REM Abrir navegadores
timeout /t 2 /nobreak >nul
start http://localhost:3000
timeout /t 1 /nobreak >nul
start http://localhost:5173

echo.
echo [OK] Todo listo! Los navegadores se han abierto automaticamente
echo.
echo Para detener todos los servicios:
echo 1. Cierra las ventanas de terminal que se abrieron
echo 2. O presiona Ctrl+C en cada una
echo.
pause
