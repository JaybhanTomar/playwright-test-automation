const { test } = require('@playwright/test');
const UserCreationPage = require('../pages/UserCreationPage');
const UserCreationUpdationData = require('../DataProvider/UserCreationUpdationData');
const SanityTestSetup = require('./utils/SanityTestSetup.js');

// Uses centralized Sanity configuration from tests/Sanity/config/SanityConfig.js
test.describe.serial('Sanity - User Creation and Updation Tests', () => {
  let sanitySetup, userCreationPage, sys, page, apiCapture;

  // Use Sanity Config for timeout
  test.setTimeout(SanityTestSetup.getTestTimeout());

  test.beforeAll(async () => {
    // Initialize Sanity test setup
    sanitySetup = new SanityTestSetup();
    const instances = await sanitySetup.completeSetup();

    // Extract needed instances
    page = instances.page;
    sys = instances.sys;
    apiCapture = instances.apiCapture;

    // Initialize user creation page
    userCreationPage = new UserCreationPage(page);

    // Navigate to Users page
    await userCreationPage.NavigateToUsers();

    console.log(`✅ Sanity Users: Setup completed on ${SanityTestSetup.getEnvironment().toUpperCase()}`);
  });

  test('User Creation Test', async ({}, testInfo) => {
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

  test('User Updation Test', async ({}, testInfo) => {
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
    // Use Sanity setup cleanup
    await sanitySetup.cleanup();
  });
});