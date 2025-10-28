@echo off
REM Solicitud de Equipos - Frontend Setup Script (Windows)
echo Configurando Sistema de Gestión de Equipos Universitarios
echo =========================================================

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js no está instalado. Instale Node.js 16 o superior.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set node_version=%%i
echo Node.js detectado: %node_version%

REM Install dependencies
echo  Instalando dependencias...
call npm install

REM Copy environment file
if not exist ".env" (
    echo Creando archivo de configuración...
    copy .env.example .env
    echo Por favor configure las variables en el archivo .env
)

REM Run linting
echo Ejecutando validaciones de código...
call npm run lint:fix

echo.
echo ¡Configuración completada!
echo.
echo Comandos disponibles:
echo   npm start          - Iniciar en desarrollo
echo   npm run build      - Construir para producción  
echo   npm test           - Ejecutar tests
echo   npm run lint       - Verificar código
echo.
echo La aplicación estará disponible en:
echo   http://localhost:3000
echo.
echo Para más información, consulte el README.md
echo.
echo Para iniciar el servidor de desarrollo, ejecute:
echo   npm start
echo.
pause