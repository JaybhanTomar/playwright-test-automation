const { expect } = require('@playwright/test');
const AdminSideBar = require('../utils/AdminSideBar');
const ErrorUtil = require('../utils/ErrorUtil');

class UserCreationPage {
  constructor(page) {
    this.page = page;
    this.adminSideBar = new AdminSideBar(page);
    this.timeout = 10000;
    // Locators
    this.users = page.locator("//div[contains(text(),'Users')]");
    this.createUsers = page.locator("//div[@class='btn btn-info btn-block action w-full']");
    this.firstName = page.locator("//input[@id='userFirstName']");
    this.lastName = page.locator("//input[@id='userLastName']");
    this.role = page.locator("//select[@id='role']");
    this.userEmail = page.locator("//input[@id='userEmailId']");
    this.password = page.locator("//input[@id='userPassword']");
    this.timeZone = page.locator("//select[@id='timeZoneId']");
    this.extension = page.locator("//input[@id='extension']");
    this.phoneNumber = page.locator("//input[@id='phoneNumber']");
    this.location = page.locator("//select[@id='location']");
    this.create = page.locator("//button[@id='createUserButton']");
    this.message = page.locator("//div[@id='pageMessages']");
    this.userPageTitle = page.locator("//h4[normalize-space()='User']");
    this.nextPageButton = page.locator("//div[@id='userPagiTop']//li[5]//*[name()='svg']");
    this.previousPageButton = page.locator("//div[@id='userPagiTop']//li[1]//*[name()='svg']");
    this.userTable = page.locator("//table[@id='userTable']");
    this.updateUserButton = page.locator("//button[@id='updateUserButton']");
  }

  async NavigateToUsers() {
    await this.users.scrollIntoViewIfNeeded();
    await this.users.click();
    await ErrorUtil.captureErrorIfPresent(this.page, 'NavigateToUsers');
  }

