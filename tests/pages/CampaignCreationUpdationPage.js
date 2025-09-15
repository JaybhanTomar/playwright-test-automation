const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');
const ErrorUtil = require('../utils/ErrorUtil');
const TablePaginationHandler = require('../utils/TablePaginationHandler');
const DatePicker = require('../utils/DatePicker');

class CampaignCreationUpdationPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.CampaignButton = page.locator("(//a[@href='#'])[2]");
    this.ActiveCampaignButton = page.locator("(//a[@id='modifyCampaign'])[1]");
    this.ArchiveCampaignButton = page.locator("//a[@id='viewArcCampaign']");
    this.DemanCampButton = page.locator("//div[@id='campDemand']");
    this.DemandCampPage = page.locator("//table[@id='demandTable']");
    this.CreateNewCampaignButton = page.locator("//label[normalize-space()='Create New Campaign']");
    this.CampaignName = page.locator("//input[@id='campaignName']");
    this.CampaignDescription = page.locator("//textarea[@id='campDescription']");
    this.CampaignTalkingPoint = page.locator("//textarea[@id='sciptID']");
    this.CampaingStartDate = page.locator("//input[@id='dispStartDate']");
    this.AccountManager = page.locator("//select[@id='accountManagerID']");
    this.CampaignType = page.locator("//select[@id='campaignType']");
    this.Direction = page.locator("//select[@id='direction']");
    this.DefaultCampaign = page.locator("(//span[@class='ui-checkmark'])[2]");
    this.AssignmentType = page.locator("//select[@id='assignmentType']");
    this.DialMode = page.locator("//select[@id='dialMode']");
    this.Campaignlenght = page.locator("//input[@id='campaignLength']");
    this.MaxCalls = page.locator("//select[@id='maxCalls']");
    this.AllowLongRunningCamp = page.locator("//label[normalize-space()='Allow long running campaign']//span[@class='ui-checkmark']");
    this.CallBackAssignto = page.locator("//select[@id='callBackBy']");
    this.leadAssignto = page.locator("//select[@id='leadAssignedTo']");
    this.EnableEmailNotification = page.locator("(//span[@class='ui-checkmark'])[4]");
    this.FromEmail = page.locator("//input[@id='defaultEmailDesc']");
    this.CCEmail = page.locator("//input[@id='ccEmailNotificationDesc']");
    this.BCCEmail = page.locator("//input[@id='bccEmailNotificationDesc']");
    this.SubmitButton = page.locator("//button[@id='campaignLimit']");

    //Assignment List page locator
    this.AssignmentListPage = page.locator("//table[@class='table table-striped table-display table-bordered m-b-0']");
    this.SkipList = page.locator("//button[normalize-space()='Skip List']");
    this.AddListButton = page.locator("//button[normalize-space()='Add List']");

    //Assign Caller page locator
    this.ListName = page.locator("//input[@id='listName']");
    this.getDistributionMethodInput = (distributionMethod) =>
      page.locator(`//div[@class='col-xs-12 col-sm-12 col-lg-11']//ul[@class='ul-li']//li[contains(.,'${distributionMethod}')]/label//input`);
    this.fieldtype = page.locator("//select[@id='selectFieldName']");
    this.fieldname = page.locator("//select[@id='selectCompanyFieldName']");
    this.selectRange = page.locator("//select[@id='selectRange']");
    this.listDistrubution = page.locator("//li[@class='col-xs-12 col-sm-12 col-lg-12 p-0']//div");
    this.AssignCallers = page.locator("//select[@id='callBackBy']");
    this.AssignedList = page.locator("//button[normalize-space()='Assign']");

    //Dialer Settings page locator
    this.DialerSettings = page.locator("//div[@id='previewDialerSetting']//div[@class='box-body p-10']");
    this.CallerIds = page.locator("//select[@id='selectCallerId']");
    this.OtherCallerIds = page.locator("//input[@id='showOtherCallerID']");
    this.ContactReAttempt = page.locator("//select[@id='contactReAttemptTime']");
    this.MaxRedialsPerDay = page.locator("//input[@id='maxRedial']");
    this.PreviewTime = page.locator("//input[@id='previewTime']");
    this.PreviewTimeExpiration = page.locator("//select[@id='previewTimeExpiration']");
    this.VoiceMessageFile = page.locator("//select[@id='VoiceMessageFile']");
    this.OrderBy = page.locator("//select[@id='orderBy']");
    this.CallbackReAttempt = page.locator("//select[@id='callBackReAttemptTime']");
    this.EnableAgentCallRecording = page.locator("(//span[@class='ui-checkmark m-t-2'])[1]");
    this.EnabletwoPartyConsent = page.locator("(//span[@class='ui-checkmark m-t-2'])[2]");
    this.ACWTime = page.locator("//input[@id='acwTime']");
    this.ACWTimeExpiration = page.locator("//select[@id='ACWTimeExpiration']");
    this.SaveDialerSettings = page.locator("//button[@id='deSetting']");

    //Campaign Update page locator
    this.ModifyCampaignPage = page.locator("(//div[@class='col-xs-12 col-sm-12 col-lg-12'])[2]");
    this.Campaignsettings = page.locator("//button[@id='btnChangeCampSettings']");
    this.AssignedCallers = page.locator("//div[@class='col-xs-12 col-sm-12 col-lg-4 p-0']//ul");
    this.PullAppendedProspects = page.locator("//button[@id='btnPullAppend']");
    this.ChangeAssignments = page.locator("//button[@id='btnchangeAssignment']");
    this.ChangeProspectList = page.locator("//button[@id='btnChangeProspect']");
    this.CustomFields = page.locator("//div[@id='customFields']");
    this.EmailTemplates = page.locator("//div[@id='emailTemplates']");
    this.Documents = page.locator("//div[@id='documents']");
    this.CallDispositions = page.locator("//div[@id='callDisposition']");
    this.LeadProcessFields = page.locator("//div[@id='processFields']");

    // Initialize DatePicker utility
    this.datePickerUtil = new DatePicker(page);
  }

  async navigateToActiveCampaign() {
    try {
      console.log('Navigating to Active Campaign...');
      await this.scrollIntoView(this.CampaignButton);
      await this.safeClick(this.CampaignButton);
      await ErrorUtil.captureErrorIfPresent(this.page, 'navigateToActiveCampaign - click CampaignButton');
      await this.scrollIntoView(this.ActiveCampaignButton);
      await this.safeClick(this.ActiveCampaignButton);
      await ErrorUtil.captureErrorIfPresent(this.page, 'navigateToActiveCampaign - click ActiveCampaignButton');
      await expect(this.DemandCampPage).toBeVisible({ timeout: 10000 });
      console.log('✅ DemandCampPage is visible');
      if (!this.DemandCampPage.isVisible()) {
        console.log('❌ DemandCampPage is not visible trying to click on DemandCampButton.....');
        await this.safeClick(this.DemanCampButton);
        await expect(this.DemandCampPage).toBeVisible({ timeout: 10000 });
        console.log('✅ DemandCampPage is visible');
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('❌ Error navigating to import:', error.message);
      throw error;
    }
  }

  //Verify Existing Campaign - Enhanced with case-insensitive matching
  async verifyExistingCampaign(CampaignName) {
    try {
      console.log(`🔍 Verifying existing campaign: ${CampaignName}`);
      const trimmedCampaignName = CampaignName.trim();
      const rowLocator = this.page.locator("//table[@id='demandTable']//tbody//tr");
      const nextBtnLocator = this.page.locator("//button[normalize-space(text())='>']");
      const prevBtnLocator = this.page.locator("//button[normalize-space(text())='<']");
      let pageIndex = 1;
      let campaignFound = false;
      let matchType = '';
      let foundCampaignName = '';

      while (true) {
        const rows = await rowLocator.count();
        for (let i = 0; i < rows; i++) {
          const cell = rowLocator.nth(i).locator('td').nth(0); // Campaign Name column
          const text = (await cell.textContent())?.trim();

          if (text) {
            // Method 1: Exact match
            if (text === trimmedCampaignName) {
              console.log(`✅ Campaign found (exact match) on page ${pageIndex}: ${text}`);
              campaignFound = true;
              matchType = 'exact match';
              foundCampaignName = text;
              break;
            }

            // Method 2: Case-insensitive match
            if (text.toLowerCase() === trimmedCampaignName.toLowerCase()) {
              console.log(`✅ Campaign found (case-insensitive match) on page ${pageIndex}: ${text}`);
              campaignFound = true;
              matchType = 'case-insensitive match';
              foundCampaignName = text;
              break;
            }

            // Method 3: Space variation match
            const normalizedText = text.replace(/\s+/g, ' ');
            const normalizedCampaignName = trimmedCampaignName.replace(/\s+/g, ' ');
            if (normalizedText.toLowerCase() === normalizedCampaignName.toLowerCase()) {
              console.log(`✅ Campaign found (space variation match) on page ${pageIndex}: ${text}`);
              campaignFound = true;
              matchType = 'space variation match';
              foundCampaignName = text;
              break;
            }

            // Method 4: Contains match (original behavior as fallback)
            if (text.toLowerCase().includes(trimmedCampaignName.toLowerCase())) {
              console.log(`✅ Campaign found (contains match) on page ${pageIndex}: ${text}`);
              campaignFound = true;
              matchType = 'contains match';
              foundCampaignName = text;
              break;
            }
          }
        }

        if (campaignFound) break;

        // Try to go to next page if "Next" is enabled and visible
        if (await nextBtnLocator.isVisible() && await nextBtnLocator.isEnabled()) {
          await nextBtnLocator.click();
          await this.page.waitForLoadState('networkidle');
          pageIndex++;
        } else {
          break;
        }
      }

      if (!campaignFound) {
        console.log(`❌ Campaign not found: ${CampaignName}. Resetting to first page...`);
        let resetAttempts = 0;
        while (await prevBtnLocator.isVisible() && await prevBtnLocator.isEnabled() && resetAttempts < 10) {
          await prevBtnLocator.click();
          await this.page.waitForLoadState('networkidle');
          resetAttempts++;
        }
      } else {
        console.log(`📋 Campaign verification result: "${foundCampaignName}" (${matchType})`);
      }

      return campaignFound;
    } catch (error) {
      console.error(`❌ Error verifying campaign "${CampaignName}":`, error);
      throw error;
    }
  }

  //Create New Campaign if not exists
  async createNewCampaign(
    CampaignName, CampaignDescription, CampaignTalkingPoint, CampaignStartDate, AccountManager,
    CampaignType, Direction, DefaultCampaign, AssignmentType, DialMode, Campaignlenght, MaxCalls, AllowLongRunningCamp,
    CallBackAssignto, leadAssignto, EnableEmailNotification, FromEmail, CCEmail, BCCEmail,
    SkipList, ListName, CampaignSkills,
    DistributionMethod, AssignCallers, Fieldtype, Fieldname, SelectRange, firstValues, lastValues, callerLists,
    CallerIds, OtherCallerIds, ContactReAttempt, MaxRedialsPerDay,
    PreviewTime, PreviewTimeExpiration, VoiceMessageFile, OrderBy, CallbackReAttempt,
    EnableAgentCallRecording, EnabletwoPartyConsent, ACWTime, ACWTimeExpiration
  ) {
    try {
      // Check if campaign already exists
      const exists = await this.verifyExistingCampaign(CampaignName);
      if (exists) {
        console.log(`⏩ Campaign already exists: ${CampaignName}. Skipping creation.`);
        return false;
      }
      console.log(`Creating new campaign: ${CampaignName}`);
      await this.scrollIntoView(this.CreateNewCampaignButton);
      await this.safeClick(this.CreateNewCampaignButton);
      await this.safeType(this.CampaignName, CampaignName);
      if(CampaignDescription) await this.safeType(this.CampaignDescription, CampaignDescription);
      if(CampaignTalkingPoint) await this.safeType(this.CampaignTalkingPoint, CampaignTalkingPoint);
      // Use DatePicker utility for start date selection
      await this.datePickerUtil.selectDateByISO(this.CampaingStartDate, '.flatpickr-days', CampaignStartDate);
      // Click on the div directly to trigger blur/change event if needed
      await this.page.locator("(//div[@class='col-xs-12 col-sm-12 col-lg-12 p-0'])[2]").click({ force: true });
      if (AccountManager) await this.selectOption(this.AccountManager, AccountManager);
      if (CampaignType) await this.selectOption(this.CampaignType, CampaignType);
      if (Direction) await this.selectOption(this.Direction, Direction);
      if (DefaultCampaign === 'Yes') {
        await this.scrollIntoView(this.DefaultCampaign);
        await this.safeClick(this.DefaultCampaign);
      }
      if (AssignmentType) await this.selectOption(this.AssignmentType, AssignmentType);
      if (DialMode) await this.selectOption(this.DialMode, DialMode);
      if(Campaignlenght) await this.safeType(this.Campaignlenght, Campaignlenght);
      if(MaxCalls) await this.safeType(this.MaxCalls, MaxCalls);
      if (AllowLongRunningCamp === 'Yes') {
        await this.scrollIntoView(this.AllowLongRunningCamp);
        await this.safeClick(this.AllowLongRunningCamp);
      }
      if (CallBackAssignto) await this.selectOption(this.CallBackAssignto, CallBackAssignto);
      if (leadAssignto) await this.selectOption(this.leadAssignto, leadAssignto);
      if (EnableEmailNotification === 'Yes') {
        await this.scrollIntoView(this.EnableEmailNotification);
        await this.safeClick(this.EnableEmailNotification);
        if(FromEmail) await this.safeType(this.FromEmail, FromEmail);
        if(CCEmail) await this.safeType(this.CCEmail, CCEmail);
        if(BCCEmail) await this.safeType(this.BCCEmail, BCCEmail);
      }
      await this.scrollIntoView(this.SubmitButton);
      await this.safeClick(this.SubmitButton);
      await ErrorUtil.captureErrorIfPresent(this.page, 'createNewCampaign - submit');
      await expect(this.AssignmentListPage).toBeVisible({ timeout: 10000 });
      console.log(`✅ Campaign created: ${CampaignName}`);
      await this.assignListToCampaign(SkipList, ListName);
      if (AssignmentType === 'Skills') {
        await this.assignSkillToCampaign(CampaignSkills);
        console.log('✅ Skills assigned to campaign');
        return true;
      }
      await this.assignCallersToCampaign(
        DistributionMethod, AssignCallers, Fieldtype, Fieldname, SelectRange, firstValues, lastValues, callerLists,
        CampaignName, CallerIds, OtherCallerIds, ContactReAttempt, MaxRedialsPerDay,
        PreviewTime, PreviewTimeExpiration, VoiceMessageFile, OrderBy, CallbackReAttempt,
        EnableAgentCallRecording, EnabletwoPartyConsent, ACWTime, ACWTimeExpiration, DialMode
      );
      return true;
    } catch (error) {
      console.error('❌ Error creating campaign:', error.message);
      throw error;
    }
  }

  //Assign List to Campaign
  async assignListToCampaign(SkipList,ListName) {
    try {
      if(SkipList==='Yes'){
        await this.scrollIntoView(this.SkipList);
        await this.safeClick(this.SkipList);
        await ErrorUtil.captureErrorIfPresent(this.page, 'assignListToCampaign - click SkipList');
      }
      await expect(this.AssignmentListPage).toBeVisible({ timeout: 10000 });
      console.log(`Assigning list to campaign: ${ListName}`);
      console.log('✅ Assignment List page is visible');

      // Locators for table rows
      const rowLocator = this.page.locator("//table[@class='table table-striped table-display table-bordered m-b-0']//tbody//tr");
      // Use TablePaginationHandler utility to get default SVG-based pagination controls
      const { nextBtnLocator, prevBtnLocator } = TablePaginationHandler.getDefaultPaginationLocators(this.page);

      // Find the row with the ListName in the first column (adjust cellIndex if needed)
      const foundRow = await TablePaginationHandler.findRowWithCellValue({
        page: this.page,
        rowLocator,
        cellIndex: 0,
        expectedValue: ListName,
        nextBtnLocator,
        prevBtnLocator
      });

      if (foundRow) {
        // Click the radio button in the same row (assume it's in the first cell, adjust if needed)
        const radioBtn = await foundRow.locator('input[type="radio"]');
        await radioBtn.click();
        console.log(`✅ Selected list: ${ListName}`);
        await this.scrollIntoView(this.AddListButton);
        await this.safeClick(this.AddListButton);
        await ErrorUtil.captureErrorIfPresent(this.page, 'assignListToCampaign - add list to campaign');
        // Optionally, check for a unique confirmation element or message here
        console.log(`✅ List added to campaign: ${ListName}`);
        return true;
      } else {
        console.error(`❌ List not found: ${ListName}`);
        throw new Error(`List not found: ${ListName}`);
      }
    } catch (error) {
      console.error('❌ Error assigning list to campaign:', error.message);
      throw error;
    }
  }

  //Assign Callers
  async assignCallersToCampaign(DistributionMethod, AssignCallers, Fieldtype, Fieldname, SelectRange, firstValues, lastValues, callerLists, CampaignName, CallerIds, OtherCallerIds, ContactReAttempt, MaxRedialsPerDay,
    PreviewTime, PreviewTimeExpiration, VoiceMessageFile, OrderBy, CallbackReAttempt,
    EnableAgentCallRecording, EnabletwoPartyConsent, ACWTime, ACWTimeExpiration, DialMode) {
    try {
      console.log('[assignCallersToCampaign] ENTRY', { DistributionMethod, AssignCallers, Fieldtype, Fieldname, SelectRange, firstValues, lastValues, callerLists, CampaignName });
      console.log('Assigning callers to campaign Distribution Method: ' + DistributionMethod);
      await this.scrollIntoView(this.getDistributionMethodInput(DistributionMethod));
      await this.safeClick(this.getDistributionMethodInput(DistributionMethod));
      await ErrorUtil.captureErrorIfPresent(this.page, 'assignCallersToCampaign - click distribution method');
      if ((DistributionMethod === 'import sequence') || (DistributionMethod === 'random order')) {
        await this.scrollIntoView(this.AssignCallers);
        // Support multiple users from comma-separated string
        const assignCallersArray = AssignCallers.split(',').map(s => s.trim());
        if (assignCallersArray.length > 0) {
          await this.AssignCallers.selectOption(assignCallersArray.map(label => ({ label })));
          console.log(`✅ Selected callers: ${assignCallersArray.join(', ')}`);
        }
      }
      if(DistributionMethod === 'Field Name'){
        await this.selectOption(this.fieldtype, Fieldtype);
        await this.selectOption(this.fieldname, Fieldname);
        await this.selectOption(this.selectRange, SelectRange);
        // Wait for listDistrubution options to update after changing range
        const groupRowLocator = this.page.locator("li.col-xs-12.col-sm-12.col-lg-12.p-0 > div");
        await this.page.waitForFunction(
          (selector, expectedCount) => document.querySelectorAll(selector).length === expectedCount,
          ["li.col-xs-12.col-sm-12.col-lg-12.p-0 > div", Number(SelectRange)]
        );
        // Parse comma-separated values for firstValues, lastValues, callerLists
        const firstValuesArr = typeof firstValues === 'string' ? firstValues.split(',').map(s => s.trim()) : firstValues;
        const lastValuesArr = typeof lastValues === 'string' ? lastValues.split(',').map(s => s.trim()) : lastValues;
        const callerListsArr = typeof callerLists === 'string' ? callerLists.split(',').map(s => s.trim()) : callerLists;
        // Fill first value, last value, and callerList for each group
        for (let i = 0; i < Number(SelectRange); i++) {
          const row = groupRowLocator.nth(i);
          await row.locator('input').nth(0).fill(firstValuesArr[i]); // first value
          await row.locator('input').nth(1).fill(lastValuesArr[i]);  // last value
          await row.locator('select').selectOption(callerListsArr[i]); // callerList
        }
      }
      console.log('[assignCallersToCampaign] Before AssignedList click');
      await this.scrollIntoView(this.AssignedList);
      await this.safeClick(this.AssignedList);
      await ErrorUtil.captureErrorIfPresent(this.page, 'assignCallersToCampaign - click AssignedList');
      console.log('[assignCallersToCampaign] After AssignedList click, before campaign check');
      if (DialMode && DialMode.includes('Auto-Preview')){
        await this.SetupDialerSettings(CallerIds, OtherCallerIds, ContactReAttempt, MaxRedialsPerDay,
    PreviewTime, PreviewTimeExpiration, VoiceMessageFile, OrderBy, CallbackReAttempt,
    EnableAgentCallRecording, EnabletwoPartyConsent, ACWTime, ACWTimeExpiration);
        console.log('✅ Dialer settings saved successfully');
      }
      if (CampaignName) {
        const exists = await this.verifyExistingCampaign(CampaignName);
        if (exists) {
          console.log(`⏩ Campaign is already exists: ${CampaignName}`);
          return false;
        }
      }
      console.log('[assignCallersToCampaign] After campaign existence check');
    } catch (error) {
      console.error('❌ Error assigning callers to campaign:', error.message);
      throw error;
    }
  }

  //Assign Skills to Campaign (supports comma-separated skills)
  async assignSkillToCampaign(CampaignSkills) {
    try {
      // Handle both single skill and comma-separated skills
      const skillList = CampaignSkills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);

      if (skillList.length === 0) {
        console.log('⚠️ No skills provided to assign');
        return true;
      }

      console.log(`Assigning ${skillList.length} skill(s) to campaign: ${skillList.join(', ')}`);
      // Process each skill using checkbox selection
      for (let i = 0; i < skillList.length; i++) {  
        const CampaignSkills = skillList[i];
        console.log(`\n📄 Processing skill ${i + 1}/${skillList.length}: ${CampaignSkills}`);

        // Create dynamic locator for the specific skill checkbox
        const skillCheckboxLocator = this.page.locator(`//label[normalize-space()='${CampaignSkills}']//span[@class='ui-checkmark']`);

        try {
          // Wait for the skill checkbox to be visible
          await skillCheckboxLocator.waitFor({ state: 'visible', timeout: 10000 });

          // Scroll to and click the skill checkbox
          await skillCheckboxLocator.scrollIntoViewIfNeeded();
          await skillCheckboxLocator.click();

          await ErrorUtil.captureErrorIfPresent(this.page, `assignSkillToCampaign - select skill ${CampaignSkills}`);
          console.log(`✅ Skill "${CampaignSkills}" checkbox selected`);

        } catch (error) {
          console.error(`❌ Could not find or select skill "${CampaignSkills}". Error: ${error.message}`);
          // Continue with next skill instead of failing completely
          continue;
        }

        // Small delay between skills to ensure proper processing
        if (i < skillList.length - 1) {
          await this.page.waitForTimeout(500);
        }
      }

      // After selecting all skills, click the Add/Assign button if it exists
      try {
        await this.scrollIntoView(this.AssignedList);
        await this.safeClick(this.AssignedList);
        await ErrorUtil.captureErrorIfPresent(this.page, 'assignSkillToCampaign - add selected skills to campaign');
        console.log('✅ Selected skills added to campaign');
      } catch (error) {
        console.log('ℹ️ No Add button found or skills auto-assigned on selection');
      }

      console.log(`🎉 Successfully assigned all ${skillList.length} skill(s) to campaign`);
      return true;
    } catch (error) {
      console.error('❌ Error assigning skills to campaign:', error.message);
      throw error;
    }
  }

  //Helper to get the row locator for a campaign
  async getCampaignRow(CampaignName) {
    const rowLocator = this.page.locator("//table[@id='demandTable']//tbody//tr");
    const rows = await rowLocator.count();
    for (let i = 0; i < rows; i++) {
      const cell = rowLocator.nth(i).locator('td').nth(0);
      const text = (await cell.textContent())?.trim();
      if (text && text.includes(CampaignName)) {
        return rowLocator.nth(i);
      }
    }
    return null;
  }

  //Dialer Settings
  async SetupDialerSettings(CallerIds, OtherCallerIds, ContactReAttempt, MaxRedialsPerDay,
    PreviewTime, PreviewTimeExpiration, VoiceMessageFile, OrderBy, CallbackReAttempt,
    EnableAgentCallRecording, EnabletwoPartyConsent, ACWTime, ACWTimeExpiration) {
    try {
        if (CallerIds) await this.selectOption(this.CallerIds, CallerIds);
        if (CallerIds === 'Other') {
          await this.scrollIntoView(this.OtherCallerIds);
          await this.safeType(this.OtherCallerIds, OtherCallerIds);
        }
        await this.selectOption(this.ContactReAttempt, ContactReAttempt);
        await this.safeType(this.MaxRedialsPerDay, MaxRedialsPerDay);
        await this.safeType(this.PreviewTime, PreviewTime);
        await this.selectOption(this.PreviewTimeExpiration, PreviewTimeExpiration);
        if (VoiceMessageFile) await this.selectOption(this.VoiceMessageFile, VoiceMessageFile);
        if (OrderBy) await this.selectOption(this.OrderBy, OrderBy);
        await this.selectOption(this.CallbackReAttempt, CallbackReAttempt);
        if (EnableAgentCallRecording === 'Yes') {
          await this.scrollIntoView(this.EnableAgentCallRecording);
          await this.safeClick(this.EnableAgentCallRecording);
        }
        if (EnabletwoPartyConsent === 'Yes') {
          await this.scrollIntoView(this.EnabletwoPartyConsent);
          await this.safeClick(this.EnabletwoPartyConsent);
        }
        await this.safeType(this.ACWTime, ACWTime);
        await this.selectOption(this.ACWTimeExpiration, ACWTimeExpiration);
        await this.scrollIntoView(this.SaveDialerSettings);
        await this.safeClick(this.SaveDialerSettings);
        await ErrorUtil.captureErrorIfPresent(this.page, 'SetupDialerSettings - save');
        await this.page.locator('#pageMessages').waitFor({ state: 'hidden', timeout: 10000 });
        await expect(this.ModifyCampaignPage).toBeVisible({ timeout: 10000 });
        console.log('✅ Dialer settings saved successfully');
      }
    catch (error) {
      console.error('❌ Error setting up dialer settings:', error.message);
      throw error;
    }
  }


  //Navigate to Modify Campaign Page
  async navigateToModifyCampaignPage(CampaignName) {
    try {
      console.log(`Navigating to modify campaign page for: ${CampaignName}`);
      const row = await this.getCampaignRow(CampaignName);
      if (row) {
        // The edit button is the blue one, usually last column, find by icon or button
        const editBtn = row.locator('td').last().locator("//a//i[@id='edit']");
        await this.scrollIntoView(editBtn);
        await editBtn.click();
        await ErrorUtil.captureErrorIfPresent(this.page, 'navigateToModifyCampaignPage - click edit');
      } else {
        throw new Error(`Campaign row not found for: ${CampaignName}`);
      }
      await expect(this.ModifyCampaignPage).toBeVisible({ timeout: 10000 });      
      console.log(`✅ Modify Campaign page is visible for: ${CampaignName}`);
      return true;
    } catch (error) {
      console.error('❌ Error navigating to modify campaign page:', error.message);
      throw error;
    }
  }

  //Modify Campaign
  async modifyCampaign(CampaignName, CampaignDescription, CampaignTalkingPoint, CampaignStartDate, AccountManager,
    CampaignType, Direction, DefaultCampaign, AssignmentType, DialMode, Campaignlenght, MaxCalls, AllowLongRunningCamp,
    CallBackAssignto, leadAssignto, EnableEmailNotification, FromEmail, CCEmail, BCCEmail,
    CampaignSetting, PullAppended, ChangeAssignments, ChangeProspectList, CustomField, CustomFieldName,
    EmailTemplates, Documents, CallDisposition, LeadProcessFields) {
    try {
      console.log(`Modifying campaign: ${CampaignName}`);
      await this.navigateToModifyCampaignPage(CampaignName);
      if(CampaignSetting==='Yes'){
        await this.ChangeCampaignSettings(CampaignName, CampaignDescription, CampaignTalkingPoint, CampaignStartDate, AccountManager,
          CampaignType, Direction, DefaultCampaign, AssignmentType, DialMode, Campaignlenght, MaxCalls, AllowLongRunningCamp,
          CallBackAssignto, leadAssignto, EnableEmailNotification, FromEmail, CCEmail, BCCEmail);
      }
      if(PullAppended==='Yes'){
        await this.scrollIntoView(this.PullAppendedProspects);
        await this.safeClick(this.PullAppendedProspects);
        await ErrorUtil.captureErrorIfPresent(this.page, 'modifyCampaign - click PullAppendedProspects');
      }
      if(ChangeAssignments==='Yes'){
        await this.scrollIntoView(this.ChangeAssignments);
        await this.safeClick(this.ChangeAssignments);
        await ErrorUtil.captureErrorIfPresent(this.page, 'modifyCampaign - click ChangeAssignments');
      }
      if(ChangeProspectList==='Yes'){
        await this.scrollIntoView(this.ChangeProspectList);
        await this.safeClick(this.ChangeProspectList);
        await ErrorUtil.captureErrorIfPresent(this.page, 'modifyCampaign - click ChangeProspectList');
      }
      // Custom Field selection logic
      if (CustomField === 'Yes') {
        let customFieldsArray = [];
        if (typeof CustomFieldName === 'string') {
          customFieldsArray = CustomFieldName.split(',').map(s => s.trim()).filter(Boolean);
        }
        if (!customFieldsArray.length) {
          throw new Error('CustomFieldName is empty or not provided.');
        }
        await this.scrollIntoView(this.CustomFields);
        await this.safeClick(this.CustomFields);
        const Edit = this.page.locator("//button[@id='btnEditCustomFields']");
        await expect(Edit).toBeVisible({ timeout: 10000 });
        await this.safeClick(Edit);
        const tableLocator = this.page.locator("//div[@id='listCustomField']//tbody//tr");
        const rows = await tableLocator.count();
        if (rows === 0) {
          throw new Error('No custom field rows found.');
        }
        let foundAny = false;
        for (let i = 0; i < rows; i++) {
          const row = tableLocator.nth(i);
          const fieldNameCell = row.locator('td').nth(4); // 5th column
          const fieldName = (await fieldNameCell.textContent())?.trim();
          if (fieldName && customFieldsArray.includes(fieldName)) {
            // Try to find the checkbox input inside the first cell (td)
            const checkboxInput = row.locator('td').nth(0).locator('input[type="checkbox"]');
            if (await checkboxInput.count() > 0) {
              const isChecked = await checkboxInput.isChecked();
              if (!isChecked) {
                await checkboxInput.check({ force: true });
                foundAny = true;
              } else {
                foundAny = true;
              }
            } else {
              // Fallback: try clicking the span if input is not found
              const checkboxSpan = row.locator('span.ui-checkmark');
              const isSelected = await checkboxSpan.evaluate(el => el.classList.contains('ui-state-active'));
              if (!isSelected) {
                await checkboxSpan.click({ force: true });
                foundAny = true;
              } else {
                foundAny = true;
              }
            }
          }
        }
        if (!foundAny) {
          throw new Error('No matching custom field checkboxes were found or checked.');
        }
        await this.safeClick(this.page.locator("//button[@id='btnSaveCustomField']"));
        await this.page.locator('#pageMessages').waitFor({ state: 'hidden', timeout: 10000 });
      }
      if(EmailTemplates==='Yes'){
        const EditTemp = this.page.locator("(//button[@type='submit'][normalize-space()='Edit'])[2]")
        await this.scrollIntoView(this.EmailTemplates);
        await this.safeClick(this.EmailTemplates);
        await ErrorUtil.captureErrorIfPresent(this.page, 'modifyCampaign - click EmailTemplates');
        await expect(EditTemp).toBeVisible({ timeout: 10000 });
        await this.safeClick(EditTemp);
        await ErrorUtil.captureErrorIfPresent(this.page, 'modifyCampaign - click EditTemp');
        // Handle multiple custom fields (comma-separated)
        if(TemplateName===null||TemplateName===undefined||TemplateName===""){
          console.log('Custom Field Name is null or undefined or empty');
      }   
      const TemplateNameArray = TemplateName.split(',').map(s => s.trim());
        const rowLocator = this.page.locator("//div[@id='addEmailTemplates']//tbody//tr");
        const rows = await rowLocator.count();
        for (let i = 0; i < rows; i++) {
          const cell = rowLocator.nth(i).locator("//tbody//span[@class='ui-checkmark']");
          const text = (await cell.textContent())?.trim();
          if (text && TemplateNameArray.includes(text)) {
            const checkbox = rowLocator.nth(i).locator('input[type="checkbox"]');
            if (!(await checkbox.isChecked())) {
              await checkbox.check();
              console.log(`✅ Checked custom field: ${text}`);
            }
          }
        }
      }
      if(Documents==='Yes'){
        await this.scrollIntoView(this.Documents);
        await this.safeClick(this.Documents);
        await ErrorUtil.captureErrorIfPresent(this.page, 'modifyCampaign - click Documents');
      }
      if(CallDisposition==='Yes'){
        await this.scrollIntoView(this.CallDispositions);
        await this.safeClick(this.CallDispositions);
        await ErrorUtil.captureErrorIfPresent(this.page, 'modifyCampaign - click CallDisposition');
      }
      if(LeadProcessFields==='Yes'){
        await this.scrollIntoView(this.LeadProcessFields);
        await this.safeClick(this.LeadProcessFields);
        await ErrorUtil.captureErrorIfPresent(this.page, 'modifyCampaign - click LeadProcessFields');
      }
      return true;
    } catch (error) {
      console.error('❌ Error modifying campaign:', error.message);
      throw error;
    }
  }

  //Change Campaign Settings
  async ChangeCampaignSettings(CampaignName, CampaignDescription, CampaignTalkingPoint, CampaignStartDate, AccountManager,
    CampaignType, Direction, DefaultCampaign, AssignmentType, DialMode, Campaignlenght, MaxCalls, AllowLongRunningCamp,
    CallBackAssignto, leadAssignto, EnableEmailNotification, FromEmail, CCEmail, BCCEmail) {
    try {
      console.log(`Updating campaign: ${CampaignName}`);
      await this.scrollIntoView(this.ModifyCampaignPage);
      await this.safeClick(this.ModifyCampaignPage);
      await ErrorUtil.captureErrorIfPresent(this.page, 'ChangeCampaignSettings - click ModifyCampaignPage');
      if(CampaignDescription) await this.safeType(this.CampaignDescription, CampaignDescription);
      if(CampaignTalkingPoint) await this.safeType(this.CampaignTalkingPoint, CampaignTalkingPoint);
      // Use DatePicker utility for start date selection
      await this.datePickerUtil.selectDateByISO(this.CampaingStartDate, '.flatpickr-days', CampaignStartDate);
      // Click on the div directly to trigger blur/change event if needed
      await this.page.locator("(//div[@class='col-xs-12 col-sm-12 col-lg-12 p-0'])[2]").click({ force: true });
      if(AccountManager) await this.selectOption(this.AccountManager, AccountManager);
      if(CampaignType) await this.selectOption(this.CampaignType, CampaignType);
      if(Direction) await this.selectOption(this.Direction, Direction);
      if (DefaultCampaign === 'Yes') {
        await this.scrollIntoView(this.DefaultCampaign);
        await this.safeClick(this.DefaultCampaign);
      }
      if(AssignmentType) await this.selectOption(this.AssignmentType, AssignmentType);  
      if(DialMode) await this.selectOption(this.DialMode, DialMode);
      if(Campaignlenght) await this.safeType(this.Campaignlenght, Campaignlenght);
      if(MaxCalls) await this.safeType(this.MaxCalls, MaxCalls);
      if (AllowLongRunningCamp === 'Yes') {
        await this.scrollIntoView(this.AllowLongRunningCamp);
        await this.safeClick(this.AllowLongRunningCamp);
      }
      if(CallBackAssignto) await this.selectOption(this.CallBackAssignto, CallBackAssignto);
      if(leadAssignto) await this.selectOption(this.leadAssignto, leadAssignto);
      if (EnableEmailNotification === 'Yes') {
        await this.scrollIntoView(this.EnableEmailNotification);
        await this.safeClick(this.EnableEmailNotification);
        if(FromEmail) await this.safeType(this.FromEmail, FromEmail);
        if(CCEmail) await this.safeType(this.CCEmail, CCEmail);
        if(BCCEmail) await this.safeType(this.BCCEmail, BCCEmail);
      }
      await this.scrollIntoView(this.SubmitButton);
      await this.safeClick(this.SubmitButton);
      await ErrorUtil.captureErrorIfPresent(this.page, 'ChangeCampaignSettings - submit');
      await this.page.locator('#pageMessages').waitFor({ state: 'hidden', timeout: 10000 });
      await expect(this.AssignmentListPage).toBeVisible({ timeout: 10000 });
      console.log(`✅ Campaign updated: ${CampaignName}`);
      return true;
    } catch (error) {
      console.error('❌ Error updating campaign:', error.message);
      throw error;
    }
  }

  // Utility to select an option from a dropdown with fast-fail and debug logging
  async selectOption(locator, value) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      throw new Error(`Dropdown value is missing or empty for locator: ${locator._selector || locator}`);
    }
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      // Get all available options for debug logging
      const options = await locator.locator('option').allTextContents();
      console.log(`Available options for dropdown (${locator._selector || locator}):`, options);
      // Check if the value is present in the options
      if (!options.map(opt => opt.trim()).includes(value.trim())) {
        throw new Error(`Value '${value}' not found in dropdown. Available options: ${options.join(', ')}`);
      }
      await locator.selectOption({ label: value });
      console.log(`✅ Selected option '${value}' in dropdown.`);
    } catch (error) {
      console.error(`❌ Error selecting option '${value}':`, error);
      throw error;
    }
  }
}
module.exports = CampaignCreationUpdationPage;