@echo off
chcp 65001 >nul
title DuoCrochê - Iniciando...
cd /d "%~dp0"

echo.
echo  ======================================
echo    DuoCroche - Controle de Receitas
echo  ======================================
echo.

if not exist "node_modules" (
    echo Primeira vez rodando o sistema, instalando dependencias...
    echo (isso so acontece uma vez e pode demorar alguns minutos)
    echo.
    call npm install
    echo.
)

echo Ligando o sistema, aguarde...
start "DuoCroche - Servidor (nao feche esta janela)" cmd /k "npm run dev"

timeout /t 6 /nobreak >nul

start "" "http://localhost:3000"

echo.
echo Pronto! O sistema foi aberto no navegador.
echo Para DESLIGAR o sistema, feche a janela "DuoCroche - Servidor".
echo.
timeout /t 5 >nul
exit
