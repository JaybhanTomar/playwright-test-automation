const { expect } = require('@playwright/test');
const BasePage = require('../pages/BasePage');

class AdminSideBar extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.backButtonLocator = page.locator("//i[@class='fa fa-arrow-circle-left fa-lg']");
  }
  async clickOnBackButton() {
    try {
      console.log('🔙 Clicking on Back Button...');
      await expect(this.backButtonLocator).toBeEnabled({ timeout: 20000 });
      await expect(this.backButtonLocator).toBeVisible({ timeout: 20000 });
      await this.scrollIntoView(this.backButtonLocator);
      await this.backButtonLocator.click();
      console.log('✅ Clicked on Back Button successfully');
      return true;
    } catch (error) {
      console.error(`❌ Exception occurred in clickOnBackButton: ${error.message}`);
      throw error;
    }
  }
}

module.exports = AdminSideBar;
