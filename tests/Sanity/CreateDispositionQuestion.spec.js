const { test, expect } = require('@playwright/test');
const { chromium } = require('playwright');
const SystemSetupPage = require('../pages/SystemSetupPage');
const LoginPage = require('../pages/LoginPage');
const FieldTestData = require('../DataProvider/FieldCreationUpdationData');
const ApiCapture = require('../utils/ApiCapture');
const BaseURL = require('../utils/BaseURL');

test.describe.serial('Disposition Question Setup Tests', () => {
  let browser, context, page, sys, apiCapture, baseUrlUtil, loginPage;

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

    // Navigate to System Setup
    await sys.NavigateToSystemSetup();
  });

  test.afterAll(async () => {
    try {
      if (apiCapture) {
        console.log('📊 API Summary: Disposition Question tests completed');
      }
    } catch (error) {
      console.error('Error in API summary:', error);
    }
    
    try {
      if (context) {
        await context.close();
        console.log('✅ Browser context closed successfully');
      }
    } catch (error) {
      console.error('Error closing context:', error);
    }

    try {
      if (browser) {
        await browser.close();
        console.log('✅ Browser closed successfully');
      }
    } catch (error) {
      console.error('Error closing browser:', error);
    }
  });

  test.describe('Disposition Question Creation and Updation', () => {
    test('Click on Disposition Question', async () => {
      await sys.clickOnDispositionQuestion();
    });

    test('Disposition Question Setup', async () => {
      console.log('\n📋 Starting Disposition Question setup with Excel data...');
      const FieldData = FieldTestData.DispositionQuestionCreationData();
      console.log('DEBUG FieldData:', FieldData);

      if (!FieldData || FieldData.length === 0) {
        console.log('⚠️ No disposition question data found in Excel. Test will complete.');
        return;
      }

      console.log(`📊 Processing ${FieldData.length} disposition question(s) from Excel data`);
      for (const data of FieldData) {
        const { category, question, questionType, parentQuestion, inputType, min, max, noOfLines, options, optionValues, allowOther, tooltip } = data;
        if (!question || question.trim() === "") {
          console.warn(`⚠️  Skipping disposition question: Question is missing or empty.`);
          continue;
        }
        console.log(`\n📄 Running disposition question creation test for: ${question}`);
        await sys.setupDispositionQuestion(category, question, questionType, parentQuestion, inputType, min, max, noOfLines, options, optionValues, allowOther, tooltip);
        console.log(`✅ Disposition question creation test completed for: ${question}`);
      }
    });

    test('Click on Disposition Question for Update', async () => {
      console.log('\n🔍 Navigating back to Disposition Question for update...');
      await sys.NavigateToSystemSetup();
      await sys.clickOnDispositionQuestion();
      console.log('✅ Disposition Question navigation for update completed');
    });

    test('Disposition Question Update', async () => {
      console.log('\n📋 Starting Disposition Question update with Excel data...');
      const UpdateData = FieldTestData.DispositionQuestionUpdationData();

      if (!UpdateData || UpdateData.length === 0) {
        console.log('⚠️ No disposition question update data found in Excel. Test will complete.');
        return;
      }

      for (const data of UpdateData) {
        const { category, question, newCategory, newQuestion, questionType, parentQuestion, inputType, min, max, noOfLines, options, optionValues, allowOther, tooltip } = data;
        console.log(`\n📄 Running disposition question update test for: ${question}`);

        if (!newCategory && !newQuestion) {
          console.log(`⚠️ Skipping update for ${question}: New category or new question is undefined/empty.`);
          console.log(`✅ Disposition question update completed for: ${question}`);
          continue;
        }

        // For now, we'll use the same setup method since there's no specific update method
        // This can be enhanced when update functionality is available
        await sys.setupDispositionQuestion(newCategory || category, newQuestion || question, questionType, parentQuestion, inputType, min, max, noOfLines, options, optionValues, allowOther, tooltip);
        console.log(`✅ Disposition question update completed for: ${question}`);
      }
    });
  });
});
