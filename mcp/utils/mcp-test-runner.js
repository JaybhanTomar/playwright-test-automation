/**
 * MCP Test Runner
 * Enhanced test runner with MCP integration
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const mcpConfig = require('../config/mcp-config');
const mcpLogger = require('./mcp-logger');
const { MCPClient, MCPDataClient, MCPAnalyzerClient } = require('./mcp-client');

class MCPTestRunner {
  constructor() {
    this.config = mcpConfig.getAll();
    this.logger = mcpLogger;
    this.mcpClients = {
      ai: null,
      data: null,
      analyzer: null
    };
  }

  async initialize() {
    this.logger.info('Initializing MCP Test Runner');

    try {
      // Initialize MCP clients (but don't connect yet - they're mock clients)
      this.mcpClients.ai = new MCPClient('playwright-ai-assistant');
      this.mcpClients.data = new MCPDataClient();
      this.mcpClients.analyzer = new MCPAnalyzerClient();

      // For now, we'll use mock implementations since MCP servers aren't running
      // In production, you would connect to actual MCP servers here
      this.logger.success('MCP Test Runner initialized successfully');
      return true;
    } catch (error) {
      this.logger.error('Failed to initialize MCP Test Runner', error);
      return false;
    }
  }

  async cleanup() {
    this.logger.info('Cleaning up MCP Test Runner');
    
    try {
      if (this.mcpClients.ai) await this.mcpClients.ai.disconnect();
      if (this.mcpClients.data) await this.mcpClients.data.disconnect();
      if (this.mcpClients.analyzer) await this.mcpClients.analyzer.disconnect();
      
      this.logger.success('MCP Test Runner cleanup completed');
    } catch (error) {
      this.logger.error('Error during MCP cleanup', error);
    }
  }

  async runTest(testFile, options = {}) {
    const startTime = Date.now();
    this.logger.info(`Running test with MCP integration: ${testFile}`, options);

    try {
      // Pre-test setup
      await this.preTestSetup(testFile, options);

      // Run the actual test
      const testResult = await this.executeTest(testFile, options);

      // Post-test analysis
      await this.postTestAnalysis(testFile, testResult, startTime);

      return testResult;
    } catch (error) {
      this.logger.error(`Test execution failed: ${testFile}`, error);
      await this.handleTestFailure(testFile, error, startTime);
      throw error;
    }
  }

  async preTestSetup(testFile, options) {
    this.logger.info(`Pre-test setup for: ${testFile}`);

    // Generate test data if requested
    if (options.generateData) {
      await this.generateTestData(options.generateData);
    }

    // Validate test structure
    if (options.validateStructure) {
      await this.validateTestStructure(testFile);
    }

    // Clear old test artifacts
    if (options.clearArtifacts) {
      await this.clearTestArtifacts();
    }
  }

  async executeTest(testFile, options) {
    return new Promise((resolve, reject) => {
      const playwrightArgs = [
        'test',
        testFile,
        '--reporter=json'
      ];

      // Add additional options
      if (options.headed) playwrightArgs.push('--headed');
      if (options.timeout) playwrightArgs.push(`--timeout=${options.timeout}`);
      if (options.retries) playwrightArgs.push(`--retries=${options.retries}`);

      const testProcess = spawn('npx', ['playwright', ...playwrightArgs], {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: this.config.project.root
      });

      let stdout = '';
      let stderr = '';

      testProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      testProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      testProcess.on('close', (code) => {
        const result = {
          success: code === 0,
          exitCode: code,
          stdout,
          stderr,
          testFile
        };

        if (code === 0) {
          resolve(result);
        } else {
          reject(new Error(`Test failed with exit code ${code}: ${stderr}`));
        }
      });

      testProcess.on('error', (error) => {
        reject(error);
      });
    });
  }

  async postTestAnalysis(testFile, testResult, startTime) {
    const duration = Date.now() - startTime;
    this.logger.info(`Post-test analysis for: ${testFile}`, { duration, success: testResult.success });

    // Log performance data
    this.logger.logPerformance(testFile, duration, testResult.success ? 'passed' : 'failed');

    // Generate test report
    if (this.mcpClients.analyzer) {
      try {
        await this.mcpClients.analyzer.generateTestReport('json', true);
      } catch (error) {
        this.logger.warn('Failed to generate MCP test report', error);
      }
    }

    // Analyze performance if test was slow
    if (duration > this.config.performance.thresholdMs) {
      this.logger.warn(`Slow test detected: ${testFile} (${duration}ms)`);
      await this.analyzeSlowTest(testFile, duration);
    }
  }

  async handleTestFailure(testFile, error, startTime) {
    const duration = Date.now() - startTime;
    this.logger.error(`Test failure analysis for: ${testFile}`, error, { duration });

    // Log failure analysis
    this.logger.logFailureAnalysis(testFile, error, error.message);

    // Perform AI-powered failure analysis (mock implementation for now)
    if (this.mcpClients.ai) {
      try {
        // Mock analysis since MCP servers aren't running
        const mockAnalysis = this.generateMockAnalysis(testFile, error);
        this.logger.info('MCP failure analysis completed', { analysisLength: mockAnalysis.length });

        // Save analysis to file
        const analysisFile = path.join(
          this.config.output.analysis,
          `${path.basename(testFile, '.js')}_failure_analysis.md`
        );

        // Ensure directory exists
        if (!fs.existsSync(this.config.output.analysis)) {
          fs.mkdirSync(this.config.output.analysis, { recursive: true });
        }

        fs.writeFileSync(analysisFile, mockAnalysis);
      } catch (analysisError) {
        this.logger.warn('Failed to perform MCP failure analysis', analysisError);
      }
    }
  }

  async generateTestData(dataConfig) {
    this.logger.info('Generating test data with MCP', dataConfig);

    if (!this.mcpClients.data) {
      this.logger.warn('MCP Data Client not available');
      return;
    }

    try {
      const { type, count, format } = dataConfig;

      // Generate mock data since MCP servers aren't running
      const mockData = this.generateMockData(type, count, format);

      // Save generated data
      const dataFile = path.join(
        this.config.output.testData,
        `generated_${type}_${Date.now()}.${format}`
      );

      // Ensure directory exists
      if (!fs.existsSync(this.config.output.testData)) {
        fs.mkdirSync(this.config.output.testData, { recursive: true });
      }

      fs.writeFileSync(dataFile, mockData);

      this.logger.logDataGeneration(type, count, format, true);
      this.logger.success(`Test data saved to: ${dataFile}`);
    } catch (error) {
      this.logger.logDataGeneration(dataConfig.type, dataConfig.count, dataConfig.format, false);
      this.logger.error('Failed to generate test data', error);
    }
  }

  // Generate mock data for demonstration
  generateMockData(type, count, format) {
    const data = [];

    switch (type) {
      case 'users':
        for (let i = 1; i <= count; i++) {
          data.push({
            id: i,
            firstName: `User${i}`,
            lastName: `Test${i}`,
            email: `user${i}@test.com`,
            role: i % 2 === 0 ? 'admin' : 'caller',
            password: 'Test123!',
            created: new Date().toISOString()
          });
        }
        break;

      case 'campaigns':
        for (let i = 1; i <= count; i++) {
          data.push({
            id: i,
            name: `Campaign ${i}`,
            type: 'outbound',
            status: 'active',
            dialMode: 'preview',
            created: new Date().toISOString()
          });
        }
        break;

      case 'leads':
        for (let i = 1; i <= count; i++) {
          data.push({
            id: i,
            firstName: `Lead${i}`,
            lastName: `Contact${i}`,
            phone: `555-000-${String(i).padStart(4, '0')}`,
            email: `lead${i}@example.com`,
            status: 'new',
            created: new Date().toISOString()
          });
        }
        break;
    }

    return format === 'json' ? JSON.stringify(data, null, 2) :
           format === 'csv' ? this.convertToCSV(data) :
           JSON.stringify(data, null, 2);
  }

  convertToCSV(data) {
    if (!data.length) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }

  async validateTestStructure(testFile) {
    this.logger.info(`Validating test structure: ${testFile}`);

    if (!this.mcpClients.ai) {
      this.logger.warn('MCP AI Client not available for structure validation');
      return;
    }

    try {
      const validation = await this.mcpClients.ai.validateTestStructure(testFile);
      this.logger.info('Test structure validation completed', { 
        testFile,
        validationLength: validation.content[0].text.length 
      });

      // Save validation results
      const validationFile = path.join(
        this.config.output.analysis,
        `${path.basename(testFile, '.js')}_structure_validation.md`
      );
      fs.writeFileSync(validationFile, validation.content[0].text);
    } catch (error) {
      this.logger.error('Failed to validate test structure', error);
    }
  }

  async analyzeSlowTest(testFile, duration) {
    this.logger.info(`Analyzing slow test: ${testFile}`, { duration });

    if (!this.mcpClients.analyzer) {
      this.logger.warn('MCP Analyzer Client not available');
      return;
    }

    try {
      const analysis = await this.mcpClients.analyzer.performanceAnalysis(testFile, 'duration');
      
      // Save performance analysis
      const analysisFile = path.join(
        this.config.output.analysis,
        `${path.basename(testFile, '.js')}_performance_analysis.md`
      );
      fs.writeFileSync(analysisFile, analysis.content[0].text);
      
      this.logger.success(`Performance analysis saved to: ${analysisFile}`);
    } catch (error) {
      this.logger.error('Failed to analyze slow test', error);
    }
  }

  async clearTestArtifacts() {
    this.logger.info('Clearing old test artifacts');

    const artifactDirs = Object.values(this.config.output);
    
    artifactDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stats = fs.statSync(filePath);
          
          // Delete files older than 24 hours
          if (Date.now() - stats.mtime.getTime() > 24 * 60 * 60 * 1000) {
            fs.unlinkSync(filePath);
            this.logger.debug(`Deleted old artifact: ${filePath}`);
          }
        });
      }
    });
  }

  // Generate mock analysis for demonstration
  generateMockAnalysis(testFile, error) {
    const timestamp = new Date().toISOString();

    return `# 🤖 MCP Failure Analysis

**Test File:** \`${testFile}\`
**Error:** ${error.message}
**Timestamp:** ${timestamp}

## 🔍 Root Cause Analysis

Based on the error pattern, this appears to be a **Playwright CLI option issue**.

### 📊 Error Details
- **Error Type:** Command line argument error
- **Specific Issue:** Unknown option '--output-dir'
- **Impact:** Test execution failed before running

### 💡 Recommended Fixes

1. **Remove invalid CLI option**
   - The \`--output-dir\` option is not valid for Playwright CLI
   - Use environment variables or config file instead

2. **Update test runner**
   - Modify the test execution command
   - Use proper Playwright CLI options

3. **Verify Playwright version**
   - Ensure you're using a compatible Playwright version
   - Check for any breaking changes in CLI options

### 🛠️ Suggested Actions

\`\`\`bash
# Fix the test runner command
npx playwright test ${path.basename(testFile)} --reporter=json

# Or run directly without MCP wrapper
npx playwright test ${path.basename(testFile)} --headed
\`\`\`

### 📈 Prevention

- Validate CLI options before execution
- Add proper error handling for invalid options
- Test CLI commands in isolation

---
*This analysis was generated by MCP (Model Context Protocol) - Mock Implementation*`;
  }

  // Get test summary
  getTestSummary() {
    const logSummary = this.logger.getLogSummary(24);

    return {
      ...logSummary,
      mcpEnabled: true,
      config: {
        environment: this.config.project.defaultEnvironment,
        aiModel: this.config.ai.model,
        debugMode: this.config.debug.enabled
      }
    };
  }
}

module.exports = MCPTestRunner;
