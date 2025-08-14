const { test, chromium } = require('@playwright/test');
const AdminSideBar = require('../utils/AdminSideBar');
const SystemSetupPage = require('../pages/SystemSetupPage');
const LoginPage = require('../pages/LoginPage');
const BaseURL = require('../utils/BaseURL');
const HomePage = require('../pages/HomePage_POM');
const ApiCapture = require('../utils/ApiCapture');

test.describe.serial('Sanity - System Setup Tabbing Functionality', () => {
  let browser, context, page, bar, sys, loginPage, baseUrlUtil, home, apiCapture;

  test.beforeAll(async ({}) => {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    bar = new AdminSideBar(page);
    sys = new SystemSetupPage(page);
    loginPage = new LoginPage(page);
    home = new HomePage(page);
    baseUrlUtil = new BaseURL(page);
    
    // Initialize API capture
    apiCapture = new ApiCapture(page);
    apiCapture.startMonitoring();
    
    // Use BaseURL utility to navigate to qc6 environment
    await baseUrlUtil.qc2();
    const loginTestData = require('../DataProvider/UserCreationUpdationData').userLoginData();
    const loginData = loginTestData[0];
    await loginPage.login(loginData.email, loginData.password, loginData.role);
  });

  test('Tabbing System Setup Elements', async () => {
    await sys.tabToSystemSetupElements();
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
