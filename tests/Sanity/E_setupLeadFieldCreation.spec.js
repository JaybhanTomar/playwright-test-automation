const { test } = require('@playwright/test');
const FieldTestData = require('../DataProvider/FieldCreationUpdationData');
const SanityTestSetup = require('./utils/SanityTestSetup.js');

// Uses centralized Sanity configuration from tests/Sanity/config/SanityConfig.js
test.describe.serial('Sanity - Lead Field Setup Tests', () => {
  let sanitySetup, sys, apiCapture;

  // Use Sanity Config for timeout
  test.setTimeout(SanityTestSetup.getTestTimeout());

  test.beforeAll(async () => {
    // Initialize Sanity test setup
    sanitySetup = new SanityTestSetup();
    const instances = await sanitySetup.completeSetup();

    // Extract needed instances
    sys = instances.sys;
    apiCapture = instances.apiCapture;

    // Navigate to Lead Fields
    await sys.clickOnLeadField();

    console.log(`✅ Sanity Lead Fields: Setup completed on ${SanityTestSetup.getEnvironment().toUpperCase()}`);
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
    // Use Sanity setup cleanup
    await sanitySetup.cleanup();
  });
});
