@echo off
setlocal enabledelayedexpansion

REM Test Runner Script for Playwright Demo (Windows)
REM Provides convenient commands to run different test suites with various options

set "SUITE="
set "ALLURE=false"
set "HEADED=false"
set "UI=false"
set "CLEAN=false"
set "HELP=false"

REM Parse command line arguments
:parse_args
if "%~1"=="" goto :check_args
if /i "%~1"=="-h" set "HELP=true" & shift & goto :parse_args
if /i "%~1"=="--help" set "HELP=true" & shift & goto :parse_args
if /i "%~1"=="-a" set "ALLURE=true" & shift & goto :parse_args
if /i "%~1"=="--allure" set "ALLURE=true" & shift & goto :parse_args
if /i "%~1"=="-H" set "HEADED=true" & shift & goto :parse_args
if /i "%~1"=="--headed" set "HEADED=true" & shift & goto :parse_args
if /i "%~1"=="-u" set "UI=true" & shift & goto :parse_args
if /i "%~1"=="--ui" set "UI=true" & shift & goto :parse_args
if /i "%~1"=="-c" set "CLEAN=true" & shift & goto :parse_args
if /i "%~1"=="--clean" set "CLEAN=true" & shift & goto :parse_args
if /i "%~1"=="rbl" set "SUITE=rbl" & shift & goto :parse_args
if /i "%~1"=="sanity" set "SUITE=sanity" & shift & goto :parse_args
if /i "%~1"=="irc" set "SUITE=irc" & shift & goto :parse_args
if /i "%~1"=="campaign" set "SUITE=campaign" & shift & goto :parse_args
if /i "%~1"=="contacts" set "SUITE=contacts" & shift & goto :parse_args
if /i "%~1"=="all" set "SUITE=all" & shift & goto :parse_args

echo [ERROR] Unknown option: %~1
goto :show_help

:check_args
if "%HELP%"=="true" goto :show_help
if "%SUITE%"=="" goto :show_help

REM Validate conflicting options
if "%HEADED%"=="true" if "%UI%"=="true" (
    echo [ERROR] Cannot use both --headed and --ui options together
    exit /b 1
)

goto :run_tests

:show_help
echo Playwright Test Runner (Windows)
echo.
echo Usage: %~nx0 [OPTIONS] ^<test-suite^>
echo.
echo Test Suites:
echo   rbl         - Run RBL tests
echo   sanity      - Run Sanity tests
echo   irc         - Run IRC tests
echo   campaign    - Run Campaign tests
echo   contacts    - Run Contact tests
echo   all         - Run all tests
echo.
echo Options:
echo   -h, --help      Show this help message
echo   -a, --allure    Generate Allure reports
echo   -H, --headed    Run in headed mode (visible browser)
echo   -u, --ui        Run with Playwright UI mode
echo   -c, --clean     Clean previous results before running
echo.
echo Examples:
echo   %~nx0 rbl                    # Run RBL tests normally
echo   %~nx0 rbl --headed           # Run RBL tests with visible browser
echo   %~nx0 rbl --allure           # Run RBL tests with Allure reporting
echo   %~nx0 sanity --ui            # Run Sanity tests with UI mode
echo   %~nx0 all --allure --clean   # Run all tests with Allure, clean previous results
echo.
exit /b 0

:run_tests
echo [INFO] Starting test execution...
echo [INFO] Suite: %SUITE%
echo [INFO] Allure: %ALLURE%
echo [INFO] Headed: %HEADED%
echo [INFO] UI: %UI%
echo [INFO] Clean: %CLEAN%
echo.

set "COMMAND="

REM Determine the command to run
if "%SUITE%"=="rbl" (
    if "%ALLURE%"=="true" (
        set "COMMAND=npm run test:allure:rbl"
    ) else if "%HEADED%"=="true" (
        set "COMMAND=npm run rbl:headed"
    ) else if "%UI%"=="true" (
        set "COMMAND=npm run rbl:ui"
    ) else (
        set "COMMAND=npm run rbl"
    )
) else if "%SUITE%"=="sanity" (
    if "%ALLURE%"=="true" (
        set "COMMAND=npm run test:allure:sanity"
    ) else if "%HEADED%"=="true" (
        set "COMMAND=npm run sanity:headed"
    ) else if "%UI%"=="true" (
        set "COMMAND=npm run sanity:ui"
    ) else (
        set "COMMAND=npm run sanity"
    )
) else if "%SUITE%"=="irc" (
    if "%ALLURE%"=="true" (
        set "COMMAND=npm run test:allure:irc"
    ) else if "%HEADED%"=="true" (
        set "COMMAND=npm run irc:headed"
    ) else if "%UI%"=="true" (
        set "COMMAND=npm run irc:ui"
    ) else (
        set "COMMAND=npm run irc"
    )
) else if "%SUITE%"=="campaign" (
    if "%ALLURE%"=="true" (
        set "COMMAND=npm run test:allure:campaign"
    ) else if "%HEADED%"=="true" (
        set "COMMAND=npm run campaign:headed"
    ) else if "%UI%"=="true" (
        set "COMMAND=npm run campaign:ui"
    ) else (
        set "COMMAND=npm run campaign"
    )
) else if "%SUITE%"=="contacts" (
    if "%ALLURE%"=="true" (
        set "COMMAND=npm run test:allure:contacts"
    ) else (
        set "COMMAND=npm run contacts"
    )
) else if "%SUITE%"=="all" (
    if "%ALLURE%"=="true" (
        set "COMMAND=npm run test:allure"
    ) else if "%HEADED%"=="true" (
        set "COMMAND=npm run test:headed"
    ) else if "%UI%"=="true" (
        set "COMMAND=npm run test:ui"
    ) else (
        set "COMMAND=npm run test"
    )
) else (
    echo [ERROR] Unknown test suite: %SUITE%
    goto :show_help
)

REM Clean previous results if requested
if "%CLEAN%"=="true" if "%ALLURE%"=="true" (
    echo [INFO] Cleaning previous Allure results...
    call npm run allure:clean
)

REM Execute the command
echo [INFO] Executing: !COMMAND!
call !COMMAND!

if !errorlevel! equ 0 (
    echo [INFO] Tests completed successfully!
    
    REM Open Allure report if generated
    if "%ALLURE%"=="true" (
        echo [INFO] Opening Allure report...
        call npm run allure:serve
    )
) else (
    echo [ERROR] Tests failed!
    
    REM Still try to open Allure report if it was generated
    if "%ALLURE%"=="true" (
        echo [WARN] Opening Allure report for failed tests...
        call npm run allure:serve
    )
    exit /b 1
)

exit /b 0
