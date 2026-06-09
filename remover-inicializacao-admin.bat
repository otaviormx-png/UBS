@echo off
echo Removendo inicializacao automatica da Busca Ativa UBS...
schtasks /Delete /TN "Busca Ativa UBS" /F
echo.
pause
