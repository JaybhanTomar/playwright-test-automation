const { test, chromium } = require('@playwright/test');
const SystemSetupPage = require('../pages/SystemSetupPage.js');
const LoginPage = require('../pages/LoginPage.js');
const BaseURL = require('../utils/BaseURL.js');
const ApiCapture = require('../utils/ApiCapture.js');
const FieldTestData = require('../DataProvider/FieldCreationUpdationData.js');

test.describe.serial('Ticket Process Field Setup Tests', () => {
  let browser, context, page, sys, loginPage, baseUrlUtil, apiCapture;

  // Set reasonable timeout - 10 minutes should be enough for all data processing
  test.setTimeout(600000); // 10 minutes

  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    sys = new SystemSetupPage(page);
    loginPage = new LoginPage(page);
    baseUrlUtil = new BaseURL(page);
    apiCapture = new ApiCapture(page);

    // Start API monitoring
    apiCapture.startMonitoring();

    // Use BaseURL utility to navigate to qc2 environment
    await baseUrlUtil.qc2();

    // Use loginTestData for credentials
    const loginTestData = require('../DataProvider/UserCreationUpdationData.js').userLoginData();
    const { email, password, role } = loginTestData[0];
    await loginPage.login(email, password, role);

    // Navigate to System Setup
    await sys.NavigateToSystemSetup();
    await sys.clickOnTicketField();
  });

  test.afterAll(async () => {
    try {
      if (apiCapture) {
        console.log('📊 API Summary: Ticket Process Field tests completed');
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

  test.describe('Ticket Type Creation and Updation', () => {
    test('Click on Ticket Type', async () => {
      console.log('\n🔍 Testing Ticket Type navigation...');
      await sys.clickOnTicketType();
      console.log('✅ Ticket Type navigation test completed successfully');
    });

    test('Ticket Type Setup', async () => {
      console.log('\n📋 Starting Ticket Type setup with Excel data...');
      const FieldData = FieldTestData.TicketTypeCreationData();
      console.log('DEBUG FieldData:', FieldData);

      if (!FieldData || FieldData.length === 0) {
        console.log('⚠️ No ticket type data found in Excel. Test will complete.');
        return;
      }

      console.log(`📊 Processing ${FieldData.length} ticket type(s) from Excel data`);
      for (const data of FieldData) {
        const { Category, Type, IsDefault } = data;
        if (!Type || Type.trim() === "") {
          console.warn(`⚠️  Skipping ticket type: Type is missing or empty.`);
          continue;
        }
        console.log(`\n📄 Running ticket type creation test for: ${Type}`);
        await sys.setupTicketType(Category, Type, IsDefault);
        console.log(`✅ Ticket type creation test completed for: ${Type}`);
      }
    });

    test('Click on Ticket Type for Update', async () => {
      console.log('\n🔍 Navigating back to Ticket Type for update...');
      await sys.NavigateToSystemSetup();
      await sys.clickOnTicketField();
      await sys.clickOnTicketType();
      console.log('✅ Ticket Type navigation for update completed');
    });

    test('Ticket Type Update', async () => {
      console.log('\n📋 Starting Ticket Type update with Excel data...');
      const UpdateData = FieldTestData.TicketTypeUpdationData();
      
      if (!UpdateData || UpdateData.length === 0) {
        console.log('⚠️ No ticket type update data found in Excel.');
        return;
      }

      for (const data of UpdateData) {
        const { Category, Type, NewCategory, NewType, IsDefault } = data;
        console.log(`\n📄 Running ticket type update test for: ${Type}`);
        await sys.updateTicketType(Category, NewCategory, Type, NewType, IsDefault);
        console.log(`✅ Ticket type update completed for: ${Type}`);
      }
    });
  });

  test.describe('Ticket Priority Creation and Updation', () => {
    test('Click on Ticket Priority', async () => {
      console.log('\n🔍 Testing Ticket Priority navigation...');
      await sys.NavigateToSystemSetup();
      await sys.clickOnTicketField();
      await sys.clickOnTicketPriority();
      console.log('✅ Ticket Priority navigation test completed successfully');
    });

    test('Ticket Priority Setup', async () => {
      console.log('\n📋 Starting Ticket Priority setup with Excel data...');
      const FieldData = FieldTestData.TicketPriorityCreationData();
      console.log('DEBUG FieldData:', FieldData);

      if (!FieldData || FieldData.length === 0) {
        console.log('⚠️ No ticket priority data found in Excel.');
        return;
      }

      console.log(`📊 Processing ${FieldData.length} ticket priority(ies) from Excel data`);
      for (const data of FieldData) {
        const { Category, Priority, Default, FirstRes, Time, TrailRes, Time_1, Reso, Time_2 } = data;
        if (!Priority || Priority.trim() === "") {
          console.warn(`⚠️  Skipping ticket priority: Priority is missing or empty.`);
          continue;
        }
        console.log(`\n📄 Running ticket priority creation test for: ${Priority}`);
        await sys.setupTicketPriority(Category, Priority, Default, FirstRes, Time, TrailRes, Time_1, Reso, Time_2);
        console.log(`✅ Ticket priority creation test completed for: ${Priority}`);
      }
    });

    test('Click on Ticket Priority for Update', async () => {
      console.log('\n🔍 Navigating back to Ticket Priority for update...');
      await sys.NavigateToSystemSetup();
      await sys.clickOnTicketField();
      await sys.clickOnTicketPriority();
      console.log('✅ Ticket Priority navigation for update completed');
    });

    test('Ticket Priority Update', async () => {
      console.log('\n📋 Starting Ticket Priority update with Excel data...');
      const UpdateData = FieldTestData.TicketPriorityUpdationData();
      
      if (!UpdateData || UpdateData.length === 0) {
        console.log('⚠️ No ticket priority update data found in Excel.');
        return;
      }

      for (const data of UpdateData) {
        const { Category, Priority, NewCategory, NewPriority, Default, FirstRes, Time, TrailRes, Time_1, Reso, Time_2 } = data;
        console.log(`\n📄 Running ticket priority update test for: ${Priority}`);
        await sys.updateTicketPriority(Category, NewCategory, Priority, NewPriority, Default, FirstRes, Time, TrailRes, Time_1, Reso, Time_2);
        console.log(`✅ Ticket priority update completed for: ${Priority}`);
      }
    });
  });

  test.describe('Ticket Stage Creation and Updation', () => {
    test('Click on Ticket Stage', async () => {
      console.log('\n🔍 Testing Ticket Stage navigation...');
      await sys.NavigateToSystemSetup();
      await sys.clickOnTicketField();
      await sys.clickOnTicketStage();
      console.log('✅ Ticket Stage navigation test completed successfully');
    });

    test('Ticket Stage Setup', async () => {
      console.log('\n📋 Starting Ticket Stage setup with Excel data...');
      const FieldData = FieldTestData.TicketStageCreationData();
      console.log('DEBUG FieldData:', FieldData);

      if (!FieldData || FieldData.length === 0) {
        console.log('⚠️ No ticket stage data found in Excel.');
        return;
      }

      console.log(`📊 Processing ${FieldData.length} ticket stage(s) from Excel data`);
      for (const data of FieldData) {
        const { Category, Stage, Default, Order, IsClosed } = data;
        if (!Stage || Stage.trim() === "") {
          console.warn(`⚠️  Skipping ticket stage: Stage is missing or empty.`);
          continue;
        }
        console.log(`\n📄 Running ticket stage creation test for: ${Stage}`);
        await sys.setupTicketStage(Category, Stage, Default, Order, IsClosed);
        console.log(`✅ Ticket stage creation test completed for: ${Stage}`);
      }
    });

    test('Click on Ticket Stage for Update', async () => {
      console.log('\n🔍 Navigating back to Ticket Stage for update...');
      await sys.NavigateToSystemSetup();
      await sys.clickOnTicketField();
      await sys.clickOnTicketStage();
      console.log('✅ Ticket Stage navigation for update completed');
    });

    test('Ticket Stage Update', async () => {
      console.log('\n📋 Starting Ticket Stage update with Excel data...');
      const UpdateData = FieldTestData.TicketStageUpdationData();
      
      if (!UpdateData || UpdateData.length === 0) {
        console.log('⚠️ No ticket stage update data found in Excel.');
        return;
      }

      for (const data of UpdateData) {
        const { Category, Stage, NewCategory, NewStage, Default, Order, IsClosed } = data;
        console.log(`\n📄 Running ticket stage update test for: ${Stage}`);
        await sys.updateTicketStage(Category, NewCategory, Stage, NewStage, Default, Order, IsClosed);
        console.log(`✅ Ticket stage update completed for: ${Stage}`);
      }
    });
  });
});
