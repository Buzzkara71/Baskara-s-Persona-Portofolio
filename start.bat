@echo off
cd /d "%~dp0"
set PORT=5500

where py >nul 2>nul
if %errorlevel%==0 (
  echo Serving on http://localhost:%PORT% - close this window to stop.
  start "" cmd /c "timeout /t 2 >nul & start http://localhost:%PORT%"
  py -m http.server %PORT%
  goto :eof
)

where npx >nul 2>nul
if %errorlevel%==0 (
  echo Serving on http://localhost:%PORT% - close this window to stop.
  start "" cmd /c "timeout /t 4 >nul & start http://localhost:%PORT%"
  npx --yes serve -l %PORT% .
  goto :eof
)

echo Python or Node.js not found. Opening index.html directly...
start "" "%~dp0index.html"
