// Template for adding API capture to any test file
const { test, chromium } = require('@playwright/test');
const ApiCapture = require('./ApiCapture');

test.describe('Your Test Suite', () => {
  let browser, context, page, apiCapture;

  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    
    // Initialize API capture
    apiCapture = new ApiCapture(page);
    apiCapture.startMonitoring();
    
    // Your existing setup code here
    // await page.goto('your-url');
    // await loginPage.login();
  });

  test.beforeEach(async () => {
    // Optional: Clear API capture data between tests
    // apiCapture.clear();
  });

  test('Your Test', async () => {
    // Your test code here
    // API calls will be automatically captured and monitored
  });

  test.afterAll(async () => {
    // Log API summary
    apiCapture.logApiSummary();
    
    await page.close();
    await context.close();
    await browser.close();
  });
}); 