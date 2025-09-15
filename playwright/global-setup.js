// playwright/global-setup.js
// Logs in once and saves the authenticated session for reuse in all tests
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const ExcelUtils = require('../tests/utils/ExcelUtils.js');
const BaseURL = require('../tests/utils/BaseURL.js');

module.exports = async () => {
  // Read all user login data from Excel
  const users = ExcelUtils.readExcelDataAsObjects(path.join(__dirname, '../tests/data/Login Creds Data.xlsx'), 'UserLoginData');
  const storageDir = path.join(__dirname, '.auth');
  if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });

  for (const user of users) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    // Use BaseURL utility to get the login URL for the specified environment
    const baseUrlUtil = new BaseURL();
    const env = process.env.QC_ENV || 'qc2';
    let loginUrl = baseUrlUtil.getEnvironmentUrl(env);
    // Always go to /login for login
    loginUrl = loginUrl.replace(/\/$/, '') + '/login';
    await page.goto(loginUrl);
    try {
      // Wait for login form
      await page.waitForSelector('#user_login', { timeout: 15000 });
      await page.fill('#user_login', user.email || user.username);
      await page.fill('#user_password', user.password);
      await page.click('#loginButton');
      // Wait for dashboard or error
      await page.waitForTimeout(5000); // Wait for possible redirect
      // Take a screenshot and save HTML after login attempt
      const debugBase = path.join(storageDir, `login_debug_${user.role || user.email}`);
      await page.screenshot({ path: `${debugBase}.png` });
      fs.writeFileSync(`${debugBase}.html`, await page.content());
      // Check for dashboard or user icon (adjust selector as needed)
      const dashboardVisible = await page.isVisible('text=Dashboard');
      if (dashboardVisible) {
        const safeRole = (user.role || user.email || 'user').toLowerCase().replace(/[^a-z0-9_-]/g, '_');
        await page.context().storageState({ path: path.join(storageDir, `${safeRole}.json`) });
        console.log(`✅ Saved session for ${user.role || user.email}`);
      } else {
        throw new Error('Dashboard not visible after login');
      }
    } catch (err) {
      console.error(`❌ Login failed for ${user.role || user.email}: ${err.message}`);
      console.error('Current URL:', page.url());
      const content = await page.content();
      fs.writeFileSync(path.join(storageDir, `login_error_${user.role || user.email}.html`), content);
      await page.screenshot({ path: path.join(storageDir, `login_error_${user.role || user.email}.png`) });
    }
    await browser.close();
  }
};
