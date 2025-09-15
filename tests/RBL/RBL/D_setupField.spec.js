const { test, chromium } = require('@playwright/test');
const SystemSetupPage = require('../../pages/SystemSetupPage.js');
const LoginPage = require('../../pages/LoginPage.js');
const BaseURL = require('../../utils/BaseURL.js');
const ApiCapture = require('../../utils/ApiCapture.js');
const RBLAdminData = require('../../DataProvider/RBLAdminData.js');
const RBLTestSetup = require('../utils/RBLTestSetup.js');
console.log('DEBUG RBL FieldTestData:', RBLAdminData);

// Uses centralized RBL configuration from tests/RBL/config/RBLConfig.js
// Uses centralized RBL configuration from tests/RBL/config/RBLConfig.js
test.describe.serial('RBL - Field Setup Tests', () => {
  let browser, context, page, sys, loginPage, baseUrlUtil, apiCapture, rblSetup;

  test.beforeAll(async () => {
    console.log('RBL Field beforeAll starting');
    rblSetup = new RBLTestSetup();
    const instances = await rblSetup.completeSetup();

    // Extract instances from RBLTestSetup
    browser = instances.browser;
    context = instances.context;
    page = instances.page;
    sys = instances.sys;
    loginPage = instances.loginPage;
    baseUrlUtil = instances.baseUrlUtil;
    apiCapture = instances.apiCapture;

    console.log('✅ RBL Field Setup: All instances initialized');

    // Navigate to System Setup and Fields
    await sys.NavigateToSystemSetup();
    await sys.clickOnFields();
    console.log('✅ RBL Field beforeAll finished');
  });

  test('RBL Create Field', async () => {
    console.log('RBL Create Field test running');
    const FieldData = RBLAdminData.FieldCreationData();
    console.log('DEBUG RBL FieldData:', FieldData);
    
    let processedCount = 0;
    let successCount = 0;
    let failedCount = 0;
    const failedFields = [];

    for (let i = 0; i < FieldData.length; i++) {
      const data = FieldData[i];
      const {
        FieldName: fieldName, Category: category, Level: level, DisplayName: displayName,
        Type: type, InputType: inputType, Min: min, Max: max,
        NoOfLines: noOfLines, Options: options, OptionValues: optionValues,
        AllowOther: allowOther, Tooltip: tooltip
      } = data;

      processedCount++;

      if (!fieldName || fieldName.trim() === "") {
        console.warn(`⚠️  Skipping RBL field: FieldName is missing or empty.`);
        continue;
      }

      try {
        await sys.setupFields(
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
        successCount++;
        console.log(`✅ [${processedCount}/25] RBL field creation test completed for: ${fieldName}`);

        // Minimal delay + memory cleanup between field creations
        await sys.page.waitForTimeout(100);

        // Periodic memory cleanup every 10 fields
        if (processedCount % 10 === 0) {
          console.log(`🧹 Performing memory cleanup after ${processedCount} fields...`);
          await sys.page.evaluate(() => {
            if (window.gc) window.gc();
          });
        }

      } catch (error) {
        failedCount++;
        failedFields.push(fieldName);
        console.log(`❌ [${processedCount}/25] RBL field creation test FAILED for: ${fieldName}`);
        console.log(`   Error: ${error.message}`);

        // Check if browser is still alive
        if (error.message.includes('Target page, context or browser has been closed')) {
          console.log(`🚨 Browser crashed! Stopping field creation process.`);
          break;
        }

        console.log(`⏭️ Continuing with next field...`);
      }
    }

    // Summary
    console.log(`\n📊 RBL Field Creation Summary:`);
    console.log(`   📋 Total Fields: ${processedCount}`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${failedCount}`);
    if (failedFields.length > 0) {
      console.log(`   🚫 Failed Fields: ${failedFields.join(', ')}`);
    }
  });

  test('RBL Update Field Test', async () => {
    const FieldData = RBLAdminData.FieldUpdationData();
    console.log('DEBUG RBL FieldUpdationData:', FieldData);
    
    for (let i = 0; i < FieldData.length; i++) {
      const data = FieldData[i];
      const {
        FieldName: fieldName, Category: category, Level: level, DisplayName: displayName,
        Type: type, InputType: inputType, Min: min, Max: max,
        NoOfLines: noOfLines, Options: options, OptionValues: optionValues,
        AllowOther: allowOther, Tooltip: tooltip
      } = data;
      console.log(`\n📄 Running RBL field update test for: ${fieldName}`);
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
      console.log(`✅ RBL field update test completed for: ${fieldName}`);
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
