const fs = require('fs');
const path = require('path');

/**
 * TestReportGenerator - Auto-generates detailed reports for all tests
 * Features:
 * - Automatic report generation
 * - Error screenshot integration
 * - Performance metrics
 * - Excel data analysis
 * - HTML and Markdown formats
 */
class TestReportGenerator {
  constructor() {
    this.reportData = {
      testName: '',
      startTime: null,
      endTime: null,
      status: 'RUNNING',
      operations: [],
      errors: [],
      screenshots: [],
      excelData: null,
      performance: {},
      environment: {}
    };
    
    this.reportsDir = 'reports';
    this.ensureReportsDirectory();
  }

  /**
   * Ensure reports directory exists
   */
  ensureReportsDirectory() {
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  /**
   * Start test reporting
   */
  startTest(testName, environment = {}) {
    this.reportData.testName = testName;
    this.reportData.startTime = new Date();
    this.reportData.environment = environment;
    console.log(`📊 Test reporting started for: ${testName}`);
  }

  /**
   * Log an operation
   */
  logOperation(operation, status, details = {}) {
    const operationData = {
      name: operation,
      status: status, // 'PASS', 'FAIL', 'SKIP'
      timestamp: new Date(),
      duration: details.duration || 0,
      details: details
    };
    
    this.reportData.operations.push(operationData);
    console.log(`📋 Operation logged: ${operation} - ${status}`);
  }

  /**
   * Log an error with optional screenshot
   */
  logError(error, screenshotPath = null) {
    const errorData = {
      message: error.message || error,
      stack: error.stack || '',
      timestamp: new Date(),
      screenshot: screenshotPath
    };
    
    this.reportData.errors.push(errorData);
    
    if (screenshotPath) {
      this.reportData.screenshots.push(screenshotPath);
      console.log(`📸 Error screenshot captured: ${screenshotPath}`);
    }
    
    console.log(`❌ Error logged: ${error.message || error}`);
  }

  /**
   * Log Excel data analysis
   */
  logExcelData(filePath, sheetName, data) {
    this.reportData.excelData = {
      filePath: filePath,
      sheetName: sheetName,
      rowCount: data.length,
      columns: data.length > 0 ? Object.keys(data[0]) : [],
      data: data
    };
    console.log(`📊 Excel data logged: ${data.length} rows from ${filePath}`);
  }

  /**
   * Log performance metrics
   */
  logPerformance(metric, value) {
    this.reportData.performance[metric] = value;
    console.log(`⏱️ Performance metric: ${metric} = ${value}`);
  }

  /**
   * End test and generate reports
   */
  async endTest(finalStatus = 'PASS') {
    this.reportData.endTime = new Date();
    this.reportData.status = finalStatus;
    
    const duration = this.reportData.endTime - this.reportData.startTime;
    this.reportData.performance.totalDuration = `${Math.round(duration / 1000)}s`;
    
    console.log(`📊 Test completed: ${this.reportData.testName} - ${finalStatus}`);
    
    // Generate reports
    await this.generateMarkdownReport();
    await this.generateHTMLReport();
    await this.generateSummaryReport();
    
    console.log(`📄 Reports generated in ${this.reportsDir}/ directory`);
  }

  /**
   * Generate detailed Markdown report
   */
  async generateMarkdownReport() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${this.reportData.testName}_DetailedReport_${timestamp}.md`;
    const filePath = path.join(this.reportsDir, fileName);
    
    const report = this.buildMarkdownContent();
    fs.writeFileSync(filePath, report);
    console.log(`📄 Markdown report: ${fileName}`);
  }

  /**
   * Generate HTML report
   */
  async generateHTMLReport() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${this.reportData.testName}_Report_${timestamp}.html`;
    const filePath = path.join(this.reportsDir, fileName);
    
    const report = this.buildHTMLContent();
    fs.writeFileSync(filePath, report);
    console.log(`📄 HTML report: ${fileName}`);
  }

  /**
   * Generate summary report for all tests
   */
  async generateSummaryReport() {
    const summaryFile = path.join(this.reportsDir, 'TestSummary.md');
    const testSummary = this.buildTestSummary();
    
    // Append to existing summary or create new
    if (fs.existsSync(summaryFile)) {
      fs.appendFileSync(summaryFile, '\n---\n' + testSummary);
    } else {
      const header = '# Test Execution Summary\n\n';
      fs.writeFileSync(summaryFile, header + testSummary);
    }
    
    console.log(`📄 Summary updated: TestSummary.md`);
  }

