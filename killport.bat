@echo off
REM Kill processes listening on one or more TCP ports.
REM Usage:
REM   killport 3000
REM   killport 3000 8080 4200
REM   killport /list (just lists listening processes)

if "%~1"=="" (
  echo Usage: %~nx0 port [port2 ...]
  echo Or:    %~nx0 /list
  exit /b 1
)

if /I "%~1"=="/list" (
  echo Listing listening ports (PID at end of each line):
  echo -----------------------------------------------
  netstat -ano | findstr /R /C:"LISTENING" | findstr /V ":[0-9][0-9]*:" 2>nul
  exit /b 0
)

setlocal enabledelayedexpansion

for %%P in (%*) do (
  set FOUND=
  echo Checking port %%P ...
  for /f "tokens=1-5" %%a in ('netstat -ano ^| findstr /R /C:":%%P[ ]" ^| findstr LISTENING') do (
    set PID=%%e
    set FOUND=1
    echo   Found PID !PID! listening on port %%P. Attempting to kill...
    taskkill /F /PID !PID! >nul 2>&1 && echo   Killed PID !PID! on port %%P. || echo   FAILED to kill PID !PID! (might need admin or already exited).
  )
  if not defined FOUND echo   No LISTENING process found on port %%P.
)

endlocal
exit /b 0
