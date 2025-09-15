/**
 * MCP Slack Integration
 * Sends test notifications and reports to Slack
 */

const axios = require('axios');
const mcpConfig = require('../config/mcp-config');
const mcpLogger = require('../utils/mcp-logger');

class SlackIntegration {
  constructor() {
    this.config = mcpConfig.get('slack');
    this.logger = mcpLogger;
  }

  isEnabled() {
    return this.config.enabled && this.config.webhookUrl;
  }

  async sendMessage(message, options = {}) {
    if (!this.isEnabled()) {
      return null;
    }

    try {
      const payload = {
        channel: options.channel || this.config.channel,
        username: 'MCP Bot',
        icon_emoji: ':robot_face:',
        ...message
      };

      const response = await axios.post(this.config.webhookUrl, payload);
      this.logger.success('Sent Slack notification');
      return response.data;
    } catch (error) {
      this.logger.error('Failed to send Slack message', error);
      return null;
    }
  }

  async notifyTestFailure(testFile, error, analysis) {
    if (!this.isEnabled() || !this.config.notifyOnFailure) {
      return null;
    }

    const message = {
      text: `🚨 Test Failure Alert`,
      attachments: [
        {
          color: 'danger',
          title: `Test Failed: ${testFile}`,
          fields: [
            {
              title: 'Error',
              value: error.message.substring(0, 200) + (error.message.length > 200 ? '...' : ''),
              short: false
            },
            {
              title: 'Environment',
              value: mcpConfig.get('project.defaultEnvironment'),
              short: true
            },
            {
              title: 'Timestamp',
              value: new Date().toISOString(),
              short: true
            }
          ],
          footer: 'MCP Analysis',
          footer_icon: 'https://example.com/mcp-icon.png'
        }
      ]
    };

    if (analysis) {
      message.attachments[0].fields.push({
        title: 'MCP Analysis',
        value: analysis.substring(0, 300) + (analysis.length > 300 ? '...' : ''),
        short: false
      });
    }

    return await this.sendMessage(message);
  }

  async notifyTestSuccess(testResults) {
    if (!this.isEnabled() || !this.config.notifyOnSuccess) {
      return null;
    }

    const { passed, total, duration } = testResults;
    
    const message = {
      text: `✅ Tests Passed Successfully`,
      attachments: [
        {
          color: 'good',
          title: 'Test Execution Complete',
          fields: [
            {
              title: 'Results',
              value: `${passed}/${total} tests passed`,
              short: true
            },
            {
              title: 'Duration',
              value: `${duration}ms`,
              short: true
            },
            {
              title: 'Environment',
              value: mcpConfig.get('project.defaultEnvironment'),
              short: true
            },
            {
              title: 'Success Rate',
              value: `${((passed / total) * 100).toFixed(1)}%`,
              short: true
            }
          ],
          footer: 'MCP Test Runner',
          ts: Math.floor(Date.now() / 1000)
        }
      ]
    };

    return await this.sendMessage(message);
  }

  async notifyFlakyTests(flakyTests) {
    if (!this.isEnabled() || !this.config.notifyOnFlakyTests || !flakyTests.length) {
      return null;
    }

    const message = {
      text: `⚠️ Flaky Tests Detected`,
      attachments: [
        {
          color: 'warning',
          title: `${flakyTests.length} Flaky Test(s) Found`,
          fields: flakyTests.slice(0, 5).map(test => ({
            title: test.name,
            value: `${test.failureRate}% failure rate (${test.failures}/${test.runs} runs)`,
            short: false
          })),
          footer: flakyTests.length > 5 ? `... and ${flakyTests.length - 5} more` : 'MCP Analysis'
        }
      ]
    };

    return await this.sendMessage(message);
  }

