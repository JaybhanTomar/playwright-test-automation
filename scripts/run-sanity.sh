#!/bin/bash

# Sanity Test Runner Script
# Specialized script for running Sanity tests with various options

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
    echo -e "${CYAN}Sanity Test Runner${NC}"
    echo ""
    echo "Usage: $0 [OPTIONS] [TEST_PATTERN]"
    echo ""
    echo -e "${YELLOW}Test Patterns:${NC}"
    echo "  all             - Run all Sanity tests (default)"
    echo "  setup           - Run setup tests only (setup*.spec.js)"
    echo "  users           - Run user creation tests"
    echo "  skills          - Run skill setup tests"
    echo "  fields          - Run field setup tests"
    echo "  leads           - Run lead field tests"
    echo "  lead-process    - Run lead process field tests"
    echo "  campaigns       - Run campaign tests"
    echo "  tabbing         - Run tabbing tests"
    echo "  tickets         - Run ticket field tests"
    echo "  disposition     - Run disposition tests"
    echo "  documents       - Run document tests"
    echo "  contacts        - Run contact tests"
    echo "  jd-templates    - Run JD template tests"
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
    echo "  $0                        # Run all Sanity tests"
    echo "  $0 setup --headed         # Run setup tests with visible browser"
    echo "  $0 users --allure         # Run user tests with Allure reporting"
    echo "  $0 all --env qc6          # Run all tests on QC6 environment"
    echo "  $0 leads --ui             # Run lead tests with UI mode"
    echo ""
}

# Function to set environment
set_environment() {
    local env="$1"
    local config_file="$PROJECT_ROOT/tests/Sanity/config/SanityConfig.js"
    
    if [ ! -f "$config_file" ]; then
        error "Sanity config file not found: $config_file"
        return 1
    fi
    
    log "Setting Sanity environment to: $env"
    
    # Create backup
    cp "$config_file" "$config_file.backup"
    
    # Update environment in config file
    sed -i "s/this\.defaultEnvironment = '[^']*'/this.defaultEnvironment = '$env'/" "$config_file"
    
    info "Environment updated in Sanity config. Backup saved as SanityConfig.js.backup"
}

# Function to restore environment
restore_environment() {
    local config_file="$PROJECT_ROOT/tests/Sanity/config/SanityConfig.js"
    local backup_file="$config_file.backup"
    
    if [ -f "$backup_file" ]; then
        log "Restoring original Sanity environment configuration..."
        mv "$backup_file" "$config_file"
    fi
}

# Function to run Sanity tests
run_sanity_tests() {
    local pattern="$1"
    local command=""
    local test_path=""
    
    cd "$PROJECT_ROOT"
    
    # Determine test path based on pattern
    case "$pattern" in
        "all"|"")
            test_path="tests/Sanity"
            ;;
        "setup")
            test_path="tests/Sanity/setup*.spec.js"
            ;;
        "users")
            test_path="tests/Sanity/UsersCreationUpdation.spec.js"
            ;;
        "skills")
            test_path="tests/Sanity/setupSkill.spec.js"
            ;;
        "fields")
            test_path="tests/Sanity/setupField.spec.js"
            ;;
        "leads")
            test_path="tests/Sanity/setupLeadFieldCreation.spec.js"
            ;;
        "lead-process")
            test_path="tests/Sanity/setupLeadProcessField.spec.js"
            ;;
        "campaigns")
            test_path="tests/Sanity/setupCampaignCreation.spec.js"
            ;;
        "tabbing")
            test_path="tests/Sanity/Tabbing.spec.js"
            ;;
        "tickets")
            test_path="tests/Sanity/*Ticket*.spec.js"
            ;;
        "disposition")
            test_path="tests/Sanity/*Disposition*.spec.js"
            ;;
        "documents")
            test_path="tests/Sanity/setupDocument.spec.js"
            ;;
        "contacts")
            test_path="tests/Sanity/WIO_AddUpdateContact.spec.js"
            ;;
        "jd-templates")
            test_path="tests/Sanity/JDTemplates.spec.js"
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
    
    log "Running Sanity tests with pattern: $pattern"
    log "Test path: $test_path"
    log "Command: $command"
    
    # Execute the command
    if eval "$command"; then
        log "✅ Sanity tests completed successfully!"
        
        # Generate and open Allure report if requested
        if [ "$ALLURE" = true ]; then
            info "Generating Allure report..."
            npm run allure:generate
            info "Opening Allure report..."
            npm run allure:serve
        fi
        
        return 0
    else
        error "❌ Sanity tests failed!"
        
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
        all|setup|users|skills|fields|leads|lead-process|campaigns|tabbing|tickets|disposition|documents|contacts|jd-templates)
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
log "Starting Sanity test execution..."
log "Pattern: $TEST_PATTERN"
log "Allure: $ALLURE"
log "Headed: $HEADED"
log "UI: $UI"
log "Clean: $CLEAN"
if [ -n "$ENVIRONMENT" ]; then
    log "Environment: $ENVIRONMENT"
fi
echo ""

run_sanity_tests "$TEST_PATTERN"
