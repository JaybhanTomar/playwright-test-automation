const { test, chromium } = require('@playwright/test');
const SystemSetupPage = require('../../pages/SystemSetupPage');
const LoginPage = require('../../pages/LoginPage');
const BaseURL = require('../../utils/BaseURL');
const HomePage = require('../../pages/HomePage_POM');
const ApiCapture = require('../../utils/ApiCapture');
const loginTestData = require('../../DataProvider/UserCreationUpdationData').userLoginData();

test.describe.serial('Sanity - System Setup Tabbing Functionality', () => {
  let browser, context, page, sys, loginPage, baseUrlUtil, home, apiCapture;

  test.beforeAll(async ({}) => {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    sys = new SystemSetupPage(page);
    loginPage = new LoginPage(page);
    home = new HomePage(page);
    baseUrlUtil = new BaseURL(page);
    
    // Initialize API capture
    apiCapture = new ApiCapture(page);
    apiCapture.startMonitoring();
    
    // Use BaseURL utility to navigate to qc6 environment
    await baseUrlUtil.uat361();
    const loginData = loginTestData[0];
    const { email, password, role } = loginData;
    await loginPage.login(email, password, role);
  });

  test('Tabbing System Setup Elements', async () => {
    await sys.tabToSystemSetupElements();
    // Note: tabToCustomFields method removed - no Custom Fields section in System Setup
    await home.tabToHomeElements();
    console.log("Basic navigation test completed successfully");
  });
  
  test.afterAll(async () => {
    apiCapture.logApiSummary();
    await page.close();
    await context.close();
    await browser.close();
  });
});
