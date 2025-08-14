#!/usr/bin/env node

/**
 * Script to fix RBL test files with RBLTestSetup integration issues
 */

const fs = require('fs');
const path = require('path');

// Test files that need fixing
const testFiles = [
  'tests/RBL/RBL/C_setupSkill.spec.js',
  'tests/RBL/RBL/D_setupField.spec.js', 
  'tests/RBL/RBL/I_setupImportTest.spec.js',
  'tests/RBL/RBL/J_setupCampaignCreation.spec.js'
];

function fixTestFile(filePath) {
  console.log(`🔧 Fixing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add RBLTestSetup import if not present
  if (!content.includes('RBLTestSetup')) {
    // Find the last require statement
    const lines = content.split('\n');
    let lastRequireIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('require(') && lines[i].includes('const ')) {
        lastRequireIndex = i;
      }
    }
    
    if (lastRequireIndex !== -1) {
      lines.splice(lastRequireIndex + 1, 0, 'const RBLTestSetup = require(\'../utils/RBLTestSetup.js\');');
      content = lines.join('\n');
    }
  }
  
  // Add rblSetup variable declaration
  if (!content.includes('let rblSetup')) {
    content = content.replace(
      /(let \w+;\s*)+/,
      (match) => match + '  let rblSetup;\n'
    );
  }
  
  // Fix beforeAll setup
  const beforeAllPattern = /test\.beforeAll\(async \(\) => \{[\s\S]*?rblSetup = new RBLTestSetup\(\);[\s\S]*?\}\);/;
  if (beforeAllPattern.test(content)) {
    content = content.replace(
      beforeAllPattern,
      `test.beforeAll(async () => {
    console.log('RBL ${path.basename(filePath, '.spec.js')} beforeAll starting');
    rblSetup = new RBLTestSetup();
    const instances = await rblSetup.completeSetup();
    
    // Get instances from RBLTestSetup
    browser = instances.browser;
    context = instances.context;
    page = instances.page;
    sys = instances.sys;
    loginPage = instances.loginPage;
    baseUrlUtil = instances.baseUrlUtil;
    apiCapture = instances.apiCapture;
    
    console.log('RBL ${path.basename(filePath, '.spec.js')} beforeAll finished');
  });`
    );
  }
  
  // Fix afterAll cleanup
  const afterAllPattern = /test\.afterAll\(async \(\) => \{[\s\S]*?apiCapture\.logApiSummary\(\);[\s\S]*?\}\);/;
  if (afterAllPattern.test(content)) {
    content = content.replace(
      afterAllPattern,
      `test.afterAll(async () => {
    // Use RBLTestSetup cleanup
    if (rblSetup) {
      await rblSetup.cleanup();
    }
  });`
    );
  }
  
  // Fix variable declarations that might be missing
  if (!content.includes('let rblSetup') && content.includes('rblSetup = new')) {
    content = content.replace(
      'rblSetup = new RBLTestSetup()',
      'let rblSetup = new RBLTestSetup()'
    );
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Fixed: ${filePath}`);
}

function main() {
  console.log('🚀 Starting RBL test files fix...\n');
  
  testFiles.forEach(filePath => {
    const fullPath = path.resolve(filePath);
    if (fs.existsSync(fullPath)) {
      fixTestFile(fullPath);
    } else {
      console.log(`⚠️ File not found: ${filePath}`);
    }
  });
  
  console.log('\n🎉 All RBL test files fixed!');
}

if (require.main === module) {
  main();
}

module.exports = { fixTestFile };
