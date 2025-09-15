const { allure } = require('allure-playwright');

/**
 * AllureHelper - Enhanced Allure reporting with detailed test information
 * Provides comprehensive test reporting with timestamps, environment info, and detailed steps
 */
class AllureHelper {
  constructor() {
    this.testStartTime = null;
    this.stepCounter = 0;
  }

  /**
   * Initialize test with detailed information
   */
  async startTest(testInfo, testData = {}) {
    this.testStartTime = new Date();
    this.stepCounter = 0;
    
    // Set test metadata
    await allure.epic(testData.epic || 'Playwright Test Suite');
    await allure.feature(testData.feature || testInfo.title);
    await allure.story(testData.story || testInfo.title);
    await allure.severity(testData.severity || 'normal');
    await allure.tag(testData.tag || 'automated');
    
    // Add environment information
    await allure.parameter('Test Start Time', this.testStartTime.toISOString());
    await allure.parameter('Test File', testInfo.file);
    await allure.parameter('Test Title', testInfo.title);
    await allure.parameter('Project Name', testInfo.project.name);
    await allure.parameter('Environment', process.env.ENV || 'qc2');
    await allure.parameter('Base URL', testInfo.project.use.baseURL);
    await allure.parameter('Browser', 'Chromium');
    await allure.parameter('Headless Mode', testInfo.project.use.headless.toString());
    
    // Add test description
    const description = `
**Test Information:**
- **Start Time:** ${this.testStartTime.toLocaleString()}
- **Environment:** ${process.env.ENV || 'qc2'}
- **Project:** ${testInfo.project.name}
- **File:** ${testInfo.file}

**Test Configuration:**
- **Base URL:** ${testInfo.project.use.baseURL}
- **Timeout:** ${testInfo.timeout}ms
- **Headless:** ${testInfo.project.use.headless}

**Test Data:**
${testData.description || 'No additional test data provided'}
    `;
    
    await allure.description(description);
    
    console.log(`🎯 Allure Test Started: ${testInfo.title} at ${this.testStartTime.toISOString()}`);
  }

  /**
   * Add a detailed step with timestamp
   */
  async step(stepName, stepFunction, stepData = {}) {
    this.stepCounter++;
    const stepStartTime = new Date();
    const stepId = `Step ${this.stepCounter}`;
    
    return await allure.step(`${stepId}: ${stepName}`, async () => {
      // Add step metadata
      await allure.parameter('Step Start Time', stepStartTime.toISOString());
      await allure.parameter('Step Number', this.stepCounter);
      
      if (stepData.expectedResult) {
        await allure.parameter('Expected Result', stepData.expectedResult);
      }
      
      if (stepData.testData) {
        await allure.parameter('Test Data', JSON.stringify(stepData.testData, null, 2));
      }
      
      console.log(`📝 Step ${this.stepCounter}: ${stepName} - Started at ${stepStartTime.toISOString()}`);
      
      try {
        const result = await stepFunction();
        const stepEndTime = new Date();
        const stepDuration = stepEndTime - stepStartTime;
        
        await allure.parameter('Step End Time', stepEndTime.toISOString());
        await allure.parameter('Step Duration (ms)', stepDuration);
        
        console.log(`✅ Step ${this.stepCounter}: ${stepName} - Completed in ${stepDuration}ms`);
        
        return result;
      } catch (error) {
        const stepEndTime = new Date();
        const stepDuration = stepEndTime - stepStartTime;
        
        await allure.parameter('Step End Time', stepEndTime.toISOString());
        await allure.parameter('Step Duration (ms)', stepDuration);
        await allure.parameter('Error Message', error.message);
        
        console.log(`❌ Step ${this.stepCounter}: ${stepName} - Failed after ${stepDuration}ms`);
        console.log(`Error: ${error.message}`);
        
        throw error;
      }
    });
  }

