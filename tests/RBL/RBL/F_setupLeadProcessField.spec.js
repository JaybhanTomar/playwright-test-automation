const { test, chromium } = require('@playwright/test');
const SystemSetupPage = require('../../pages/SystemSetupPage.js');
const LoginPage = require('../../pages/LoginPage.js');
const BaseURL = require('../../utils/BaseURL.js');
const ApiCapture = require('../../utils/ApiCapture.js');
const RBLAdminData = require('../../DataProvider/RBLAdminData.js');
const RBLConfig = require('../config/RBLConfig.js');

test.describe.serial('RBL - Lead Process Field Setup Tests', () => {
  let browser, context, page, sys, loginPage, baseUrlUtil, apiCapture;

  // Use RBL Config for timeout
  test.setTimeout(RBLConfig.getTestTimeout());

  test.beforeAll(async () => {
    // Log RBL configuration
    RBLConfig.logConfig();

    // Launch browser with RBL config options
    browser = await chromium.launch(RBLConfig.getBrowserOptions());
    context = await browser.newContext();
    page = await context.newPage();

    // Apply page options
    const pageOptions = RBLConfig.getPageOptions();
    page.setDefaultTimeout(pageOptions.actionTimeout);
    page.setDefaultNavigationTimeout(pageOptions.navigationTimeout);

    sys = new SystemSetupPage(page);
    loginPage = new LoginPage(page);
    baseUrlUtil = new BaseURL(page);
    apiCapture = new ApiCapture(page);

    // Start API monitoring
    apiCapture.startMonitoring();

    // Use RBL Config to navigate to configured environment
    await RBLConfig.navigateToEnvironment(baseUrlUtil);

    // Use loginTestData for credentials
    const loginTestData = require('../../DataProvider/UserCreationUpdationData.js').userLoginData();
const RBLTestSetup = require('../utils/RBLTestSetup.js');
    const { email, password, role } = loginTestData[0];
    await loginPage.login(email, password, role);

    // Navigate to System Setup
    await sys.NavigateToSystemSetup();
  });

  test.afterAll(async () => {
    try {
      if (apiCapture) {
        console.log('📊 API Summary: RBL Lead Process Field tests completed');
      }
    } catch (error) {
      console.error('Error in API summary:', error);
    }

    try {
      if (context) {
        await context.close();
        console.log('✅ Browser context closed successfully');
      }
    } catch (error) {
      console.error('Error closing context:', error);
    }

    try {
      if (browser) {
        await browser.close();
        console.log('✅ Browser closed successfully');
      }
    } catch (error) {
      console.error('Error closing browser:', error);
    }
  });

  test.describe('RBL Lead Stage Creation and Updation', () => {
    test('Click on Lead Stage', async () => {
      console.log('\n🔍 Testing RBL Lead Stage navigation...');
      await sys.clickOnLeadStage();
      console.log('✅ RBL Lead Stage navigation test completed successfully');
    });

    test('RBL Lead Stage Setup', async () => {
      console.log('\n📋 Starting RBL Lead Stage setup with Excel data...');
      const FieldData = RBLAdminData.LeadStageCreationData();
      console.log('DEBUG RBL FieldData:', FieldData);

      if (!FieldData || FieldData.length === 0) {
        console.log('⚠️ No RBL lead stage data found in Excel. Test will complete.');
        return;
      }

      console.log(`📊 Processing ${FieldData.length} RBL lead stage(s) from Excel data`);
      for (const data of FieldData) {
        const { Category, Stage, Probability, IsDefault } = data;
        if (!Stage || Stage.trim() === "") {
          console.warn(`⚠️  Skipping RBL lead stage: Stage is missing or empty.`);
          continue;
        }
        console.log(`\n📄 Running RBL lead stage creation test for: ${Stage}`);
        await sys.setupLeadStage(Category, Stage, Probability, IsDefault);
        console.log(`✅ RBL lead stage creation test completed for: ${Stage}`);
      }
    });

    test('Click on Lead Stage for Update', async () => {
      console.log('\n🔍 Navigating back to RBL Lead Stage for update...');
      await sys.NavigateToSystemSetup();
      await sys.clickOnLeadStage();
      console.log('✅ RBL Lead Stage navigation for update completed');
    });

    test('RBL Lead Stage Update', async () => {
      console.log('\n📋 Starting RBL Lead Stage update with Excel data...');
      const UpdateData = RBLAdminData.LeadStageUpdationData();

      if (!UpdateData || UpdateData.length === 0) {
        console.log('⚠️ No RBL lead stage update data found in Excel.');
        return;
      }

      for (const data of UpdateData) {
        const { Category, Stage, NewCategory, NewStage, Probability, IsDefault } = data;
        console.log(`\n📄 Running RBL lead stage update test for: ${Stage}`);
        await sys.updateLeadStage(Category, NewCategory, Stage, NewStage, Probability, IsDefault);
        console.log(`✅ RBL lead stage update completed for: ${Stage}`);
      }
    });
  });

  test.describe('RBL Lead Status Creation and Updation', () => {
    test('Click on Lead Status', async () => {
      console.log('\n🔍 Testing RBL Lead Status navigation...');
      await sys.NavigateToSystemSetup();
      await sys.clickOnLeadStatus();
      console.log('✅ RBL Lead Status navigation test completed successfully');
    });

    test('RBL Lead Status Setup', async () => {
      console.log('\n📋 Starting RBL Lead Status setup with Excel data...');
      const FieldData = RBLAdminData.LeadStatusCreationData();
      console.log('DEBUG RBL FieldData:', FieldData);

      if (!FieldData || FieldData.length === 0) {
        console.log('⚠️ No RBL lead status data found in Excel.');
        return;
      }

      console.log(`📊 Processing ${FieldData.length} RBL lead status(es) from Excel data`);
      for (const data of FieldData) {
        const { Category, Status, IsDefault } = data;
        if (!Status || Status.trim() === "") {
          console.warn(`⚠️  Skipping RBL lead status: Status is missing or empty.`);
          continue;
        }
        console.log(`\n📄 Running RBL lead status creation test for: ${Status}`);
        await sys.setupLeadStatus(Category, Status, IsDefault);
        console.log(`✅ RBL lead status creation test completed for: ${Status}`);
      }
    });

    test('Click on Lead Status for Update', async () => {
      console.log('\n🔍 Navigating back to RBL Lead Status for update...');
      await sys.NavigateToSystemSetup();
      await sys.clickOnLeadStatus();
      console.log('✅ RBL Lead Status navigation for update completed');
    });

    test('RBL Lead Status Update', async () => {
      console.log('\n📋 Starting RBL Lead Status update with Excel data...');
      const UpdateData = RBLAdminData.LeadStatusUpdationData();

      if (!UpdateData || UpdateData.length === 0) {
        console.log('⚠️ No RBL lead status update data found in Excel.');
        return;
      }

      for (const data of UpdateData) {
        const { Category, Status, NewCategory, NewStatus, IsDefault } = data;
        console.log(`\n📄 Running RBL lead status update test for: ${Status}`);
        await sys.updateLeadStatus(Category, NewCategory, Status, NewStatus, IsDefault);
        console.log(`✅ RBL lead status update completed for: ${Status}`);
      }
    });
  });

  test.describe('RBL Lead Lost Reason Creation and Updation', () => {
    test('Click on Lead Lost Reason', async () => {
      console.log('\n🔍 Testing RBL Lead Lost Reason navigation...');
      await sys.NavigateToSystemSetup();
      await sys.clickOnLeadLostReason();
      console.log('✅ RBL Lead Lost Reason navigation test completed successfully');
    });

    test('RBL Lead Lost Reason Setup', async () => {
      console.log('\n📋 Starting RBL Lead Lost Reason setup with Excel data...');
      const FieldData = RBLAdminData.LeadLostReasonCreationData();
      console.log('DEBUG RBL FieldData:', FieldData);

      if (!FieldData || FieldData.length === 0) {
        console.log('⚠️ No RBL lead lost reason data found in Excel.');
        return;
      }

      console.log(`📊 Processing ${FieldData.length} RBL lead lost reason(s) from Excel data`);
      for (const data of FieldData) {
        const { Category, LostReason } = data;
        if (!LostReason || LostReason.trim() === "") {
          console.warn(`⚠️  Skipping RBL lead lost reason: LostReason is missing or empty.`);
          continue;
        }
        console.log(`\n📄 Running RBL lead lost reason creation test for: ${LostReason}`);
        await sys.setupLeadLostReason(Category, LostReason);
        console.log(`✅ RBL lead lost reason creation test completed for: ${LostReason}`);
      }
    });

    test('Click on Lead Lost Reason for Update', async () => {
      console.log('\n🔍 Navigating back to RBL Lead Lost Reason for update...');
      await sys.NavigateToSystemSetup();
      await sys.clickOnLeadLostReason();
      console.log('✅ RBL Lead Lost Reason navigation for update completed');
    });

    test('RBL Lead Lost Reason Update', async () => {
      console.log('\n📋 Starting RBL Lead Lost Reason update with Excel data...');
      const UpdateData = RBLAdminData.LeadLostReasonUpdationData();

      if (!UpdateData || UpdateData.length === 0) {
        console.log('⚠️ No RBL lead lost reason update data found in Excel.');
        return;
      }

      for (const data of UpdateData) {
        const { Category, LostReason, NewCategory, NewLostReason } = data;
        console.log(`\n📄 Running RBL lead lost reason update test for: ${LostReason}`);
        await sys.updateLeadLostReason(Category, LostReason, NewCategory, NewLostReason);
        console.log(`✅ RBL lead lost reason update completed for: ${LostReason}`);
      }
    });
  });
});
