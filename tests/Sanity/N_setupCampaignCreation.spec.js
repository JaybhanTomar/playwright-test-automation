const { test } = require('@playwright/test');
const CampaignCreationUpdationData = require('../DataProvider/CampaignCreationUpdationData');
const CampaignCreationUpdationPage = require('../pages/CampaignCreationUpdationPage');
const SanityTestSetup = require('./utils/SanityTestSetup.js');

// Uses centralized Sanity configuration from tests/Sanity/config/SanityConfig.js
test.describe.serial('Sanity - Campaign Creation Updation Tests', () => {
  let sanitySetup, campaignCreationUpdationPage, page, apiCapture;

  // Use Sanity Config for timeout
  test.setTimeout(SanityTestSetup.getTestTimeout());

  test.beforeAll(async () => {
    // Initialize Sanity test setup
    sanitySetup = new SanityTestSetup();
    const instances = await sanitySetup.completeSetup();

    // Extract needed instances
    page = instances.page;
    apiCapture = instances.apiCapture;

    // Initialize campaign page
    campaignCreationUpdationPage = new CampaignCreationUpdationPage(page);

    console.log(`✅ Sanity Campaign: Setup completed on ${SanityTestSetup.getEnvironment().toUpperCase()}`);
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
    // Use Sanity setup cleanup
    await sanitySetup.cleanup();
  });
});