  async clickCreateUsers() {
    await this.createUsers.scrollIntoViewIfNeeded();
    await this.createUsers.click();
    await ErrorUtil.captureErrorIfPresent(this.page, 'clickCreateUsers');
    await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'clickCreateUsers');
  }

  async enterUserFirstName(firstname) {
    await this.firstName.fill(firstname);
  }

  async enterUserLastName(lastname) {
    await this.lastName.fill(lastname);
  }

  async selectUserRole(role) {
    await this.role.selectOption({ label: role });
    await ErrorUtil.captureErrorIfPresent(this.page, 'selectUserRole');
    const selectedOption = await this.role.inputValue();
    // Compare role and selectedOption case-insensitively
    if (selectedOption.toLowerCase() !== role.toLowerCase()) {
      throw new Error(`Role '${role}' not selected. Actual: '${selectedOption}'`);
    }
    console.log(`✅ Role selected: ${role}`);
  }

  async enterEmail(email) {
    await this.userEmail.fill(email);
  }

  async enterUserPassword(password) {
    await this.password.fill(password);
  }

  async selectUserTimeZone(timezone) {
    await this.timeZone.scrollIntoViewIfNeeded();
    await this.timeZone.selectOption({ label: timezone });
    await ErrorUtil.captureErrorIfPresent(this.page, 'selectUserTimeZone');
    const selectedOptionText = await this.timeZone.inputValue();
    if (selectedOptionText !== timezone) {
      throw new Error(`Timezone '${timezone}' not selected. Actual: '${selectedOptionText}'`);
    }
    console.log(`✅ Timezone selected: ${timezone}`);
  }

  async enterUserExtension(extension) {
    if (extension) await this.extension.fill(extension);
  }

  async enterUserPhoneNumber(phonenumber) {
    if (phonenumber) await this.phoneNumber.fill(phonenumber);
  }

  async selectUserLocation(location) {
    if (location) await this.location.selectOption({ label: location });
  }

  async chooseUserSkill(userskill) {
    // Support multiple skills, comma separated, and select each if present
    if (!userskill) return;
    const skills = userskill.split(',').map(s => s.trim()).filter(Boolean);
    if (skills.length === 0) return;
    for (const skill of skills) {
      // Use robust locator for skill selection
      const skillLocator = this.page.locator(`//label[normalize-space()='${skill}']//span[@class='ui-checkmark']`);
      if (await skillLocator.count() > 0) {
        const el = await skillLocator.elementHandle();
        if (el.isChecked()) {
          console.log(`Skill '${skill}' is already selected.`);
        } else {
          await el.scrollIntoViewIfNeeded();
          await el.click({ force: true });
          // Optionally click the parent label for robustness

          const parentLabel = await el.evaluateHandle(node => node.closest('label'));
          if (parentLabel) {
            await parentLabel.scrollIntoViewIfNeeded();
            await parentLabel.click();
          }
          await this.page.waitForTimeout(200); // Short wait for UI
        }
      } else {
        console.warn(`Skill '${skill}' not found with locator.`);
      }
    }
  }

  async clickCreateButton() {
    await this.create.scrollIntoViewIfNeeded();
    await this.create.click();
  }

  async getValidationMessage() {
    try {
      await this.message.waitFor({ state: 'visible', timeout: this.timeout });
      return (await this.message.textContent()).trim();
    } catch {
      return;
    }
  }

  async verifyUserCreatedSuccessMessage() {
    const msg = await this.getValidationMessage();
    if (!msg.includes('User created successfully')) {
      throw new Error('User is not Created. Actual message: ' + msg);
    }
    console.log('User created successfully');
    await this.message.waitFor({ state: 'hidden', timeout: 10000 }); // or 'detached'
  }

  async verifyUserUpdatedSuccessMessage() {
    const msg = await this.getValidationMessage();
    if (!msg.includes('User updated successfully')) {
      throw new Error('User is not Updated. Actual message: ' + msg);
    }
    console.log('User updated successfully');
    await this.message.waitFor({ state: 'hidden', timeout: 10000 }); // or 'detached'
  }

  async isDuplicateUserMessageDisplayed() {
    const msg = await this.getValidationMessage();
    return msg.includes('User with same login Id already exists.');
  }

  async isErrorMessageDisplayed() {
    const msg = await this.getValidationMessage();
    return msg.toLowerCase().includes('oops!');
  }

  async newUserCreation(firstname, lastname, role, email, password, timezone, extension, phonenumber, userskill) {
    await this.clickCreateUsers();
    await this.enterUserFirstName(firstname);
    await this.enterUserLastName(lastname);
    await this.selectUserRole(role);
    await this.enterEmail(email);
    await this.enterUserPassword(password);
    await this.selectUserTimeZone(timezone);
    await this.enterUserExtension(extension);
    await this.enterUserPhoneNumber(phonenumber);
    await this.chooseUserSkill(userskill);
    await this.clickCreateButton();
    await this.verifyUserCreatedSuccessMessage();
  }

  async handleUserCreationErrors(email) {
    const validationMessage = await this.getValidationMessage();
    const isOops = validationMessage.toLowerCase().includes('oops!');
    const isDuplicate = await this.isDuplicateUserMessageDisplayed();

    if (isOops || isDuplicate) {
      console.log(`${email}: Encountered an error: ${validationMessage}`);
      await this.userPageTitle.scrollIntoViewIfNeeded();
      await expect(this.userPageTitle).toBeVisible({ timeout: this.timeout });
      await this.adminSideBar.clickOnBackButton();
    } else if (await this.isErrorMessageDisplayed()) {
      console.error(`${email}: Error message displayed: ${validationMessage}`);
      await this.userPageTitle.scrollIntoViewIfNeeded();
      await expect(this.userPageTitle).toBeVisible({ timeout: this.timeout });
      await this.adminSideBar.clickOnBackButton();
    } else {
      await this.verifyUserCreatedSuccessMessage();
    }
  }



 // Update existingUser function to return userFound
