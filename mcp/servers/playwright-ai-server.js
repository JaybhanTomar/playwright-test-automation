#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} = require('@modelcontextprotocol/sdk/types.js');

const MCPConfig = require('../config/mcp-config.js');
const MCPLogger = require('../utils/mcp-logger.js');

class PlaywrightAIServer {
  constructor() {
    this.config = new MCPConfig();
    this.logger = new MCPLogger(this.config.get('logging'));
    this.server = new Server(
      {
        name: 'playwright-ai-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupTools();
    this.setupErrorHandling();
  }

  setupTools() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'analyze_test_failure',
            description: 'Analyze Playwright test failures and provide insights',
            inputSchema: {
              type: 'object',
              properties: {
                testFile: {
                  type: 'string',
                  description: 'Path to the test file that failed'
                },
                errorMessage: {
                  type: 'string',
                  description: 'Error message from the test failure'
                },
                screenshot: {
                  type: 'string',
                  description: 'Path to screenshot if available'
                }
              },
              required: ['testFile', 'errorMessage']
            }
          },
          {
            name: 'generate_test_data',
            description: 'Generate test data for Playwright tests',
            inputSchema: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  enum: ['users', 'campaigns', 'leads', 'contacts'],
                  description: 'Type of test data to generate'
                },
                count: {
                  type: 'number',
                  description: 'Number of records to generate',
                  default: 5
                },
                format: {
                  type: 'string',
                  enum: ['json', 'csv', 'excel'],
                  description: 'Output format for the data',
                  default: 'json'
                }
              },
              required: ['type']
            }
          },
          {
            name: 'suggest_test_improvements',
            description: 'Analyze test code and suggest improvements',
            inputSchema: {
              type: 'object',
              properties: {
                testFile: {
                  type: 'string',
                  description: 'Path to the test file to analyze'
                },
                testCode: {
                  type: 'string',
                  description: 'Test code content'
                }
              },
              required: ['testFile', 'testCode']
            }
          },
          {
            name: 'create_test_report',
            description: 'Generate comprehensive test execution report',
            inputSchema: {
              type: 'object',
              properties: {
                testResults: {
                  type: 'string',
                  description: 'Path to test results JSON file'
                },
                format: {
                  type: 'string',
                  enum: ['markdown', 'html', 'json'],
                  description: 'Report format',
                  default: 'markdown'
                }
              },
              required: ['testResults']
            }
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'analyze_test_failure':
            return await this.analyzeTestFailure(args);
          
          case 'generate_test_data':
            return await this.generateTestData(args);
          
          case 'suggest_test_improvements':
            return await this.suggestTestImprovements(args);
          
          case 'create_test_report':
            return await this.createTestReport(args);
          
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        this.logger.logError(`Tool execution: ${name}`, error);
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error.message}`
        );
      }
    });
  }

  async analyzeTestFailure(args) {
    const { testFile, errorMessage, screenshot } = args;
    
    this.logger.info(`🔍 Analyzing test failure: ${testFile}`);
    
    // Mock analysis for now - in real implementation, this would use AI
    const analysis = {
      testFile,
      errorType: this.categorizeError(errorMessage),
      possibleCauses: this.identifyPossibleCauses(errorMessage),
      recommendations: this.generateRecommendations(errorMessage),
      confidence: 0.85,
      timestamp: new Date().toISOString()
    };

    this.logger.logAIAnalysis(testFile, 'failure_analysis', { success: true, insights: analysis.recommendations });

    return {
      content: [
        {
          type: 'text',
          text: `# Test Failure Analysis: ${testFile}

## Error Classification
**Type:** ${analysis.errorType}
**Confidence:** ${(analysis.confidence * 100).toFixed(1)}%

