# 🎭 Playwright Demo - AI-Powered Test Automation Framework

[![Playwright Tests](https://github.com/your-username/playwright-demo-new/actions/workflows/playwright.yml/badge.svg)](https://github.com/your-username/playwright-demo-new/actions/workflows/playwright.yml)
[![MCP Integration](https://img.shields.io/badge/MCP-Enabled-blue)](https://github.com/modelcontextprotocol/specification)
[![AI Powered](https://img.shields.io/badge/AI-Claude%203%20Sonnet-green)](https://www.anthropic.com/claude)

> **Advanced Playwright testing framework with AI-powered analysis, automated failure diagnosis, and intelligent test data generation.**

## 📋 **Table of Contents**

- [🚀 What Makes This Special](#-what-makes-this-special)
- [🎯 Quick Start](#-quick-start)
- [🤖 MCP (AI Features)](#-mcp-model-context-protocol---ai-features)
- [🎭 Test Suites](#-test-suites)
- [⚙️ Configuration](#️-configuration)
- [📊 Reporting & Analytics](#-reporting--analytics)
- [🛠️ Development](#️-development)
- [🎯 Available Commands](#-available-commands)
- [🤝 Contributing](#-contributing)
- [🚨 Troubleshooting](#-troubleshooting)

---

## 🚀 **What Makes This Special**

### **🤖 AI-Powered Testing (MCP Integration)**
- **Smart Test Analysis**: AI analyzes failures and suggests fixes
- **Intelligent Data Generation**: Creates realistic test data automatically
- **Performance Insights**: AI-driven performance optimization recommendations
- **Automated Reporting**: Comprehensive test reports with actionable insights

### **🎭 Comprehensive Test Coverage**
- **RBL Testing**: Complete RBL (Real-time Business Logic) test suite
- **IRC Testing**: Interactive Response Center automation
- **Sanity Testing**: Quick smoke tests for core functionality
- **Multi-Environment**: QC2, QC3, QC6, UAT361 support

### **📊 Advanced Features**
- **Page Object Model**: Clean, maintainable test architecture
- **Excel Data Integration**: Data-driven testing with Excel files
- **Multi-Browser Support**: Chromium, Firefox, WebKit
- **Comprehensive Reporting**: HTML, Allure, and JSON reports
- **Error Handling**: Robust error handling and retry mechanisms

---

## 🎯 **Quick Start**

### **1. Clone & Install**
```bash
git clone https://github.com/your-username/playwright-demo-new.git
cd playwright-demo-new
npm install
npx playwright install
```

### **2. Basic Testing**
```bash
# Run RBL tests
npm run test:rbl

# Run IRC tests  
npm run test:irc

# Run Sanity tests
npm run test:sanity

# Run all tests
npm test
```

### **3. Environment Testing**
```bash
# Test on different environments
QC_ENV=qc2 npm test
QC_ENV=qc6 npm test
QC_ENV=uat361 npm test

# Run in headed mode for debugging
npm run test:headed
```

---

## 🤖 **MCP (Model Context Protocol) - AI Features**

### **🚀 Quick MCP Commands**

#### **Check System Status**
```bash
npm run mcp:status
```

#### **Generate Test Data with AI**
```bash
# Generate 5 users
npm run mcp:generate users -- --count 5

# Generate campaigns in CSV format
npm run mcp:generate campaigns -- --count 3 --format csv
```

#### **Run Tests with AI Analysis**
```bash
# Run test with automatic failure analysis
npm run mcp:test tests/RBL/RBL/E_setupLeadField.spec.js

# Run in headed mode with data generation
npm run mcp:test tests/Sanity/A_setupCategory.spec.js -- --headed --generate-data users
```

#### **Analyze Test Failures**
```bash
# Get AI analysis of test failure
npm run mcp:analyze tests/RBL/RBL/E_setupLeadField.spec.js -- --type failure --error "Element not found"

# Code quality analysis
npm run mcp:analyze tests/IRC/campaign.spec.js -- --type code
```

### **🎯 MCP Features**

- **🤖 AI Test Analysis**: Intelligent failure diagnosis with actionable recommendations
- **📊 Smart Data Generation**: Creates realistic test data (users, campaigns, leads, contacts)
- **🔍 Code Quality Review**: AI-powered code analysis and improvement suggestions
- **📈 Performance Insights**: Automated performance analysis and optimization tips
- **🧹 Artifact Management**: Automated cleanup and organization of test artifacts

### **📚 Learn More**
For detailed MCP usage, see [MCP Integration Guide](MCP-INTEGRATION-GUIDE.md)

---

## 🎭 **Test Suites**

### **🏢 RBL (Real-time Business Logic) Tests**
```bash
npm run test:rbl                    # All RBL tests
npm run test:rbl:users             # User management tests
npm run test:rbl:leads             # Lead management tests
npm run test:rbl:campaigns         # Campaign tests
npm run test:rbl:system-setup      # System configuration tests
```

**Features:**
- ✅ User creation, updation, and role verification
- ✅ Lead field setup and management
- ✅ Campaign configuration and testing
- ✅ System setup automation
- ✅ Multi-environment support (QC6, UAT361)
- ✅ Captcha handling and session management

### **📞 IRC (Interactive Response Center) Tests**
```bash
npm run test:irc                   # All IRC tests
npm run test:irc:campaigns         # Campaign management
npm run test:irc:contacts          # Contact management
npm run test:irc:dialer           # Dialer functionality
```

**Features:**
- ✅ Campaign creation and management
- ✅ Contact import and validation
- ✅ Dialer configuration and testing
- ✅ Call flow automation
- ✅ Reporting and analytics

### **🔍 Sanity Tests**
```bash
npm run test:sanity               # Quick smoke tests
npm run test:sanity:login         # Login functionality
npm run test:sanity:navigation    # Basic navigation
```

---

## ⚙️ **Configuration**

### **Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Configure your settings:
DEFAULT_TEST_ENVIRONMENT=qc2               # Default test environment
```

### **Test Environments**
- **QC2**: `QC_ENV=qc2 npm test`
- **QC3**: `QC_ENV=qc3 npm test`
- **QC6**: `QC_ENV=qc6 npm test`
- **UAT361**: `QC_ENV=uat361 npm test`

### **Browser Configuration**
```bash
# Run in different browsers
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Headed mode for debugging
npm run test:headed
```

---

## 📊 **Reporting & Analytics**

### **Built-in Reports**
- **Playwright HTML Report**: `npx playwright show-report`
- **Allure Reports**: `npm run allure:serve`
- **JSON Reports**: Available in `test-results/`

### **Performance Tracking**
- **Test execution times** tracked automatically
- **Environment comparison** analytics
- **Failure rate monitoring**

---

## 🛠️ **Development**

### **Project Structure**
```
playwright-demo-new/
├── tests/
│   ├── RBL/                    # RBL test suites
│   ├── IRC/                    # IRC test suites
│   ├── Sanity/                 # Sanity test suites
│   ├── pages/                  # Page Object Models
│   ├── data/                   # Test data (Excel files)
│   └── utils/                  # Utility functions
├── playwright.config.js        # Playwright configuration
└── package.json               # Dependencies and scripts
```

### **Adding New Tests**
```bash
# Follow existing patterns in test suites
# Use Page Object Model for maintainability
# Add test data to Excel files in tests/data/
```

### **Page Object Model**
```javascript
// Example: tests/pages/LoginPage.js
class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = '#user_login';
    this.passwordInput = '#user_pass';
    this.loginButton = '#wp-submit';
  }

  async login(email, password) {
    await this.page.fill(this.emailInput, email);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }
}
```

---

## 🎯 **Available Commands**

### **Testing Commands**
```bash
npm test                       # Run all tests
npm run test:rbl              # RBL tests
npm run test:irc              # IRC tests
npm run test:sanity           # Sanity tests
npm run test:headed           # Run in headed mode
npm run test:debug            # Debug mode
```

### **MCP (AI) Commands**
```bash
npm run mcp:status            # Show MCP system status
npm run mcp:test <file>       # Run test with AI analysis
npm run mcp:generate <type>   # Generate test data
npm run mcp:analyze <file>    # Analyze test failures/code
npm run mcp:config            # Show/update configuration
npm run mcp:clean             # Clean MCP artifacts
```

### **Reporting Commands**
```bash
npm run report:html           # Open Playwright report
npm run allure:generate       # Generate Allure report
npm run allure:serve          # Serve Allure report
```

### **Utility Commands**
```bash
npm run lint                  # Run ESLint
npm run format                # Format code with Prettier
```

---

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Run tests**: `npm test`
4. **Commit changes**: `git commit -m 'Add amazing feature'`
5. **Push to branch**: `git push origin feature/amazing-feature`
6. **Open Pull Request**

### **Code Standards**
- Follow existing Page Object Model patterns
- Add comprehensive test data in Excel files
- Include error handling and retry logic
- Document complex test scenarios

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Login Timeouts**
```bash
# If experiencing login timeouts:
QC_ENV=uat361 npm test --timeout 180000

# Check environment configuration
```

#### **Captcha Handling**
- Tests automatically wait 20 seconds for manual captcha solving
- Captcha state is tracked per session to avoid repeated waits
- Use `--headed` mode to solve captchas manually during test runs

#### **Environment Issues**
```bash
# Check current environment configuration:
echo $QC_ENV

# Switch environments:
QC_ENV=qc6 npm test
QC_ENV=uat361 npm test
```

### **Debug Mode**
```bash
# Enable debug mode for detailed logging:
npm run test:debug

# Run specific test in headed mode:
npx playwright test tests/RBL/RBL/E_setupLeadField.spec.js --headed
```

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **Playwright Team** for the excellent testing framework
- **Open Source Community** for inspiration and best practices

---

**🚀 Ready to start testing? Run `npm test` to get started!**

---

## ⭐ **Star This Repository**

If this project helps you with your testing automation, please consider giving it a star! ⭐

**Happy Testing!** 🎭✨