async existingUser(firstname, lastname, role, email, password, timezone, extension, phonenumber, userskill) {
  let userFound = false;
  try {
    while (true) {
      const matchingEmails = await this.page.locator(`//td[normalize-space()='${email.trim()}']`).all();
      if (matchingEmails.length > 0) {
        const emailElement = matchingEmails[0];
        await emailElement.scrollIntoViewIfNeeded();
        await expect(emailElement).toBeVisible({ timeout: this.timeout });
        userFound = true;
        break;
      }

      const activePageText = await this.page.locator("//button[contains(@class,'Page-active')]").textContent();
      const currentPage = parseInt(activePageText?.trim() || '1');
      const pageButtons = await this.page.locator("//div[@id='userPagiTop']//button[contains(@aria-label,'Go to page')]").all();
      const pageNumbers = await Promise.all(pageButtons.map(async btn => parseInt((await btn.textContent())?.trim() || '0')));
      const maxPage = Math.max(...pageNumbers.filter(n => !isNaN(n)), currentPage);

      if (currentPage >= maxPage) break;

      await this.nextPageButton.click();
      await this.page.waitForTimeout(1000);
      await expect(this.page.locator("//button[contains(@class,'Page-active')]")).toHaveText(String(currentPage + 1));
    }
  } catch (error) {
    console.error(`Error during pagination search: ${error.message}`);
  }

  if (!userFound) {
    console.log(`${email}: User not found. Creating user...`);
    await this.newUserCreation(firstname, lastname, role, email, password, timezone, extension, phonenumber, userskill);
    await this.handleUserCreationErrors(email);
  } else {
    console.log(`${email}: User already exists.`);
  }
  
  return userFound; // Return userFound
}


 // Update User
async updateUser(firstname, lastname, role, email, password, timezone, extension, phonenumber, userskill) {
  try {
    const userFound = await this.existingUser(firstname, lastname, role, email, password, timezone, extension, phonenumber, userskill);
    if (userFound) {
      console.log(`${email}: User already exists. Proceeding to update...`);
      const ClickOnEditButton = this.page.locator(`//td[normalize-space()='${email.trim()}']/following-sibling::td//a`);
      await ClickOnEditButton.scrollIntoViewIfNeeded();
      await ClickOnEditButton.click();
      const isRoleDisabled = await this.role.isDisabled();
      if (!isRoleDisabled) {
        throw new Error('Role dropdown should be disabled during update, but it is editable.');
      }
      // Proceed with update logic if role is disabled
      await this.enterUserFirstName(firstname);
      await this.enterUserLastName(lastname);
      await this.enterEmail(email);
      await this.enterUserPassword(password);
      await this.selectUserTimeZone(timezone);
      await this.enterUserExtension(extension); 
      await this.enterUserPhoneNumber(phonenumber);
      await this.chooseUserSkill(userskill);
      await this.updateUserButton.scrollIntoViewIfNeeded();
      try {
  await this.updateUserButton.waitFor({ state: 'attached', timeout: this.timeout });

  if (await this.updateUserButton.isVisible() && await this.updateUserButton.isEnabled()) {
    await this.updateUserButton.click();
  } else {
    throw new Error('Update button not interactable');
  }

  await this.page.waitForSelector('text=User updated successfully', { timeout: 5000 });

} catch (error) {
  console.warn(`Normal click failed: ${error.message}. Trying JS click...`);
  try {
    await this.updateUserButton.evaluate(el => el.click());
  } catch (e) {
    throw new Error(`Update button could not be clicked: ${e.message}`);
  }
}

      await ErrorUtil.captureErrorIfPresent(this.page, 'updateUser');
      await this.verifyUserUpdatedSuccessMessage();
      console.log(`${email}: User updated successfully.`);
      await this.message.waitFor({ state: 'hidden', timeout: 10000 }); // or 'detached'
    } else {
      console.log(`${email}: User not found`);
    }
  } catch (error) {
    console.error(`Error updating user ${email}: ${error.message}`);
    throw error;
  }
}
}

module.exports = UserCreationPage;
