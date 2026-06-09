@echo off
echo Reiniciando a base demo da Busca Ativa UBS...
echo O servidor precisa estar aberto em http://localhost:3000
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { Invoke-RestMethod -Method Post -Uri 'http://localhost:3000/api/reset-demo' -ContentType 'application/json' -Body '{}' | Out-Null; Write-Host 'Base demo reiniciada com sucesso.' } catch { Write-Host 'Nao foi possivel reiniciar. Confira se o sistema esta aberto.'; Write-Host $_.Exception.Message; exit 1 }"
echo.
pause
