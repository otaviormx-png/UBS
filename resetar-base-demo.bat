@echo off
cd /d "%~dp0"
echo Reiniciando a base demo da Busca Ativa UBS...
echo.
echo Tentando resetar pelo servidor aberto...
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-RestMethod -Method Post -Uri 'http://localhost:3000/api/reset-demo' -ContentType 'application/json' -Body '{}'; Write-Host ('Base demo reiniciada pelo servidor: ' + $r.routes.Count + ' rotas e ' + $r.patients.Count + ' pacientes.'); exit 0 } catch { exit 10 }"
if errorlevel 1 (
  echo Servidor nao respondeu. Resetando direto no banco local...
  node server\reset-demo.js
  if errorlevel 1 (
    echo.
    echo Nao foi possivel reiniciar a base demo.
    pause
    exit /b 1
  )
)
echo.
echo Abrindo o sistema recarregado...
start "" "http://localhost:3000/?reset=%RANDOM%"
echo.
echo Pronto. Se uma aba antiga ainda estiver aberta, aperte Ctrl+F5 nela.
pause
