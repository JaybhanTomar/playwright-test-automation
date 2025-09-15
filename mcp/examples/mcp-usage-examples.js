/**
 * MCP Usage Examples for Playwright Project
 * Demonstrates how to use MCP servers for test automation enhancement
 */

const { MCPClient, MCPDataClient, MCPAnalyzerClient } = require('../utils/mcp-client');

// Example 1: Generate a new RBL test
async function generateRBLTest() {
  console.log('🚀 Generating new RBL test...');
  
  const client = new MCPClient('playwright-ai-assistant');
  await client.connect();
  
  try {
    const result = await client.generateTest(
      'RBL',
      'User Password Reset Functionality',
      'tests/RBL/RBL/A_UsersCreationUpdation.spec.js'
    );
    
    console.log('✅ Generated test:', result.content[0].text);
  } catch (error) {
    console.error('❌ Error generating test:', error.message);
  } finally {
    await client.disconnect();
  }
}

// Example 2: Analyze test failure
async function analyzeTestFailure() {
  console.log('🔍 Analyzing test failure...');
  
  const client = new MCPClient('playwright-ai-assistant');
  await client.connect();
  
  try {
    const result = await client.analyzeFailure(
      'tests/RBL/RBL/E_setupLeadField.spec.js',
      'locator.waitFor: Timeout 30000ms exceeded. Call log: - waiting for locator to be visible',
      'test-results/failure-screenshot.png'
    );
    
    console.log('📊 Failure analysis:', result.content[0].text);
  } catch (error) {
    console.error('❌ Error analyzing failure:', error.message);
  } finally {
    await client.disconnect();
  }
}

// Example 3: Generate test data
async function generateTestData() {
  console.log('📊 Generating test data...');
  
  const dataClient = new MCPDataClient();
  await dataClient.connect();
  
  try {
    // Generate user data
    const userData = await dataClient.generateUserData(5, ['admin', 'caller', 'supervisor']);
    console.log('👥 Generated users:', userData.content[0].text.substring(0, 200) + '...');
    
    // Generate campaign data
    const campaignData = await dataClient.generateCampaignData(3, 'outbound');
    console.log('📢 Generated campaigns:', campaignData.content[0].text.substring(0, 200) + '...');
    
    // Generate lead data
    const leadData = await dataClient.generateLeadData(10, ['customField1', 'customField2']);
    console.log('🎯 Generated leads:', leadData.content[0].text.substring(0, 200) + '...');
    
  } catch (error) {
    console.error('❌ Error generating data:', error.message);
  } finally {
    await dataClient.disconnect();
  }
}

// Example 4: Analyze test performance
async function analyzeTestPerformance() {
  console.log('⚡ Analyzing test performance...');
  
  const analyzerClient = new MCPAnalyzerClient();
  await analyzerClient.connect();
  
  try {
    // Analyze overall test results
    const results = await analyzerClient.analyzeTestResults('test-results', 'summary');
    console.log('📈 Test results:', results.content[0].text);
    
    // Identify flaky tests
    const flakyTests = await analyzerClient.analyzeFlakyTests('RBL', 0.2);
    console.log('🔄 Flaky tests:', flakyTests.content[0].text);
    
    // Performance analysis
    const performance = await analyzerClient.performanceAnalysis('all', 'duration');
    console.log('⏱️ Performance:', performance.content[0].text);
    
  } catch (error) {
    console.error('❌ Error analyzing performance:', error.message);
  } finally {
    await analyzerClient.disconnect();
  }
}

// Example 5: Optimize test locators
async function optimizeTestLocators() {
  console.log('🎯 Optimizing test locators...');
  
  const client = new MCPClient('playwright-ai-assistant');
  await client.connect();
  
  try {
    const result = await client.optimizeLocators(
      'tests/RBL/RBL/E_setupLeadField.spec.js',
      'tests/pages/SystemSetupPage.js'
    );
    
    console.log('🔧 Locator optimization:', result.content[0].text);
  } catch (error) {
    console.error('❌ Error optimizing locators:', error.message);
  } finally {
    await client.disconnect();
  }
}

// Example 6: Generate comprehensive test report
async function generateTestReport() {
  console.log('📋 Generating test report...');
  
  const analyzerClient = new MCPAnalyzerClient();
  await analyzerClient.connect();
  
  try {
    const report = await analyzerClient.generateTestReport('markdown', true);
    console.log('📄 Test report:', report.content[0].text);
  } catch (error) {
    console.error('❌ Error generating report:', error.message);
  } finally {
    await analyzerClient.disconnect();
  }
}

// Example 7: Validate test structure
async function validateTestStructure() {
  console.log('✅ Validating test structure...');
  
  const client = new MCPClient('playwright-ai-assistant');
  await client.connect();
  
  try {
    const result = await client.validateTestStructure('tests/RBL/RBL/A_UsersCreationUpdation.spec.js');
    console.log('🔍 Structure validation:', result.content[0].text);
  } catch (error) {
    console.error('❌ Error validating structure:', error.message);
  } finally {
    await client.disconnect();
  }
}

// Example 8: Generate Page Object Model
async function generatePageObject() {
  console.log('🏗️ Generating Page Object...');
  
  const client = new MCPClient('playwright-ai-assistant');
  await client.connect();
  
  try {
    const result = await client.generatePageObject(
      'tests/RBL/RBL/E_setupLeadField.spec.js',
      'LeadFieldSetup'
    );
    
    console.log('📦 Generated Page Object:', result.content[0].text);
  } catch (error) {
    console.error('❌ Error generating Page Object:', error.message);
  } finally {
    await client.disconnect();
  }
}

// Run all examples
async function runAllExamples() {
  console.log('🎬 Running MCP Examples for Playwright Project\n');
  
  try {
    await generateRBLTest();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await analyzeTestFailure();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await generateTestData();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await analyzeTestPerformance();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await optimizeTestLocators();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await generateTestReport();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await validateTestStructure();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await generatePageObject();
    
  } catch (error) {
    console.error('❌ Error running examples:', error.message);
  }
  
  console.log('\n✅ All MCP examples completed!');
}

// Export functions for individual use
module.exports = {
  generateRBLTest,
  analyzeTestFailure,
  generateTestData,
  analyzeTestPerformance,
  optimizeTestLocators,
  generateTestReport,
  validateTestStructure,
  generatePageObject,
  runAllExamples
};

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}
