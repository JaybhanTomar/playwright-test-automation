const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');
const ErrorUtil = require('../utils/ErrorUtil');
const TablePaginationHandler = require('../utils/TablePaginationHandler');
const DatePicker = require('../utils/DatePicker');

class AddupdatecontactPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.WIO = page.locator("//a[@class='sidebar-wio-footer buttons switch']");
    this.SearchorAddContactPopUp = page.locator("//div[@id='wioTheLayer']//div[@class='box box-info']");
    this.SearchContact = page.locator("//input[@id='contactSearch']");
    this.FieldType = page.locator("//select[@id='searchBy_contact']");
    this.FieldValue = page.locator("//input[@id='newserchtext']");
    this.SearchButton = page.locator("//button[@id='contactSearchWio']");
    this.SelectContact = page.locator("//select[@id='inboundfirstName']");
    this.ContactUV = page.locator("//div[@class='row m-l-0 m-r-0 border_class']");

    //Add New Contact
    this.AddNewContact = page.locator("//input[@id='contactNewAdd']");
    this.CompanyName = page.locator("//input[@id='wioCompany']");
    this.FirstName = page.locator("//input[@id='firstName']");
    this.LastName = page.locator("//input[@id='lastName']");
    this.Phone = page.locator("//input[@id='phone']");
    this.Email = page.locator("//input[@id='email']");
    this.SaveAddContact = page.locator("//button[@id='addContactSaveWio']");

    // Initialize DatePicker utility
    this.datePickerUtil = new DatePicker(page);
  }

  async navigateToWIO() {
    try {
      console.log('Navigating to WIO...');
      await this.scrollIntoView(this.WIO);
      await this.safeClick(this.WIO);
      await ErrorUtil.captureErrorIfPresent(this.page);
      await expect(this.SearchorAddContactPopUp).toBeVisible({ timeout: 10000 });
      console.log('✅ WIO is visible');
      return true;
    } catch (error) {
      console.error('❌ Error navigating to WIO:', error.message);
      throw error;
    }
  }

  async WIOsearchContact(SearchContact,fieldType, fieldValue,firstName, lastName) {
    try {
      if(SearchContact==='Yes') {
        await this.navigateToWIO();
        console.log(`Searching for contact with field type: ${fieldType}, field value: ${fieldValue}`);
      await this.scrollIntoView(this.SearchContact);
      await this.safeClick(this.SearchContact);
      await this.FieldType.selectOption(fieldType.trim());
      await this.FieldValue.fill(fieldValue.trim());
      await this.safeClick(this.SearchButton);
      await ErrorUtil.captureErrorIfPresent(this.page);
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'WIOsearchContact');
      const combinedName = `${firstName} ${lastName}`.trim();
      await expect(this.SelectContact).toBeVisible({ timeout: 10000 });
      await this.SelectContact.selectOption(combinedName);
      await expect(this.ContactUV).toBeVisible({ timeout: 10000 });
      console.log(`✅ Contact with field type "${fieldType}" and value "${fieldValue}" found (Selected: ${combinedName})`);
      return true;
      } else {
        console.log('Skipping contact search as per configuration');
        return true;
      } 
      
    } catch (error) {
      console.error('❌ Error searching contact:', error.message);
      throw error;
    } finally {
      if (!this.page.isClosed()) {
        try {
          const routerLink = this.page.locator("//a[@class='router-link-active']");
          if (await routerLink.count() > 0 && await routerLink.isVisible()) {
            await this.scrollIntoView(routerLink);
            await this.safeClick(routerLink);
          }
        } catch (e) {
          // Log and ignore if not found or not visible
          console.warn('Router link not found or not clickable after error:', e.message);
        }
      }
    }
  }

  async WIOaddNewContact(AddContact,companyName, firstName, lastName, phone, email, testName = 'unknown') {
    try {
      if(AddContact==='Yes') {
      await this.navigateToWIO();
      console.log('Adding new contact...');
      await this.scrollIntoView(this.AddNewContact);
      await expect(this.AddNewContact).toBeVisible({ timeout: 10000 });  
      console.log(`Adding new contact with Company: ${companyName}, First Name: ${firstName}, Last Name: ${lastName}, Phone: ${phone}, Email: ${email}`);
      await this.scrollIntoView(this.AddNewContact);
      await this.safeClick(this.AddNewContact);
      if(this.CompanyName)await this.CompanyName.fill(companyName.trim());
      if(this.FirstName)await this.FirstName.fill(firstName.trim());
      if(this.LastName)await this.LastName.fill(lastName.trim());
      if(this.Phone)await this.Phone.fill(phone.trim());
      if(this.Email)await this.Email.fill(email.trim());
      await this.safeClick(this.SaveAddContact);
      await this.page.locator('#pageMessages').waitFor({ state: 'hidden', timeout: 10000 });
      try {
        await ErrorUtil.captureErrorIfPresent(this.page, testName);
        await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, testName);
      } catch (error) {
        // Always try to close the error popup and reload the page
        if (!this.page.isClosed()) {
          try {
            await this.safeClick(this.page.locator("//i[@class='fa fa-times fa-lg info close-wio hov-pointer']"));
          } catch (e) {}
          try {
            await this.page.reload({ waitUntil: 'domcontentloaded' });
            await this.page.waitForSelector('body', { timeout: 5000 }); // Wait for a reliable selector
          } catch (e) {
            console.error('Page reload or selector wait failed after error:', e.message);
          }
        }
        throw error;
      }
      console.log('✅ New contact added successfully');
      return true;
      } else {
        console.log('Skipping new contact addition as per configuration');
        return true;
      }
    } catch (error) {
      console.error('❌ Error adding new contact:', error.message);
      throw error;
    } finally {
      if (!this.page.isClosed()) {
        try {
          const routerLink = this.page.locator("//a[@class='router-link-active']");
          if (await routerLink.count() > 0 && await routerLink.isVisible()) {
            await this.scrollIntoView(routerLink);
            await this.safeClick(routerLink);
          }
        } catch (e) {
          // Log and ignore if not found or not visible
          console.warn('Router link not found or not clickable after error:', e.message);
        }
      }
    }
  }
}

module.exports = AddupdatecontactPage;