  /**
   * Build Markdown report content
   */
  buildMarkdownContent() {
    const passCount = this.reportData.operations.filter(op => op.status === 'PASS').length;
    const failCount = this.reportData.operations.filter(op => op.status === 'FAIL').length;
    const successRate = this.reportData.operations.length > 0 ? 
      Math.round((passCount / this.reportData.operations.length) * 100) : 0;

    return `# ${this.reportData.testName} - Detailed Test Report

## 📊 Executive Summary
- **Test Name**: ${this.reportData.testName}
- **Execution Date**: ${this.reportData.startTime.toLocaleString()}
- **Status**: ${this.reportData.status === 'PASS' ? '✅ PASSED' : '❌ FAILED'}
- **Duration**: ${this.reportData.performance.totalDuration}
- **Success Rate**: ${successRate}% (${passCount}/${this.reportData.operations.length})

## 🎯 Test Operations
${this.reportData.operations.map(op => 
  `### ${op.status === 'PASS' ? '✅' : '❌'} ${op.name}
- **Status**: ${op.status}
- **Time**: ${op.timestamp.toLocaleTimeString()}
- **Duration**: ${op.duration}ms
- **Details**: ${JSON.stringify(op.details, null, 2)}`
).join('\n\n')}

## 📊 Excel Data Analysis
${this.reportData.excelData ? `
- **File**: ${this.reportData.excelData.filePath}
- **Sheet**: ${this.reportData.excelData.sheetName}
- **Rows**: ${this.reportData.excelData.rowCount}
- **Columns**: ${this.reportData.excelData.columns.join(', ')}

### Data Preview
\`\`\`json
${JSON.stringify(this.reportData.excelData.data.slice(0, 3), null, 2)}
\`\`\`
` : 'No Excel data processed'}

## ⚡ Performance Metrics
${Object.entries(this.reportData.performance).map(([key, value]) => 
  `- **${key}**: ${value}`
).join('\n')}

## 🚨 Errors & Issues
${this.reportData.errors.length > 0 ? 
  this.reportData.errors.map(error => 
    `### Error: ${error.message}
- **Time**: ${error.timestamp.toLocaleTimeString()}
- **Screenshot**: ${error.screenshot || 'None'}
\`\`\`
${error.stack}
\`\`\``
  ).join('\n\n') : 'No errors occurred ✅'}

## 📸 Screenshots
${this.reportData.screenshots.length > 0 ? 
  this.reportData.screenshots.map(screenshot => `- ${screenshot}`).join('\n') : 
  'No error screenshots taken ✅'}

## 🌐 Environment
${Object.entries(this.reportData.environment).map(([key, value]) => 
  `- **${key}**: ${value}`
).join('\n')}

---
*Report generated automatically on ${new Date().toLocaleString()}*`;
  }

  /**
   * Build HTML report content
   */
  buildHTMLContent() {
    const passCount = this.reportData.operations.filter(op => op.status === 'PASS').length;
    const failCount = this.reportData.operations.filter(op => op.status === 'FAIL').length;
    
    return `<!DOCTYPE html>
<html>
<head>
    <title>${this.reportData.testName} - Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f0f8ff; padding: 20px; border-radius: 8px; }
        .pass { color: #28a745; }
        .fail { color: #dc3545; }
        .operation { margin: 10px 0; padding: 10px; border-left: 4px solid #007bff; }
        .error { background: #f8d7da; padding: 10px; border-radius: 4px; margin: 10px 0; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${this.reportData.testName} - Test Report</h1>
        <p><strong>Status:</strong> <span class="${this.reportData.status.toLowerCase()}">${this.reportData.status}</span></p>
        <p><strong>Duration:</strong> ${this.reportData.performance.totalDuration}</p>
        <p><strong>Success Rate:</strong> ${Math.round((passCount / this.reportData.operations.length) * 100)}%</p>
    </div>
    
    <h2>📊 Operations Summary</h2>
    <table>
        <tr><th>Operation</th><th>Status</th><th>Time</th><th>Duration</th></tr>
        ${this.reportData.operations.map(op => 
          `<tr>
            <td>${op.name}</td>
            <td class="${op.status.toLowerCase()}">${op.status}</td>
            <td>${op.timestamp.toLocaleTimeString()}</td>
            <td>${op.duration}ms</td>
          </tr>`
        ).join('')}
    </table>
    
    ${this.reportData.errors.length > 0 ? `
    <h2>🚨 Errors</h2>
    ${this.reportData.errors.map(error => 
      `<div class="error">
        <strong>${error.message}</strong><br>
        <small>${error.timestamp.toLocaleString()}</small>
        ${error.screenshot ? `<br><strong>Screenshot:</strong> ${error.screenshot}` : ''}
      </div>`
    ).join('')}` : ''}
    
    <p><em>Report generated on ${new Date().toLocaleString()}</em></p>
</body>
</html>`;
  }

  /**
   * Build test summary for summary report
   */
  buildTestSummary() {
    const passCount = this.reportData.operations.filter(op => op.status === 'PASS').length;
    const failCount = this.reportData.operations.filter(op => op.status === 'FAIL').length;
    
    return `## ${this.reportData.testName}
- **Date**: ${this.reportData.startTime.toLocaleString()}
- **Status**: ${this.reportData.status === 'PASS' ? '✅ PASSED' : '❌ FAILED'}
- **Duration**: ${this.reportData.performance.totalDuration}
- **Operations**: ${passCount} passed, ${failCount} failed
- **Errors**: ${this.reportData.errors.length}
- **Screenshots**: ${this.reportData.screenshots.length}`;
  }
}

module.exports = TestReportGenerator;
