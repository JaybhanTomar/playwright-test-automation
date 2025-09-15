/**
 * MCP Integration Manager
 * Manages all external integrations (GitHub, Slack, CI/CD, etc.)
 */

const GitHubIntegration = require('./github-integration');
const SlackIntegration = require('./slack-integration');
const CICDIntegration = require('./cicd-integration');
const mcpConfig = require('../config/mcp-config');
const mcpLogger = require('../utils/mcp-logger');

class IntegrationManager {
  constructor() {
    this.logger = mcpLogger;
    this.integrations = {
      github: new GitHubIntegration(),
      slack: new SlackIntegration(),
      cicd: new CICDIntegration()
    };
  }

  // Initialize all enabled integrations
  async initialize() {
    this.logger.info('Initializing MCP integrations');

    const enabledIntegrations = [];

    // Check which integrations are enabled
    if (this.integrations.github.isEnabled()) {
      enabledIntegrations.push('GitHub');
    }

    if (this.integrations.slack.isEnabled()) {
      enabledIntegrations.push('Slack');
    }

    if (this.integrations.cicd.isEnabled()) {
      enabledIntegrations.push('CI/CD');
    }

    if (enabledIntegrations.length > 0) {
      this.logger.success(`Enabled integrations: ${enabledIntegrations.join(', ')}`);
    } else {
      this.logger.info('No external integrations enabled');
    }

    return enabledIntegrations;
  }

  // Handle test failure across all integrations
  async handleTestFailure(testFile, error, analysis) {
    this.logger.info(`Handling test failure across integrations: ${testFile}`);

    const results = {};

    // GitHub: Create issue
    if (this.integrations.github.isEnabled()) {
      try {
        results.github = await this.integrations.github.createIssueForFailure(testFile, error, analysis);
      } catch (err) {
        this.logger.error('GitHub integration failed', err);
      }
    }

    // Slack: Send notification
    if (this.integrations.slack.isEnabled()) {
      try {
        results.slack = await this.integrations.slack.notifyTestFailure(testFile, error, analysis);
      } catch (err) {
        this.logger.error('Slack integration failed', err);
      }
    }

    // CI/CD: Send webhook
    if (this.integrations.cicd.isEnabled()) {
      try {
        results.cicd = await this.integrations.cicd.sendWebhook({
          event: 'test_failure',
          testFile,
          error: error.message,
          analysis
        });
      } catch (err) {
        this.logger.error('CI/CD integration failed', err);
      }
    }

    return results;
  }

  // Handle test success across all integrations
  async handleTestSuccess(testResults) {
    this.logger.info('Handling test success across integrations');

    const results = {};

    // Close GitHub issues for fixed tests
    if (this.integrations.github.isEnabled() && testResults.fixed) {
      try {
        for (const fixedTest of testResults.fixed) {
          await this.integrations.github.closeIssueIfFixed(fixedTest.testFile, true);
        }
      } catch (err) {
        this.logger.error('GitHub issue closure failed', err);
      }
    }

    // Send Slack success notification
    if (this.integrations.slack.isEnabled()) {
      try {
        results.slack = await this.integrations.slack.notifyTestSuccess(testResults);
      } catch (err) {
        this.logger.error('Slack success notification failed', err);
      }
    }

    // Send CI/CD webhook
    if (this.integrations.cicd.isEnabled()) {
      try {
        results.cicd = await this.integrations.cicd.notifyTestCompletion(testResults);
      } catch (err) {
        this.logger.error('CI/CD success notification failed', err);
      }
    }

    return results;
  }

  // Handle flaky tests
  async handleFlakyTests(flakyTests) {
    if (!flakyTests || flakyTests.length === 0) {
      return {};
    }

    this.logger.info(`Handling ${flakyTests.length} flaky tests across integrations`);

    const results = {};

    // Slack: Notify about flaky tests
    if (this.integrations.slack.isEnabled()) {
      try {
        results.slack = await this.integrations.slack.notifyFlakyTests(flakyTests);
      } catch (err) {
        this.logger.error('Slack flaky test notification failed', err);
      }
    }

    // GitHub: Create issues for consistently flaky tests
    if (this.integrations.github.isEnabled()) {
      try {
        const consistentlyFlaky = flakyTests.filter(test => test.failureRate > 30);
        for (const test of consistentlyFlaky) {
          await this.integrations.github.createIssueForFailure(
            test.name,
            { message: `Flaky test with ${test.failureRate}% failure rate` },
            `This test has been failing ${test.failureRate}% of the time over ${test.runs} runs. Consider investigating and stabilizing this test.`
          );
        }
      } catch (err) {
        this.logger.error('GitHub flaky test issue creation failed', err);
      }
    }

    return results;
  }

