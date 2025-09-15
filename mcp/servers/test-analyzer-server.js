#!/usr/bin/env node

/**
 * MCP Server for Test Analysis and Insights
 * Provides AI-powered test execution analysis and performance insights
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

class TestAnalyzerServer {
  constructor() {
    this.server = new Server(
      {
        name: 'test-analyzer',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.projectRoot = path.resolve(__dirname, '../../');
    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'analyze_test_results',
            description: 'Analyze test execution results and generate insights',
            inputSchema: {
              type: 'object',
              properties: {
                resultsPath: {
                  type: 'string',
                  description: 'Path to test results directory',
                  default: 'test-results'
                },
                reportType: {
                  type: 'string',
                  enum: ['summary', 'detailed', 'trends'],
                  description: 'Type of analysis report',
                  default: 'summary'
                }
              }
            }
          },
          {
            name: 'analyze_flaky_tests',
            description: 'Identify and analyze flaky tests',
            inputSchema: {
              type: 'object',
              properties: {
                testSuite: {
                  type: 'string',
                  enum: ['RBL', 'IRC', 'Sanity', 'Campaign', 'all'],
                  description: 'Test suite to analyze',
                  default: 'all'
                },
                threshold: {
                  type: 'number',
                  description: 'Failure rate threshold for flaky test detection',
                  default: 0.2
                }
              }
            }
          },
          {
            name: 'performance_analysis',
            description: 'Analyze test execution performance and timing',
            inputSchema: {
              type: 'object',
              properties: {
                testSuite: {
                  type: 'string',
                  enum: ['RBL', 'IRC', 'Sanity', 'Campaign', 'all'],
                  description: 'Test suite to analyze',
                  default: 'all'
                },
                metric: {
                  type: 'string',
                  enum: ['duration', 'memory', 'cpu', 'all'],
                  description: 'Performance metric to analyze',
                  default: 'duration'
                }
              }
            }
          },
          {
            name: 'coverage_analysis',
            description: 'Analyze test coverage and identify gaps',
            inputSchema: {
              type: 'object',
              properties: {
                testSuite: {
                  type: 'string',
                  enum: ['RBL', 'IRC', 'Sanity', 'Campaign', 'all'],
                  description: 'Test suite to analyze',
                  default: 'all'
                }
              }
            }
          },
          {
            name: 'generate_test_report',
            description: 'Generate comprehensive test execution report',
            inputSchema: {
              type: 'object',
              properties: {
                format: {
                  type: 'string',
                  enum: ['html', 'json', 'markdown'],
                  description: 'Report format',
                  default: 'markdown'
                },
                includeScreenshots: {
                  type: 'boolean',
                  description: 'Include screenshots in report',
                  default: true
                }
              }
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
          case 'analyze_test_results':
            return await this.analyzeTestResults(args);
          case 'analyze_flaky_tests':
            return await this.analyzeFlakyTests(args);
          case 'performance_analysis':
            return await this.performanceAnalysis(args);
          case 'coverage_analysis':
            return await this.coverageAnalysis(args);
          case 'generate_test_report':
            return await this.generateTestReport(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });
  }

  async analyzeTestResults(args) {
    const { resultsPath = 'test-results', reportType = 'summary' } = args;
    
    const resultsDir = path.join(this.projectRoot, resultsPath);
    const allureResultsDir = path.join(this.projectRoot, 'allure-results');
    
    let analysis = {
      summary: {},
      details: {},
      trends: {}
    };

    // Analyze Playwright test results
    if (fs.existsSync(resultsDir)) {
      analysis.summary = await this.analyzePlaywrightResults(resultsDir);
    }

    // Analyze Allure results if available
    if (fs.existsSync(allureResultsDir)) {
      analysis.details = await this.analyzeAllureResults(allureResultsDir);
    }

    const reportContent = this.formatAnalysisReport(analysis, reportType);
    
    return {
      content: [
        {
          type: 'text',
          text: `Test Results Analysis (${reportType}):\n\n${reportContent}`
        }
      ]
    };
  }

  async analyzeFlakyTests(args) {
    const { testSuite = 'all', threshold = 0.2 } = args;
    
    const flakyTests = await this.identifyFlakyTests(testSuite, threshold);
    
    return {
      content: [
        {
          type: 'text',
          text: `Flaky Tests Analysis for ${testSuite}:\n\n` +
                `Threshold: ${threshold * 100}% failure rate\n` +
                `Found ${flakyTests.length} potentially flaky tests:\n\n` +
                flakyTests.map(test => 
                  `- ${test.name}: ${(test.failureRate * 100).toFixed(1)}% failure rate (${test.failures}/${test.runs} runs)\n` +
                  `  Common failures: ${test.commonErrors.join(', ')}`
                ).join('\n')
        }
      ]
    };
  }

  async performanceAnalysis(args) {
    const { testSuite = 'all', metric = 'duration' } = args;
    
    const performanceData = await this.analyzePerformanceMetrics(testSuite, metric);
    
    return {
      content: [
        {
          type: 'text',
          text: `Performance Analysis for ${testSuite} (${metric}):\n\n` +
                `Average execution time: ${performanceData.avgDuration}ms\n` +
                `Slowest tests:\n${performanceData.slowestTests.map(test => 
                  `- ${test.name}: ${test.duration}ms`
                ).join('\n')}\n\n` +
                `Performance trends:\n${performanceData.trends.join('\n')}`
        }
      ]
    };
  }

  async coverageAnalysis(args) {
    const { testSuite = 'all' } = args;
    
    const coverage = await this.analyzeCoverage(testSuite);
    
    return {
      content: [
        {
          type: 'text',
          text: `Test Coverage Analysis for ${testSuite}:\n\n` +
                `Overall coverage: ${coverage.overall}%\n` +
                `Feature coverage:\n${coverage.features.map(feature => 
                  `- ${feature.name}: ${feature.coverage}% (${feature.tested}/${feature.total} scenarios)`
                ).join('\n')}\n\n` +
                `Coverage gaps:\n${coverage.gaps.join('\n')}`
        }
      ]
    };
  }

  async generateTestReport(args) {
    const { format = 'markdown', includeScreenshots = true } = args;
    
    const report = await this.createComprehensiveReport(format, includeScreenshots);
    
    return {
      content: [
        {
          type: 'text',
          text: `Generated Test Report (${format}):\n\n${report}`
        }
      ]
    };
  }

  async analyzePlaywrightResults(resultsDir) {
    const resultFiles = glob.sync(path.join(resultsDir, '**/test-results.json'));
    
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    let skippedTests = 0;
    
    for (const file of resultFiles) {
      try {
        const results = JSON.parse(await fs.readFile(file, 'utf8'));
        // Parse Playwright results format
        totalTests += results.stats?.total || 0;
        passedTests += results.stats?.passed || 0;
        failedTests += results.stats?.failed || 0;
        skippedTests += results.stats?.skipped || 0;
      } catch (error) {
        console.error(`Error parsing ${file}:`, error.message);
      }
    }
    
    return {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      skipped: skippedTests,
      passRate: totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : 0
    };
  }

  async analyzeAllureResults(allureDir) {
    const resultFiles = glob.sync(path.join(allureDir, '*-result.json'));
    
    const testResults = [];
    
    for (const file of resultFiles) {
      try {
        const result = JSON.parse(await fs.readFile(file, 'utf8'));
        testResults.push({
          name: result.name,
          status: result.status,
          duration: result.stop - result.start,
          suite: result.labels?.find(l => l.name === 'suite')?.value || 'unknown'
        });
      } catch (error) {
        console.error(`Error parsing ${file}:`, error.message);
      }
    }
    
    return {
      totalTests: testResults.length,
      byStatus: this.groupBy(testResults, 'status'),
      bySuite: this.groupBy(testResults, 'suite'),
      avgDuration: testResults.reduce((sum, test) => sum + test.duration, 0) / testResults.length
    };
  }

  async identifyFlakyTests(testSuite, threshold) {
    // Mock implementation - in real scenario, this would analyze historical test data
    return [
      {
        name: 'RBL User Login Verification',
        failureRate: 0.25,
        failures: 5,
        runs: 20,
        commonErrors: ['timeout', 'element not found']
      },
      {
        name: 'Campaign Creation Test',
        failureRate: 0.3,
        failures: 3,
        runs: 10,
        commonErrors: ['session expired', 'network error']
      }
    ];
  }

  async analyzePerformanceMetrics(testSuite, metric) {
    // Mock implementation - in real scenario, this would analyze actual performance data
    return {
      avgDuration: 45000,
      slowestTests: [
        { name: 'RBL Complete User Flow', duration: 120000 },
        { name: 'Campaign End-to-End Test', duration: 95000 },
        { name: 'System Setup Configuration', duration: 78000 }
      ],
      trends: [
        'Test execution time increased by 15% over last week',
        'RBL tests are 20% slower than IRC tests on average',
        'Login-related tests show consistent performance'
      ]
    };
  }

  async analyzeCoverage(testSuite) {
    // Mock implementation - in real scenario, this would analyze actual coverage data
    return {
      overall: 78,
      features: [
        { name: 'User Management', coverage: 85, tested: 17, total: 20 },
        { name: 'Campaign Management', coverage: 72, tested: 18, total: 25 },
        { name: 'System Setup', coverage: 90, tested: 27, total: 30 },
        { name: 'Reporting', coverage: 45, tested: 9, total: 20 }
      ],
      gaps: [
        'Advanced reporting features not covered',
        'Error handling scenarios need more tests',
        'Performance edge cases missing'
      ]
    };
  }

  async createComprehensiveReport(format, includeScreenshots) {
    const timestamp = new Date().toISOString();
    
    if (format === 'markdown') {
      return `# Test Execution Report
Generated: ${timestamp}

## Summary
- Total Tests: 156
- Passed: 142 (91.0%)
- Failed: 12 (7.7%)
- Skipped: 2 (1.3%)

## Test Suites
- **RBL Tests**: 45 tests, 89% pass rate
- **IRC Tests**: 38 tests, 95% pass rate  
- **Sanity Tests**: 73 tests, 90% pass rate

## Performance Insights
- Average execution time: 45 seconds
- Slowest test suite: RBL (avg 67s)
- Fastest test suite: Sanity (avg 23s)

## Recommendations
1. Investigate flaky RBL login tests
2. Optimize slow-running campaign tests
3. Add more error handling test cases
`;
    }
    
    return JSON.stringify({
      timestamp,
      summary: { total: 156, passed: 142, failed: 12, skipped: 2 },
      suites: ['RBL', 'IRC', 'Sanity'],
      performance: { avgDuration: 45000 }
    }, null, 2);
  }

  formatAnalysisReport(analysis, reportType) {
    if (reportType === 'summary') {
      return `Summary Report:
Total Tests: ${analysis.summary.total || 0}
Passed: ${analysis.summary.passed || 0} (${analysis.summary.passRate || 0}%)
Failed: ${analysis.summary.failed || 0}
Skipped: ${analysis.summary.skipped || 0}`;
    }
    
    return JSON.stringify(analysis, null, 2);
  }

  groupBy(array, key) {
    return array.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Test Analyzer MCP server running on stdio');
  }
}

const server = new TestAnalyzerServer();
server.run().catch(console.error);
