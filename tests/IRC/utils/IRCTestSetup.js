/**
 * IRC Test Setup Utility
 * Provides common setup functionality for all IRC tests
 * Ensures consistent configuration and initialization
 */

const { chromium } = require('@playwright/test');
const SystemSetupPage = require('../../pages/SystemSetupPage.js');
const LoginPage = require('../../pages/LoginPage.js');
const BaseURL = require('../../utils/BaseURL.js');
const ApiCapture = require('../../utils/ApiCapture.js');
const IRCConfig = require('../config/IRCConfig.js');

class IRCTestSetup {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.sys = null;
    this.loginPage = null;
    this.baseUrlUtil = null;
    this.apiCapture = null;
  }

  /**
   * Initialize browser and pages with IRC configuration
   * @returns {Promise<Object>} Object containing all initialized instances
   */
  async initializeBrowser() {
    // Log IRC configuration
    IRCConfig.logConfig();
    
    // Launch browser with IRC config options
    this.browser = await chromium.launch(IRCConfig.getBrowserOptions());
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    
    // Apply page options
    const pageOptions = IRCConfig.getPageOptions();
    this.page.setDefaultTimeout(pageOptions.actionTimeout);
    this.page.setDefaultNavigationTimeout(pageOptions.navigationTimeout);
    
    // Initialize page objects
    this.sys = new SystemSetupPage(this.page);
    this.loginPage = new LoginPage(this.page);
    this.baseUrlUtil = new BaseURL(this.page);
    this.apiCapture = new ApiCapture(this.page);

    // Start API monitoring
    this.apiCapture.startMonitoring();

    return {
      browser: this.browser,
      context: this.context,
      page: this.page,
      sys: this.sys,
      loginPage: this.loginPage,
      baseUrlUtil: this.baseUrlUtil,
      apiCapture: this.apiCapture
    };
  }

  /**
   * Perform login with configured environment
   * @returns {Promise<void>}
   */
  async loginToIRCEnvironment() {
    // Use IRC Config to navigate to configured environment
    await IRCConfig.navigateToEnvironment(this.baseUrlUtil);

    // Use loginTestData for credentials
    const loginTestData = require('../../DataProvider/UserCreationUpdationData.js').userLoginData();
    const { email, password, role } = loginTestData[0];
    await this.loginPage.login(email, password, role);

    console.log(`✅ IRC Setup: Successfully logged in to ${IRCConfig.getEnvironment().toUpperCase()}`);
  }

  /**
   * Navigate to System Setup
   * @returns {Promise<void>}
   */
  async navigateToSystemSetup() {
    await this.sys.NavigateToSystemSetup();
    console.log('✅ IRC Setup: Navigated to System Setup');
  }

  /**
   * Complete setup with login and system setup navigation
   * @returns {Promise<Object>} Object containing all initialized instances
   */
  async completeSetup() {
    const instances = await this.initializeBrowser();
    await this.loginToIRCEnvironment();
    await this.navigateToSystemSetup();
    return instances;
  }

  /**
   * Complete setup with login only (no system setup navigation)
   * @returns {Promise<Object>} Object containing all initialized instances
   */
  async completeSetupWithoutSystemSetup() {
    const instances = await this.initializeBrowser();
    await this.loginToIRCEnvironment();
    return instances;
  }

  /**
   * Clean up resources with enhanced error handling
   * @returns {Promise<void>}
   */
  async cleanup() {
    try {
      if (this.apiCapture) {
        this.apiCapture.logApiSummary();
        console.log(`📊 API Summary: IRC tests completed on ${IRCConfig.getEnvironment().toUpperCase()}`);
      }
    } catch (error) {
      console.error('Error in API summary:', error);
    }

    try {
      if (this.context) {
        await this.context.close();
        console.log('✅ Browser context closed successfully');
      }
    } catch (error) {
      console.error('Error closing context:', error);
    }

    try {
      if (this.browser) {
        await this.browser.close();
        console.log('✅ Browser closed successfully');
      }
    } catch (error) {
      console.error('Error closing browser:', error);
    }
  }

  /**
   * Get IRC test timeout
   * @returns {number}
   */
  static getTestTimeout() {
    return IRCConfig.getTestTimeout();
  }

  /**
   * Get current IRC environment
   * @returns {string}
   */
  static getEnvironment() {
    return IRCConfig.getEnvironment();
  }
}

module.exports = IRCTestSetup;
