console.log('RBL setupCategory.spec.js loaded');
const { test } = require('@playwright/test');
const RBLAdminData = require('../../DataProvider/RBLAdminData.js');
const RBLTestSetup = require('../utils/RBLTestSetup.js');

test.describe.serial('RBL - Category Setup Tests', () => {
  let rblSetup, sys, apiCapture;

  // Use RBL Config for timeout
  test.setTimeout(RBLTestSetup.getTestTimeout());

  test.beforeAll(async () => {
    console.log('RBL Category beforeAll starting');

    // Initialize RBL test setup
    rblSetup = new RBLTestSetup();
    const instances = await rblSetup.completeSetup();

    // Extract needed instances
    sys = instances.sys;
    apiCapture = instances.apiCapture;

    // Navigate to Categories
    await sys.clickCategories();
    console.log('RBL Category beforeAll finished');
  });

  test('RBL Create Category', async () => {
    console.log('RBL Create Category test running');
    const categoryData = RBLAdminData.CategoryCreationData();
    console.log('DEBUG RBL CategoryData:', categoryData);
    
    for (const data of categoryData) {
      const { category } = data;
      console.log(`📋 Creating RBL category: ${category}`);
      await sys.setupCategories(category);
      console.log(`✅ RBL category creation completed for: ${category}`);
    }
  });

  test.skip('RBL Update Category', async () => {
    const categoryData = RBLAdminData.CategoryUpdationData();
    console.log('DEBUG RBL CategoryUpdationData:', categoryData);
    
    for (const data of categoryData) {
      const { category, newCategory } = data;
      console.log(`📋 Updating RBL category from: ${category} to: ${newCategory}`);
      await sys.updateCategory(category, newCategory);
      console.log(`✅ RBL category updation completed for: ${category}`);
    }
  });

  test.afterAll(async () => {
    // Use RBL setup cleanup
    await rblSetup.cleanup();
  });
});
