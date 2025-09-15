#!/bin/bash

# Playwright Test Monitor Script
# This script helps prevent random shutdowns and monitors test execution

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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

# Function to check system resources
check_resources() {
    log "Checking system resources..."
    
    # Check memory usage
    MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
    if (( $(echo "$MEMORY_USAGE > 80" | bc -l) )); then
        warn "High memory usage: ${MEMORY_USAGE}%"
    else
        log "Memory usage: ${MEMORY_USAGE}%"
    fi
    
    # Check disk space
    DISK_USAGE=$(df -h . | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$DISK_USAGE" -gt 90 ]; then
        warn "High disk usage: ${DISK_USAGE}%"
    else
        log "Disk usage: ${DISK_USAGE}%"
    fi
    
    # Check for zombie processes
    ZOMBIE_COUNT=$(ps aux | awk '$8 ~ /^Z/ { count++ } END { print count+0 }')
    if [ "$ZOMBIE_COUNT" -gt 0 ]; then
        warn "Found $ZOMBIE_COUNT zombie processes"
    fi
}

# Function to cleanup processes
cleanup_processes() {
    log "Cleaning up stale processes..."
    
    # Kill any hanging Chrome processes
    pkill -f "chrome.*--remote-debugging-port" 2>/dev/null || true
    
    # Kill any hanging Node processes related to Playwright
    pkill -f "node.*playwright" 2>/dev/null || true
    
    # Clean up test artifacts
    if [ -d "test-results" ]; then
        find test-results -name "*.webm" -mtime +1 -delete 2>/dev/null || true
        find test-results -name "*.png" -mtime +1 -delete 2>/dev/null || true
    fi
    
    log "Cleanup completed"
}

# Function to run tests with monitoring
run_tests_with_monitoring() {
    local test_command="$1"
    local max_retries=3
    local retry_count=0
    
    while [ $retry_count -lt $max_retries ]; do
        log "Starting test execution (attempt $((retry_count + 1))/$max_retries)"
        log "Command: $test_command"
        
        # Check resources before starting
        check_resources
        
        # Set up monitoring in background
        (
            while true; do
                sleep 30
                check_resources
            done
        ) &
        MONITOR_PID=$!
        
        # Run the actual test
        if eval "$test_command"; then
            log "Tests completed successfully"
            kill $MONITOR_PID 2>/dev/null || true
            return 0
        else
            error "Tests failed on attempt $((retry_count + 1))"
            kill $MONITOR_PID 2>/dev/null || true
            
            # Cleanup after failure
            cleanup_processes
            
            retry_count=$((retry_count + 1))
            if [ $retry_count -lt $max_retries ]; then
                warn "Retrying in 10 seconds..."
                sleep 10
            fi
        fi
    done
    
    error "All test attempts failed"
    return 1
}

# Main execution
main() {
    log "Playwright Test Monitor Started"
    
    # Initial cleanup
    cleanup_processes
    
    # Parse command line arguments
    if [ $# -eq 0 ]; then
        warn "No test command provided. Usage: $0 'npm test' or $0 'npx playwright test'"
        exit 1
    fi
    
    # Run tests with monitoring
    run_tests_with_monitoring "$*"
    
    log "Playwright Test Monitor Finished"
}

# Run main function with all arguments
main "$@"
