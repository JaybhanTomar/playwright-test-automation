# Test Runner Scripts

This directory contains various scripts to run Playwright tests with different configurations and options.

## 📋 Available Scripts

### 1. **Main Test Runner** (`run-tests.sh` / `run-tests.bat`)
Universal test runner for all test suites with cross-platform support.

```bash
# Linux/Mac
./scripts/run-tests.sh [OPTIONS] <test-suite>

# Windows
scripts\run-tests.bat [OPTIONS] <test-suite>
```

**Test Suites:**
- `rbl` - Run RBL tests
- `sanity` - Run Sanity tests  
- `irc` - Run IRC tests
- `campaign` - Run Campaign tests
- `contacts` - Run Contact tests
- `all` - Run all tests

**Options:**
- `-h, --help` - Show help message
- `-a, --allure` - Generate Allure reports
- `-H, --headed` - Run in headed mode (visible browser)
- `-u, --ui` - Run with Playwright UI mode
- `-c, --clean` - Clean previous results before running

### 2. **RBL Test Runner** (`run-rbl.sh`)
Specialized runner for RBL tests with granular control.

```bash
./scripts/run-rbl.sh [OPTIONS] [TEST_PATTERN]
```

**Test Patterns:**
- `all` - Run all RBL tests (default)
- `setup` - Run setup tests only
- `users` - Run user creation tests
- `skills` - Run skill setup tests
- `fields` - Run field setup tests
- `leads` - Run lead field tests
- `campaigns` - Run campaign tests
- `tabbing` - Run tabbing tests
- `import` - Run import tests
- `disposition` - Run disposition question tests

**Additional Options:**
- `-e, --env ENV` - Set environment (qc2, qc6, uat361)

### 3. **Sanity Test Runner** (`run-sanity.sh`)
Specialized runner for Sanity tests with granular control.

```bash
./scripts/run-sanity.sh [OPTIONS] [TEST_PATTERN]
```

**Test Patterns:**
- `all` - Run all Sanity tests (default)
- `setup` - Run setup tests only
- `users` - Run user creation tests
- `skills` - Run skill setup tests
- `fields` - Run field setup tests
- `leads` - Run lead field tests
- `lead-process` - Run lead process field tests
- `campaigns` - Run campaign tests
- `tabbing` - Run tabbing tests
- `tickets` - Run ticket field tests
- `disposition` - Run disposition tests
- `documents` - Run document tests
- `contacts` - Run contact tests
- `jd-templates` - Run JD template tests

## 🚀 Quick Start Examples

### Basic Usage
```bash
# Run all RBL tests
./scripts/run-tests.sh rbl

# Run Sanity tests with visible browser
./scripts/run-tests.sh sanity --headed

# Run all tests with Allure reporting
./scripts/run-tests.sh all --allure
```

### Advanced RBL Usage
```bash
# Run only RBL setup tests
./scripts/run-rbl.sh setup

# Run RBL user tests on QC6 environment
./scripts/run-rbl.sh users --env qc6

# Run all RBL tests with Allure and clean previous results
./scripts/run-rbl.sh all --allure --clean
```

### Advanced Sanity Usage
```bash
# Run only Sanity lead process tests
./scripts/run-sanity.sh lead-process

# Run Sanity ticket tests with UI mode
./scripts/run-sanity.sh tickets --ui

# Run all Sanity tests with Allure reporting
./scripts/run-sanity.sh all --allure
```

## 📦 NPM Scripts

The following NPM scripts are also available in `package.json`:

### Basic Test Execution
```bash
npm run rbl              # Run RBL tests
npm run sanity           # Run Sanity tests
npm run irc              # Run IRC tests
npm run campaign         # Run Campaign tests
npm run contacts         # Run Contact tests
```

