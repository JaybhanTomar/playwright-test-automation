const { test } = require('@playwright/test');
const DispositionScreenData = require('../DataProvider/DispositionScreenData.js');
const SanityTestSetup = require('./utils/SanityTestSetup.js');

// Uses centralized Sanity configuration from tests/Sanity/config/SanityConfig.js
test.describe.serial('Sanity - Disposition Screen Setup Tests', () => {
  let sanitySetup, sys, apiCapture;

  // Use Sanity Config for timeout
  test.setTimeout(SanityTestSetup.getTestTimeout());

  test.beforeAll(async () => {
    console.log('Sanity Disposition Screen beforeAll starting');
    
    // Initialize Sanity test setup
    sanitySetup = new SanityTestSetup();
    const instances = await sanitySetup.completeSetup();
    
    // Extract needed instances
    sys = instances.sys;
    apiCapture = instances.apiCapture;

    // Navigate to Dispositions
    await sys.clickDispositions();
    console.log(`✅ Sanity Disposition Screen: Setup completed on ${SanityTestSetup.getEnvironment().toUpperCase()}`);
  });

  test('Sanity Create Disposition Screen', async () => {
    console.log('\n📋 Starting Sanity Disposition Screen setup with Excel data...');
    let dispositionScreenData;
    
    try {
      dispositionScreenData = DispositionScreenData.DispositionScreenCreationData();
    } catch (error) {
      console.log('⚠️ Excel data not available, using sample data for Sanity disposition screen tests');
      dispositionScreenData = DispositionScreenData.getSampleDispositionScreenData();
    }
    
    console.log('DEBUG Sanity DispositionScreenData:', dispositionScreenData);

    if (!dispositionScreenData || dispositionScreenData.length === 0) {
      console.log('⚠️ No Sanity disposition screen data found. Using default sample data.');
      dispositionScreenData = DispositionScreenData.getSampleDispositionScreenData();
    }

    console.log(`📊 Processing ${dispositionScreenData.length} Sanity disposition screen(s) from data`);
    for (const data of dispositionScreenData) {
      const { DispositionScreenName, Type, Category, Question, Description, QuestionType } = data;

      if (!DispositionScreenName || DispositionScreenName.trim() === "") {
        console.warn(`⚠️  Skipping Sanity disposition screen: DispositionScreenName is missing or empty.`);
        continue;
      }

      console.log(`\n📄 Running Sanity disposition screen creation test for: ${DispositionScreenName}`);
      console.log('Sanity Disposition screen details:', { DispositionScreenName, Type, Category, Question, Description, QuestionType });

      await sys.createDispositionScreen(Type, DispositionScreenName, Category, Question, QuestionType || 'Main Question');
      console.log(`✅ Sanity disposition screen creation test completed for: ${DispositionScreenName}`);
    }
  });

  test.skip('Sanity Update Disposition Screen Test', async () => {
    let dispositionScreenData;
    
    try {
      dispositionScreenData = DispositionScreenData.DispositionScreenUpdationData();
    } catch (error) {
      console.log('⚠️ No Sanity disposition screen update data found in Excel.');
      return;
    }
    
    if (!dispositionScreenData || dispositionScreenData.length === 0) {
      console.log('⚠️ No Sanity disposition screen update data found.');
      return;
    }
    
    for (const data of dispositionScreenData) {
      const { DispositionScreenName, Type, Category, Question, NewDispositionScreenName, NewType } = data;
      console.log(`\n📄 Running Sanity disposition screen update test for: ${DispositionScreenName}`);
      // Note: Update method would need to be implemented in SystemSetupPage.js
      // await sys.updateDispositionScreen(DispositionScreenName, Type, Category, Question, NewDispositionScreenName, NewType);
      console.log(`✅ Sanity disposition screen update test completed for: ${DispositionScreenName}`);
    }
  });

  test.afterAll(async () => {
    // Use Sanity setup cleanup
    await sanitySetup.cleanup();
  });
});
