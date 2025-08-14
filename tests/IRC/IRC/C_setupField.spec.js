const { test, chromium } = require('@playwright/test');
const SystemSetupPage = require('../../pages/SystemSetupPage.js');
const LoginPage = require('../../pages/LoginPage.js');
const BaseURL = require('../../utils/BaseURL.js');
const ApiCapture = require('../../utils/ApiCapture.js');
const FieldTestData = require('../../DataProvider/FieldCreationUpdationData.js');
console.log('DEBUG FieldTestData:', FieldTestData);

test.describe.serial('Field Setup Tests', () => {
  let browser, context, page, sys, loginPage, baseUrlUtil, apiCapture;

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
    await baseUrlUtil.qc4();
    
    // Use loginTestData for credentials
    const loginTestData = require('../../DataProvider/UserCreationUpdationData.js').userLoginData();
    const { email, password, role } = loginTestData[0];
    await loginPage.login(email, password, role);

    // Navigate to System Setup and Fields
    await sys.NavigateToSystemSetup();
    await sys.clickOnFields();
  });

  test('CreateFieldTest', async () => {
    const FieldData = FieldTestData.IRCFieldCreationData();
    console.log('DEBUG FieldData:', FieldData);
    for (let i = 0; i < FieldData.length; i++) {
      const data = FieldData[i];
      const {
        Category, Level, DisplayName, FieldName, Type, InputType, Min, Max, NoOfLines, Options, OptionValues, AllowOther, Tooltip
      } = data;
      if (!FieldName || FieldName.trim() === "") {
        console.warn(`⚠️  Skipping row ${i + 2} in Excel: FieldName is missing or empty.`);
        continue;
      }
      console.log(`\n📄 Running import test for: ${FieldName}`);
      // Debug: print the exact FieldName value before creation
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
      console.log(`✅ Import test completed for: ${FieldName}`);
    }
  });
    test.skip('UpdateFieldTest', async () => {
      const FieldData = FieldTestData.IRCFieldUpdationData();
      for (let i = 0; i < FieldData.length; i++) {
        const data = FieldData[i];
        const { fieldName, category, level, displayName, type, inputType, min, max, noOfLines, options, optionValues, allowOther, tooltip } = data;
        console.log(`\n📄 Running update test for: ${fieldName}`);
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
        console.log(`✅ Update test completed for: ${fieldName}`);
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
