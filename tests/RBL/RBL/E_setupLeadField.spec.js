const { test } = require('@playwright/test');
const RBLAdminData = require('../../DataProvider/RBLAdminData.js');
const RBLTestSetup = require('../utils/RBLTestSetup.js');

// Uses centralized RBL configuration from tests/RBL/config/RBLConfig.js
test.describe.serial('RBL - Lead Field Setup Tests', () => {
  let rblSetup, sys, apiCapture;

  // Use RBL Config for timeout
  test.setTimeout(RBLTestSetup.getTestTimeout());

  test.beforeAll(async () => {
    // Initialize RBL test setup
    rblSetup = new RBLTestSetup();
    const instances = await rblSetup.completeSetup();

    // Extract needed instances
    sys = instances.sys;
    apiCapture = instances.apiCapture;

    // Navigate to Lead Fields
    await sys.clickOnLeadField();
    console.log(`✅ RBL Lead Field: Setup completed on ${RBLTestSetup.getEnvironment().toUpperCase()}`);
  });

  test('RBL Create Lead Field', async () => {
    const LeadFieldData = RBLAdminData.LeadFieldCreationData();
    console.log('DEBUG RBL LeadFieldData:', LeadFieldData);

    // Check if there's any data to process
    if (!LeadFieldData || LeadFieldData.length === 0) {
      console.log('⚠️ No RBL lead field data found in Excel. Test will complete.');
      return;
    }

    console.log(`📊 Processing ${LeadFieldData.length} RBL lead field(s) from Excel data`);
    for (const data of LeadFieldData) {
      const {
        Category, DisplayName, FieldName, Type, InputType, Min, Max, NoOfLines, Options, OptionValues, AllowOther, Tooltip
      } = data;
      const Level = 'Lead'; // Default level for Lead Fields

      if (!FieldName || FieldName.trim() === "") {
        console.warn(`⚠️  Skipping RBL lead field: FieldName is missing or empty.`);
        continue;
      }

      console.log(`\n📄 Running RBL lead field creation test for: ${FieldName}`);
      console.log('RBL Lead field details:', { Category, Level, DisplayName, Type, InputType, Tooltip });

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
      console.log(`✅ RBL lead field creation completed for: ${FieldName}`);
    }
  });

  test.skip('RBL Update Lead Field Test', async () => {
    const LeadFieldData = RBLAdminData.LeadFieldUpdationData();

    if (!LeadFieldData || LeadFieldData.length === 0) {
      console.log('⚠️ No RBL lead field update data found in Excel.');
      return;
    }

    for (const data of LeadFieldData) {
      const {
        fieldName, category, level, displayName, type, inputType, min, max,
        noOfLines, options, optionValues, allowOther, tooltip
      } = data;
      console.log(`\n📄 Running RBL lead field update test for: ${fieldName}`);
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
      console.log(`✅ RBL lead field update completed for: ${fieldName}`);
    }
  });

  test.afterAll(async () => {
    // Use RBL setup cleanup
    await rblSetup.cleanup();
  });
});
