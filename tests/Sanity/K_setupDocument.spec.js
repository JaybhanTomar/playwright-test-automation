const { test } = require('@playwright/test');
const DocumentsPage = require('../pages/DocumentsPage.js');
const DocumentUpdateTestData = require('../DataProvider/DocumentUpdateTestData');
const SanityTestSetup = require('./utils/SanityTestSetup.js');

// Uses centralized Sanity configuration from tests/Sanity/config/SanityConfig.js
test.describe.serial('Sanity - Document Setup Tests', () => {
  let sanitySetup, documentsPage, sys, page, apiCapture;

  // Use Sanity Config for timeout
  test.setTimeout(SanityTestSetup.getTestTimeout());

  test.beforeAll(async () => {
    // Initialize Sanity test setup
    sanitySetup = new SanityTestSetup();
    const instances = await sanitySetup.completeSetup();

    // Extract needed instances
    page = instances.page;
    sys = instances.sys;
    apiCapture = instances.apiCapture;

    // Initialize documents page
    documentsPage = new DocumentsPage(page);

    // Navigate to documents
    await documentsPage.gotoDocuments();

    console.log(`✅ Sanity Documents: Setup completed on ${SanityTestSetup.getEnvironment().toUpperCase()}`);
  });

  test('UploadDocumentTest', async () => {
    const DocumentData = DocumentUpdateTestData.uploadDocumentData();
    for (let i = 0; i < DocumentData.length; i++) {
      const data = DocumentData[i];
      const {
        category, name, filePath, description
      } = data;
      console.log(`\n📄 Running import test for: ${name}`);
      await documentsPage.addDocument(
        category,
        name,
        filePath,
        description
      );
      console.log(`✅ Import test completed for: ${name}`);
    }
  });

  test('UpdateDocumentTest', async () => {
    const DocumentData = DocumentUpdateTestData.UpdateDocumentData();
    for (let i = 0; i < DocumentData.length; i++) {
      const data = DocumentData[i];
      const { DocumentName, category, newDocumentName, description } = data;
      console.log(`\n📄 Running update test for: ${DocumentName}`);
      await documentsPage.updateDocument(DocumentName, category, newDocumentName, description);
      console.log(`✅ Update test completed for: ${DocumentName}`);
    }
  });
  test.afterAll(async () => {
    // Use Sanity setup cleanup
    await sanitySetup.cleanup();
  });
});
