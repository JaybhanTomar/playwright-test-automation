const { test, expect, chromium } = require('@playwright/test');
const SystemSetupPage = require('../pages/SystemSetupPage.js');
const LoginPage = require('../pages/LoginPage.js');
const BaseURL = require('../utils/BaseURL.js');
const ApiCapture = require('../utils/ApiCapture.js');
const FieldTestData = require('../DataProvider/FieldCreationUpdationData');

test.describe('JD Templates Creation Tests', () => {
  let sys, loginPage, baseUrlUtil, browser, context, page, apiCapture;

  // Set reasonable timeout - 10 minutes should be enough for all data processing
  test.setTimeout(600000); // 10 minutes

  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    sys = new SystemSetupPage(page);
    loginPage = new LoginPage(page);
    baseUrlUtil = new BaseURL(page);
    apiCapture = new ApiCapture(page);

    // Start API monitoring
    apiCapture.startMonitoring();

    // Use BaseURL utility to navigate to UAT environment
    console.log('🌐 Navigating to UAT361 environment...');
    await baseUrlUtil.uat361();
    console.log('✅ Successfully navigated to UAT361');

    // Use loginTestData for credentials
    console.log('🔐 Loading login credentials...');
    const loginTestData = require('../DataProvider/UserCreationUpdationData.js').userLoginData();
    const { email, password, role } = loginTestData[0];
    console.log('🔐 Attempting login...');
    await loginPage.login(email, password, role);
    console.log('✅ Login successful');

    // Navigate to System Setup and JD Templates
    console.log('🔧 Navigating to System Setup...');
    await sys.NavigateToSystemSetup();
    console.log('📋 Clicking on JD Templates...');
    await sys.clickOnJDTemplates();
    console.log('✅ Successfully navigated to JD Templates section');
  });

  test('CreateJDTemplateTest', async () => {
    const JDTemplateData = FieldTestData.JDTemplateCreationData();
    console.log('DEBUG JDTemplateData:', JDTemplateData);

    // Check if there's any data to process
    if (!JDTemplateData || JDTemplateData.length === 0) {
      console.log('⚠️ No JD Template data found in Excel. Test will complete.');
      return;
    }

    console.log(`📊 Processing ${JDTemplateData.length} JD Template(s) from Excel data`);
    for (const data of JDTemplateData) {
      const {
        Category,
        JobTitle,
        Department,
        Location,
        JobSummary,
        KeyResponsibilities,
        RequiredSkills,
        BonousSkills,
        ReportingTo,
        JobType,
        RequiredQualification,
        BonusQualification,
        PhysicalLocation,
        TotalExperience,
        RelevantExperience,
        SalaryRange,
        BonusIncluded,
        StockOptionIncluded,
        WorkingHours,
        TravelRequirements,
        CompanyDescription
      } = data;
      console.log(`\n📄 Running JD Template creation test for: ${JobTitle}`);
      console.log('Attempting to create/check JD Template with JobTitle:', JobTitle);
      await sys.createJDTemplates(
        Category,
        JobTitle,
        Department,
        Location,
        JobSummary,
        KeyResponsibilities,
        RequiredSkills,
        BonousSkills,
        ReportingTo,
        JobType,
        RequiredQualification,
        BonusQualification,
        PhysicalLocation,
        TotalExperience,
        RelevantExperience,
        SalaryRange,
        BonusIncluded,
        StockOptionIncluded,
        WorkingHours,
        TravelRequirements,
        CompanyDescription
      );
      console.log(`✅ JD Template creation test completed for: ${JobTitle}`);
    }
  });

  test.afterAll(async () => {
    // Log API summary
    apiCapture.logApiSummary();
    await page.close();
    await context.close();
    await browser.close();
  });
});