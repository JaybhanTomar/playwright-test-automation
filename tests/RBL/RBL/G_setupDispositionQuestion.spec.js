const { test } = require('@playwright/test');
const RBLAdminData = require('../../DataProvider/RBLAdminData.js');
const RBLTestSetup = require('../utils/RBLTestSetup.js');

// Uses centralized RBL configuration from tests/RBL/config/RBLConfig.js
test.describe.serial('RBL - Disposition Question Setup Tests', () => {
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

    // Navigate to Disposition Question
    await sys.clickOnDispositionQuestion();
    console.log(`✅ RBL Disposition Question: Setup completed on ${RBLTestSetup.getEnvironment().toUpperCase()}`);
  });

  test('RBL Create Disposition Question', async () => {
    console.log('\n📋 Starting RBL Disposition Question setup with Excel data...');
    const DispositionQuestionData = RBLAdminData.DispositionQuestionCreationData();
    console.log('DEBUG RBL DispositionQuestionData:', DispositionQuestionData);

    // Check if there's any data to process
    if (!DispositionQuestionData || DispositionQuestionData.length === 0) {
      console.log('⚠️ No RBL disposition question data found in Excel. Test will complete.');
      return;
    }

    console.log(`📊 Processing ${DispositionQuestionData.length} RBL disposition question(s) from Excel data`);
    for (const data of DispositionQuestionData) {
      const {
        category, question, questionType, parentQuestion, inputType, min, max,
        noOfLines, options, optionValues, allowOther, tooltip
      } = data;

      if (!question || question.trim() === "") {
        console.warn(`⚠️  Skipping RBL disposition question: Question is missing or empty.`);
        continue;
      }

      console.log(`\n📄 Running RBL disposition question creation test for: ${question}`);
      await sys.setupDispositionQuestion(
        category,
        question,
        questionType,
        parentQuestion,
        inputType,
        min,
        max,
        noOfLines,
        options,
        optionValues,
        allowOther,
        tooltip
      );
      console.log(`✅ RBL disposition question creation test completed for: ${question}`);
    }
  });

  test.skip('RBL Update Disposition Question Test', async () => {
    const DispositionQuestionData = RBLAdminData.DispositionQuestionUpdationData();

    if (!DispositionQuestionData || DispositionQuestionData.length === 0) {
      console.log('⚠️ No RBL disposition question update data found in Excel.');
      return;
    }

    for (const data of DispositionQuestionData) {
      const {
        category, question, questionType, parentQuestion, inputType, min, max,
        noOfLines, options, optionValues, allowOther, tooltip
      } = data;
      console.log(`\n📄 Running RBL disposition question update test for: ${question}`);
      await sys.updateDispositionQuestion(
        category,
        question,
        questionType,
        parentQuestion,
        inputType,
        min,
        max,
        noOfLines,
        options,
        optionValues,
        allowOther,
        tooltip
      );
      console.log(`✅ RBL disposition question update test completed for: ${question}`);
    }
  });

  test.afterAll(async () => {
    // Use RBL setup cleanup
    await rblSetup.cleanup();
  });
});
