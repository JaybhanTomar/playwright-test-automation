# Playwright Random Shutdown Troubleshooting Guide

## Problem Summary
Random shutdowns during Playwright test execution, often accompanied by VSCode process crashes and system instability.

## Root Causes Identified

### 1. VSCode Process Crashes
- **Symptoms**: UtilityProcess crashes with code 15 (SIGTERM)
- **Impact**: Interrupts test execution and development workflow
- **Solution**: Applied Chrome stability flags and process monitoring

### 2. Resource Exhaustion
- **Symptoms**: High memory/CPU usage, zombie processes
- **Impact**: System becomes unstable, processes get killed
- **Solution**: Optimized browser launch arguments and added cleanup scripts

### 3. Configuration Issues
- **Symptoms**: Typos in package.json, missing stability configurations
- **Impact**: Tests fail to start or crash unexpectedly
- **Solution**: Fixed typos and added comprehensive configuration

## Fixes Applied

### ✅ Fixed package.json Typo
```json
// Before: "npx laywright test tests/Sanity"
// After:  "npx playwright test tests/Sanity"
```

### ✅ Enhanced Playwright Configuration
- Added retry logic for failed tests
- Configured proper reporters
- Added stability-focused Chrome flags:
  - `--no-sandbox`
  - `--disable-dev-shm-usage`
  - `--disable-gpu`
  - `--disable-extensions`
  - `--disable-background-timer-throttling`
  - `--disable-backgrounding-occluded-windows`
  - `--disable-renderer-backgrounding`

### ✅ Created Monitoring Script
- `scripts/monitor-tests.sh` - Monitors system resources and handles cleanup
- Automatic retry logic for failed tests
- Process cleanup to prevent zombie processes

## How to Use the Fixes

### 1. Run Tests with Monitoring
```bash
# Instead of: npm run test
./scripts/monitor-tests.sh "npm run test"

# Instead of: npx playwright test
./scripts/monitor-tests.sh "npx playwright test"

# For specific test suites:
./scripts/monitor-tests.sh "npm run Sanity"
```

### 2. Manual Resource Check
```bash
# Check memory usage
free -h

# Check disk space
df -h .

# Check for zombie processes
ps aux | grep -E "(Z|<defunct>)"

# Kill hanging Chrome processes
pkill -f "chrome.*--remote-debugging-port"
```

### 3. VSCode Stability Tips
- Restart VSCode if you notice frequent crashes
- Close unnecessary browser tabs
- Disable heavy VSCode extensions temporarily during testing

## Prevention Strategies

### 1. Regular Maintenance
- Run cleanup script weekly: `./scripts/monitor-tests.sh cleanup`
- Clear old test results: `rm -rf test-results/*`
- Restart system if memory usage consistently high

### 2. Environment Optimization
- Close unnecessary applications during testing
- Ensure adequate disk space (>20% free)
- Monitor system temperature (overheating can cause crashes)

### 3. Test Execution Best Practices
- Run tests in smaller batches instead of all at once
- Use headless mode for CI/automated runs
- Avoid running multiple test suites simultaneously

## Emergency Recovery

If you experience a shutdown during testing:

1. **Immediate Steps**:
   ```bash
   # Kill any hanging processes
   pkill -f chrome
   pkill -f playwright
   
   # Clean up test artifacts
   rm -rf test-results/*
   
   # Check system resources
   free -h && df -h .
   ```

2. **Restart Testing**:
   ```bash
   # Use the monitoring script for safer execution
   ./scripts/monitor-tests.sh "npm run test"
   ```

3. **If Problems Persist**:
   - Restart VSCode
   - Reboot the system
   - Check system logs: `journalctl --since "1 hour ago" | grep -i error`

## Monitoring Commands

### Real-time Resource Monitoring
```bash
# Monitor memory usage
watch -n 2 'free -h'

# Monitor processes
watch -n 2 'ps aux | grep -E "(chrome|playwright|node)" | head -10'

# Monitor disk I/O
iostat -x 2
```

### Log Analysis
```bash
# Check recent system errors
journalctl --since "1 hour ago" --no-pager | grep -i "killed\|oom\|memory\|crash"

# Check Playwright logs
ls -la test-results/

# Check VSCode crash reports
ls -la ~/.config/Code/logs/
```

## Contact Information
If issues persist after applying these fixes, collect the following information:
- System specifications (RAM, CPU, disk space)
- Output from `./scripts/monitor-tests.sh "npm run test"`
- Recent system logs
- Specific error messages or crash reports

## Version Information
- Playwright: ^1.53.2
- Node.js: Check with `node --version`
- Chrome: Check with `google-chrome --version`
- System: Ubuntu 24.04.2 LTS
