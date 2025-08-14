const { test, chromium } = require('@playwright/test');
const DocumentsPage = require('../../pages/DocumentsPage.js');
const LoginPage = require('../../pages/LoginPage.js');
const BaseURL = require('../../utils/BaseURL.js');
const DocumentUpdateTestData = require('../../DataProvider/DocumentUpdateTestData.js');
const ApiCapture = require('../../utils/ApiCapture.js');
const loginTestData = require('../../DataProvider/UserCreationUpdationData.js').userLoginData();

test.describe('Document Setup Tests', () => {
  let documentsPage, loginPage, baseUrlUtil, browser, context, page, apiCapture;

  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    baseUrlUtil = new BaseURL(page);
    loginPage = new LoginPage(page);
    documentsPage = new DocumentsPage(page);
    apiCapture = new ApiCapture(page);

    // Start API monitoring
    apiCapture.startMonitoring();

    // Use BaseURL utility to navigate to qc6 environment
    await baseUrlUtil.qc6();
    const { email, password, role } = loginTestData[0];
    await loginPage.login(email, password, role);
  });

  test.beforeAll(async () => {
    await documentsPage.NavigateToDocuments();
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
  });
  test.afterAll(async () => {
    apiCapture.logApiSummary();
    await page.close();
    await context.close();
    await browser.close();
  });
});
