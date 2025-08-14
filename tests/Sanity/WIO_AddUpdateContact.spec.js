const { test, expect, chromium } = require('@playwright/test');
const WIO_SearchAndAddContact = require('../pages/AddupdatecontactPage');
const WIOContactData = require('../DataProvider/ContactData');
const BaseURL = require('../utils/BaseURL');
const LoginPage = require('../pages/LoginPage');

test.describe('WIO AddUpdateContact Tests', () => {
  let wioSearchAndAddContact;
  let loginPage;
  let baseUrlUtil;
  let browser;
  let context;
  let page;
  
  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    baseUrlUtil = new BaseURL(page);
    loginPage = new LoginPage(page);
    wioSearchAndAddContact = new WIO_SearchAndAddContact(page);

    // Use BaseURL utility to navigate to qc6 environment
    await baseUrlUtil.qc6();
    const loginTestData = require('../DataProvider/UserCreationUpdationData').userLoginData();
    const [email, password, role] = loginTestData[0];
    await loginPage.login(email, password, role);
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
    await browser.close();
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

