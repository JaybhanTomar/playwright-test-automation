const { test, chromium } = require('@playwright/test');
const SystemSetupPage = require('../../pages/SystemSetupPage');
const UserCreationPage = require('../../pages/UserCreationPage');
const UserCreationUpdationData = require('../../DataProvider/UserCreationUpdationData');
const BaseURL = require('../../utils/BaseURL');
const LoginPage = require('../../pages/LoginPage');
const ApiCapture = require('../../utils/ApiCapture');

test.describe('User Creation and Updation Tests', () => {
  let userCreationPage;
  let systemSetupPage;
  let loginPage;
  let baseUrlUtil;
  let browser;
  let context;
  let page;
  let apiCapture;

  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    baseUrlUtil = new BaseURL(page);
    loginPage = new LoginPage(page);
    userCreationPage = new UserCreationPage(page);
    systemSetupPage = new SystemSetupPage(page);
    apiCapture = new ApiCapture(page);

    // Start API monitoring
    apiCapture.startMonitoring();

    // Use BaseURL utility to navigate to qc6 environment
    await baseUrlUtil.qc6();

    // Login once and keep session
    const loginTestData = require('../../DataProvider/UserCreationUpdationData').userLoginData();
    const { email, password, role } = loginTestData[0];
    await loginPage.login(email, password, role);
    
    // Navigate to System Setup and Users page
    await systemSetupPage.NavigateToSystemSetup();
    await userCreationPage.NavigateToUsers();
  });

  test('User Creation Test', async ({}, _testInfo) => {
    const userCreationData = UserCreationUpdationData.UserCreationData();
    for (let i = 0; i < userCreationData.length; i++) {
      const data = userCreationData[i];
      // Map Excel headers to variables expected by the POM
      const {
        firstName, lastName, role, email, password, timeZone, Extension, 'Phone Number': phoneNumber, userskill
      } = data;
      // Log mapped values for debugging
      console.log(`Creating new user with First Name: ${firstName}, Last Name: ${lastName}, Email: ${email}, Skill: ${userskill}`);
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
    }
  });

  test.skip('User Updation Test', async ({}) => {
    const userUpdationData = UserCreationUpdationData.UserUpdationData();
    for (let i = 0; i < userUpdationData.length; i++) {
      const data = userUpdationData[i];
      // Map Excel headers to variables expected by the POM
      const {
        firstName, lastName, role, email, password, timeZone, Extension, 'Phone Number': phoneNumber, userskill
      } = data;
      // Log mapped values for debugging
      console.log(`Updating user with First Name: ${firstName}, Last Name: ${lastName}, Email: ${email}, Skill: ${userskill}`);
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