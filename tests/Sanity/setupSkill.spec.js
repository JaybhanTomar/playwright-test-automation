const { test, chromium } = require('@playwright/test');
const AdminSideBar = require('../utils/AdminSideBar.js');
const SystemSetupPage = require('../pages/SystemSetupPage.js');
const LoginPage = require('../pages/LoginPage.js');
const BaseURL = require('../utils/BaseURL.js');
const ApiCapture = require('../utils/ApiCapture.js');
const SystemSetupData = require('../DataProvider/FieldCreationUpdationData.js');

test.describe.serial('Skill Setup Tests', () => {
  let browser, context, page, bar, sys, loginPage, baseUrlUtil, apiCapture;

  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    bar = new AdminSideBar(page);
    sys = new SystemSetupPage(page);
    loginPage = new LoginPage(page);
    baseUrlUtil = new BaseURL(page);
    apiCapture = new ApiCapture(page);

    // Start API monitoring
    apiCapture.startMonitoring();

    // Use BaseURL utility to navigate to qc6 environment
    await baseUrlUtil.qc6();
    
    // Use loginTestData for credentials
    const loginTestData = require('../DataProvider/UserCreationUpdationData.js').userLoginData();
    const [email, password, role] = loginTestData[0];
    await loginPage.login(email, password, role);

  });

  test.beforeEach(async () => {
    await bar.clickSystemSetup();
    await sys.clickOnSkillsButton();
  });

  test('Create Skills from Excel', async () => {
    const SkillData = SystemSetupData.SkillCreationData();
    for (let i = 0; i < SkillData.length; i++) {
      const data = SkillData[i];
      const { category, skill } = data;
      console.log(`Creating skill: ${skill} in category: ${category}`);
      await sys.setupSkills(category, skill);
      console.log(`✅ Skill created successfully: ${skill}`);
    }
  });

  test('Update Skills from Excel', async () => {
    const SkillData = SystemSetupData.SkillUpdationData();
    for (let i = 0; i < SkillData.length; i++) {
      const data = SkillData[i];
      const { category, skill, Newcategory, Newskill } = data;
      console.log(`Updating skill: ${skill} to ${Newskill} in category: ${category} to ${Newcategory}`);
      await sys.updateSkill(category, skill, Newcategory, Newskill);
      console.log(`✅ Skill updated successfully: ${Newskill}`);
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
