/**
 * Script to update all RBL test files to use centralized configuration
 * This ensures all RBL tests use the same environment configuration
 */

const fs = require('fs');
const path = require('path');

const RBL_TEST_DIR = path.join(__dirname, '../RBL');

// List of RBL test files to update
const testFiles = [
  '1_Tabbing.spec.js',
  'A_UsersCreationUpdation.spec.js',
  'B_setupCategory.spec.js',
  'C_setupSkill.spec.js',
  'D_setupField.spec.js',
  'E_setupLeadField.spec.js',
  'F_setupLeadProcessField.spec.js',
  'G_setupDispositionQuestion.spec.js',
  'H_setupDispositionScreen.spec.js',
  'I_setupImportTest.spec.js',
  'J_setupCampaignCreation.spec.js'
];

function updateTestFile(filePath) {
  console.log(`📝 Updating: ${path.basename(filePath)}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add RBLTestSetup import if not present
  if (!content.includes('RBLTestSetup')) {
    // Find the last require statement
    const requireLines = content.split('\n').filter(line => line.includes('require('));
    if (requireLines.length > 0) {
      const lastRequireLine = requireLines[requireLines.length - 1];
      const lastRequireIndex = content.indexOf(lastRequireLine) + lastRequireLine.length;
      
      content = content.slice(0, lastRequireIndex) + 
                '\nconst RBLTestSetup = require(\'../utils/RBLTestSetup.js\');' +
                content.slice(lastRequireIndex);
    }
  }
  
  // Replace timeout setting
  content = content.replace(
    /test\.setTimeout\(\d+\);.*\/\/ \d+ minutes/g,
    'test.setTimeout(RBLTestSetup.getTestTimeout());'
  );
  
  // Replace browser launch
  content = content.replace(
    /browser = await chromium\.launch\(\{ headless: false \}\);/g,
    'rblSetup = new RBLTestSetup();\n    const instances = await rblSetup.completeSetup();'
  );
  
  // Replace environment navigation
  content = content.replace(
    /await baseUrlUtil\.qc2\(\);/g,
    '// Environment navigation handled by RBLTestSetup'
  );
  
  // Add comment about centralized config
  if (!content.includes('RBL Config')) {
    content = content.replace(
      /test\.describe\.serial\(/,
      '// Uses centralized RBL configuration from tests/RBL/config/RBLConfig.js\ntest.describe.serial('
    );
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Updated: ${path.basename(filePath)}`);
}

function main() {
  console.log('🚀 Starting RBL test files update...\n');
  
  testFiles.forEach(fileName => {
    const filePath = path.join(RBL_TEST_DIR, fileName);
    if (fs.existsSync(filePath)) {
      updateTestFile(filePath);
    } else {
      console.log(`⚠️ File not found: ${fileName}`);
    }
  });
  
  console.log('\n🎉 All RBL test files updated successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Review the updated files');
  console.log('2. Adjust tests/RBL/config/RBLConfig.js to change environment');
  console.log('3. Run tests to verify configuration works');
}

if (require.main === module) {
  main();
}

module.exports = { updateTestFile };
