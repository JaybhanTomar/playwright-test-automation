/**
 * IRC Test Configuration
 * Centralized configuration for all IRC tests
 * This ensures consistent environment settings across all IRC test files
 */

class IRCConfig {
  constructor() {
    // Default IRC environment - change this to switch all IRC tests to different environment
    this.defaultEnvironment = 'qc2'; // Options: 'qc2', 'qc6', 'uat361', etc.
    
    // Test configuration
    this.testTimeout = 600000; // 10 minutes for data processing
    this.headless = false; // Set to true for headless execution
    
    // Browser configuration
    this.browserOptions = {
      headless: this.headless,
      args: [
        '--start-maximized',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    };
    
    // Page configuration
    this.pageOptions = {
      viewport: null,
      javaScriptEnabled: true,
      actionTimeout: 10000,
      navigationTimeout: 15000
    };
  }

  /**
   * Get the environment URL using BaseURL utility
   * @param {Object} baseUrlUtil - BaseURL utility instance
   * @returns {Promise<void>}
   */
  async navigateToEnvironment(baseUrlUtil) {
    console.log(`🌐 IRC Config: Navigating to ${this.defaultEnvironment.toUpperCase()} environment`);
    
    switch (this.defaultEnvironment.toLowerCase()) {
      case 'qc2':
        await baseUrlUtil.qc2();
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
    
    console.log(`✅ IRC Config: Successfully navigated to ${this.defaultEnvironment.toUpperCase()}`);
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
   * Set environment (useful for dynamic environment switching)
   * @param {string} env - Environment name
   */
  setEnvironment(env) {
    console.log(`🔄 IRC Config: Switching environment from ${this.defaultEnvironment} to ${env}`);
    this.defaultEnvironment = env;
  }

  /**
   * Log current configuration
   */
  logConfig() {
    console.log('\n📋 IRC Configuration:');
    console.log(`   Environment: ${this.defaultEnvironment.toUpperCase()}`);
    console.log(`   Headless: ${this.headless}`);
    console.log(`   Timeout: ${this.testTimeout / 1000}s`);
    console.log(`   Browser Args: ${this.browserOptions.args.join(', ')}`);
    console.log('');
  }
}

// Export singleton instance
module.exports = new IRCConfig();
