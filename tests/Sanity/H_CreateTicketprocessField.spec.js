const { test } = require('@playwright/test');
const FieldTestData = require('../DataProvider/FieldCreationUpdationData.js');
const SanityTestSetup = require('./utils/SanityTestSetup.js');

// Uses centralized Sanity configuration from tests/Sanity/config/SanityConfig.js
test.describe.serial('Sanity - Ticket Process Field Setup Tests', () => {
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

    console.log(`✅ Sanity Ticket Process Fields: Setup completed on ${SanityTestSetup.getEnvironment().toUpperCase()}`);
    await sys.clickOnTicketField();
  });

  test.afterAll(async () => {
    // Use Sanity setup cleanup
    await sanitySetup.cleanup();
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
