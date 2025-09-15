/**
 * RBL-MCP Integration Example
 * Shows how to integrate MCP with existing RBL tests
 */

const { test, expect } = require('@playwright/test');
const { setupMCPHooks } = require('../integrations/playwright-mcp-integration');
const RBLTestSetup = require('../../tests/RBL/utils/RBLTestSetup');

// Setup MCP hooks for this test suite
const mcp = setupMCPHooks(test);

test.describe('RBL Tests with MCP Integration', () => {
  let rblSetup;
  let page;
  let sys;

  test.beforeAll(async ({ browser }) => {
    // Standard RBL setup
    rblSetup = new RBLTestSetup();
    const instances = await rblSetup.completeSetup();
    page = instances.page;
    sys = instances.sys;
  });

  test.afterAll(async () => {
    await rblSetup.cleanup();
  });

  test('MCP-Enhanced User Creation Test', async () => {
    // Generate test data using MCP
    console.log('🤖 Generating test data using MCP...');
    const userData = await mcp.generateTestDataForTest('RBL', 'users', 3);
    
    console.log('📊 Generated users:', userData.length);
    
    // Use generated data in test
    for (const user of userData.slice(0, 2)) { // Use first 2 users
      console.log(`👤 Testing user creation: ${user.firstName} ${user.lastName}`);
      
      try {
        // Navigate to Users section
        await sys.NavigateToUsers();
        
        // Create user with MCP-generated data
        await sys.createUser(
          user.firstName,
          user.lastName,
          user.role,
          user.email,
          user.password,
          user.timeZone,
          user.extension,
          user.phoneNumber,
          user.userskill
        );
        
        console.log(`✅ User created successfully: ${user.email}`);
        
      } catch (error) {
        console.error(`❌ Error creating user ${user.email}:`, error.message);
        
        // MCP will automatically analyze this failure in the afterEach hook
        throw error;
      }
    }
  });

  test('MCP-Enhanced Lead Field Creation', async () => {
    // Generate lead field data using MCP
    console.log('🤖 Generating lead field scenarios using MCP...');
    const scenarios = await mcp.dataClient.generateTestScenarios('RBL', 'medium', 2);
    const scenarioData = JSON.parse(scenarios.content[0].text);
    
    console.log('📋 Generated scenarios:', scenarioData.length);
    
    // Navigate to Lead Fields
    await sys.NavigateToLeadFields();
    
    // Create fields based on MCP scenarios
    for (const scenario of scenarioData) {
      if (scenario.name.includes('Lead Field')) {
        console.log(`🔧 Creating field based on scenario: ${scenario.name}`);
        
        try {
          // Extract field data from scenario
          const fieldData = scenario.testData || {
            displayName: `MCP Generated Field ${Date.now()}`,
            fieldName: `mcpField${Date.now()}`,
            type: 'Text',
            inputType: 'Text'
          };
          
          await sys.createLeadField(
            'RBL',
            fieldData.displayName,
            fieldData.fieldName,
            fieldData.type,
            fieldData.inputType
          );
          
          console.log(`✅ Lead field created: ${fieldData.displayName}`);
          
        } catch (error) {
          console.error(`❌ Error creating lead field:`, error.message);
          // MCP will analyze this failure
          throw error;
        }
      }
    }
  });

  test('MCP Locator Optimization Test', async () => {
    // Test current locators and get MCP optimization suggestions
    console.log('🎯 Running MCP locator optimization...');
    
    const testFile = 'tests/RBL/RBL/E_setupLeadField.spec.js';
    const pageObjectFile = 'tests/pages/SystemSetupPage.js';
    
    try {
      const optimizations = await mcp.optimizeTestLocators(testFile, pageObjectFile);
      console.log('🔧 MCP Locator Optimizations:');
      console.log(optimizations);
      
      // Test some basic navigation to validate current locators
      await sys.NavigateToSystemSetup();
      await sys.NavigateToLeadFields();
      
      console.log('✅ Current locators working correctly');
      
    } catch (error) {
      console.error('❌ Locator optimization test failed:', error.message);
      throw error;
    }
  });

  test('MCP Test Structure Validation', async () => {
    // Validate the structure of this test file using MCP
    console.log('🔍 Running MCP test structure validation...');
    
    const testFile = __filename.replace(process.cwd() + '/', '');
    
    try {
      const validation = await mcp.validateTestStructure(testFile);
      
      // Assert that our test follows best practices
      expect(validation.hasDescribe).toBe(true);
      expect(validation.hasTest).toBe(true);
      expect(validation.hasBeforeAll).toBe(true);
      expect(validation.hasAfterAll).toBe(true);
      
      console.log('✅ Test structure validation passed');
      
    } catch (error) {
      console.error('❌ Test structure validation failed:', error.message);
      throw error;
    }
  });

  test('MCP Performance Analysis Demo', async () => {
    // Demonstrate MCP performance analysis
    console.log('⚡ Running performance analysis demo...');
    
    const startTime = Date.now();
    
    // Perform some operations to measure
    await sys.NavigateToSystemSetup();
    await page.waitForTimeout(1000);
    await sys.NavigateToUsers();
    await page.waitForTimeout(1000);
    await sys.NavigateToLeadFields();
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`⏱️ Navigation operations took: ${duration}ms`);
    
    // MCP will collect this performance data automatically
    // and include it in performance analysis reports
    
    expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
  });
});

// Example of using MCP outside of test context
async function demonstrateMCPCapabilities() {
  console.log('🚀 Demonstrating MCP Capabilities');
  console.log('==================================');
  
  const { getMCPIntegration } = require('../integrations/playwright-mcp-integration');
  const mcp = getMCPIntegration();
  
  try {
    await mcp.initialize();
    
    // Generate test report
    console.log('📄 Generating comprehensive test report...');
    const reportFile = await mcp.generateProjectReport();
    console.log(`Report saved to: ${reportFile}`);
    
    // Generate test data
    console.log('📊 Generating RBL test data...');
    const users = await mcp.generateTestDataForTest('RBL', 'users', 5);
    console.log(`Generated ${users.length} users for testing`);
    
    const campaigns = await mcp.generateTestDataForTest('RBL', 'campaigns', 3);
    console.log(`Generated ${campaigns.length} campaigns for testing`);
    
    console.log('✅ MCP demonstration completed successfully');
    
  } catch (error) {
    console.error('❌ MCP demonstration failed:', error.message);
  } finally {
    await mcp.cleanup();
  }
}

// Export for standalone usage
module.exports = {
  demonstrateMCPCapabilities
};

// Run demonstration if this file is executed directly
if (require.main === module) {
  demonstrateMCPCapabilities().catch(console.error);
}
