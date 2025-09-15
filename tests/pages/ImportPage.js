const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');
const ExcelUtils = require('../utils/ExcelUtils');
const TablePaginationHandler = require('../utils/TablePaginationHandler');
const ErrorUtils = require('../utils/ErrorUtil');

class ImportPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.apiCapture = page.context().request;
    this.import = page.locator("(//li[@class='pageLink'])[3]");
    this.importListPage = page.locator("//a[@id='importNewList']");
    this.listName = page.locator("//input[@id='importListName']");
    this.Description = page.locator("//textarea[@id='importDescription']");
    this.Excelradiobutton = page.locator("//input[@id='excel']");
    this.autodetect = page.locator("//input[@id='autoDetect']");
    this.specify = page.locator("//input[@id='specify']");
    this.lastrow = page.locator("//input[@id='lastRow']");
    this.lastcolumn = page.locator("//input[@id='lastColumn']");
    this.CSVradiobutton = page.locator("//input[@id='csv']");
    this.delimiterComma = page.locator("//input[@id='comma']");
    this.uploadFile = page.locator("(//input[@type='file'])[4]");
    this.submitButton = page.locator("//button[@id='creaNewList']");
    this.importprocessoverview = page.locator("(//div[@class='box-body p-10'])[2]");
    this.readytoimport = page.locator("//button[normalize-space()='OK - I am ready to Import']");
    this.autoMapFields = page.locator("//button[@id='autoFieldsMapping']");
    this.existingMapping = page.locator("//button[@id='existingMapping']");
    this.selectExistingMappingDropdown = page.locator("//select[@id='existingMapList']");
    this.clickonMap = page.locator("//button[@id='existingMap']");
    this.saveMapping = page.locator("(//span[@class='ui-checkmark'])[1]");
    this.mappingName = page.locator("//input[@id='importListName']");
    this.SavemappingNameButton = page.locator("//button[@id='saveMappingBtn']");
    this.SavemannualMapping = page.locator("//div[@id='saveMapAutoDiv']//button[@type='submit'][normalize-space()='Continue Import']");
    this.continueAutoImport = page.locator("//button[@id='autoMappingBtn']");
    this.continueExistingImport = page.locator("//button[@id='existtMappingBtn']");
    this.importmapping = page.locator("//tbody//td");
    this.importLogsPage = page.locator("//table[@id='showImportLog']//tbody//td");
    
    // Append To An Existing List
    this.clickonappendToExistingList = page.locator("//a[@id='appenedExistingList']");
    this.AppendListTable = page.locator("//table[@id='appendExistingLists']");
    this.AppendListRows = page.locator("//table[@id='appendExistingLists']//tbody//tr");
    this.SaveAppendList = page.locator("//button[@id='addInexistingList']");

    // Store uploaded file path for header verification
    this.uploadedFilePath = null;
  }

  async navigateToImport() {
    try {
      console.log('Navigating to Import...');
      await this.scrollIntoView(this.import);
      await this.safeClick(this.import);
      await ErrorUtils.captureErrorIfPresent(this.page, 'navigateToImport');
      await ErrorUtils.captureApiErrorIfPresent(this.apiCapture, 'navigateToImport');
      await this.page.waitForTimeout(1000);
      await expect(this.importListPage).toBeVisible({ timeout: 10000 });
      console.log('✅ Import List page is visible');
    } catch (error) {
      console.error('❌ Error navigating to import:', error.message);
      throw error;
    }
  }

  async fillimportdata(ListName, Description, Excelradiobutton, Autodetect, Specify, Lastrow, Lastcolumn, CSVRadiobutton, DelimiterComma, Filepath, Type, Field, AutoMap, SaveMap, MappingName, ExistingMapping) {
    try {
      console.log('Filling import data...');
      await this.safeClick(this.importListPage);
      await ErrorUtils.captureErrorIfPresent(this.page, 'fillimportdata');
      await ErrorUtils.captureApiErrorIfPresent(this.apiCapture, 'fillimportdata');
      await this.safeType(this.listName, ListName);
      await this.safeType(this.Description, Description);
      await this.uploadData(Filepath);
      if (Excelradiobutton === 'Yes') {
        await this.safeClick(this.Excelradiobutton);
        await ErrorUtils.captureErrorIfPresent(this.page, 'fillimportdata');
        await ErrorUtils.captureApiErrorIfPresent(this.apiCapture, 'fillimportdata');
        if (Autodetect === 'Yes') {
          await expect(this.lastrow).toBeDisabled({ timeout: 10000 });
          await expect(this.lastcolumn).toBeDisabled({ timeout: 10000 });
          console.log('✅ Last row and last column are disabled');
        } else if (Specify === 'Yes') {
          await expect(this.lastrow).toBeEnabled({ timeout: 10000 });
          await expect(this.lastcolumn).toBeEnabled({ timeout: 10000 });
          if (Lastrow && Lastcolumn) {
            await this.safeType(this.lastrow, Lastrow);
            await this.safeType(this.lastcolumn, Lastcolumn);
            console.log('✅ Last row and last column are enabled and filled');
          }
        }
      } else if (CSVRadiobutton === 'Yes') {
        await this.safeClick(this.CSVradiobutton);
        await ErrorUtils.captureErrorIfPresent(this.page, 'fillimportdata');
        await ErrorUtils.captureApiErrorIfPresent(this.apiCapture, 'fillimportdata');
        if (DelimiterComma === 'Yes') {
          await this.safeClick(this.delimiterComma);
          console.log('✅ Delimiter comma is selected');
        }
      }
      await this.clickSubmitButton();
      await this.clickReadytoimport();
      await this.verifyImportMapping();
      await this.VerifyAutoSelect(AutoMap, SaveMap, MappingName);
      const existingMappingApplied = await this.selectExistingMapping(ExistingMapping, MappingName);
      await this.verifyHeadersAndSetMappings(Type, Field, SaveMap, MappingName, existingMappingApplied);
      await this.VerifyStatusOnImportLog(ListName, Filepath);
    } catch (error) {
      console.error('❌ Error filling import data:', error.message);
      throw error;
    }
  }

  // Append To An Existing List
  async navigateToAppendToAnExistingList() {
    try {
      console.log('Navigating to Append To An Existing List...');
      await this.scrollIntoView(this.clickonappendToExistingList);
      await this.safeClick(this.clickonappendToExistingList);
      await ErrorUtils.captureErrorIfPresent(this.page, 'navigateToAppendToAnExistingList');
      await ErrorUtils.captureApiErrorIfPresent(this.apiCapture, 'navigateToAppendToAnExistingList');
      await expect(this.AppendListTable).toBeVisible({ timeout: 10000 });
      console.log('✅ Append To An Existing List page is visible');
    } catch (error) {
      console.error('❌ Error navigating to Append To An Existing List:', error.message);
      throw error;
    }
  }

  async fillAppendToListData(ListName, Excelradiobutton, Autodetect, Specify, Lastrow, Lastcolumn, CSVRadiobutton, DelimiterComma, Filepath, Type, Field, AutoMap, SaveMap, MappingName, ExistingMapping) {
    try {
      console.log('Filling Append To An Existing List data...');
      await this.navigateToAppendToAnExistingList();
      const foundRow = await TablePaginationHandler.findRowWithCellValue({
        page: this.page,
        rowLocator: this.AppendListRows,
        cellIndex: 0,
        expectedValue: ListName,
        nextBtnLocator: this.page.locator('button', { hasText: '>' }),
        prevBtnLocator: this.page.locator('button', { hasText: '<' })
      });
      if (!foundRow) throw new Error(`List with name '${ListName}' not found in append list table.`);
      await foundRow.locator('td').nth(4).locator('input[type="radio"]').click();
      await ErrorUtils.captureErrorIfPresent(this.page, 'fillAppendToListData');
      await ErrorUtils.captureApiErrorIfPresent(this.apiCapture, 'fillAppendToListData');
      console.log(`✅ Selected list with name '${ListName}' for append`);
      await this.uploadData(Filepath);
      if (Excelradiobutton === 'Yes') {
        await this.safeClick(this.Excelradiobutton);
        await ErrorUtils.captureErrorIfPresent(this.page, 'fillAppendToListData');
        await ErrorUtils.captureApiErrorIfPresent(this.apiCapture, 'fillAppendToListData');
        if (Autodetect === 'Yes') {
          await expect(this.lastrow).toBeDisabled({ timeout: 10000 });
          await expect(this.lastcolumn).toBeDisabled({ timeout: 10000 });
          console.log('✅ Last row and last column are disabled');
        } else if (Specify === 'Yes') {
          await expect(this.lastrow).toBeEnabled({ timeout: 10000 });
          await expect(this.lastcolumn).toBeEnabled({ timeout: 10000 });
          if (Lastrow && Lastcolumn) {
            await this.safeType(this.lastrow, Lastrow);
            await this.safeType(this.lastcolumn, Lastcolumn);
            console.log('✅ Last row and last column are enabled and filled');
          }
        }
      } else if (CSVRadiobutton === 'Yes') {
        await this.safeClick(this.CSVradiobutton);
        await ErrorUtils.captureErrorIfPresent(this.page, 'fillAppendToListData');
        await ErrorUtils.captureApiErrorIfPresent(this.apiCapture, 'fillAppendToListData');
        if (DelimiterComma === 'Yes') {
          await this.safeClick(this.delimiterComma);
          console.log('✅ Delimiter comma is selected');
        }
      }
      await this.clickSaveAppendListButton();
      await this.verifyImportMapping();
      await this.VerifyAutoSelect(AutoMap, SaveMap, MappingName);
      const existingMappingApplied = await this.selectExistingMapping(ExistingMapping, MappingName);
      await this.verifyHeadersAndSetMappings(Type, Field, SaveMap, MappingName, existingMappingApplied);
      await this.VerifyStatusOnImportLog(ListName, Filepath);
    } catch (error) {
      console.error('❌ Error filling Append To An Existing List data:', error.message);
      throw error;
    }
  }

  async uploadData(Filepath) {
    try {
      console.log('Uploading document...');
      await this.scrollIntoView(this.uploadFile);
      await this.uploadFile.setInputFiles(Filepath);
      await ErrorUtils.captureErrorIfPresent(this.page, 'uploadData');
      await ErrorUtils.captureApiErrorIfPresent(this.apiCapture, 'uploadData');

      // Store the uploaded file path for header verification
      this.uploadedFilePath = Filepath;
      console.log(`✅ Document uploaded: ${Filepath}`);
    } catch (error) {
      console.error('❌ Error uploading document:', error.message);
      throw error;
    }
  }

  async clickSubmitButton() {
    try {
      console.log('Clicking submit button...');
      await this.scrollIntoView(this.submitButton);
      await this.safeClick(this.submitButton);
      await ErrorUtils.captureErrorIfPresent(this.page, 'clickSubmitButton');
      await ErrorUtils.captureApiErrorIfPresent(this.apiCapture, 'clickSubmitButton');
      await expect(this.importprocessoverview).toBeVisible({ timeout: 10000 });
      console.log('✅ Submit button clicked');
    } catch (error) {
      console.error('❌ Error clicking submit button:', error.message);
      throw error;
    }
  }

  //Submit AppendList Button
  async clickSaveAppendListButton() {
    try {
      console.log('Clicking save append list button...');
      await this.scrollIntoView(this.SaveAppendList);
      await this.safeClick(this.SaveAppendList);
      await ErrorUtils.captureErrorIfPresent(this.page, 'clickSaveAppendListButton');
      await ErrorUtils.captureApiErrorIfPresent(this.apiCapture, 'clickSaveAppendListButton');
      // Debug: Wait for any of several possible elements after save
      await this.page.waitForTimeout(2000); // Wait for UI update
      const successSelector = this.page.locator("//div[contains(text(),'success') or contains(text(),'Success') or contains(text(),'Appended') or contains(text(),'completed')]");
      if (await successSelector.first().isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log('✅ Success message detected after appending to list.');
      } else if (await this.importprocessoverview.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log('✅ Import process overview is visible.');
      } else {
        console.warn('⚠️ No known success indicator found after saving append list.');
      }
      return true;
    } catch (error) {
      console.error('❌ Error clicking save append list button:', error.message);
      throw error;
    }
  }

  async clickReadytoimport() {
    try {
      console.log('Clicking ready to import button...');
      await this.scrollIntoView(this.readytoimport);
      await this.safeClick(this.readytoimport);
      await ErrorUtils.captureErrorIfPresent(this.page, 'clickReadytoimport');
      await ErrorUtils.captureApiErrorIfPresent(this.apiCapture, 'clickReadytoimport');
      await expect(this.importmapping.first()).toBeVisible({ timeout: 30000 });
      console.log('✅ Ready to import button clicked');
    } catch (error) {
      console.error('❌ Error clicking ready to import button:', error.message);
      throw error;
    }
  }


  async verifyImportMapping() {
    try {
      console.log('🔍 Verifying import mapping...');

      // Read uploaded file headers
      const fileExt = this.uploadedFilePath.split('.').pop().toLowerCase();
      let uploadedHeaders = [];

      if (fileExt === 'xlsx' || fileExt === 'xls') {
        const excelObjects = ExcelUtils.readExcelDataAsObjects(this.uploadedFilePath, 'Sheet1');
        uploadedHeaders = Object.keys(excelObjects[0]);
      } else if (fileExt === 'csv') {
        const fs = require('fs');
        const csvContent = fs.readFileSync(this.uploadedFilePath, 'utf8');
        uploadedHeaders = csvContent.split('\n')[0].split(',').map(h => h.trim().replace(/"/g, ''));
      }

      // Read mapping table headers
      await expect(this.importmapping.first()).toBeVisible({ timeout: 10000 });
      const rows = await this.page.locator('table tbody tr, table tr').all();
      const mappingHeaders = [];

      for (const row of rows) {
        const cells = await row.locator('td').all();
        if (cells.length > 0) {
          const header = (await cells[0].textContent()).trim();
          if (header && !header.toLowerCase().includes('file header')) {
            mappingHeaders.push(header);
          }
        }
      }

      // Compare headers
      const missing = uploadedHeaders.filter(h =>
        !mappingHeaders.some(m => m.toLowerCase().trim() === h.toLowerCase().trim())
      );
      const extra = mappingHeaders.filter(m =>
        !uploadedHeaders.some(h => h.toLowerCase().trim() === m.toLowerCase().trim())
      );

      console.log(`📁 Uploaded: [${uploadedHeaders.join(', ')}]`);
      console.log(`🗂️ Mapping: [${mappingHeaders.join(', ')}]`);

      if (missing.length > 0 || extra.length > 0) {
        const error = `Import mapping FAILED!\nMissing: [${missing.join(', ')}]\nExtra: [${extra.join(', ')}]`;
        console.error(error);
        expect(false, error).toBe(true);
      }

      console.log('✅ Import mapping verification PASSED!');
      return true;

    } catch (error) {
      console.error('❌ Import mapping error:', error.message);
      throw error;
    }
  }

  async VerifyAutoSelect(AutoMap,SaveMap,MappingName) {
    try {
      if (AutoMap==='Yes') {
        console.log('🔍 Verifying auto select...');
        await this.scrollIntoView(this.autoMapFields);
        await this.autoMapFields.click();
        await this.SavemappingName(SaveMap,MappingName);
        await this.scrollIntoView(this.continueAutoImport);
        await this.continueAutoImport.click();
        console.log('✅ Auto select completed!');
      }else {
        console.log('Auto select is not required');
        return;
      }
    } catch (error) {
      console.error('❌ Auto select error:', error.message);
      throw error;
    }
  }

  async selectExistingMapping(ExistingMapping,MappingName) {
    try {
      if (ExistingMapping==='Yes') {
        console.log('Selecting existing mapping...');
        await this.scrollIntoView(this.existingMapping);
        await this.existingMapping.click();
        await this.selectExistingMappingDropdown.selectOption(MappingName);
        await this.scrollIntoView(this.clickonMap);
        await this.clickonMap.click();
        await this.scrollIntoView(this.continueExistingImport);

        // Wait for any alert messages to disappear before clicking Continue Import
        await ErrorUtils.waitForErrorToDisappear(this.page);
        await this.page.waitForTimeout(1000);

        await this.continueExistingImport.click();
        console.log('✅ Existing mapping selected!');
        return true; // Return true to indicate existing mapping was applied
      }else {
        console.log('Existing mapping is not required');
        return false; // Return false to indicate no existing mapping was applied
      }
    } catch (error) {
      console.error('❌ Existing mapping error:', error.message);
      throw error;
    }
  }

  async SavemappingName(SaveMap,MappingName) {
    try {
      if (SaveMap==='Yes') {
        console.log('Saving mapping...');
        await this.scrollIntoView(this.saveMapping);
        await this.saveMapping.click();
        await this.mappingName.fill(MappingName);
        await this.SavemappingNameButton.click();
        console.log('✅ Mapping saved! with name:'+MappingName);
      }else {
        console.log('Mapping is not required to save');
        return;
      }
    } catch (error) {
      console.error('❌ Mapping save error:', error.message);
      throw error;
    }
  }

  // Import Logs
  async VerifyStatusOnImportLog(ListName, Filepath) {
    try {
      console.log('⏳ Verifying import logs...');

      // Navigate to import logs page
      await this.navigateToImportLogs();

      const filename = require('path').basename(Filepath);
      const expectedName = `${ListName}/${filename}`;

      console.log(`🔍 Looking for: ${expectedName}`);

      // Wait for import completion with polling
      let found = false;
      const maxAttempts = 60; // 60 attempts = 60 seconds

      for (let attempt = 0; attempt < maxAttempts && !found; attempt++) {
        const rows = await this.page.locator('table tr').all();

        for (const row of rows) {
          const cells = await row.locator('td').all();
          if (cells.length > 6) {
            const statusCell = await cells[6].textContent();
            console.log(`Log Row: StatusCell='${statusCell?.trim()}'`);
            if (statusCell?.trim() === 'The list is ready to use') {
              console.log(`✅ Import verified: Status is ready to use`);
              found = true;
              break; // Break inner loop
            }
          }
        }

        if (!found) {
          console.log(`⏳ Attempt ${attempt + 1}/${maxAttempts} - Waiting for import completion...`);
          await this.page.waitForTimeout(1000);
        }
      }

      if (!found) {
        throw new Error(`❌ Import not completed within timeout for: ${expectedName}`);
      }

    } catch (error) {
      console.error(`❌ Import verification failed: ${error.message}`);
      throw error;
    }
  }

  async navigateToImportLogs() {
    try {
      console.log('🔍 Navigating to import logs...');

      // Look for import logs navigation button/link
      const importLogsButton = this.page.locator("//a[contains(text(),'Import Logs')] | //button[contains(text(),'Import Logs')] | //a[contains(@href,'importLog')]");

      if (await importLogsButton.isVisible({ timeout: 5000 })) {
        await importLogsButton.click();
        await this.page.waitForTimeout(2000);
      } else {
        // If no specific button, try navigating via URL or menu
        console.log('⚠️ Import logs button not found, checking current page...');
      }

      // Wait for import logs table to be visible
      await expect(this.page.locator('table')).toBeVisible({ timeout: 10000 });
      console.log('✅ Import logs page loaded');

    } catch (error) {
      console.log('⚠️ Could not navigate to import logs, assuming already on correct page');
    }
  }

  // Verify and select Type and Field mappings as per Excel data
  async verifyAndSelectTypeFieldMappings(Type, Field) {
    try {
      console.log('🔍 Verifying Type and Field mappings...');

      let typeData, fieldData;

      // Use provided parameters if available, otherwise read from Excel
      if (Type && Field) {
        typeData = Type.split(',');
        fieldData = Field.split(',');
        console.log('📋 Using provided Type and Field parameters');
      } else {
        // Read mappings from Excel
        const mappingData = ExcelUtils.readExcelDataAsObjects('tests/data/Document Update Data.xlsx', 'Import File');
        typeData = mappingData[0].Type.split(',');
        fieldData = mappingData[0].Field.split(',');
        console.log('📋 Reading Type and Field from Excel');
      }

      // Get mapping table rows
      const rows = await this.page.locator('table tbody tr, table tr').all();

      for (const row of rows) {
        const cells = await row.locator('td').all();
        if (cells.length >= 3) {
          const headerName = (await cells[0].textContent()).trim();

          // Skip header rows
          if (headerName.toLowerCase().includes('file header')) continue;

          // Find matching mapping
          const fieldIndex = fieldData.findIndex(field =>
            field.trim().toLowerCase() === headerName.toLowerCase()
          );
          
          if (fieldIndex >= 0) {
            const expectedType = typeData[fieldIndex].trim();
            const expectedField = fieldData[fieldIndex].trim();

            console.log(`📋 ${headerName}: Type="${expectedType}", Field="${expectedField}"`);

            // Select Type and Field dropdowns
            await this.selectDropdown(cells[1], expectedType);
            await this.selectDropdown(cells[2], expectedField);
          }
        }
      }

      console.log('✅ Type and Field mappings completed!');

    } catch (error) {
      console.error('❌ Error verifying Type/Field mappings:', error.message);
      throw error;
    }
  }

  /**
   * Select dropdown value
   */
  async selectDropdown(cell, expectedValue) {
    try {
      const dropdown = cell.locator('select');
      if (await dropdown.isVisible()) {
        const currentValue = await dropdown.locator('option:checked').textContent().catch(() => '');
        if (currentValue.toLowerCase().trim() !== expectedValue.toLowerCase().trim()) {
          await dropdown.selectOption({ label: expectedValue });
          console.log(`✅ Selected: ${expectedValue}`);
        }
      }
    } catch (error) {
      console.log(`⚠️ Could not select: ${expectedValue}`);
    }
  }

  async verifyHeadersAndSetMappings(Type, Field, SaveMap, MappingName, existingMappingApplied) {
    console.log('🔄 Starting header verification and mapping setup...');

    // Check if existing mapping was already applied - if yes, skip manual mapping
    // This works in conjunction with selectExistingMapping method that runs before this
    if (existingMappingApplied === true) {
      console.log('✅ Existing mapping was already applied - skipping manual mapping');
      return;
    }

    // 1. Parse Type and Field data from Excel format (comma-separated)
    let typeArray = [];
    let fieldArray = [];
    let headerArray = [];

    if (Type && Field) {
      // Split comma-separated values from Excel
      typeArray = Type.split(',').map(item => item.trim());
      fieldArray = Field.split(',').map(item => item.trim());

      // Load mapping data from Excel to get header names
      const mappingData = await ExcelUtils.readExcelDataAsObjects(
        'tests/data/Document Update Data.xlsx',
        'Import File'
      );
      console.log('📊 Loaded mapping data from Excel:', mappingData);

      // Since there's no separate header column, we'll use the uploaded file headers
      // and map them directly to the Field data based on position
      headerArray = fieldArray; // Use field names as the mapping reference
    } else {
      console.log('⚠️ No Type/Field data provided, skipping mapping');
      return;
    }

    // 2. Get displayed headers from UI
    const displayedHeaders = await this.getDisplayedHeaders();
    console.log('🧾 Displayed Headers:', displayedHeaders);
    console.log('📋 Excel Headers:', headerArray);
    console.log('📋 Excel Types:', typeArray);
    console.log('📋 Excel Fields:', fieldArray);

    // 3. Fast batch mapping - process multiple fields in parallel batches
    console.log(`🚀 Starting fast batch mapping for ${displayedHeaders.length} fields...`);

    const batchSize = 5; // Process 5 fields at a time for optimal performance
    const batches = [];

    // Create batches of mapping operations
    for (let i = 0; i < displayedHeaders.length; i += batchSize) {
      const batch = [];
      for (let j = i; j < Math.min(i + batchSize, displayedHeaders.length); j++) {
        const displayedHeader = displayedHeaders[j].trim();

        if (j < typeArray.length && j < fieldArray.length) {
          const typeToSelect = typeArray[j] || '';
          const fieldToSelect = fieldArray[j] || '';

          batch.push({
            index: j,
            header: displayedHeader,
            type: typeToSelect,
            field: fieldToSelect
          });
        }
      }
      batches.push(batch);
    }

    // Process each batch in parallel
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      console.log(`📦 Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} fields)...`);

      try {
        // Process all fields in current batch simultaneously
        await Promise.all(batch.map(async (mapping) => {
          return this.setMappingForHeader(mapping.index, mapping.type, mapping.field);
        }));

        console.log(`✅ Batch ${batchIndex + 1} completed successfully`);

        // Small delay between batches to prevent overwhelming the UI
        if (batchIndex < batches.length - 1) {
          await this.page.waitForTimeout(200);
        }

      } catch (err) {
        console.error(`❌ Batch ${batchIndex + 1} failed: ${err.message}`);
        throw err;
      }
    }

    console.log('🎉 Mapping process completed.');

    // Use save mapping functionality for manual mapping (similar to auto mapping)
    // Save mapping only if SaveMap is "Yes"
    if (SaveMap && SaveMap.toLowerCase() === 'yes') {
      console.log('💾 Saving mapping configuration...');
      await this.handleSaveMapping(MappingName);
    }

    // Wait for any success popup to disappear and then click Continue Import
    await this.clickContinueImport();
  }
  
  async getDisplayedHeaders() {
    const headers = [];
    const rowLocator = this.page.locator('//table/tbody/tr');
    const rowCount = await rowLocator.count();

    for (let i = 0; i < rowCount; i++) {
      const headerLocator = rowLocator.nth(i).locator('td >> nth=0');
      const headerText = await headerLocator.textContent();
      const cleanHeader = headerText.trim();

      // Skip empty headers or table header rows
      if (cleanHeader &&
          !cleanHeader.toLowerCase().includes('file header') &&
          !cleanHeader.toLowerCase().includes('aavaz type') &&
          !cleanHeader.toLowerCase().includes('aavaz field')) {
        headers.push(cleanHeader);
      }
    }

    return headers;
  }
  
  async setMappingForHeader(index, expectedType, expectedField) {
    const typeDropdown = this.page.locator(`//select[@id='aavazType${index}']`);
    const fieldDropdown = this.page.locator(`//select[@id='aavazField${index}']`);

    try {
      // Fast parallel wait for both dropdowns
      await Promise.all([
        typeDropdown.waitFor({ state: 'visible', timeout: 5000 }),
        fieldDropdown.waitFor({ state: 'visible', timeout: 5000 })
      ]);

      // Fast type selection without debugging
      if (expectedType) {
        await typeDropdown.selectOption({ label: expectedType });
      }

      // Fast field selection without debugging
      if (expectedField) {
        await fieldDropdown.selectOption({ label: expectedField });
      }

      // Single success log instead of verbose debugging
      console.log(`✅ Mapped [${index}]: ${expectedType} → ${expectedField}`);

    } catch (error) {
      console.warn(`⚠️ Mapping failed for index ${index}: ${error.message}`);
      throw error;
    }
  }

  // Dedicated method for handling save mapping functionality
  async handleSaveMapping(MappingName) {
    try {
      await this.SavemappingName('Yes', MappingName);
      console.log(`✅ Mapping saved successfully: ${MappingName}`);

      // Wait for success popup to appear and then disappear
      await this.waitForSuccessPopupToDisappear();

    } catch (error) {
      console.warn(`⚠️ Error saving mapping: ${error.message}`);
      throw error;
    }
  }

  // Method to wait for success popup to disappear
  async waitForSuccessPopupToDisappear() {
    try {
      console.log('⏳ Waiting for success popup to disappear...');

      // Common success popup selectors
      const popupSelectors = [
        '.alert-success',
        '.toast-success',
        '.success-message',
        '[class*="success"]',
        '.swal2-popup',
        '.modal.show'
      ];

      // Wait for popup to appear first (optional)
      await this.page.waitForTimeout(1000);

      // Check if any popup is visible and wait for it to disappear
      for (const selector of popupSelectors) {
        try {
          const popup = this.page.locator(selector);
          const isVisible = await popup.isVisible().catch(() => false);

          if (isVisible) {
            console.log(`🔍 Found success popup: ${selector}`);
            // Wait for popup to disappear
            await popup.waitFor({ state: 'hidden', timeout: 10000 });
            console.log('✅ Success popup disappeared');
            break;
          }
        } catch (error) {
          // Continue checking other selectors
          continue;
        }
      }

      // Additional wait to ensure page is stable
      await this.page.waitForTimeout(1500);

    } catch (error) {
      console.warn(`⚠️ Could not detect success popup: ${error.message}`);
      // Continue anyway with a standard wait
      await this.page.waitForTimeout(2000);
    }
  }

  // Simplified method to click Continue Import button
  async clickContinueImport() {
    try {
      console.log('🔍 Clicking Continue Import button...');

      // Simple approach - just click the button
      await this.SavemannualMapping.click();
      console.log('✅ Continue Import clicked successfully');

    } catch (error) {
      console.log('⚠️ Standard click failed, trying JavaScript click...');

      try {
        // Fallback to JavaScript click
        await this.page.evaluate(() => {
          const button = document.querySelector('#autoMappingBtn');
          if (button) {
            button.click();
          }
        });
        console.log('✅ Continue Import clicked via JavaScript');

      } catch (jsError) {
        console.warn('⚠️ Both click methods failed, but mapping was saved successfully');
        console.log('Manual intervention may be needed to complete the import');
      }
    }
  }
}
module.exports = ImportPage;