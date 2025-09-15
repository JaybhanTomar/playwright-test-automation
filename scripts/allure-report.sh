#!/bin/bash

# Allure Report Generator and Viewer
# This script generates comprehensive Allure reports with timestamps and detailed information

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ALLURE_RESULTS_DIR="allure-results"
ALLURE_REPORT_DIR="allure-report"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
BACKUP_DIR="allure-reports-archive"

# Function to log with timestamp
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

info() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] INFO:${NC} $1"
}

# Function to check if Allure is installed
check_allure_installation() {
    if npx allure --version &> /dev/null; then
        log "Allure commandline is available via npx"
    else
        error "Allure commandline is not available"
        error "Please ensure allure-commandline is installed: npm install --save-dev allure-commandline"
        exit 1
    fi
}

# Function to clean old results
clean_old_results() {
    if [ "$1" = "--clean" ]; then
        log "Cleaning old Allure results..."
        if [ -d "$ALLURE_RESULTS_DIR" ]; then
            rm -rf "$ALLURE_RESULTS_DIR"
            log "Cleaned $ALLURE_RESULTS_DIR"
        fi
        if [ -d "$ALLURE_REPORT_DIR" ]; then
            rm -rf "$ALLURE_REPORT_DIR"
            log "Cleaned $ALLURE_REPORT_DIR"
        fi
    fi
}

# Function to backup previous reports
backup_previous_reports() {
    if [ -d "$ALLURE_REPORT_DIR" ]; then
        log "Backing up previous report..."
        mkdir -p "$BACKUP_DIR"
        if [ -d "$BACKUP_DIR/report_$TIMESTAMP" ]; then
            rm -rf "$BACKUP_DIR/report_$TIMESTAMP"
        fi
        mv "$ALLURE_REPORT_DIR" "$BACKUP_DIR/report_$TIMESTAMP"
        log "Previous report backed up to $BACKUP_DIR/report_$TIMESTAMP"
    fi
}

# Function to run tests with Allure reporting
run_tests_with_allure() {
    local test_command="$1"
    
    log "Running tests with Allure reporting..."
    log "Command: $test_command"
    
    # Ensure allure-results directory exists
    mkdir -p "$ALLURE_RESULTS_DIR"
    
    # Add environment information to Allure
    create_environment_properties
    
    # Run the tests
    if eval "$test_command"; then
        log "Tests completed successfully"
        return 0
    else
        warn "Some tests failed, but continuing with report generation"
        return 1
    fi
}

