const { expect } = require('@playwright/test');
const BasePage = require('../pages/BasePage');
const ErrorUtil = require('../utils/ErrorUtil');
const TablePaginationHandler = require('../utils/TablePaginationHandler');
const DatePicker = require('../utils/DatePicker');
const AddupdatecontactPage = require('../pages/AddupdatecontactPage');

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
      console.log(`🔍 Looking for campaign: "${CampaignName}"`);

      // Wait for the table to be visible
      await this.page.waitForSelector("//table[@id='demandTable']", { timeout: 10000 });
      await this.page.waitForLoadState('networkidle');

      // Define table row locator and pagination buttons
      const rowLocator = this.page.locator("//table[@id='demandTable']//tbody//tr");
      const nextBtnLocator = this.page.locator("//button[normalize-space(text())='>']");
      const prevBtnLocator = this.page.locator("//button[normalize-space(text())='<']");

      // First, let's see what campaigns are available for debugging
      const allCampaigns = this.page.locator("//table[@id='demandTable']//tbody//tr//td[1]");
      const campaignCount = await allCampaigns.count();
      console.log(`📊 Found ${campaignCount} campaigns on current page:`);

      for (let i = 0; i < Math.min(campaignCount, 10); i++) {
        const campaignText = await allCampaigns.nth(i).textContent();
        console.log(`📋 Campaign ${i + 1}: "${campaignText?.trim()}"`);
      }

      // Use TablePaginationHandler to find the campaign row
      console.log(`🎯 Using TablePaginationHandler to search for: "${CampaignName}"`);

      const foundRow = await TablePaginationHandler.findRowWithCellValue({
        page: this.page,
        rowLocator: rowLocator,
        cellIndex: 0, // First column contains campaign name
        expectedValue: CampaignName,
        nextBtnLocator: nextBtnLocator,
        prevBtnLocator: prevBtnLocator
      });

      if (foundRow) {
        console.log(`✅ Campaign row found: ${CampaignName}`);
        // Find the campaign link within the found row
        const campaignLink = foundRow.locator("//div//a[contains(text(), '" + CampaignName + "')]");
        if (await campaignLink.count() > 0) {
          console.log(`✅ Campaign link found: ${CampaignName}`);
          return campaignLink.first();
        } else {
          // Fallback: try to find any link in the first cell
          const firstCellLink = foundRow.locator("td:first-child a");
          if (await firstCellLink.count() > 0) {
            console.log(`✅ Campaign link found in first cell: ${CampaignName}`);
            return firstCellLink.first();
          }
        }
      }

      throw new Error(`Campaign not found: ${CampaignName}`);
    } catch (error) {
      console.error(`❌ Error selecting campaign "${CampaignName}":`, error);
      throw error;
    }
  }

  async clickOnCampaignName(CampaignName) {
    try {
      console.log(`🖱️ Attempting to click on campaign: "${CampaignName}"`);
      const campaignCellLocator = await this.SelectCampaign(CampaignName);

      console.log(`🖱️ Clicking on campaign element...`);
      const clickResult = await this.safeClick(campaignCellLocator);

      if (!clickResult) {
        console.log(`⚠️ safeClick failed, trying direct click...`);
        await campaignCellLocator.click();
      }

      console.log(`✅ Campaign clicked successfully: "${CampaignName}"`);
      await ErrorUtil.captureErrorIfPresent(this.page, 'CallCampaign');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'CallCampaign');

      // Wait for page to respond to the click
      await this.page.waitForLoadState('networkidle');

      return true;
    } catch (error) {
      console.error(`❌ Error calling campaign "${CampaignName}":`, error);
      throw error;
    }
  }

  //Make Agent Ready
  get PlivoMakeAgentReady() {
    return this.page.locator("//i[@id='availableIcon']");
  }
  get AavazMakeAgentAvailable() {
    return this.page.locator("//i[@id='availableIcon']");
  }
  get AavazMakeAgentReady() {
    return this.page.locator("//i[@id='pbxReadyForCallIcon']");
  }
  get MobiConnectMakeAgentReady() {
    return this.page.locator("//i[@id='availableIcon']");
  }
  async MakeAgentReady(ProviderName) {
    try {
      if (ProviderName === 'Plivo') {
        await this.scrollIntoView(this.PlivoMakeAgentReady);
        await this.PlivoMakeAgentReady.click();
        await ErrorUtil.captureErrorIfPresent(this.page, 'MakeAgentReady');
        await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'MakeAgentReady');
        return true;
      }else if (ProviderName ==='Aavaz PBX') {
        await this.scrollIntoView(this.AavazMakeAgentAvailable);
        await this.AavazMakeAgentAvailable.click();
        await ErrorUtil.captureErrorIfPresent(this.page, 'MakeAgentReady');
        await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'MakeAgentReady');
        await this.scrollIntoView(this.AavazMakeAgentReady);
        await this.AavazMakeAgentReady.click();
        await ErrorUtil.captureErrorIfPresent(this.page, 'MakeAgentReady');
        await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'MakeAgentReady');
        return true;
      }else if (ProviderName ==='MobiConnect') {
        await this.scrollIntoView(this.MobiConnectMakeAgentReady);
        await this.MobiConnectMakeAgentReady.click();
        await ErrorUtil.captureErrorIfPresent(this.page, 'MakeAgentReady');
        await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'MakeAgentReady');
        return true;
      }else if (ProviderName ==='External Phone') {
        console.log('External Phone no need to make agent ready');
        return true;
      }
    } catch (error) {
      console.error(`❌ Error making agent ready:`, error);
      throw error;
    }
  }

  //Handle Dial Pad
  get DialPadPage() {
    return this.page.locator("//div[@class='call-pad in-call']");
  }
  ProspectName (ProspectName) {
    return this.page.locator(`//div[@class='call-pad in-call']//div[@class='ca-name'][normalize-space()='${ProspectName}']`);
  }
  get Timer() {
    return this.page.locator("//div[@class='ca-status']");
  }
  ProspectPhone(ProspectPhone) {
    return this.page.locator(`//div[@class='call-pad in-call']//div[@class='ca-number'][normalize-space()='12345678795']`);
  }
  get Hangup() {
    return this.page.locator("//div[@class='call-icon p-t-10 in-call']//i[@class='fa fa-phone']");
  }
  get DialPadButton () {
    return this.page.locator("//div[@class='m-t-9']//i[@class='fa fa-phone']");
  }
  get EnterPhoneNumber() {
    return this.page.locator("//input[@id='phoneNumberString']");
  }
  get Dialbutton() {
    return this.page.locator("//div[@class='m-t-9']//i[@class='fa fa-phone']");
  }

  async HandleWIODialPad(Calltimeout,ProspectPhone,WIOAction,CompanyName,FirstName,LastName,Email) {
    try {
      await this.scrollIntoView(this.DialPadButton);
      await this.DialPadButton.click();
      await this.scrollIntoView(this.DialPadPage);
      await this.DialPadPage.toBeVisible();
      await this.EnterPhoneNumber.type(ProspectPhone);
      await this.Dialbutton.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'HandleDialPad');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'HandleDialPad');
      expect(await this.ProspectPhone(ProspectPhone).isVisible()).toBeTruthy();
      await this.Timer.waitFor({ state: 'visible', timeout: 10000 });
      expect(await this.Timer.isVisible()).toBeTruthy();
      await this.waitForTimeout({Calltimeout});
      await this.scrollIntoView(this.Hangup);
      await this.Hangup.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'HandleDialPad');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'HandleDialPad');

      //Handle WIO Popup After Hangup
      if(WIOAction) {
        const addupdatecontactPage = new AddupdatecontactPage(this.page);
        if(WIOAction === 'AddContact') {
          await addupdatecontactPage.WIOaddNewContactDirect(ProspectPhone,CompanyName,FirstName,LastName,Email);
        } else if(WIOAction === 'SearchContact') {
          await addupdatecontactPage.WIOsearchContactDirect(ProspectPhone,'phone');
        } else if(WIOAction === 'AutoDispose') {
          await addupdatecontactPage.WIOautoDispose();
        }
      }
      return true;
    }catch (error) {
      console.error(`❌ Error handling dial pad:`, error);
      throw error;
    }
  }

  async HandleOnCallDialPad(ProspectName,Calltimeout,ProspectPhone) {
    try {
        console.log('Handling OnCall dial pad...');
        await this.scrollIntoView(this.DialPadPage);
        await this.DialPadPage.toBeVisible();
        expect(await this.ProspectName(ProspectName).isVisible()).toBeTruthy();
        expect(await this.ProspectPhone(ProspectPhone).isVisible()).toBeTruthy();
        await this.Timer.waitFor({ state: 'visible', timeout: 10000 });
        expect(await this.Timer.isVisible()).toBeTruthy();
        await this.waitForTimeout({Calltimeout});
        await this.scrollIntoView(this.Hangup);
        await this.Hangup.click();
        await ErrorUtil.captureErrorIfPresent(this.page, 'HandleDialPad');
        await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'HandleDialPad');
        console.log('✅ OnCall handling completed');
        return true;
      }
   catch (error) {
      console.error(`❌ Error handling dial pad:`, error);
      throw error;
    }
  }

  // Handle Preview Dialer - Main method for preview calling functionality
  async HandleDialPad(TypeOfCall,ContactName,DialFrom,timeout,ContactPhone) {
    try {
      console.log(`🔄 Handling Preview Dial Pad - TypeOfCall: ${TypeOfCall}, ContactName: ${ContactName}, DialFrom: ${DialFrom}, ContactPhone: ${ContactPhone}`);

      // Wait for dial pad to be visible
      await this.scrollIntoView(this.DialPadPage);
      await this.DialPadPage.toBeVisible();

      // Verify contact information is displayed
      if (ContactName) {
        expect(await this.ProspectName(ContactName).isVisible()).toBeTruthy();
        console.log(`✅ Contact name verified: ${ContactName}`);
      }

      if (ContactPhone) {
        expect(await this.ProspectPhone(ContactPhone).isVisible()).toBeTruthy();
        console.log(`✅ Contact phone verified: ${ContactPhone}`);
      }

      // Wait for timer to appear (indicates call is active)
      await this.Timer.waitFor({ state: 'visible', timeout: 10000 });
      expect(await this.Timer.isVisible()).toBeTruthy();
      console.log('✅ Call timer is active');

      // Wait for the specified timeout duration
      if (timeout) {
        await this.waitForTimeout(timeout);
        console.log(`⏱️ Waited for ${timeout}ms call duration`);
      }

      // End the call
      await this.scrollIntoView(this.Hangup);
      await this.Hangup.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'HandleDialPad');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'HandleDialPad');

      console.log(`✅ Preview dial pad handling completed for ${ContactName} (${ContactPhone})`);
      return true;
    } catch (error) {
      console.error(`❌ Error handling preview dial pad for ${ContactName}:`, error);
      throw error;
    }
  }

  //Handle Dispositions
  get ResultOfthecallScreen() {
    return this.page.locator("//div[@id='callResult']");
  }
  get PositiveDisposition() {
    return this.page.locator("//input[@id='positive']");
  }
  LeadDisposition(DispositionQuestion) {
    return this.page.locator(`//label[.='${DispositionQuestion}']/preceding-sibling::input`);
  }
  get PositiveDetailScreen() {
    return this.page.locator("//div[@convostartdetails='[object Object]']");
  }
  IsBudgetEstablished(BudgetEstablished) {
    return this.page.locator(`//label[normalize-space()='Budget Established']/following-sibling::div//label[contains(.,'${BudgetEstablished}')]/preceding-sibling::input`);
  }

  //Handle Preview Call
  get PreviewCall() {
    return this.page.locator("//button[@id='readyForCallHere']");
  }
  get Phone1() {
    return this.page.locator("//i[@id='phone1Anchor1']");
  }
  get Phone2() {
    return this.page.locator("//i[@id='phone2Anchor1']");
  }
  get Skip() {
    return this.page.locator("//button[@id='skipContactBtn']");
  }
  get RedialButton() {
    return this.page.locator("//button[@id='redialContactBtn']");
  }
  get ContactName() {
    return this.page.locator("//span[@id='contactName']");
  }
  get ContactPhone1() {
    return this.page.locator("//li[@id='contactPhone1Uv']");
  }
  get ContactPhone2() {
    return this.page.locator("//li[@id='contactPhone2Uv']");
  }
  get EditContact() {
    return this.page.locator("//i[@id='contactPencil']");
  }
  get StopDialer() {
    return this.page.locator("//button[@id='stopDialerBtn']");
  }
  async HandlePreviewCall(CallType,Skip,Phone1,Phone2,DialFrom,Redial,TypeOfCall,ContactName,ContactPhone1,ContactPhone2,timeout) {
    try {
      await this.scrollIntoView(this.PreviewCall);
      await this.PreviewCall.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'HandlePreviewCall');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'HandlePreviewCall');
      await this.page.waitForLoadState('networkidle');
      if (CallType === 'OnCall') {
        if (DialFrom === 'Phone1' || DialFrom.includes('Phone1')) {
          console.log(`Making call from Phone 1: ${Phone1}`);
          await this.scrollIntoView(this.Phone1);
          await this.Phone1.click();
          await ErrorUtil.captureErrorIfPresent(this.page, 'HandlePreviewCall');
          await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'HandlePreviewCall');
          await this.HandleDialPad(TypeOfCall,ContactName,DialFrom,timeout,ContactPhone1);
          if (Redial === 'Yes') {
            await this.scrollIntoView(this.RedialButton);
            await this.RedialButton.click();
            await ErrorUtil.captureErrorIfPresent(this.page, 'HandlePreviewCall');
            await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'HandlePreviewCall');
            await this.HandleDialPad(TypeOfCall,ContactName,DialFrom,timeout,ContactPhone2);
          }
        } else if (DialFrom === 'Phone2' || DialFrom.includes('Phone2')) {
          console.log(`Making call from Phone 2: ${Phone2}`);
          await this.scrollIntoView(this.Phone2);
          await this.Phone2.click();
          await ErrorUtil.captureErrorIfPresent(this.page, 'HandlePreviewCall');
          await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'HandlePreviewCall');
          await this.HandleDialPad(TypeOfCall,ContactName,DialFrom,timeout,ContactPhone2);
          if (Redial === 'Yes') {
            await this.scrollIntoView(this.RedialButton);
            await this.RedialButton.click();
            await ErrorUtil.captureErrorIfPresent(this.page, 'HandlePreviewCall');
            await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'HandlePreviewCall');
            await this.HandleDialPad(TypeOfCall,ContactName,DialFrom,timeout,ContactPhone2);
          }
        }
      } else if (Skip === 'Yes') {
        await this.scrollIntoView(this.Skip);
        await this.Skip.click();
        await ErrorUtil.captureErrorIfPresent(this.page, 'HandlePreviewCall');
        await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'HandlePreviewCall');
      }
      return true;
    } catch (error) {
      console.error(`❌ Error handling preview call:`, error);
      throw error;
    }
  }

  //Go to Batch
  get BatchMode() {
    return this.page.locator("//button[@class='btn btn-primary m-l-5']");
  }
  async GoToBatch() {
    try {
      await this.scrollIntoView(this.BatchMode);
      await this.BatchMode.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'GoToBatch');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'GoToBatch');
      return true;
    } catch (error) {
      console.error(`❌ Error going to batch:`, error);
      throw error;
    }
  }

  //Perform Action According to the Assignment Type
  async PerformAction(CampaignName,AssignmentType,ProviderName,DialMode) {
    try {
      if (AssignmentType === 'Auto-Preview') {
        await this.MakeAgentReady(ProviderName);
        await this.clickOnCampaignName(CampaignName);
        if (DialMode === 'Preview') {
          
          return true;
        }else if (DialMode === 'Auto-Preview') {
          console.log('No need to perform any action for Auto-Preview');
          return true;
        }
        return true;
      }else if (AssignmentType ==='Callers') {
        await this.MakeAgentReady(ProviderName);
        await this.CallCampaign(CampaignName);
        return true;
      }
    } catch (error) {
      console.error(`❌ Error performing action:`, error);
      throw error;
    }
  }
}

module.exports = CampaignCallingPage;
