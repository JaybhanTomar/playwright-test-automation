const ErrorUtil = require('../utils/ErrorUtil');

class LoginPage {
  constructor(page) {
    this.page = page;
    // Locators
    this.username = page.locator("//input[@id='user_login']");
    this.password = page.locator("//input[@id='user_password']");
    this.loginButton = page.locator("//button[@id='loginButton']");
    this.userIcon = page.locator("//span[@class='hidden-xs']");
  }

  async EnterUserName(name) {
    await this.username.waitFor({ state: 'visible', timeout: 30000 });
    await this.username.fill(name);
  }

  async EnterUserPass(pass) {
    await this.password.waitFor({ state: 'visible', timeout: 30000 });
    await this.password.fill(pass);
  }

  async ClickLoginbutton() {
    try {
      await this.loginButton.waitFor({ state: 'visible', timeout: 30000 });
      await this.loginButton.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'Click on login button');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'Click on login button');
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForTimeout(2000);
    } catch (error) {
      console.error('Error clicking login button or dismissing popup:', error.message);
      throw new Error(`Login button click failed or popup not handled: ${error.message}`);
    }
  }

  async login(email, password, expectedRole) {
    try {
      await this.EnterUserName(email);
      await this.EnterUserPass(password);
      await this.ClickLoginbutton();
      await ErrorUtil.captureErrorIfPresent(this.page,'LoginPage.login');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'LoginPage.login');
      await this.userIcon.waitFor({ state: 'visible', timeout: 30000 });
      await this.userIcon.scrollIntoViewIfNeeded();
      await this.userIcon.click();
      await this.assertUserRole(expectedRole);
    } catch (error) {
      console.error(`Login failed for user ${email}:`, error.message);
      throw new Error(`Login failed for user ${email}: ${error.message}`);
    }
  }

  async assertUserRole(role) {
    try {
      const roleLocator = this.page.locator(`//small[normalize-space()='${role}']`);
      await roleLocator.waitFor({ state: 'visible', timeout: 30000 });
      const actualRole = await roleLocator.textContent();
      const trimmedRole = actualRole ? actualRole.trim() : '';
      console.log(`Verifying user role. Expected: '${role}', Actual: '${trimmedRole}'`);
      if (trimmedRole !== role) {
        throw new Error(`User role mismatch. Expected: '${role}', Actual: '${trimmedRole}'`);
        return false;
      }
      console.log(`✅ Role verification passed: ${role}`);
        return true;
    } catch (error) {
      console.error(`Role assertion failed for role '${role}':`, error.message);
      throw error;
    }
  }
}

module.exports = LoginPage;
