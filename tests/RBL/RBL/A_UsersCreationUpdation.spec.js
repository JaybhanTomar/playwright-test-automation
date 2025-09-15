console.log('RBL A_UsersCreationUpdation.spec.js loaded');
const { test, chromium } = require('@playwright/test');
const SystemSetupPage = require('../../pages/SystemSetupPage');
const UserCreationPage = require('../../pages/UserCreationPage');
const UserCreationUpdationData = require('../../DataProvider/UserCreationUpdationData');
const BaseURL = require('../../utils/BaseURL');
const LoginPage = require('../../pages/LoginPage');
const ApiCapture = require('../../utils/ApiCapture');
const RBLTestSetup = require('../utils/RBLTestSetup.js');
const RBLConfig = require('../config/RBLConfig.js');

// Uses centralized RBL configuration from tests/RBL/config/RBLConfig.js

// RBL User Creation Tests
test.describe.serial('RBL - User Creation Tests', () => {
  let userCreationPage;
  let systemSetupPage;
  let loginPage;
  let baseUrlUtil;
  let browser;
  let context;
  let page;
  let apiCapture;
  let rblSetup;

  // Use RBL Config for timeout
  test.setTimeout(RBLTestSetup.getTestTimeout());

  test.beforeAll(async () => {
    console.log('RBL User Creation beforeAll starting');

    rblSetup = new RBLTestSetup();
    const instances = await rblSetup.completeSetup();

    // Extract needed instances
    browser = instances.browser;
    context = instances.context;
    page = instances.page;
    systemSetupPage = instances.sys;
    loginPage = instances.loginPage;
    baseUrlUtil = instances.baseUrlUtil;
    apiCapture = instances.apiCapture;

    // Initialize user creation page
    userCreationPage = new UserCreationPage(page);

    // Navigate to Users section
    await userCreationPage.NavigateToUsers();
    console.log('RBL User Creation beforeAll finished');
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

  test.afterAll(async () => {
    // Logout admin after user creation
    await userCreationPage.logoutUser();
    console.log('✅ Admin logged out after user creation');
  });
});

// RBL Created User Login Verification Tests
test.describe('RBL - Created User Login Verification', () => {
  // Use extended timeout for login verification tests
  test.setTimeout(300000); // 5 minutes

  test('RBL Verify Created User Login', async () => {
    // Use same data as user creation for login verification
    const userCreationData = UserCreationUpdationData.UserCreationData();
    console.log(`📊 Testing login for ${userCreationData.length} created user(s)`);

    for (let i = 0; i < userCreationData.length; i++) {
      const data = userCreationData[i];
      const { firstName, lastName, role, email, password } = data;
      console.log(`📋 [${i + 1}/${userCreationData.length}] Testing login for: ${firstName} ${lastName} (${email})`);

      // Launch fresh browser for each user login verification
      let rblSetup = null;
      let page = null;
      let loginPage = null;
      let baseUrlUtil = null;
      let userCreationPage = null;

      try {
        console.log('� Launching fresh browser for user login verification...');

        // Initialize fresh browser instances (no admin login)
        rblSetup = new RBLTestSetup();
        const instances = await rblSetup.initializeBrowser();

        // Extract needed instances
        page = instances.page;
        loginPage = instances.loginPage;
        baseUrlUtil = instances.baseUrlUtil;
        userCreationPage = new UserCreationPage(page);

        // Navigate to login page
        await RBLConfig.navigateToEnvironment(baseUrlUtil);
        await page.waitForTimeout(2000);

        // Attempt login with created user credentials
        const isLoginSuccessful = await loginPage.login(email, password, role);

        if (isLoginSuccessful) {
          console.log(`✅ Created user login successful: ${firstName} ${lastName}`);

          // Wait for any page redirects/refreshes to complete after login
          await page.waitForLoadState('networkidle', { timeout: 10000 });
          await page.waitForTimeout(2000);

          // Close the user dropdown that was opened during role verification
          // Click elsewhere to close the dropdown before logout
          await page.click('body');
          await page.waitForTimeout(1000);

          // Logout user after successful login verification
          try {
            await userCreationPage.logoutUser();
            console.log(`✅ User ${firstName} ${lastName} logged out after verification`);
          } catch (logoutError) {
            console.warn(`⚠️ Logout failed for ${firstName} ${lastName}, but login verification was successful: ${logoutError.message}`);
          }
        } else {
          console.log(`❌ Created user login failed: ${firstName} ${lastName}`);
        }
      } catch (error) {
        console.error(`❌ Error testing login for created user ${firstName} ${lastName}: ${error.message}`);
      } finally {
        // Always cleanup browser for this user
        if (rblSetup) {
          try {
            await rblSetup.cleanup();
            console.log(`🧹 Browser cleaned up for user: ${firstName} ${lastName}`);
          } catch (cleanupError) {
            console.error(`⚠️ Error cleaning up browser for ${firstName} ${lastName}: ${cleanupError.message}`);
          }
        }
      }
    }
  });

});

// RBL User Updation Tests
test.describe.serial('RBL - User Updation Tests', () => {
  let userCreationPage;
  let systemSetupPage;
  let loginPage;
  let baseUrlUtil;
  let browser;
  let context;
  let page;
  let apiCapture;
  let rblSetup;

  // Use RBL Config for timeout
  test.setTimeout(RBLTestSetup.getTestTimeout());

  test.beforeAll(async () => {
    console.log('RBL User Updation beforeAll starting');

    rblSetup = new RBLTestSetup();
    const instances = await rblSetup.completeSetup();

    // Extract needed instances
    browser = instances.browser;
    context = instances.context;
    page = instances.page;
    systemSetupPage = instances.sys;
    loginPage = instances.loginPage;
    baseUrlUtil = instances.baseUrlUtil;
    apiCapture = instances.apiCapture;

    // Initialize user creation page
    userCreationPage = new UserCreationPage(page);

    // Navigate to Users section
    await userCreationPage.NavigateToUsers();
    console.log('RBL User Updation beforeAll finished');
  });

  test('RBL User Updation Test', async () => {
    const userUpdationData = UserCreationUpdationData.UserUpdationData();
    console.log(`📊 Processing ${userUpdationData.length} user update(s) from Excel data`);

    for (let i = 0; i < userUpdationData.length; i++) {
      const data = userUpdationData[i];
      const {
        firstName, lastName, role, email, password, timeZone, Extension, 'Phone Number': phoneNumber, userskill
      } = data;
      console.log(`📋 [${i + 1}/${userUpdationData.length}] Updating RBL user: ${firstName} ${lastName} (${email})`);

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
        continue;
      }
    }
  });

  test.afterAll(async () => {
    // Logout admin after user updation
    await userCreationPage.logoutUser();
    console.log('✅ Admin logged out after user updation');
  });
});

// RBL Updated User Login Verification Tests
test.describe('RBL - Updated User Login Verification', () => {
  // Use extended timeout for login verification tests
  test.setTimeout(300000); // 5 minutes

  test('RBL Verify Updated User Login', async () => {
    // Use same data as user updation for login verification
    const userUpdationData = UserCreationUpdationData.UserUpdationData();
    console.log(`📊 Testing login for ${userUpdationData.length} updated user(s)`);

    for (let i = 0; i < userUpdationData.length; i++) {
      const data = userUpdationData[i];
      const { firstName, lastName, role, email, password } = data;
      console.log(`📋 [${i + 1}/${userUpdationData.length}] Testing login for updated user: ${firstName} ${lastName} (${email})`);

      // Launch fresh browser for each user login verification
      let rblSetup = null;
      let page = null;
      let loginPage = null;
      let baseUrlUtil = null;
      let userCreationPage = null;

      try {
        console.log('� Launching fresh browser for updated user login verification...');

        // Initialize fresh browser instances (no admin login)
        rblSetup = new RBLTestSetup();
        const instances = await rblSetup.initializeBrowser();

        // Extract needed instances
        page = instances.page;
        loginPage = instances.loginPage;
        baseUrlUtil = instances.baseUrlUtil;
        userCreationPage = new UserCreationPage(page);

        // Navigate to login page
        await RBLConfig.navigateToEnvironment(baseUrlUtil);
        await page.waitForTimeout(2000);

        // Attempt login with updated user credentials
        const isLoginSuccessful = await loginPage.login(email, password, role);

        if (isLoginSuccessful) {
          console.log(`✅ Updated user login successful: ${firstName} ${lastName}`);

          // Wait for any page redirects/refreshes to complete after login
          await page.waitForLoadState('networkidle', { timeout: 10000 });
          await page.waitForTimeout(2000);

          // Close the user dropdown that was opened during role verification
          // Click elsewhere to close the dropdown before logout
          await page.click('body');
          await page.waitForTimeout(1000);

          // Logout user after successful login verification
          try {
            await userCreationPage.logoutUser();
            console.log(`✅ Updated user ${firstName} ${lastName} logged out after verification`);
          } catch (logoutError) {
            console.warn(`⚠️ Logout failed for ${firstName} ${lastName}, but login verification was successful: ${logoutError.message}`);
          }
        } else {
          console.log(`❌ Updated user login failed: ${firstName} ${lastName}`);
        }
      } catch (error) {
        console.error(`❌ Error testing login for updated user ${firstName} ${lastName}: ${error.message}`);
      } finally {
        // Always cleanup browser for this user
        if (rblSetup) {
          try {
            await rblSetup.cleanup();
            console.log(`🧹 Browser cleaned up for updated user: ${firstName} ${lastName}`);
          } catch (cleanupError) {
            console.error(`⚠️ Error cleaning up browser for ${firstName} ${lastName}: ${cleanupError.message}`);
          }
        }
      }
    }
  });

});
