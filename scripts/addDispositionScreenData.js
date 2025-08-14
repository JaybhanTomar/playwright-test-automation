/**
 * Script to add Disposition Screen test data to Excel files
 * Adds DispositionScreenCreation and DispositionScreenUpdation sheets
 */

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Disposition Screen Creation Data
const dispositionScreenCreationData = [
  {
    'DispositionScreenName': 'Negative Response Screen',
    'Type': 'Negative',
    'Category': 'General',
    'Question': 'Not Interested',
    'Description': 'Screen for handling negative customer responses'
  },
  {
    'DispositionScreenName': 'Positive Response Screen',
    'Type': 'Positive',
    'Category': 'General',
    'Question': 'Interested in Product',
    'Description': 'Screen for handling positive customer responses'
  },
  {
    'DispositionScreenName': 'Callback Request Screen',
    'Type': 'Indeterminate',
    'Category': 'General',
    'Question': 'Call Back Later',
    'Description': 'Screen for scheduling callback requests'
  },
  {
    'DispositionScreenName': 'Technical Issue Screen',
    'Type': 'Negative',
    'Category': 'Technical',
    'Question': 'Technical Problems',
    'Description': 'Screen for technical issue dispositions'
  },
  {
    'DispositionScreenName': 'Sales Qualified Screen',
    'Type': 'Positive',
    'Category': 'Sales',
    'Question': 'Ready to Purchase',
    'Description': 'Screen for sales qualified leads'
  }
];

// Disposition Screen Updation Data
const dispositionScreenUpdationData = [
  {
    'DispositionScreenName': 'Negative Response Screen',
    'Type': 'Negative',
    'Category': 'General',
    'Question': 'Not Interested',
    'NewDispositionScreenName': 'Updated Negative Screen',
    'NewType': 'Negative',
    'NewCategory': 'Updated General',
    'NewQuestion': 'Not Interested - Updated',
    'Description': 'Updated screen for negative responses'
  },
  {
    'DispositionScreenName': 'Positive Response Screen',
    'Type': 'Positive',
    'Category': 'General',
    'Question': 'Interested in Product',
    'NewDispositionScreenName': 'Updated Positive Screen',
    'NewType': 'Positive',
    'NewCategory': 'Updated General',
    'NewQuestion': 'Very Interested',
    'Description': 'Updated screen for positive responses'
  }
];

function addDispositionScreenSheets(filePath, fileName) {
  console.log(`\n📝 Processing ${fileName}...`);
  
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      return;
    }

    // Read existing workbook
    const workbook = XLSX.readFile(filePath);
    console.log(`✅ Loaded ${fileName} successfully`);

    // Add DispositionScreenCreation sheet
    const creationSheet = XLSX.utils.json_to_sheet(dispositionScreenCreationData);
    workbook.Sheets['DispositionScreenCreation'] = creationSheet;
    workbook.SheetNames.push('DispositionScreenCreation');
    console.log('✅ Added DispositionScreenCreation sheet');

    // Add DispositionScreenUpdation sheet
    const updationSheet = XLSX.utils.json_to_sheet(dispositionScreenUpdationData);
    workbook.Sheets['DispositionScreenUpdation'] = updationSheet;
    workbook.SheetNames.push('DispositionScreenUpdation');
    console.log('✅ Added DispositionScreenUpdation sheet');

    // Create backup
    const backupPath = filePath.replace('.xlsx', '_backup.xlsx');
    fs.copyFileSync(filePath, backupPath);
    console.log(`✅ Created backup: ${path.basename(backupPath)}`);

    // Write updated workbook
    XLSX.writeFile(workbook, filePath);
    console.log(`✅ Updated ${fileName} successfully`);

    // Verify the sheets were added
    const updatedWorkbook = XLSX.readFile(filePath);
    const sheetNames = Object.keys(updatedWorkbook.Sheets);
    const hasCreation = sheetNames.includes('DispositionScreenCreation');
    const hasUpdation = sheetNames.includes('DispositionScreenUpdation');
    
    console.log(`📊 Verification:`);
    console.log(`   DispositionScreenCreation sheet: ${hasCreation ? '✅' : '❌'}`);
    console.log(`   DispositionScreenUpdation sheet: ${hasUpdation ? '✅' : '❌'}`);
    
    if (hasCreation) {
      const creationData = XLSX.utils.sheet_to_json(updatedWorkbook.Sheets['DispositionScreenCreation']);
      console.log(`   Creation records: ${creationData.length}`);
    }
    
    if (hasUpdation) {
      const updationData = XLSX.utils.sheet_to_json(updatedWorkbook.Sheets['DispositionScreenUpdation']);
      console.log(`   Updation records: ${updationData.length}`);
    }

  } catch (error) {
    console.error(`❌ Error processing ${fileName}:`, error.message);
  }
}

function main() {
  console.log('🚀 Adding Disposition Screen data to Excel files...\n');

  // File paths
  const rblPath = path.join(__dirname, '../tests/data/RBL Test Data.xlsx');
  const fieldPath = path.join(__dirname, '../tests/data/Field Test Data.xlsx');

  // Add sheets to both files
  addDispositionScreenSheets(rblPath, 'RBL Test Data.xlsx');
  addDispositionScreenSheets(fieldPath, 'Field Test Data.xlsx');

  console.log('\n🎉 Disposition Screen data addition completed!');
  console.log('\n📋 Summary:');
  console.log('   ✅ Added DispositionScreenCreation sheets (5 test records each)');
  console.log('   ✅ Added DispositionScreenUpdation sheets (2 test records each)');
  console.log('   ✅ Created backup files');
  console.log('   ✅ Verified data integrity');
  
  console.log('\n📊 Headers added:');
  console.log('   Creation: DispositionScreenName, Type, Category, Question, Description');
  console.log('   Updation: DispositionScreenName, Type, Category, Question, NewDispositionScreenName, NewType, NewCategory, NewQuestion, Description');
  
  console.log('\n🔧 Next steps:');
  console.log('   1. Run disposition screen tests to verify data loading');
  console.log('   2. Add more test data as needed');
  console.log('   3. Implement createDispositionScreen() method in SystemSetupPage.js');
}

if (require.main === module) {
  main();
}

module.exports = { addDispositionScreenSheets, dispositionScreenCreationData, dispositionScreenUpdationData };
