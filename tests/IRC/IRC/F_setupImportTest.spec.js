console.log('setupImportTest.spec.js loaded');
const { test, chromium } = require('@playwright/test');
const ImportPage = require('../../pages/ImportPage');
const DocumentUpdateTestData = require('../../DataProvider/DocumentUpdateTestData');
const BaseURL = require('../../utils/BaseURL');
const LoginPage = require('../../pages/LoginPage');
const ApiCapture = require('../../utils/ApiCapture');

// Use test.describe.serial to ensure tests run in the same browser context/session

test.describe('Import Tests', () => {
  let importPage;
  let loginPage;
  let baseUrlUtil;
  let browser;
  let context;
  let page;
  let apiCapture;

  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    baseUrlUtil = new BaseURL(page);
    loginPage = new LoginPage(page);
    importPage = new ImportPage(page);
    apiCapture = new ApiCapture(page);

    // Start API monitoring
    apiCapture.startMonitoring();

    // Use BaseURL utility to navigate to qc6 environment
    await baseUrlUtil.qc6();

    // Login once and keep session
    const loginTestData = require('../../DataProvider/UserCreationUpdationData').userLoginData();
    const { email, password, role } = loginTestData[0];
    await loginPage.login(email, password, role);
  });

  test.beforeEach(async () => {
    // Reuse the same page/session, just navigate to import page
    await importPage.navigateToImport();
  });

   test('importFileTest', async () => {
    const importTestData = DocumentUpdateTestData.IrcImportData();
    for (let i = 0; i < importTestData.length; i++) {
      const data = importTestData[i];
      const {
        ListName,
        Description,
        Excelradiobutton,
        Autodetect,
        Specify,
        Lastrow,
        Lastcolumn,
        CSVRadiobutton,
        DelimiterComma,
        Filepath,
        Type,
        Field,
        AutoMap,
        SaveMap,
        MappingName,
        ExistingMapping
      } = data;
      console.log(`\n📄 Running import test for: ${ListName}`);
      await importPage.fillimportdata(
        ListName,
        Description,
        Excelradiobutton,
        Autodetect,
        Specify,
        Lastrow,
        Lastcolumn,
        CSVRadiobutton,
        DelimiterComma,
        Filepath,
        Type,
        Field,
        AutoMap,
        SaveMap,
        MappingName,
        ExistingMapping
      );
      console.log(`✅ Import test completed for: ${ListName}`);
    }
  });

  test.skip('appendToListTest', async () => {
    const appendToListData = DocumentUpdateTestData.AppendToListData();
    for (let i = 0; i < appendToListData.length; i++) {
      const data = appendToListData[i];
      const {
        ListName,
        Excelradiobutton,
        Autodetect,
        Specify,
        Lastrow,
        Lastcolumn,
        CSVRadiobutton,
        DelimiterComma,
        Filepath,
        Type,
        Field,
        AutoMap,
        SaveMap,
        MappingName,
        ExistingMapping
      } = data;
      console.log(`\n📋 Running append to list test for: ${ListName}`);
      await importPage.fillAppendToListData(
        ListName,
        Excelradiobutton,
        Autodetect,
        Specify,
        Lastrow,
        Lastcolumn,
        CSVRadiobutton,
        DelimiterComma,
        Filepath,
        Type,
        Field,
        AutoMap,
        SaveMap,
        MappingName,
        ExistingMapping
      );
      console.log(`✅ Append to list test completed for: ${ListName}`);
    }
  });

  test.afterAll(async () => {
    // Log API summary
    apiCapture.logApiSummary();
    
    await page.close();
    await context.close();
    await browser.close();
  });
});
