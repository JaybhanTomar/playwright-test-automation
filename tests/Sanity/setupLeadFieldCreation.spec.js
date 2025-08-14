const { test, chromium } = require('@playwright/test');
const SystemSetupPage = require('../pages/SystemSetupPage.js');
const LoginPage = require('../pages/LoginPage.js');
const BaseURL = require('../utils/BaseURL.js');
const ApiCapture = require('../utils/ApiCapture.js');
const FieldTestData = require('../DataProvider/FieldCreationUpdationData');



test.describe.serial('Lead Field Setup Tests', () => {
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
    await baseUrlUtil.qc6();

    // Use loginTestData for credentials
    const loginTestData = require('../DataProvider/UserCreationUpdationData.js').userLoginData();
    const { email, password, role } = loginTestData[0];
    await loginPage.login(email, password, role);

    // Navigate to System Setup and Lead Fields
    await sys.NavigateToSystemSetup();
    await sys.clickOnLeadField();
  });

  test('CreateLeadFieldTest', async () => {
    const FieldData = FieldTestData.LeadFieldCreationData();
    console.log('DEBUG FieldData:', FieldData);

    // Check if there's any data to process
    if (!FieldData || FieldData.length === 0) {
      console.log('⚠️ No lead field data found in Excel. Test will complete.');
      return;
    }

    console.log(`📊 Processing ${FieldData.length} lead field(s) from Excel data`);
    for (const data of FieldData) {
      const {
        Category, DisplayName, FieldName, Type, InputType, Min, Max, NoOfLines, Options, OptionValues, AllowOther, Tooltip
      } = data;
      const Level = 'Lead'; // Default level for Lead Fields
      if (!FieldName || FieldName.trim() === "") {
        console.warn(`⚠️  Skipping field: FieldName is missing or empty.`);
        continue;
      }
      console.log(`\n📄 Running lead field creation test for: ${FieldName}`);
      console.log('Lead field details:', { Category, Level, DisplayName, Type, InputType, Tooltip });

      await sys.setupLeadFields(
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
      console.log(`✅ Lead field creation completed for: ${FieldName}`);
    }
  });

  test.skip('UpdateLeadFieldTest', async () => {
    const FieldData = FieldTestData.LeadFieldUpdationData();
    for (const data of FieldData) {
      const { fieldName, category, level, displayName, type, inputType, min, max, noOfLines, options, optionValues, allowOther, tooltip } = data;
      console.log(`\n📄 Running lead field update test for: ${fieldName}`);
      await sys.updateField(
        fieldName,
        category,
        level,
        displayName,
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
      console.log(`✅ Lead field update completed for: ${fieldName}`);
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
