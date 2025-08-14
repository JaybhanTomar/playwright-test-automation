const { test } = require('@playwright/test');
const ImportPage = require('../../pages/ImportPage.js');
const DocumentUpdateTestData = require('../../DataProvider/DocumentUpdateTestData.js');
const RBLTestSetup = require('../utils/RBLTestSetup.js');

// Uses centralized RBL configuration from tests/RBL/config/RBLConfig.js
test.describe.serial('RBL - Import Setup Tests', () => {
  let rblSetup, importPage, apiCapture;

  // Use RBL Config for timeout
  test.setTimeout(RBLTestSetup.getTestTimeout());

  test.beforeAll(async () => {
    // Initialize RBL test setup
    rblSetup = new RBLTestSetup();
    const instances = await rblSetup.completeSetup();

    // Extract needed instances
    const { page } = instances;
    apiCapture = instances.apiCapture;

    // Initialize import page
    importPage = new ImportPage(page);

    console.log(`✅ RBL Import: Setup completed on ${RBLTestSetup.getEnvironment().toUpperCase()}`);
  });

  test.beforeEach(async () => {
    await importPage.navigateToImport();
  });

  test('RBL Import File Test', async () => {
    console.log('\n📋 Starting RBL Import test with Excel data...');
    const importTestData = DocumentUpdateTestData.ImportData();
    console.log('DEBUG RBL ImportData:', importTestData);

    // Check if there's any data to process
    if (!importTestData || importTestData.length === 0) {
      console.log('⚠️ No RBL import data found in Excel. Test will complete.');
      return;
    }

    console.log(`📊 Processing ${importTestData.length} RBL import file(s) from Excel data`);
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

      if (!ListName || ListName.trim() === "") {
        console.warn(`⚠️  Skipping RBL import: ListName is missing or empty.`);
        continue;
      }

      console.log(`\n📄 Running RBL import test for: ${ListName}`);
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
      console.log(`✅ RBL import test completed for: ${ListName}`);
    }
  });

  test('RBL Append To List Test', async () => {
    console.log('\n📋 Starting RBL Append To List test with Excel data...');
    const appendToListData = DocumentUpdateTestData.AppendToListData();
    console.log('DEBUG RBL AppendToListData:', appendToListData);

    // Check if there's any data to process
    if (!appendToListData || appendToListData.length === 0) {
      console.log('⚠️ No RBL append to list data found in Excel. Test will complete.');
      return;
    }

    console.log(`📊 Processing ${appendToListData.length} RBL append to list(s) from Excel data`);;
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

      if (!ListName || ListName.trim() === "") {
        console.warn(`⚠️  Skipping RBL append to list: ListName is missing or empty.`);
        continue;
      }

      console.log(`\n📋 Running RBL append to list test for: ${ListName}`);
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
      console.log(`✅ RBL append to list test completed for: ${ListName}`);
    }
  });

  test.afterAll(async () => {
    // Log API summary
    apiCapture.logApiSummary();
    // Use RBL setup cleanup
    await rblSetup.cleanup();
  });
});
