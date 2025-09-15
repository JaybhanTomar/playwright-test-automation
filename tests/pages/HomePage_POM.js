const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');
const AdminSideBar = require('../utils/AdminSideBar');
const ErrorUtil = require('../utils/ErrorUtil');

class HomePage_POM extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.timeout = 30000;
    this.adminSideBar = new AdminSideBar(page);
  }

  // --- Locators as getters ---
  get back() { return this.page.locator("//i[@class='fa fa-arrow-circle-left fa-lg']"); }
  get overview() { return this.page.locator("//h4[normalize-space()='Overview']"); }
  get home() { return this.page.locator("//span[@class='page admin-home']"); }
  get campaignsAndContacts() { return this.page.locator("//label[normalize-space()='Campaigns & Contacts']"); }
  get campaignsAndContactsPage() { return this.page.locator("//div[@class='col-xs-12 col-sm-12 col-lg-12']//div[@class='box box-info']"); }
  get activeCamp() { return this.page.locator("//div[contains(text(),'Active Campaigns')]"); }
  get activedCampPage() { return this.page.locator("//div[@class='tab-content']"); }
  get archivedActiveCamp() { return this.page.locator("//a[@id='viewArchiveCampaigns']"); }
  get archivedCampPage() { return this.page.locator("//div[@class='tab-content p-0']"); }
  get archivedCamp() { return this.page.locator("//div[contains(text(),'Archived Campaigns')]"); }
  get allContacts() { return this.page.locator("//div[contains(text(),'All Contacts')]"); }
  get allContactsPage() { return this.page.locator("//label[normalize-space()='All Contacts']"); }
  get addContact() { return this.page.locator("//div[contains(text(),'Add Contact')]"); }
  get addContactForm() { return this.page.locator("(//div[@class='box box-info'])[3]"); }
  get addContactPageText() { return this.page.locator("//label[normalize-space()='Add Contact']"); }
  get leadsAndTickets() { return this.page.locator("//label[normalize-space()='Leads & Tickets']"); }
  get leadsAndTicketsItems() { return this.page.locator("//div[@id='campleadBody']"); }
  get leadFollowUp() { return this.page.locator("//div[contains(text(),'Lead Follow Up')]"); }
  get leadFollowUpPage() { return this.page.locator("(//div[@class='box box-info'])[3]"); }
  get manageAllLeads() { return this.page.locator("//div[contains(text(),'Manage All Leads')]"); }
  get manageAllLeadsPage() { return this.page.locator("(//div[@class='box box-info'])[3]"); }
  get ticketFollowUp() { return this.page.locator("//div[contains(text(),'Ticket Follow Up')]"); }
  get ticketFollowUpPage() { return this.page.locator("(//div[@class='box box-info'])[3]"); }
  get manageAllTickets() { return this.page.locator("//div[contains(text(),'Manage All Tickets')]"); }
  get manageAllTicketsPage() { return this.page.locator("(//div[@class='box box-info'])[3]"); }
  get others() { return this.page.locator("//div[@class='box-header with-border box-light-success hov-pointer']"); }
  get othersElements() { return this.page.locator("//div[@id='campotherBody']"); }
  get myPreference() { return this.page.locator("//div[contains(text(),'My Preferences')]"); }
  get myPreferencePage() { return this.page.locator("//section[@class='content animated fadeIn']//div[@class='box box-info']"); }
  get phonePreferences() { return this.page.locator("//div[contains(text(),'Phone Preferences')]"); }
  get phonePreferencesPage() { return this.page.locator("//div[@id='voiceBody']"); }
  get import() { return this.page.locator("//div[@class='card-panel-text'][normalize-space()='Import']"); }
  get importListPage() { return this.page.locator("//div[@class='tab-content p-0']"); }
  get importList() { return this.page.locator("//a[@id='importNewList']"); }
  get appendToAnExistingList() { return this.page.locator("//a[@id='appenedExistingList']"); }
  get appendToAnExistingListPage() { return this.page.locator("//div[@class='tab-content p-0']"); }
  get importLogs() { return this.page.locator("//a[@id='viewImportLog']"); }
  get importLogsPage() { return this.page.locator("(//div[@class='row m-0'])[3]"); }
  get importedList() { return this.page.locator("//a[@id='viewImportedList']"); }
  get importedListPage() { return this.page.locator("//div[@class='tab-content p-0']"); }
  get webFormImport() { return this.page.locator("//div[contains(text(),'Web Form Import')]"); }
  get webFormCampaignMapping() { return this.page.locator("//div[@class='tab-content']"); }
  get logs() { return this.page.locator("//a[normalize-space()='Logs']"); }
  get webPostLogCriteria() { return this.page.locator("//div[@class='tab-content']"); }
  get reports() { return this.page.locator("//div[contains(text(),'Reports')]"); }
  get reportsHeader() { return this.page.locator("//h4[normalize-space()='Reports']"); }
  get reportsItems() { return this.page.locator("//section[@class='content animated fadeIn']"); }
  get outboundSummary() { return this.page.locator("//div[contains(text(),'Outbound Summary')]"); }
  get outboundSummaryCriteria() { return this.page.locator("(//div[@class='box box-info'])[3]"); }
  get expendOutboundCalls() { return this.page.locator("//label[normalize-space()='Outbound Calls']"); }
  get outboundDetails() { return this.page.locator("//div[@class='card-panel-text text-left'][normalize-space()='Outbound Detail']"); }
  get outboundDetailsCriteria() { return this.page.locator("(//div[@class='box box-info'])[3]"); }
  get inboundCalls() { return this.page.locator("//label[normalize-space()='Inbound Calls']"); }
  get inboundDetail() { return this.page.locator("//div[contains(text(),'Inbound Detail')]"); }
  get inboundDetailCriteria() { return this.page.locator("(//div[@class='box box-info'])[3]"); }
  get leadReport() { return this.page.locator("//label[normalize-space()='Lead Report']"); }
  get leadSummary() { return this.page.locator("//div[contains(text(),'Lead Summary')]"); }
  get leadSummaryReport() { return this.page.locator("(//div[@class='box box-info'])[3]"); }
  get leadDetail() { return this.page.locator("//div[contains(text(),'Lead Detail')]"); }
  get leadDetailReport() { return this.page.locator("(//div[@class='box box-info'])[3]"); }
  get agent() { return this.page.locator("//label[normalize-space()='Agent']"); }
  get agentSummary() { return this.page.locator("//div[contains(text(),'Agent Summary')]"); }
  get agentSummaryReport() { return this.page.locator("(//div[@class='box box-info'])[3]"); }
  get agentDetail() { return this.page.locator("//div[contains(text(),'Agent Detail Report')]"); }
  get agentDetailReport() { return this.page.locator("(//div[@class='box box-info'])[3]"); }
  get systemUser() { return this.page.locator("//div[contains(text(),'System User Report')]"); }
  get systemUserReport() { return this.page.locator("(//div[@class='box box-info'])[3]"); }
  get agentTimeByCampaign() { return this.page.locator("//div[contains(text(),'Agent Time Report (By Campaign)')]"); }
  get agentTimeByCampaignCriteria() { return this.page.locator("(//div[@class='box box-info'])[3]"); }
  get agentTimeByAgent() { return this.page.locator("//div[contains(text(),'Agent Time Report (By Agent)')]"); }
  get agentTimeByAgentCriteria() { return this.page.locator("(//div[@class='box box-info'])[3]"); }
  get contact() { return this.page.locator("//label[normalize-space()='Contact']"); }
  get statusReport() { return this.page.locator("//div[contains(text(),'Status Report')]"); }
  get statusReportCriteria() { return this.page.locator("(//div[@class='box box-info'])[3]"); }
  get importListReport() { return this.page.locator("//div[contains(text(),'Imported List Report')]"); }
  get importListReportPage() { return this.page.locator("(//div[@class='box box-info'])[3]"); }
  get contactWebPostLog() { return this.page.locator("//div[contains(text(),'Contact Web Post Log')]"); }
  get contactWebPostLogCriteria() { return this.page.locator("(//div[@class='box box-info'])[3]"); }
  get custom() { return this.page.locator("//label[normalize-space()='Custom']"); }
  get customReportsPages() { return this.page.locator("(//div[@class='box box-info'])[3]"); }

  // --- Home ---
  async NavigateToHome() {
    try {
      await this.home.scrollIntoViewIfNeeded();
      await this.home.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'NavigateToHome');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'NavigateToHome');
      await this.campaignsAndContacts.scrollIntoViewIfNeeded();
      await expect(this.campaignsAndContactsPage).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in NavigateToHome: ${error.message}`);
    }
  }

  // --- Home Elements ---
  async tabToHomeElements() {
    await this.NavigateToHome();
    await this.tabToActiveCampaign();
    await this.tabToLeadFollowUp();
    await this.tabToMyPreference();
  }

  // --- Active Campaigns ---
  async tabToActiveCampaign() {
    try {
      await this.activeCamp.scrollIntoViewIfNeeded();
      await expect(this.activeCamp).toBeVisible({ timeout: this.timeout });
      await this.activeCamp.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToActiveCampaign');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToActiveCampaign');
      await this.activedCampPage.scrollIntoViewIfNeeded();
      await expect(this.activedCampPage).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToActiveCampaign: ${error.message}`);
    }
    await this.tabToArchivedCampAtActiveCampaigns();
    await this.tabToArchivedCampaign();
    await this.tabToAllContact();
    await this.tabToAddContact();
  }

  // --- Archived Campaigns at Active Campaigns ---
  async tabToArchivedCampAtActiveCampaigns() {
    try {
      await this.archivedActiveCamp.scrollIntoViewIfNeeded();
      await expect(this.archivedActiveCamp).toBeVisible({ timeout: this.timeout });
      await this.archivedActiveCamp.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToArchivedCampAtActiveCampaigns');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToArchivedCampAtActiveCampaigns');
      await this.archivedCampPage.scrollIntoViewIfNeeded();
      await expect(this.archivedCampPage).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToArchivedCampAtActiveCampaigns: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.activedCampPage.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.overview.scrollIntoViewIfNeeded();
      await expect(this.overview).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- Archived Campaigns ---
  async tabToArchivedCampaign() {
    try {
      await this.archivedCamp.scrollIntoViewIfNeeded();
      await expect(this.archivedCamp).toBeVisible({ timeout: this.timeout });
      await this.archivedCamp.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToArchivedCampaign');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToArchivedCampaign');
      await this.archivedCampPage.scrollIntoViewIfNeeded();
      await expect(this.archivedCampPage).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToArchivedCampaign: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.overview.scrollIntoViewIfNeeded();
      await expect(this.overview).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- All Contacts ---
  async tabToAllContact() {
    try {
      await this.allContacts.scrollIntoViewIfNeeded();
      await expect(this.allContacts).toBeVisible({ timeout: this.timeout });
      await this.allContacts.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToAllContact');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToAllContact');
      await this.allContactsPage.scrollIntoViewIfNeeded();
      await expect(this.allContactsPage).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToAllContact: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.overview.scrollIntoViewIfNeeded();
      await expect(this.overview).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- Add Contact ---
  async tabToAddContact() {
    try {
      await this.addContact.scrollIntoViewIfNeeded();
      await expect(this.addContact).toBeVisible({ timeout: this.timeout });
      await this.addContact.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToAddContact');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToAddContact');
      await this.addContactForm.scrollIntoViewIfNeeded();
      await expect(this.addContactForm).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToAddContact: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.overview.scrollIntoViewIfNeeded();
      await expect(this.overview).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- Leads & Tickets ---
  async tabToLeadsAndTickets() {
    try {
      await this.leadsAndTickets.scrollIntoViewIfNeeded();
      await expect(this.leadsAndTickets).toBeVisible({ timeout: this.timeout });
      await this.leadsAndTickets.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToLeadsAndTickets');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToLeadsAndTickets');
      await this.leadsAndTicketsItems.scrollIntoViewIfNeeded();
      await expect(this.leadsAndTicketsItems).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToLeadsAndTickets: ${error.message}`);
    }
  }

  // --- Lead Follow Up ---
  async tabToLeadFollowUp() {
    try {
      if (!(await this.leadFollowUp.isVisible())) {
        await this.tabToLeadsAndTickets();
      }
      await this.leadFollowUp.scrollIntoViewIfNeeded();
      await expect(this.leadFollowUp).toBeVisible({ timeout: this.timeout });
      await this.leadFollowUp.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToLeadFollowUp');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToLeadFollowUp');
      await this.leadFollowUpPage.scrollIntoViewIfNeeded();
      await expect(this.leadFollowUpPage).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToLeadFollowUp: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.overview.scrollIntoViewIfNeeded();
      await expect(this.overview).toBeVisible({ timeout: this.timeout });
    }
    await this.tabToManageAllLeads();
    await this.tabToTicketFollowUp();
    await this.tabToManageAllTickets();
  }

  // --- Manage All Leads ---
  async tabToManageAllLeads() {
    try {
      if (!(await this.manageAllLeads.isVisible())) {
        await this.tabToLeadsAndTickets();
      }
      await this.manageAllLeads.scrollIntoViewIfNeeded();
      await expect(this.manageAllLeads).toBeVisible({ timeout: this.timeout });
      await this.manageAllLeads.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToManageAllLeads');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToManageAllLeads');
      await this.manageAllLeadsPage.scrollIntoViewIfNeeded();
      await expect(this.manageAllLeadsPage).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToManageAllLeads: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.overview.scrollIntoViewIfNeeded();
      await expect(this.overview).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- Ticket Follow Up ---
  async tabToTicketFollowUp() {
    try {
      if (!(await this.ticketFollowUp.isVisible())) {
        await this.tabToLeadsAndTickets();
      }
      await this.ticketFollowUp.scrollIntoViewIfNeeded();
      await expect(this.ticketFollowUp).toBeVisible({ timeout: this.timeout });
      await this.ticketFollowUp.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToTicketFollowUp');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToTicketFollowUp');
      await this.ticketFollowUpPage.scrollIntoViewIfNeeded();
      await expect(this.ticketFollowUpPage).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToTicketFollowUp: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.overview.scrollIntoViewIfNeeded();
      await expect(this.overview).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- Manage All Tickets ---
  async tabToManageAllTickets() {
    try {
      if (!(await this.manageAllTickets.isVisible())) {
        await this.tabToLeadsAndTickets();
      }
      await this.manageAllTickets.scrollIntoViewIfNeeded();
      await expect(this.manageAllTickets).toBeVisible({ timeout: this.timeout });
      await this.manageAllTickets.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToManageAllTickets');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToManageAllTickets');
      await this.manageAllTicketsPage.scrollIntoViewIfNeeded();
      await expect(this.manageAllTicketsPage).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToManageAllTickets: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.overview.scrollIntoViewIfNeeded();
      await expect(this.overview).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- Others ---
  async tabToOthers() {
    try {
      await this.others.scrollIntoViewIfNeeded();
      await expect(this.others).toBeVisible({ timeout: this.timeout });
      await this.others.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToOthers');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToOthers');
      await this.othersElements.scrollIntoViewIfNeeded();
      await expect(this.othersElements).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      await this.page.screenshot({ path: 'error-tabToOthers.png', fullPage: true });
      console.error(error);
      throw new Error(`Exception occurred in tabToOthers: ${error.message}`);
    }
  }

  // --- My Preferences ---
  async tabToMyPreference() {
    try {
      if (!(await this.myPreference.isVisible())) {
        await this.tabToOthers();
      }
      await this.myPreference.scrollIntoViewIfNeeded();
      await expect(this.myPreference).toBeVisible({ timeout: this.timeout });
      await this.myPreference.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToMyPreference');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToMyPreference');
      await this.myPreferencePage.scrollIntoViewIfNeeded();
      await expect(this.myPreferencePage).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToMyPreference: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.overview.scrollIntoViewIfNeeded();
      await expect(this.overview).toBeVisible({ timeout: this.timeout });
    }
    await this.tabToPhonePreferences();
    await this.tabToImport();
    await this.tabToAppendToAnExistingList();
    await this.tabToImportLogs();
    await this.tabToImportedList();
    await this.tabToWebFormImport();
    await this.tabToReports();
    await this.tabToOutboundSummary();
    await this.tabToOutboundDetails();
    await this.tabToInboundDetail();
    await this.tabToLeadSummary();
    await this.tabToLeadDetail();
    await this.tabToAgentSummary();
    await this.tabToAgentDetail();
    await this.tabToSystemUser();
    await this.tabToAgentTimeByCampaign();
    await this.tabToAgentTimeByAgent();
    await this.tabToStatusReport();
    await this.tabToImportListReport();
    await this.tabToContactWebPostLog();
  }

  // --- Phone Preferences ---
  async tabToPhonePreferences() {
    try {
      if (!(await this.phonePreferences.isVisible())) {
        await this.tabToOthers();
      }
      await this.phonePreferences.scrollIntoViewIfNeeded();
      await expect(this.phonePreferences).toBeVisible({ timeout: this.timeout });
      await this.phonePreferences.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToPhonePreferences');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToPhonePreferences');
      await this.phonePreferencesPage.scrollIntoViewIfNeeded();
      await expect(this.phonePreferencesPage).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToPhonePreferences: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.overview.scrollIntoViewIfNeeded();
      await expect(this.overview).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- Import ---
  async tabToImport() {
    try {
      if (!(await this.import.isVisible())) {
        await this.tabToOthers();
      }
      await this.import.scrollIntoViewIfNeeded();
      await expect(this.import).toBeVisible({ timeout: this.timeout });
      await this.import.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToImport');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToImport');
      await this.importListPage.scrollIntoViewIfNeeded();
      await expect(this.importListPage).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToImport: ${error.message}`);
    }
  }

  // --- Append to Existing List ---
  async tabToAppendToAnExistingList() {
    try {
      if (!(await this.appendToAnExistingList.isVisible({ timeout: this.timeout }))) {
        await this.tabToOthers();
      }
      await this.appendToAnExistingList.waitFor({ state: 'visible', timeout: this.timeout });
      await this.appendToAnExistingList.scrollIntoViewIfNeeded();
      await this.appendToAnExistingList.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToAppendToAnExistingList');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToAppendToAnExistingList');
      await this.appendToAnExistingListPage.scrollIntoViewIfNeeded();
      await expect(this.appendToAnExistingListPage).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      await this.page.screenshot({ path: 'error-tabToAppendToAnExistingList.png', fullPage: true });
      console.error(error);
      throw new Error(`Exception occurred in tabToAppendToAnExistingList: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.importList.scrollIntoViewIfNeeded();
      await expect(this.importList).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- Import Logs ---
  async tabToImportLogs() {
    try {
      if (!(await this.importLogs.isVisible())) {
        await this.tabToOthers();
      }
      await this.importLogs.scrollIntoViewIfNeeded();
      await expect(this.importLogs).toBeVisible({ timeout: this.timeout });
      await this.importLogs.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToImportLogs');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToImportLogs');
      await this.importLogsPage.scrollIntoViewIfNeeded();
      await expect(this.importLogsPage).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToImportLogs: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.importList.scrollIntoViewIfNeeded();
      await expect(this.importList).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- Imported List ---
  async tabToImportedList() {
    try {
      if (!(await this.importedList.isVisible())) {
        await this.tabToOthers();
      }
      await this.importedList.scrollIntoViewIfNeeded();
      await expect(this.importedList).toBeVisible({ timeout: this.timeout });
      await this.importedList.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToImportedList');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToImportedList');
      await this.importedListPage.scrollIntoViewIfNeeded();
      await expect(this.importedListPage).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToImportedList: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.importList.scrollIntoViewIfNeeded();
      await expect(this.importList).toBeVisible({ timeout: this.timeout });
      await this.adminSideBar.clickOnBackButton();
      await this.overview.scrollIntoViewIfNeeded();
      await expect(this.overview).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- Web Form Import ---
  async tabToWebFormImport() {
    try {
      // If Web Form Import is not visible, go to Others tab first
      if (!(await this.webFormImport.isVisible({ timeout: 2000 }))) {
        await this.tabToOthers();
      }
      await this.webFormImport.scrollIntoViewIfNeeded();
      await expect(this.webFormImport).toBeVisible({ timeout: this.timeout });
      await this.webFormImport.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToWebFormImport');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToWebFormImport');
      await this.webFormCampaignMapping.scrollIntoViewIfNeeded();
      await expect(this.webFormCampaignMapping).toBeVisible({ timeout: this.timeout });
      await this.tabToLogs();
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToWebFormImport: ${error.message}`);
    }
  }

  // --- Logs ---
  async tabToLogs() {
    try{
      await this.logs.scrollIntoViewIfNeeded();
      await expect(this.logs).toBeVisible({ timeout: this.timeout });
      await this.logs.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToLogs');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToLogs');
      await this.webPostLogCriteria.scrollIntoViewIfNeeded();
      await expect(this.webPostLogCriteria).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToLogs: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.webFormCampaignMapping.scrollIntoViewIfNeeded();
      await expect(this.webFormCampaignMapping).toBeVisible({ timeout: this.timeout });
      await this.adminSideBar.clickOnBackButton();
      await this.overview.scrollIntoViewIfNeeded();
      await expect(this.overview).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- Reports ---
  async tabToReports() {
    try {
      // If Reports is not visible, try to navigate to the appropriate section first
      if (!(await this.reports.isVisible({ timeout: 2000 }))) {
        // Try to go to Others section first, as Reports might be under it
        try {
          await this.tabToOthers();
        } catch (othersError) {
          console.log("Others navigation failed, trying direct Reports access...");
        }
      }
      await this.reports.scrollIntoViewIfNeeded();
      await expect(this.reports).toBeVisible({ timeout: this.timeout });
      await this.reports.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToReports');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToReports');
      await this.reportsItems.scrollIntoViewIfNeeded();
      await expect(this.reportsItems).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToReports: ${error.message}`);
    }
  }

  // --- Outbound Summary ---
  async tabToOutboundSummary() {
    try {
      await this.outboundSummary.scrollIntoViewIfNeeded();
      await expect(this.outboundSummary).toBeVisible({ timeout: this.timeout });
      await this.outboundSummary.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToOutboundSummary');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToOutboundSummary');
      await this.outboundSummaryCriteria.scrollIntoViewIfNeeded();
      await expect(this.outboundSummaryCriteria).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToOutboundSummary: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.reportsHeader.scrollIntoViewIfNeeded();
      await expect(this.reportsHeader).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- Outbound Detail ---
  async tabToOutboundDetails() {
    try {
      await this.outboundDetails.scrollIntoViewIfNeeded();
      await expect(this.outboundDetails).toBeVisible({ timeout: this.timeout });
      await this.outboundDetails.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToOutboundDetails');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToOutboundDetails');
      await this.outboundDetailsCriteria.scrollIntoViewIfNeeded();
      await expect(this.outboundDetailsCriteria).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToOutboundDetails: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.reportsHeader.scrollIntoViewIfNeeded();
      await expect(this.reportsHeader).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- Inbound Calls ---
  async clickOnInboundCalls() {
    try {
      await this.inboundCalls.scrollIntoViewIfNeeded();
      await expect(this.inboundCalls).toBeVisible({ timeout: this.timeout });
      await this.inboundCalls.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToInboundCalls');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToInboundCalls');
      await this.inboundDetail.scrollIntoViewIfNeeded();
      await expect(this.inboundDetail).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToInboundCalls: ${error.message}`);
    }
  }

  // --- Inbound Detail ---
  async tabToInboundDetail() {
    try {
      if (!(await this.inboundDetail.isVisible({ timeout: 2000 }))) {
        await this.clickOnInboundCalls();
      }
      await this.inboundDetail.scrollIntoViewIfNeeded();
      await expect(this.inboundDetail).toBeVisible({ timeout: this.timeout });
      await this.inboundDetail.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToInboundDetail');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToInboundDetail');
      await this.inboundDetailCriteria.scrollIntoViewIfNeeded();
      await expect(this.inboundDetailCriteria).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToInboundDetail: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.reportsHeader.scrollIntoViewIfNeeded();
      await expect(this.reportsHeader).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- Lead Report ---
  async clickOnLeadReport() {
    try {
      await this.leadReport.scrollIntoViewIfNeeded();
      await expect(this.leadReport).toBeVisible({ timeout: this.timeout });
      await this.leadReport.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToLeadReport');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToLeadReport');
      await this.leadSummary.scrollIntoViewIfNeeded();
      await expect(this.leadSummary).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToLeadReport: ${error.message}`);
    }
  }

  // --- Lead Summary ---
  async tabToLeadSummary() {
    try {
      if (!(await this.leadSummary.isVisible({ timeout: 2000 }))) {
        await this.clickOnLeadReport();
      }
      await this.leadSummary.scrollIntoViewIfNeeded();
      await expect(this.leadSummary).toBeVisible({ timeout: this.timeout });
      await this.leadSummary.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToLeadSummary');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToLeadSummary');
      await this.leadSummaryReport.scrollIntoViewIfNeeded();
      await expect(this.leadSummaryReport).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToLeadSummary: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.reportsHeader.scrollIntoViewIfNeeded();
      await expect(this.reportsHeader).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- Lead Detail ---
  async tabToLeadDetail() {
    try {
      if (!(await this.leadDetail.isVisible({ timeout: 2000 }))) {
        await this.clickOnLeadReport();
      }
      await this.leadDetail.scrollIntoViewIfNeeded();
      await expect(this.leadDetail).toBeVisible({ timeout: this.timeout });
      await this.leadDetail.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToLeadDetail');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToLeadDetail');
      await this.leadDetailReport.scrollIntoViewIfNeeded();
      await expect(this.leadDetailReport).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToLeadDetail: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.reportsHeader.scrollIntoViewIfNeeded();
      await expect(this.reportsHeader).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- Ticket Report ---
  get ticketReport() { return this.page.locator("//label[normalize-space()='Ticket Report']"); }
  get ticketDetails() { return this.page.locator("//div[contains(text(),'Ticket Details')]"); }
  get ticketDetailsCriteria() { return this.page.locator("(//div[@class='box box-info'])[3]"); }
  async clickOnTicketReport() {
    try {
      await this.ticketReport.scrollIntoViewIfNeeded();
      await expect(this.ticketReport).toBeVisible({ timeout: this.timeout });
      await this.ticketReport.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToTicketReport');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToTicketReport');
      await this.ticketDetails.scrollIntoViewIfNeeded();
      await expect(this.ticketDetails).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToTicketReport: ${error.message}`);
    }
  }

  // --- Ticket Details ---
  async tabToTicketDetails() {
    try {
      if (!(await this.ticketDetails.isVisible({ timeout: 2000 }))) {
        await this.clickOnTicketReport();
      }
      await this.ticketDetails.scrollIntoViewIfNeeded();
      await expect(this.ticketDetails).toBeVisible({ timeout: this.timeout });
      await this.ticketDetails.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToTicketDetails');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToTicketDetails');
      await this.ticketDetailsCriteria.scrollIntoViewIfNeeded();
      await expect(this.ticketDetailsCriteria).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToTicketDetails: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.reportsHeader.scrollIntoViewIfNeeded();
      await expect(this.reportsHeader).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- Agent ---
  async clickOnAgent() {
    try {
      await this.agent.scrollIntoViewIfNeeded();
      await expect(this.agent).toBeVisible({ timeout: this.timeout });
      await this.agent.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToAgent');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToAgent');
      await this.agentSummary.scrollIntoViewIfNeeded();
      await expect(this.agentSummary).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToAgent: ${error.message}`);
    }
  }

  // --- Agent Summary ---
  async tabToAgentSummary() {
    try {
      if (!(await this.agentSummary.isVisible({ timeout: 2000 }))) {
        await this.clickOnAgent();
      }
      await this.agentSummary.scrollIntoViewIfNeeded();
      await expect(this.agentSummary).toBeVisible({ timeout: this.timeout });
      await this.agentSummary.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToAgentSummary');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToAgentSummary');
      await this.agentSummaryReport.scrollIntoViewIfNeeded();
      await expect(this.agentSummaryReport).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToAgentSummary: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.reportsHeader.scrollIntoViewIfNeeded();
      await expect(this.reportsHeader).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- Agent Detail ---
  async tabToAgentDetail() {
    try {
      if (!(await this.agentDetail.isVisible({ timeout: 2000 }))) {
        await this.clickOnAgent();
      }
      await this.agentDetail.scrollIntoViewIfNeeded();
      await expect(this.agentDetail).toBeVisible({ timeout: this.timeout });
      await this.agentDetail.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToAgentDetail');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToAgentDetail');
      await this.agentDetailReport.scrollIntoViewIfNeeded();
      await expect(this.agentDetailReport).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToAgentDetail: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.reportsHeader.scrollIntoViewIfNeeded();
      await expect(this.reportsHeader).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- System User Report ---
  async tabToSystemUser() {
    try {
      if (!(await this.systemUser.isVisible({ timeout: 2000 }))) {
        await this.clickOnAgent();
      }
      await this.systemUser.scrollIntoViewIfNeeded();
      await expect(this.systemUser).toBeVisible({ timeout: this.timeout });
      await this.systemUser.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToSystemUser');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToSystemUser');
      await this.systemUserReport.scrollIntoViewIfNeeded();
      await expect(this.systemUserReport).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToSystemUser: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.reportsHeader.scrollIntoViewIfNeeded();
      await expect(this.reportsHeader).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- Agent Time Report (By Campaign) ---
  async tabToAgentTimeByCampaign() {
    try {
      if (!(await this.agentTimeByCampaign.isVisible({ timeout: 2000 }))) {
        await this.clickOnAgent();
      }
      await this.agentTimeByCampaign.scrollIntoViewIfNeeded();
      await expect(this.agentTimeByCampaign).toBeVisible({ timeout: this.timeout });
      await this.agentTimeByCampaign.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToAgentTimeByCampaign');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToAgentTimeByCampaign');
      await this.agentTimeByCampaignCriteria.scrollIntoViewIfNeeded();
      await expect(this.agentTimeByCampaignCriteria).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToAgentTimeByCampaign: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.reportsHeader.scrollIntoViewIfNeeded();
      await expect(this.reportsHeader).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- Agent Time Report (By Agent) ---
  async tabToAgentTimeByAgent() {
    try {
      if (!(await this.agentTimeByAgent.isVisible({ timeout: 2000 }))) {
        await this.clickOnAgent();
      }
      await this.agentTimeByAgent.scrollIntoViewIfNeeded();
      await expect(this.agentTimeByAgent).toBeVisible({ timeout: this.timeout });
      await this.agentTimeByAgent.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToAgentTimeByAgent');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToAgentTimeByAgent');
      await this.agentTimeByAgentCriteria.scrollIntoViewIfNeeded();
      await expect(this.agentTimeByAgentCriteria).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToAgentTimeByAgent: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.reportsHeader.scrollIntoViewIfNeeded();
      await expect(this.reportsHeader).toBeVisible({ timeout: this.timeout });
    }
  }


  // --- Contact ---
  async clickOnContact() {
    try {
      await this.contact.scrollIntoViewIfNeeded();
      await expect(this.contact).toBeVisible({ timeout: this.timeout });
      await this.contact.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToContact');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToContact');
      await this.statusReport.scrollIntoViewIfNeeded();
      await expect(this.statusReport).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToContact: ${error.message}`);
    }
  }

  // --- Status Report ---
  async tabToStatusReport() {
    try {
      if (!(await this.statusReport.isVisible({ timeout: 2000 }))) {
        await this.clickOnContact();
      }
      await this.statusReport.scrollIntoViewIfNeeded();
      await expect(this.statusReport).toBeVisible({ timeout: this.timeout });
      await this.statusReport.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToStatusReport');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToStatusReport');
      await this.statusReportCriteria.scrollIntoViewIfNeeded();
      await expect(this.statusReportCriteria).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToStatusReport: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.reportsHeader.scrollIntoViewIfNeeded();
      await expect(this.reportsHeader).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- Imported List Report ---
  async tabToImportListReport() {
    try {
      if (!(await this.importListReport.isVisible({ timeout: 2000 }))) {
        await this.clickOnContact();
      }
      await this.importListReport.scrollIntoViewIfNeeded();
      await expect(this.importListReport).toBeVisible({ timeout: this.timeout });
      await this.importListReport.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToImportListReport');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToImportListReport');
      await this.importListReportPage.scrollIntoViewIfNeeded();
      await expect(this.importListReportPage).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToImportListReport: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.reportsHeader.scrollIntoViewIfNeeded();
      await expect(this.reportsHeader).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- Contact Web Post Log ---
  async tabToContactWebPostLog() {
    try {
      if (!(await this.contactWebPostLog.isVisible({ timeout: 2000 }))) {
        await this.clickOnContact();
      }
      await this.contactWebPostLog.scrollIntoViewIfNeeded();
      await expect(this.contactWebPostLog).toBeVisible({ timeout: this.timeout });
      await this.contactWebPostLog.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToContactWebPostLog');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToContactWebPostLog');
      await this.contactWebPostLogCriteria.scrollIntoViewIfNeeded();
      await expect(this.contactWebPostLogCriteria).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToContactWebPostLog: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.reportsHeader.scrollIntoViewIfNeeded();
      await expect(this.reportsHeader).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- Custom Reports ---
  async tabToCustomReport(reportName) {
    const customReportName = this.page.locator("//div[contains(text(),'" + reportName + "')]");
    try {
      if (!(await customReportName.isVisible())) {
        await this.tabToCustom();
      }
      await customReportName.scrollIntoViewIfNeeded();
      await expect(customReportName).toBeVisible({ timeout: this.timeout });
      await customReportName.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToCustomReport');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToCustomReport');
      await this.customReportsPages.scrollIntoViewIfNeeded();
      await expect(this.customReportsPages).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToCustomReport: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.overview.scrollIntoViewIfNeeded();
      await expect(this.overview).toBeVisible({ timeout: this.timeout });
    }
  }

  // --- Custom ---
  async tabToCustom() {
    try {
      await this.custom.scrollIntoViewIfNeeded();
      await expect(this.custom).toBeVisible({ timeout: this.timeout });
      await this.custom.click();
      await ErrorUtil.captureErrorIfPresent(this.page, 'tabToCustom');
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, 'tabToCustom');
      await this.customReportsPages.scrollIntoViewIfNeeded();
      await expect(this.customReportsPages).toBeVisible({ timeout: this.timeout });
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToCustom: ${error.message}`);
    } finally {
      await this.back.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.overview.scrollIntoViewIfNeeded();
      await expect(this.overview).toBeVisible({ timeout: this.timeout });
    }
  }
}

module.exports = HomePage_POM;
