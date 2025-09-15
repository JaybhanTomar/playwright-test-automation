const { test } = require('@playwright/test');
const FieldTestData = require('../DataProvider/FieldCreationUpdationData');
const SanityTestSetup = require('./utils/SanityTestSetup.js');

// Uses centralized Sanity configuration from tests/Sanity/config/SanityConfig.js
test.describe.serial('Sanity - Field Setup Tests', () => {
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

    // Navigate to Fields
    await sys.clickOnFields();

    console.log(`✅ Sanity Fields: Setup completed on ${SanityTestSetup.getEnvironment().toUpperCase()}`);
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
    // Use Sanity setup cleanup
    await sanitySetup.cleanup();
  });
});