  // Handle performance issues
  async handlePerformanceIssue(testFile, duration, threshold) {
    this.logger.info(`Handling performance issue: ${testFile} (${duration}ms)`);

    const results = {};

    // Slack: Notify about slow test
    if (this.integrations.slack.isEnabled()) {
      try {
        results.slack = await this.integrations.slack.notifyPerformanceIssue(testFile, duration, threshold);
      } catch (err) {
        this.logger.error('Slack performance notification failed', err);
      }
    }

    return results;
  }

  // Handle PR comments
  async handlePRComment(prNumber, testResults) {
    if (!prNumber) {
      return null;
    }

    this.logger.info(`Adding PR comment for #${prNumber}`);

    // GitHub: Comment on PR
    if (this.integrations.github.isEnabled()) {
      try {
        return await this.integrations.github.commentOnPR(prNumber, testResults);
      } catch (err) {
        this.logger.error('GitHub PR comment failed', err);
      }
    }

    return null;
  }

  // Generate daily report across all integrations
  async generateDailyReport(reportData) {
    this.logger.info('Generating daily report across integrations');

    const results = {};

    // Slack: Send daily report
    if (this.integrations.slack.isEnabled()) {
      try {
        results.slack = await this.integrations.slack.sendDailyReport(reportData);
      } catch (err) {
        this.logger.error('Slack daily report failed', err);
      }
    }

    return results;
  }

  // Setup CI/CD files
  async setupCICD(provider) {
    this.logger.info(`Setting up CI/CD for ${provider}`);

    if (this.integrations.cicd.isEnabled()) {
      try {
        await this.integrations.cicd.setupCICD(provider);
        this.logger.success(`CI/CD setup completed for ${provider}`);
      } catch (err) {
        this.logger.error('CI/CD setup failed', err);
      }
    }
  }

  // Test all integrations
  async testIntegrations() {
    this.logger.info('Testing all integrations');

    const results = {
      github: false,
      slack: false,
      cicd: false
    };

    // Test GitHub
    if (this.integrations.github.isEnabled()) {
      try {
        const repoInfo = await this.integrations.github.getRepoInfo();
        results.github = !!repoInfo;
        this.logger.success('GitHub integration test passed');
      } catch (err) {
        this.logger.error('GitHub integration test failed', err);
      }
    }

    // Test Slack
    if (this.integrations.slack.isEnabled()) {
      try {
        results.slack = await this.integrations.slack.testConnection();
      } catch (err) {
        this.logger.error('Slack integration test failed', err);
      }
    }

    // Test CI/CD
    if (this.integrations.cicd.isEnabled()) {
      try {
        const ciInfo = this.integrations.cicd.getCIInfo();
        results.cicd = !!ciInfo;
        this.logger.success('CI/CD integration test passed');
      } catch (err) {
        this.logger.error('CI/CD integration test failed', err);
      }
    }

    return results;
  }

  // Get integration status
  getIntegrationStatus() {
    return {
      github: {
        enabled: this.integrations.github.isEnabled(),
        config: mcpConfig.get('github')
      },
      slack: {
        enabled: this.integrations.slack.isEnabled(),
        config: mcpConfig.get('slack')
      },
      cicd: {
        enabled: this.integrations.cicd.isEnabled(),
        config: mcpConfig.get('cicd')
      }
    };
  }

  // Handle deployment notifications
  async handleDeployment(environment, status, details = {}) {
    this.logger.info(`Handling deployment notification: ${environment} - ${status}`);

    const results = {};

    // Slack: Notify about deployment
    if (this.integrations.slack.isEnabled()) {
      try {
        results.slack = await this.integrations.slack.notifyDeployment(environment, status, details);
      } catch (err) {
        this.logger.error('Slack deployment notification failed', err);
      }
    }

    // CI/CD: Send webhook
    if (this.integrations.cicd.isEnabled()) {
      try {
        results.cicd = await this.integrations.cicd.sendWebhook({
          event: 'deployment',
          environment,
          status,
          details
        });
      } catch (err) {
        this.logger.error('CI/CD deployment webhook failed', err);
      }
    }

    return results;
  }

  // Sync all test results
  async syncTestResults(testResults) {
    this.logger.info('Syncing test results across all integrations');

    // GitHub: Sync issues and PR comments
    if (this.integrations.github.isEnabled()) {
      try {
        await this.integrations.github.syncTestResults(testResults);
      } catch (err) {
        this.logger.error('GitHub sync failed', err);
      }
    }

    // Handle based on results
    if (testResults.failures && testResults.failures.length > 0) {
      for (const failure of testResults.failures) {
        await this.handleTestFailure(failure.testFile, failure.error, failure.analysis);
      }
    }

    if (testResults.success) {
      await this.handleTestSuccess(testResults);
    }

    if (testResults.flakyTests && testResults.flakyTests.length > 0) {
      await this.handleFlakyTests(testResults.flakyTests);
    }
  }
}

module.exports = IntegrationManager;
