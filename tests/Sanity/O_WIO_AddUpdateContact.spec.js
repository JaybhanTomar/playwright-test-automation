const { test, expect } = require('@playwright/test');
const WIO_SearchAndAddContact = require('../pages/AddupdatecontactPage');
const WIOContactData = require('../DataProvider/ContactData');
const SanityTestSetup = require('./utils/SanityTestSetup.js');

// Uses centralized Sanity configuration from tests/Sanity/config/SanityConfig.js
test.describe.serial('Sanity - WIO AddUpdateContact Tests', () => {
  let sanitySetup, wioSearchAndAddContact, page, apiCapture;

  // Use Sanity Config for timeout
  test.setTimeout(SanityTestSetup.getTestTimeout());

  test.beforeAll(async () => {
    // Initialize Sanity test setup
    sanitySetup = new SanityTestSetup();
    const instances = await sanitySetup.completeSetup();

    // Extract needed instances
    page = instances.page;
    apiCapture = instances.apiCapture;

    // Initialize WIO contact page
    wioSearchAndAddContact = new WIO_SearchAndAddContact(page);

    console.log(`✅ Sanity WIO Contact: Setup completed on ${SanityTestSetup.getEnvironment().toUpperCase()}`);
  });

  test.afterAll(async () => {
    // Use Sanity setup cleanup
    await sanitySetup.cleanup();
  });

  test('Verify WIO Contact Add', async ({}, testInfo) => {
    const WIOContactAddData = WIOContactData.WIOAddContactData();
    for (const data of WIOContactAddData) {
      const {
        AddContact,
        companyName,
        firstName,
        lastName,
        phone,
        email
      } = data;
      console.log(`Adding new contact with Company: ${companyName}, First Name: ${firstName}, Last Name: ${lastName}, Phone: ${phone}, Email: ${email}`);
      await wioSearchAndAddContact.WIOaddNewContact(
        AddContact, companyName, firstName, lastName, phone, email, testInfo.title);
    }
  });

  test('Verify WIO Contact Search', async ({}, testInfo) => {
    const WIOContactSearchData = WIOContactData.WIOSearchContactData();
    for (const data of WIOContactSearchData) {
      const {
        SearchContact,
        fieldType,
        fieldValue,
        firstName,
        lastName
      } = data;
      console.log(`Searching for contact with field type: ${fieldType}, field value: ${fieldValue}`);
      await wioSearchAndAddContact.WIOsearchContact(SearchContact, fieldType, fieldValue, firstName, lastName, testInfo.title);
    }
  });
});

