const { test } = require('@playwright/test');
const CampaignCreationUpdationData = require('../../DataProvider/CampaignCreationUpdationData');
const CampaignCreationUpdationPage = require('../../pages/CampaignCreationUpdationPage');
const RBLTestSetup = require('../utils/RBLTestSetup.js');

// Uses centralized RBL configuration from tests/RBL/config/RBLConfig.js
test.describe.serial('RBL - Campaign Creation Tests', () => {
  let rblSetup, campaignCreationUpdationPage, apiCapture;

  // Use RBL Config for timeout
  test.setTimeout(RBLTestSetup.getTestTimeout());

  test.beforeAll(async () => {
    // Initialize RBL test setup
    rblSetup = new RBLTestSetup();

    // Use basic setup without System Setup navigation (campaigns don't need System Setup)
    const instances = await rblSetup.initializeBrowser();
    await rblSetup.loginToRBLEnvironment();

    // Extract needed instances
    const { page } = instances;
    apiCapture = instances.apiCapture;

    // Initialize campaign page
    campaignCreationUpdationPage = new CampaignCreationUpdationPage(page);

    console.log(`✅ RBL Campaign: Setup completed on ${RBLTestSetup.getEnvironment().toUpperCase()} (without System Setup)`);
  });

  test.beforeEach(async () => {
    await campaignCreationUpdationPage.navigateToActiveCampaign();
  });

  test('RBL Create Campaign Test', async () => {
    console.log('\n📋 Starting RBL Campaign creation with Excel data...');
    const campaignCreationData = CampaignCreationUpdationData.CampaignCreationData();
    console.log('DEBUG RBL CampaignData:', campaignCreationData);

    // Check if there's any data to process
    if (!campaignCreationData || campaignCreationData.length === 0) {
      console.log('⚠️ No RBL campaign data found in Excel. Test will complete.');
      return;
    }

    console.log(`📊 Processing ${campaignCreationData.length} RBL campaign(s) from Excel data`);
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

      if (!CampaignName || CampaignName.trim() === "") {
        console.warn(`⚠️  Skipping RBL campaign: CampaignName is missing or empty.`);
        continue;
      }

      console.log(`\n📄 Running RBL create campaign test for: ${CampaignName}`);
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
      );
      console.log(`✅ RBL create campaign test completed for: ${CampaignName}`);
    }
  });

  test.afterAll(async () => {
    // Use RBL setup cleanup
    await rblSetup.cleanup();
  });
});
