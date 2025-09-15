#!/bin/bash

# Test Runner Script for Playwright Demo
# Provides convenient commands to run different test suites with various options

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Default values
MODE="normal"
SUITE=""
ALLURE=false
HEADED=false
UI=false
CLEAN=false
HELP=false

# Function to print colored output
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Function to show help
show_help() {
    echo -e "${CYAN}Playwright Test Runner${NC}"
    echo ""
    echo "Usage: $0 [OPTIONS] <test-suite>"
    echo ""
    echo -e "${YELLOW}Test Suites:${NC}"
    echo "  rbl         - Run RBL tests"
    echo "  sanity      - Run Sanity tests"
    echo "  irc         - Run IRC tests"
    echo "  campaign    - Run Campaign tests"
    echo "  contacts    - Run Contact tests"
    echo "  all         - Run all tests"
    echo ""
    echo -e "${YELLOW}Options:${NC}"
    echo "  -h, --help      Show this help message"
    echo "  -a, --allure    Generate Allure reports"
    echo "  -H, --headed    Run in headed mode (visible browser)"
    echo "  -u, --ui        Run with Playwright UI mode"
    echo "  -c, --clean     Clean previous results before running"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  $0 rbl                    # Run RBL tests normally"
    echo "  $0 rbl --headed           # Run RBL tests with visible browser"
    echo "  $0 rbl --allure           # Run RBL tests with Allure reporting"
    echo "  $0 sanity --ui            # Run Sanity tests with UI mode"
    echo "  $0 all --allure --clean   # Run all tests with Allure, clean previous results"
    echo ""
    echo -e "${YELLOW}Individual Test Files:${NC}"
    echo "  $0 rbl:setup              # Run RBL setup tests only"
    echo "  $0 sanity:lead            # Run Sanity lead process tests only"
    echo ""
}

# Function to run tests
run_test_suite() {
    local suite="$1"
    local command=""
    
    log "Running $suite tests..."
    
    case "$suite" in
        "rbl")
            if [ "$ALLURE" = true ]; then
                command="npm run test:allure:rbl"
            elif [ "$HEADED" = true ]; then
                command="npm run rbl:headed"
            elif [ "$UI" = true ]; then
                command="npm run rbl:ui"
            else
                command="npm run rbl"
            fi
            ;;
        "sanity")
            if [ "$ALLURE" = true ]; then
                command="npm run test:allure:sanity"
            elif [ "$HEADED" = true ]; then
                command="npm run sanity:headed"
            elif [ "$UI" = true ]; then
                command="npm run sanity:ui"
            else
                command="npm run sanity"
            fi
            ;;
        "irc")
            if [ "$ALLURE" = true ]; then
                command="npm run test:allure:irc"
            elif [ "$HEADED" = true ]; then
                command="npm run irc:headed"
            elif [ "$UI" = true ]; then
                command="npm run irc:ui"
            else
                command="npm run irc"
            fi
            ;;
        "campaign")
            if [ "$ALLURE" = true ]; then
                command="npm run test:allure:campaign"
            elif [ "$HEADED" = true ]; then
                command="npm run campaign:headed"
            elif [ "$UI" = true ]; then
                command="npm run campaign:ui"
            else
                command="npm run campaign"
            fi
            ;;
        "contacts")
            if [ "$ALLURE" = true ]; then
                command="npm run test:allure:contacts"
            else
                command="npm run contacts"
            fi
            ;;
        "all")
            if [ "$ALLURE" = true ]; then
                command="npm run test:allure"
            elif [ "$HEADED" = true ]; then
                command="npm run test:headed"
            elif [ "$UI" = true ]; then
                command="npm run test:ui"
            else
                command="npm run test"
            fi
            ;;
        *)
            error "Unknown test suite: $suite"
            show_help
            exit 1
            ;;
    esac
    
    # Clean previous results if requested
    if [ "$CLEAN" = true ] && [ "$ALLURE" = true ]; then
        log "Cleaning previous Allure results..."
        npm run allure:clean
    fi
    
    # Execute the command
    log "Executing: $command"
    cd "$PROJECT_ROOT"
    
    if eval "$command"; then
        log "✅ Tests completed successfully!"
        
        # Open Allure report if generated
        if [ "$ALLURE" = true ]; then
            info "Opening Allure report..."
            npm run allure:serve
        fi
    else
        error "❌ Tests failed!"
        
        # Still try to open Allure report if it was generated
        if [ "$ALLURE" = true ]; then
            warn "Opening Allure report for failed tests..."
            npm run allure:serve
        fi
        exit 1
    fi
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            HELP=true
            shift
            ;;
        -a|--allure)
            ALLURE=true
            shift
            ;;
        -H|--headed)
            HEADED=true
            shift
            ;;
        -u|--ui)
            UI=true
            shift
            ;;
        -c|--clean)
            CLEAN=true
            shift
            ;;
        rbl|sanity|irc|campaign|contacts|all)
            SUITE="$1"
            shift
            ;;
        *)
            error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Show help if requested or no suite specified
if [ "$HELP" = true ] || [ -z "$SUITE" ]; then
    show_help
    exit 0
fi

# Validate conflicting options
if [ "$HEADED" = true ] && [ "$UI" = true ]; then
    error "Cannot use both --headed and --ui options together"
    exit 1
fi

# Run the tests
log "Starting test execution..."
log "Suite: $SUITE"
log "Allure: $ALLURE"
log "Headed: $HEADED"
log "UI: $UI"
log "Clean: $CLEAN"
echo ""

run_test_suite "$SUITE"
