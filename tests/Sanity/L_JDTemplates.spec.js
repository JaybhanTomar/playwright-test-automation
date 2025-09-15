const { test, expect } = require('@playwright/test');
const FieldTestData = require('../DataProvider/FieldCreationUpdationData');
const SanityTestSetup = require('./utils/SanityTestSetup.js');

// Uses centralized Sanity configuration from tests/Sanity/config/SanityConfig.js
test.describe.serial('Sanity - JD Templates Creation Tests', () => {
  let sanitySetup, sys, apiCapture;

  // Use Sanity Config for timeout
  test.setTimeout(SanityTestSetup.getTestTimeout());

  test.beforeAll(async () => {
    // Initialize Sanity test setup
    sanitySetup = new SanityTestSetup();
    const instances = await sanitySetup.completeSetup();

    // Extract needed instances
    sys = instances.sys;
    apiCapture = instances.apiCapture;
    // Navigate to JD Templates
    console.log('📋 Clicking on JD Templates...');
    await sys.clickOnJDTemplates();

    console.log(`✅ Sanity JD Templates: Setup completed on ${SanityTestSetup.getEnvironment().toUpperCase()}`);
  });

  test('CreateJDTemplateTest', async () => {
    const JDTemplateData = FieldTestData.JDTemplateCreationData();
    console.log('DEBUG JDTemplateData:', JDTemplateData);

    // Check if there's any data to process
    if (!JDTemplateData || JDTemplateData.length === 0) {
      console.log('⚠️ No JD Template data found in Excel. Test will complete.');
      return;
    }

    console.log(`📊 Processing ${JDTemplateData.length} JD Template(s) from Excel data`);
    for (const data of JDTemplateData) {
      const {
        Category,
        JobTitle,
        Department,
        Location,
        JobSummary,
        KeyResponsibilities,
        RequiredSkills,
        BonousSkills,
        ReportingTo,
        JobType,
        RequiredQualification,
        BonusQualification,
        PhysicalLocation,
        TotalExperience,
        RelevantExperience,
        SalaryRange,
        BonusIncluded,
        StockOptionIncluded,
        WorkingHours,
        TravelRequirements,
        CompanyDescription
      } = data;
      console.log(`\n📄 Running JD Template creation test for: ${JobTitle}`);
      console.log('Attempting to create/check JD Template with JobTitle:', JobTitle);
      await sys.createJDTemplates(
        Category,
        JobTitle,
        Department,
        Location,
        JobSummary,
        KeyResponsibilities,
        RequiredSkills,
        BonousSkills,
        ReportingTo,
        JobType,
        RequiredQualification,
        BonusQualification,
        PhysicalLocation,
        TotalExperience,
        RelevantExperience,
        SalaryRange,
        BonusIncluded,
        StockOptionIncluded,
        WorkingHours,
        TravelRequirements,
        CompanyDescription
      );
      console.log(`✅ JD Template creation test completed for: ${JobTitle}`);
    }
  });

  test.afterAll(async () => {
    // Use Sanity setup cleanup
    await sanitySetup.cleanup();
  });
});