  async sendDailyReport(reportData) {
    if (!this.isEnabled()) {
      return null;
    }

    const { 
      totalTests, 
      passedTests, 
      failedTests, 
      flakyTests, 
      averageDuration,
      slowestTest,
      trends 
    } = reportData;

    const successRate = ((passedTests / totalTests) * 100).toFixed(1);
    
    const message = {
      text: `📊 Daily Test Report - ${new Date().toDateString()}`,
      attachments: [
        {
          color: failedTests > 0 ? 'warning' : 'good',
          title: 'Test Summary',
          fields: [
            {
              title: 'Total Tests',
              value: totalTests.toString(),
              short: true
            },
            {
              title: 'Success Rate',
              value: `${successRate}%`,
              short: true
            },
            {
              title: 'Passed',
              value: passedTests.toString(),
              short: true
            },
            {
              title: 'Failed',
              value: failedTests.toString(),
              short: true
            },
            {
              title: 'Average Duration',
              value: `${averageDuration}ms`,
              short: true
            },
            {
              title: 'Slowest Test',
              value: slowestTest || 'N/A',
              short: true
            }
          ]
        }
      ]
    };

    // Add flaky tests section
    if (flakyTests && flakyTests.length > 0) {
      message.attachments.push({
        color: 'warning',
        title: `⚠️ Flaky Tests (${flakyTests.length})`,
        text: flakyTests.slice(0, 3).map(test => 
          `• ${test.name}: ${test.failureRate}% failure rate`
        ).join('\n') + (flakyTests.length > 3 ? `\n... and ${flakyTests.length - 3} more` : '')
      });
    }

    // Add trends section
    if (trends) {
      message.attachments.push({
        color: trends.improving ? 'good' : 'warning',
        title: '📈 Trends',
        text: `Success rate ${trends.improving ? 'improved' : 'declined'} by ${trends.change}% over the last 7 days`
      });
    }

    return await this.sendMessage(message);
  }

  async sendCustomMessage(title, text, color = 'good', fields = []) {
    if (!this.isEnabled()) {
      return null;
    }

    const message = {
      text: title,
      attachments: [
        {
          color,
          text,
          fields,
          footer: 'MCP Notification',
          ts: Math.floor(Date.now() / 1000)
        }
      ]
    };

    return await this.sendMessage(message);
  }

  async notifyPerformanceIssue(testFile, duration, threshold) {
    if (!this.isEnabled()) {
      return null;
    }

    const message = {
      text: `🐌 Performance Alert`,
      attachments: [
        {
          color: 'warning',
          title: `Slow Test Detected: ${testFile}`,
          fields: [
            {
              title: 'Duration',
              value: `${duration}ms`,
              short: true
            },
            {
              title: 'Threshold',
              value: `${threshold}ms`,
              short: true
            },
            {
              title: 'Exceeded By',
              value: `${duration - threshold}ms (${(((duration - threshold) / threshold) * 100).toFixed(1)}%)`,
              short: false
            }
          ],
          footer: 'Consider optimizing this test'
        }
      ]
    };

    return await this.sendMessage(message);
  }

  async notifyDeployment(environment, status, details = {}) {
    if (!this.isEnabled()) {
      return null;
    }

    const color = status === 'success' ? 'good' : status === 'failure' ? 'danger' : 'warning';
    const emoji = status === 'success' ? '🚀' : status === 'failure' ? '💥' : '⏳';

    const message = {
      text: `${emoji} Deployment ${status.toUpperCase()}`,
      attachments: [
        {
          color,
          title: `Environment: ${environment}`,
          fields: [
            {
              title: 'Status',
              value: status,
              short: true
            },
            {
              title: 'Timestamp',
              value: new Date().toISOString(),
              short: true
            }
          ]
        }
      ]
    };

    // Add additional details
    if (details.version) {
      message.attachments[0].fields.push({
        title: 'Version',
        value: details.version,
        short: true
      });
    }

    if (details.duration) {
      message.attachments[0].fields.push({
        title: 'Duration',
        value: `${details.duration}ms`,
        short: true
      });
    }

    if (details.testsRun) {
      message.attachments[0].fields.push({
        title: 'Tests Run',
        value: `${details.testsRun.passed}/${details.testsRun.total} passed`,
        short: false
      });
    }

    return await this.sendMessage(message);
  }

  // Test the Slack integration
  async testConnection() {
    if (!this.isEnabled()) {
      this.logger.warn('Slack integration not enabled');
      return false;
    }

    try {
      await this.sendCustomMessage(
        '🧪 MCP Slack Test',
        'This is a test message from MCP to verify Slack integration is working.',
        'good',
        [
          {
            title: 'Status',
            value: 'Connection successful',
            short: true
          },
          {
            title: 'Timestamp',
            value: new Date().toISOString(),
            short: true
          }
        ]
      );

      this.logger.success('Slack integration test successful');
      return true;
    } catch (error) {
      this.logger.error('Slack integration test failed', error);
      return false;
    }
  }
}

module.exports = SlackIntegration;
