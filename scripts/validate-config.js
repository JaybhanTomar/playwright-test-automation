#!/usr/bin/env node

/**
 * Configuration Validation Script
 * Validates all test configurations and reports any issues
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ERROR: ${message}`, 'red');
}

function warn(message) {
  log(`⚠️  WARN: ${message}`, 'yellow');
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

class ConfigValidator {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.issues = [];
    this.warnings = [];
  }

  // Validate file exists
  validateFileExists(filePath, description) {
    const fullPath = path.join(this.projectRoot, filePath);
    if (!fs.existsSync(fullPath)) {
      this.issues.push(`Missing file: ${filePath} (${description})`);
      return false;
    }
    return true;
  }

  // Validate directory exists
  validateDirectoryExists(dirPath, description) {
    const fullPath = path.join(this.projectRoot, dirPath);
    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
      this.issues.push(`Missing directory: ${dirPath} (${description})`);
      return false;
    }
    return true;
  }

  // Validate configuration file
  validateConfigFile(configPath, expectedClass) {
    if (!this.validateFileExists(configPath, `${expectedClass} configuration`)) {
      return false;
    }

    try {
      const fullPath = path.join(this.projectRoot, configPath);
      const config = require(fullPath);
      
      // Check if it has required methods
      const requiredMethods = ['getTestTimeout', 'getBrowserOptions', 'getPageOptions', 'getEnvironment'];
      for (const method of requiredMethods) {
        if (typeof config[method] !== 'function') {
          this.issues.push(`${configPath}: Missing method ${method}`);
        }
      }

      // Check environment value
      const env = config.getEnvironment();
      const validEnvs = ['qc2', 'qc6', 'uat361'];
      if (!validEnvs.includes(env)) {
        this.warnings.push(`${configPath}: Unknown environment '${env}', expected one of: ${validEnvs.join(', ')}`);
      }

      success(`Configuration valid: ${configPath}`);
      return true;
    } catch (err) {
      this.issues.push(`${configPath}: Failed to load - ${err.message}`);
      return false;
    }
  }

  // Validate test setup utility
  validateTestSetup(setupPath, configPath, expectedClass) {
    if (!this.validateFileExists(setupPath, `${expectedClass} test setup utility`)) {
      return false;
    }

    try {
      const fullPath = path.join(this.projectRoot, setupPath);
      const SetupClass = require(fullPath);
      
      // Try to instantiate
      const instance = new SetupClass();
      
      // Check if it has required methods
      const requiredMethods = ['initializeBrowser', 'completeSetup', 'cleanup'];
      for (const method of requiredMethods) {
        if (typeof instance[method] !== 'function') {
          this.issues.push(`${setupPath}: Missing method ${method}`);
        }
      }

      success(`Test setup valid: ${setupPath}`);
      return true;
    } catch (err) {
      this.issues.push(`${setupPath}: Failed to load - ${err.message}`);
      return false;
    }
  }

  // Validate test files exist
  validateTestFiles(testDir, expectedFiles) {
    if (!this.validateDirectoryExists(testDir, 'Test directory')) {
      return false;
    }

    const fullPath = path.join(this.projectRoot, testDir);
    const actualFiles = fs.readdirSync(fullPath).filter(f => f.endsWith('.spec.js'));
    
    let allFound = true;
    for (const expectedFile of expectedFiles) {
      if (!actualFiles.includes(expectedFile)) {
        this.warnings.push(`Expected test file not found: ${path.join(testDir, expectedFile)}`);
        allFound = false;
      }
    }

    if (allFound) {
      success(`All expected test files found in: ${testDir}`);
    }

    return allFound;
  }

  // Validate package.json scripts
  validatePackageScripts() {
    const packagePath = path.join(this.projectRoot, 'package.json');
    if (!fs.existsSync(packagePath)) {
      this.issues.push('Missing package.json');
      return false;
    }

    try {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      const scripts = pkg.scripts || {};

      const expectedScripts = [
        'rbl', 'sanity', 'irc', 'campaign',
        'rbl:headed', 'sanity:headed', 'irc:headed',
        'rbl:ui', 'sanity:ui', 'irc:ui',
        'test:allure:rbl', 'test:allure:sanity', 'test:allure:irc'
      ];

      let allFound = true;
      for (const script of expectedScripts) {
        if (!scripts[script]) {
          this.warnings.push(`Missing npm script: ${script}`);
          allFound = false;
        }
      }

      if (allFound) {
        success('All expected npm scripts found');
      }

      return allFound;
    } catch (err) {
      this.issues.push(`Failed to parse package.json: ${err.message}`);
      return false;
    }
  }

  // Main validation function
  async validate() {
    log('\n🔍 Starting configuration validation...\n', 'cyan');

    // Validate core directories
    info('Validating core directories...');
    this.validateDirectoryExists('tests', 'Main tests directory');
    this.validateDirectoryExists('scripts', 'Scripts directory');
    this.validateDirectoryExists('tests/pages', 'Page objects directory');
    this.validateDirectoryExists('tests/utils', 'Utilities directory');

    // Validate RBL configuration
    info('\nValidating RBL configuration...');
    this.validateDirectoryExists('tests/RBL', 'RBL tests directory');
    this.validateDirectoryExists('tests/RBL/config', 'RBL config directory');
    this.validateDirectoryExists('tests/RBL/utils', 'RBL utils directory');
    this.validateConfigFile('tests/RBL/config/RBLConfig.js', 'RBL');
    this.validateTestSetup('tests/RBL/utils/RBLTestSetup.js', 'tests/RBL/config/RBLConfig.js', 'RBL');
    
    const rblTestFiles = [
      '1_Tabbing.spec.js',
      'A_UsersCreationUpdation.spec.js',
      'B_setupCategory.spec.js',
      'C_setupSkill.spec.js',
      'D_setupField.spec.js',
      'E_setupLeadField.spec.js',
      'F_setupLeadProcessField.spec.js',
      'G_setupDispositionQuestion.spec.js',
      'H_setupDispositionScreen.spec.js',
      'I_setupImportTest.spec.js',
      'J_setupCampaignCreation.spec.js'
    ];
    this.validateTestFiles('tests/RBL/RBL', rblTestFiles);

    // Validate Sanity configuration
    info('\nValidating Sanity configuration...');
    this.validateDirectoryExists('tests/Sanity', 'Sanity tests directory');
    this.validateDirectoryExists('tests/Sanity/config', 'Sanity config directory');
    this.validateDirectoryExists('tests/Sanity/utils', 'Sanity utils directory');
    this.validateConfigFile('tests/Sanity/config/SanityConfig.js', 'Sanity');
    this.validateTestSetup('tests/Sanity/utils/SanityTestSetup.js', 'tests/Sanity/config/SanityConfig.js', 'Sanity');

    // Validate IRC configuration
    info('\nValidating IRC configuration...');
    this.validateDirectoryExists('tests/IRC', 'IRC tests directory');
    this.validateDirectoryExists('tests/IRC/config', 'IRC config directory');
    this.validateDirectoryExists('tests/IRC/utils', 'IRC utils directory');
    this.validateConfigFile('tests/IRC/config/IRCConfig.js', 'IRC');
    this.validateTestSetup('tests/IRC/utils/IRCTestSetup.js', 'tests/IRC/config/IRCConfig.js', 'IRC');

    // Validate scripts
    info('\nValidating scripts...');
    this.validateFileExists('scripts/run-tests.sh', 'Main test runner script');
    this.validateFileExists('scripts/run-rbl.sh', 'RBL test runner script');
    this.validateFileExists('scripts/run-sanity.sh', 'Sanity test runner script');
    this.validateFileExists('scripts/run-irc.sh', 'IRC test runner script');
    this.validateFileExists('scripts/allure-report.sh', 'Allure reporting script');

    // Validate package.json
    info('\nValidating package.json scripts...');
    this.validatePackageScripts();

    // Report results
    this.reportResults();
  }

  reportResults() {
    log('\n📊 Validation Results:\n', 'cyan');

    if (this.issues.length === 0 && this.warnings.length === 0) {
      success('🎉 All configurations are valid! No issues found.');
    } else {
      if (this.issues.length > 0) {
        error(`Found ${this.issues.length} critical issue(s):`);
        this.issues.forEach(issue => error(`  • ${issue}`));
      }

      if (this.warnings.length > 0) {
        warn(`\nFound ${this.warnings.length} warning(s):`);
        this.warnings.forEach(warning => warn(`  • ${warning}`));
      }

      log('\n💡 Recommendations:', 'blue');
      if (this.issues.length > 0) {
        info('  • Fix critical issues before running tests');
      }
      if (this.warnings.length > 0) {
        info('  • Review warnings for potential improvements');
      }
    }

    log('');
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new ConfigValidator();
  validator.validate().catch(err => {
    error(`Validation failed: ${err.message}`);
    process.exit(1);
  });
}

module.exports = ConfigValidator;