### Headed Mode (Visible Browser)
```bash
npm run rbl:headed       # Run RBL tests with visible browser
npm run sanity:headed    # Run Sanity tests with visible browser
npm run irc:headed       # Run IRC tests with visible browser
npm run campaign:headed  # Run Campaign tests with visible browser
```

### UI Mode (Playwright Test UI)
```bash
npm run rbl:ui           # Run RBL tests with Playwright UI
npm run sanity:ui        # Run Sanity tests with Playwright UI
npm run irc:ui           # Run IRC tests with Playwright UI
npm run campaign:ui      # Run Campaign tests with Playwright UI
```

### Allure Reporting
```bash
npm run test:allure:rbl      # Run RBL tests with Allure
npm run test:allure:sanity   # Run Sanity tests with Allure
npm run test:allure:irc      # Run IRC tests with Allure
npm run test:allure:campaign # Run Campaign tests with Allure
npm run test:allure:contacts # Run Contact tests with Allure
```

### Allure Report Management
```bash
npm run allure:generate  # Generate Allure report from existing results
npm run allure:serve     # Serve Allure report on localhost:8080
npm run allure:open      # Open Allure report in browser
npm run allure:clean     # Clean all reports and results
```

## 🔧 Environment Configuration

### Temporary Environment Change
Use the `--env` option with specialized runners:
```bash
./scripts/run-rbl.sh all --env qc6
./scripts/run-sanity.sh all --env uat361
```

### Permanent Environment Change
Edit the respective config files:
- **RBL**: `tests/RBL/config/RBLConfig.js`
- **Sanity**: `tests/Sanity/config/SanityConfig.js`
- **IRC**: `tests/IRC/config/IRCConfig.js`

Change the `defaultEnvironment` property:
```javascript
this.defaultEnvironment = 'qc6'; // Options: 'qc2', 'qc6', 'uat361'
```

## 📊 Allure Reporting

### Generate Reports
```bash
# Run tests with Allure reporting
./scripts/run-tests.sh rbl --allure

# Generate report from existing results
npm run allure:generate

# Serve report on localhost:8080
npm run allure:serve
```

### Clean Previous Results
```bash
# Clean and run fresh tests
./scripts/run-tests.sh rbl --allure --clean

# Just clean without running tests
npm run allure:clean
```

## 🛠️ Troubleshooting

### Common Issues

1. **Permission Denied (Linux/Mac)**
   ```bash
   chmod +x scripts/run-tests.sh
   chmod +x scripts/run-rbl.sh
   chmod +x scripts/run-sanity.sh
   ```

2. **Environment Not Switching**
   - Check if config backup files exist (`.backup` extension)
   - Manually edit config files if needed
   - Restart tests after environment change

3. **Allure Reports Not Generating**
   ```bash
   # Install Allure if not present
   npm install -g allure-commandline
   
   # Clean and regenerate
   npm run allure:clean
   npm run test:allure:rbl
   ```

### Debug Mode
Add `--headed` flag to see browser actions:
```bash
./scripts/run-tests.sh rbl --headed
```

### UI Mode for Interactive Debugging
Use `--ui` flag for interactive test debugging:
```bash
./scripts/run-tests.sh rbl --ui
```

## 📁 File Structure

```
scripts/
├── README.md              # This documentation
├── run-tests.sh           # Universal test runner (Linux/Mac)
├── run-tests.bat          # Universal test runner (Windows)
├── run-rbl.sh             # RBL-specific test runner
├── run-sanity.sh          # Sanity-specific test runner
├── allure-report.sh       # Allure reporting utilities
└── monitor-tests.sh       # Test monitoring utilities
```

## 🔗 Related Documentation

- [RBL Test Configuration](../tests/RBL/ENVIRONMENT_CONFIG.md)
- [Sanity Test Configuration](../tests/Sanity/config/ENVIRONMENT_CONFIG.md)
- [Allure Reporting Guide](../ALLURE_REPORTING_GUIDE.md)
- [Main Project README](../README.md)
