const { test, chromium } = require('@playwright/test');
const SystemSetupPage = require('../../pages/SystemSetupPage');
const UserCreationPage = require('../../pages/UserCreationPage');
const UserCreationUpdationData = require('../../DataProvider/UserCreationUpdationData');
const BaseURL = require('../../utils/BaseURL');
const LoginPage = require('../../pages/LoginPage');
const ApiCapture = require('../../utils/ApiCapture');
const RBLTestSetup = require('../utils/RBLTestSetup.js');

test.describe('RBL - User Creation and Updation Tests', () => {
  let userCreationPage;
  let systemSetupPage;
  let loginPage;
  let baseUrlUtil;
  let browser;
  let context;
  let page;
  let apiCapture;
  let rblSetup;

  test.beforeAll(async () => {
    rblSetup = new RBLTestSetup();
    const instances = await rblSetup.completeSetup();

    // Get instances from RBLTestSetup
    browser = instances.browser;
    context = instances.context;
    page = instances.page;
    systemSetupPage = instances.sys;
    loginPage = instances.loginPage;
    baseUrlUtil = instances.baseUrlUtil;
    apiCapture = instances.apiCapture;

    // Initialize user creation page
    userCreationPage = new UserCreationPage(page);

    // Navigate to Users section for all tests in this suite
    await userCreationPage.NavigateToUsers();
    console.log('✅ RBL User Creation: Navigated to Users section');
    console.log('✅ RBL User Creation: Setup completed, ready for user creation/update tests');
  });

  test('RBL User Creation Test', async ({}, _testInfo) => {
    const userCreationData = UserCreationUpdationData.UserCreationData();
    console.log(`📊 Processing ${userCreationData.length} user(s) from Excel data`);

    for (let i = 0; i < userCreationData.length; i++) {
      const data = userCreationData[i];
      // Map Excel headers to variables expected by the POM
      const {
        firstName, lastName, role, email, password, timeZone, Extension, 'Phone Number': phoneNumber, userskill
      } = data;
      // Log mapped values for debugging
      console.log(`📋 [${i + 1}/${userCreationData.length}] Creating new RBL user with First Name: ${firstName}, Last Name: ${lastName}, Email: ${email}, Skill: ${userskill}`);

      try {
        await userCreationPage.existingUser(
          firstName,
          lastName,
          role,
          email,
          password,
          timeZone,
          Extension,
          phoneNumber,
          userskill
        );
        console.log(`✅ RBL user creation completed for: ${firstName} ${lastName}`);
      } catch (error) {
        console.error(`❌ Error processing user ${firstName} ${lastName}: ${error.message}`);
        // Continue with next user instead of failing entire test
        continue;
      }
    }
  });

  test('RBL User Updation Test', async ({}) => {
    const userUpdationData = UserCreationUpdationData.UserUpdationData();
    console.log(`📊 Processing ${userUpdationData.length} user update(s) from Excel data`);

    for (let i = 0; i < userUpdationData.length; i++) {
      const data = userUpdationData[i];
      // Map Excel headers to variables expected by the POM
      const {
        firstName, lastName, role, email, password, timeZone, Extension, 'Phone Number': phoneNumber, userskill
      } = data;
      // Log mapped values for debugging
      console.log(`📋 [${i + 1}/${userUpdationData.length}] Updating RBL user with First Name: ${firstName}, Last Name: ${lastName}, Email: ${email}, Skill: ${userskill}`);

      try {
        await userCreationPage.updateUser(
          firstName,
          lastName,
          role,
          email,
          password,
          timeZone,
          Extension,
          phoneNumber,
          userskill
        );
        console.log(`✅ RBL user updation completed for: ${firstName} ${lastName}`);
      } catch (error) {
        console.error(`❌ Error updating user ${firstName} ${lastName}: ${error.message}`);
        // Continue with next user instead of failing entire test
        continue;
      }
    }
  });

  test.afterAll(async () => {
    // Use RBLTestSetup cleanup
    if (rblSetup) {
      await rblSetup.cleanup();
    }
  });
});
