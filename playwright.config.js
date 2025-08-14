// Get environment from ENV variable or default to 'qc2'
const ENV = process.env.ENV || 'qc2';
const BaseURL = require('./tests/utils/BaseURL.js');
const baseUrlUtil = new BaseURL();
const baseURL = baseUrlUtil.getEnvironmentUrl(ENV) || 'https://' + ENV + '.devaavaz.biz/';

module.exports = {
  testDir: './tests',
  timeout: 120000, // Reduce test timeout to 2 minutes
  globalSetup: require.resolve('./playwright/global-setup.js'),
  globalTeardown: require.resolve('./playwright/global-teardown.js'), // Re-enabled with smarter process targeting
  // Add retry and reporter configuration for better stability
  retries: process.env.CI ? 2 : 1,
  reporter: [
    ['html'],
    ['list'],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: false,
      environmentInfo: {
        'Test Environment': process.env.ENV || 'qc2',
        'Browser': 'Chromium',
        'OS': process.platform,
        'Node Version': process.version,
        'Timestamp': new Date().toISOString()
      }
    }]
  ],
  // Optimize for stability
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  projects: [
    {
      name: 'Contact Tests',
      testMatch: /contacts\/.*\.spec\.js/,
      use: {
        baseURL: baseURL,
        qcEnv: 'qc2', // Change this per project if needed
        headless: true,
        viewport: null,
        javaScriptEnabled: true,
        launchOptions: {
          // slowMo: 500, // Removed for speed
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
            '--disable-renderer-backgrounding'
          ]
        },
        actionTimeout: 5000, // Reduce action timeout to 5 seconds
        navigationTimeout: 8000 // Reduce navigation timeout to 8 seconds
      }
    },
    {
      name: 'Campaign Tests',
      testMatch: /campaign\/.*\.spec\.js/,
      use: {
        baseURL: baseURL,
        qcEnv: 'qc6', // Change this per project if needed
        headless: true,
        viewport: null,
        javaScriptEnabled: true,
        launchOptions: {
          // slowMo: 500, // Removed for speed
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
            '--disable-renderer-backgrounding'
          ]
        },
        actionTimeout: 5000,
        navigationTimeout: 8000
      }
    },
    {
      name: 'System Setup Tests',
      testMatch: /SystemSetup\/.*\.spec\.js$/,
      use: {
        baseURL: baseURL,
        qcEnv: 'qc2', // Change this per project if needed
        headless: true,
        viewport: null,
        javaScriptEnabled: true,
        launchOptions: {
          // slowMo: 500, // Removed for speed
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
            '--disable-renderer-backgrounding'
          ]
        },
        actionTimeout: 5000,
        navigationTimeout: 8000
      }
    },
    {
      name: 'Sanity Tests',
      testMatch: /Sanity\/.*\.spec\.js$/,
      use: {
        baseURL: baseURL,
        qcEnv: 'qc2', // Updated to use qc2
        headless: true,
        viewport: null,
        javaScriptEnabled: true,
        launchOptions: {
          // slowMo: 500, // Removed for speed
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
            '--disable-renderer-backgrounding'
          ]
        },
        actionTimeout: 5000,
        navigationTimeout: 8000
      }
    },
    {
      name: 'IRC Tests',
      testMatch: /IRC\/.*\.spec\.js$/,
      use: {
        baseURL: baseURL,
        qcEnv: 'qc2',
        headless: true,
        viewport: null,
        javaScriptEnabled: true,
        launchOptions: {
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
            '--disable-renderer-backgrounding'
          ]
        },
        actionTimeout: 5000,
        navigationTimeout: 8000
      }
    },
    {
      name: 'RBL Tests',
      testMatch: /RBL\/.*\.spec\.js$/,
      use: {
        baseURL: baseURL,
        qcEnv: 'qc2',
        headless: false, // Set to false for RBL tests to see the browser
        viewport: null,
        javaScriptEnabled: true,
        launchOptions: {
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
            '--disable-renderer-backgrounding'
          ]
        },
        actionTimeout: 10000, // Longer timeout for RBL tests
        navigationTimeout: 15000
      }
    }
  ],
  workers: 1,
};