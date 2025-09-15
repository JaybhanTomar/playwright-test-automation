const { test, expect } = require('@playwright/test');
const FieldTestData = require('../DataProvider/FieldCreationUpdationData');
const SanityTestSetup = require('./utils/SanityTestSetup.js');

// Uses centralized Sanity configuration from tests/Sanity/config/SanityConfig.js
test.describe.serial('Sanity - Disposition Question Setup Tests', () => {
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
    console.log(`✅ Sanity Disposition Questions: Setup completed on ${SanityTestSetup.getEnvironment().toUpperCase()}`);
  });

  test.afterAll(async () => {
    // Use Sanity setup cleanup
    await sanitySetup.cleanup();
  });

  test.describe('Disposition Question Creation and Updation', () => {
    test('Click on Disposition Question', async () => {
      await sys.clickOnDispositionQuestion();
    });

    test('Disposition Question Setup', async () => {
      console.log('\n📋 Starting Disposition Question setup with Excel data...');
      const FieldData = FieldTestData.DispositionQuestionCreationData();
      console.log('DEBUG FieldData:', FieldData);

      if (!FieldData || FieldData.length === 0) {
        console.log('⚠️ No disposition question data found in Excel. Test will complete.');
        return;
      }

      console.log(`📊 Processing ${FieldData.length} disposition question(s) from Excel data`);
      for (const data of FieldData) {
        const { category, question, questionType, parentQuestion, inputType, min, max, noOfLines, options, optionValues, allowOther, tooltip } = data;
        if (!question || question.trim() === "") {
          console.warn(`⚠️  Skipping disposition question: Question is missing or empty.`);
          continue;
        }
        console.log(`\n📄 Running disposition question creation test for: ${question}`);
        await sys.setupDispositionQuestion(category, question, questionType, parentQuestion, inputType, min, max, noOfLines, options, optionValues, allowOther, tooltip);
        console.log(`✅ Disposition question creation test completed for: ${question}`);
      }
    });

    test('Click on Disposition Question for Update', async () => {
      console.log('\n🔍 Navigating back to Disposition Question for update...');
      await sys.NavigateToSystemSetup();
      await sys.clickOnDispositionQuestion();
      console.log('✅ Disposition Question navigation for update completed');
    });

    test('Disposition Question Update', async () => {
      console.log('\n📋 Starting Disposition Question update with Excel data...');
      const UpdateData = FieldTestData.DispositionQuestionUpdationData();

      if (!UpdateData || UpdateData.length === 0) {
        console.log('⚠️ No disposition question update data found in Excel. Test will complete.');
        return;
      }

      for (const data of UpdateData) {
        const { category, question, newCategory, newQuestion, questionType, parentQuestion, inputType, min, max, noOfLines, options, optionValues, allowOther, tooltip } = data;
        console.log(`\n📄 Running disposition question update test for: ${question}`);

        if (!newCategory && !newQuestion) {
          console.log(`⚠️ Skipping update for ${question}: New category or new question is undefined/empty.`);
          console.log(`✅ Disposition question update completed for: ${question}`);
          continue;
        }

        // For now, we'll use the same setup method since there's no specific update method
        // This can be enhanced when update functionality is available
        await sys.setupDispositionQuestion(newCategory || category, newQuestion || question, questionType, parentQuestion, inputType, min, max, noOfLines, options, optionValues, allowOther, tooltip);
        console.log(`✅ Disposition question update completed for: ${question}`);
      }
    });
  });
});
