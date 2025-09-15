/**
 * SanityAgent Test Configuration
 * Centralized configuration for all SanityAgent tests
 * This ensures consistent environment settings across all SanityAgent test files
 */

class SanityAgentConfig {
  constructor() {
    // Default SanityAgent environment - change this to switch all SanityAgent tests to different environment
    this.defaultEnvironment = 'qc6'; // Options: 'qc2', 'qc6', 'uat361', etc.
    
    // Test configuration - Optimized for agent testing
    this.testTimeout = 300000; // 5 minutes for agent operations
    this.headless = false; // Set to true for headless execution
    
    // Browser configuration - Optimized for agent interactions
    this.browserOptions = {
      headless: this.headless,
      args: [
        '--start-maximized',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-extensions'
      ]
    };
    
    // Page configuration
    this.pageOptions = {
      viewport: null,
      javaScriptEnabled: true,
      actionTimeout: 15000, // Longer timeout for agent operations
      navigationTimeout: 20000
    };

    // Agent-specific configuration
    this.agentConfig = {
      loginTimeout: 30000,
      callTimeout: 60000,
      wioTimeout: 15000,
      dialerTimeout: 45000
    };
  }

  /**
   * Get the environment URL using BaseURL utility
   * @param {Object} baseUrlUtil - BaseURL utility instance
   * @returns {Promise<void>}
   */
  async navigateToEnvironment(baseUrlUtil) {
    console.log(`🌐 SanityAgent Config: Navigating to ${this.defaultEnvironment.toUpperCase()} environment`);
    
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
        console.warn(`⚠️ Unknown environment: ${this.defaultEnvironment}, defaulting to qc6`);
        await baseUrlUtil.qc6();
    }
    
    console.log(`✅ SanityAgent Config: Successfully navigated to ${this.defaultEnvironment.toUpperCase()}`);
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
   * Get agent-specific timeouts
   * @returns {Object}
   */
  getAgentConfig() {
    return this.agentConfig;
  }

  /**
   * Get login timeout
   * @returns {number}
   */
  getLoginTimeout() {
    return this.agentConfig.loginTimeout;
  }

  /**
   * Get call timeout
   * @returns {number}
   */
  getCallTimeout() {
    return this.agentConfig.callTimeout;
  }

  /**
   * Get WIO timeout
   * @returns {number}
   */
  getWIOTimeout() {
    return this.agentConfig.wioTimeout;
  }

  /**
   * Get dialer timeout
   * @returns {number}
   */
  getDialerTimeout() {
    return this.agentConfig.dialerTimeout;
  }

  /**
   * Set environment (useful for dynamic environment switching)
   * @param {string} env - Environment name
   */
  setEnvironment(env) {
    console.log(`🔄 SanityAgent Config: Switching environment from ${this.defaultEnvironment} to ${env}`);
    this.defaultEnvironment = env;
  }

  /**
   * Log current configuration
   */
  logConfig() {
    console.log('\n📋 SanityAgent Configuration:');
    console.log(`   Environment: ${this.defaultEnvironment.toUpperCase()}`);
    console.log(`   Headless: ${this.headless}`);
    console.log(`   Test Timeout: ${this.testTimeout / 1000}s`);
    console.log(`   Login Timeout: ${this.agentConfig.loginTimeout / 1000}s`);
    console.log(`   Call Timeout: ${this.agentConfig.callTimeout / 1000}s`);
    console.log(`   WIO Timeout: ${this.agentConfig.wioTimeout / 1000}s`);
    console.log(`   Dialer Timeout: ${this.agentConfig.dialerTimeout / 1000}s`);
    console.log(`   Browser Args: ${this.browserOptions.args.join(', ')}`);
    console.log('');
  }
}

// Export singleton instance
module.exports = new SanityAgentConfig();
