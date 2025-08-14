const { test, chromium } = require('@playwright/test');
const SystemSetupPage = require('../pages/SystemSetupPage.js');
const LoginPage = require('../pages/LoginPage.js');
const BaseURL = require('../utils/BaseURL.js');
const ApiCapture = require('../utils/ApiCapture.js');
const FieldTestData = require('../DataProvider/FieldCreationUpdationData');



test.describe.serial('Ticket Field Setup Tests', () => {
  let browser, context, page, sys, loginPage, baseUrlUtil, apiCapture;

  // Set reasonable timeout - 10 minutes should be enough for all data processing
  test.setTimeout(600000); // 10 minutes

  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    sys = new SystemSetupPage(page);
    loginPage = new LoginPage(page);
    baseUrlUtil = new BaseURL(page);
    apiCapture = new ApiCapture(page);

    // Start API monitoring
    apiCapture.startMonitoring();

    // Use BaseURL utility to navigate to qc2 environment
    await baseUrlUtil.qc2();

    // Use loginTestData for credentials
    const loginTestData = require('../DataProvider/UserCreationUpdationData.js').userLoginData();
    const { email, password, role } = loginTestData[0];
    await loginPage.login(email, password, role);

    // Navigate to System Setup and Ticket Fields
    await sys.NavigateToSystemSetup();
    await sys.clickOnTicketField();
  });

  test('ClickonTicketFieldTest', async () => {
    console.log('\n🔍 Testing Ticket Field navigation...');
    await sys.clickOnTicketField();
    console.log('✅ Ticket Field navigation test completed successfully');
  });

  test('TicketFieldSetupTest', async () => {
    console.log('\n📋 Starting Ticket Field setup with Excel data...');
    const FieldData = FieldTestData.TicketFieldCreationData();
    console.log('DEBUG FieldData:', FieldData);

    // Check if there's any data to process
    if (!FieldData || FieldData.length === 0) {
      console.log('⚠️ No ticket field data found in Excel. Test will complete.');
      return;
    }

    console.log(`📊 Processing ${FieldData.length} ticket field(s) from Excel data`);
    for (const data of FieldData) {
      const {
        Category, Level, DisplayName, FieldName, Type, InputType, Min, Max, NoOfLines, Options, OptionValues, AllowOther, Tooltip
      } = data;
      if (!FieldName || FieldName.trim() === "") {
        console.warn(`⚠️  Skipping ticket field: FieldName is missing or empty.`);
        continue;
      }
      console.log(`\n📄 Running ticket field creation test for: ${FieldName}`);
      console.log('Attempting to create/check ticket field with FieldName:', FieldName);
      await sys.setupTicketField(
        Category,
        Level,
        DisplayName,
        FieldName,
        Type,
        InputType,
        Min,
        Max,
        NoOfLines,
        Options,
        OptionValues,
        AllowOther,
        Tooltip
      );
      console.log(`✅ Ticket field creation test completed for: ${FieldName}`);
    }
  });

  test.skip('UpdateTicketFieldTest', async () => {
    const FieldData = FieldTestData.TicketFieldUpdationData();
    for (const data of FieldData) {
      const { Category, FieldName, DisplayName, Type, InputType, Min, Max, NoOfLines, Options, OptionValues, AllowOther, Tooltip } = data;
      console.log(`\n📄 Running ticket field update test for: ${FieldName}`);
      await sys.updateTicketField(
        Category,
        FieldName,
        DisplayName,
        Type,
        InputType,
        Min,
        Max,
        NoOfLines,
        Options,
        OptionValues,
        AllowOther,
        Tooltip
      );
      console.log(`✅ Ticket field update completed for: ${FieldName}`);
    }
  });

  test.afterAll(async () => {
    // Log API summary
    apiCapture.logApiSummary();
    await page.close();
    await context.close();
    await browser.close();
  });
});
