#!/usr/bin/env node

/**
 * MCP Server for Test Data Generation
 * Provides AI-powered test data generation for Playwright tests
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

class TestDataServer {
  constructor() {
    this.server = new Server(
      {
        name: 'test-data-generator',
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
            name: 'generate_user_data',
            description: 'Generate realistic user data for testing',
            inputSchema: {
              type: 'object',
              properties: {
                count: {
                  type: 'number',
                  description: 'Number of users to generate',
                  default: 1
                },
                roles: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'User roles to generate (admin, caller, etc.)'
                },
                format: {
                  type: 'string',
                  enum: ['json', 'excel', 'csv'],
                  description: 'Output format',
                  default: 'json'
                }
              },
              required: ['count']
            }
          },
          {
            name: 'generate_campaign_data',
            description: 'Generate campaign test data',
            inputSchema: {
              type: 'object',
              properties: {
                count: {
                  type: 'number',
                  description: 'Number of campaigns to generate',
                  default: 1
                },
                type: {
                  type: 'string',
                  enum: ['outbound', 'inbound', 'blended'],
                  description: 'Campaign type'
                },
                format: {
                  type: 'string',
                  enum: ['json', 'excel', 'csv'],
                  default: 'json'
                }
              },
              required: ['count']
            }
          },
          {
            name: 'generate_lead_data',
            description: 'Generate lead/contact data for testing',
            inputSchema: {
              type: 'object',
              properties: {
                count: {
                  type: 'number',
                  description: 'Number of leads to generate',
                  default: 10
                },
                fields: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Custom fields to include'
                },
                format: {
                  type: 'string',
                  enum: ['json', 'excel', 'csv'],
                  default: 'json'
                }
              },
              required: ['count']
            }
          },
          {
            name: 'generate_test_scenarios',
            description: 'Generate test scenario data based on existing patterns',
            inputSchema: {
              type: 'object',
              properties: {
                testType: {
                  type: 'string',
                  enum: ['RBL', 'IRC', 'Sanity', 'Campaign'],
                  description: 'Type of test scenarios to generate'
                },
                complexity: {
                  type: 'string',
                  enum: ['simple', 'medium', 'complex'],
                  description: 'Complexity level of scenarios',
                  default: 'medium'
                },
                count: {
                  type: 'number',
                  description: 'Number of scenarios to generate',
                  default: 5
                }
              },
              required: ['testType']
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
          case 'generate_user_data':
            return await this.generateUserData(args);
          case 'generate_campaign_data':
            return await this.generateCampaignData(args);
          case 'generate_lead_data':
            return await this.generateLeadData(args);
          case 'generate_test_scenarios':
            return await this.generateTestScenarios(args);
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

  async generateUserData(args) {
    const { count, roles = ['admin', 'caller'], format = 'json' } = args;
    
    const users = [];
    const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Tom', 'Anna', 'Chris', 'Emma'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const timeZones = ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'UTC'];

    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const role = roles[Math.floor(Math.random() * roles.length)];
      
      const user = {
        firstName,
        lastName,
        role,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@test.com`,
        password: `Test@${Math.floor(Math.random() * 9999) + 1000}`,
        timeZone: timeZones[Math.floor(Math.random() * timeZones.length)],
        extension: `${Math.floor(Math.random() * 9000) + 1000}`,
        phoneNumber: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        userskill: ['Customer Service', 'Sales', 'Technical Support'][Math.floor(Math.random() * 3)],
        createdAt: moment().subtract(Math.floor(Math.random() * 30), 'days').format('YYYY-MM-DD HH:mm:ss'),
        id: uuidv4()
      };
      
      users.push(user);
    }

    const result = format === 'json' ? JSON.stringify(users, null, 2) : this.convertToFormat(users, format);
    
    return {
      content: [
        {
          type: 'text',
          text: `Generated ${count} user(s) in ${format} format:\n\n${result}`
        }
      ]
    };
  }

  async generateCampaignData(args) {
    const { count, type = 'outbound', format = 'json' } = args;
    
    const campaigns = [];
    const campaignNames = ['Summer Sale', 'Product Launch', 'Customer Survey', 'Follow-up Campaign', 'Lead Nurturing'];
    const dialModes = ['Preview', 'Progressive', 'Predictive', 'Manual'];

    for (let i = 0; i < count; i++) {
      const campaign = {
        name: `${campaignNames[Math.floor(Math.random() * campaignNames.length)]} ${i + 1}`,
        type,
        dialMode: dialModes[Math.floor(Math.random() * dialModes.length)],
        maxLines: Math.floor(Math.random() * 10) + 1,
        dialRatio: (Math.random() * 3 + 1).toFixed(2),
        startTime: '09:00',
        endTime: '17:00',
        timeZone: 'America/New_York',
        status: ['Active', 'Inactive', 'Paused'][Math.floor(Math.random() * 3)],
        priority: Math.floor(Math.random() * 10) + 1,
        description: `Test campaign for ${type} calling`,
        createdAt: moment().subtract(Math.floor(Math.random() * 7), 'days').format('YYYY-MM-DD HH:mm:ss'),
        id: uuidv4()
      };
      
      campaigns.push(campaign);
    }

    const result = format === 'json' ? JSON.stringify(campaigns, null, 2) : this.convertToFormat(campaigns, format);
    
    return {
      content: [
        {
          type: 'text',
          text: `Generated ${count} campaign(s) in ${format} format:\n\n${result}`
        }
      ]
    };
  }

  async generateLeadData(args) {
    const { count, fields = [], format = 'json' } = args;
    
    const leads = [];
    const firstNames = ['Michael', 'Jennifer', 'William', 'Elizabeth', 'James', 'Patricia', 'Robert', 'Linda'];
    const lastNames = ['Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia'];
    const companies = ['Tech Corp', 'Global Solutions', 'Innovation Inc', 'Future Systems', 'Digital Dynamics'];
    const statuses = ['New', 'Contacted', 'Qualified', 'Proposal', 'Closed Won', 'Closed Lost'];

    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      const lead = {
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${companies[Math.floor(Math.random() * companies.length)].toLowerCase().replace(' ', '')}.com`,
        phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        company: companies[Math.floor(Math.random() * companies.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        source: ['Website', 'Referral', 'Cold Call', 'Email Campaign', 'Social Media'][Math.floor(Math.random() * 5)],
        value: Math.floor(Math.random() * 50000) + 1000,
        notes: `Test lead generated for automation testing - ${i + 1}`,
        createdAt: moment().subtract(Math.floor(Math.random() * 60), 'days').format('YYYY-MM-DD HH:mm:ss'),
        id: uuidv4()
      };

      // Add custom fields if specified
      fields.forEach(field => {
        lead[field] = `Custom ${field} value ${i + 1}`;
      });
      
      leads.push(lead);
    }

    const result = format === 'json' ? JSON.stringify(leads, null, 2) : this.convertToFormat(leads, format);
    
    return {
      content: [
        {
          type: 'text',
          text: `Generated ${count} lead(s) in ${format} format:\n\n${result}`
        }
      ]
    };
  }

  async generateTestScenarios(args) {
    const { testType, complexity = 'medium', count = 5 } = args;
    
    const scenarios = [];
    const scenarioTemplates = this.getScenarioTemplates(testType, complexity);
    
    for (let i = 0; i < count; i++) {
      const template = scenarioTemplates[Math.floor(Math.random() * scenarioTemplates.length)];
      const scenario = {
        id: uuidv4(),
        name: `${template.name} - Scenario ${i + 1}`,
        description: template.description,
        steps: template.steps,
        expectedResult: template.expectedResult,
        testData: template.testData,
        priority: template.priority,
        tags: template.tags,
        estimatedTime: template.estimatedTime
      };
      
      scenarios.push(scenario);
    }
    
    return {
      content: [
        {
          type: 'text',
          text: `Generated ${count} test scenario(s) for ${testType}:\n\n${JSON.stringify(scenarios, null, 2)}`
        }
      ]
    };
  }

  getScenarioTemplates(testType, complexity) {
    const templates = {
      RBL: [
        {
          name: 'User Creation and Login Verification',
          description: 'Create a new RBL user and verify login functionality',
          steps: ['Navigate to Users', 'Create new user', 'Save user', 'Logout', 'Login with new user', 'Verify role'],
          expectedResult: 'User created successfully and can login with correct role',
          testData: { userRole: 'caller', email: 'test@example.com' },
          priority: 'High',
          tags: ['user-management', 'authentication'],
          estimatedTime: '5 minutes'
        },
        {
          name: 'Lead Field Configuration',
          description: 'Configure custom lead fields in RBL system',
          steps: ['Navigate to System Setup', 'Go to Lead Fields', 'Create new field', 'Configure options', 'Save field'],
          expectedResult: 'Lead field created and available for use',
          testData: { fieldType: 'dropdown', options: ['Option1', 'Option2'] },
          priority: 'Medium',
          tags: ['system-setup', 'lead-fields'],
          estimatedTime: '3 minutes'
        }
      ],
      IRC: [
        {
          name: 'Campaign Creation',
          description: 'Create and configure a new IRC campaign',
          steps: ['Navigate to Campaigns', 'Create campaign', 'Set dial mode', 'Configure schedule', 'Activate campaign'],
          expectedResult: 'Campaign created and activated successfully',
          testData: { dialMode: 'Preview', schedule: '9AM-5PM' },
          priority: 'High',
          tags: ['campaign-management'],
          estimatedTime: '7 minutes'
        }
      ]
    };
    
    return templates[testType] || templates.RBL;
  }

  convertToFormat(data, format) {
    if (format === 'csv') {
      if (data.length === 0) return '';
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(item => Object.values(item).join(','));
      return [headers, ...rows].join('\n');
    }
    
    // For Excel format, return JSON with note about Excel conversion
    if (format === 'excel') {
      return JSON.stringify(data, null, 2) + '\n\n// Note: Use XLSX library to convert to Excel format';
    }
    
    return JSON.stringify(data, null, 2);
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Test Data Generator MCP server running on stdio');
  }
}

const server = new TestDataServer();
server.run().catch(console.error);
