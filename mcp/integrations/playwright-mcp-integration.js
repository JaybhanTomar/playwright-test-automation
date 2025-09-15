/**
 * Playwright-MCP Integration
 * Integrates MCP capabilities directly into Playwright test execution
 */

const { MCPClient, MCPDataClient, MCPAnalyzerClient } = require('../utils/mcp-client');
const fs = require('fs-extra');
const path = require('path');

class PlaywrightMCPIntegration {
  constructor() {
    this.aiClient = null;
    this.dataClient = null;
    this.analyzerClient = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize MCP clients
      this.aiClient = new MCPClient('playwright-ai-assistant');
      this.dataClient = new MCPDataClient();
      this.analyzerClient = new MCPAnalyzerClient();

      // Connect to servers
      await this.aiClient.connect();
      await this.dataClient.connect();
      await this.analyzerClient.connect();

      this.isInitialized = true;
      console.log('🚀 MCP Integration initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize MCP Integration:', error.message);
      throw error;
    }
  }

  async cleanup() {
    if (!this.isInitialized) return;

    try {
      if (this.aiClient) await this.aiClient.disconnect();
      if (this.dataClient) await this.dataClient.disconnect();
      if (this.analyzerClient) await this.analyzerClient.disconnect();

      this.isInitialized = false;
      console.log('✅ MCP Integration cleaned up successfully');
    } catch (error) {
      console.error('⚠️ Error during MCP cleanup:', error.message);
    }
  }

  // Test failure analysis hook
  async onTestFailure(testInfo, error) {
    if (!this.isInitialized) return;

    try {
      const testFile = path.relative(process.cwd(), testInfo.file);
      const errorMessage = error.message || error.toString();
      
      console.log(`🔍 Analyzing test failure: ${testInfo.title}`);
      
      const analysis = await this.aiClient.analyzeFailure(
        testFile,
        errorMessage,
        testInfo.attachments?.find(a => a.name === 'screenshot')?.path
      );

      // Log analysis results
      console.log('📊 MCP Failure Analysis:');
      console.log(analysis.content[0].text);

      // Save analysis to file
      const analysisDir = path.join(process.cwd(), 'test-results', 'mcp-analysis');
      await fs.ensureDir(analysisDir);
      
      const analysisFile = path.join(analysisDir, `${testInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}_analysis.md`);
      await fs.writeFile(analysisFile, analysis.content[0].text);

    } catch (error) {
      console.error('❌ Error in MCP failure analysis:', error.message);
    }
  }

  // Test completion hook
  async onTestComplete(testInfo, result) {
    if (!this.isInitialized) return;

    try {
      // Collect performance data
      const performanceData = {
        title: testInfo.title,
        duration: result.duration,
        status: result.status,
        file: path.relative(process.cwd(), testInfo.file),
        timestamp: new Date().toISOString()
      };

      // Save performance data for later analysis
      const perfDir = path.join(process.cwd(), 'test-results', 'mcp-performance');
      await fs.ensureDir(perfDir);
      
      const perfFile = path.join(perfDir, 'performance-data.jsonl');
      await fs.appendFile(perfFile, JSON.stringify(performanceData) + '\n');

    } catch (error) {
      console.error('❌ Error in MCP test completion hook:', error.message);
    }
  }

  // Generate test data for specific test
  async generateTestDataForTest(testType, dataType, count = 5) {
    if (!this.isInitialized) await this.initialize();

    try {
      let result;
      
      switch (dataType) {
        case 'users':
          const roles = testType === 'RBL' ? ['admin', 'caller', 'supervisor'] : ['admin', 'user'];
          result = await this.dataClient.generateUserData(count, roles, 'json');
          break;
          
        case 'campaigns':
          result = await this.dataClient.generateCampaignData(count, 'outbound', 'json');
          break;
          
        case 'leads':
          const customFields = testType === 'RBL' ? ['PTPDate', 'ActionCode'] : ['priority', 'source'];
          result = await this.dataClient.generateLeadData(count, customFields, 'json');
          break;
          
        default:
          throw new Error(`Unknown data type: ${dataType}`);
      }

      return JSON.parse(result.content[0].text.split('\n\n')[1]); // Extract JSON from response
    } catch (error) {
      console.error(`❌ Error generating ${dataType} data:`, error.message);
      throw error;
    }
  }

  // Optimize test locators
  async optimizeTestLocators(testFile, pageObjectFile = null) {
    if (!this.isInitialized) await this.initialize();

    try {
      const result = await this.aiClient.optimizeLocators(testFile, pageObjectFile);
      
      // Save optimization suggestions
      const optimizationDir = path.join(process.cwd(), 'test-results', 'mcp-optimizations');
      await fs.ensureDir(optimizationDir);
      
      const fileName = path.basename(testFile, '.js') + '_optimization.md';
      const optimizationFile = path.join(optimizationDir, fileName);
      await fs.writeFile(optimizationFile, result.content[0].text);

      return result.content[0].text;
    } catch (error) {
      console.error('❌ Error optimizing locators:', error.message);
      throw error;
    }
  }

  // Generate comprehensive test report
  async generateProjectReport() {
    if (!this.isInitialized) await this.initialize();

    try {
      const report = await this.analyzerClient.generateTestReport('markdown', true);
      
      // Save report
      const reportDir = path.join(process.cwd(), 'test-results', 'mcp-reports');
      await fs.ensureDir(reportDir);
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const reportFile = path.join(reportDir, `test-report-${timestamp}.md`);
      await fs.writeFile(reportFile, report.content[0].text);

      console.log(`📄 MCP Test Report generated: ${reportFile}`);
      return reportFile;
    } catch (error) {
      console.error('❌ Error generating test report:', error.message);
      throw error;
    }
  }

  // Validate test structure
  async validateTestStructure(testFile) {
    if (!this.isInitialized) await this.initialize();

    try {
      const result = await this.aiClient.validateTestStructure(testFile);
      const validation = JSON.parse(result.content[0].text.split('\n\n')[1]);
      
      // Log validation results
      console.log(`🔍 Test Structure Validation for ${testFile}:`);
      console.log(`✅ Has describe blocks: ${validation.hasDescribe}`);
      console.log(`✅ Has test cases: ${validation.hasTest}`);
      console.log(`✅ Uses Page Objects: ${validation.hasPageObject}`);
      console.log(`✅ Has error handling: ${validation.hasErrorHandling}`);
      console.log(`✅ Has proper waits: ${validation.hasWaits}`);
      
      if (validation.suggestions.length > 0) {
        console.log('💡 Suggestions:');
        validation.suggestions.forEach(suggestion => {
          console.log(`   - ${suggestion}`);
        });
      }

      return validation;
    } catch (error) {
      console.error('❌ Error validating test structure:', error.message);
      throw error;
    }
  }
}

// Singleton instance
let mcpIntegration = null;

// Factory function
function getMCPIntegration() {
  if (!mcpIntegration) {
    mcpIntegration = new PlaywrightMCPIntegration();
  }
  return mcpIntegration;
}

// Playwright test hooks
function setupMCPHooks(test) {
  const mcp = getMCPIntegration();

  // Initialize MCP before all tests
  test.beforeAll(async () => {
    await mcp.initialize();
  });

  // Clean up MCP after all tests
  test.afterAll(async () => {
    await mcp.cleanup();
  });

  // Hook into test failures
  test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status === 'failed') {
      const error = testInfo.errors?.[0] || new Error('Test failed');
      await mcp.onTestFailure(testInfo, error);
    }
    
    await mcp.onTestComplete(testInfo, { 
      duration: testInfo.duration, 
      status: testInfo.status 
    });
  });

  return mcp;
}

module.exports = {
  PlaywrightMCPIntegration,
  getMCPIntegration,
  setupMCPHooks
};
