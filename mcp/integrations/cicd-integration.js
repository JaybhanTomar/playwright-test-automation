/**
 * MCP CI/CD Integration
 * Integrates with various CI/CD platforms (GitHub Actions, Jenkins, GitLab CI)
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const mcpConfig = require('../config/mcp-config');
const mcpLogger = require('../utils/mcp-logger');

class CICDIntegration {
  constructor() {
    this.config = mcpConfig.get('cicd');
    this.logger = mcpLogger;
  }

  isEnabled() {
    return this.config.enabled;
  }

  // Detect CI environment
  detectCIEnvironment() {
    if (process.env.GITHUB_ACTIONS) return 'github-actions';
    if (process.env.JENKINS_URL) return 'jenkins';
    if (process.env.GITLAB_CI) return 'gitlab-ci';
    if (process.env.CIRCLECI) return 'circleci';
    if (process.env.TRAVIS) return 'travis';
    return 'unknown';
  }

  // Get CI environment information
  getCIInfo() {
    const provider = this.detectCIEnvironment();
    
    const info = {
      provider,
      isCI: true,
      branch: null,
      commit: null,
      buildNumber: null,
      pullRequest: null
    };

    switch (provider) {
      case 'github-actions':
        info.branch = process.env.GITHUB_REF_NAME;
        info.commit = process.env.GITHUB_SHA;
        info.buildNumber = process.env.GITHUB_RUN_NUMBER;
        info.pullRequest = process.env.GITHUB_EVENT_NAME === 'pull_request' ? 
          process.env.GITHUB_EVENT_PULL_REQUEST_NUMBER : null;
        break;
        
      case 'jenkins':
        info.branch = process.env.GIT_BRANCH;
        info.commit = process.env.GIT_COMMIT;
        info.buildNumber = process.env.BUILD_NUMBER;
        break;
        
      case 'gitlab-ci':
        info.branch = process.env.CI_COMMIT_REF_NAME;
        info.commit = process.env.CI_COMMIT_SHA;
        info.buildNumber = process.env.CI_PIPELINE_ID;
        info.pullRequest = process.env.CI_MERGE_REQUEST_IID;
        break;
    }

    return info;
  }

  // Generate GitHub Actions workflow
  generateGitHubActionsWorkflow() {
    const workflow = `name: MCP Playwright Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        environment: [qc6, uat361]
    
    steps:
    - uses: actions/checkout@v4
    
    - uses: actions/setup-node@v4
      with:
        node-version: 18
        
    - name: Install dependencies
      run: |
        npm ci
        cd mcp && npm ci
        
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
      
    - name: Setup MCP
      run: |
        cp .env.mcp.example .env.mcp
        node install-mcp.js
        
    - name: Run Playwright tests with MCP
      env:
        QC_ENV: \${{ matrix.environment }}
        GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK_URL }}
        ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
      run: |
        npm run mcp:test tests/RBL/RBL/E_setupLeadField.spec.js --headed=false
        
    - name: Generate MCP Report
      if: always()
      run: npm run mcp:report --format markdown --output test-report.md
      
    - name: Upload test results
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report-\${{ matrix.environment }}
        path: |
          playwright-report/
          test-results/
          test-report.md
        retention-days: 30
        
    - name: Comment PR with results
      if: github.event_name == 'pull_request'
      uses: actions/github-script@v7
      with:
        script: |
          const fs = require('fs');
          if (fs.existsSync('test-report.md')) {
            const report = fs.readFileSync('test-report.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: report
            });
          }`;

    return workflow;
  }

  // Generate Jenkins pipeline
  generateJenkinsPipeline() {
    const pipeline = `pipeline {
    agent any
    
    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['qc6', 'uat361', 'qc2', 'qc3'],
            description: 'Test environment'
        )
        booleanParam(
            name: 'HEADED',
            defaultValue: false,
            description: 'Run tests in headed mode'
        )
    }
    
    environment {
        QC_ENV = "\${params.ENVIRONMENT}"
        ANTHROPIC_API_KEY = credentials('anthropic-api-key')
        SLACK_WEBHOOK_URL = credentials('slack-webhook-url')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                sh 'cd mcp && npm ci'
                sh 'npx playwright install --with-deps'
            }
        }
        
        stage('Setup MCP') {
            steps {
                sh 'cp .env.mcp.example .env.mcp'
                sh 'node install-mcp.js'
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    def headedFlag = params.HEADED ? '--headed' : '--headed=false'
                    sh "npm run mcp:test tests/RBL/RBL/E_setupLeadField.spec.js \${headedFlag}"
                }
            }
        }
        
        stage('Generate Report') {
            steps {
                sh 'npm run mcp:report --format markdown --output test-report.md'
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'test-results/**, playwright-report/**, test-report.md', fingerprint: true
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])
        }
        
        failure {
            script {
                if (env.SLACK_WEBHOOK_URL) {
                    sh '''
                        curl -X POST -H 'Content-type: application/json' \\
                        --data '{"text":"🚨 MCP Tests Failed in Jenkins\\nBuild: '"$BUILD_URL"'\\nEnvironment: '"$QC_ENV"'"}' \\
                        $SLACK_WEBHOOK_URL
                    '''
                }
            }
        }
        
        success {
            script {
                if (env.SLACK_WEBHOOK_URL) {
                    sh '''
                        curl -X POST -H 'Content-type: application/json' \\
                        --data '{"text":"✅ MCP Tests Passed in Jenkins\\nBuild: '"$BUILD_URL"'\\nEnvironment: '"$QC_ENV"'"}' \\
                        $SLACK_WEBHOOK_URL
                    '''
                }
            }
        }
    }
}`;

    return pipeline;
  }

  // Send webhook notification
  async sendWebhook(data) {
    if (!this.config.webhookUrl) {
      return null;
    }

    try {
      const response = await axios.post(this.config.webhookUrl, {
        timestamp: new Date().toISOString(),
        source: 'mcp',
        ci_info: this.getCIInfo(),
        ...data
      });

      this.logger.success('Sent CI/CD webhook notification');
      return response.data;
    } catch (error) {
      this.logger.error('Failed to send CI/CD webhook', error);
      return null;
    }
  }

  // Notify test completion
  async notifyTestCompletion(testResults) {
    if (!this.isEnabled()) {
      return null;
    }

    const ciInfo = this.getCIInfo();
    const shouldNotify = (testResults.success && this.config.notifyOnSuccess) ||
                        (!testResults.success && this.config.notifyOnFailure);

    if (!shouldNotify) {
      return null;
    }

    const data = {
      event: 'test_completion',
      status: testResults.success ? 'success' : 'failure',
      results: testResults,
      ci_info: ciInfo
    };

    return await this.sendWebhook(data);
  }

  // Set up CI/CD files
  async setupCICD(provider = null) {
    const targetProvider = provider || this.config.provider;
    
    this.logger.info(`Setting up CI/CD for ${targetProvider}`);

    try {
      switch (targetProvider) {
        case 'github-actions':
          const workflowDir = '.github/workflows';
          if (!fs.existsSync(workflowDir)) {
            fs.mkdirSync(workflowDir, { recursive: true });
          }
          
          const workflowPath = path.join(workflowDir, 'mcp-tests.yml');
          fs.writeFileSync(workflowPath, this.generateGitHubActionsWorkflow());
          
          this.logger.success(`Created GitHub Actions workflow: ${workflowPath}`);
          break;
          
        case 'jenkins':
          const pipelinePath = 'Jenkinsfile';
          fs.writeFileSync(pipelinePath, this.generateJenkinsPipeline());
          
          this.logger.success(`Created Jenkins pipeline: ${pipelinePath}`);
          break;
          
        default:
          this.logger.warn(`CI/CD provider ${targetProvider} not supported yet`);
      }
    } catch (error) {
      this.logger.error('Failed to setup CI/CD files', error);
    }
  }

  // Get build artifacts
  getBuildArtifacts() {
    const artifacts = [];
    
    const artifactDirs = [
      'test-results',
      'playwright-report',
      'allure-results',
      'logs/mcp'
    ];

    artifactDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        artifacts.push({
          name: dir,
          path: dir,
          type: 'directory'
        });
      }
    });

    // Add individual files
    const artifactFiles = [
      'test-report.md',
      'mcp-summary.json'
    ];

    artifactFiles.forEach(file => {
      if (fs.existsSync(file)) {
        artifacts.push({
          name: file,
          path: file,
          type: 'file'
        });
      }
    });

    return artifacts;
  }

  // Generate CI summary
  generateCISummary(testResults) {
    const ciInfo = this.getCIInfo();
    
    const summary = {
      ci_info: ciInfo,
      test_results: testResults,
      artifacts: this.getBuildArtifacts(),
      mcp_config: {
        environment: mcpConfig.get('project.defaultEnvironment'),
        ai_model: mcpConfig.get('ai.model'),
        debug_mode: mcpConfig.get('debug.enabled')
      },
      timestamp: new Date().toISOString()
    };

    // Save summary to file
    fs.writeFileSync('mcp-ci-summary.json', JSON.stringify(summary, null, 2));
    
    return summary;
  }
}

module.exports = CICDIntegration;
