@echo off
cd /d "%~dp0"
echo ATENCAO: isto vai apagar pacientes, historico e rotas.
echo A base demo NAO sera recriada automaticamente.
echo.
set /p CONFIRMA=Digite ZERAR para confirmar: 
if /I not "%CONFIRMA%"=="ZERAR" (
  echo Operacao cancelada.
  pause
  exit /b 0
)
echo.
echo Tentando limpar pelo servidor aberto...
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-RestMethod -Method Post -Uri 'http://localhost:3000/api/clear-database' -ContentType 'application/json' -Body '{}'; Write-Host ('Banco limpo pelo servidor: ' + $r.routes.Count + ' rotas, ' + $r.patients.Count + ' pacientes e ' + $r.history.Count + ' historico.'); exit 0 } catch { exit 10 }"
if errorlevel 1 (
  echo Servidor nao respondeu. Limpando direto no banco local...
  node server\clear-database.js
  if errorlevel 1 (
    echo.
    echo Nao foi possivel limpar o banco.
    pause
    exit /b 1
  )
)
echo.
echo Abrindo o sistema vazio...
start "" "http://localhost:3000/?reset=%RANDOM%"
echo.
echo Pronto. Se uma aba antiga ainda estiver aberta, aperte Ctrl+F5 nela.
pause