# Function to create environment properties for Allure
create_environment_properties() {
    local env_file="$ALLURE_RESULTS_DIR/environment.properties"
    
    log "Creating environment properties..."
    
    cat > "$env_file" << EOF
# Test Environment Information
Test.Environment=${ENV:-qc2}
Test.Execution.Date=$(date '+%Y-%m-%d %H:%M:%S')
Test.Execution.Timestamp=$(date '+%Y%m%d_%H%M%S')
Browser=Chromium
Platform=$(uname -s)
Architecture=$(uname -m)
Node.Version=$(node --version)
NPM.Version=$(npm --version)
Playwright.Version=$(npm list @playwright/test --depth=0 2>/dev/null | grep @playwright/test | awk '{print $2}' || echo "Unknown")
Test.Framework=Playwright
Report.Generated.By=Allure Report Script
Base.URL=${BASE_URL:-https://qc6.devaavaz.biz/}
Test.Type=UI Automation
Headless.Mode=${HEADLESS:-true}
Workers=${WORKERS:-1}
Timeout=${TIMEOUT:-120000}
EOF
    
    log "Environment properties created: $env_file"
}

# Function to generate Allure report
generate_allure_report() {
    log "Generating Allure report..."
    
    if [ ! -d "$ALLURE_RESULTS_DIR" ] || [ -z "$(ls -A $ALLURE_RESULTS_DIR)" ]; then
        error "No Allure results found in $ALLURE_RESULTS_DIR"
        error "Please run tests first to generate results"
        exit 1
    fi
    
    # Generate the report
    npx allure generate "$ALLURE_RESULTS_DIR" --output "$ALLURE_REPORT_DIR" --clean
    
    if [ $? -eq 0 ]; then
        log "Allure report generated successfully in $ALLURE_REPORT_DIR"
        
        # Add custom CSS and branding if needed
        customize_report
        
        # Show report statistics
        show_report_statistics
    else
        error "Failed to generate Allure report"
        exit 1
    fi
}

# Function to customize the report
customize_report() {
    local custom_css="$ALLURE_REPORT_DIR/styles/custom.css"
    
    if [ -d "$ALLURE_REPORT_DIR/styles" ]; then
        log "Adding custom styling to report..."
        
        cat >> "$custom_css" << EOF
/* Custom Allure Report Styling */
.header__title {
    color: #2196F3 !important;
}

.test-result__title {
    font-weight: bold;
}

.timeline__item {
    border-left: 3px solid #4CAF50;
}

/* Add timestamp styling */
.parameter__name {
    font-weight: bold;
    color: #1976D2;
}
EOF
        
        log "Custom styling added"
    fi
}

# Function to show report statistics
show_report_statistics() {
    log "Report Statistics:"
    
    if [ -f "$ALLURE_RESULTS_DIR/history.json" ]; then
        local total_tests=$(find "$ALLURE_RESULTS_DIR" -name "*-result.json" | wc -l)
        info "Total test results: $total_tests"
    fi
    
    if [ -d "$ALLURE_REPORT_DIR" ]; then
        local report_size=$(du -sh "$ALLURE_REPORT_DIR" | cut -f1)
        info "Report size: $report_size"
        info "Report location: $(pwd)/$ALLURE_REPORT_DIR"
    fi
}

# Function to find available port
find_available_port() {
    local start_port="${1:-8080}"
    local port=$start_port

    while [ $port -lt $((start_port + 100)) ]; do
        if ! netstat -tuln 2>/dev/null | grep -q ":$port "; then
            echo $port
            return 0
        fi
        port=$((port + 1))
    done

    # Fallback to random port if no port found in range
    echo $((8080 + RANDOM % 1000))
}

# Function to serve Allure report
serve_allure_report() {
    local requested_port="${1:-8080}"

    if [ ! -d "$ALLURE_REPORT_DIR" ]; then
        error "No Allure report found. Please generate report first."
        exit 1
    fi

    # Find available port
    local available_port
    available_port=$(find_available_port "$requested_port")

    if [ "$available_port" != "$requested_port" ]; then
        log "Port $requested_port is in use, using port $available_port instead"
    fi

    log "Starting Allure report server on port $available_port..."
    log "Report will be available at: http://localhost:$available_port"
    log "Press Ctrl+C to stop the server"

    # Kill any existing Allure processes first
    log "Stopping any existing Allure servers..."
    pkill -f "allure.*serve" 2>/dev/null || true
    sleep 1

    # Start the server
    npx allure serve "$ALLURE_RESULTS_DIR" --port "$available_port" 2>/dev/null &
    local server_pid=$!

    # Wait a moment for server to start
    sleep 3

    # Check if server started successfully
    if kill -0 $server_pid 2>/dev/null; then
        log "✅ Allure server started successfully (PID: $server_pid)"
        log "🌐 Opening report in browser..."

        # Try to open in browser
        if command -v xdg-open >/dev/null 2>&1; then
            xdg-open "http://localhost:$available_port" 2>/dev/null &
        elif command -v open >/dev/null 2>&1; then
            open "http://localhost:$available_port" 2>/dev/null &
        fi

        # Wait for the server process
        wait $server_pid
    else
        error "Failed to start Allure server"
        exit 1
    fi
}

# Function to open report in browser
open_report() {
    if [ ! -d "$ALLURE_REPORT_DIR" ]; then
        error "No Allure report found. Please generate report first."
        exit 1
    fi
    
    local index_file="$ALLURE_REPORT_DIR/index.html"
    
    if [ -f "$index_file" ]; then
        log "Opening Allure report in browser..."
        
        # Try different browsers
        if command -v xdg-open &> /dev/null; then
            xdg-open "$index_file"
        elif command -v open &> /dev/null; then
            open "$index_file"
        elif command -v start &> /dev/null; then
            start "$index_file"
        else
            info "Please open the following file in your browser:"
            info "file://$(pwd)/$index_file"
        fi
    else
        error "Report index file not found: $index_file"
    fi
}

# Function to quickly serve on a different port
serve_quick() {
    local port="${1:-8081}"
    log "🚀 Quick serve on port $port..."

    # Kill any existing servers
    pkill -f "allure.*serve" 2>/dev/null || true
    sleep 1

    # Find available port starting from requested port
    local available_port
    available_port=$(find_available_port "$port")

    log "Starting server on port $available_port..."
    npx allure serve "$ALLURE_RESULTS_DIR" --port "$available_port" &

    sleep 2
    log "✅ Server started at: http://localhost:$available_port"

    # Open in browser
    if command -v xdg-open >/dev/null 2>&1; then
        xdg-open "http://localhost:$available_port" 2>/dev/null &
    fi
}

# Function to show help
show_help() {
    echo "Allure Report Generator and Viewer"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  test [TEST_COMMAND]    Run tests and generate report"
    echo "  generate              Generate report from existing results"
    echo "  serve [PORT]          Serve report on specified port (default: 8080)"
    echo "  quick [PORT]          Quick serve on different port (default: 8081)"
    echo "  open                  Open report in browser"
    echo "  clean                 Clean all reports and results"
    echo "  help                  Show this help message"
    echo ""
    echo "Options:"
    echo "  --clean               Clean old results before running"
    echo ""
    echo "Examples:"
    echo "  $0 test 'npm run test'                    # Run tests and generate report"
    echo "  $0 test 'npx playwright test --project=\"Sanity Tests\"'  # Run specific project"
    echo "  $0 generate                               # Generate report from existing results"
    echo "  $0 serve 9000                            # Serve report on port 9000"
    echo "  $0 open                                   # Open report in browser"
    echo "  $0 clean                                  # Clean all reports"
}

# Main execution
main() {
    local command="${1:-help}"
    
    case "$command" in
        "test")
            shift
            local clean_flag=""
            if [ "$1" = "--clean" ]; then
                clean_flag="$1"
                shift
            fi
            
            if [ $# -eq 0 ]; then
                error "No test command provided"
                show_help
                exit 1
            fi
            
            check_allure_installation
            clean_old_results "$clean_flag"
            backup_previous_reports
            
            if run_tests_with_allure "$*"; then
                generate_allure_report
                log "✅ Tests completed and report generated successfully"
                info "Run '$0 serve' to view the report"
            else
                generate_allure_report
                warn "⚠️ Some tests failed, but report was generated"
                info "Run '$0 serve' to view the report"
            fi
            ;;
        "generate")
            check_allure_installation
            backup_previous_reports
            generate_allure_report
            log "✅ Report generated successfully"
            info "Run '$0 serve' to view the report"
            ;;
        "serve")
            check_allure_installation
            serve_allure_report "${2:-8080}"
            ;;
        "quick")
            check_allure_installation
            serve_quick "${2:-8081}"
            ;;
        "open")
            open_report
            ;;
        "clean")
            log "Cleaning all Allure reports and results..."
            rm -rf "$ALLURE_RESULTS_DIR" "$ALLURE_REPORT_DIR" "$BACKUP_DIR"
            log "✅ Cleanup completed"
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            error "Unknown command: $command"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
