const { test } = require('@playwright/test');
const FieldTestData = require('../DataProvider/FieldCreationUpdationData.js');
const SanityTestSetup = require('./utils/SanityTestSetup.js');

// Uses centralized Sanity configuration from tests/Sanity/config/SanityConfig.js
test.describe.serial('Sanity - Lead Process Field Setup Tests', () => {
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

    console.log(`✅ Sanity Lead Process Fields: Setup completed on ${SanityTestSetup.getEnvironment().toUpperCase()}`);
  });

  test.afterAll(async () => {
    // Use Sanity setup cleanup
    await sanitySetup.cleanup();
  });

  test.describe('Lead Stage Sanity Tests', () => {
    test('Navigate to Lead Stage', async () => {
      console.log('\n🔍 Sanity: Testing Lead Stage navigation...');
      await sys.NavigateToSystemSetup();
      await sys.clickOnLeadStage();
      console.log('✅ Lead Stage navigation sanity test passed');
    });

    test('Lead Stage Setup - Sanity Check', async () => {
      console.log('\n📋 Sanity: Lead Stage setup check...');
      const fieldData = FieldTestData.LeadStageCreationData();
      
      // Only test first item for sanity
      if (fieldData.length > 0) {
        const data = fieldData[0];
        console.log(`📄 Sanity check for lead stage: ${data.Stage}`);
        await sys.setupLeadStage(data.Category, data.Stage, data.Probability, data.Default);
        console.log(`✅ Lead stage sanity check passed for: ${data.Stage}`);
      }
    });
  });

  test.describe('Lead Status Sanity Tests', () => {
    test('Navigate to Lead Status', async () => {
      console.log('\n🔍 Sanity: Testing Lead Status navigation...');
      await sys.NavigateToSystemSetup();
      await sys.clickOnLeadStatus();
      console.log('✅ Lead Status navigation sanity test passed');
    });

    test('Lead Status Setup - Sanity Check', async () => {
      console.log('\n📋 Sanity: Lead Status setup check...');
      const fieldData = FieldTestData.LeadStatusCreationData();
      
      // Only test first item for sanity
      if (fieldData.length > 0) {
        const data = fieldData[0];
        console.log(`📄 Sanity check for lead status: ${data.Status}`);
        await sys.setupLeadStatus(data.Category, data.Status, data.Default);
        console.log(`✅ Lead status sanity check passed for: ${data.Status}`);
      }
    });
  });

  test.describe('Lead Lost Reason Sanity Tests', () => {
    test('Navigate to Lead Lost Reason', async () => {
      console.log('\n🔍 Sanity: Testing Lead Lost Reason navigation...');
      await sys.NavigateToSystemSetup();
      await sys.clickOnLeadLostReason();
      console.log('✅ Lead Lost Reason navigation sanity test passed');
    });

    test('Lead Lost Reason Setup - Sanity Check', async () => {
      console.log('\n📋 Sanity: Lead Lost Reason setup check...');
      const fieldData = FieldTestData.LeadLostReasonCreationData();
      
      // Only test first item for sanity
      if (fieldData.length > 0) {
        const data = fieldData[0];
        console.log(`📄 Sanity check for lead lost reason: ${data.LostReason}`);
        await sys.setupLeadLostReason(data.Category, data.LostReason);
        console.log(`✅ Lead lost reason sanity check passed for: ${data.LostReason}`);
      }
    });
  });
});
