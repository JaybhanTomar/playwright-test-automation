const { test } = require('@playwright/test');
const SystemSetupData = require('../DataProvider/FieldCreationUpdationData.js');
const SanityTestSetup = require('./utils/SanityTestSetup.js');

// Uses centralized Sanity configuration from tests/Sanity/config/SanityConfig.js
test.describe.serial('Sanity - Skill Setup Tests', () => {
  let sanitySetup, sys, apiCapture;

  // Use Sanity Config for timeout
  test.setTimeout(SanityTestSetup.getTestTimeout());

  test.beforeAll(async () => {
    // Initialize Sanity test setup
    sanitySetup = new SanityTestSetup();
    const instances = await sanitySetup.completeSetup();

    // Extract needed instances
    sys = instances.sys;
    apiCapture = instances.apiCapture;

    console.log(`✅ Sanity Skills: Setup completed on ${SanityTestSetup.getEnvironment().toUpperCase()}`);
  });

  test.beforeEach(async () => {
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
    // Use Sanity setup cleanup
    await sanitySetup.cleanup();
  });
});
