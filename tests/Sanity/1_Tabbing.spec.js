const { test } = require('@playwright/test');
const AdminSideBar = require('../utils/AdminSideBar');
const HomePage = require('../pages/HomePage_POM');
const SanityTestSetup = require('./utils/SanityTestSetup.js');

// Uses centralized Sanity configuration from tests/Sanity/config/SanityConfig.js
test.describe.serial('Sanity - System Setup Tabbing Functionality', () => {
  let sanitySetup, page, bar, sys, home, apiCapture;

  // Use Sanity Config for timeout
  test.setTimeout(SanityTestSetup.getTestTimeout());

  test.beforeAll(async () => {
    // Initialize Sanity test setup
    sanitySetup = new SanityTestSetup();
    const instances = await sanitySetup.completeSetup();

    // Extract needed instances
    page = instances.page;
    sys = instances.sys;
    apiCapture = instances.apiCapture;

    // Initialize additional page objects
    bar = new AdminSideBar(page);
    home = new HomePage(page);

    console.log(`✅ Sanity Tabbing: Setup completed on ${SanityTestSetup.getEnvironment().toUpperCase()}`);
  });

  test('Tabbing System Setup Elements', async () => {
    await sys.tabToSystemSetupElements();
    await home.tabToHomeElements();
    console.log("Basic navigation test completed successfully");
  });
  
  test.afterAll(async () => {
    // Use Sanity setup cleanup
    await sanitySetup.cleanup();
  });
});
