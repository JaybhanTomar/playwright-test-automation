const { test } = require('@playwright/test');
const RBLAdminData = require('../../DataProvider/RBLAdminData.js');
const RBLTestSetup = require('../utils/RBLTestSetup.js');

// Uses centralized RBL configuration from tests/RBL/config/RBLConfig.js
test.describe.serial('RBL - Disposition Screen Setup Tests', () => {
  let rblSetup, sys, apiCapture;

  // Use RBL Config for timeout
  test.setTimeout(RBLTestSetup.getTestTimeout());

  test.beforeAll(async () => {
    // Initialize RBL test setup
    rblSetup = new RBLTestSetup();
    const instances = await rblSetup.completeSetup();
    
    // Extract needed instances
    sys = instances.sys;
    apiCapture = instances.apiCapture;

    // Navigate to Dispositions
    await sys.clickDispositions();
    console.log(`✅ RBL Disposition Screen: Setup completed on ${RBLTestSetup.getEnvironment().toUpperCase()}`);
  });

  test('RBL Create Disposition Screen', async () => {
    console.log('\n📋 Starting RBL Disposition Screen setup with Excel data...');
    const DispositionScreenData = RBLAdminData.DispositionScreenCreationData();
    console.log('DEBUG RBL DispositionScreenData:', DispositionScreenData);

    // Check if there's any data to process
    if (!DispositionScreenData || DispositionScreenData.length === 0) {
      console.log('⚠️ No RBL disposition screen data found in Excel. Using sample data for demonstration.');
      for (const data of sampleData) {
        const { Type, DispositionScreenName, Category, Question, QuestionType } = data;
        console.log(`\n📄 Running RBL disposition screen creation test for: ${DispositionScreenName}`);
        await sys.createDispositionScreen(Type, DispositionScreenName, Category, Question, QuestionType );
        console.log(`✅ RBL disposition screen creation test completed for: ${DispositionScreenName}`);
      }
      return;
    }

    console.log(`📊 Processing ${DispositionScreenData.length} RBL disposition screen(s) from Excel data`);
    for (const data of DispositionScreenData) {
      // Use the actual column names from your Excel file
      const { Type, DispositionScreen, category, question, questionType } = data;

      if (!DispositionScreen || DispositionScreen.trim() === "") {
        console.warn(`⚠️  Skipping RBL disposition screen: DispositionScreen is missing or empty.`);
        continue;
      }

      console.log(`\n📄 Running RBL disposition screen creation test for: ${DispositionScreen}`);
      console.log('RBL Disposition screen details:', { Type, DispositionScreen, category, question, questionType });

      await sys.createDispositionScreen(Type, DispositionScreen, category, question, questionType);
      console.log(`✅ RBL disposition screen creation test completed for: ${DispositionScreen}`);
    }
  });

  test.skip('RBL Update Disposition Screen Test', async () => {
    const DispositionScreenData = RBLAdminData.DispositionScreenUpdationData();
    
    if (!DispositionScreenData || DispositionScreenData.length === 0) {
      console.log('⚠️ No RBL disposition screen update data found in Excel.');
      return;
    }
    
    for (const data of DispositionScreenData) {
      const { DispositionScreenName, Type, Category, Question, NewDispositionScreenName, NewType } = data;
      console.log(`\n📄 Running RBL disposition screen update test for: ${DispositionScreenName}`);
      // Note: Update method would need to be implemented in SystemSetupPage.js
      // await sys.updateDispositionScreen(DispositionScreenName, Type, Category, Question, NewDispositionScreenName, NewType);
      console.log(`✅ RBL disposition screen update test completed for: ${DispositionScreenName}`);
    }
  });

  test.afterAll(async () => {
    // Use RBL setup cleanup
    await rblSetup.cleanup();
  });
});
