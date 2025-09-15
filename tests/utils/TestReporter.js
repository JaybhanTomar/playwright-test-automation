const fs = require('fs');
const path = require('path');

/**
 * TestReporter - Centralized test reporting and error handling
 * Auto-generates detailed reports for all tests
 */
class TestReporter {
  constructor() {
    this.testResults = [];
    this.currentTest = null;
    this.startTime = null;
    this.reportsDir = 'reports';
    this.screenshotsDir = 'reports/screenshots';
    this.ensureDirectories();
  }

  /**
   * Ensure report directories exist
   */
  ensureDirectories() {
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
    if (!fs.existsSync(this.screenshotsDir)) {
      fs.mkdirSync(this.screenshotsDir, { recursive: true });
    }
  }

  /**
   * Start a new test
   */
  startTest(testName, testClass = '') {
    this.currentTest = {
      name: testName,
      class: testClass,
      startTime: new Date(),
      endTime: null,
      status: 'RUNNING',
      steps: [],
      errors: [],
      screenshots: [],
      duration: 0,
      excelData: null,
      operations: []
    };
    this.startTime = Date.now();
    console.log(`📊 Test Started: ${testName}`);
  }

  /**
   * Log a test step
   */
  logStep(stepName, status = 'PASS', details = '') {
    if (!this.currentTest) return;
    
    const step = {
      name: stepName,
      status: status,
      details: details,
      timestamp: new Date(),
      duration: Date.now() - this.startTime
    };
    
    this.currentTest.steps.push(step);
    console.log(`📋 Step: ${stepName} - ${status}`);
  }

  /**
   * Log Excel data being used
   */
  logExcelData(filePath, sheetName, dataCount) {
    if (!this.currentTest) return;
    
    this.currentTest.excelData = {
      filePath: filePath,
      sheetName: sheetName,
      recordCount: dataCount,
      timestamp: new Date()
    };
  }

  /**
   * Log an operation (ADD, SEARCH, etc.)
   */
  logOperation(operationType, details, status = 'PASS') {
    if (!this.currentTest) return;
    
    const operation = {
      type: operationType,
      details: details,
      status: status,
      timestamp: new Date()
    };
    
    this.currentTest.operations.push(operation);
  }

  /**
   * Capture error with screenshot (only on error)
   */
  async captureError(page, errorMessage, errorDetails = '') {
    if (!this.currentTest) return;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = path.join(this.screenshotsDir, `error-${this.currentTest.name}-${timestamp}.png`);
    
    try {
      await page.screenshot({ path: screenshotPath, fullPage: true });
      
      const error = {
        message: errorMessage,
        details: errorDetails,
        screenshot: screenshotPath,
        timestamp: new Date(),
        pageUrl: page.url()
      };
      
      this.currentTest.errors.push(error);
      this.currentTest.screenshots.push(screenshotPath);
      
      console.log(`📸 Error screenshot captured: ${screenshotPath}`);
    } catch (screenshotError) {
      console.log(`⚠️ Could not capture error screenshot: ${screenshotError.message}`);
    }
  }

  /**
   * End current test
   */
  endTest(status = 'PASS') {
    if (!this.currentTest) return;
    
    this.currentTest.endTime = new Date();
    this.currentTest.status = status;
    this.currentTest.duration = Date.now() - this.startTime;
    
    this.testResults.push({ ...this.currentTest });
    console.log(`📊 Test Ended: ${this.currentTest.name} - ${status}`);
    
    // Generate individual test report
    this.generateTestReport(this.currentTest);
    
    this.currentTest = null;
  }

  /**
   * Generate individual test report
   */
  generateTestReport(testData) {
    const reportPath = path.join(this.reportsDir, `${testData.name}_Report_${this.getTimestamp()}.md`);
    
    const report = this.createTestReportContent(testData);
    
    try {
      fs.writeFileSync(reportPath, report);
      console.log(`📄 Test report generated: ${reportPath}`);
    } catch (error) {
      console.log(`⚠️ Could not generate test report: ${error.message}`);
    }
  }

