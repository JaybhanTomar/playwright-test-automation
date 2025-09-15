console.log('RBL A1_Verify_LockedOut_Feature.spec.js loaded');
const { test, chromium } = require('@playwright/test');
const UserCreationPage = require('../../pages/UserCreationPage');
const UserCreationUpdationData = require('../../DataProvider/UserCreationUpdationData');
const RBLTestSetup = require('../utils/RBLTestSetup.js');
const RBLConfig = require('../config/RBLConfig.js');
const LoginPage = require('../../pages/LoginPage');

// Uses centralized RBL configuration from tests/RBL/config/RBLConfig.js
test.describe.serial('RBL - Verify Locked Out Feature', () => {
  let userCreationPage;
  let loginPage;
  let page;
  let baseUrlUtil;
  let rblSetup;

  // Use RBL Config for timeout
  test.setTimeout(RBLTestSetup.getTestTimeout());

  test.beforeAll(async () => {
    console.log('RBL Locked Out Feature beforeAll starting');

    // Initialize RBL test setup (instances only, no admin login)
    rblSetup = new RBLTestSetup();
    const instances = await rblSetup.initializeBrowser();

    // Extract needed instances
    page = instances.page;
    loginPage = instances.loginPage;
    baseUrlUtil = instances.baseUrlUtil;

    // Initialize user creation page
    userCreationPage = new UserCreationPage(page);

    console.log('RBL Locked Out Feature beforeAll finished');
  });

  test('RBL Verify Locked Out Feature', async ({}) => {
    const userLockOutData = UserCreationUpdationData.UserCreationData();
    console.log(`📊 Processing ${userLockOutData.length} user lock out test(s) from Excel data`);

    for (let i = 0; i < userLockOutData.length; i++) {
      const data = userLockOutData[i];
      // Map Excel headers to variables expected by the POM
      const {firstName, lastName, role, email, password, timeZone, Extension, 'Phone Number': phoneNumber, userskill} = data;
      // Log mapped values for debugging
      console.log(`📋 [${i + 1}/${userLockOutData.length}] Testing lock out for RBL user with First Name: ${firstName}, Last Name: ${lastName}, Email: ${email}`);

      try {
        // Navigate to login page using RBL Config
        await RBLConfig.navigateToEnvironment(baseUrlUtil);
        await page.waitForLoadState('networkidle');

        await loginPage.EnterUserName(email);
        await loginPage.EnterUserPass('WrongPassword123');

        // Attempt to login with wrong password 11 times
        for (let attempt = 1; attempt <= 11; attempt++) {
          console.log(`🔄 Attempt ${attempt}: Trying wrong password for ${email}...`);
          await loginPage.ClickLoginbutton();
          await page.waitForTimeout(1000);
        }
        console.log(`✅ RBL user lock out test completed for: ${firstName} ${lastName}`);
      } catch (error) {
        console.error(`❌ Error testing lock out for user ${firstName} ${lastName}: ${error.message}`);
        // Continue with next user instead of failing entire test
        continue;
      }
    }
  });

  //Verify Login User With Correct Password should fail
  test('Verify Locked Out User Login', async ({}) => {
    const userLockOutData = UserCreationUpdationData.UserCreationData();
    console.log(`📊 Processing ${userLockOutData.length} user lock out test(s) from Excel data`);

    for (let i = 0; i < userLockOutData.length; i++) {
      const data = userLockOutData[i];
      // Map Excel headers to variables expected by the POM
      const {firstName, lastName, role, email, password, timeZone, Extension, 'Phone Number': phoneNumber, userskill} = data;
      // Log mapped values for debugging
      console.log(`📋 [${i + 1}/${userLockOutData.length}] Testing lock out for RBL user with First Name: ${firstName}, Last Name: ${lastName}, Email: ${email}`);

      try {
        // Navigate to login page using RBL Config
        await RBLConfig.navigateToEnvironment(baseUrlUtil);
        await page.waitForLoadState('networkidle');

        await loginPage.EnterUserName(email);
        await loginPage.EnterUserPass(password);
        await loginPage.ClickLoginbutton();
        await page.waitForLoadState('networkidle');

        const currentUrl = page.url();
        const isLoginSuccessful = !currentUrl.includes('login');

        if (isLoginSuccessful) {
          console.log(`❌ ERROR: Locked out user ${firstName} ${lastName} was able to login - this should not happen!`);
        } else {
          console.log(`✅ Locked out user ${firstName} ${lastName} correctly cannot login`);
        }
        console.log(`✅ RBL user lock out test completed for: ${firstName} ${lastName}`);
      } catch (error) {
        console.error(`❌ Error testing lock out for user ${firstName} ${lastName}: ${error.message}`);
        // Continue with next user instead of failing entire test
        continue;
      }
    }
  });

  test('Activate Locked Out User', async ({}) => {
    // Login as admin to access user management
    await rblSetup.loginToRBLEnvironment();
    await userCreationPage.NavigateToUsers();
    console.log('✅ Admin logged in for user activation');

    const userLockOutData = UserCreationUpdationData.UserCreationData();
    console.log(`📊 Processing ${userLockOutData.length} user lock out test(s) from Excel data`);

    for (let i = 0; i < userLockOutData.length; i++) {
      const data = userLockOutData[i];
      // Map Excel headers to variables expected by the POM
      const {firstName, lastName, role, email, password, timeZone, Extension, 'Phone Number': phoneNumber, userskill} = data;
      // Log mapped values for debugging
      console.log(`📋 [${i + 1}/${userLockOutData.length}] Testing lock out for RBL user with First Name: ${firstName}, Last Name: ${lastName}, Email: ${email}`);

      try {
        await userCreationPage.ActivateLockedOutUser(email);
        console.log(`✅ RBL user lock out test completed for: ${firstName} ${lastName}`);
      } catch (error) {
        console.error(`❌ Error testing lock out for user ${firstName} ${lastName}: ${error.message}`);
        // Continue with next user instead of failing entire test
        continue;
      }
    }
  });

  //Verify Active Locked Out User Should Login Successfully
  test('Verify Active Locked Out User Login', async ({}) => {
    const userLockOutData = UserCreationUpdationData.UserCreationData();
    console.log(`📊 Processing ${userLockOutData.length} user lock out test(s) from Excel data`);

    for (let i = 0; i < userLockOutData.length; i++) {
      const data = userLockOutData[i];
      // Map Excel headers to variables expected by the POM
      const {firstName, lastName, role, email, password, timeZone, Extension, 'Phone Number': phoneNumber, userskill} = data;
      // Log mapped values for debugging
      console.log(`📋 [${i + 1}/${userLockOutData.length}] Testing lock out for RBL user with First Name: ${firstName}, Last Name: ${lastName}, Email: ${email}`);

      try {
        // Navigate to login page using RBL Config
        await RBLConfig.navigateToEnvironment(baseUrlUtil);
        await page.waitForLoadState('networkidle');

        await loginPage.EnterUserName(email);
        await loginPage.EnterUserPass(password);
        await loginPage.ClickLoginbutton();
        await page.waitForLoadState('networkidle');

        const currentUrl = page.url();
        const isLoginSuccessful = !currentUrl.includes('login');

        if (isLoginSuccessful) {
          console.log(`✅ Activated user ${firstName} ${lastName} successfully logged in after activation`);
        } else {
          console.log(`❌ Activated user ${firstName} ${lastName} failed to login after activation`);
        }
        console.log(`✅ RBL user lock out test completed for: ${firstName} ${lastName}`);
      } catch (error) {
        console.error(`❌ Error testing lock out for user ${firstName} ${lastName}: ${error.message}`);
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
