const { chromium } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const BaseURL = require('../../utils/BaseURL');
const ApiCapture = require('../../utils/ApiCapture');
const SanityAgentConfig = require('../config/SanityAgentConfig');

/**
 * SanityAgent Test Setup Utility
 * Provides centralized setup and teardown for SanityAgent tests
 * Uses SanityAgentConfig for consistent environment settings
 */
class SanityAgentTestSetup {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.loginPage = null;
    this.baseUrlUtil = null;
    this.apiCapture = null;
    this.config = SanityAgentConfig;
  }

  /**
   * Complete setup: browser, page, login, and navigation
   * @param {Object} credentials - Login credentials (optional)
   * @returns {Object} - Object containing page, loginPage, baseUrlUtil, apiCapture instances
   */
  async completeSetup(credentials = null) {
    try {
      console.log('\n🚀 SanityAgent Test Setup: Starting complete setup...');
      
      // Log configuration
      this.config.logConfig();
      
      // Setup browser and page
      await this.setupBrowser();
      
      // Setup utilities
      await this.setupUtilities();
      
      // Navigate to environment
      await this.navigateToEnvironment();
      
      // Login with agent credentials
      await this.loginAsAgent(credentials);
      
      console.log('✅ SanityAgent Test Setup: Complete setup finished successfully\n');
      
      return {
        page: this.page,
        loginPage: this.loginPage,
        baseUrlUtil: this.baseUrlUtil,
        apiCapture: this.apiCapture,
        browser: this.browser,
        context: this.context
      };
    } catch (error) {
      console.error('❌ SanityAgent Test Setup: Error during complete setup:', error);
      await this.cleanup();
      throw error;
    }
  }

  /**
   * Setup browser and page
   */
  async setupBrowser() {
    try {
      console.log('🌐 SanityAgent Setup: Launching browser...');
      
      // Launch browser with config options
      this.browser = await chromium.launch(this.config.getBrowserOptions());
      
      // Create context
      this.context = await this.browser.newContext(this.config.getPageOptions());
      
      // Create page
      this.page = await this.context.newPage();
      
      console.log('✅ SanityAgent Setup: Browser launched successfully');
    } catch (error) {
      console.error('❌ SanityAgent Setup: Error launching browser:', error);
      throw error;
    }
  }

  /**
   * Setup utilities (LoginPage, BaseURL, ApiCapture)
   */
  async setupUtilities() {
    try {
      console.log('🔧 SanityAgent Setup: Initializing utilities...');
      
      // Initialize utilities
      this.loginPage = new LoginPage(this.page);
      this.baseUrlUtil = new BaseURL(this.page);
      this.apiCapture = new ApiCapture(this.page);
      
      console.log('✅ SanityAgent Setup: Utilities initialized');
    } catch (error) {
      console.error('❌ SanityAgent Setup: Error initializing utilities:', error);
      throw error;
    }
  }

  /**
   * Navigate to configured environment
   */
  async navigateToEnvironment() {
    try {
      console.log(`🌐 SanityAgent Setup: Navigating to ${this.config.getEnvironment().toUpperCase()}...`);
      
      await this.config.navigateToEnvironment(this.baseUrlUtil);
      
      console.log('✅ SanityAgent Setup: Environment navigation completed');
    } catch (error) {
      console.error('❌ SanityAgent Setup: Error navigating to environment:', error);
      throw error;
    }
  }

  /**
   * Login as agent with default or provided credentials
   * @param {Object} credentials - Login credentials
   */
  async loginAsAgent(credentials = null) {
    try {
      console.log('🔐 SanityAgent Setup: Logging in as agent...');
      
      // Default agent credentials
      const defaultCredentials = {
        email: 'jaycaller@tekege.com',
        password: '@Tekege321'
      };
      
      const loginCreds = credentials || defaultCredentials;
      
      // Navigate to login page and login
      await this.loginPage.navigateToLoginPage();
      await this.loginPage.login(loginCreds.email, loginCreds.password);
      
      // Wait for page to load after login
      await this.page.waitForLoadState('networkidle', { timeout: this.config.getLoginTimeout() });
      
      console.log(`✅ SanityAgent Setup: Successfully logged in as ${loginCreds.email}`);
    } catch (error) {
      console.error('❌ SanityAgent Setup: Error during login:', error);
      throw error;
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup() {
    try {
      console.log('\n🧹 SanityAgent Setup: Starting cleanup...');
      
      if (this.page && !this.page.isClosed()) {
        await this.page.close();
        console.log('✅ SanityAgent Setup: Page closed');
      }
      
      if (this.context) {
        await this.context.close();
        console.log('✅ SanityAgent Setup: Context closed');
      }
      
      if (this.browser) {
        await this.browser.close();
        console.log('✅ SanityAgent Setup: Browser closed');
      }
      
      console.log('✅ SanityAgent Setup: Cleanup completed\n');
    } catch (error) {
      console.error('❌ SanityAgent Setup: Error during cleanup:', error);
    }
  }

  /**
   * Get page instance
   * @returns {Page}
   */
  getPage() {
    return this.page;
  }

  /**
   * Get login page instance
   * @returns {LoginPage}
   */
  getLoginPage() {
    return this.loginPage;
  }

  /**
   * Get base URL utility instance
   * @returns {BaseURL}
   */
  getBaseUrlUtil() {
    return this.baseUrlUtil;
  }

  /**
   * Get API capture instance
   * @returns {ApiCapture}
   */
  getApiCapture() {
    return this.apiCapture;
  }

  /**
   * Get configuration instance
   * @returns {SanityAgentConfig}
   */
  getConfig() {
    return this.config;
  }
}

module.exports = SanityAgentTestSetup;
