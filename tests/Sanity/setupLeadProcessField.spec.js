const { test, chromium } = require('@playwright/test');
const SystemSetupPage = require('../pages/SystemSetupPage.js');
const LoginPage = require('../pages/LoginPage.js');
const BaseURL = require('../utils/BaseURL.js');
const ApiCapture = require('../utils/ApiCapture.js');
const FieldTestData = require('../DataProvider/FieldCreationUpdationData.js');
const SanityConfig = require('./config/SanityConfig.js');

test.describe.serial('Sanity - Lead Process Field Setup Tests', () => {
  let browser, context, page, sys, loginPage, baseUrlUtil, apiCapture;

  // Use SanityConfig timeout
  test.setTimeout(SanityConfig.getTestTimeout());

  test.beforeAll(async () => {
    // Log current configuration
    SanityConfig.logConfig();
    
    browser = await chromium.launch(SanityConfig.getBrowserOptions());
    context = await browser.newContext();
    page = await context.newPage();
    
    // Apply page options
    const pageOptions = SanityConfig.getPageOptions();
    if (pageOptions.viewport) {
      await page.setViewportSize(pageOptions.viewport);
    }

    sys = new SystemSetupPage(page);
    loginPage = new LoginPage(page);
    baseUrlUtil = new BaseURL(page);
    apiCapture = new ApiCapture(page);

    // Start API monitoring
    apiCapture.startMonitoring();

    // Use SanityConfig to navigate to configured environment
    await SanityConfig.navigateToEnvironment(baseUrlUtil);

    // Use loginTestData for credentials
    const loginTestData = require('../DataProvider/UserCreationUpdationData.js').userLoginData();
    const { email, password, role } = loginTestData[0];
    await loginPage.login(email, password, role);

    // Navigate to System Setup
    await sys.NavigateToSystemSetup();
  });

  test.afterAll(async () => {
    try {
      console.log('📊 API Summary: Sanity Lead Process Field tests completed');
      if (context) {
        await context.close();
        console.log('✅ Browser context closed successfully');
      }
      if (browser) {
        await browser.close();
        console.log('✅ Browser closed successfully');
      }
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
    }
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