  /**
   * Add attachment (screenshot, file, etc.)
   */
  async addAttachment(name, content, type = 'text/plain') {
    const timestamp = new Date().toISOString();
    await allure.attachment(`${name} - ${timestamp}`, content, type);
    console.log(`📎 Attachment added: ${name} at ${timestamp}`);
  }

  /**
   * Add screenshot with timestamp
   */
  async addScreenshot(page, name = 'Screenshot') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotName = `${name}_${timestamp}`;
    
    try {
      const screenshot = await page.screenshot({ fullPage: true });
      await allure.attachment(screenshotName, screenshot, 'image/png');
      console.log(`📸 Screenshot captured: ${screenshotName}`);
    } catch (error) {
      console.log(`⚠️ Failed to capture screenshot: ${error.message}`);
    }
  }

  /**
   * Add test data as attachment
   */
  async addTestData(data, name = 'Test Data') {
    const timestamp = new Date().toISOString();
    const dataString = typeof data === 'object' ? JSON.stringify(data, null, 2) : data.toString();
    await allure.attachment(`${name} - ${timestamp}`, dataString, 'application/json');
    console.log(`📊 Test data attached: ${name} at ${timestamp}`);
  }

  /**
   * Add environment information
   */
  async addEnvironmentInfo(info = {}) {
    const defaultInfo = {
      'Test Execution Time': new Date().toISOString(),
      'Environment': process.env.ENV || 'qc2',
      'Node Version': process.version,
      'Platform': process.platform,
      'Architecture': process.arch,
      ...info
    };

    for (const [key, value] of Object.entries(defaultInfo)) {
      await allure.parameter(key, value);
    }
  }

  /**
   * Finish test with summary
   */
  async finishTest(testInfo, status = 'passed', error = null) {
    const testEndTime = new Date();
    const testDuration = testEndTime - this.testStartTime;
    
    // Add final test information
    await allure.parameter('Test End Time', testEndTime.toISOString());
    await allure.parameter('Total Test Duration (ms)', testDuration);
    await allure.parameter('Total Steps', this.stepCounter);
    await allure.parameter('Test Status', status);
    
    if (error) {
      await allure.parameter('Error Details', error.message);
      await allure.parameter('Error Stack', error.stack);
    }
    
    // Add final summary
    const summary = `
**Test Execution Summary:**
- **Start Time:** ${this.testStartTime.toLocaleString()}
- **End Time:** ${testEndTime.toLocaleString()}
- **Duration:** ${(testDuration / 1000).toFixed(2)} seconds
- **Total Steps:** ${this.stepCounter}
- **Status:** ${status.toUpperCase()}
${error ? `- **Error:** ${error.message}` : ''}
    `;
    
    await allure.attachment('Test Summary', summary, 'text/plain');
    
    console.log(`🏁 Allure Test Finished: ${testInfo.title}`);
    console.log(`   Duration: ${(testDuration / 1000).toFixed(2)} seconds`);
    console.log(`   Steps: ${this.stepCounter}`);
    console.log(`   Status: ${status.toUpperCase()}`);
  }

  /**
   * Add link to external resource
   */
  async addLink(name, url, type = 'link') {
    await allure.link(url, name, type);
    console.log(`🔗 Link added: ${name} -> ${url}`);
  }

  /**
   * Add issue link
   */
  async addIssue(issueId, url) {
    await allure.issue(issueId, url);
    console.log(`🐛 Issue linked: ${issueId} -> ${url}`);
  }

  /**
   * Add test case ID
   */
  async addTestCaseId(testCaseId) {
    await allure.tms(testCaseId, `Test Case: ${testCaseId}`);
    console.log(`🆔 Test Case ID: ${testCaseId}`);
  }

  /**
   * Get current timestamp
   */
  getCurrentTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Get formatted duration
   */
  getFormattedDuration(startTime, endTime = new Date()) {
    const duration = endTime - startTime;
    return `${(duration / 1000).toFixed(2)} seconds`;
  }
}

module.exports = AllureHelper;
