const { test, chromium } = require('@playwright/test');
const SystemSetupPage = require('../pages/SystemSetupPage.js');
const LoginPage = require('../pages/LoginPage.js');
const BaseURL = require('../utils/BaseURL.js');
const ApiCapture = require('../utils/ApiCapture.js');
const FieldTestData = require('../DataProvider/FieldCreationUpdationData');



test.describe('Field Setup Tests', () => {
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

    // Use BaseURL utility to navigate to qc6 environment
    await baseUrlUtil.i361();

    // Use loginTestData for credentials
    const loginTestData = require('../DataProvider/UserCreationUpdationData.js').userLoginData();
    const { email, password, role } = loginTestData[0];
    await loginPage.login(email, password, role);

    // Navigate to System Setup and Fields
    await sys.NavigateToSystemSetup();
    await sys.clickOnFields();
  });

  test('CreateFieldTest', async () => {
    const FieldData = FieldTestData.FieldCreationData();
    console.log('DEBUG FieldData:', FieldData);

    // Check if there's any data to process
    if (!FieldData || FieldData.length === 0) {
      console.log('⚠️ No field data found in Excel. Test will complete.');
      return;
    }

    console.log(`📊 Processing ${FieldData.length} field(s) from Excel data`);
    for (const data of FieldData) {
      const {
        Category, Level, DisplayName, FieldName, Type, InputType, Min, Max, NoOfLines, Options, OptionValues, AllowOther, Tooltip
      } = data;
      if (!FieldName || FieldName.trim() === "") {
        console.warn(`⚠️  Skipping field: FieldName is missing or empty.`);
        continue;
      }
      console.log(`\n📄 Running field creation test for: ${FieldName}`);
      console.log('Attempting to create/check field with FieldName:', FieldName);
      await sys.setupFields(
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
      console.log(`✅ Field creation test completed for: ${FieldName}`);
    }
  });

  test.skip('UpdateFieldTest', async () => {
    const FieldData = FieldTestData.FieldUpdationData();
    for (const data of FieldData) {
      const { fieldName, category, level, displayName, type, inputType, min, max, noOfLines, options, optionValues, allowOther, tooltip } = data;
      console.log(`\n📄 Running field update test for: ${fieldName}`);
      await sys.verifyFieldUpdation(
        category,
        level,
        displayName,
        fieldName,
        type,
        inputType,
        min,
        max,
        noOfLines,
        options,
        optionValues,
        allowOther,
        tooltip
      );
      console.log(`✅ Field update completed for: ${fieldName}`);
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
