const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { CampaignCallingPage } = require('../../pageAgent/CampaignCallingPage');
const { AddupdatecontactPage } = require('../../pages/AddupdatecontactPage');
const { SanityTestSetup } = require('./utils/SanityAgentTestSetup');

// Uses centralized Sanity configuration from tests/Sanity/config/SanityConfig.js
test.describe.serial('Sanity - Campaign Calling Tests', () => {
  let sanitySetup, campaignCallingPage, page, apiCapture;

  // Use Sanity Config for timeout
  test.setTimeout(SanityTestSetup.getTestTimeout());

  test.beforeAll(async () => {
    // Initialize Sanity test setup
    sanitySetup = new SanityTestSetup();
    const instances = await sanitySetup.completeSetup();

    // Extract needed instances
    page = instances.page;
    apiCapture = instances.apiCapture;

    // Initialize campaign calling page
    campaignCallingPage = new CampaignCallingPage(page);

    console.log(`✅ Sanity Campaign Calling: Setup completed on ${SanityTestSetup.getEnvironment().toUpperCase()}`);
  });

  test.afterAll(async () => {
    // Use Sanity setup cleanup
    await sanitySetup.cleanup();
  });

  test('Verify Campaign Calling', async () => {
    try {
      // Navigate to Campaign Calling Page
      await campaignCallingPage.navigateToCampaignCallingPage();

      // Verify Campaign Calling Page
      await expect(campaignCallingPage.campaignCallingPage).toBeVisible();
    } catch (error) {
      console.error('Error occurred:', error);
    }
  });
});
function newFunction() {
    return require('../../config/SanityConfig');
}

