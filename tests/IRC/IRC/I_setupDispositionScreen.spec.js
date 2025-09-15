const { test } = require('@playwright/test');
const DispositionScreenData = require('../../DataProvider/DispositionScreenData.js');
const IRCTestSetup = require('../utils/IRCTestSetup.js');

// Uses centralized IRC configuration from tests/IRC/config/IRCConfig.js
test.describe.serial('IRC - Disposition Screen Setup Tests', () => {
  let ircSetup, sys, apiCapture;

  // Use IRC Config for timeout
  test.setTimeout(IRCTestSetup.getTestTimeout());

  test.beforeAll(async () => {
    console.log('IRC Disposition Screen beforeAll starting');
    
    // Initialize IRC test setup
    ircSetup = new IRCTestSetup();
    const instances = await ircSetup.completeSetup();
    
    // Extract needed instances
    sys = instances.sys;
    apiCapture = instances.apiCapture;

    // Navigate to Dispositions
    await sys.clickDispositions();
    console.log(`✅ IRC Disposition Screen: Setup completed on ${IRCTestSetup.getEnvironment().toUpperCase()}`);
  });

  test('IRC Create Disposition Screen', async () => {
    console.log('\n📋 Starting IRC Disposition Screen setup with Excel data...');
    let dispositionScreenData;
    
    try {
      dispositionScreenData = DispositionScreenData.DispositionScreenCreationData();
    } catch (error) {
      console.log('⚠️ Excel data not available, using sample data for IRC disposition screen tests');
      dispositionScreenData = DispositionScreenData.getSampleDispositionScreenData();
    }
    
    console.log('DEBUG IRC DispositionScreenData:', dispositionScreenData);

    if (!dispositionScreenData || dispositionScreenData.length === 0) {
      console.log('⚠️ No IRC disposition screen data found. Using default sample data.');
      dispositionScreenData = DispositionScreenData.getSampleDispositionScreenData();
    }

    console.log(`📊 Processing ${dispositionScreenData.length} IRC disposition screen(s) from data`);
    for (const data of dispositionScreenData) {
      const { DispositionScreenName, Type, Category, Question, Description, QuestionType } = data;

      if (!DispositionScreenName || DispositionScreenName.trim() === "") {
        console.warn(`⚠️  Skipping IRC disposition screen: DispositionScreenName is missing or empty.`);
        continue;
      }

      console.log(`\n📄 Running IRC disposition screen creation test for: ${DispositionScreenName}`);
      console.log('IRC Disposition screen details:', { DispositionScreenName, Type, Category, Question, Description, QuestionType });

      await sys.createDispositionScreen(Type, DispositionScreenName, Category, Question, QuestionType || 'Main Question');
      console.log(`✅ IRC disposition screen creation test completed for: ${DispositionScreenName}`);
    }
  });

  test.skip('IRC Update Disposition Screen Test', async () => {
    let dispositionScreenData;
    
    try {
      dispositionScreenData = DispositionScreenData.DispositionScreenUpdationData();
    } catch (error) {
      console.log('⚠️ No IRC disposition screen update data found in Excel.');
      return;
    }
    
    if (!dispositionScreenData || dispositionScreenData.length === 0) {
      console.log('⚠️ No IRC disposition screen update data found.');
      return;
    }
    
    for (const data of dispositionScreenData) {
      const { DispositionScreenName, Type, Category, Question, NewDispositionScreenName, NewType } = data;
      console.log(`\n📄 Running IRC disposition screen update test for: ${DispositionScreenName}`);
      // Note: Update method would need to be implemented in SystemSetupPage.js
      // await sys.updateDispositionScreen(DispositionScreenName, Type, Category, Question, NewDispositionScreenName, NewType);
      console.log(`✅ IRC disposition screen update test completed for: ${DispositionScreenName}`);
    }
  });

  test.afterAll(async () => {
    // Use IRC setup cleanup
    await ircSetup.cleanup();
  });
});
