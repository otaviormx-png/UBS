@echo off
cd /d "%~dp0"
title Busca Ativa UBS Largo da Batalha
echo.
echo Iniciando Busca Ativa UBS Largo da Batalha...
echo.
echo Acesse neste computador:
echo   http://localhost:3000
echo.
echo Acesse em outro computador da rede usando o IP do servidor:
echo   http://192.168.200.175:3000
echo.
start "" "http://localhost:3000"
npm start
