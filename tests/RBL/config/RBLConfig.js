/**
 * RBL Test Configuration
 * Centralized configuration for all RBL tests
 * This ensures consistent environment settings across all RBL test files
 */

class RBLConfig {
  constructor() {
    // Default RBL environment - change this to switch all RBL tests to different environment
    this.defaultEnvironment = 'qc3'; // Options: 'qc2', 'qc6', 'uat361', etc.
    
    // Test configuration - Optimized for speed
    this.testTimeout = 120000; // 2 minutes for fast execution
    this.headless = false; // Headless for maximum speed
    
    // Browser configuration - Optimized for speed
    this.browserOptions = {
      headless: this.headless,
      args: [
        '--start-maximized',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-extensions',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection'
      ]
    };
    
    // Page configuration
    this.pageOptions = {
      viewport: null,
      javaScriptEnabled: true,
      actionTimeout: 1000,
      navigationTimeout: 30000  // 30s for reliable navigation to QC2
    };
  }

  /**
   * Get the environment URL using BaseURL utility
   * @param {Object} baseUrlUtil - BaseURL utility instance
   * @returns {Promise<void>}
   */
  async navigateToEnvironment(baseUrlUtil) {
    console.log(`🌐 RBL Config: Navigating to ${this.defaultEnvironment.toUpperCase()} environment`);
    
    switch (this.defaultEnvironment.toLowerCase()) {
      case 'qc2':
        await baseUrlUtil.qc2();
        break;
        case 'qc3':
        await baseUrlUtil.qc3();
        break;
      case 'qc6':
        await baseUrlUtil.qc6();
        break;
      case 'uat361':
        await baseUrlUtil.uat361();
        break;
      default:
        console.warn(`⚠️ Unknown environment: ${this.defaultEnvironment}, defaulting to qc2`);
        await baseUrlUtil.qc2();
    }
    
    console.log(`✅ RBL Config: Successfully navigated to ${this.defaultEnvironment.toUpperCase()}`);
  }

  /**
   * Get browser launch options
   * @returns {Object}
   */
  getBrowserOptions() {
    return this.browserOptions;
  }

  /**
   * Get page options
   * @returns {Object}
   */
  getPageOptions() {
    return this.pageOptions;
  }

  /**
   * Get test timeout
   * @returns {number}
   */
  getTestTimeout() {
    return this.testTimeout;
  }

  /**
   * Get current environment name
   * @returns {string}
   */
  getEnvironment() {
    return this.defaultEnvironment;
  }

  /**
   * Get continue on failure setting
   * @returns {boolean}
   */
  getContinueOnFailure() {
    return process.env.CONTINUE_ON_FAILURE === 'true' || true; // Default to true for better test coverage
  }

  /**
   * Get element timeout (shorter when continuing on failure)
   * @returns {number}
   */
  getElementTimeout() {
    return this.getContinueOnFailure() ? 5000 : 10000;
  }

  /**
   * Set environment (useful for dynamic environment switching)
   * @param {string} env - Environment name
   */
  setEnvironment(env) {
    console.log(`🔄 RBL Config: Switching environment from ${this.defaultEnvironment} to ${env}`);
    this.defaultEnvironment = env;
  }

  /**
   * Log current configuration
   */
  logConfig() {
    console.log('\n📋 RBL Configuration:');
    console.log(`   Environment: ${this.defaultEnvironment.toUpperCase()}`);
    console.log(`   Headless: ${this.headless}`);
    console.log(`   Timeout: ${this.testTimeout / 1000}s`);
    console.log(`   Browser Args: ${this.browserOptions.args.join(', ')}`);
    console.log('');
  }
}

// Export singleton instance
module.exports = new RBLConfig();