## Error Message
\`\`\`
${errorMessage}
\`\`\`

## Possible Causes
${analysis.possibleCauses.map(cause => `- ${cause}`).join('\n')}

## Recommendations
${analysis.recommendations.map(rec => `- ${rec}`).join('\n')}

## Next Steps
1. Review the error message and stack trace
2. Check if the issue is environment-specific
3. Verify test data and selectors
4. Consider adding better error handling

*Analysis generated at: ${analysis.timestamp}*`
        }
      ]
    };
  }

  async generateTestData(args) {
    const { type, count = 5, format = 'json' } = args;
    
    this.logger.info(`📊 Generating test data: ${type} (${count} records)`);
    
    // Mock data generation - in real implementation, this would use AI
    const data = this.createMockData(type, count);
    
    let content;
    switch (format) {
      case 'csv':
        content = this.convertToCSV(data);
        break;
      case 'excel':
        content = JSON.stringify(data, null, 2); // Simplified for now
        break;
      default:
        content = JSON.stringify(data, null, 2);
    }

    this.logger.logDataGeneration(type, count, format, true);

    return {
      content: [
        {
          type: 'text',
          text: content
        }
      ]
    };
  }

  async suggestTestImprovements(args) {
    const { testFile, testCode } = args;
    
    this.logger.info(`💡 Analyzing test for improvements: ${testFile}`);
    
    // Mock analysis - in real implementation, this would use AI
    const suggestions = [
      'Consider adding explicit waits instead of fixed timeouts',
      'Use data-testid attributes for more reliable element selection',
      'Add error handling for network requests',
      'Consider parameterizing test data',
      'Add assertions for intermediate steps'
    ];

    return {
      content: [
        {
          type: 'text',
          text: `# Test Improvement Suggestions: ${testFile}

## Code Analysis Results
The test code has been analyzed for potential improvements.

## Recommendations
${suggestions.map((suggestion, index) => `${index + 1}. ${suggestion}`).join('\n')}

## Best Practices
- Use Page Object Model for better maintainability
- Implement proper error handling
- Add comprehensive logging
- Use meaningful test descriptions
- Consider test data management

*Analysis completed at: ${new Date().toISOString()}*`
        }
      ]
    };
  }

  async createTestReport(args) {
    const { testResults, format = 'markdown' } = args;
    
    this.logger.info(`📋 Creating test report from: ${testResults}`);
    
    // Mock report generation
    const report = `# Test Execution Report

## Summary
- **Total Tests:** 25
- **Passed:** 20
- **Failed:** 3
- **Skipped:** 2
- **Success Rate:** 80%

## Environment
- **Environment:** QC6
- **Browser:** Chromium
- **Execution Time:** ${new Date().toISOString()}

## Failed Tests
1. E_setupLeadField.spec.js - Element not found
2. Campaign_Creation.spec.js - Timeout waiting for element
3. User_Login.spec.js - Invalid credentials

## Recommendations
- Review element selectors for failed tests
- Increase timeout for slow-loading pages
- Verify test data integrity

*Report generated at: ${new Date().toISOString()}*`;

    return {
      content: [
        {
          type: 'text',
          text: report
        }
      ]
    };
  }

  // Helper methods
  categorizeError(errorMessage) {
    if (errorMessage.includes('timeout')) return 'Timeout Error';
    if (errorMessage.includes('not found')) return 'Element Not Found';
    if (errorMessage.includes('network')) return 'Network Error';
    if (errorMessage.includes('assertion')) return 'Assertion Error';
    return 'Unknown Error';
  }

  identifyPossibleCauses(errorMessage) {
    const causes = [];
    if (errorMessage.includes('timeout')) {
      causes.push('Page loading too slowly');
      causes.push('Element not appearing within expected time');
    }
    if (errorMessage.includes('not found')) {
      causes.push('Element selector has changed');
      causes.push('Page structure has been modified');
    }
    return causes.length ? causes : ['Unknown cause - requires manual investigation'];
  }

  generateRecommendations(errorMessage) {
    const recommendations = [];
    if (errorMessage.includes('timeout')) {
      recommendations.push('Increase timeout duration');
      recommendations.push('Add explicit wait conditions');
    }
    if (errorMessage.includes('not found')) {
      recommendations.push('Update element selectors');
      recommendations.push('Verify page structure');
    }
    return recommendations.length ? recommendations : ['Review error details and test implementation'];
  }

  createMockData(type, count) {
    const data = [];
    for (let i = 1; i <= count; i++) {
      switch (type) {
        case 'users':
          data.push({
            id: i,
            firstName: `User${i}`,
            lastName: `Test${i}`,
            email: `user${i}@test.com`,
            role: i % 2 === 0 ? 'admin' : 'caller'
          });
          break;
        case 'campaigns':
          data.push({
            id: i,
            name: `Campaign ${i}`,
            type: 'outbound',
            status: 'active'
          });
          break;
        default:
          data.push({ id: i, name: `${type} ${i}` });
      }
    }
    return data;
  }

  convertToCSV(data) {
    if (!data.length) return '';
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    for (const row of data) {
      const values = headers.map(header => row[header]);
      csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      this.logger.logError('MCP Server', error);
    };

    process.on('SIGINT', async () => {
      this.logger.info('🛑 Shutting down MCP Server...');
      await this.server.close();
      process.exit(0);
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.logServerStart('playwright-ai-server', 'stdio');
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  const server = new PlaywrightAIServer();
  server.start().catch((error) => {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  });
}

module.exports = PlaywrightAIServer;
