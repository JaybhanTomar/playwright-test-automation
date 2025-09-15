const { expect } = require('@playwright/test');

class BasePage {
  constructor(page) {
    this.page = page;
  }

  // Common method for scrolling elements into view
  async scrollIntoView(element) {
    try {
      await element.scrollIntoViewIfNeeded();
    } catch (error) {
      console.log(`⚠️ Could not scroll element into view: ${error.message}`);
    }
  }

  // Common method for waiting for elements
  async waitForElement(element, timeout = 10000) {
    try {
      await expect(element).toBeVisible({ timeout });
      return true;
    } catch (error) {
      console.log(`⚠️ Element not visible within ${timeout}ms: ${error.message}`);
      return false;
    }
  }

  // Common method for safe clicking
  async safeClick(element) {
    try {
      await this.scrollIntoView(element);
      await expect(element).toBeVisible({ timeout: 10000 });
      await expect(element).toBeEnabled({ timeout: 5000 });
      await element.click();
      return true;
    } catch (error) {
      console.log(`⚠️ Could not click element: ${error.message}`);
      return false;
    }
  }

  // Common method for safe text input
  async safeType(element, text) {
    try {
      await this.scrollIntoView(element);
      await expect(element).toBeVisible({ timeout: 10000 });
      await element.clear();
      await element.fill(text);
      return true;
    } catch (error) {
      console.log(`⚠️ Could not type text: ${error.message}`);
      return false;
    }
  }

  // Common method for dropdown selection
  async safeSelect(element, option) {
    try {
      await this.scrollIntoView(element);
      await expect(element).toBeVisible({ timeout: 10000 });
      await element.selectOption({ label: option });
      return true;
    } catch (error) {
      console.log(`⚠️ Could not select option: ${error.message}`);
      return false;
    }
  }

  // Common method for getting text content
  async getTextContent(element) {
    try {
      await expect(element).toBeVisible({ timeout: 10000 });
      return await element.textContent();
    } catch (error) {
      console.log(`⚠️ Could not get text content: ${error.message}`);
      return '';
    }
  }

  // Common method for checking if element exists
  async elementExists(selector) {
    try {
      const element = this.page.locator(selector);
      const count = await element.count();
      return count > 0;
    } catch (error) {
      return false;
    }
  }

  // Common method for waiting for page load
  async waitForPageLoad() {
    try {
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(1000);
    } catch (error) {
      console.log(`⚠️ Page load wait failed: ${error.message}`);
    }
  }
}

module.exports = BasePage;
