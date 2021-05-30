::::::::::::::::::::::::::::::::::::::::::::
:: Elevate.cmd - Version 4
:: Automatically check & get admin rights
:: see "https://stackoverflow.com/a/12264592/1016343" for description
::::::::::::::::::::::::::::::::::::::::::::
 @echo off
 CLS
 ECHO.
 ECHO =============================
 ECHO Running Admin shell
 ECHO =============================

:init
 setlocal DisableDelayedExpansion
 set cmdInvoke=1
 set winSysFolder=System32
 set "batchPath=%~0"
 for %%k in (%0) do set batchName=%%~nk
 set "vbsGetPrivileges=%temp%\OEgetPriv_%batchName%.vbs"
 setlocal EnableDelayedExpansion

:checkPrivileges
  NET FILE 1>NUL 2>NUL
  if '%errorlevel%' == '0' ( goto gotPrivileges ) else ( goto getPrivileges )

:getPrivileges
  if '%1'=='ELEV' (echo ELEV & shift /1 & goto gotPrivileges)
  ECHO.
  ECHO **************************************
  ECHO Invoking UAC for Privilege Escalation
  ECHO **************************************

  ECHO Set UAC = CreateObject^("Shell.Application"^) > "%vbsGetPrivileges%"
  ECHO args = "ELEV " >> "%vbsGetPrivileges%"
  ECHO For Each strArg in WScript.Arguments >> "%vbsGetPrivileges%"
  ECHO args = args ^& strArg ^& " "  >> "%vbsGetPrivileges%"
  ECHO Next >> "%vbsGetPrivileges%"

  if '%cmdInvoke%'=='1' goto InvokeCmd 

  ECHO UAC.ShellExecute "!batchPath!", args, "", "runas", 1 >> "%vbsGetPrivileges%"
  goto ExecElevation

:InvokeCmd
  ECHO args = "/c """ + "!batchPath!" + """ " + args >> "%vbsGetPrivileges%"
  ECHO UAC.ShellExecute "%SystemRoot%\%winSysFolder%\cmd.exe", args, "", "runas", 1 >> "%vbsGetPrivileges%"

:ExecElevation
 "%SystemRoot%\%winSysFolder%\WScript.exe" "%vbsGetPrivileges%" %*
 exit /B

:gotPrivileges
 setlocal & cd /d %~dp0
 if '%1'=='ELEV' (del "%vbsGetPrivileges%" 1>nul 2>nul  &  shift /1)

 ::::::::::::::::::::::::::::
 ::START
 ::::::::::::::::::::::::::::

@echo on

set VSHANDLER_FOLDER=C:\ProgramData\VD-i\
set VSHANDLER_NAME=VsHandler.dll
set VSHANDLER_PATH=%VSHANDLER_FOLDER%%VSHANDLER_NAME%

set "REG_ASM_PATH=%windir%\Microsoft.NET\Framework\v4.0.30319\RegAsm.exe"

REM Unregister Addon
"%REG_ASM_PATH%" /unregister "%VSHANDLER_PATH%"

REM Copy Addon
xcopy /f /y "%~dp0%VSHANDLER_NAME%" "%VSHANDLER_FOLDER%"

REM Register Addon
"%REG_ASM_PATH%" /codebase "%VSHANDLER_PATH%"

REM Add data to Registry
reg add "HKCU\SOFTWARE\VD-i\VsWbHdlr" /v "RedirSites" /t REG_MULTI_SZ /d "naver\0daum\0google" /f
reg add "HKCU\SOFTWARE\VD-i\VsWbHdlr" /v "vsclientPath" /t REG_SZ /d "%~dp0..\..\vsclient.exe" /f

pause