  /**
   * Create test report content
   */
  createTestReportContent(testData) {
    const duration = (testData.duration / 1000).toFixed(2);
    const statusIcon = testData.status === 'PASS' ? '✅' : '❌';
    
    return `# ${testData.name} Test Report

## 📊 Test Summary
- **Test Name**: ${testData.name}
- **Test Class**: ${testData.class}
- **Status**: ${statusIcon} ${testData.status}
- **Start Time**: ${testData.startTime.toLocaleString()}
- **End Time**: ${testData.endTime.toLocaleString()}
- **Duration**: ${duration} seconds
- **Total Steps**: ${testData.steps.length}
- **Operations**: ${testData.operations.length}
- **Errors**: ${testData.errors.length}

## 📋 Excel Data Used
${testData.excelData ? `
- **File**: ${testData.excelData.filePath}
- **Sheet**: ${testData.excelData.sheetName}
- **Records**: ${testData.excelData.recordCount}
` : 'No Excel data used'}

## 🚀 Operations Performed
${testData.operations.map((op, index) => `
### ${index + 1}. ${op.type}
- **Details**: ${op.details}
- **Status**: ${op.status === 'PASS' ? '✅' : '❌'} ${op.status}
- **Time**: ${op.timestamp.toLocaleTimeString()}
`).join('')}

## 📋 Test Steps
${testData.steps.map((step, index) => `
### ${index + 1}. ${step.name}
- **Status**: ${step.status === 'PASS' ? '✅' : '❌'} ${step.status}
- **Details**: ${step.details}
- **Duration**: ${(step.duration / 1000).toFixed(2)}s
`).join('')}

${testData.errors.length > 0 ? `
## ❌ Errors Encountered
${testData.errors.map((error, index) => `
### Error ${index + 1}
- **Message**: ${error.message}
- **Details**: ${error.details}
- **Page URL**: ${error.pageUrl}
- **Screenshot**: ${error.screenshot}
- **Time**: ${error.timestamp.toLocaleString()}
`).join('')}
` : '## ✅ No Errors Encountered'}

## 📸 Screenshots
${testData.screenshots.length > 0 ? 
  testData.screenshots.map(screenshot => `- ${screenshot}`).join('\n') : 
  'No screenshots captured (no errors occurred)'}

## 🎯 Test Result
**${testData.status === 'PASS' ? 'TEST PASSED SUCCESSFULLY' : 'TEST FAILED'}**

---
*Report generated automatically on ${new Date().toLocaleString()}*
`;
  }

  /**
   * Generate comprehensive summary report for all tests
   */
  generateSummaryReport() {
    const reportPath = path.join(this.reportsDir, `TestSuite_Summary_${this.getTimestamp()}.md`);
    
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(t => t.status === 'PASS').length;
    const failedTests = totalTests - passedTests;
    const totalDuration = this.testResults.reduce((sum, t) => sum + t.duration, 0);
    const totalErrors = this.testResults.reduce((sum, t) => sum + t.errors.length, 0);
    
    const report = `# Test Suite Summary Report

## 📊 Overall Results
- **Total Tests**: ${totalTests}
- **Passed**: ✅ ${passedTests}
- **Failed**: ❌ ${failedTests}
- **Success Rate**: ${totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0}%
- **Total Duration**: ${(totalDuration / 1000).toFixed(2)} seconds
- **Total Errors**: ${totalErrors}

## 📋 Test Results Summary
${this.testResults.map((test, index) => `
### ${index + 1}. ${test.name}
- **Status**: ${test.status === 'PASS' ? '✅' : '❌'} ${test.status}
- **Duration**: ${(test.duration / 1000).toFixed(2)}s
- **Steps**: ${test.steps.length}
- **Operations**: ${test.operations.length}
- **Errors**: ${test.errors.length}
- **Excel Data**: ${test.excelData ? `${test.excelData.recordCount} records` : 'None'}
`).join('')}

## 📈 Performance Metrics
- **Average Test Duration**: ${totalTests > 0 ? (totalDuration / totalTests / 1000).toFixed(2) : 0}s
- **Fastest Test**: ${totalTests > 0 ? (Math.min(...this.testResults.map(t => t.duration)) / 1000).toFixed(2) : 0}s
- **Slowest Test**: ${totalTests > 0 ? (Math.max(...this.testResults.map(t => t.duration)) / 1000).toFixed(2) : 0}s

${totalErrors > 0 ? `
## ❌ Error Summary
${this.testResults.filter(t => t.errors.length > 0).map(test => `
### ${test.name}
${test.errors.map(error => `- ${error.message}`).join('\n')}
`).join('')}
` : '## ✅ No Errors in Test Suite'}

---
*Summary report generated on ${new Date().toLocaleString()}*
`;

    try {
      fs.writeFileSync(reportPath, report);
      console.log(`📄 Summary report generated: ${reportPath}`);
    } catch (error) {
      console.log(`⚠️ Could not generate summary report: ${error.message}`);
    }
  }

  /**
   * Get formatted timestamp
   */
  getTimestamp() {
    return new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  }

  /**
   * Get current test results
   */
  getResults() {
    return this.testResults;
  }
}

module.exports = TestReporter;
