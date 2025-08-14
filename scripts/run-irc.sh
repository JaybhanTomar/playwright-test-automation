#!/bin/bash

# IRC Test Runner Script
# Specialized script for running IRC tests with various options

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
TEST_PATTERN=""
ALLURE=false
HEADED=false
UI=false
CLEAN=false
HELP=false
ENVIRONMENT=""

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
    echo -e "${CYAN}IRC Test Runner${NC}"
    echo ""
    echo "Usage: $0 [OPTIONS] [TEST_PATTERN]"
    echo ""
    echo -e "${YELLOW}Test Patterns:${NC}"
    echo "  all             - Run all IRC tests (default)"
    echo ""
    echo -e "${YELLOW}Options:${NC}"
    echo "  -h, --help      Show this help message"
    echo "  -a, --allure    Generate Allure reports"
    echo "  -H, --headed    Run in headed mode (visible browser)"
    echo "  -u, --ui        Run with Playwright UI mode"
    echo "  -c, --clean     Clean previous results before running"
    echo "  -e, --env ENV   Set environment (qc2, qc6, uat361)"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  $0                        # Run all IRC tests"
    echo "  $0 all --headed           # Run IRC tests with visible browser"
    echo "  $0 all --allure           # Run IRC tests with Allure reporting"
    echo "  $0 all --env qc6          # Run IRC tests on QC6 environment"
    echo "  $0 all --ui               # Run IRC tests with UI mode"
    echo ""
}

# Function to set environment
set_environment() {
    local env="$1"
    local config_file="$PROJECT_ROOT/tests/IRC/config/IRCConfig.js"
    
    if [ ! -f "$config_file" ]; then
        error "IRC config file not found: $config_file"
        return 1
    fi
    
    log "Setting IRC environment to: $env"
    
    # Create backup
    cp "$config_file" "$config_file.backup"
    
    # Update environment in config file
    sed -i "s/this\.defaultEnvironment = '[^']*'/this.defaultEnvironment = '$env'/" "$config_file"
    
    info "Environment updated in IRC config. Backup saved as IRCConfig.js.backup"
}

# Function to restore environment
restore_environment() {
    local config_file="$PROJECT_ROOT/tests/IRC/config/IRCConfig.js"
    local backup_file="$config_file.backup"
    
    if [ -f "$backup_file" ]; then
        log "Restoring original IRC environment configuration..."
        mv "$backup_file" "$config_file"
    fi
}

# Function to run IRC tests
run_irc_tests() {
    local pattern="$1"
    local command=""
    local test_path=""
    
    cd "$PROJECT_ROOT"
    
    # Determine test path based on pattern
    case "$pattern" in
        "all"|"")
            test_path="tests/IRC"
            ;;
        *)
            error "Unknown test pattern: $pattern"
            show_help
            exit 1
            ;;
    esac
    
    # Build command
    if [ "$UI" = true ]; then
        command="npx playwright test $test_path --ui"
    elif [ "$HEADED" = true ]; then
        command="npx playwright test $test_path --headed"
    else
        command="npx playwright test $test_path"
    fi
    
    # Add Allure reporting if requested
    if [ "$ALLURE" = true ]; then
        if [ "$CLEAN" = true ]; then
            log "Cleaning previous Allure results..."
            npm run allure:clean
        fi
        command="$command --reporter=allure-playwright"
    fi
    
    log "Running IRC tests with pattern: $pattern"
    log "Test path: $test_path"
    log "Command: $command"
    
    # Execute the command
    if eval "$command"; then
        log "✅ IRC tests completed successfully!"
        
        # Generate and open Allure report if requested
        if [ "$ALLURE" = true ]; then
            info "Generating Allure report..."
            npm run allure:generate
            info "Opening Allure report..."
            npm run allure:serve
        fi
        
        return 0
    else
        error "❌ IRC tests failed!"
        
        # Still try to generate Allure report if it was requested
        if [ "$ALLURE" = true ]; then
            warn "Generating Allure report for failed tests..."
            npm run allure:generate
            npm run allure:serve
        fi
        
        return 1
    fi
}

# Cleanup function
cleanup() {
    if [ -n "$ENVIRONMENT" ]; then
        restore_environment
    fi
}

# Set trap for cleanup
trap cleanup EXIT

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
        -e|--env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        all)
            TEST_PATTERN="$1"
            shift
            ;;
        *)
            error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Show help if requested
if [ "$HELP" = true ]; then
    show_help
    exit 0
fi

# Validate conflicting options
if [ "$HEADED" = true ] && [ "$UI" = true ]; then
    error "Cannot use both --headed and --ui options together"
    exit 1
fi

# Set environment if specified
if [ -n "$ENVIRONMENT" ]; then
    set_environment "$ENVIRONMENT"
fi

# Default to all tests if no pattern specified
if [ -z "$TEST_PATTERN" ]; then
    TEST_PATTERN="all"
fi

# Run the tests
log "Starting IRC test execution..."
log "Pattern: $TEST_PATTERN"
log "Allure: $ALLURE"
log "Headed: $HEADED"
log "UI: $UI"
log "Clean: $CLEAN"
if [ -n "$ENVIRONMENT" ]; then
    log "Environment: $ENVIRONMENT"
fi
echo ""

run_irc_tests "$TEST_PATTERN"
