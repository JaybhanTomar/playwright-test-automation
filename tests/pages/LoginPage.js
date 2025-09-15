const ErrorUtil = require('../utils/ErrorUtil');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.captchaHandled = false; // Track if captcha has been handled in this session
    // Locators
    this.username = page.locator("//input[@id='user_login']");
    this.password = page.locator("//input[@id='user_password']");
    this.loginButton = page.locator("//button[@id='loginButton']");
    this.userIcon = page.locator("//li[@class='dropdown user user-menu']//a[@class='dropdown-toggle']");
  }

  async EnterUserName(email) {
    // Handle session expired popup if it appears before entering username
    try {
      const sessionExpiredText = this.page.locator("text=Session Expired");
      const loginAgainButton = this.page.locator("text=Please Login Again");

      if (await sessionExpiredText.isVisible({ timeout: 2000 })) {
        console.log('🔄 Session expired popup detected in EnterUserName, clicking Login Again...');
        await loginAgainButton.click({ force: true });
        await this.page.waitForTimeout(3000);
        // Wait for login form to appear
        await this.page.waitForSelector("//input[@id='user_login']", { timeout: 10000 });
      }
    } catch (popupError) {
      // No popup found, continue normally
    }

    await this.username.waitFor({ state: 'visible', timeout: 30000 });
    await this.username.fill(email);
  }

  async EnterUserPass(password) {
    await this.password.waitFor({ state: 'visible', timeout: 30000 });
    await this.password.fill(password);
  }

  async ClickLoginbutton(skipCaptchaWait = false) {
    try {
      // Wait for login button to be visible and stable
      await this.loginButton.waitFor({ state: 'visible', timeout: 30000 });
      await this.page.waitForTimeout(1000); // Wait for any animations/overlays to settle

      // RBL Captcha handling - Wait 20 seconds for captcha to be solved manually
      // Only wait if captcha hasn't been handled yet and skipCaptchaWait is false
      if (!this.captchaHandled && !skipCaptchaWait) {
        console.log('⏳ Waiting 20 seconds for captcha to be solved manually...');
        await this.page.waitForTimeout(20000); // 20 second wait for captcha
        console.log('✅ Captcha wait completed, proceeding with login...');
        this.captchaHandled = true; // Mark captcha as handled for this session
      } else if (skipCaptchaWait) {
        console.log('⚡ Skipping captcha wait for this login attempt...');
      } else {
        console.log('✅ Captcha already handled in this session, proceeding with login...');
      }

      // Try normal click first
      try {
        await this.loginButton.click({ timeout: 5000 });
      } catch (clickError) {
        console.log('Normal click failed, trying force click...');
        // If normal click fails, try force click
        await this.loginButton.click({ force: true, timeout: 5000 });
      }

      await ErrorUtil.captureErrorIfPresent(this.page, 'Click on login button');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'Click on login button');
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForTimeout(2000);
    } catch (error) {
      console.error('Error clicking login button or dismissing popup:', error.message);
      throw new Error(`Login button click failed or popup not handled: ${error.message}`);
    }
  }

  async login(email, password, role) {
    try {
      await this.EnterUserName(email);
      await this.EnterUserPass(password);
      await this.ClickLoginbutton();
      await ErrorUtil.captureErrorIfPresent(this.page,'LoginPage.login');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'LoginPage.login');

      // Wait for any page redirects/refreshes to complete after login
      // Increased timeout for RBL environment which can be slower after captcha
      await this.page.waitForLoadState('networkidle', { timeout: 30000 });
      await this.page.waitForTimeout(2000);

      console.log('🔍 Looking for user dropdown icon after login...');

      // Try multiple user dropdown locators for different RBL environments
      const userDropdownSelectors = [
        "//li[@class='dropdown user user-menu']//a[@class='dropdown-toggle']", // Primary
        "//span[@class='hidden-xs']", // Alternative 1
        "//li[@class='dropdown user user-menu']", // Alternative 2
        "//a[@class='dropdown-toggle']", // Alternative 3
        "//span[contains(@class,'hidden-xs')]", // Alternative 4
        "//li[contains(@class,'user-menu')]//a", // Alternative 5
      ];

      let userDropdownFound = false;
      let userDropdownElement = null;

      for (const selector of userDropdownSelectors) {
        try {
          const element = this.page.locator(selector);
          await element.waitFor({ state: 'visible', timeout: 5000 });
          console.log(`✅ User dropdown found with selector: ${selector}`);
          userDropdownElement = element;
          userDropdownFound = true;
          break;
        } catch (error) {
          console.log(`❌ User dropdown not found with selector: ${selector}`);
          continue;
        }
      }

      if (!userDropdownFound) {
        throw new Error('User dropdown not found with any of the available selectors');
      }

      console.log('✅ User dropdown icon found, clicking to open dropdown...');
      await userDropdownElement.scrollIntoViewIfNeeded();
      await userDropdownElement.click();

      // Wait for dropdown to open before role assertion
      console.log('⏳ Waiting for user dropdown to open...');
      await this.page.waitForTimeout(1500);

      await this.assertUserRole(role);

      // Return true if all steps completed successfully
      return true;
    } catch (error) {
      console.error(`Login failed for user ${email}:`, error.message);
      throw new Error(`Login failed for user ${email}: ${error.message}`);
    }
  }

  async assertUserRole(role) {
    try {
      // Try exact match first
      let roleLocator = this.page.locator(`//small[normalize-space()='${role}']`);
      let actualRole = '';
      let trimmedRole = '';

      // Check if exact match exists
      if (await roleLocator.isVisible({ timeout: 5000 })) {
        actualRole = await roleLocator.textContent();
        trimmedRole = actualRole ? actualRole.trim() : '';
      } else {
        // Try case-insensitive match
        console.log(`Exact role match not found for '${role}', trying case-insensitive...`);
        roleLocator = this.page.locator(`//small[normalize-space(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'))='${role.toLowerCase()}']`);

        if (await roleLocator.isVisible({ timeout: 5000 })) {
          actualRole = await roleLocator.textContent();
          trimmedRole = actualRole ? actualRole.trim() : '';
        } else {
          throw new Error(`Role element not found for '${role}' (tried both exact and case-insensitive)`);
        }
      }

      console.log(`Verifying user role. Expected: '${role}', Actual: '${trimmedRole}'`);

      // Case-insensitive comparison
      if (trimmedRole.toLowerCase() !== role.toLowerCase()) {
        throw new Error(`User role mismatch. Expected: '${role}', Actual: '${trimmedRole}'`);
      }
      console.log(`✅ Role verification passed: ${role} (matched: ${trimmedRole})`);
      return true;
    } catch (error) {
      console.error(`Role assertion failed for role '${role}':`, error.message);
      throw error;
    }
  }
}

module.exports = LoginPage;
