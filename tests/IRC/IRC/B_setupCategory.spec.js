console.log('setupCategory.spec.js loaded');
const { test } = require('@playwright/test');
const FieldTestData = require('../../DataProvider/FieldCreationUpdationData.js');
const IRCTestSetup = require('../utils/IRCTestSetup.js');

// Uses centralized IRC configuration from tests/IRC/config/IRCConfig.js
test.describe.serial('Category Setup Tests', () => {
  let ircSetup, sys, apiCapture;

  // Use IRC Config for timeout
  test.setTimeout(IRCTestSetup.getTestTimeout());

  test.beforeAll(async () => {
    console.log('beforeAll starting');

    // Initialize IRC test setup
    ircSetup = new IRCTestSetup();
    const instances = await ircSetup.completeSetup();

    // Extract needed instances
    sys = instances.sys;
    apiCapture = instances.apiCapture;

    // Navigate to Categories
    await sys.clickCategories();
    console.log(`✅ IRC Category: Setup completed on ${IRCTestSetup.getEnvironment().toUpperCase()}`);
  });
  test('Create Category', async () => {
    console.log('Create Category test running');
    const categoryData = FieldTestData.CategoryCreationData();
    for (const data of categoryData) {
      const { category } = data;
      await sys.setupCategories(category);
    }
  });
  test.skip('Update Category', async () => {
    const categoryData = FieldTestData.CategoryUpdationData();
    for (const data of categoryData) {
      const { category, newCategory } = data;
      await sys.updateCategory(category, newCategory);
    }
  });
  test.afterAll(async () => {
    // Use IRC setup cleanup
    await ircSetup.cleanup();
  });
});