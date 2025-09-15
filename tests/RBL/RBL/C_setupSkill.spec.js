console.log('RBL setupSkill.spec.js loaded');
const { test, chromium } = require('@playwright/test');
const SystemSetupPage = require('../../pages/SystemSetupPage.js');
const LoginPage = require('../../pages/LoginPage.js');
const BaseURL = require('../../utils/BaseURL.js');
const ApiCapture = require('../../utils/ApiCapture.js');
const RBLAdminData = require('../../DataProvider/RBLAdminData.js');
const RBLTestSetup = require('../utils/RBLTestSetup.js');

// Uses centralized RBL configuration from tests/RBL/config/RBLConfig.js
// Uses centralized RBL configuration from tests/RBL/config/RBLConfig.js
test.describe.serial('RBL - Skill Setup Tests', () => {
  let browser, context, page, sys, loginPage, baseUrlUtil, apiCapture, rblSetup;

  test.beforeAll(async () => {
    console.log('RBL Skill beforeAll starting');
    rblSetup = new RBLTestSetup();
    const instances = await rblSetup.completeSetup();

    // Get instances from RBLTestSetup
    browser = instances.browser;
    context = instances.context;
    page = instances.page;
    sys = instances.sys;
    loginPage = instances.loginPage;
    baseUrlUtil = instances.baseUrlUtil;
    apiCapture = instances.apiCapture;

    // Navigate to System Setup and Skills
    await sys.NavigateToSystemSetup();
    await sys.clickOnSkills();
    console.log('RBL Skill beforeAll finished');
  });

  test('RBL Create Skill', async () => {
    console.log('RBL Create Skill test running');
    const skillData = RBLAdminData.SkillCreationData();
    console.log('DEBUG RBL SkillData:', skillData);
    
    for (const data of skillData) {
      const { Category: category, Skills: skill } = data;
      console.log(`📋 Creating RBL skill: ${skill} for category: ${category}`);
      await sys.setupSkills(category, skill);
      console.log(`✅ RBL skill creation completed for: ${skill}`);
    }
  });

  test.skip('RBL Update Skill', async () => {
    const skillData = RBLAdminData.SkillUpdationData();
    console.log('DEBUG RBL SkillUpdationData:', skillData);
    
    for (const data of skillData) {
      const { Category: category, Skills: skill, NewSkills: newSkill } = data;
      console.log(`📋 Updating RBL skill from: ${skill} to: ${newSkill} for category: ${category}`);
      await sys.updateSkill(category, skill, newSkill);
      console.log(`✅ RBL skill updation completed for: ${skill}`);
    }
  });

  test.afterAll(async () => {
    // Use RBLTestSetup cleanup
    if (rblSetup) {
      await rblSetup.cleanup();
    }
  });
});
