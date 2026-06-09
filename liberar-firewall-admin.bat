@echo off
echo Liberando a porta 3000 para a Busca Ativa UBS...
netsh advfirewall firewall add rule name="Busca Ativa UBS 3000" dir=in action=allow protocol=TCP localport=3000 profile=private
echo.
echo Se apareceu "Ok.", outros computadores da rede poderao acessar:
echo   http://192.168.200.175:3000
echo.
pause
