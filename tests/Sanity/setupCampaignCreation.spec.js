const { test, chromium } = require('@playwright/test');
const CampaignCreationUpdationData = require('../DataProvider/CampaignCreationUpdationData');
const CampaignCreationUpdationPage = require('../pages/CampaignCreationUpdationPage');
const BaseURL = require('../utils/BaseURL');
const LoginPage = require('../pages/LoginPage');

// Use test.describe.serial to ensure tests run in the same browser context/session
test.describe.serial('Campaign Creation Updation Tests', () => {
  let campaignCreationUpdationPage;
  let loginPage;
  let baseUrlUtil;
  let browser;
  let context;
  let page;

  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    baseUrlUtil = new BaseURL(page);
    loginPage = new LoginPage(page);
    campaignCreationUpdationPage = new CampaignCreationUpdationPage(page);

    // Use BaseURL utility to navigate to qc6 environment
    await baseUrlUtil.qc2();

    // Login once and keep session
    const loginTestData = require('../DataProvider/UserCreationUpdationData').userLoginData();
    const { email, password, role } = loginTestData[0];
    await loginPage.login(email, password, role);
  });

  test.beforeEach(async ({}, testInfo) => {
    await campaignCreationUpdationPage.navigateToActiveCampaign(testInfo.title);
  });

  test('createCampaignTest', async ({}, testInfo) => {
    const campaignCreationData = CampaignCreationUpdationData.CampaignCreationData();
    for (let i = 0; i < campaignCreationData.length; i++) {
      const data = campaignCreationData[i];
      const {
        CampaignName,
        CampaignDescription,
        CampaignTalkingPoint,
        CampaignStartDate,
        AccountManager,
        CampaignType,
        Direction,
        DefaultCampaign,
        AssignmentType,
        DialMode,
        Campaignlenght,
        MaxCalls,
        AllowLongRunningCamp,
        CallBackAssignto,
        leadAssignto,
        EnableEmailNotification,
        FromEmail,
        CCEmail,
        BCCEmail,
        SkipList,
        ListName,
        CampaignSkills,
        DistributionMethod,
        AssignCallers,
        Fieldtype,
        Fieldname,
        SelectRange,
        firstValues,
        lastValues,
        callerLists,
        CallerIds,
        OtherCallerIds,
        ContactReAttempt,
        MaxRedialsPerDay,
        PreviewTime,
        PreviewTimeExpiration,
        VoiceMessageFile,
        OrderBy,
        CallbackReAttempt,
        EnableAgentCallRecording,
        EnabletwoPartyConsent,
        ACWTime,
        ACWTimeExpiration
      } = data;
      console.log(`\n📋 Running create campaign test for: ${CampaignName}`);
      await campaignCreationUpdationPage.createNewCampaign(
        CampaignName,
        CampaignDescription,
        CampaignTalkingPoint,
        CampaignStartDate,
        AccountManager,
        CampaignType,
        Direction,
        DefaultCampaign,
        AssignmentType,
        DialMode,
        Campaignlenght,
        MaxCalls,
        AllowLongRunningCamp,
        CallBackAssignto,
        leadAssignto,
        EnableEmailNotification,
        FromEmail,
        CCEmail,
        BCCEmail,
        SkipList,
        ListName,
        CampaignSkills,
        DistributionMethod,
        AssignCallers,
        Fieldtype,
        Fieldname,
        SelectRange,
        firstValues,
        lastValues,
        callerLists,
        CallerIds,
        OtherCallerIds,
        ContactReAttempt,
        MaxRedialsPerDay,
        PreviewTime,
        PreviewTimeExpiration,
        VoiceMessageFile,
        OrderBy,
        CallbackReAttempt,
        EnableAgentCallRecording,
        EnabletwoPartyConsent,
        ACWTime,
        ACWTimeExpiration,
        testInfo.title
      );
      console.log(`✅ Create campaign test completed for: ${CampaignName}`);
    }
  });
  test.skip('modifyCampaignTest', async ({}, testInfo) => {
    const campaignModificationData = CampaignCreationUpdationData.CampaignModificationData();
    for (let i = 0; i < campaignModificationData.length; i++) {
      const data = campaignModificationData[i];
      const {
        CampaignName,
        CampaignDescription,
        CampaignTalkingPoint,
        CampaignStartDate,
        AccountManager,
        CampaignType,
        Direction,
        DefaultCampaign,
        AssignmentType,
        DialMode,
        Campaignlenght,
        MaxCalls,
        AllowLongRunningCamp,
        CallBackAssignto,
        leadAssignto,
        EnableEmailNotification,
        FromEmail,
        CCEmail,
        BCCEmail,
        CampaignSetting,
        PullAppended,
        ChangeAssignments,
        ChangeProspectList,
        CustomField,
        CustomFieldName,
        EmailTemplates,
        Documents,
        CallDisposition,
        LeadProcessFields
      } = data;
      console.log(`\n📋 Running modify campaign test for: ${CampaignName}`);
      await campaignCreationUpdationPage.modifyCampaign(
        CampaignName,
        CampaignDescription,
        CampaignTalkingPoint,
        CampaignStartDate,
        AccountManager,
        CampaignType,
        Direction,
        DefaultCampaign,
        AssignmentType,
        DialMode,
        Campaignlenght,
        MaxCalls,
        AllowLongRunningCamp,
        CallBackAssignto,
        leadAssignto,
        EnableEmailNotification,
        FromEmail,
        CCEmail,
        BCCEmail,
        CampaignSetting,
        PullAppended,
        ChangeAssignments,
        ChangeProspectList,
        CustomField,
        CustomFieldName,
        EmailTemplates,
        Documents,
        CallDisposition,
        LeadProcessFields,
        testInfo.title
      );
      console.log(`✅ Modify campaign test completed for: ${CampaignName}`);
    }
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
    await browser.close();
  });
});
