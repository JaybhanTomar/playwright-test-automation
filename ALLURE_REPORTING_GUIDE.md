# Allure Reporting Guide for Playwright Tests

## Overview
This guide explains how to use the comprehensive Allure reporting system that has been set up for your Playwright tests. The system provides detailed test reports with timestamps, screenshots, test data, and comprehensive test execution information.

## Features

### ✅ **Comprehensive Test Information**
- **Timestamps**: Every test and step includes precise timestamps
- **Duration Tracking**: Detailed timing for tests and individual steps
- **Environment Information**: Complete environment details for each test run
- **Test Metadata**: Epic, Feature, Story, Severity, and Tags for better organization

### ✅ **Rich Test Data**
- **Screenshots**: Automatic screenshots on failure, manual screenshots during test execution
- **Test Data Attachments**: JSON data, Excel data, and custom test information
- **Step-by-Step Execution**: Detailed breakdown of each test step with timing
- **Error Details**: Complete error information with stack traces

### ✅ **Advanced Reporting**
- **Interactive HTML Reports**: Beautiful, interactive reports with filtering and search
- **Historical Trends**: Track test execution trends over time
- **Test Categories**: Organize tests by Epic, Feature, and Story
- **Environment Comparison**: Compare results across different environments

## Quick Start

### 1. **Run Tests with Allure Reporting**

```bash
# Run all tests with Allure reporting
npm run test:allure

# Run specific test suites with Allure reporting
npm run test:allure:sanity
npm run test:allure:campaign
npm run test:allure:contacts

# Run tests with clean results (removes previous results)
./scripts/allure-report.sh test --clean 'npm run test'
```

### 2. **Generate and View Reports**

```bash
# Generate report from existing results
npm run allure:generate

# Serve report on localhost:8080
npm run allure:serve

# Open report in browser
npm run allure:open

# Clean all reports and results
npm run allure:clean
```

### 3. **Advanced Usage**

```bash
# Run specific project with Allure
./scripts/allure-report.sh test 'npx playwright test --project="Sanity Tests"'

# Serve report on custom port
./scripts/allure-report.sh serve 9000

# Run tests and immediately serve report
npm run test:allure && npm run allure:serve
```

## Using Allure Helper in Your Tests

### **Basic Test Structure**

```javascript
const { test, expect } = require('@playwright/test');
const AllureHelper = require('../utils/AllureHelper');

test.describe('Your Test Suite', () => {
  let allureHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    allureHelper = new AllureHelper();
    
    await allureHelper.startTest(testInfo, {
      epic: 'Your Epic Name',
      feature: 'Your Feature Name',
      story: 'Your Story Name',
      severity: 'critical', // critical, major, minor, trivial
      tag: 'smoke',
      description: 'Detailed test description'
    });
  });

  test.afterEach(async ({ page }, testInfo) => {
    const status = testInfo.status === 'passed' ? 'passed' : 'failed';
    const error = testInfo.error || null;
    
    if (testInfo.status === 'failed') {
      await allureHelper.addScreenshot(page, 'Test Failure Screenshot');
    }
    
    await allureHelper.finishTest(testInfo, status, error);
  });

  test('Your Test Name', async ({ page }) => {
    // Step 1: Navigation
    await allureHelper.step('Navigate to Application', async () => {
      await page.goto('https://your-app.com');
      await expect(page).toHaveTitle(/Expected Title/);
    }, {
      expectedResult: 'Application should load successfully',
      testData: { url: 'https://your-app.com' }
    });

    // Take screenshot
    await allureHelper.addScreenshot(page, 'After Navigation');

    // Step 2: User interaction
    await allureHelper.step('Perform User Action', async () => {
      await page.fill('#username', 'testuser');
      await page.click('#submit');
    }, {
      expectedResult: 'User action should complete successfully',
      testData: { username: 'testuser' }
    });

    // Add test data
    await allureHelper.addTestData({
      testResult: 'success',
      completionTime: new Date().toISOString()
    }, 'Test Results');
  });
});
```

