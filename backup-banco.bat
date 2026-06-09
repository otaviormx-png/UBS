@echo off
cd /d "%~dp0"
if not exist "data\busca-ativa.sqlite" (
  echo Banco nao encontrado em data\busca-ativa.sqlite
  pause
  exit /b 1
)
if not exist "backups" mkdir "backups"
for /f "tokens=1-4 delims=/ " %%a in ("%date%") do set DATA=%%d-%%b-%%c
for /f "tokens=1-2 delims=: " %%a in ("%time%") do set HORA=%%a%%b
set DESTINO=backups\busca-ativa-%DATA%-%HORA%.sqlite
copy "data\busca-ativa.sqlite" "%DESTINO%" >nul
echo Backup criado:
echo   %DESTINO%
pause
