const path = require('path');
const fs = require('fs');

class MCPConfig {
  constructor() {
    this.loadConfig();
  }

  loadConfig() {
    // Default configuration
    this.config = {
      // MCP Server Configuration
      servers: {
        playwright: {
          port: 3001,
          name: 'playwright-ai-server',
          description: 'AI-powered Playwright test analysis and generation'
        },
        testData: {
          port: 3002,
          name: 'test-data-server',
          description: 'Test data generation and management'
        },
        analyzer: {
          port: 3003,
          name: 'test-analyzer-server',
          description: 'Test failure analysis and reporting'
        }
      },

      // AI Configuration
      ai: {
        provider: 'anthropic',
        model: 'claude-3-sonnet-20240229',
        maxTokens: 4000,
        temperature: 0.1
      },

      // Output Directories
      output: {
        testData: path.join(process.cwd(), 'test-results', 'mcp-data'),
        analysis: path.join(process.cwd(), 'test-results', 'mcp-analysis'),
        reports: path.join(process.cwd(), 'test-results', 'mcp-reports')
      },

      // Test Configuration
      test: {
        defaultTimeout: 30000,
        retries: 2,
        environments: ['qc2', 'qc3', 'qc6', 'uat361']
      },

      // Logging Configuration
      logging: {
        level: 'info',
        file: path.join(process.cwd(), 'logs', 'mcp.log'),
        maxSize: '10MB',
        maxFiles: 5
      }
    };

    // Load environment-specific overrides
    this.loadEnvironmentConfig();
  }

  loadEnvironmentConfig() {
    const envConfigPath = path.join(process.cwd(), '.env.mcp');
    if (fs.existsSync(envConfigPath)) {
      require('dotenv').config({ path: envConfigPath });
    }

    // Override with environment variables
    if (process.env.ANTHROPIC_API_KEY) {
      this.config.ai.apiKey = process.env.ANTHROPIC_API_KEY;
    }

    if (process.env.MCP_LOG_LEVEL) {
      this.config.logging.level = process.env.MCP_LOG_LEVEL;
    }

    if (process.env.MCP_TEST_TIMEOUT) {
      this.config.test.defaultTimeout = parseInt(process.env.MCP_TEST_TIMEOUT);
    }
  }

  get(key) {
    return this.getNestedValue(this.config, key);
  }

  set(key, value) {
    this.setNestedValue(this.config, key, value);
  }

  getNestedValue(obj, key) {
    return key.split('.').reduce((o, k) => (o || {})[k], obj);
  }

  setNestedValue(obj, key, value) {
    const keys = key.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((o, k) => o[k] = o[k] || {}, obj);
    target[lastKey] = value;
  }

  // Ensure output directories exist
  ensureDirectories() {
    Object.values(this.config.output).forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  // Get server configuration
  getServerConfig(serverName) {
    return this.config.servers[serverName];
  }

  // Get all server configurations
  getAllServers() {
    return this.config.servers;
  }

  // Update configuration at runtime
  updateConfig(updates) {
    this.config = { ...this.config, ...updates };
  }

  // Export configuration for external use
  toJSON() {
    return JSON.stringify(this.config, null, 2);
  }
}

module.exports = MCPConfig;
