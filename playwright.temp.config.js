// Temporary config without global setup for testing
const ENV = process.env.ENV || 'qc2';
const BaseURL = require('./tests/utils/BaseURL.js');
const baseUrlUtil = new BaseURL();
const baseURL = baseUrlUtil.getEnvironmentUrl(ENV) || 'https://' + ENV + '.devaavaz.biz/';

module.exports = {
  testDir: './tests',
  timeout: 120000,
  // globalSetup: require.resolve('./playwright/global-setup.js'), // Commented out for testing
  projects: [
    {
      name: 'Sanity Tests',
      testMatch: /Sanity\/.*\.spec\.js$/,
      use: {
        baseURL: baseURL,
        qcEnv: 'qc2', // Changed to qc2 for testing
        headless: false, // Set to false for headed mode
        viewport: null,
        javaScriptEnabled: true,
        launchOptions: {
          args: [
            '--start-maximized',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
          ]
        },
        actionTimeout: 10000,
        navigationTimeout: 15000
      }
    }
  ],
  workers: 1,
};
