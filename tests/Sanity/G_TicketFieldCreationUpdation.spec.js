const { test } = require('@playwright/test');
const FieldTestData = require('../DataProvider/FieldCreationUpdationData');
const SanityTestSetup = require('./utils/SanityTestSetup.js');

// Uses centralized Sanity configuration from tests/Sanity/config/SanityConfig.js
test.describe.serial('Sanity - Ticket Field Setup Tests', () => {
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

    // Navigate to Ticket Fields
    await sys.clickOnTicketField();

    console.log(`✅ Sanity Ticket Fields: Setup completed on ${SanityTestSetup.getEnvironment().toUpperCase()}`);
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
    // Use Sanity setup cleanup
    await sanitySetup.cleanup();
  });
});
