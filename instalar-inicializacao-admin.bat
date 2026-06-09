@echo off
cd /d "%~dp0"
echo Instalando inicializacao automatica da Busca Ativa UBS...
schtasks /Create /TN "Busca Ativa UBS" /TR "\"%~dp0iniciar-busca-ativa.bat\"" /SC ONLOGON /RL HIGHEST /F
echo.
echo Se apareceu "SUCCESS" ou "EXITO", o sistema vai iniciar quando este usuario entrar no Windows.
echo.
pause
