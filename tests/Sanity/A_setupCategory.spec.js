console.log('setupCategory.spec.js loaded');
const { test } = require('@playwright/test');
const FieldTestData = require('../DataProvider/FieldCreationUpdationData.js');
const SanityTestSetup = require('./utils/SanityTestSetup.js');

// Uses centralized Sanity configuration from tests/Sanity/config/SanityConfig.js
test.describe.serial('Category Setup Tests', () => {
  let sanitySetup, sys, apiCapture;

  // Use Sanity Config for timeout
  test.setTimeout(SanityTestSetup.getTestTimeout());

  test.beforeAll(async () => {
    console.log('beforeAll starting');

    // Initialize Sanity test setup
    sanitySetup = new SanityTestSetup();
    const instances = await sanitySetup.completeSetup();

    // Extract needed instances
    sys = instances.sys;
    apiCapture = instances.apiCapture;

    // Navigate to Categories
    await sys.clickCategories();
    console.log(`✅ Sanity Category: Setup completed on ${SanityTestSetup.getEnvironment().toUpperCase()}`);
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
    // Use Sanity setup cleanup
    await sanitySetup.cleanup();
  });
});