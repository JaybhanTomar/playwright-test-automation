const { test } = require('@playwright/test');
const ImportPage = require('../pages/ImportPage');
const DocumentUpdateTestData = require('../DataProvider/DocumentUpdateTestData');
const ExcelUtils = require('../utils/ExcelUtils');
const SanityTestSetup = require('./utils/SanityTestSetup.js');

// Uses centralized Sanity configuration from tests/Sanity/config/SanityConfig.js
test.describe.serial('Sanity - Import Tests', () => {
  let sanitySetup, importPage, page, apiCapture;

  // Use Sanity Config for timeout
  test.setTimeout(SanityTestSetup.getTestTimeout());

  test.beforeAll(async () => {
    // Initialize Sanity test setup
    sanitySetup = new SanityTestSetup();
    const instances = await sanitySetup.completeSetup();

    // Extract needed instances
    page = instances.page;
    apiCapture = instances.apiCapture;

    // Initialize import page
    importPage = new ImportPage(page);

    console.log(`✅ Sanity Import: Setup completed on ${SanityTestSetup.getEnvironment().toUpperCase()}`);
  });

  test.beforeEach(async () => {
    // Navigate to import page before each test
    await importPage.navigateToImport();
  });

   test('importFileTest', async () => {
    const importTestData = DocumentUpdateTestData.ImportData();

    // Check if there's any data to process
    if (!importTestData || importTestData.length === 0) {
      console.log('⚠️ No import data found in Excel. Test will complete.');
      return;
    }

    console.log(`📊 Processing ${importTestData.length} import test(s) from Excel data`);
    for (const data of importTestData) {
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
    // Use Sanity setup cleanup
    await sanitySetup.cleanup();
  });
});
