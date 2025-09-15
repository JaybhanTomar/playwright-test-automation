const { test } = require('@playwright/test');
const HomePage = require('../../pages/HomePage_POM');
const RBLTestSetup = require('../utils/RBLTestSetup.js');
const loginTestData = require('../../DataProvider/UserCreationUpdationData').userLoginData();

// Uses centralized RBL configuration from tests/RBL/config/RBLConfig.js
test.describe.serial('RBL - System Setup Tabbing Functionality', () => {
  let rblSetup, sys, home, apiCapture;

  // Use RBL Config for timeout
  test.setTimeout(RBLTestSetup.getTestTimeout());

  test.beforeAll(async ({}) => {
    // Initialize RBL test setup
    rblSetup = new RBLTestSetup();
    const instances = await rblSetup.completeSetup();

    // Extract needed instances
    sys = instances.sys;
    apiCapture = instances.apiCapture;
    home = new HomePage(instances.page);

    console.log(`✅ RBL Tabbing: Setup completed on ${RBLTestSetup.getEnvironment().toUpperCase()}`);
  });

  test('RBL Tabbing System Setup Elements', async () => {
    await sys.tabToSystemSetupElements();
    // Note: tabToCustomFields method removed - no Custom Fields section in System Setup
    await home.tabToHomeElements();
    console.log("✅ RBL Basic navigation test completed successfully");
  });
  
  test.afterAll(async () => {
    // Use RBL setup cleanup
    await rblSetup.cleanup();
  });
});