### **Available Allure Helper Methods**

#### **Test Initialization**
```javascript
await allureHelper.startTest(testInfo, {
  epic: 'Epic Name',
  feature: 'Feature Name', 
  story: 'Story Name',
  severity: 'critical|major|minor|trivial',
  tag: 'smoke|regression|sanity',
  description: 'Test description'
});
```

#### **Step Execution**
```javascript
await allureHelper.step('Step Name', async () => {
  // Your test code here
}, {
  expectedResult: 'What should happen',
  testData: { key: 'value' }
});
```

#### **Screenshots and Attachments**
```javascript
// Add screenshot
await allureHelper.addScreenshot(page, 'Screenshot Name');

// Add test data
await allureHelper.addTestData(dataObject, 'Data Name');

// Add file attachment
await allureHelper.addAttachment('File Name', fileContent, 'text/plain');
```

#### **Links and References**
```javascript
// Add external link
await allureHelper.addLink('Link Name', 'https://example.com', 'link');

// Add issue reference
await allureHelper.addIssue('BUG-123', 'https://jira.com/BUG-123');

// Add test case ID
await allureHelper.addTestCaseId('TC-001');
```

## Report Structure

### **Main Dashboard**
- **Overview**: Total tests, pass/fail rates, execution time
- **Categories**: Tests organized by Epic, Feature, Story
- **Environment**: Complete environment information
- **Timeline**: Chronological test execution view

### **Individual Test Reports**
- **Test Information**: Name, description, timing, status
- **Steps**: Detailed step-by-step execution with timestamps
- **Attachments**: Screenshots, test data, logs
- **Parameters**: All test parameters and environment info
- **History**: Historical execution data for the test

### **Advanced Features**
- **Filtering**: Filter by status, severity, tags, features
- **Search**: Full-text search across all test data
- **Trends**: Historical trend analysis
- **Comparison**: Compare results across different runs

## File Structure

```
playwright-demo-new/
├── allure-results/          # Raw Allure test results
├── allure-report/           # Generated HTML reports
├── allure-reports-archive/  # Backup of previous reports
├── scripts/
│   └── allure-report.sh    # Allure report management script
├── tests/
│   ├── utils/
│   │   └── AllureHelper.js # Allure integration helper
│   └── examples/
│       └── AllureExampleTest.spec.js # Example test with Allure
└── playwright.config.js    # Updated with Allure reporter
```

## Troubleshooting

### **Common Issues**

1. **"allure command not found"**
   ```bash
   npm install -g allure-commandline
   ```

2. **"No results found"**
   - Make sure tests have been run with Allure reporter enabled
   - Check that `allure-results` directory exists and contains files

3. **"Report not generating"**
   ```bash
   # Clean and regenerate
   npm run allure:clean
   npm run test:allure
   ```

4. **"Port already in use"**
   ```bash
   # Use different port
   ./scripts/allure-report.sh serve 9000
   ```

### **Best Practices**

1. **Always use AllureHelper** for consistent reporting
2. **Add meaningful step names** and descriptions
3. **Include screenshots** for visual verification
4. **Attach relevant test data** for debugging
5. **Use appropriate severity levels** for test prioritization
6. **Organize tests** with Epic, Feature, Story hierarchy

## Integration with CI/CD

### **GitHub Actions Example**
```yaml
- name: Run Tests with Allure
  run: npm run test:allure

- name: Upload Allure Results
  uses: actions/upload-artifact@v3
  with:
    name: allure-results
    path: allure-results/

- name: Generate Allure Report
  run: npm run allure:generate

- name: Deploy Report
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./allure-report
```

## Support

For questions or issues with Allure reporting:
1. Check the generated reports in `allure-report/` directory
2. Review the example test in `tests/examples/AllureExampleTest.spec.js`
3. Use the troubleshooting section above
4. Check Allure documentation: https://docs.qameta.io/allure/
