const { test, chromium } = require('@playwright/test');
const SystemSetupPage = require('../../pages/SystemSetupPage.js');
const LoginPage = require('../../pages/LoginPage.js');
const BaseURL = require('../../utils/BaseURL.js');
const ApiCapture = require('../../utils/ApiCapture.js');
const DocumentUpdateTestData = require('../../DataProvider/DocumentUpdateTestData.js');
const loginTestData = require('../../DataProvider/UserCreationUpdationData.js').userLoginData();

test.describe.skip('Upload Web Resources Tests', () => {
  let systemSetupPage, loginPage, baseUrlUtil, browser, context, page, apiCapture;

  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    baseUrlUtil = new BaseURL(page);
    loginPage = new LoginPage(page);
    systemSetupPage = new SystemSetupPage(page);
    apiCapture = new ApiCapture(page);

    // Start API monitoring
    apiCapture.startMonitoring();

    // Use BaseURL utility to navigate to qc6 environment
    await baseUrlUtil.qc6();
    const { email, password, role } = loginTestData[0];
    await loginPage.login(email, password, role);
    await systemSetupPage.NavigateToSystemSetup();
    await systemSetupPage.NavigateToWebResources();
  });
  test('Upload Web Resources', async () => {
    const webResourcesData = DocumentUpdateTestData.WebResourcesData();
    for (const data of webResourcesData) {
      const { file } = data;
      await systemSetupPage.uploadWebResources(file);
    }
  });
});