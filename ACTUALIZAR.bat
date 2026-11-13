@echo off
chcp 65001 >nul
cd /d "%~dp0"
python actualizar_sitio.py %*
if errorlevel 1 python3 actualizar_sitio.py %* 
echo.
pause
