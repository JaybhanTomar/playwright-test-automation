const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');
const ErrorUtil = require('../utils/ErrorUtil');
const TablePaginationHandler = require('../utils/TablePaginationHandler');
const DatePicker = require('../utils/DatePicker');

class CampaignCallingPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.CallOnCampaigns = page.locator("//a[@id='campaignCallOnPage']");
    this.DemandCampaigns = page.locator("//a[@id='demandCampaignPage']");
    this.DemandCampaignpage = page.locator("//div[@class='col-xs-12 col-md-12 col-sm-12 col-lg-12 m-b-10']");
    this.SupportCampaigns = page.locator("//a[@id='supportCampaignPage']");
  }

  async navigateToCampaignCallingPage() {
    try {
      await this.CallOnCampaigns.scrollIntoViewIfNeeded();
      await this.CallOnCampaigns.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'navigateToCampaignCallingPage');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'navigateToCampaignCallingPage');
      await expect(this.DemandCampaigns).toBeVisible({ timeout: 10000 });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in navigateToCampaignCallingPage: ${error.message}`);
    }
  }

  async navigateToDemandCampaigns() {
    try {
      if (await this.DemandCampaigns.isVisible()) {
        await this.DemandCampaigns.click();
        await ErrorUtil.captureErrorIfPresent(this.page, 'navigateToDemandCampaigns');
        await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'navigateToDemandCampaigns');
        await expect(this.DemandCampaignpage).toBeVisible({ timeout: 10000 });
      } else {
        throw new Error('Demand Campaigns button is not visible');
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in navigateToDemandCampaigns: ${error.message}`);
    }
  }

  async SelectCampaign(CampaignName) {
    try {
      const rowLocator = this.page.locator("//table[@id='demandTable']//tbody//tr");
      const nextBtnLocator = this.page.locator("//button[normalize-space(text())='>']");
      const prevBtnLocator = this.page.locator("//button[normalize-space(text())='<']");
      let pageIndex = 1;
      let campaignCellLocator = null;
      while (true) {
        const rows = await rowLocator.count();
        for (let i = 0; i < rows; i++) {
          const cell = rowLocator.nth(i).locator('td').nth(0); // Campaign Name column
          const text = (await cell.textContent())?.trim();
          if (text && text.includes(CampaignName)) {
            console.log(`✅ Campaign found on page ${pageIndex}: ${text}`);
            campaignCellLocator = cell;
            break;
          }
        }
        if (campaignCellLocator) break;
        // Try to go to next page if "Next" is enabled and visible
        if (await nextBtnLocator.isVisible() && await nextBtnLocator.isEnabled()) {
          await nextBtnLocator.click();
          await this.page.waitForLoadState('networkidle');
          pageIndex++;
        } else {
          break;
        }
      }
      if (!campaignCellLocator) {
        throw new Error(`Campaign not found: ${CampaignName}`);
      }
      return campaignCellLocator;
    } catch (error) {
      console.error(`❌ Error selecting campaign "${CampaignName}":`, error);
      throw error;
    }
  }

  async clickOnCampaignName(CampaignName) {
    try {
      const campaignCellLocator = await this.SelectCampaign(CampaignName);
      await this.safeClick(campaignCellLocator);
      const callButton = this.page.locator(`//a[normalize-space()='Call']`);
      await callButton.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'CallCampaign');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'CallCampaign');
      return true;
    } catch (error) {
      console.error(`❌ Error calling campaign "${CampaignName}":`, error);
      throw error;
    }
  }
}

module.exports = CampaignCallingPage;
