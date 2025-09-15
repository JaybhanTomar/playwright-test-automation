/**
 * MCP Client for Playwright Project
 * Provides easy interface to interact with MCP servers
 */

const { spawn } = require('child_process');
const path = require('path');

class MCPClient {
  constructor(serverName = 'playwright-ai-assistant') {
    this.serverName = serverName;
    this.serverProcess = null;
    this.isConnected = false;
  }

  async connect() {
    const serverPath = path.join(__dirname, '..', 'servers', `${this.serverName}.js`);
    
    this.serverProcess = spawn('node', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    this.serverProcess.on('error', (error) => {
      console.error(`MCP Server error: ${error.message}`);
    });

    this.serverProcess.on('close', (code) => {
      console.log(`MCP Server closed with code ${code}`);
      this.isConnected = false;
    });

    this.isConnected = true;
    return this;
  }

  async sendRequest(method, params = {}) {
    if (!this.isConnected) {
      throw new Error('MCP Client not connected. Call connect() first.');
    }

    const request = {
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params
    };

    return new Promise((resolve, reject) => {
      let responseData = '';

      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, 30000);

      this.serverProcess.stdout.on('data', (data) => {
        responseData += data.toString();
        
        try {
          const response = JSON.parse(responseData);
          clearTimeout(timeout);
          
          if (response.error) {
            reject(new Error(response.error.message));
          } else {
            resolve(response.result);
          }
        } catch (e) {
          // Response not complete yet, continue listening
        }
      });

      this.serverProcess.stdin.write(JSON.stringify(request) + '\n');
    });
  }

  async listTools() {
    return await this.sendRequest('tools/list');
  }

  async callTool(name, arguments_) {
    return await this.sendRequest('tools/call', {
      name,
      arguments: arguments_
    });
  }

  async generateTest(testType, feature, baseTest = null) {
    return await this.callTool('generate_test', {
      testType,
      feature,
      baseTest
    });
  }

  async analyzeFailure(testFile, errorMessage, screenshot = null) {
    return await this.callTool('analyze_test_failure', {
      testFile,
      errorMessage,
      screenshot
    });
  }

  async optimizeLocators(testFile, pageObjectFile = null) {
    return await this.callTool('optimize_locators', {
      testFile,
      pageObjectFile
    });
  }

  async validateTestStructure(testFile) {
    return await this.callTool('validate_test_structure', {
      testFile
    });
  }

  async generatePageObject(testFile, pageName) {
    return await this.callTool('generate_page_object', {
      testFile,
      pageName
    });
  }

  async disconnect() {
    if (this.serverProcess) {
      this.serverProcess.kill();
      this.isConnected = false;
    }
  }
}

// Data Generator Client
class MCPDataClient extends MCPClient {
  constructor() {
    super('test-data-server');
  }

  async generateUserData(count, roles = ['admin', 'caller'], format = 'json') {
    return await this.callTool('generate_user_data', {
      count,
      roles,
      format
    });
  }

  async generateCampaignData(count, type = 'outbound', format = 'json') {
    return await this.callTool('generate_campaign_data', {
      count,
      type,
      format
    });
  }

  async generateLeadData(count, fields = [], format = 'json') {
    return await this.callTool('generate_lead_data', {
      count,
      fields,
      format
    });
  }

  async generateTestScenarios(testType, complexity = 'medium', count = 5) {
    return await this.callTool('generate_test_scenarios', {
      testType,
      complexity,
      count
    });
  }
}

// Test Analyzer Client
class MCPAnalyzerClient extends MCPClient {
  constructor() {
    super('test-analyzer-server');
  }

  async analyzeTestResults(resultsPath = 'test-results', reportType = 'summary') {
    return await this.callTool('analyze_test_results', {
      resultsPath,
      reportType
    });
  }

  async analyzeFlakyTests(testSuite = 'all', threshold = 0.2) {
    return await this.callTool('analyze_flaky_tests', {
      testSuite,
      threshold
    });
  }

  async performanceAnalysis(testSuite = 'all', metric = 'duration') {
    return await this.callTool('performance_analysis', {
      testSuite,
      metric
    });
  }

  async coverageAnalysis(testSuite = 'all') {
    return await this.callTool('coverage_analysis', {
      testSuite
    });
  }

  async generateTestReport(format = 'markdown', includeScreenshots = true) {
    return await this.callTool('generate_test_report', {
      format,
      includeScreenshots
    });
  }
}

module.exports = {
  MCPClient,
  MCPDataClient,
  MCPAnalyzerClient
};
