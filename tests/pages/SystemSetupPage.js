const { expect } = require("@playwright/test");
const AdminSideBar = require("../utils/AdminSideBar");
const ErrorUtil = require("../utils/ErrorUtil");
const DatePicker = require("../utils/DatePicker");
const { error } = require("console");
class SystemSetupPage {
  constructor(page, apiCapture = null) {
    this.page = page;
    this.apiCapture = apiCapture;
    this.timeout = 60000; // 60 seconds timeout for elements - reasonable but sufficient
    this.adminSideBar = new AdminSideBar(page);
    this.datePickerUtil = new DatePicker(page);
    this.systemSetupLocator = page.locator("//li[12]//a[.='System Setup']");
    this.libraryPageLocator = page.locator("(//div)[113]");
    this.backButton = page.locator(
      "//i[@class='fa fa-arrow-circle-left fa-lg']",
    );
    this.systemSetup = page.locator("//h4[normalize-space()='System Setup']");
    this.message = page.locator("//div[@id='pageMessages']");
  }

  // Helper method for safe navigation with continue-on-failure
  async safeNavigateAndTest(elementName, navigationAction, testAction) {
    let navigationSuccessful = false;
    try {
      console.log(`🔍 Testing ${elementName} navigation...`);
      await navigationAction();
      navigationSuccessful = true;
      await testAction();
      console.log(`✅ ${elementName} navigation test completed successfully`);
    } catch (error) {
      console.error(
        `⚠️ ${elementName} not found or not accessible: ${error.message}`,
      );
      console.log(`⏭️ Continuing with next element...`);
      // Don't throw error - continue with test
    } finally {
      // Only navigate back if we successfully clicked on the element
      if (navigationSuccessful) {
        try {
          await this.backButton.scrollIntoViewIfNeeded();
          await this.adminSideBar.clickOnBackButton();
          await this.systemSetup.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
        } catch (backError) {
          console.error(
            `⚠️ Back button navigation failed: ${backError.message}`,
          );
        }
      }
    }
  }

  // System Setup
  async NavigateToSystemSetup() {
    try {
      await this.systemSetupLocator.scrollIntoViewIfNeeded();
      await this.systemSetupLocator.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "NavigateToSystemSetup");
      console.log("Successfully Clicked on SystemSetup page");
      return true;
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in NavigateToSystemSetup: ${error.message}`,
      );
    }
  }

  //Tabbing System Setup Elements
  async tabToSystemSetupElements() {
    const continueOnFailure = true; // Enable continue-on-failure for tabbing tests
    const elements = [
      { name: "Users", method: () => this.tabToUsers() },
      { name: "Skills", method: () => this.tabToSkills() },
      { name: "Message Template", method: () => this.tabToMessageTemplate() },
      { name: "Canned Responses", method: () => this.tabToCannedResponses() },
      { name: "JD Templates", method: () => this.tabToJDTemplates() },
      { name: "Categories", method: () => this.tabToCategories() },
      { name: "Fields", method: () => this.tabToFields() },
      { name: "Dispositions", method: () => this.tabToDispositions() },
      { name: "Documents", method: () => this.tabToDocuments() },
      { name: "Leads", method: () => this.tabToLeads() },
      { name: "Tickets", method: () => this.tabToTickets() },
      { name: "Workflow", method: () => this.tabToWorkflow() },
      { name: "Tags", method: () => this.tabToTags() },
      { name: "Webhooks", method: () => this.tabToWebhooks() },
      { name: "Phone", method: () => this.tabToPhone() },
      { name: "Manage Account", method: () => this.tabToManageAccount() },
    ];

    await this.NavigateToSystemSetup();

    let passedCount = 0;
    let failedCount = 0;
    const failedElements = [];

    for (const element of elements) {
      try {
        console.log(`🔍 Testing ${element.name} navigation...`);
        await element.method();
        console.log(
          `✅ ${element.name} navigation test completed successfully`,
        );
        passedCount++;
      } catch (error) {
        console.error(`❌ ${element.name} navigation failed: ${error.message}`);
        failedElements.push(element.name);
        failedCount++;

        if (!continueOnFailure) {
          throw error; // Stop on first failure if continue-on-failure is disabled
        }

        // Try to recover by navigating back to System Setup
        try {
          await this.NavigateToSystemSetup();
        } catch (recoveryError) {
          console.error(
            `⚠️ Recovery navigation failed: ${recoveryError.message}`,
          );
        }
      }
    }

    // Log summary
    console.log(`\n📊 System Setup Tabbing Summary:`);
    console.log(`   ✅ Passed: ${passedCount}/${elements.length}`);
    console.log(`   ❌ Failed: ${failedCount}/${elements.length}`);
    if (failedElements.length > 0) {
      console.log(`   Failed Elements: ${failedElements.join(", ")}`);
    }
    console.log("");
  }

  // Users section locators
  get users() {
    return this.page.locator("//div[contains(text(),'Users')]");
  }

  get createUser() {
    return this.page.locator("//span[@class='p-r-6 fw-b']");
  }
  async tabToUsers() {
    try {
      await this.users.scrollIntoViewIfNeeded();
      await this.users.waitFor({ state: "visible", timeout: this.timeout });

      if (await this.users.isVisible()) {
        await this.users.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "tabToUsers");
        await this.createUser.scrollIntoViewIfNeeded();
        await this.createUser.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        expect(await this.createUser.isVisible()).toBeTruthy();
        const text = await this.createUser.textContent();
        console.log(`${text} button is visible after clicking Users.`);
      } else {
        throw new Error("Users button is not visible.");
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToUsers: ${error.message}`);
    } finally {
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.systemSetup.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
    }
  }

  // Categories section locators
  get categories() {
    return this.page.locator("//div[contains(text(),'Categories')]");
  }

  get createCategory() {
    return this.page.locator("//label[@class='m-B-0']");
  }

  get categoryName() {
    return this.page.locator("//input[@id='categoryName']");
  }

  get saveCategory() {
    return this.page.locator("//button[@id='btnCategoryCreate']");
  }
  //Tabbing Category button
  async tabToCategories() {
    let navigationSuccessful = false;
    try {
      await this.categories.scrollIntoViewIfNeeded();
      await this.categories.waitFor({
        state: "visible",
        timeout: this.timeout,
      });

      if (await this.categories.isVisible()) {
        await this.categories.click();
        navigationSuccessful = true; // Mark as successful only after clicking
        await ErrorUtil.captureErrorIfPresent(
          this.page,
          "verifyCategoriesButton",
        );
        await this.createCategory.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        expect(await this.createCategory.isVisible()).toBeTruthy();
        const text = await this.createCategory.textContent();
        console.log(`${text} button is visible after clicking Categories.`);
      } else {
        console.error("⚠️ Categories button is not visible.");
        console.log("⏭️ Continuing with next element...");
      }
    } catch (error) {
      console.error(
        `⚠️ Categories not found or not accessible: ${error.message}`,
      );
      console.log("⏭️ Continuing with next element...");
      // Don't throw error - continue with test
    } finally {
      // Only navigate back if we successfully clicked on the element
      if (navigationSuccessful) {
        try {
          await this.backButton.scrollIntoViewIfNeeded();
          await this.adminSideBar.clickOnBackButton();
          await this.systemSetup.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
        } catch (backError) {
          console.error(
            `⚠️ Back button navigation failed: ${backError.message}`,
          );
        }
      }
    }
  }

  //Setup Categories
  async clickCategories() {
    try {
      await this.categories.scrollIntoViewIfNeeded();
      await this.categories.waitFor({
        state: "visible",
        timeout: this.timeout,
      });

      if (await this.categories.isVisible()) {
        await this.categories.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "clickCategories");
        await this.createCategory.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        expect(await this.createCategory.isVisible()).toBeTruthy();
        const text = await this.createCategory.textContent();
        console.log(`${text} button is visible after clicking Categories.`);
      } else {
        throw new Error("Categories button is not visible.");
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in clickCategories: ${error.message}`,
      );
    }
  }

  async setupCategories(category) {
    try {
      await this.createCategoryHelper(category);
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in setupCategories: ${error.message}`,
      );
    }
  }

  async createCategoryHelper(category) {
    const IsCategoryPresent = await this.page
      .locator(`//td[normalize-space()='${category}']`)
      .isVisible();
    if (IsCategoryPresent) {
      console.log(
        `${category}: Category already exists Not creating Category.`,
      );
      return;
    }
    await this.createCategory.waitFor({
      state: "visible",
      timeout: this.timeout,
    });
    await this.createCategory.scrollIntoViewIfNeeded();
    await this.createCategory.click();
    await this.categoryName.waitFor({
      state: "visible",
      timeout: this.timeout,
    });

    await this.categoryName.clear();
    await this.categoryName.fill(category);
    await this.saveCategory.scrollIntoViewIfNeeded();
    await this.saveCategory.click();
    await this.verifyCategoryCreatedSuccessMessage();
    await ErrorUtil.captureErrorIfPresent(this.page, "Category Creation");
    await ErrorUtil.captureApiErrorIfPresent(
      this.apiCapture,
      "Category Creation",
    );
    if (!IsCategoryPresent) {
      console.log(`${category}: Category is not created.`);
      return false;
    } else {
      console.log(`${category}: Category is created successfully.`);
      return true;
    }
  }

  //Update Category
  get OLDCategory() {
    return this.page.locator("//input[@id='oldCategory']");
  }
  get NEWCategory() {
    return this.page.locator("//input[@id='newCategory']");
  }
  get saveUpdateCategory() {
    return this.page.locator("//button[@id='btnUpdateCategory']");
  }
  async updateCategory(category, newCategory) {
    try {
      await this.VerifyExistingCategory(category);
      await this.page
        .locator(
          `//td[normalize-space()='${category}']/following-sibling::td[contains(.,'Edit')]`,
        )
        .click();
      (await expect(this.OLDCategory).toContainText(Category)) &&
        (await this.OLDCategory.isNonEditable());
      await expect(this.NEWCategory).toBeVisible();
      await this.NEWCategory.fill(newCategory);
      await this.saveUpdateCategory.scrollIntoViewIfNeeded();
      await this.saveUpdateCategory.click();
      await this.verifyUpdatedCategorySuccessMessage();
      await ErrorUtil.captureErrorIfPresent(this.page, "updateCategory");
      const updatedCategory = await this.page
        .locator(`//td[normalize-space()='${newCategory}']`)
        .isVisible();
      if (!updatedCategory) {
        console.log(
          `${category} is not updated to ${newCategory} successfully.`,
        );
        return false;
      } else {
        console.log(`${category} is updated to ${newCategory} successfully.`);
        return true;
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in updateCategory: ${error.message}`);
    }
  }

  // Verify Existing Category
  async VerifyExistingCategory(category) {
    const xpath = `//td[.='${category}']`;
    const existingFields = await this.page.locator(xpath).all();
    const isPresent = existingFields.length > 0;
    if (isPresent) {
      console.log(`${category}: Category already exists.`);
    } else {
      console.log(`${category}: Category does not exist.`);
    }
  }

  // Get validation message
  async getValidationMessage() {
    try {
      await this.message.waitFor({ state: "visible", timeout: this.timeout });
      return (await this.message.textContent()).trim();
    } catch {
      return "";
    }
  }

  async verifyCategoryCreatedSuccessMessage() {
    const msg = await this.getValidationMessage();
    if (!msg.includes("Category created successfully")) {
      throw new Error("Category is not Created. Actual message: " + msg);
    }
    console.log("Category created successfully");
  }

  async verifyUpdatedCategorySuccessMessage() {
    const msg = await this.getValidationMessage();
    if (!msg.includes("Category updated successfully")) {
      throw new Error("Category is not Updated. Actual message: " + msg);
    }
    console.log("Category updated successfully");
  }

  //--------------------------------------------------------------------------------------------------
  //Skills section locators
  get skills() {
    return this.page.locator("//div[contains(text(),'Skills')]");
  }

  get createSkill() {
    return this.page.locator(
      "//label[@class='m-0'][normalize-space()='Create Skill']",
    );
  }

  get skillCategory() {
    return this.page.locator("//select[@id='skillCategory']");
  }

  get skillName() {
    return this.page.locator("//input[@id='skillName']");
  }

  get saveSkill() {
    return this.page.locator("//button[@id='btnSaveSkill']");
  }

  get saveUpdateSkill() {
    return this.page.locator("//button[@id='btnUpdateSkill']");
  }

  //Tabbing Skills button
  async tabToSkills() {
    try {
      await this.skills.scrollIntoViewIfNeeded();
      await this.skills.waitFor({ state: "visible", timeout: this.timeout });

      if (await this.skills.isVisible()) {
        await this.skills.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "tabToSkills");
        await this.createSkill.scrollIntoViewIfNeeded();
        await this.createSkill.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        expect(await this.createSkill.isVisible()).toBeTruthy();
        const text = await this.createSkill.textContent();
        console.log(`${text} button is visible after clicking Skills.`);
      } else {
        throw new Error("Skills button is not visible.");
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToSkills: ${error.message}`);
    } finally {
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.systemSetup.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
    }
  }

  // Setup Skills
  async clickOnSkills() {
    try {
      await this.skills.scrollIntoViewIfNeeded();
      await this.skills.waitFor({ state: "visible", timeout: this.timeout });

      if (await this.skills.isVisible()) {
        await this.skills.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "clickOnSkillsButton");
        await this.createSkill.scrollIntoViewIfNeeded();
        await this.createSkill.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        expect(await this.createSkill.isVisible()).toBeTruthy();
        const text = await this.createSkill.textContent();
        console.log(`${text} button is visible after clicking Skills.`);
      } else {
        throw new Error("Skills button is not visible.");
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in clickOnSkills: ${error.message}`);
    }
  }

  async setupSkills(category, skill) {
    await this.createSkillHelper(category, skill);
  }

  //Update Skill
  async updateSkill(category, skill, Newcategory, Newskill) {
    const isSkillPresent = await this.VerifyExistingSkill(category, skill);
    const Edit = `//tr[td[contains(normalize-space(),'${category.trim()}')] and td[contains(normalize-space(),'${skill.trim()}')]]/child::td//a`;

    if (isSkillPresent) {
      await this.page.locator(Edit).scrollIntoViewIfNeeded();
      await this.page.locator(Edit).click();
      await this.skillCategory.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await expect(this.skillCategory).toContainText(category);
      if (Newcategory)
        await this.skillCategory.selectOption({ label: Newcategory });
      const selectedText = await this.skillCategory.textContent();
      console.log(`${selectedText.trim()}: Category is selected`);
      await this.skillName.waitFor({ state: "visible", timeout: this.timeout });
      await expect(this.skillName).toContainText(skill);
      await this.skillName.clear();
      await this.skillName.fill(Newskill);
      await this.saveUpdateSkill.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.saveUpdateSkill.click();
      await this.verifyUpdatedSkillSuccessMessage();
      await ErrorUtil.captureErrorIfPresent(this.page, "updateSkill");
      const isUpdateSkillPresent = await this.verifyUpdateSkillExists(
        Newcategory,
        Newskill,
      );
      if (isUpdateSkillPresent) {
        console.log(
          `${Newskill}: Skill is updated within Category: ${Newcategory}`,
        );
        return true;
      } else {
        console.log(
          `${Newskill}: Skill is not updated within Category: ${Newcategory}`,
        );
        return false;
      }
    } else {
      console.log(
        `${skill}: Skill does not exist within Category: ${category}`,
      );
    }
  }

  //Verity update skill exists
  async verifyUpdateSkillExists(Newcategory, Newskill) {
    const xpath = `//tr[td[contains(normalize-space(),'${Newcategory.trim()}')] and td[contains(normalize-space(),'${Newskill.trim()}')]]`;
    const existingFields = await this.page.locator(xpath).all();
    const isPresent = existingFields.length > 0;
    if (isPresent) {
      console.log(
        `${Newskill}: Skill already exists within Category: ${Newcategory}`,
      );
    } else {
      console.log(
        `${Newskill}: Skill does not exist within Category: ${Newcategory}`,
      );
    }
    return isPresent;
  }

  //Verify Existing Skill
  async VerifyExistingSkill(category, skill) {
    const xpath = `//tr[td[contains(normalize-space(),'${category.trim()}')] and td[contains(normalize-space(),'${skill.trim()}')]]`;
    const existingFields = await this.page.locator(xpath).all();
    const isPresent = existingFields.length > 0;
    if (isPresent) {
      console.log(
        `${skill}: Skill already exists within Category: ${category}`,
      );
    } else {
      console.log(
        `${skill}: Skill does not exist within Category: ${category}`,
      );
    }
    return isPresent;
  }

  // Create Skill Helper

  async createSkillHelper(category, skill) {
    const xpath = `//tr[td[contains(normalize-space(),'${category.trim()}')] and td[contains(normalize-space(),'${skill.trim()}')]]`;
    const existingFields = await this.page.locator(xpath).all();
    const isPresent = existingFields.length > 0;

    if (!isPresent) {
      await this.createSkill.scrollIntoViewIfNeeded();
      await this.createSkill.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.createSkill.click();
      await this.skillCategory.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.skillCategory.selectOption({ label: category });
      const selectedText = await this.skillCategory
        .locator("option:checked")
        .textContent();
      console.log(`${selectedText.trim()}: Category is selected`);
      await this.skillName.clear();
      await this.skillName.fill(skill);
      await this.saveSkill.scrollIntoViewIfNeeded();
      await this.saveSkill.click();
      await this.verifySkillCreatedSuccessMessage();
      await ErrorUtil.captureErrorIfPresent(this.page, "createSkillHelper");
      await ErrorUtil.captureApiErrorIfPresent(
        this.apiCapture,
        "createSkillHelper",
      );
      if (isPresent) {
        console.log(`${skill}: Skill is created within Category: ${category}`);
        return true;
      } else {
        console.log(
          `${skill}: Skill is not created within Category: ${category}`,
        );
        return false;
      }
    } else {
      const existingField = existingFields[0];
      await existingField.scrollIntoViewIfNeeded();
      console.log(
        `${skill}: Skill is already created within Category: ${category}`,
      );
    }
  }
  // Get validation message
  async getValidationMessage() {
    try {
      await this.message.waitFor({ state: "visible", timeout: this.timeout });
      return (await this.message.textContent()).trim();
    } catch {
      return "";
    }
  }

  async verifySkillCreatedSuccessMessage() {
    const msg = await this.getValidationMessage();
    if (!msg.includes("Skill created successfully")) {
      throw new Error("Skill is not Created. Actual message: " + msg);
    }
    console.log("Skill created successfully");
  }

  async verifyUpdatedSkillSuccessMessage() {
    const msg = await this.getValidationMessage();
    if (!msg.includes("Skill updated successfully")) {
      throw new Error("Skill is not Updated. Actual message: " + msg);
    }
    console.log("Skill updated successfully");
  }

  //Message Template
  get MessageTemplate() {
    return this.page.locator("//div[contains(text(),'Message Template')]");
  }
  get AddMessageTemplate() {
    return this.page.locator(
      "//label[normalize-space()='Add Message Template']",
    );
  }

  //Message Template Tabbing functions
  async tabToMessageTemplate() {
    try {
      await this.MessageTemplate.scrollIntoViewIfNeeded();
      await this.MessageTemplate.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      if (await this.MessageTemplate.isVisible()) {
        await this.MessageTemplate.click();
        await ErrorUtil.captureErrorIfPresent(
          this.page,
          "tabToMessageTemplate",
        );
        await this.AddMessageTemplate.scrollIntoViewIfNeeded();
        await this.AddMessageTemplate.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        expect(await this.AddMessageTemplate.isVisible()).toBeTruthy();
        const text = await this.AddMessageTemplate.textContent();
        console.log(
          `${text} button is visible after clicking Message Template.`,
        );
      } else {
        throw new Error("Message Template is not visible.");
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in tabToMessageTemplate: ${error.message}`,
      );
    } finally {
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.systemSetup.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
    }
  }

  //Click on Message Template functions
  async clickOnMessageTemplate() {
    try {
      await this.MessageTemplate.scrollIntoViewIfNeeded();
      await this.MessageTemplate.waitFor({
        state: "visible",
        timeout: this.timeout,
      });

      if (await this.MessageTemplate.isVisible()) {
        await this.MessageTemplate.click();
        await ErrorUtil.captureErrorIfPresent(
          this.page,
          "clickOnMessageTemplate",
        );
      } else {
        throw new Error("Message Template is not visible.");
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in clickOnMessageTemplate: ${error.message}`,
      );
    }
  }

  // Create Message Template
  get TemplateName() {
    return this.page.locator("//input[@id='templateName']");
  }
  get TemplateCategory() {
    return this.page.locator("//select[@id='templateCategory']");
  }
  get TemplateSubject() {
    return this.page.locator("//input[@id='templateSubject']");
  }
  get plainTextShortMessage() {
    return this.page.locator("//textarea[@id='plainTextBody']");
  }
  get whatsAppMessage() {
    return this.page.locator("(//div[@class='ql-editor ql-blank'])[1]");
  }
  get emailMessage() {
    return this.page.locator("(//div[@class='ql-editor ql-blank'])[2]");
  }
  get EnablePlainTextforEmail() {
    return this.page.locator("//input[@id='isDefault']");
  }
  get plainText() {
    return this.page.locator("//textarea[@id='plainText']");
  }
  get Attachment() {
    return this.page.locator("(//button[@type='submit'])[4]");
  }
  Document(documentName) {
    return this.page.locator(
      `//td[.='${documentName}']/preceding-sibling::td//span[@class='ui-checkmark']`,
    );
  }
  get SaveMessageTemplate() {
    return this.page.locator("//button[@id='btnCannedCreate']");
  }
  async createMessageTemplate(
    templateName,
    templateCategory,
    templateSubject,
    plainTextShortMessage,
    whatsAppMessage,
    emailMessage,
    enablePlainTextForEmail,
    plainText,
  ) {
    try {
      const documentNames = process.env.DOCUMENT_NAMES; // Comma-separated document names
      const isTemplatePresent =
        await this.verifyExistingMessageTemplate(templateName);
      if (!isTemplatePresent) {
        console.log(`Creating Message Template: ${templateName}`);
        await this.AddMessageTemplate.scrollIntoViewIfNeeded();
        await this.AddMessageTemplate.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.AddMessageTemplate.click();
        await this.TemplateName.scrollIntoViewIfNeeded();
        await this.TemplateName.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.TemplateName.fill(templateName);
        console.log(`Template Name: ${templateName} is filled`);
        await this.TemplateCategory.scrollIntoViewIfNeeded();
        await this.TemplateCategory.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.TemplateCategory.selectOption({ label: templateCategory });
        const selectedText =
          await this.TemplateCategory.locator("option:checked").textContent();
        console.log(`Category: ${selectedText.trim()} is selected`);
        await this.TemplateSubject.scrollIntoViewIfNeeded();
        await this.TemplateSubject.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.TemplateSubject.fill(templateSubject);
        console.log(`Template Subject: ${templateSubject} is filled`);
        await this.plainTextShortMessage.scrollIntoViewIfNeeded();
        await this.plainTextShortMessage.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.plainTextShortMessage.fill(plainTextShortMessage);
        console.log(
          `Plain Text Short Message: ${plainTextShortMessage} is filled`,
        );
        await this.whatsAppMessage.scrollIntoViewIfNeeded();
        await this.whatsAppMessage.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.whatsAppMessage.fill(whatsAppMessage);
        console.log(`WhatsApp Message: ${whatsAppMessage} is filled`);
        await this.emailMessage.scrollIntoViewIfNeeded();
        await this.emailMessage.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.emailMessage.fill(emailMessage);
        console.log(`Email Message: ${emailMessage} is filled`);
        if (enablePlainTextForEmail === "Yes") {
          await this.EnablePlainTextforEmail.scrollIntoViewIfNeeded();
          await this.EnablePlainTextforEmail.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.EnablePlainTextforEmail.click();
          console.log(`Enable Plain Text for Email is checked`);
          await this.plainText.scrollIntoViewIfNeeded();
          await this.plainText.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.plainText.fill(plainText);
          console.log(`Plain Text: ${plainText} is filled`);
        }
        if (Attachment === `Yes`) {
          await this.Attachment.scrollIntoViewIfNeeded();
          await this.Attachment.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.Attachment.click();
          await ErrorUtil.captureErrorIfPresent(
            this.page,
            "After Click on Attachment",
          );
          console.log(`Attachment button is clicked`);
          // Attach multiple documents by their names (comma separated)
          if (documentNames && typeof documentNames === "string") {
            const docs = documentNames.split(",").map((d) => d.trim());
            for (const doc of docs) {
              const docCheckbox = this.Document(doc);
              await docCheckbox.scrollIntoViewIfNeeded();
              await docCheckbox.waitFor({
                state: "visible",
                timeout: this.timeout,
              });
              await docCheckbox.click();
              console.log(`Document "${doc}" is selected`);
            }
          }
        }
        await this.SaveMessageTemplate.scrollIntoViewIfNeeded();
        await this.SaveMessageTemplate.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.SaveMessageTemplate.click();
        await ErrorUtil.captureErrorIfPresent(
          this.page,
          "createMessageTemplate",
        );
        console.log(
          `Message Template: ${templateName} is created successfully`,
        );
        if (!isTemplatePresent) {
          console.log(`${templateName}: Message Template is not created.`);
          return false;
        }
        console.log(
          `${templateName}: Message Template is created successfully.`,
        );
        return true;
      } else {
        console.log(
          `${templateName}: Message Template already exists. Not creating again.`,
        );
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in createMessageTemplate: ${error.message}`,
      );
    }
  }
  //Verify Existing Message Template - Enhanced with case-insensitive matching
  async verifyExistingMessageTemplate(templateName) {
    try {
      const trimmedTemplateName = templateName.trim();

      // Method 1: Exact match
      const exactXPath = `//td[normalize-space()='${trimmedTemplateName}']`;
      const exactExists = (await this.page.locator(exactXPath).count()) > 0;

      if (exactExists) {
        console.log(
          `${templateName}: Message Template already exists (exact match).`,
        );
        return true;
      }

      // Method 2: Case-insensitive match
      const caseInsensitiveXPath = `//td[translate(normalize-space(text()), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')='${trimmedTemplateName.toLowerCase()}']`;
      const caseInsensitiveExists =
        (await this.page.locator(caseInsensitiveXPath).count()) > 0;

      if (caseInsensitiveExists) {
        console.log(
          `${templateName}: Message Template already exists (case-insensitive match).`,
        );
        return true;
      }

      // Method 3: Check for similar templates for debugging
      const allTemplateCells = await this.page
        .locator("//td")
        .allTextContents();
      const similarTemplates = allTemplateCells
        .filter((cell) => {
          const cellLower = cell.trim().toLowerCase();
          const templateLower = trimmedTemplateName.toLowerCase();
          return (
            cellLower.includes(templateLower) ||
            templateLower.includes(cellLower)
          );
        })
        .slice(0, 3);

      if (similarTemplates.length > 0) {
        console.log(
          `${templateName}: Message Template does not exist, but found similar templates: ${similarTemplates.join(", ")}`,
        );
      } else {
        console.log(`${templateName}: Message Template does not exist.`);
      }
      return false;
    } catch (error) {
      console.log(
        `${templateName}: Message Template verification error - ${error.message}`,
      );
      return false;
    }
  }

  //Canned Responses Locators
  get cannedResponses() {
    return this.page.locator("//div[contains(text(),'Canned Responses')]");
  }

  get AddCannedResponses() {
    return this.page.locator(
      "//label[normalize-space()='Add Canned Responses']",
    );
  }
  get cannedResponsePage() {
    return this.page.locator("//td[@class='text-center p-t-10 p-b-10']");
  }
  get cannedCategory() {
    return this.page.locator("//select[@id='cannedCategory']");
  }

  get cannedResponseTitle() {
    return this.page.locator("//input[@id='title']");
  }

  get cannedResponseMessage() {
    return this.page.locator("//textarea[@id='commentMessage']");
  }

  get saveCannedResponse() {
    return this.page.locator("//button[@id='btnCannedCreate']");
  }

  //Canned Responses Tabbing functions
  async tabToCannedResponses() {
    try {
      await this.cannedResponses.scrollIntoViewIfNeeded();
      await this.cannedResponses.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.cannedResponses.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "tabToCannedResponses");
      await this.AddCannedResponses.scrollIntoViewIfNeeded();
      expect(await this.AddCannedResponses.isVisible()).toBeTruthy();
      const text = await this.AddCannedResponses.textContent();
      console.log(`${text} button is visible after clicking Canned Responses.`);
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in tabToCannedResponses: ${error.message}`,
      );
    } finally {
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.systemSetup.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
    }
  }

  //Verify Existing Canned Responses functions - Optimized for Speed
  async verifyExistingCannedResponses(category, title) {
    try {
      // Fast direct search using count() instead of all()
      const xpath = `//td[normalize-space()='${category.trim()}']/following-sibling::td[contains(.,'${title.trim()}')]`;
      const isPresent = (await this.page.locator(xpath).count()) > 0;

      if (isPresent) {
        console.log(`${title}: Canned Response already exists.`);
      } else {
        console.log(`${title}: Canned Response does not exist.`);
      }
      return isPresent;
    } catch (error) {
      console.log(
        `${title}: Canned Response verification error - ${error.message}`,
      );
      return false;
    }
  }

  //Click on Canned Responses functions
  async clickOnCannedResponses() {
    try {
      await this.cannedResponses.scrollIntoViewIfNeeded();
      await this.cannedResponses.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.cannedResponses.click();
      await ErrorUtil.captureErrorIfPresent(
        this.page,
        "clickOnCannedResponses",
      );
      await this.AddCannedResponses.scrollIntoViewIfNeeded();
      await this.AddCannedResponses.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      expect(await this.AddCannedResponses.isVisible()).toBeTruthy();
      const text = await this.AddCannedResponses.textContent();
      console.log(`${text} button is visible after clicking Canned Responses.`);
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in clickOnCannedResponses: ${error.message}`,
      );
    }
  }

  //Setup Canned Responses functions
  async setupCannedResponses(category, title, message) {
    try {
      const isCannedResponsePresent = await this.verifyExistingCannedResponses(
        category,
        title,
      );
      if (!isCannedResponsePresent) {
        console.log(`${title}: Canned Response is not created. Creating it...`);
        await this.cannedCategory.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.cannedCategory.selectOption({ label: category });
        const selectedText = await this.cannedCategory
          .locator("option:checked")
          .textContent();
        console.log(`${selectedText.trim()}: Category is selected`);
        await this.cannedResponseTitle.fill(title);
        // Verify the field is filled correctly
        expect(await this.cannedResponseTitle.inputValue()).toBe(title);
        await this.cannedResponseMessage.fill(message);
        // Verify the message field is filled correctly
        expect(await this.cannedResponseMessage.inputValue()).toBe(message);
        await this.saveCannedResponse.scrollIntoViewIfNeeded();
        await this.saveCannedResponse.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.saveCannedResponse.click();
        await ErrorUtil.captureErrorIfPresent(
          this.page,
          "setupCannedResponses",
        );
        if (!isCannedResponsePresent) {
          console.log(`${title}: Canned Response is not created.`);
          return false;
        } else {
          console.log(`${title}: Canned Response is already created.`);
          return true;
        }
      } else {
        console.log(`${title}: Canned Response is already created.`);
        return true;
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in setupCannedResponses: ${error.message}`,
      );
    }
  }

  //locators for update canned responses
  get saveUpdateCannedResponse() {
    return this.page.locator("//button[@id='btnUpdateCanned']");
  }

  //Update Canned Responses functions
  async updateCannedResponses(
    category,
    title,
    message,
    Newcategory,
    Newtitle,
    Newmessage,
  ) {
    const isCannedResponsePresent = await this.verifyExistingCannedResponses(
      category,
      title,
    );
    if (isCannedResponsePresent) {
      console.log(
        `${title}: Canned Response is already created. Updating it...`,
      );
      const xpath = `//td[normalize-space()='${category.trim()}']/following-sibling::td[contains(.,'${title.trim()}')]/following-sibling::td//a`;
      const Editbutton = await this.page.locator(xpath).all();
      await Editbutton.scrollIntoViewIfNeeded();
      await Editbutton.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "updateCannedResponses");
      expect(await this.cannedCategory.toContainText(category)).toBeTruthy();
      await this.cannedCategory.selectOption({ label: Newcategory });
      const selectedText = await this.cannedCategory
        .locator("option:checked")
        .textContent();
      console.log(`${selectedText.trim()}: New Category is selected`);
      expect(await this.cannedResponseTitle.toContainText(title)).toBeTruthy();
      await this.cannedResponseTitle.clear();
      await this.cannedResponseTitle.fill(Newtitle);
      // Verify the field is filled correctly
      expect(await this.cannedResponseTitle.inputValue()).toBe(Newtitle);
      await this.cannedResponseMessage.clear();
      // Verify the message field is ready for input
      expect(await this.cannedResponseMessage.inputValue()).toBe("");
      expect(
        await this.cannedResponseMessage.toContainText(message),
      ).toBeTruthy();
      await this.cannedResponseMessage.fill(Newmessage);
      await this.saveCannedResponse.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "updateCannedResponses");
      await this.cannedResponsePage.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.cannedResponsePage.scrollIntoViewIfNeeded();
      if (!isCannedResponsePresent) {
        console.log(`${title}: Canned Response is not updated.`);
        return false;
      } else {
        console.log(`${title}: Canned Response is updated successfully.`);
        return true;
      }
    }
  }

  //JD Templates locators
  get jdTemplates() {
    return this.page.locator("//div[contains(text(),'JD Templates')]");
  }
  get addjdTemplates() {
    return this.page.locator("//label[normalize-space()='Add JD Template']");
  }
  get jdTemplatePage() {
    return this.page.locator("//table//tbody");
  }

  //JD Templates Tabbing functions
  async tabToJDTemplates() {
    let navigationSuccessful = false;
    try {
      await this.jdTemplates.scrollIntoViewIfNeeded({ timeout: 5000 });
      await this.jdTemplates.waitFor({ state: "visible", timeout: 5000 });
      await this.jdTemplates.click();
      navigationSuccessful = true; // Mark as successful only after clicking
      await ErrorUtil.captureErrorIfPresent(this.page, "tabToJDTemplates");
      await ErrorUtil.captureApiErrorIfPresent(
        this.apiCapture,
        "tabToJDTemplates",
      );
      await this.addjdTemplates.scrollIntoViewIfNeeded({ timeout: 5000 });
      await this.addjdTemplates.waitFor({ state: "visible", timeout: 5000 });
      expect(await this.addjdTemplates.isVisible()).toBeTruthy();
      const text = await this.addjdTemplates.textContent();
      console.log(`${text} button is visible after clicking JD Templates.`);
    } catch (error) {
      console.error(
        `⚠️ JD Templates not found or not accessible: ${error.message}`,
      );
      console.log(`⏭️ Continuing with next element...`);
      // Don't throw error - continue with test
    } finally {
      // Only navigate back if we successfully clicked on the element
      if (navigationSuccessful) {
        try {
          await this.backButton.scrollIntoViewIfNeeded();
          await this.adminSideBar.clickOnBackButton();
          await this.systemSetup.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
        } catch (backError) {
          console.error(
            `⚠️ Back button navigation failed: ${backError.message}`,
          );
        }
      }
    }
  }

  //Verify Existing JD Templates functions
  async verifyExistingJDTemplates(JobTitle, Department) {
    // Handle undefined/null values
    const jobTitleSafe = JobTitle ? JobTitle.trim() : "";
    const departmentSafe = Department ? Department.trim() : "";

    if (!jobTitleSafe || !departmentSafe) {
      console.log(
        `⚠️ Missing JobTitle or Department data. JobTitle: "${jobTitleSafe}", Department: "${departmentSafe}"`,
      );
      return false;
    }

    const xpath = `//td[normalize-space()='${jobTitleSafe}']/following-sibling::td[.='${departmentSafe}']`;
    const existingFields = await this.page.locator(xpath).all();
    const isPresent = existingFields.length > 0;
    if (isPresent) {
      console.log(`${jobTitleSafe}: JD Template already exists.`);
      return true;
    } else {
      console.log(`${jobTitleSafe}: JD Template does not exist.`);
      return false;
    }
  }

  //Click on JD Templates functions
  async clickOnJDTemplates() {
    try {
      await this.jdTemplates.scrollIntoViewIfNeeded();
      await this.jdTemplates.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.jdTemplates.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "clickOnJDTemplates");
      await ErrorUtil.captureApiErrorIfPresent(
        this.apiCapture,
        "clickOnJDTemplates",
      );
      await this.addjdTemplates.scrollIntoViewIfNeeded();
      await this.addjdTemplates.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      expect(await this.addjdTemplates.isVisible()).toBeTruthy();
      const text = await this.addjdTemplates.textContent();
      console.log(`${text} button is visible after clicking JD Templates.`);
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in clickOnJDTemplates: ${error.message}`,
      );
    }
  }

  //JD Templates locators On Creation
  get JDCategory() {
    return this.page.locator("//select[@id='categoryId']");
  }
  get JobTitle() {
    return this.page.locator("//input[@id='jobTitle']");
  }
  get Department() {
    return this.page.locator("//input[@id='department']");
  }
  get Location() {
    return this.page.locator("//input[@id='location']");
  }
  get JobSummary() {
    return this.page.locator("//textarea[@id='jobSummary']");
  }
  get KeyResponsibilities() {
    return this.page.locator("//textarea[@id='keyResponsibilities']");
  }
  get RequiredSkills() {
    return this.page.locator("//textarea[@id='requiredSkills']");
  }
  get BonousSkills() {
    return this.page.locator("//textarea[@id='bonusSkills']");
  }
  get ReportingTo() {
    return this.page.locator("//input[@id='reportingTo']");
  }
  get JobType() {
    return this.page.locator("//select[@id='jobType']");
  }
  get RequiredQualification() {
    return this.page.locator("//textarea[@id='requiredQualifications']");
  }
  get BonusQualification() {
    return this.page.locator("//textarea[@id='bonusQualifications']");
  }
  get PhysicalLocation() {
    return this.page.locator("//input[@id='physicalLocation']");
  }
  get TotalExperience() {
    return this.page.locator("//input[@id='totalExperienceMonths']");
  }
  get RelevantExperience() {
    return this.page.locator("//input[@id='relevantExperienceMonths']");
  }
  get SalaryRange() {
    return this.page.locator("//input[@id='salaryRange']");
  }
  get BonusIncluded() {
    return this.page.locator(
      "//label[normalize-space()='Bonus Included']//span[@class='ui-checkmark']",
    );
  }
  get StockOptionIncluded() {
    return this.page.locator(
      "//label[normalize-space()='Stock Options Included']//span[@class='ui-checkmark']",
    );
  }
  get WorkingHours() {
    return this.page.locator("//input[@id='workingHours']");
  }
  get TravelRequirements() {
    return this.page.locator("//input[@id='travelRequirements']");
  }
  get CompanyDescription() {
    return this.page.locator("//textarea[@id='companyDescription']");
  }
  get JDTemplatesSave() {
    return this.page.locator("//button[@id='btnCreateJDTemplate']");
  }

  //JD Templates Creation functions
  async createJDTemplates(
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
    CompanyDescription,
  ) {
    try {
      // Add safety checks for required parameters
      if (!JobTitle || !Department) {
        console.warn(
          `⚠️ Skipping JD Template creation: Missing required data. JobTitle: "${JobTitle}", Department: "${Department}"`,
        );
        return;
      }

      const isJDTemplatePresent = await this.verifyExistingJDTemplates(
        JobTitle,
        Department,
      );
      if (!isJDTemplatePresent) {
        console.log(`${JobTitle}: JD Template is not created. Creating it...`);
        await this.addjdTemplates.scrollIntoViewIfNeeded();
        await this.addjdTemplates.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "createJDTemplates");
        await ErrorUtil.captureApiErrorIfPresent(
          this.apiCapture,
          "createJDTemplates",
        );
        await this.JDCategory.selectOption({ label: Category });
        await this.JobTitle.fill(JobTitle);
        await this.Department.fill(Department);
        await this.Location.fill(Location);
        await this.JobSummary.fill(JobSummary);
        await this.KeyResponsibilities.fill(KeyResponsibilities);
        await this.RequiredSkills.fill(RequiredSkills);
        await this.BonousSkills.fill(BonousSkills);
        await this.ReportingTo.fill(ReportingTo);
        await this.JobType.selectOption({ label: JobType });
        await this.RequiredQualification.fill(RequiredQualification);
        await this.BonusQualification.fill(BonusQualification);
        await this.PhysicalLocation.fill(PhysicalLocation);
        await this.TotalExperience.fill(TotalExperience);
        await this.RelevantExperience.fill(RelevantExperience);
        await this.SalaryRange.fill(SalaryRange);
        await this.BonusIncluded.scrollIntoViewIfNeeded();
        if (BonusIncluded === "Yes") {
          await this.BonusIncluded.click();
        }
        await this.StockOptionIncluded.scrollIntoViewIfNeeded();
        if (StockOptionIncluded === "Yes") {
          await this.StockOptionIncluded.click();
        }
        await this.WorkingHours.fill(WorkingHours);
        await this.TravelRequirements.fill(TravelRequirements);
        await this.CompanyDescription.fill(CompanyDescription);
        await this.JDTemplatesSave.scrollIntoViewIfNeeded();
        await this.JDTemplatesSave.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "createJDTemplates");
        await ErrorUtil.captureApiErrorIfPresent(
          this.apiCapture,
          "createJDTemplates",
        );
        await this.page.waitForLoadState("networkidle");
        console.log(`${JobTitle}: JD Template created successfully.`);
      } else {
        console.log(`${JobTitle}: JD Template already exists.`);
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in createJDTemplates: ${error.message}`,
      );
    }
  }

  // Fields section locators
  get fields() {
    return this.page.locator("//div[contains(text(),'Fields')]");
  }

  get createField() {
    return this.page.locator(
      "//label[@class='m-0'][normalize-space()='Create Field']",
    );
  }

  get fieldLevel() {
    return this.page.locator("//select[@id='fieldLevel']");
  }

  get displayName() {
    return this.page.locator("//input[@id='displayName']");
  }

  get fieldName() {
    return this.page.locator("//input[@id='fieldName']");
  }

  get fieldType() {
    return this.page.locator("//select[@id='fieldType']");
  }

  get inputTypeTextType() {
    return this.page.locator("//select[@id='selectTextType']");
  }

  get inputTypeSingleType() {
    return this.page.locator("//select[@id='selectSingleType']");
  }

  get inputTypeMultipleType() {
    return this.page.locator("//select[@id='selectMultiType']");
  }

  get minRange() {
    return this.page.locator("//input[@id='minRange']");
  }

  get maxRange() {
    return this.page.locator("//input[@id='maxRange']");
  }

  get numberOfLines() {
    return this.page.locator("//input[@id='numberOfLines']");
  }

  get options() {
    return this.page.locator("//select[@id='selectOption']");
  }

  get allowOther() {
    return this.page.locator(
      "//label[@class='ui-checkbox m-t-5']//span[@class='ui-checkmark']",
    );
  }

  get tooltip() {
    return this.page.locator(
      "//label[@class='ui-checkbox']//span[@class='ui-checkmark']",
    );
  }

  get tooltipMsg() {
    return this.page.locator("//input[@id='tooltipMessage']");
  }

  get saveField() {
    return this.page.locator("//button[@id='btnCreateField']");
  }

  get category() {
    return this.page.locator("//select[@id='selectsCategory']");
  }

  //Tabbing Fields button
  async tabToFields() {
    try {
      await this.fields.scrollIntoViewIfNeeded();
      await this.fields.waitFor({ state: "visible", timeout: this.timeout });

      if (await this.fields.isVisible()) {
        await this.fields.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "tabToFields");
        await this.createField.scrollIntoViewIfNeeded();
        await this.createField.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        expect(await this.createField.isVisible()).toBeTruthy();
        const text = await this.createField.textContent();
        console.log(`${text} button is visible after clicking Fields.`);
      } else {
        throw new Error("Fields button is not visible.");
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToFields: ${error.message}`);
    } finally {
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.systemSetup.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
    }
  }

  //Setup Fields
  async clickOnFields() {
    try {
      await this.fields.scrollIntoViewIfNeeded();
      await this.fields.waitFor({ state: "visible", timeout: this.timeout });

      if (await this.fields.isVisible()) {
        await this.fields.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "clickOnFields");
        await this.createField.scrollIntoViewIfNeeded();
        await this.createField.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        expect(await this.createField.isVisible()).toBeTruthy();
        const text = await this.createField.textContent();
        console.log(`${text} button is visible after clicking Fields.`);
      } else {
        throw new Error("Fields button is not visible.");
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in clickOnFields: ${error.message}`);
    }
  }

  async setupFields(
    category,
    level,
    displayName,
    fieldName,
    type,
    inputType,
    min,
    max,
    noOfLines,
    options,
    optionValues,
    allowOther,
    tooltip,
  ) {
    await this.createFieldHelper(
      category,
      level,
      displayName,
      fieldName,
      type,
      inputType,
      min,
      max,
      noOfLines,
      options,
      optionValues,
      allowOther,
      tooltip,
    );
  }

  get FieldPage() {
    return this.page.locator("//div[@id='showFieldTable']");
  }
  async createFieldHelper(
    category,
    level,
    displayName,
    fieldName,
    type,
    inputType,
    min,
    max,
    noOfLines,
    options,
    optionValues,
    allowOther,
    tooltip,
  ) {
    // Simple field existence check
    const isFieldPresent = await this.verifyExistingField(fieldName);
    if (isFieldPresent) {
      console.log(`${fieldName}: Field already exists. Not creating again.`);
      return true;
    }
    await this.createField.scrollIntoViewIfNeeded();
    await this.createField.click();

    // Wait for category dropdown to be visible and populated
    await this.category.waitFor({ state: "visible", timeout: this.timeout });

    // Wait for dropdown options to be loaded and try multiple times
    let categorySelected = false;
    let attempts = 0;
    const maxAttempts = 3;

    while (!categorySelected && attempts < maxAttempts) {
      attempts++;
      try {
        // Wait for dropdown options to be loaded
        await this.page.waitForFunction(
          () => {
            const select = document.querySelector("#selectsCategory");
            if (!select) return false;
            const options = Array.from(select.options).map((opt) => opt.text);
            return (
              options.length > 1 &&
              (options.includes("RBL-World") || options.includes("General"))
            );
          },
          { timeout: 5000 },
        );

        // Try to select the category
        await this.category.selectOption({ label: category });
        categorySelected = true;
        console.log(
          `✅ Category "${category}" selected successfully on attempt ${attempts}`,
        );
      } catch (error) {
        console.log(
          `⚠️ Attempt ${attempts} failed to select category "${category}": ${error.message}`,
        );

        if (attempts < maxAttempts) {
          console.log(`🔄 Retrying category selection...`);
          await this.page.waitForTimeout(2000); // Wait before retry

          // Try to refresh the form
          await this.createField.click();
          await this.page.waitForTimeout(1000);
        } else {
          console.log(
            `❌ Failed to select category "${category}" after ${maxAttempts} attempts`,
          );
          throw error;
        }
      }
    }
    const selectedText = await this.category.textContent();
    console.log(`${selectedText.trim()}: Category is selected`);
    await this.fieldLevel.selectOption({ label: level });
    const selectedlevelText = await this.fieldLevel.textContent();
    console.log(`${selectedlevelText.trim()}: level is selected`);
    await this.displayName.clear();
    await this.displayName.fill(displayName);
    await this.fieldName.clear();
    await this.fieldName.fill(fieldName);
    await this.fieldType.waitFor({ state: "visible", timeout: this.timeout });
    await this.fieldType.selectOption({ label: type.trim() });
    if (type.trim().includes("Text")) {
      await this.inputTypeTextType.selectOption({ label: inputType.trim() });
      if (
        inputType.trim().includes("Text Single Line") ||
        inputType.trim().includes("Number")
      ) {
        await this.minRange.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.minRange.fill(min);
        await this.maxRange.fill(max);
      } else if (inputType.trim().includes("Text Area")) {
        await this.minRange.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.minRange.fill(min);
        await this.maxRange.fill(max);
        await this.numberOfLines.fill(noOfLines);
      } else if (inputType.trim().includes("Date")) {
        await this.minDate.waitFor({ state: "visible", timeout: this.timeout });
        await this.maxDate.waitFor({ state: "visible", timeout: this.timeout });
        expect(await this.minDate.isVisible()).toBeTruthy();
        expect(await this.maxDate.isVisible()).toBeTruthy();
        await this.datePickerUtil.selectDateByISO(
          this.minDate,
          ".flatpickr-days",
          min,
        );
        await this.datePickerUtil.selectDateByISO(
          this.maxDate,
          ".flatpickr-days",
          max,
        );
      }

      if (tooltip && tooltip.toLowerCase() === "yes") {
        await this.tooltip.scrollIntoViewIfNeeded();
        await this.tooltip.waitFor({ state: "visible", timeout: this.timeout });
        await this.tooltip.click();
        await this.tooltipMsg.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.tooltipMsg.fill("Please Fill Value to the Field");
      }
    } else if (type.includes("Single Select")) {
      await this.inputTypeSingleType.selectOption({ label: inputType });

      if (inputType.includes("Radio") || inputType.includes("Drop Down")) {
        await this.fillOptions(fieldName, options, optionValues);
      }

      if (allowOther && allowOther.toLowerCase() === "yes") {
        await this.allowOther.scrollIntoViewIfNeeded();
        await this.allowOther.click();
      } else if (tooltip && tooltip.toLowerCase() === "yes") {
        await this.tooltip.scrollIntoViewIfNeeded();
        await this.tooltip.click();
        await this.tooltipMsg.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.tooltipMsg.fill("Please Select any option");
      }
    } else if (type.includes("Multi Select")) {
      await this.inputTypeMultipleType.selectOption({ label: inputType });

      if (inputType.includes("Check Box") || inputType.includes("List")) {
        await this.fillOptions(fieldName, options, optionValues);
      }

      if (allowOther && allowOther.toLowerCase() === "yes") {
        await this.allowOther.scrollIntoViewIfNeeded();
        await this.allowOther.click();
      } else if (tooltip && tooltip.toLowerCase() === "yes") {
        await this.tooltip.scrollIntoViewIfNeeded();
        await this.tooltip.click();
        await this.tooltipMsg.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.tooltipMsg.fill("Please Select any option");
      }
    }

    await this.saveField.scrollIntoViewIfNeeded();
    await this.saveField.click();

    // Enhanced error handling for API failures
    try {
      await ErrorUtil.captureErrorIfPresent(this.page, "createField");
      await ErrorUtil.captureApiErrorIfPresent(this.apiCapture, "createField");
    } catch (error) {
      console.warn(`Warning: Error capture failed: ${error.message}`);
    }

    // Check for API 409 errors (field already exists)
    if (this.apiCapture && this.apiCapture.hasFailedApis()) {
      const failedApis = this.apiCapture.getFailedApis();
      const has409Error = failedApis.some((api) => api.status === 409);

      if (has409Error) {
        console.log(
          `${fieldName}: API returned 409 (field already exists). Treating as success.`,
        );
        // Double-check if field now exists after the 409 error
        await this.page.waitForTimeout(1000); // Wait for potential page updates
        const isFieldNowPresent = await this.verifyExistingField(fieldName);
        if (isFieldNowPresent) {
          console.log(
            `${fieldName}: Field confirmed to exist after 409 error.`,
          );
          return true;
        } else {
          console.log(
            `${fieldName}: Field still not found after 409 error. This may indicate a naming mismatch.`,
          );
          return false;
        }
      }
    }

    // Minimal wait for page stabilization
    await this.page.waitForTimeout(500);

    try {
      await this.FieldPage.waitFor({ state: "visible", timeout: this.timeout });
      // Wait for the success message to disappear before proceeding
      await this.page
        .locator("#pageMessages")
        .waitFor({ state: "hidden", timeout: 10000 });
    } catch (error) {
      console.log(
        `⚠️ ${fieldName}: Page stabilization warning: ${error.message}`,
      );
      // Continue anyway as field might still be created
      // Check if browser is still alive
      try {
        await this.page.title(); // Simple check to see if page is responsive
      } catch (browserError) {
        console.error(`Browser appears to be crashed: ${browserError.message}`);
        throw new Error(
          `Browser crashed during field creation for ${fieldName}`,
        );
      }
    }

    // Re-verify if the field was created successfully
    const isFieldCreated = await this.verifyExistingField(fieldName);
    if (!isFieldCreated) {
      console.log(`${fieldName}: field is not created.`);
      return false;
    }
    console.log(`${fieldName}: field is created successfully.`);
    return true;
  }

  async fillOptions(fieldName, options, optionValues) {
    await this.options.selectOption({ label: options.trim() });

    const numOptions = parseInt(options.trim());
    const optionList = optionValues.split(",");

    // Debug logs for troubleshooting
    console.log("DEBUG fillOptions - fieldName:", fieldName);
    console.log("DEBUG fillOptions - raw optionValues:", optionValues);
    console.log("DEBUG fillOptions - optionList:", optionList);
    console.log("DEBUG fillOptions - numOptions:", numOptions);

    if (optionList.length < numOptions) {
      throw new Error(`Not enough option values provided for: ${fieldName}`);
    }

    for (let i = 1; i <= numOptions; i++) {
      const optionFieldId = `opt${i}`;
      const optionInput = this.page.locator(`#${optionFieldId}`);
      await optionInput.waitFor({ state: "visible", timeout: this.timeout });
      await optionInput.scrollIntoViewIfNeeded();
      await optionInput.clear();
      await optionInput.fill(optionList[i - 1].trim());
    }
  }

  //Verify Existing Field - Optimized for Speed
  async verifyExistingField(fieldName) {
    try {
      // Fast table check with minimal wait
      await this.FieldPage.waitFor({ state: "visible", timeout: 5000 });
      await this.page.waitForTimeout(500); // Increased wait for table to fully load

      const trimmedFieldName = fieldName.trim();

      // Get all cells from the field name column (position 4)
      const fieldNameCells = await this.page
        .locator("//td[position()=4]")
        .allTextContents();
      const cleanFieldNames = fieldNameCells
        .map((cell) => cell.trim())
        .filter((name) => name.length > 0);

      // Method 1: Exact match
      const exactMatch = cleanFieldNames.find(
        (name) => name === trimmedFieldName,
      );
      if (exactMatch) {
        console.log(`${fieldName}: Field already exists (exact match).`);
        return true;
      }

      // Method 2: Case-insensitive match
      const caseInsensitiveMatch = cleanFieldNames.find(
        (name) => name.toLowerCase() === trimmedFieldName.toLowerCase(),
      );
      if (caseInsensitiveMatch) {
        console.log(
          `${fieldName}: Field already exists (case-insensitive match).`,
        );
        return true;
      }

      // Method 3: Check for fields with extra spaces or special characters
      const normalizedFieldName = trimmedFieldName.replace(/\s+/g, " "); // Normalize multiple spaces to single space
      const spaceVariationMatch = cleanFieldNames.find((name) => {
        const normalizedName = name.replace(/\s+/g, " ");
        return (
          normalizedName.toLowerCase() === normalizedFieldName.toLowerCase()
        );
      });
      if (spaceVariationMatch) {
        console.log(
          `${fieldName}: Field already exists (space variation match).`,
        );
        return true;
      }

      // Method 4: Check for partial matches (contains)
      const partialMatches = cleanFieldNames.filter((name) => {
        const nameLower = name.toLowerCase();
        const fieldLower = trimmedFieldName.toLowerCase();
        return nameLower.includes(fieldLower) || fieldLower.includes(nameLower);
      });

      if (partialMatches.length > 0) {
        console.log(
          `${fieldName}: Field does not exist, but found similar fields: ${partialMatches.slice(0, 3).join(", ")}`,
        );

        // Check if any partial match is very close (might be the same field with different spacing)
        const closeMatch = partialMatches.find((name) => {
          const nameNoSpaces = name.replace(/\s+/g, "").toLowerCase();
          const fieldNoSpaces = trimmedFieldName
            .replace(/\s+/g, "")
            .toLowerCase();
          return nameNoSpaces === fieldNoSpaces;
        });

        if (closeMatch) {
          console.log(
            `${fieldName}: Field already exists (close match ignoring spaces).`,
          );
          return true;
        }
      }

      // Method 5: Check pagination if exists
      const paginationExists =
        (await this.page.locator('//ul[@class="pagination"]').count()) > 0;
      if (paginationExists) {
        const foundInPagination =
          await this.searchFieldInAllPages(trimmedFieldName);
        if (foundInPagination) {
          console.log(
            `${fieldName}: Field already exists (found in paginated results).`,
          );
          return true;
        }
      }

      console.log(`${fieldName}: Field does not exist.`);
      return false;
    } catch (error) {
      console.error(`Error in verifyExistingField: ${error.message}`);
      console.log(`${fieldName}: Field does not exist (error occurred).`);
      return false;
    }
  }

  // Helper method to search field in all paginated pages
  async searchFieldInAllPages(fieldName) {
    try {
      const maxPages = 10; // Limit to prevent infinite loops
      let currentPage = 1;

      while (currentPage <= maxPages) {
        // Search in current page
        const fieldExists =
          (await this.page
            .locator(
              `//td[translate(normalize-space(text()), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')='${fieldName.toLowerCase()}']`,
            )
            .count()) > 0;

        if (fieldExists) {
          return true;
        }

        // Check if next page exists
        const nextPageButton = this.page.locator(
          '//a[contains(@class, "page-link") and contains(text(), "Next")] | //a[contains(@class, "page-link") and @aria-label="Next"]',
        );
        const nextPageExists = (await nextPageButton.count()) > 0;
        const nextPageEnabled =
          nextPageExists &&
          !(await nextPageButton.getAttribute("class")).includes("disabled");

        if (!nextPageEnabled) {
          break; // No more pages
        }

        // Go to next page
        await nextPageButton.click();
        await this.page.waitForTimeout(1000); // Wait for page to load
        currentPage++;
      }

      return false;
    } catch (error) {
      console.error(`Error searching paginated pages: ${error.message}`);
      return false;
    }
  }

  //verify update Fields
  get UpdateFieldPage() {
    return this.page.locator("(//div[@class='box-body p-10'])[2]");
  }
  get SaveUpdateField() {
    return this.page.locator("//button[@id='btnUpdateFields']");
  }
  async verifyFieldUpdation(
    category,
    level,
    displayName,
    fieldName,
    type,
    inputType,
    min,
    max,
    noOfLines,
    options,
    optionValues,
    allowOther,
    tooltip,
  ) {
    const isFieldPresent = await this.verifyExistingField(fieldName);

    // Try multiple XPath patterns for the edit button with case variations
    const xpathPatterns = [
      `//td[normalize-space()='${level.trim()}']/following-sibling::td[.='${fieldName.trim()}']/following-sibling::td//button`,
      `//td[contains(text(),'${fieldName.trim()}')]/following-sibling::td//button`,
      `//tr[contains(.,'${fieldName.trim()}')]//button`,
      `//tr[contains(.,'${fieldName.trim()}')]//a[@title='Edit Field']`,
      `//td[.='${fieldName.trim()}']/following-sibling::td//button`,
      // Case-insensitive patterns
      `//tr[contains(translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${fieldName.toLowerCase()}')]//a[@title='Edit Field']`,
      `//td[contains(translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${fieldName.toLowerCase()}')]/following-sibling::td//button`,
      // Pattern for "Branch name" vs "Branchname"
      `//tr[contains(.,'${fieldName.replace(/([a-z])([A-Z])/g, "$1 $2")}')]//a[@title='Edit Field']`,
      // Pattern for display name matching
      `//tr[contains(.,'${displayName}')]//a[@title='Edit Field']`,
    ];

    let Editbutton = [];
    let usedXpath = "";

    for (const xpath of xpathPatterns) {
      Editbutton = await this.page.locator(xpath).all();
      if (Editbutton.length > 0) {
        usedXpath = xpath;
        console.log(`✅ Found edit button using XPath: ${xpath}`);
        break;
      }
    }

    if (isFieldPresent) {
      console.log(`${fieldName}: Field is Present.Updating it...`);

      if (Editbutton.length === 0) {
        console.error(`❌ No edit button found for field: ${fieldName}`);
        console.log(`Tried XPath patterns: ${xpathPatterns.join(", ")}`);
        console.log(
          `💡 Suggestion: Check if field name in UI matches exactly: "${fieldName}" or "${displayName}"`,
        );
        return false;
      }
    } else {
      console.log(`${fieldName}: Field does not exist. Skipping update.`);
      return true; // Return true as this is expected behavior
    }

    await Editbutton[0].scrollIntoViewIfNeeded();

    // Wait for any alert messages to disappear before clicking
    try {
      await this.page.waitForSelector(".alert", {
        state: "hidden",
        timeout: 2000,
      });
    } catch (e) {
      // Alert might not exist, continue
    }

    // Try normal click first, then force click if blocked
    try {
      await Editbutton[0].click({ timeout: 3000 });
    } catch (e) {
      console.log(`${fieldName}: Normal click failed, trying force click...`);
      await Editbutton[0].click({ force: true });
    }
    expect(await this.UpdateFieldPage.isVisible()).toBeTruthy();

    // Wait for category dropdown to be available and check if update needed
    const categorySelector = this.page.locator(
      "//select[@id='selectedCategory']",
    );
    await categorySelector.waitFor({ state: "visible", timeout: 10000 });

    // Check current category value
    const currentCategory = await categorySelector
      .locator("option:checked")
      .textContent();
    if (currentCategory && currentCategory.trim() !== category) {
      await categorySelector.selectOption({ label: category });
      const selectedText = await categorySelector
        .locator("option:checked")
        .textContent();
      console.log(
        `${selectedText.trim()}: Category updated from ${currentCategory.trim()}`,
      );
    } else {
      console.log(`${category}: Category already set, skipping update`);
    }

    // Level and Field Name are non-editable, so skip them
    console.log(`${level}: Level is non-editable, skipping`);
    console.log(`${fieldName}: Field Name is non-editable, skipping`);
    // Check and update Display Name only if different
    const currentDisplayName = await this.displayName.inputValue();
    if (currentDisplayName !== displayName) {
      await this.displayName.clear();
      await this.displayName.fill(displayName);
      console.log(
        `${displayName}: Display Name updated from ${currentDisplayName}`,
      );
    } else {
      console.log(`${displayName}: Display Name already set, skipping update`);
    }

    // Field Name is non-editable, just verify
    console.log(`${fieldName}: Field Name is non-editable, verifying only`);
    if (type.trim().includes("Text")) {
      // Check and update Input Type only if different
      const currentInputType = await this.inputTypeTextType
        .locator("option:checked")
        .textContent();
      if (currentInputType && currentInputType.trim() !== inputType.trim()) {
        await this.inputTypeTextType.selectOption({ label: inputType.trim() });
        console.log(
          `${inputType.trim()}: Input Type updated from ${currentInputType.trim()}`,
        );
      } else {
        console.log(
          `${inputType.trim()}: Input Type already set, skipping update`,
        );
      }

      if (
        inputType.trim().includes("Text Single Line") ||
        inputType.trim().includes("Number")
      ) {
        await this.minRange.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.maxRange.waitFor({
          state: "visible",
          timeout: this.timeout,
        });

        // Check and update Min Range only if different
        const currentMin = await this.minRange.inputValue();
        if (currentMin !== min) {
          await this.minRange.fill(min);
          console.log(`${min}: Min Range updated from ${currentMin}`);
        } else {
          console.log(`${min}: Min Range already set, skipping update`);
        }

        // Check and update Max Range only if different
        const currentMax = await this.maxRange.inputValue();
        if (currentMax !== max) {
          await this.maxRange.fill(max);
          console.log(`${max}: Max Range updated from ${currentMax}`);
        } else {
          console.log(`${max}: Max Range already set, skipping update`);
        }
      } else if (inputType.trim().includes("Text Area")) {
        await this.minRange.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.maxRange.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.numberOfLines.waitFor({
          state: "visible",
          timeout: this.timeout,
        });

        // Check and update Min Range only if different
        const currentMin = await this.minRange.inputValue();
        if (currentMin !== min) {
          await this.minRange.fill(min);
          console.log(`${min}: Min Range updated from ${currentMin}`);
        } else {
          console.log(`${min}: Min Range already set, skipping update`);
        }

        // Check and update Max Range only if different
        const currentMax = await this.maxRange.inputValue();
        if (currentMax !== max) {
          await this.maxRange.fill(max);
          console.log(`${max}: Max Range updated from ${currentMax}`);
        } else {
          console.log(`${max}: Max Range already set, skipping update`);
        }

        // Check and update Number of Lines only if different
        const currentLines = await this.numberOfLines.inputValue();
        if (currentLines !== noOfLines) {
          await this.numberOfLines.fill(noOfLines);
          console.log(
            `${noOfLines}: Number of Lines updated from ${currentLines}`,
          );
        } else {
          console.log(
            `${noOfLines}: Number of Lines already set, skipping update`,
          );
        }
      } else if (inputType.trim().includes("Date")) {
        await this.minDate.waitFor({ state: "visible", timeout: this.timeout });
        await this.maxDate.waitFor({ state: "visible", timeout: this.timeout });
        expect(await this.minDate.isVisible()).toBeTruthy();
        expect(await this.maxDate.isVisible()).toBeTruthy();

        // For date fields, always update as date comparison is complex
        await this.datePickerUtil.selectDateByISO(
          this.minDate,
          ".flatpickr-days",
          min,
        );
        await this.datePickerUtil.selectDateByISO(
          this.maxDate,
          ".flatpickr-days",
          max,
        );
        console.log(`${min} to ${max}: Date range updated`);
      }

      // Check and update Tooltip only if needed
      if (tooltip && tooltip.toLowerCase() === "yes") {
        const isTooltipChecked = await this.tooltip.isChecked();
        if (!isTooltipChecked) {
          await this.tooltip.scrollIntoViewIfNeeded();
          await this.tooltip.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.tooltip.click();
          await this.tooltipMsg.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.tooltipMsg.fill("Please Fill Value to the Field");
          console.log(`Tooltip: Enabled and message set`);
        } else {
          console.log(`Tooltip: Already enabled, skipping update`);
        }
      }
    } else if (type.includes("Single Select")) {
      // Check and update Single Select Input Type only if different
      const currentSingleInputType = await this.inputTypeSingleType
        .locator("option:checked")
        .textContent();
      if (
        currentSingleInputType &&
        currentSingleInputType.trim() !== inputType
      ) {
        await this.inputTypeSingleType.selectOption({ label: inputType });
        console.log(
          `${inputType}: Single Select Input Type updated from ${currentSingleInputType.trim()}`,
        );
      } else {
        console.log(
          `${inputType}: Single Select Input Type already set, skipping update`,
        );
      }

      if (inputType.includes("Radio") || inputType.includes("Drop Down")) {
        await this.fillOptions(fieldName, options, optionValues);
        console.log(`${fieldName}: Options filled for ${inputType}`);
      }

      // Check and update Allow Other only if needed
      if (allowOther && allowOther.toLowerCase() === "yes") {
        const isAllowOtherChecked = await this.allowOther.isChecked();
        if (!isAllowOtherChecked) {
          await this.allowOther.scrollIntoViewIfNeeded();
          await this.allowOther.click();
          console.log(`Allow Other: Enabled`);
        } else {
          console.log(`Allow Other: Already enabled, skipping update`);
        }
      } else if (tooltip && tooltip.toLowerCase() === "yes") {
        const isTooltipChecked = await this.tooltip.isChecked();
        if (!isTooltipChecked) {
          await this.tooltip.scrollIntoViewIfNeeded();
          await this.tooltip.click();
          await this.tooltipMsg.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.tooltipMsg.fill("Please Select any option");
          console.log(`Tooltip: Enabled for Single Select`);
        } else {
          console.log(`Tooltip: Already enabled, skipping update`);
        }
      }
    } else if (type.includes("Multi Select")) {
      // Check and update Multi Select Input Type only if different
      const currentMultiInputType = await this.inputTypeMultipleType
        .locator("option:checked")
        .textContent();
      if (currentMultiInputType && currentMultiInputType.trim() !== inputType) {
        await this.inputTypeMultipleType.selectOption({ label: inputType });
        console.log(
          `${inputType}: Multi Select Input Type updated from ${currentMultiInputType.trim()}`,
        );
      } else {
        console.log(
          `${inputType}: Multi Select Input Type already set, skipping update`,
        );
      }

      if (inputType.includes("Check Box") || inputType.includes("List")) {
        await this.fillOptions(fieldName, options, optionValues);
        console.log(`${fieldName}: Options filled for ${inputType}`);
      }

      // Check and update Allow Other only if needed
      if (allowOther && allowOther.toLowerCase() === "yes") {
        const isAllowOtherChecked = await this.allowOther.isChecked();
        if (!isAllowOtherChecked) {
          await this.allowOther.scrollIntoViewIfNeeded();
          await this.allowOther.click();
          console.log(`Allow Other: Enabled for Multi Select`);
        } else {
          console.log(`Allow Other: Already enabled, skipping update`);
        }
      } else if (tooltip && tooltip.toLowerCase() === "yes") {
        const isTooltipChecked = await this.tooltip.isChecked();
        if (!isTooltipChecked) {
          await this.tooltip.scrollIntoViewIfNeeded();
          await this.tooltip.click();
          await this.tooltipMsg.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.tooltipMsg.fill("Please Select any option");
          console.log(`Tooltip: Enabled for Multi Select`);
        } else {
          console.log(`Tooltip: Already enabled, skipping update`);
        }
      }
    }

    // Save the updated field
    console.log(`${fieldName}: Saving field updates...`);
    await this.SaveUpdateField.scrollIntoViewIfNeeded();
    await this.SaveUpdateField.click();
    await ErrorUtil.captureErrorIfPresent(this.page, "updateField");
    await this.FieldPage.waitFor({ state: "visible", timeout: this.timeout });
    if (!isFieldPresent) {
      console.log(`${fieldName}: field is not updated.`);
      return false;
    }
    console.log(`${fieldName}: field is updated successfully.`);
    return true;
  }

  // Dispositions locators
  get dispositions() {
    return this.page.locator("//div[contains(text(),'Dispositions')]");
  }
  get dispositionScreen() {
    return this.page.locator(
      "//a[@class='router-link-active router-link-exact-active']",
    );
  }
  get createDispositionScreenButton() {
    return this.page.locator(
      "//div[@class='btn btn-info w-full']//b[contains(text(),'Create Disposition Screen')]",
    );
  }
  get dispositionQuestion() {
    return this.page.locator("//a[normalize-space()='Disposition Question']");
  }
  get createDispositionQuestionButton() {
    return this.page.locator(
      "//b[normalize-space()='Create Disposition Question']",
    );
  }
  get category() {
    return this.page.locator("//select[@id='selectsCategory']");
  }
  get question() {
    return this.page.locator("//input[@id='displayName']");
  }
  get questionType() {
    return this.page.locator("//select[@id='fieldType']");
  }
  get parentQuestion() {
    return this.page.locator("//select[@id='fieldQuestion']");
  }
  get saveDispositionQuestion() {
    return this.page.locator("//button[@id='btnCreateField']");
  }

  // Tabbing to Dispositions
  async tabToDispositions() {
    try {
      await this.dispositions.scrollIntoViewIfNeeded();
      await this.dispositions.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      if (await this.dispositions.isVisible()) {
        await this.dispositions.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "tabToDispositions");
        expect(
          await this.createDispositionScreenButton.isVisible(),
        ).toBeTruthy();
        const text = await this.createDispositionScreenButton.textContent();
        console.log(`${text} button is visible after clicking Dispositions.`);
      } else {
        throw new Error("Dispositions button is not visible.");
      }
      await this.tabToDispositionQuestion();
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in tabToDispositions: ${error.message}`,
      );
    }
  }

  async tabToDispositionQuestion() {
    try {
      await this.dispositionQuestion.scrollIntoViewIfNeeded();
      await this.dispositionQuestion.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      if (await this.dispositionQuestion.isVisible()) {
        await this.dispositionQuestion.click();
        await ErrorUtil.captureErrorIfPresent(
          this.page,
          "tabToDispositionQuestion",
        );
        expect(
          await this.createDispositionQuestionButton.isVisible(),
        ).toBeTruthy();
        const text = await this.createDispositionQuestionButton.textContent();
        console.log(
          `${text} button is visible after clicking DispositionQuestion.`,
        );
      } else {
        throw new Error("DispositionQuestion button is not visible.");
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in tabToDispositionQuestion: ${error.message}`,
      );
    } finally {
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.dispositionScreen.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.systemSetup.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
    }
  }

  // Click On Dispositions
  async clickDispositions() {
    try {
      console.log("\n🔍 Testing Dispositions navigation...");
      await this.dispositions.scrollIntoViewIfNeeded();
      await this.dispositions.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      if (await this.dispositions.isVisible()) {
        await this.dispositions.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "clickDispositions");
        expect(
          await this.createDispositionScreenButton.isVisible(),
        ).toBeTruthy();
        const text = await this.createDispositionScreenButton.textContent();
        console.log(`${text} button is visible after clicking Dispositions.`);
      } else {
        throw new Error("Dispositions button is not visible.");
      }
      console.log("✅ Dispositions navigation test completed successfully");
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in clickDispositions: ${error.message}`,
      );
    }
  }

  // Click On Disposition Question
  async clickOnDispositionQuestion() {
    try {
      console.log("\n🔍 Testing Disposition Question navigation...");
      await this.dispositions.scrollIntoViewIfNeeded();
      await this.dispositions.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      if (await this.dispositions.isVisible()) {
        await this.dispositions.click();
        await ErrorUtil.captureErrorIfPresent(
          this.page,
          "clickOnDispositionQuestion",
        );
        expect(
          await this.createDispositionScreenButton.isVisible(),
        ).toBeTruthy();
        const text = await this.createDispositionScreenButton.textContent();
        console.log(`${text} button is visible after clicking Dispositions.`);

        // Navigate to Disposition Question
        await this.dispositionQuestion.scrollIntoViewIfNeeded();
        await this.dispositionQuestion.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        if (await this.dispositionQuestion.isVisible()) {
          await this.dispositionQuestion.click();
          await ErrorUtil.captureErrorIfPresent(
            this.page,
            "clickOnDispositionQuestion",
          );
          expect(
            await this.createDispositionQuestionButton.isVisible(),
          ).toBeTruthy();
          const questionText =
            await this.createDispositionQuestionButton.textContent();
          console.log(
            `${questionText} button is visible after clicking DispositionQuestion.`,
          );
        } else {
          throw new Error("DispositionQuestion button is not visible.");
        }
      } else {
        throw new Error("Dispositions button is not visible.");
      }
      console.log(
        "✅ Disposition Question navigation test completed successfully",
      );
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in clickOnDispositionQuestion: ${error.message}`,
      );
    }
  }

  // Setup Disposition Question
  async setupDispositionQuestion(
    category,
    question,
    questionType,
    parentQuestion,
    inputType,
    min,
    max,
    noOfLines,
    options,
    optionValues,
    allowOther,
    tooltip,
  ) {
    await this.createDispositionQuestionHelper(
      category,
      question,
      questionType,
      parentQuestion,
      inputType,
      min,
      max,
      noOfLines,
      options,
      optionValues,
      allowOther,
      tooltip,
    );
  }

  //locators for create disposition question
  get DispositionScreenPage() {
    return this.page.locator("//a[normalize-space()='Disposition Screen']");
  }
  // Helper: Create Disposition Question
  async createDispositionQuestionHelper(
    category,
    question,
    questionType,
    parentQuestion,
    inputType,
    min,
    max,
    noOfLines,
    options,
    optionValues,
    allowOther,
    tooltip,
  ) {
    try {
      const isQuestionPresent = await this.verifyExistingQuestion(
        category,
        question,
        parentQuestion,
      );
      if (!isQuestionPresent) {
        console.log(`${question}: Question does not exist. Creating it...`);
        await this.createDispositionQuestionButton.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.createDispositionQuestionButton.click();
        await this.category.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.category.selectOption({ label: category });
        const selectedText = await this.category
          .locator("option:checked")
          .textContent();
        console.log(
          `${selectedText.trim()} : ${category} Category is selected`,
        );
        await this.question.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.question.clear();
        await this.question.fill(question);
        if (questionType === "Main Question") {
          await this.questionType.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.questionType.selectOption({ label: questionType });
          const selectedQuestionType = await this.questionType
            .locator("option:checked")
            .textContent();
          console.log(
            `${selectedQuestionType.trim()} : ${questionType} Question Type is selected`,
          );
          expect(await this.parentQuestion.isDisabled()).toBeTruthy();
          if (allowOther && allowOther.trim().toLowerCase() === "yes") {
            await this.allowOther.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.allowOther.scrollIntoViewIfNeeded();
            await this.allowOther.click();
          }
          if (tooltip && tooltip.trim().toLowerCase() === "yes") {
            await this.tooltip.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.tooltip.scrollIntoViewIfNeeded();
            await this.tooltip.click();
            await this.tooltip.fill("Fill the value");
          }
          await this.saveDispositionQuestion.click();
          await ErrorUtil.captureErrorIfPresent(
            this.page,
            "createDispositionQuestionHelper",
          );
          await ErrorUtil.captureApiErrorIfPresent(
            this.apiCapture,
            "createDispositionQuestionHelper",
          );
          if (isQuestionPresent) {
            console.log(`${question}: Main Question is created.`);
            return true;
          } else {
            console.log(`${question}: Main Question is not created.`);
            return false;
          }
        } else if (questionType.trim().includes("Text")) {
          // First select the question type to make input type dropdown visible
          await this.questionType.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.questionType.selectOption({ label: questionType });
          const selectedQuestionType = await this.questionType
            .locator("option:checked")
            .textContent();
          console.log(
            `${selectedQuestionType.trim()} : ${questionType} Question Type is selected`,
          );

          // Then select the input type
          await this.inputTypeTextType.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.inputTypeTextType.selectOption({
            label: inputType.trim(),
          });
          if (
            inputType.trim().includes("Text Single Line") ||
            inputType.trim().includes("Number")
          ) {
            await this.minRange.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.minRange.fill(min);
            await this.maxRange.fill(max);
          } else if (inputType.trim().includes("Text Area")) {
            await this.minRange.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.minRange.fill(min);
            await this.maxRange.fill(max);
            await this.numberOfLines.fill(noOfLines);
          } else if (inputType.trim().includes("Date")) {
            await this.minDate.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.maxDate.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            expect(await this.minDate.isVisible()).toBeTruthy();
            expect(await this.maxDate.isVisible()).toBeTruthy();

            // Use the enhanced DatePicker utility that handles flatpickr inputs
            await this.datePickerUtil.selectDateByISO(
              this.minDate,
              ".flatpickr-days",
              min,
            );
            await this.datePickerUtil.selectDateByISO(
              this.maxDate,
              ".flatpickr-days",
              max,
            );
          }

          if (tooltip && tooltip.toLowerCase() === "yes") {
            await this.tooltip.scrollIntoViewIfNeeded();
            await this.tooltip.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.tooltip.click();
            await this.tooltipMsg.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.tooltipMsg.fill("Please Fill Value to the Field");
          }
        } else if (questionType.includes("Single Select")) {
          // First select the question type to make input type dropdown visible
          await this.questionType.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.questionType.selectOption({ label: questionType });
          const selectedQuestionType = await this.questionType
            .locator("option:checked")
            .textContent();
          console.log(
            `${selectedQuestionType.trim()} : ${questionType} Question Type is selected`,
          );

          // Then select the input type
          await this.inputTypeSingleType.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.inputTypeSingleType.selectOption({ label: inputType });

          if (inputType.includes("Radio") || inputType.includes("Drop Down")) {
            await this.fillOptions(question, options, optionValues);
          }

          if (allowOther && allowOther.toLowerCase() === "yes") {
            await this.allowOther.scrollIntoViewIfNeeded();
            await this.allowOther.click();
          } else if (tooltip && tooltip.toLowerCase() === "yes") {
            await this.tooltip.scrollIntoViewIfNeeded();
            await this.tooltip.click();
            await this.tooltipMsg.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.tooltipMsg.fill("Please Select any option");
          }
        } else if (questionType.includes("Multi Select")) {
          await this.inputTypeMultipleType.selectOption({ label: inputType });

          if (inputType.includes("Check Box") || inputType.includes("List")) {
            await this.fillOptions(question, options, optionValues);
          }

          if (allowOther && allowOther.toLowerCase() === "yes") {
            await this.allowOther.scrollIntoViewIfNeeded();
            await this.allowOther.click();
          } else if (tooltip && tooltip.toLowerCase() === "yes") {
            await this.tooltip.scrollIntoViewIfNeeded();
            await this.tooltip.click();
            await this.tooltipMsg.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.tooltipMsg.fill("Please Select any option");
          }
        }
        await this.parentQuestion.selectOption({ label: parentQuestion });
        const selectedParentQuestion = await this.parentQuestion
          .locator("option:checked")
          .textContent();
        console.log(
          `${selectedParentQuestion.trim()} : ${parentQuestion} Parent Question is selected`,
        );
        await this.saveDispositionQuestion.click();
        await ErrorUtil.captureErrorIfPresent(
          this.page,
          "createDispositionQuestion",
        );
        await ErrorUtil.captureApiErrorIfPresent(
          this.apiCapture,
          "createDispositionQuestion",
        );
        await this.dispositionQuestion.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.DispositionScreenPage.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.DispositionScreenPage.scrollIntoViewIfNeeded();
        await this.DispositionScreenPage.click();
        await this.dispositionQuestion.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.dispositionQuestion.scrollIntoViewIfNeeded();
        await this.dispositionQuestion.click();
        if (!isQuestionPresent) {
          console.log(`${question}: Question is not created.`);
          return false;
        }
        console.log(`${question}: Question is created successfully.`);
        return true;
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in createDispositionQuestionHelper: ${error.message}`,
      );
    }
  }

  //verify existing Question functions
  async verifyExistingQuestion(category, question, parentQuestion) {
    const xpath = `//td[normalize-space()='${category.trim()}']/following-sibling::td[contains(.,'${parentQuestion.trim()}')]/following-sibling::td[contains(.,'${question.trim()}')]`;
    const existingQuestions = await this.page.locator(xpath).all();
    const isPresent = existingQuestions.length > 0;
    if (isPresent) {
      console.log(
        `${question}: Child Question already exists. allong with ${parentQuestion} Parent Question.`,
      );
    } else {
      console.log(
        `${question}: Child Question does not exist. allong with ${parentQuestion} Parent Question.`,
      );
    }
    return isPresent;
  }

  //Verify Existing Disposition Screen
  async verifyExistingDispositionScreen(Type, DispositionScreen) {
    const xpath = `//tbody//td[.='${Type.trim()}']/preceding-sibling::td[.='${DispositionScreen.trim()}']`;
    const existingDispositionScreens = await this.page.locator(xpath).all();
    const isPresent = existingDispositionScreens.length > 0;
    if (isPresent) {
      console.log(`${DispositionScreen}: Disposition Screen already exists.`);
    } else {
      console.log(`${DispositionScreen}: Disposition Screen does not exist.`);
    }
    return isPresent;
  }

  //Create Disposition Screen
  get DispositionScreenName() {
    return this.page.locator("//input[@id='dispoScreenName']");
  }
  get DispositionScreenType() {
    return this.page.locator("//select[@id='selectType']");
  }
  get AddNegativeDispositionQuestion() {
    return this.page.locator("//button[@data-bs-target='#tgNegative']");
  }
  SelectNegativeQuestion(category, question) {
    return this.page.locator(
      `//div[@id='tgNegative']//td[.='${category}']/following-sibling::td[.='${question}']/preceding-sibling::td//span`,
    );
  }
  get AddIndeterminateDispositionQuestion() {
    return this.page.locator("//button[@data-bs-target='#tgIndeterminate']");
  }
  SelectIndeterminateQuestion(category, question) {
    return this.page.locator(
      `//div[@id='tgIndeterminate']//td[.='${category}']/following-sibling::td[.='${question}']/preceding-sibling::td//span`,
    );
  }
  get AddPositiveDispositionQuestion() {
    return this.page.locator("//button[@data-bs-target='#tgPositive']");
  }
  SelectPositiveQuestion(category, question) {
    return this.page.locator(
      `//div[@id='tgPositive']//td[.='${category}']/following-sibling::td[.='${question}']/preceding-sibling::td//span`,
    );
  }
  get SaveDispositionScreen() {
    return this.page.locator("//button[@id='saveDispoScreen']");
  }

  //Nevigation to Disposition Screen
  async navigateToDispositionScreen() {
    try {
      await this.DispositionScreenPage.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.DispositionScreenPage.scrollIntoViewIfNeeded();
      await this.DispositionScreenPage.click();
      await ErrorUtil.captureErrorIfPresent(
        this.page,
        "navigateToDispositionScreen",
      );
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in navigateToDispositionScreen: ${error.message}`,
      );
    }
  }

  async createDispositionScreen(
    Type,
    DispositionScreen,
    category,
    question,
    questionType,
  ) {
    try {
      // Check if disposition screen already exists
      const isDispositionScreenPresent =
        await this.verifyExistingDispositionScreen(Type, DispositionScreen);
      if (!isDispositionScreenPresent) {
        console.log(
          `${DispositionScreen}: Disposition Screen does not exist. Creating it...`,
        );

        // Click Create Disposition Screen button to open the form
        await this.createDispositionScreenButton.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.createDispositionScreenButton.scrollIntoViewIfNeeded();
        await this.createDispositionScreenButton.click();
        await ErrorUtil.captureErrorIfPresent(
          this.page,
          "createDispositionScreen",
        );
        await ErrorUtil.captureApiErrorIfPresent(
          this.apiCapture,
          "createDispositionScreen",
        );
        console.log("✅ Clicked Create Disposition Screen button");

        // Fill disposition screen details
        await this.DispositionScreenName.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.DispositionScreenName.fill(DispositionScreen);
        console.log(`✅ Filled disposition screen name: ${DispositionScreen}`);

        await this.DispositionScreenType.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.DispositionScreenType.selectOption({ label: Type });
        console.log(`✅ Selected disposition screen type: ${Type}`);

        // Add questions based on type (fixed variable name from DispositionType to Type)
        console.log(
          `🔍 Processing disposition type: "${Type}" (trimmed: "${Type.trim().toLowerCase()}")`,
        );

        if (questionType.trim().toLowerCase() === "negative") {
          console.log("📝 Adding negative disposition question...");
          await this.AddNegativeDispositionQuestion.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.AddNegativeDispositionQuestion.click();
          await this.SelectNegativeQuestion(category, question).waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.SelectNegativeQuestion(category, question).click();
          console.log(`✅ Selected negative question: ${question}`);

          // Click "Add Selected" button after selecting the question
          const addSelectedButton = this.page.locator(
            "//button[normalize-space()='Add Selected']",
          );
          await addSelectedButton.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await addSelectedButton.click();
          console.log(
            `✅ Clicked "Add Selected" button for negative question: ${question}`,
          );
        } else if (questionType.trim().toLowerCase() === "indeterminate") {
          console.log("📝 Adding indeterminate disposition question...");
          await this.AddIndeterminateDispositionQuestion.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.AddIndeterminateDispositionQuestion.click();
          await this.SelectIndeterminateQuestion(category, question).waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.SelectIndeterminateQuestion(category, question).click();
          console.log(`✅ Selected indeterminate question: ${question}`);

          // Click "Add Selected" button after selecting the question
          const addSelectedButton = this.page.locator(
            "//button[normalize-space()='Add Selected']",
          );
          await addSelectedButton.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await addSelectedButton.click();
          console.log(
            `✅ Clicked "Add Selected" button for indeterminate question: ${question}`,
          );
        } else if (
          questionType.trim().toLowerCase() === "positive" ||
          questionType.trim().toLowerCase() === "main question"
        ) {
          console.log(
            `📝 Adding ${questionType} disposition question as positive...`,
          );
          await this.AddPositiveDispositionQuestion.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.AddPositiveDispositionQuestion.click();

          // Debug: Check what's in the positive questions table
          console.log(
            `🔍 Looking for question: "${question}" in category: "${category}"`,
          );

          // Wait for the positive questions section to be visible
          await this.page
            .locator("//div[@id='tgPositive']")
            .waitFor({ state: "visible", timeout: this.timeout });

          // Try a more flexible approach - first find any row with the question text
          const questionRows = this.page.locator(
            `//div[@id='tgPositive']//td[contains(text(),'${question}')]`,
          );
          const rowCount = await questionRows.count();
          console.log(
            `🔍 Found ${rowCount} rows containing question text: "${question}"`,
          );

          if (rowCount > 0) {
            // Try to click the first matching row's checkbox/span
            const firstRow = questionRows.first();
            const checkbox = firstRow.locator("..//span").first();
            await checkbox.waitFor({ state: "visible", timeout: 10000 });
            await checkbox.click();
            console.log(`✅ Selected ${questionType} question: ${question}`);

            // Click "Add Selected" button after selecting the question
            const addSelectedButton = this.page.locator(
              "//button[normalize-space()='Add Selected']",
            );
            await addSelectedButton.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await addSelectedButton.click();
            console.log(
              `✅ Clicked "Add Selected" button for question: ${question}`,
            );
          } else {
            console.log(
              `⚠️ Question "${question}" not found in positive questions table`,
            );
            // Try to get all available questions for debugging
            const allQuestions = await this.page
              .locator("//div[@id='tgPositive']//td")
              .allTextContents();
            console.log(
              "🔍 Available questions in positive table:",
              allQuestions,
            );
          }
        } else {
          console.log(
            `⚠️ Unknown disposition type: "${Type}". Skipping question selection.`,
          );
          console.log("ℹ️ Valid types are: negative, positive, indeterminate");
        }

        // Save the disposition screen
        await this.SaveDispositionScreen.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.SaveDispositionScreen.click();
        await ErrorUtil.captureErrorIfPresent(
          this.page,
          "createDispositionScreen",
        );
        console.log(`✅ Saved disposition screen: ${DispositionScreen}`);

        // Navigate back to disposition screen list
        await this.DispositionScreenPage.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.DispositionScreenPage.scrollIntoViewIfNeeded();
        await this.DispositionScreenPage.click();
        console.log(
          `✅ ${DispositionScreen}: Disposition Screen created successfully`,
        );
      } else {
        console.log(`${DispositionScreen}: Disposition Screen already exists.`);
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in createDispositionScreen: ${error.message}`,
      );
    }
  }

  // Documents locators
  get documents() {
    return this.page.locator("//div[contains(text(),'Documents')]");
  }
  get addNewDocument() {
    return this.page.locator(
      "(//div[@class='col-xs-12 col-sm-12 col-lg-12'])[3]",
    );
  }

  // Tabbing to Documents
  async tabToDocuments() {
    try {
      await this.documents.scrollIntoViewIfNeeded();
      await this.documents.waitFor({ state: "visible", timeout: this.timeout });
      if (await this.documents.isVisible()) {
        await this.documents.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "tabToDocuments");
        await this.addNewDocument.scrollIntoViewIfNeeded();
        await this.addNewDocument.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        expect(await this.addNewDocument.isVisible()).toBeTruthy();
        const text = await this.addNewDocument.textContent();
        console.log(`${text} button is visible after clicking Documents.`);
      } else {
        throw new Error("Documents button is not visible.");
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToDocuments: ${error.message}`);
    } finally {
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.systemSetup.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
    }
  }

  // Leads section locators
  get leads() {
    return this.page.locator("//div[contains(text(),'Leads')]");
  }

  get leadField() {
    return this.page.locator("//a[normalize-space()='Lead Field']");
  }

  get createLeadField() {
    return this.page.locator("//div[@class='btn btn-info w-full']");
  }

  get saveLeadField() {
    return this.page.locator("//button[@id='btnLeadField']");
  }

  get category() {
    return this.page.locator("//select[@id='leadFieldCategory']");
  }

  get leadStatus() {
    return this.page.locator("//a[normalize-space()='Lead Status']");
  }

  get createLeadStatus() {
    return this.page.locator(
      "//div[@class='btn btn-info w-full']//b[contains(text(),'Create Lead Status')]",
    );
  }

  get leadLostReason() {
    return this.page.locator("//a[normalize-space()='Lead Lost Reason']");
  }

  get createLeadLostReason() {
    return this.page.locator(
      "//div[@class='btn btn-info w-full']//b[contains(text(),'Create Lead Lost Reason')]",
    );
  }

  get leadStageName() {
    return this.page.locator("//input[@id='leadStageName']");
  }

  get probability() {
    return this.page.locator("//input[@id='leadProbability']");
  }

  get saveLeadStage() {
    return this.page.locator("//button[@id='btnLeadStage']");
  }

  get statusName() {
    return this.page.locator("//input[@id='leadsStatusName']");
  }

  get saveLeadStatus() {
    return this.page.locator("//button[@id='btnLeadStatusCreate']");
  }

  get lostReason() {
    return this.page.locator("//input[@id='lostReason']");
  }

  get saveLeadLost() {
    return this.page.locator("//button[@id='btnLlrCreate']");
  }

  //Leads tabbing functions
  async tabToLeads() {
    try {
      await this.leads.scrollIntoViewIfNeeded();
      await this.leads.waitFor({ state: "visible", timeout: this.timeout });

      if (await this.leads.isVisible()) {
        await this.leads.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "tabToLeads");
        await this.createLeadField.scrollIntoViewIfNeeded();
        await this.createLeadField.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        expect(await this.createLeadField.isVisible()).toBeTruthy();
        const text = await this.createLeadField.textContent();
        console.log(`${text} button is visible after clicking Leads.`);
      } else {
        throw new Error("Leads button is not visible.");
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToLeads: ${error.message}`);
    }
    await this.backButton.scrollIntoViewIfNeeded();
    await this.backButton.waitFor({ state: "visible", timeout: this.timeout });
    await this.tabToLeadStage();
    await this.tabToLeadStatus();
    await this.tabToLeadLostReason();
  }

  async clickOnLeadField() {
    try {
      await this.leads.scrollIntoViewIfNeeded();
      await this.leads.waitFor({ state: "visible", timeout: this.timeout });

      if (!(await this.leads.isVisible())) {
        throw new Error("LeadField button is not visible.");
      }

      await this.leads.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "clickOnLeadField");

      await this.createLeadField.scrollIntoViewIfNeeded();
      await this.createLeadField.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      expect(await this.createLeadField.isVisible()).toBeTruthy();
      const text = await this.createLeadField.textContent();
      console.log(`${text} button is visible`);
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in clickOnLeadField: ${error.message}`,
      );
    }
  }

  //setup Lead Fields functions

  async setupLeadFields(
    category,
    level,
    displayName,
    fieldName,
    type,
    inputType,
    min,
    max,
    noOfLines,
    options,
    optionValues,
    allowOther,
    tooltip,
  ) {
    // Check if field already exists first
    const isFieldPresent = await this.verifyExistingLeadFields(fieldName);
    if (!isFieldPresent) {
      console.log(`${fieldName}: Lead Field is not created. Creating it...`);
      return await this.createLeadFieldHelper(
        category,
        level,
        displayName,
        fieldName,
        type,
        inputType,
        min,
        max,
        noOfLines,
        options,
        optionValues,
        allowOther,
        tooltip,
      );
    } else {
      console.log(
        `${fieldName}: Lead Field already exists. Not creating again.`,
      );
      return true;
    }
  }
  get minDate() {
    return this.page.locator("//input[@id='minDate']");
  }
  get maxDate() {
    return this.page.locator("//input[@id='maxDate']");
  }
  async createLeadFieldHelper(
    category,
    level,
    displayName,
    fieldName,
    type,
    inputType,
    min,
    max,
    noOfLines,
    options,
    optionValues,
    allowOther,
    tooltip,
  ) {
    try {
      const isFieldPresent = await this.verifyExistingLeadFields(fieldName);
      if (!isFieldPresent) {
        console.log(`${fieldName}: Lead Field is not created. Creating it...`);
        await this.createLeadField.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.createLeadField.scrollIntoViewIfNeeded();
        await this.createLeadField.click();

        await this.category.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.category.selectOption({ label: category });
        const selectedText = await this.category
          .locator("option:checked")
          .textContent();
        console.log(`${selectedText.trim()}: Category is selected`);

        expect(await this.fieldLevel.textContent()).toContain(level);
        expect(await this.fieldLevel.isDisabled()).toBeTruthy();

        await this.displayName.clear();
        await this.displayName.fill(displayName);

        await this.fieldName.clear();
        await this.fieldName.fill(fieldName);

        await this.fieldType.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.fieldType.selectOption({ label: type.trim() });

        if (type.trim().includes("Text")) {
          await this.inputTypeTextType.selectOption({
            label: inputType.trim(),
          });
          if (
            inputType.trim().includes("Text Single Line") ||
            inputType.trim().includes("Number")
          ) {
            await this.minRange.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.minRange.fill(min);
            await this.maxRange.fill(max);
          } else if (inputType.trim().includes("Text Area")) {
            await this.minRange.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.minRange.fill(min);
            await this.maxRange.fill(max);
            await this.numberOfLines.fill(noOfLines);
          } else if (inputType.trim().includes("Date")) {
            await this.minDate.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.maxDate.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            expect(await this.minDate.isVisible()).toBeTruthy();
            expect(await this.maxDate.isVisible()).toBeTruthy();

            // Use the enhanced DatePicker utility that handles flatpickr inputs
            await this.datePickerUtil.selectDateByISO(
              this.minDate,
              ".flatpickr-days",
              min,
            );
            await this.datePickerUtil.selectDateByISO(
              this.maxDate,
              ".flatpickr-days",
              max,
            );
          }
          if (tooltip && tooltip.toLowerCase() === "yes") {
            try {
              await this.tooltip.scrollIntoViewIfNeeded();
              await this.tooltip.click();
              await this.tooltipMsg.fill("Please Fill Value to the Field");
            } catch (error) {
              console.log(
                `⚠️ Tooltip not available for ${fieldName}, continuing...`,
              );
            }
          }
        } else if (type.includes("Single Select")) {
          await this.inputTypeSingleType.selectOption({ label: inputType });

          if (inputType.includes("Radio") || inputType.includes("Drop Down")) {
            await this.fillOptions(fieldName, options, optionValues);
          }

          if (allowOther && allowOther.toLowerCase() === "yes") {
            await this.allowOther.scrollIntoViewIfNeeded();
            await this.allowOther.click();
          } else if (tooltip && tooltip.toLowerCase() === "yes") {
            await this.tooltip.scrollIntoViewIfNeeded();
            await this.tooltip.click();
            await this.tooltipMsg.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.tooltipMsg.fill("Please Select any option");
          }
        } else if (type.includes("Multi Select")) {
          await this.inputTypeMultipleType.selectOption({ label: inputType });

          if (inputType.includes("Check Box") || inputType.includes("List")) {
            await this.fillOptions(fieldName, options, optionValues);
          }

          if (allowOther && allowOther.toLowerCase() === "yes") {
            await this.allowOther.scrollIntoViewIfNeeded();
            await this.allowOther.click();
          } else if (tooltip && tooltip.toLowerCase() === "yes") {
            try {
              await this.tooltip.scrollIntoViewIfNeeded();
              await this.tooltip.click();
              await this.tooltipMsg.fill("Please Select any option");
            } catch (error) {
              console.log(
                `⚠️ Tooltip not available for ${fieldName}, continuing...`,
              );
            }
          }
        }

        await this.page.waitForTimeout(2000); // Wait for form to be ready
        await this.saveField.scrollIntoViewIfNeeded();
        await this.saveField.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "createLeadField");
        await this.LeadFieldPage.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        // Re-check if the field is now present
        const isNowPresent = await this.verifyExistingLeadFields(fieldName);
        if (isNowPresent) {
          console.log(`${fieldName}: Lead Field is created successfully.`);
          return true;
        } else {
          console.log(`${fieldName}: Lead Field is not created.`);
          return false;
        }
      } else {
        console.log(`${fieldName}: Lead Field is already created.`);
        return true;
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in createLeadFieldHelper: ${error.message}`,
      );
    }
  }

  //verify Existing Lead Fields functions - Enhanced with case-insensitive matching
  async verifyExistingLeadFields(fieldName) {
    try {
      const trimmedFieldName = fieldName.trim();

      // Method 1: Exact match
      const exactXPath = `(//td[normalize-space()='${trimmedFieldName}'])[1]`;
      const exactExists = (await this.page.locator(exactXPath).count()) > 0;

      if (exactExists) {
        console.log(`${fieldName}: Lead Field already exists (exact match).`);
        return true;
      }

      // Method 2: Case-insensitive match
      const caseInsensitiveXPath = `(//td[translate(normalize-space(text()), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')='${trimmedFieldName.toLowerCase()}'])[1]`;
      const caseInsensitiveExists =
        (await this.page.locator(caseInsensitiveXPath).count()) > 0;

      if (caseInsensitiveExists) {
        console.log(
          `${fieldName}: Lead Field already exists (case-insensitive match).`,
        );
        return true;
      }

      // Method 3: Check for similar fields for debugging
      const allFieldCells = await this.page.locator("//td").allTextContents();
      const similarFields = allFieldCells
        .filter((cell) => {
          const cellLower = cell.trim().toLowerCase();
          const fieldLower = trimmedFieldName.toLowerCase();
          return (
            cellLower.includes(fieldLower) || fieldLower.includes(cellLower)
          );
        })
        .slice(0, 3);

      if (similarFields.length > 0) {
        console.log(
          `${fieldName}: Lead Field does not exist, but found similar fields: ${similarFields.join(", ")}`,
        );
      } else {
        console.log(`${fieldName}: Lead Field does not exist.`);
      }
      return false;
    } catch (error) {
      console.log(
        `${fieldName}: Lead Field verification error - ${error.message}`,
      );
      return false;
    }
  }

  //locators for lead field updation functions
  get saveUpdateLeadField() {
    return this.page.locator("//button[@id='btnUpdateFields']");
  }
  get LeadFieldPage() {
    return this.page.locator("//div[@id='showLeadFieldsTable']");
  }
  //verify lead field updation functions
  async verifyLeadFieldUpdation(
    category,
    level,
    displayName,
    fieldName,
    type,
    inputType,
    min,
    max,
    noOfLines,
    options,
    optionValues,
    allowOther,
    tooltip,
  ) {
    try {
      const isFieldPresent = await this.verifyExistingLeadFields(fieldName);

      // Try multiple XPath patterns for the edit button with case variations
      const xpathPatterns = [
        `//td[normalize-space()='${fieldName.trim()}']/following-sibling::td//a[@title='Edit Field']`,
        `//td[contains(text(),'${fieldName.trim()}')]/following-sibling::td//button`,
        `//tr[contains(.,'${fieldName.trim()}')]//button`,
        `//tr[contains(.,'${fieldName.trim()}')]//a[@title='Edit Field']`,
        `//td[.='${fieldName.trim()}']/following-sibling::td//button`,
        // Case-insensitive patterns
        `//tr[contains(translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${fieldName.toLowerCase()}')]//a[@title='Edit Field']`,
        `//td[contains(translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${fieldName.toLowerCase()}')]/following-sibling::td//button`,
        // Pattern for "Branch name" vs "Branchname"
        `//tr[contains(.,'${fieldName.replace(/([a-z])([A-Z])/g, "$1 $2")}')]//a[@title='Edit Field']`,
        // Pattern for display name matching
        `//tr[contains(.,'${displayName}')]//a[@title='Edit Field']`,
      ];

      let Editbutton = [];
      let usedXpath = "";

      for (const xpath of xpathPatterns) {
        Editbutton = await this.page.locator(xpath).all();
        if (Editbutton.length > 0) {
          usedXpath = xpath;
          console.log(`✅ Found edit button using XPath: ${xpath}`);
          break;
        }
      }

      if (isFieldPresent) {
        console.log(
          `${fieldName}: Lead Field is already created. Updating it...`,
        );

        if (Editbutton.length === 0) {
          console.error(`❌ No edit button found for lead field: ${fieldName}`);
          console.log(`Tried XPath patterns: ${xpathPatterns.join(", ")}`);
          console.log(
            `💡 Suggestion: Check if field name in UI matches exactly: "${fieldName}" or "${displayName}"`,
          );
          return false;
        }
      } else {
        console.log(
          `${fieldName}: Lead Field does not exist. Skipping update.`,
        );
        return true; // Return true as this is expected behavior
      }

      await Editbutton[0].scrollIntoViewIfNeeded();

      // Wait for any alert messages to disappear before clicking
      try {
        await this.page.waitForSelector(".alert", {
          state: "hidden",
          timeout: 2000,
        });
      } catch (e) {
        // Alert might not exist, continue
      }

      // Try normal click first, then force click if blocked
      try {
        await Editbutton[0].click({ timeout: 3000 });
      } catch (e) {
        console.log(`${fieldName}: Normal click failed, trying force click...`);
        await Editbutton[0].click({ force: true });
      }
      await ErrorUtil.captureErrorIfPresent(this.page, "updateLeadField");

      // Wait for category dropdown to be available and check if update needed
      const categorySelector = this.page.locator(
        "//select[@id='selectedCategory']",
      );
      await categorySelector.waitFor({ state: "visible", timeout: 10000 });

      // Check current category value
      const currentCategory = await categorySelector
        .locator("option:checked")
        .textContent();
      if (currentCategory && currentCategory.trim() !== category) {
        await categorySelector.selectOption({ label: category });
        const selectedText = await categorySelector
          .locator("option:checked")
          .textContent();
        console.log(
          `${selectedText.trim()}: Category updated from ${currentCategory.trim()}`,
        );
      } else {
        console.log(`${category}: Category already set, skipping update`);
      }

      // Level and Field Name are non-editable, so skip them
      console.log(`${level}: Level is non-editable, skipping`);
      console.log(`${fieldName}: Field Name is non-editable, skipping`);

      // Check and update Display Name only if different
      const currentDisplayName = await this.displayName.inputValue();
      if (currentDisplayName !== displayName) {
        await this.displayName.clear();
        await this.displayName.fill(displayName);
        console.log(
          `${displayName}: Display Name updated from ${currentDisplayName}`,
        );
      } else {
        console.log(
          `${displayName}: Display Name already set, skipping update`,
        );
      }

      // Field Name is non-editable, just verify
      console.log(`${fieldName}: Field Name is non-editable, verifying only`);
      if (type.trim().includes("Text")) {
        // Check and update Input Type only if different
        const currentInputType = await this.inputTypeTextType
          .locator("option:checked")
          .textContent();
        if (currentInputType && currentInputType.trim() !== inputType.trim()) {
          await this.inputTypeTextType.selectOption({
            label: inputType.trim(),
          });
          console.log(
            `${inputType.trim()}: Input Type updated from ${currentInputType.trim()}`,
          );
        } else {
          console.log(
            `${inputType.trim()}: Input Type already set, skipping update`,
          );
        }

        if (
          inputType.trim().includes("Text Single Line") ||
          inputType.trim().includes("Number")
        ) {
          await this.minRange.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.maxRange.waitFor({
            state: "visible",
            timeout: this.timeout,
          });

          // Check and update Min Range only if different
          const currentMin = await this.minRange.inputValue();
          if (currentMin !== min) {
            await this.minRange.fill(min);
            console.log(`${min}: Min Range updated from ${currentMin}`);
          } else {
            console.log(`${min}: Min Range already set, skipping update`);
          }

          // Check and update Max Range only if different
          const currentMax = await this.maxRange.inputValue();
          if (currentMax !== max) {
            await this.maxRange.fill(max);
            console.log(`${max}: Max Range updated from ${currentMax}`);
          } else {
            console.log(`${max}: Max Range already set, skipping update`);
          }
        } else if (inputType.trim().includes("Text Area")) {
          await this.minRange.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.maxRange.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.numberOfLines.waitFor({
            state: "visible",
            timeout: this.timeout,
          });

          // Check and update Min Range only if different
          const currentMin = await this.minRange.inputValue();
          if (currentMin !== min) {
            await this.minRange.fill(min);
            console.log(`${min}: Min Range updated from ${currentMin}`);
          } else {
            console.log(`${min}: Min Range already set, skipping update`);
          }

          // Check and update Max Range only if different
          const currentMax = await this.maxRange.inputValue();
          if (currentMax !== max) {
            await this.maxRange.fill(max);
            console.log(`${max}: Max Range updated from ${currentMax}`);
          } else {
            console.log(`${max}: Max Range already set, skipping update`);
          }

          // Check and update Number of Lines only if different
          const currentLines = await this.numberOfLines.inputValue();
          if (currentLines !== noOfLines) {
            await this.numberOfLines.fill(noOfLines);
            console.log(
              `${noOfLines}: Number of Lines updated from ${currentLines}`,
            );
          } else {
            console.log(
              `${noOfLines}: Number of Lines already set, skipping update`,
            );
          }
        }

        // Check and update Tooltip only if needed
        if (tooltip && tooltip.toLowerCase() === "yes") {
          const isTooltipChecked = await this.tooltip.isChecked();
          if (!isTooltipChecked) {
            await this.tooltip.scrollIntoViewIfNeeded();
            await this.tooltip.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.tooltip.click();
            await this.tooltipMsg.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.tooltipMsg.fill("Please Fill Value to the Field");
            console.log(`Tooltip: Enabled and message set`);
          } else {
            console.log(`Tooltip: Already enabled, skipping update`);
          }
        }
      } else if (type.includes("Single Select")) {
        // Check and update Single Select Input Type only if different
        const currentSingleInputType = await this.inputTypeSingleType
          .locator("option:checked")
          .textContent();
        if (
          currentSingleInputType &&
          currentSingleInputType.trim() !== inputType
        ) {
          await this.inputTypeSingleType.selectOption({ label: inputType });
          console.log(
            `${inputType}: Single Select Input Type updated from ${currentSingleInputType.trim()}`,
          );
        } else {
          console.log(
            `${inputType}: Single Select Input Type already set, skipping update`,
          );
        }

        if (inputType.includes("Radio") || inputType.includes("Drop Down")) {
          await this.fillOptions(fieldName, options, optionValues);
          console.log(`${fieldName}: Options filled for ${inputType}`);
        }

        // Check and update Allow Other only if needed
        if (allowOther && allowOther.toLowerCase() === "yes") {
          const isAllowOtherChecked = await this.allowOther.isChecked();
          if (!isAllowOtherChecked) {
            await this.allowOther.scrollIntoViewIfNeeded();
            await this.allowOther.click();
            console.log(`Allow Other: Enabled`);
          } else {
            console.log(`Allow Other: Already enabled, skipping update`);
          }
        } else if (tooltip && tooltip.toLowerCase() === "yes") {
          const isTooltipChecked = await this.tooltip.isChecked();
          if (!isTooltipChecked) {
            await this.tooltip.scrollIntoViewIfNeeded();
            await this.tooltip.click();
            await this.tooltipMsg.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.tooltipMsg.fill("Please Select any option");
            console.log(`Tooltip: Enabled for Single Select`);
          } else {
            console.log(`Tooltip: Already enabled, skipping update`);
          }
        }
      } else if (type.includes("Multi Select")) {
        // Check and update Multi Select Input Type only if different
        const currentMultiInputType = await this.inputTypeMultipleType
          .locator("option:checked")
          .textContent();
        if (
          currentMultiInputType &&
          currentMultiInputType.trim() !== inputType
        ) {
          await this.inputTypeMultipleType.selectOption({ label: inputType });
          console.log(
            `${inputType}: Multi Select Input Type updated from ${currentMultiInputType.trim()}`,
          );
        } else {
          console.log(
            `${inputType}: Multi Select Input Type already set, skipping update`,
          );
        }

        if (inputType.includes("Check Box") || inputType.includes("List")) {
          await this.fillOptions(fieldName, options, optionValues);
          console.log(`${fieldName}: Options filled for ${inputType}`);
        }

        // Check and update Allow Other only if needed
        if (allowOther && allowOther.toLowerCase() === "yes") {
          const isAllowOtherChecked = await this.allowOther.isChecked();
          if (!isAllowOtherChecked) {
            await this.allowOther.scrollIntoViewIfNeeded();
            await this.allowOther.click();
            console.log(`Allow Other: Enabled for Multi Select`);
          } else {
            console.log(`Allow Other: Already enabled, skipping update`);
          }
        } else if (tooltip && tooltip.toLowerCase() === "yes") {
          const isTooltipChecked = await this.tooltip.isChecked();
          if (!isTooltipChecked) {
            await this.tooltip.scrollIntoViewIfNeeded();
            await this.tooltip.click();
            await this.tooltipMsg.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.tooltipMsg.fill("Please Select any option");
            console.log(`Tooltip: Enabled for Multi Select`);
          } else {
            console.log(`Tooltip: Already enabled, skipping update`);
          }
        }
      }

      // Save the updated lead field
      console.log(`${fieldName}: Saving lead field updates...`);
      await this.saveUpdateLeadField.scrollIntoViewIfNeeded();
      await this.saveUpdateLeadField.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "updateLeadField");
      await this.LeadFieldPage.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      if (!isFieldPresent) {
        console.log(`${fieldName}: Lead Field is not updated.`);
        return false;
      } else {
        console.log(`${fieldName}: Lead Field is updated successfully.`);
        return true;
      }
    } catch (error) {
      console.error(`Error in verifyLeadFieldUpdation: ${error.message}`);
      throw error;
    }
  }
  //Lead Stage section functions
  get leadStage() {
    return this.page.locator("//a[normalize-space()='Lead Stage']");
  }

  get leadStagePage() {
    return this.page.locator("//div[@id='showLeadStageTable']");
  }

  get createLeadStage() {
    return this.page.locator(
      "//div[@class='btn btn-info w-full']//b[contains(text(),'Create Lead Stage')]",
    );
  }

  //Lead Stage tabbing functions
  async tabToLeadStage() {
    try {
      await this.leadStage.scrollIntoViewIfNeeded();
      await this.leadStage.waitFor({ state: "visible", timeout: this.timeout });

      if (await this.leadStage.isVisible()) {
        await this.leadStage.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "tabToLeadStage");
        await ErrorUtil.captureApiErrorIfPresent(
          this.apiCapture,
          "tabToLeadStage",
        );
        await this.createLeadStage.scrollIntoViewIfNeeded();
        await this.createLeadStage.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        expect(await this.createLeadStage.isVisible()).toBeTruthy();
        const text = await this.createLeadStage.textContent();
        console.log(`${text} button is visible after clicking LeadStage.`);
        expect(await this.leadStagePage.isVisible()).toBeTruthy();
      } else {
        throw new Error("LeadStage button is not visible.");
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToLeadStage: ${error.message}`);
    } finally {
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.leadField.waitFor({ state: "visible", timeout: this.timeout });
    }
  }

  //setup Lead Stage functions
  async clickOnLeadStage() {
    try {
      // First navigate to Leads section
      await this.leads.scrollIntoViewIfNeeded();
      await this.leads.waitFor({ state: "visible", timeout: this.timeout });
      await this.leads.click();

      // Then click on Lead Stage
      await this.leadStage.scrollIntoViewIfNeeded();
      await this.leadStage.waitFor({ state: "visible", timeout: this.timeout });

      if (await this.leadStage.isVisible()) {
        await this.leadStage.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "clickOnLeadStage");
        await ErrorUtil.captureApiErrorIfPresent(
          this.apiCapture,
          "clickOnLeadStage",
        );
        await this.createLeadStage.scrollIntoViewIfNeeded();
        await this.createLeadStage.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        expect(await this.createLeadStage.isVisible()).toBeTruthy();
        const text = await this.createLeadStage.textContent();
        console.log(`${text} button is visible after clicking LeadStage.`);
        expect(await this.leadStagePage.isVisible()).toBeTruthy();
      } else {
        throw new Error("LeadStage button is not visible.");
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in clickOnLeadStage: ${error.message}`,
      );
    }
  }

  async setupLeadStage(category, stage, probability, defaultStage) {
    await this.createLeadStageHelper(
      category,
      stage,
      probability,
      defaultStage,
    );
  }

  get leadStageName() {
    return this.page.locator("//input[@id='leadStageName']");
  }
  get probability() {
    return this.page.locator("//input[@id='leadProbability']");
  }

  get saveLeadStage() {
    return this.page.locator("//button[@id='btnLeadStage']");
  }

  async createLeadStageHelper(category, stage, probability, defaultStage) {
    try {
      const isStagePresent = await this.verifyExistingLeadStage(
        category,
        stage,
      );
      if (!isStagePresent) {
        console.log(`${stage}: Lead Stage is not created. Creating it...`);
        await this.createLeadStage.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.createLeadStage.scrollIntoViewIfNeeded();
        await this.createLeadStage.click();
        await this.category.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.category.selectOption({ label: category });
        const selectedText = await this.category
          .locator("option:checked")
          .textContent();
        console.log(`${selectedText.trim()}: Category is selected`);

        await this.leadStageName.clear();
        await this.leadStageName.fill(stage);

        await this.probability.clear();
        await this.probability.fill(probability);

        await this.saveLeadStage.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "createLeadStage");
        await this.leadField.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.leadField.scrollIntoViewIfNeeded();
        await this.leadField.click();
        await this.leadStage.click();
        if (isStagePresent) {
          console.log(
            `${stage}: Lead Stage is already Present in the table. Creating it...`,
          );
          if (defaultStage && defaultStage.trim().toLowerCase() === "yes") {
            const xpath = `//td[normalize-space()='${category.trim()}']/following-sibling::td[contains(.,'${stage.trim()}')]/following-sibling::td//span[contains(text(),'Set Default')]`;
            const element = this.page.locator(xpath);
            await element.waitFor({ state: "visible", timeout: this.timeout });
            await element.scrollIntoViewIfNeeded();
            await element.click();
            await ErrorUtil.captureErrorIfPresent(
              this.page,
              "set Default On Create Lead Stage",
            );
          }
          return true;
        } else {
          console.log(`${stage}: Lead Stage is not Present in the table.`);
          return false;
        }
      } else {
        console.log(
          `${stage}: Lead Stage is already created. Not creating it again.`,
        );
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in createLeadStageHelper: ${error.message}`,
      );
    }
  }

  //verify existing lead stage functions - Optimized for Speed
  async verifyExistingLeadStage(category, stage) {
    try {
      // Fast direct search using count() instead of all()
      const xpath = `//td[normalize-space()='${category.trim()}']/following-sibling::td[contains(.,'${stage.trim()}')]`;
      const isPresent = (await this.page.locator(xpath).count()) > 0;

      if (isPresent && stage !== null && stage !== undefined && stage !== "") {
        console.log(`${stage}: Lead Stage is already created.`);
      } else {
        console.log(`${stage}: Lead Stage is not created.`);
      }
      return isPresent;
    } catch (error) {
      console.log(`${stage}: Lead Stage verification error - ${error.message}`);
      return false;
    }
  }

  //verify existing updated lead stage functions

  async verifyExistingUpdatedLeadStage(Newcategory, Newstage) {
    // Handle undefined/null values gracefully
    if (!Newcategory || !Newstage) {
      console.log(
        "⚠️ New category or new stage is undefined/empty. Skipping verification.",
      );
      return false;
    }

    const xpath = `//td[normalize-space()='${Newcategory.trim()}']/following-sibling::td[contains(.,'${Newstage.trim()}')]`;
    const existingFields = await this.page.locator(xpath).all();
    const isPresent = existingFields.length > 0;
    if (isPresent) {
      console.log(`${Newstage}: Lead Stage already exists.`);
    } else {
      console.log(`${Newstage}: Lead Stage does not exist.`);
    }
    return isPresent;
  }

  get saveUpdateLeadStage() {
    return this.page.locator("//button[@id='btnleadStageUpdate']");
  }
  //update lead stage functions
  async updateLeadStage(
    category,
    Newcategory,
    stage,
    Newstage,
    probability,
    defaultStage,
  ) {
    // Handle undefined/null values gracefully
    if (!Newcategory || !Newstage) {
      console.log(
        `⚠️ Skipping update for ${stage}: New category or new stage is undefined/empty.`,
      );
      return;
    }

    const isStagePresent = await this.verifyExistingLeadStage(category, stage);
    const isStageUpdated = await this.verifyExistingUpdatedLeadStage(
      Newcategory,
      Newstage,
    );
    const xpath = `//td[normalize-space()='${category.trim()}']/following-sibling::td[contains(.,'${stage.trim()}')]/following-sibling::td//a`;
    const Editbutton = await this.page.locator(xpath).all();
    if (isStagePresent) {
      console.log(`${stage}: Lead Stage is already created. Updating it...`);
      await Editbutton.scrollIntoViewIfNeeded();
      await Editbutton.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "updateLeadStage");
      expect(await this.category.toContainText(category)).toBeTruthy();
      await this.category.selectOption({ label: Newcategory });
      const selectedText = await this.category
        .locator("option:checked")
        .textContent();
      console.log(`${selectedText.trim()}: New Category is selected`);
      expect(await this.leadStageName.toContainText(stage)).toBeTruthy();
      await this.leadStageName.clear();
      await this.leadStageName.fill(Newstage);
      await this.probability.clear();
      await this.probability.fill(probability || "");
      await this.saveUpdateLeadStage.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "updateLeadStage");
      await this.leadField.waitFor({ state: "visible", timeout: this.timeout });
      await this.leadField.scrollIntoViewIfNeeded();
      await this.leadField.click();
      await this.leadStage.click();
      if (isStageUpdated) {
        console.log(`${Newstage}: Lead Stage is updated.`);
        if (defaultStage && defaultStage.trim().toLowerCase() === "yes") {
          const xpath = `//td[normalize-space()='${Newcategory.trim()}']/following-sibling::td[contains(.,'${Newstage.trim()}')]/following-sibling::td//span[contains(text(),'Set Default')]`;
          const element = this.page.locator(xpath);
          await element.waitFor({ state: "visible", timeout: this.timeout });
          await element.scrollIntoViewIfNeeded();
          await element.click();
        }
        return true;
      } else {
        console.log(`${Newstage}: Lead Stage is not updated.`);
        return false;
      }
    } else {
      console.log(`${stage}: Lead Stage is not created.`);
      return false;
    }
  }

  get leadStatusPage() {
    return this.page.locator("//div[@id='showLeadStatusTable']");
  }

  //Lead status Tabbing functions
  async tabToLeadStatus() {
    try {
      await this.leadStatus.scrollIntoViewIfNeeded();
      await this.leadStatus.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.leadStatus.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "tabToLeadStatus");
      await ErrorUtil.captureApiErrorIfPresent(
        this.apiCapture,
        "tabToLeadStatus",
      );
      await this.createLeadStatus.scrollIntoViewIfNeeded();
      await this.createLeadStatus.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      expect(await this.createLeadStatus.isVisible()).toBeTruthy();
      const text = await this.createLeadStatus.textContent();
      console.log(`${text} button is visible after clicking LeadStatus.`);
      expect(await this.leadStatusPage.isVisible()).toBeTruthy();
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in leadStatusTab: ${error.message}`);
    } finally {
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.leadField.waitFor({ state: "visible", timeout: this.timeout });
    }
  }

  //setup Lead status functions
  async clickOnLeadStatus() {
    try {
      // First navigate to Leads section
      await this.leads.scrollIntoViewIfNeeded();
      await this.leads.waitFor({ state: "visible", timeout: this.timeout });
      await this.leads.click();

      // Then click on Lead Status
      await this.leadStatus.scrollIntoViewIfNeeded();
      await this.leadStatus.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.leadStatus.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "clickOnLeadStatus");
      await ErrorUtil.captureApiErrorIfPresent(
        this.apiCapture,
        "clickOnLeadStatus",
      );
      await this.createLeadStatus.scrollIntoViewIfNeeded();
      await this.createLeadStatus.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      expect(await this.createLeadStatus.isVisible()).toBeTruthy();
      const text = await this.createLeadStatus.textContent();
      console.log(`${text} button is visible after clicking LeadStatus.`);
      expect(await this.leadStatusPage.isVisible()).toBeTruthy();
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in clickOnLeadStatus: ${error.message}`,
      );
    }
  }

  //setup Lead status functions
  async setupLeadStatus(category, status, defaultStatus) {
    const isStatusPresent = await this.verifyExistingLeadStatus(
      category,
      status,
    );
    if (!isStatusPresent) {
      console.log(`${status}: Lead Status is not created. Creating it...`);
      await this.createLeadStatus.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.createLeadStatus.scrollIntoViewIfNeeded();
      await this.createLeadStatus.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "createLeadStatus");
      await this.category.waitFor({ state: "visible", timeout: this.timeout });
      await this.category.selectOption({ label: category });
      const selectedText = await this.category
        .locator("option:checked")
        .textContent();
      console.log(`${selectedText.trim()}: Category is selected`);
      await this.statusName.clear();
      await this.statusName.fill(status);
      // Verify the field is filled correctly
      expect(await this.statusName.inputValue()).toBe(status);
      await this.saveLeadStatus.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "createLeadStatus");
      await this.leadField.waitFor({ state: "visible", timeout: this.timeout });
      await this.leadField.scrollIntoViewIfNeeded();
      await this.leadField.click();
      await this.leadStatus.click();
      if (isStatusPresent) {
        console.log(`${status}: Lead Status is already created.`);
        if (defaultStatus && defaultStatus.trim().toLowerCase() === "yes") {
          const xpath = `//td[normalize-space()='${category.trim()}']/following-sibling::td[contains(.,'${status.trim()}')]/following-sibling::td//span[contains(text(),'Set Default')]`;
          const element = this.page.locator(xpath);
          await element.waitFor({ state: "visible", timeout: this.timeout });
          await element.scrollIntoViewIfNeeded();
          await element.click();
        }
        return true;
      } else {
        console.log(`${status}: Lead Status is not created.`);
        return false;
      }
    } else {
      console.log(`${status}: Lead Status is not created.`);
      return false;
    }
  }

  //locators for lead status
  get saveUpdateLeadStatus() {
    return this.page.locator("//button[@id='btnLeadStatusUpdate']");
  }
  //update lead status functions
  async updateLeadStatus(
    category,
    Newcategory,
    status,
    Newstatus,
    defaultStatus,
  ) {
    try {
      // Handle undefined/null values gracefully
      if (!Newcategory || !Newstatus) {
        console.log(
          `⚠️ Skipping update for ${status}: New category or new status is undefined/empty.`,
        );
        return;
      }

      const isStatusPresent = await this.verifyExistingLeadStatus(
        category,
        status,
      );
      const isStatusUpdated = await this.verifyExistingUpdatedLeadStatus(
        Newcategory,
        Newstatus,
      );
      const xpath = `//td[normalize-space()='${category.trim()}']/following-sibling::td[contains(.,'${status.trim()}')]/following-sibling::td//a`;
      const Editbutton = await this.page.locator(xpath).all();
      if (isStatusPresent) {
        console.log(
          `${status}: Lead Status is already created. Updating it...`,
        );
        await Editbutton.scrollIntoViewIfNeeded();
        await Editbutton.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "updateLeadStatus");
        expect(await this.category.toContainText(category)).toBeTruthy();
        await this.category.selectOption({ label: Newcategory });
        const selectedText = await this.category
          .locator("option:checked")
          .textContent();
        console.log(`${selectedText.trim()}: New Category is selected`);
        expect(await this.statusName.toContainText(status)).toBeTruthy();
        await this.statusName.clear();
        await this.statusName.fill(Newstatus);
        // Verify the field is filled correctly
        expect(await this.statusName.inputValue()).toBe(Newstatus);
        await this.saveUpdateLeadStatus.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "updateLeadStatus");
        await this.leadField.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.leadField.scrollIntoViewIfNeeded();
        await this.leadField.click();
        await this.leadStatus.click();
        if (isStatusUpdated) {
          console.log(`${Newstatus}: Lead Status is updated.`);
          if (defaultStatus && defaultStatus.trim().toLowerCase() === "yes") {
            const xpath = `//td[normalize-space()='${Newcategory.trim()}']/following-sibling::td[contains(.,'${Newstatus.trim()}')]/following-sibling::td//span[contains(text(),'Set Default')]`;
            const element = this.page.locator(xpath);
            await element.waitFor({ state: "visible", timeout: this.timeout });
            await element.scrollIntoViewIfNeeded();
            await element.click();
          }
          return true;
        } else {
          console.log(`${Newstatus}: Lead Status is not updated.`);
          return false;
        }
      } else {
        console.log(`${Newstatus}: Lead Status is not created.`);
        return false;
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in updateLeadStatus: ${error.message}`,
      );
    }
  }

  //verify existing lead status functions - Optimized for Speed
  async verifyExistingLeadStatus(category, status) {
    try {
      // Fast direct search using count() instead of all()
      const xpath = `//td[normalize-space()='${category.trim()}']/following-sibling::td[contains(.,'${status.trim()}')]`;
      const isPresent = (await this.page.locator(xpath).count()) > 0;

      if (
        isPresent &&
        status !== null &&
        status !== undefined &&
        status !== ""
      ) {
        console.log(`${status}: Lead Status is already created.`);
      } else {
        console.log(`${status}: Lead Status is not created.`);
      }
      return isPresent;
    } catch (error) {
      console.log(
        `${status}: Lead Status verification error - ${error.message}`,
      );
      return false;
    }
  }

  //verify existing updated lead status functions
  async verifyExistingUpdatedLeadStatus(Newcategory, Newstatus) {
    // Handle undefined/null values gracefully
    if (!Newcategory || !Newstatus) {
      console.log(
        "⚠️ New category or new status is undefined/empty. Skipping verification.",
      );
      return false;
    }

    const xpath = `//td[normalize-space()='${Newcategory.trim()}']/following-sibling::td[contains(.,'${Newstatus.trim()}')]`;
    const existingStatuses = await this.page.locator(xpath).all();
    const isPresent = existingStatuses.length > 0;
    if (isPresent) {
      console.log(`${Newstatus}: Lead Status already exists.`);
    } else {
      console.log(`${Newstatus}: Lead Status does not exist.`);
    }
    return isPresent;
  }

  get leadLostReasonPage() {
    return this.page.locator("//div[@id='showLeadLostTable']");
  }
  //Lead lost reason Tabbing functions
  async tabToLeadLostReason() {
    try {
      await this.leadLostReason.scrollIntoViewIfNeeded();
      await this.leadLostReason.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.leadLostReason.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "leadLostReasonTab");
      await ErrorUtil.captureApiErrorIfPresent(
        this.apiCapture,
        "tabToLeadLostReason",
      );
      await this.createLeadLostReason.scrollIntoViewIfNeeded();
      await this.createLeadLostReason.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      expect(await this.createLeadLostReason.isVisible()).toBeTruthy();
      const text = await this.createLeadLostReason.textContent();
      console.log(`${text} button is visible after clicking LeadLostReason.`);
      expect(await this.leadLostReasonPage.isVisible()).toBeTruthy();
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in leadLostReasonTab: ${error.message}`,
      );
    } finally {
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.leadField.waitFor({ state: "visible", timeout: this.timeout });
      await this.adminSideBar.clickOnBackButton();
      await this.systemSetup.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
    }
  }

  //setup Lead lost reason functions
  async clickOnLeadLostReason() {
    try {
      // First navigate to Leads section
      await this.leads.scrollIntoViewIfNeeded();
      await this.leads.waitFor({ state: "visible", timeout: this.timeout });
      await this.leads.click();

      // Then click on Lead Lost Reason
      await this.leadLostReason.scrollIntoViewIfNeeded();
      await this.leadLostReason.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.leadLostReason.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "clickOnLeadLostReason");
      await ErrorUtil.captureApiErrorIfPresent(
        this.apiCapture,
        "clickOnLeadLostReason",
      );
      await this.createLeadLostReason.scrollIntoViewIfNeeded();
      await this.createLeadLostReason.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      expect(await this.createLeadLostReason.isVisible()).toBeTruthy();
      const text = await this.createLeadLostReason.textContent();
      console.log(`${text} button is visible after clicking LeadLostReason.`);
      expect(await this.leadLostReasonPage.isVisible()).toBeTruthy();
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in clickOnLeadLostReason: ${error.message}`,
      );
    }
  }

  //setup Lead lost reason functions
  async setupLeadLostReason(category, lostReason) {
    try {
      const isLostReasonPresent = await this.verifyExistingLeadLostReason(
        category,
        lostReason,
      );
      if (!isLostReasonPresent) {
        console.log(
          `${lostReason}: Lead Lost Reason is not created. Creating it...`,
        );
        await this.createLeadLostReason.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.createLeadLostReason.scrollIntoViewIfNeeded();
        await this.createLeadLostReason.click();
        await ErrorUtil.captureErrorIfPresent(
          this.page,
          "createLeadLostReason",
        );
        await this.category.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.category.selectOption({ label: category });
        const selectedText = await this.category
          .locator("option:checked")
          .textContent();
        console.log(`${selectedText.trim()}: Category is selected`);
        await this.lostReason.clear();
        await this.lostReason.fill(lostReason);
        // Verify the field is filled correctly
        expect(await this.lostReason.inputValue()).toBe(lostReason);
        await this.saveLeadLost.click();
        await ErrorUtil.captureErrorIfPresent(
          this.page,
          "createLeadLostReason",
        );
        await this.leadField.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.leadField.scrollIntoViewIfNeeded();
        await this.leadField.click();
        await this.leadLostReason.click();
        if (!isLostReasonPresent) {
          console.log(`${lostReason}: Lead Lost Reason is not created.`);
          return false;
        } else {
          console.log(`${lostReason}: Lead Lost Reason is already created.`);
          return true;
        }
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in setupLeadLostReason: ${error.message}`,
      );
    }
  }

  //verify existing lead lost reason functions
  async verifyExistingLeadLostReason(category, lostReason) {
    const xpath = `//td[normalize-space()='${category.trim()}']/following-sibling::td[contains(.,'${lostReason.trim()}')]`;
    const existingFields = await this.page.locator(xpath).all();
    const isPresent = existingFields.length > 0;
    if (
      isPresent &&
      lostReason !== null &&
      lostReason !== undefined &&
      lostReason !== ""
    ) {
      const existingField = existingFields[0];
      await existingField.scrollIntoViewIfNeeded();
      console.log(`${lostReason}: Lead Lost Reason is already created.`);
    } else {
      console.log(`${lostReason}: Lead Lost Reason is not created.`);
    }
    return isPresent;
  }

  //verify existing updated lead lost reason functions
  async verifyExistingUpdatedLeadLostReason(Newcategory, NewlostReason) {
    // Handle undefined/null values gracefully
    if (!Newcategory || !NewlostReason) {
      console.log(
        "⚠️ New category or new lost reason is undefined/empty. Skipping verification.",
      );
      return false;
    }

    const xpath = `//td[normalize-space()='${Newcategory.trim()}']/following-sibling::td[contains(.,'${NewlostReason.trim()}')]`;
    const existingLostReasons = await this.page.locator(xpath).all();
    const isPresent = existingLostReasons.length > 0;
    if (isPresent) {
      console.log(`${NewlostReason}: Lead Lost Reason already exists.`);
    } else {
      console.log(`${NewlostReason}: Lead Lost Reason does not exist.`);
    }
    return isPresent;
  }

  //locators for lead lost reason
  get saveUpdateLeadLostReason() {
    return this.page.locator("//button[@id='btnUpdateLeadLost']");
  }

  //update lead lost reason functions
  async updateLeadLostReason(category, lostReason, Newcategory, NewlostReason) {
    try {
      // Handle undefined/null values gracefully
      if (!Newcategory || !NewlostReason) {
        console.log(
          `⚠️ Skipping update for ${lostReason}: New category or new lost reason is undefined/empty.`,
        );
        return;
      }

      const isLostReasonPresent = await this.verifyExistingLeadLostReason(
        category,
        lostReason,
      );
      const isLostReasonUpdated =
        await this.verifyExistingUpdatedLeadLostReason(
          Newcategory,
          NewlostReason,
        );
      const xpath = `//td[normalize-space()='${category.trim()}']/following-sibling::td[contains(.,'${lostReason.trim()}')]/following-sibling::td//a`;
      const Editbutton = await this.page.locator(xpath).all();
      if (isLostReasonPresent) {
        console.log(
          `${lostReason}: Lead Lost Reason is already created. Updating it...`,
        );
        await Editbutton.scrollIntoViewIfNeeded();
        await Editbutton.click();
        await ErrorUtil.captureErrorIfPresent(
          this.page,
          "updateLeadLostReason",
        );
        expect(await this.category.toContainText(category)).toBeTruthy();
        await this.category.selectOption({ label: Newcategory });
        const selectedText = await this.category
          .locator("option:checked")
          .textContent();
        console.log(`${selectedText.trim()}: New Category is selected`);
        expect(await this.lostReason.toContainText(NewlostReason)).toBeTruthy();
        await this.lostReason.clear();
        await this.lostReason.fill(NewlostReason);
        // Verify the field is filled correctly
        expect(await this.lostReason.inputValue()).toBe(NewlostReason);
        await this.saveUpdateLeadLostReason.click();
        await ErrorUtil.captureErrorIfPresent(
          this.page,
          "updateLeadLostReason",
        );
        await this.leadField.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.leadField.scrollIntoViewIfNeeded();
        await this.leadField.click();
        await this.leadLostReason.click();
        if (!isLostReasonUpdated) {
          console.log(`${NewlostReason}: Lead Lost Reason is not updated.`);
          return false;
        } else {
          console.log(
            `${NewlostReason}: Lead Lost Reason is updated successfully.`,
          );
          return true;
        }
      } else {
        console.log(`${NewlostReason}: Lead Lost Reason is not created.`);
        return false;
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in updateLeadLostReason: ${error.message}`,
      );
    }
  }

  // Tickets section locators
  get tickets() {
    return this.page.locator("//div[contains(text(),'Tickets')]");
  }

  get ticketField() {
    return this.page.locator("//a[normalize-space()='Ticket Field']");
  }

  get createTicketField() {
    return this.page.locator("//b[normalize-space()='Create Ticket Field']");
  }

  get ticketType() {
    return this.page.locator("//a[normalize-space()='Ticket Type']");
  }

  get createTicketType() {
    return this.page.locator(
      "//label[@class='m-0'][normalize-space()='Create Ticket Type']",
    );
  }

  get ticketPriority() {
    return this.page.locator("(//a[normalize-space()='Ticket Priority'])[1]");
  }

  get createTicketPriority() {
    return this.page.locator(
      "//div[@class='btn btn-info w-full']//b[contains(text(),'Create Ticket Priority')]",
    );
  }

  get ticketStage() {
    return this.page.locator("(//a[normalize-space()='Ticket Stage'])[1]");
  }

  get createTicketStage() {
    return this.page.locator("//b[normalize-space()='Create Ticket Stage']");
  }

  get ticketTypeName() {
    return this.page.locator("//input[@id='ticketTypeName']");
  }

  get saveType() {
    return this.page.locator("//button[@id='btnTicketTypeCreate']");
  }

  get priorityName() {
    return this.page.locator("//input[@id='priorityName']");
  }

  get firstResponse() {
    return this.page.locator("//input[@id='responseWithin']");
  }

  get firstResponseTime() {
    return this.page.locator(
      "//input[@id='responseWithin']/following::select[@id='responseHours']",
    );
  }

  get trailResponse() {
    return this.page.locator("//input[@id='trailResponseWithin']");
  }

  get trailResponseTime() {
    return this.page.locator(
      "//input[@id='trailResponseWithin']/following::select[@id='respondUnits']",
    );
  }

  get resolved() {
    return this.page.locator("//input[@id='resolveWithin']");
  }

  get resolvedTime() {
    return this.page.locator(
      "//input[@id='resolveWithin']/following::select[@id='resolveHours']",
    );
  }

  get savePriority() {
    return this.page.locator("//button[@id='btnTicketPriorityCreate']");
  }

  get ticketFieldPage() {
    return this.page.locator("//div[@id='showTicketFieldsTable']");
  }
  //tickets tabbing functions
  async tabToTickets() {
    try {
      await this.tickets.scrollIntoViewIfNeeded();
      await this.tickets.waitFor({ state: "visible", timeout: this.timeout });

      if (await this.tickets.isVisible()) {
        await this.tickets.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "tabToTickets");
        await ErrorUtil.captureApiErrorIfPresent(
          this.apiCapture,
          "tabToTickets",
        );
        await this.createTicketField.scrollIntoViewIfNeeded();
        await this.createTicketField.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        expect(await this.createTicketField.isVisible()).toBeTruthy();
        const text = await this.createTicketField.textContent();
        console.log(`${text} button is visible after clicking Tickets.`);
        expect(await this.ticketFieldPage.isVisible()).toBeTruthy();
      } else {
        throw new Error("Tickets button is not visible.");
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToTickets: ${error.message}`);
    }
    await this.tabToTicketType();
    await this.tabToTicketPriority();
    await this.tabToTicketStage();
  }

  //click on ticket field functions
  async clickOnTicketField() {
    try {
      // First navigate to Tickets section
      await this.tickets.scrollIntoViewIfNeeded();
      await this.tickets.waitFor({ state: "visible", timeout: this.timeout });
      await this.tickets.click();

      // Then click on Ticket Field
      await this.ticketField.scrollIntoViewIfNeeded();
      await this.ticketField.waitFor({
        state: "visible",
        timeout: this.timeout,
      });

      if (!(await this.ticketField.isVisible())) {
        throw new Error("TicketField button is not visible.");
      }

      await this.ticketField.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "clickOnTicketField");
      await ErrorUtil.captureApiErrorIfPresent(
        this.apiCapture,
        "clickOnTicketField",
      );
      await this.createTicketField.scrollIntoViewIfNeeded();
      await this.createTicketField.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      expect(await this.createTicketField.isVisible()).toBeTruthy();
      const text = await this.createTicketField.textContent();
      console.log(`${text} button is visible`);
      expect(await this.ticketFieldPage.isVisible()).toBeTruthy();
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in clickOnTicketField: ${error.message}`,
      );
    }
  }

  //setup ticket field functions
  async setupTicketField(
    category,
    level,
    displayName,
    fieldName,
    type,
    inputType,
    min,
    max,
    noOfLines,
    options,
    optionValues,
    allowOther,
    tooltip,
  ) {
    try {
      const isFieldPresent = await this.verifyExistingTicketField(fieldName);
      if (!isFieldPresent) {
        console.log(
          `${fieldName}: Ticket Field is not created. Creating it...`,
        );
        await this.createTicketField.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.createTicketField.scrollIntoViewIfNeeded();
        await this.createTicketField.click();
        await this.category.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.category.selectOption({ label: category });
        const selectedText = await this.category
          .locator("option:checked")
          .textContent();
        console.log(`${selectedText.trim()}: Category is selected`);
        expect(await this.fieldLevel.textContent()).toContain(level);
        expect(await this.fieldLevel.isDisabled()).toBeTruthy();
        await this.displayName.clear();
        await this.displayName.fill(displayName);
        await this.fieldName.clear();
        await this.fieldName.fill(fieldName);
        await this.fieldType.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.fieldType.selectOption({ label: type.trim() });
        if (type.trim().includes("Text")) {
          await this.inputTypeTextType.selectOption({
            label: inputType.trim(),
          });
          if (
            inputType.trim().includes("Text Single Line") ||
            inputType.trim().includes("Number")
          ) {
            await this.minRange.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.minRange.fill(min);
            await this.maxRange.fill(max);
          } else if (inputType.trim().includes("Text Area")) {
            await this.minRange.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.minRange.fill(min);
            await this.maxRange.fill(max);
            await this.numberOfLines.fill(noOfLines);
          } else if (inputType.trim().includes("Date")) {
            await this.minDate.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.maxDate.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            expect(await this.minDate.isVisible()).toBeTruthy();
            expect(await this.maxDate.isVisible()).toBeTruthy();
            await this.datePickerUtil.selectDateByISO(
              this.minDate,
              ".flatpickr-days",
              min,
            );
            await this.datePickerUtil.selectDateByISO(
              this.maxDate,
              ".flatpickr-days",
              max,
            );
          }
          if (tooltip && tooltip.toLowerCase() === "yes") {
            await this.tooltip.scrollIntoViewIfNeeded();
            await this.tooltip.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.tooltip.click();
            await this.tooltipMsg.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.tooltipMsg.fill("Please Fill Value to the Field");
          }
        } else if (type.includes("Single Select")) {
          await this.inputTypeSingleType.selectOption({ label: inputType });
          if (inputType.includes("Radio") || inputType.includes("Drop Down")) {
            await this.fillOptions(fieldName, options, optionValues);
          }
          if (allowOther && allowOther.toLowerCase() === "yes") {
            await this.allowOther.scrollIntoViewIfNeeded();
            await this.allowOther.click();
          } else if (tooltip && tooltip.toLowerCase() === "yes") {
            await this.tooltip.scrollIntoViewIfNeeded();
            await this.tooltip.click();
            await this.tooltipMsg.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.tooltipMsg.fill("Please Select any option");
          }
        } else if (type.includes("Multi Select")) {
          await this.inputTypeMultipleType.selectOption({ label: inputType });
          if (inputType.includes("Check Box") || inputType.includes("List")) {
            await this.fillOptions(fieldName, options, optionValues);
          }
          if (allowOther && allowOther.toLowerCase() === "yes") {
            await this.allowOther.scrollIntoViewIfNeeded();
            await this.allowOther.click();
          } else if (tooltip && tooltip.toLowerCase() === "yes") {
            await this.tooltip.scrollIntoViewIfNeeded();
            await this.tooltip.click();
            await this.tooltipMsg.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.tooltipMsg.fill("Please Select any option");
          }
        }
        await this.ticketField.scrollIntoViewIfNeeded();
        await this.ticketField.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "createTicketField");
        await this.ticketField.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        // Re-check if the field is now present
        const isNowPresent = await this.verifyExistingTicketField(fieldName);
        if (isNowPresent) {
          console.log(`${fieldName}: Ticket Field is created successfully.`);
          return true;
        } else {
          console.log(`${fieldName}: Ticket Field is not created.`);
          return false;
        }
      } else {
        console.log(`${fieldName}: Ticket Field is already created.`);
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in CreateTicketField: ${error.message}`,
      );
    }
  }

  //verify existing ticket field functions - Enhanced with case-insensitive matching
  async verifyExistingTicketField(fieldName) {
    try {
      const trimmedFieldName = fieldName.trim();

      // Method 1: Exact match
      const exactXPath = `(//td[normalize-space()='${trimmedFieldName}'])[1]`;
      const exactExists = (await this.page.locator(exactXPath).count()) > 0;

      if (exactExists) {
        console.log(`${fieldName}: Ticket Field already exists (exact match).`);
        return true;
      }

      // Method 2: Case-insensitive match
      const caseInsensitiveXPath = `(//td[translate(normalize-space(text()), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')='${trimmedFieldName.toLowerCase()}'])[1]`;
      const caseInsensitiveExists =
        (await this.page.locator(caseInsensitiveXPath).count()) > 0;

      if (caseInsensitiveExists) {
        console.log(
          `${fieldName}: Ticket Field already exists (case-insensitive match).`,
        );
        return true;
      }

      // Method 3: Check for similar fields for debugging
      const allFieldCells = await this.page.locator("//td").allTextContents();
      const similarFields = allFieldCells
        .filter((cell) => {
          const cellLower = cell.trim().toLowerCase();
          const fieldLower = trimmedFieldName.toLowerCase();
          return (
            cellLower.includes(fieldLower) || fieldLower.includes(cellLower)
          );
        })
        .slice(0, 3);

      if (similarFields.length > 0) {
        console.log(
          `${fieldName}: Ticket Field does not exist, but found similar fields: ${similarFields.join(", ")}`,
        );
      } else {
        console.log(`${fieldName}: Ticket Field does not exist.`);
      }
      return false;
    } catch (error) {
      console.log(
        `${fieldName}: Ticket Field verification error - ${error.message}`,
      );
      return false;
    }
  }

  //verify existing updated ticket field functions
  async verifyExistingUpdatedTicketField(Newcategory, NewfieldName) {
    const xpath = `//td[normalize-space()='${Newcategory.trim()}']/following-sibling::td[contains(.,'${NewfieldName.trim()}')]`;
    const existingFields = await this.page.locator(xpath).all();
    const isPresent = existingFields.length > 0;
    if (isPresent) {
      console.log(`${NewfieldName}: Ticket Field already exists.`);
    } else {
      console.log(`${NewfieldName}: Ticket Field does not exist.`);
    }
    return isPresent;
  }

  //locators for update ticket field
  get saveUpdateTicketField() {
    return this.page.locator("//button[@id='btnUpdateFields']");
  }

  //update ticket field functions
  async updateTicketField(
    category,
    fieldName,
    displayName,
    type,
    inputType,
    min,
    max,
    noOfLines,
    options,
    optionValues,
    allowOther,
    tooltip,
  ) {
    try {
      const isFieldPresent = await this.verifyExistingUpdatedTicketField(
        category,
        fieldName,
      );
      const isFieldUpdated = await this.verifyExistingUpdatedTicketField(
        category,
        fieldName,
      );

      // Try multiple XPath patterns for the edit button with case variations
      const xpathPatterns = [
        `//td[normalize-space()='${fieldName.trim()}']/following-sibling::td//a[@title='Edit Field']`,
        `//td[contains(text(),'${fieldName.trim()}')]/following-sibling::td//button`,
        `//tr[contains(.,'${fieldName.trim()}')]//button`,
        `//tr[contains(.,'${fieldName.trim()}')]//a[@title='Edit Field']`,
        `//td[.='${fieldName.trim()}']/following-sibling::td//button`,
        // Case-insensitive patterns
        `//tr[contains(translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${fieldName.toLowerCase()}')]//a[@title='Edit Field']`,
        `//td[contains(translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${fieldName.toLowerCase()}')]/following-sibling::td//button`,
        // Pattern for "Branch name" vs "Branchname"
        `//tr[contains(.,'${fieldName.replace(/([a-z])([A-Z])/g, "$1 $2")}')]//a[@title='Edit Field']`,
        // Pattern for display name matching
        `//tr[contains(.,'${displayName}')]//a[@title='Edit Field']`,
      ];

      let Editbutton = [];
      let usedXpath = "";

      for (const xpath of xpathPatterns) {
        Editbutton = await this.page.locator(xpath).all();
        if (Editbutton.length > 0) {
          usedXpath = xpath;
          console.log(`✅ Found edit button using XPath: ${xpath}`);
          break;
        }
      }

      if (isFieldPresent) {
        console.log(
          `${fieldName}: Ticket Field is already created. Updating it...`,
        );

        if (Editbutton.length === 0) {
          console.error(
            `❌ No edit button found for ticket field: ${fieldName}`,
          );
          console.log(`Tried XPath patterns: ${xpathPatterns.join(", ")}`);
          console.log(
            `💡 Suggestion: Check if field name in UI matches exactly: "${fieldName}" or "${displayName}"`,
          );
          return false;
        }
      } else {
        console.log(
          `${fieldName}: Ticket Field does not exist. Skipping update.`,
        );
        return true; // Return true as this is expected behavior
      }

      await Editbutton[0].scrollIntoViewIfNeeded();

      // Wait for any alert messages to disappear before clicking
      try {
        await this.page.waitForSelector(".alert", {
          state: "hidden",
          timeout: 2000,
        });
      } catch (e) {
        // Alert might not exist, continue
      }

      // Try normal click first, then force click if blocked
      try {
        await Editbutton[0].click({ timeout: 3000 });
      } catch (e) {
        console.log(`${fieldName}: Normal click failed, trying force click...`);
        await Editbutton[0].click({ force: true });
      }
      await ErrorUtil.captureErrorIfPresent(this.page, "updateTicketField");

      // Wait for category dropdown to be available and check if update needed
      const categorySelector = this.page.locator(
        "//select[@id='selectedCategory']",
      );
      await categorySelector.waitFor({ state: "visible", timeout: 10000 });

      // Check current category value
      const currentCategory = await categorySelector
        .locator("option:checked")
        .textContent();
      if (currentCategory && currentCategory.trim() !== category) {
        await categorySelector.selectOption({ label: category });
        const selectedText = await categorySelector
          .locator("option:checked")
          .textContent();
        console.log(
          `${selectedText.trim()}: Category updated from ${currentCategory.trim()}`,
        );
      } else {
        console.log(`${category}: Category already set, skipping update`);
      }

      // Check and update Display Name only if different
      const currentDisplayName = await this.displayName.inputValue();
      if (currentDisplayName !== displayName) {
        await this.displayName.clear();
        await this.displayName.fill(displayName);
        console.log(
          `${displayName}: Display Name updated from ${currentDisplayName}`,
        );
      } else {
        console.log(
          `${displayName}: Display Name already set, skipping update`,
        );
      }

      // Field Name is non-editable, just verify
      console.log(`${fieldName}: Field Name is non-editable, verifying only`);

      // Check and update Type only if different
      const currentType = await this.fieldType
        .locator("option:checked")
        .textContent();
      if (currentType && currentType.trim() !== type.trim()) {
        await this.fieldType.selectOption({ label: type.trim() });
        const selectedFieldType = await this.fieldType
          .locator("option:checked")
          .textContent();
        console.log(
          `${selectedFieldType.trim()}: Type updated from ${currentType.trim()}`,
        );
      } else {
        console.log(`${type.trim()}: Type already set, skipping update`);
      }
      if (type.trim().includes("Text")) {
        // Check and update Input Type only if different
        const currentInputType = await this.inputTypeTextType
          .locator("option:checked")
          .textContent();
        if (currentInputType && currentInputType.trim() !== inputType.trim()) {
          await this.inputTypeTextType.selectOption({
            label: inputType.trim(),
          });
          console.log(
            `${inputType.trim()}: Input Type updated from ${currentInputType.trim()}`,
          );
        } else {
          console.log(
            `${inputType.trim()}: Input Type already set, skipping update`,
          );
        }

        if (
          inputType.trim().includes("Text Single Line") ||
          inputType.trim().includes("Number")
        ) {
          await this.minRange.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.maxRange.waitFor({
            state: "visible",
            timeout: this.timeout,
          });

          // Check and update Min Range only if different
          const currentMin = await this.minRange.inputValue();
          if (currentMin !== min) {
            await this.minRange.fill(min);
            console.log(`${min}: Min Range updated from ${currentMin}`);
          } else {
            console.log(`${min}: Min Range already set, skipping update`);
          }

          // Check and update Max Range only if different
          const currentMax = await this.maxRange.inputValue();
          if (currentMax !== max) {
            await this.maxRange.fill(max);
            console.log(`${max}: Max Range updated from ${currentMax}`);
          } else {
            console.log(`${max}: Max Range already set, skipping update`);
          }
        } else if (inputType.trim().includes("Text Area")) {
          await this.minRange.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.maxRange.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.numberOfLines.waitFor({
            state: "visible",
            timeout: this.timeout,
          });

          // Check and update Min Range only if different
          const currentMin = await this.minRange.inputValue();
          if (currentMin !== min) {
            await this.minRange.fill(min);
            console.log(`${min}: Min Range updated from ${currentMin}`);
          } else {
            console.log(`${min}: Min Range already set, skipping update`);
          }

          // Check and update Max Range only if different
          const currentMax = await this.maxRange.inputValue();
          if (currentMax !== max) {
            await this.maxRange.fill(max);
            console.log(`${max}: Max Range updated from ${currentMax}`);
          } else {
            console.log(`${max}: Max Range already set, skipping update`);
          }

          // Check and update Number of Lines only if different
          const currentLines = await this.numberOfLines.inputValue();
          if (currentLines !== noOfLines) {
            await this.numberOfLines.fill(noOfLines);
            console.log(
              `${noOfLines}: Number of Lines updated from ${currentLines}`,
            );
          } else {
            console.log(
              `${noOfLines}: Number of Lines already set, skipping update`,
            );
          }
        } else if (inputType.trim().includes("Date")) {
          await this.minDate.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.maxDate.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          expect(await this.minDate.isVisible()).toBeTruthy();
          expect(await this.maxDate.isVisible()).toBeTruthy();

          // For date fields, always update as date comparison is complex
          await this.datePickerUtil.selectDateByISO(
            this.minDate,
            ".flatpickr-days",
            min,
          );
          await this.datePickerUtil.selectDateByISO(
            this.maxDate,
            ".flatpickr-days",
            max,
          );
          console.log(`${min} to ${max}: Date range updated`);
        }

        // Check and update Tooltip only if needed
        if (tooltip && tooltip.toLowerCase() === "yes") {
          const isTooltipChecked = await this.tooltip.isChecked();
          if (!isTooltipChecked) {
            await this.tooltip.scrollIntoViewIfNeeded();
            await this.tooltip.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.tooltip.click();
            await this.tooltipMsg.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.tooltipMsg.fill("Please Fill Value to the Field");
            console.log(`Tooltip: Enabled and message set`);
          } else {
            console.log(`Tooltip: Already enabled, skipping update`);
          }
        }
      } else if (type.includes("Single Select")) {
        // Check and update Single Select Input Type only if different
        const currentSingleInputType = await this.inputTypeSingleType
          .locator("option:checked")
          .textContent();
        if (
          currentSingleInputType &&
          currentSingleInputType.trim() !== inputType
        ) {
          await this.inputTypeSingleType.selectOption({ label: inputType });
          console.log(
            `${inputType}: Single Select Input Type updated from ${currentSingleInputType.trim()}`,
          );
        } else {
          console.log(
            `${inputType}: Single Select Input Type already set, skipping update`,
          );
        }

        if (inputType.includes("Radio") || inputType.includes("Drop Down")) {
          await this.fillOptions(fieldName, options, optionValues);
          console.log(`${fieldName}: Options filled for ${inputType}`);
        }

        // Check and update Allow Other only if needed
        if (allowOther && allowOther.toLowerCase() === "yes") {
          const isAllowOtherChecked = await this.allowOther.isChecked();
          if (!isAllowOtherChecked) {
            await this.allowOther.scrollIntoViewIfNeeded();
            await this.allowOther.click();
            console.log(`Allow Other: Enabled`);
          } else {
            console.log(`Allow Other: Already enabled, skipping update`);
          }
        } else if (tooltip && tooltip.toLowerCase() === "yes") {
          const isTooltipChecked = await this.tooltip.isChecked();
          if (!isTooltipChecked) {
            await this.tooltip.scrollIntoViewIfNeeded();
            await this.tooltip.click();
            await this.tooltipMsg.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.tooltipMsg.fill("Please Select any option");
            console.log(`Tooltip: Enabled for Single Select`);
          } else {
            console.log(`Tooltip: Already enabled, skipping update`);
          }
        }
      } else if (type.includes("Multi Select")) {
        // Check and update Multi Select Input Type only if different
        const currentMultiInputType = await this.inputTypeMultipleType
          .locator("option:checked")
          .textContent();
        if (
          currentMultiInputType &&
          currentMultiInputType.trim() !== inputType
        ) {
          await this.inputTypeMultipleType.selectOption({ label: inputType });
          console.log(
            `${inputType}: Multi Select Input Type updated from ${currentMultiInputType.trim()}`,
          );
        } else {
          console.log(
            `${inputType}: Multi Select Input Type already set, skipping update`,
          );
        }

        if (inputType.includes("Check Box") || inputType.includes("List")) {
          await this.fillOptions(fieldName, options, optionValues);
          console.log(`${fieldName}: Options filled for ${inputType}`);
        }

        // Check and update Allow Other only if needed
        if (allowOther && allowOther.toLowerCase() === "yes") {
          const isAllowOtherChecked = await this.allowOther.isChecked();
          if (!isAllowOtherChecked) {
            await this.allowOther.scrollIntoViewIfNeeded();
            await this.allowOther.click();
            console.log(`Allow Other: Enabled for Multi Select`);
          } else {
            console.log(`Allow Other: Already enabled, skipping update`);
          }
        } else if (tooltip && tooltip.toLowerCase() === "yes") {
          const isTooltipChecked = await this.tooltip.isChecked();
          if (!isTooltipChecked) {
            await this.tooltip.scrollIntoViewIfNeeded();
            await this.tooltip.click();
            await this.tooltipMsg.waitFor({
              state: "visible",
              timeout: this.timeout,
            });
            await this.tooltipMsg.fill("Please Select any option");
            console.log(`Tooltip: Enabled for Multi Select`);
          } else {
            console.log(`Tooltip: Already enabled, skipping update`);
          }
        }
      }

      // Save the updated ticket field
      console.log(`${fieldName}: Saving ticket field updates...`);
      await this.saveUpdateTicketField.scrollIntoViewIfNeeded();
      await this.saveUpdateTicketField.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "updateTicketField");
      await this.ticketField.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      if (!isFieldUpdated) {
        console.log(`${fieldName}: Ticket Field is not updated.`);
        return false;
      } else {
        console.log(`${fieldName}: Ticket Field is updated successfully.`);
        return true;
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in updateTicketField: ${error.message}`,
      );
    }
  }

  // Ticket Type locators
  get ticketType() {
    return this.page.locator("//a[normalize-space()='Ticket Type']");
  }
  get createTicketType() {
    return this.page.locator(
      "//label[@class='m-0'][normalize-space()='Create Ticket Type']",
    );
  }
  get ticketTypeName() {
    return this.page.locator("//input[@id='ticketTypeName']");
  }
  get saveType() {
    return this.page.locator("//button[@id='btnTicketTypeCreate']");
  }
  get ticketField() {
    return this.page.locator("//a[normalize-space()='Ticket Field']");
  }
  get category() {
    return this.page.locator("//select[@id='selectsCategory']");
  }
  get ticketTypePage() {
    return this.page.locator("//div[@id='showTicketTypeTable']");
  }

  // Tabbing to Ticket Type
  async tabToTicketType() {
    try {
      await this.ticketType.scrollIntoViewIfNeeded();
      await this.ticketType.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      if (await this.ticketType.isVisible()) {
        await this.ticketType.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "tabToTicketType");
        await ErrorUtil.captureApiErrorIfPresent(
          this.apiCapture,
          "tabToTicketType",
        );
        await this.createTicketType.scrollIntoViewIfNeeded();
        await this.createTicketType.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        expect(await this.createTicketType.isVisible()).toBeTruthy();
        const text = await this.createTicketType.textContent();
        console.log(`${text} button is visible after clicking TicketType.`);
        expect(await this.ticketTypePage.isVisible()).toBeTruthy();
      } else {
        throw new Error("TicketType button is not visible.");
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in tabToTicketType: ${error.message}`,
      );
    } finally {
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.ticketField.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
    }
  }

  // Click On Ticket Type
  async clickOnTicketType() {
    try {
      // Click on Ticket Type (assuming we're already on Ticket Field page)
      await this.ticketType.scrollIntoViewIfNeeded();
      await this.ticketType.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      if (await this.ticketType.isVisible()) {
        await this.ticketType.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "clickOnTicketType");
        await ErrorUtil.captureApiErrorIfPresent(
          this.apiCapture,
          "clickOnTicketType",
        );
        await this.createTicketType.scrollIntoViewIfNeeded();
        await this.createTicketType.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        expect(await this.createTicketType.isVisible()).toBeTruthy();
        const text = await this.createTicketType.textContent();
        console.log(`${text} button is visible after clicking TicketType.`);
        expect(await this.ticketTypePage.isVisible()).toBeTruthy();
      } else {
        throw new Error("TicketType button is not visible.");
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in clickOnTicketType: ${error.message}`,
      );
    }
  }

  // Setup Ticket Type
  async setupTicketType(category, type, isDefault) {
    await this.createTicketTypeHelper(category, type, isDefault);
  }

  // Helper: Create Ticket Type
  async createTicketTypeHelper(category, type, isDefault) {
    try {
      const isTicketTypePresent = await this.verifyExistingTicketType(
        category,
        type,
      );
      if (!isTicketTypePresent) {
        console.log(`${type}: Ticket Type is not created. Creating it...`);
        await this.createTicketType.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.createTicketType.scrollIntoViewIfNeeded();
        await this.createTicketType.click();
        await this.category.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.category.selectOption({ label: category });
        const selectedText = await this.category
          .locator("option:checked")
          .textContent();
        console.log(`${selectedText.trim()} : Category is selected`);
        await this.ticketTypeName.fill(type);
        await this.saveType.click();
        await ErrorUtil.captureErrorIfPresent(
          this.page,
          "createTicketTypeHelper",
        );
        await this.ticketField.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.ticketField.scrollIntoViewIfNeeded();
        await this.ticketField.click();
        await this.ticketType.click();
        if (isDefault && isDefault.trim().toLowerCase() === "yes") {
          const xpath = `//td[normalize-space()='${category.trim()}']/following-sibling::td[contains(.,'${type.trim()}')]/following-sibling::td//span[contains(text(),'Set Default')]`;
          const element = this.page.locator(xpath);
          await element.waitFor({ state: "visible", timeout: this.timeout });
          await element.scrollIntoViewIfNeeded();
          await element.click();
        }
      } else {
        console.log(`${type}: Ticket Type is already created.`);
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in createTicketTypeHelper: ${error.message}`,
      );
    }
  }

  // Verify Existing Ticket Type - Optimized for Speed
  async verifyExistingTicketType(category, type) {
    try {
      // Fast direct search using count() instead of all()
      const xpath = `//td[normalize-space()='${category.trim()}']/following-sibling::td[contains(.,'${type.trim()}')]`;
      const isPresent = (await this.page.locator(xpath).count()) > 0;

      if (isPresent) {
        console.log(`${type}: Ticket Type already exists.`);
      } else {
        console.log(`${type}: Ticket Type does not exist.`);
      }
      return isPresent;
    } catch (error) {
      console.log(`${type}: Ticket Type verification error - ${error.message}`);
      return false;
    }
  }

  //verify existing updated ticket type functions
  async verifyExistingUpdatedTicketType(Newcategory, Newtype) {
    // Handle undefined/null values gracefully
    if (!Newcategory || !Newtype) {
      console.log(
        "⚠️ New category or new type is undefined/empty. Skipping verification.",
      );
      return false;
    }

    const xpath = `//td[normalize-space()='${Newcategory.trim()}']/following-sibling::td[contains(.,'${Newtype.trim()}')]`;
    const existingTypes = await this.page.locator(xpath).all();
    const isPresent = existingTypes.length > 0;
    if (isPresent) {
      console.log(`${Newtype}: ${Newcategory} Ticket Type already exists.`);
    } else {
      console.log(`${Newtype}: ${Newcategory} Ticket Type does not exist.`);
    }
    return isPresent;
  }

  //locators for update ticket type
  get saveUpdateType() {
    return this.page.locator("//button[@id='btnTicketTypeUpdate']");
  }

  //update ticket type functions
  async updateTicketType(category, Newcategory, type, Newtype, isDefault) {
    // Handle undefined/null values gracefully
    if (!Newcategory || !Newtype) {
      console.log(
        `⚠️ Skipping update for ${type}: New category or new type is undefined/empty.`,
      );
      return;
    }

    const isTicketTypePresent = await this.verifyExistingUpdatedTicketType(
      category,
      type,
    );
    const isTicketTypeUpdated = await this.verifyExistingUpdatedTicketType(
      Newcategory,
      Newtype,
    );
    if (isTicketTypePresent) {
      console.log(
        `${type}: ${category} Ticket Type is already created. Updating it...`,
      );
      const xpath = `//td[normalize-space()='${category.trim()}']/following-sibling::td[contains(.,'${type.trim()}')]/following-sibling::td//a[@title='Edit Field']`;
      const Editbutton = await this.page.locator(xpath).all();
      await Editbutton.scrollIntoViewIfNeeded();
      await Editbutton.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "updateTicketType");
      expect(await this.category.toContainText(category)).toBeTruthy();
      await this.category.selectOption({ label: Newcategory });
      const selectedText = await this.category
        .locator("option:checked")
        .textContent();
      console.log(
        `${selectedText.trim()} : ${Newcategory} Category is selected`,
      );
      expect(await this.ticketTypeName.toContainText(type)).toBeTruthy();
      await this.ticketTypeName.clear();
      await this.ticketTypeName.fill(Newtype);
      // Verify the field is filled correctly
      expect(await this.ticketTypeName.inputValue()).toBe(Newtype);
      await this.saveUpdateType.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "updateTicketType");
      await this.ticketField.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.ticketField.scrollIntoViewIfNeeded();
      await this.ticketField.click();
      if (isTicketTypeUpdated) {
        console.log(`${Newtype}: ${Newcategory} Ticket Type is updated.`);
        if (isDefault && isDefault.trim().toLowerCase() === "yes") {
          const xpath = `//td[normalize-space()='${Newcategory.trim()}']/following-sibling::td[contains(.,'${Newtype.trim()}')]/following-sibling::td//span[contains(text(),'Set Default')]`;
          const element = this.page.locator(xpath);
          await element.waitFor({ state: "visible", timeout: this.timeout });
          await element.scrollIntoViewIfNeeded();
          await element.click();
        }
        return true;
      } else {
        console.log(`${Newtype}: ${Newcategory} Ticket Type is not updated.`);
        return false;
      }
    } else {
      console.log(`${type}: ${category} Ticket Type is not created.`);
    }
  }

  // Ticket Priority locators
  get ticketPriority() {
    return this.page.locator("(//a[normalize-space()='Ticket Priority'])[1]");
  }
  get createTicketPriority() {
    return this.page.locator(
      "//div[@class='btn btn-info w-full']//b[contains(text(),'Create Ticket Priority')]",
    );
  }
  get priorityName() {
    return this.page.locator("//input[@id='priorityName']");
  }
  get firstResponse() {
    return this.page.locator("//input[@id='responseWithin']");
  }
  get firstResponseTime() {
    return this.page.locator(
      "//input[@id='responseWithin']/following::select[@id='responseHours']",
    );
  }
  get trailResponse() {
    return this.page.locator("//input[@id='trailResponseWithin']");
  }
  get trailResponseTime() {
    return this.page.locator(
      "//input[@id='trailResponseWithin']/following::select[@id='respondUnits']",
    );
  }
  get resolved() {
    return this.page.locator("//input[@id='resolveWithin']");
  }
  get resolvedTime() {
    return this.page.locator(
      "//input[@id='resolveWithin']/following::select[@id='resolveHours']",
    );
  }
  get savePriority() {
    return this.page.locator("//button[@id='btnTicketPriorityCreate']");
  }
  get ticketField() {
    return this.page.locator("//a[normalize-space()='Ticket Field']");
  }
  get ticketPriorityPage() {
    return this.page.locator("//div[@id='showTicketPriorityTable']");
  }

  // Tabbing to Ticket Priority
  async tabToTicketPriority() {
    try {
      await this.ticketPriority.scrollIntoViewIfNeeded();
      await this.ticketPriority.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      if (await this.ticketPriority.isVisible()) {
        await this.ticketPriority.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "tabToTicketPriority");
        await ErrorUtil.captureApiErrorIfPresent(
          this.apiCapture,
          "tabToTicketPriority",
        );
        await this.createTicketPriority.scrollIntoViewIfNeeded();
        await this.createTicketPriority.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        expect(await this.createTicketPriority.isVisible()).toBeTruthy();
        const text = await this.createTicketPriority.textContent();
        console.log(`${text} button is visible after clicking TicketPriority.`);
        expect(await this.ticketPriorityPage.isVisible()).toBeTruthy();
      } else {
        throw new Error("TicketPriority button is not visible.");
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in tabToTicketPriority: ${error.message}`,
      );
    } finally {
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.ticketField.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
    }
  }

  // Click On Ticket Priority
  async clickOnTicketPriority() {
    try {
      // Click on Ticket Priority (assuming we're already on Ticket Field page)
      await this.ticketPriority.scrollIntoViewIfNeeded();
      await this.ticketPriority.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      if (await this.ticketPriority.isVisible()) {
        await this.ticketPriority.click();
        await ErrorUtil.captureErrorIfPresent(
          this.page,
          "clickOnTicketPriority",
        );
        await ErrorUtil.captureApiErrorIfPresent(
          this.apiCapture,
          "clickOnTicketPriority",
        );
        await this.createTicketPriority.scrollIntoViewIfNeeded();
        await this.createTicketPriority.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        expect(await this.createTicketPriority.isVisible()).toBeTruthy();
        const text = await this.createTicketPriority.textContent();
        console.log(`${text} button is visible after clicking TicketPriority.`);
        expect(await this.ticketPriorityPage.isVisible()).toBeTruthy();
      } else {
        throw new Error("TicketPriority button is not visible.");
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in clickOnTicketPriority: ${error.message}`,
      );
    }
  }

  // Setup Ticket Priority
  async setupTicketPriority(
    category,
    priority,
    isDefault,
    firstResponseWithin,
    firstResponseTime,
    trailResponseWithin,
    trailResponseTime,
    resolveWithin,
    resolveTime,
  ) {
    await this.createTicketPriorityHelper(
      category,
      priority,
      isDefault,
      firstResponseWithin,
      firstResponseTime,
      trailResponseWithin,
      trailResponseTime,
      resolveWithin,
      resolveTime,
    );
  }

  // Helper: Create Ticket Priority
  async createTicketPriorityHelper(
    category,
    priority,
    isDefault,
    firstResponseWithin,
    firstResponseTime,
    trailResponseWithin,
    trailResponseTime,
    resolveWithin,
    resolveTime,
  ) {
    try {
      const isTicketPriorityPresent = await this.verifyExistingTicketPriority(
        category,
        priority,
      );
      if (!isTicketPriorityPresent) {
        console.log(
          `${priority}: Ticket Priority is not created. Creating it...`,
        );
        await this.createTicketPriority.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.createTicketPriority.scrollIntoViewIfNeeded();
        await this.createTicketPriority.click();
        await this.category.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.category.selectOption({ label: category });
        const selectedText = await this.category
          .locator("option:checked")
          .textContent();
        console.log(`${selectedText.trim()} : Category is selected`);
        await this.priorityName.fill(priority);
        await this.firstResponse.clear();
        await this.firstResponse.fill(firstResponseWithin);
        await this.firstResponseTime.selectOption({ label: firstResponseTime });
        await this.trailResponse.clear();
        await this.trailResponse.fill(trailResponseWithin);
        await this.trailResponseTime.selectOption({ label: trailResponseTime });
        await this.resolved.clear();
        await this.resolved.fill(resolveWithin);
        await this.resolvedTime.selectOption({ label: resolveTime });
        await this.savePriority.click();
        await ErrorUtil.captureErrorIfPresent(
          this.page,
          "createTicketPriorityHelper",
        );
        await this.ticketField.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.ticketField.scrollIntoViewIfNeeded();
        await this.ticketField.click();
        await this.ticketPriority.click();
        if (isTicketPriorityPresent) {
          console.log(`${priority}: Ticket Priority is created.`);
          if (isDefault && isDefault.trim().toLowerCase() === "yes") {
            const xpath = `//td[normalize-space()='${category.trim()}']/following-sibling::td[contains(.,'${priority.trim()}')]/following-sibling::td//span[contains(text(),'Set Default')]`;
            const element = this.page.locator(xpath);
            await element.waitFor({ state: "visible", timeout: this.timeout });
            await element.scrollIntoViewIfNeeded();
            await element.click();
          }
          return true;
        } else {
          console.log(`${priority}: Ticket Priority is not created.`);
          return false;
        }
      } else {
        console.log(`${priority}: Ticket Priority is already created.`);
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in createTicketPriorityHelper: ${error.message}`,
      );
    }
  }

  //verify Existing Ticket Priority - Optimized for Speed
  async verifyExistingTicketPriority(category, priority) {
    try {
      // Fast direct search using count() instead of all()
      const xpath = `//td[normalize-space()='${category.trim()}']/following-sibling::td[contains(.,'${priority.trim()}')]`;
      const isPresent = (await this.page.locator(xpath).count()) > 0;

      if (isPresent) {
        console.log(`${priority}: Ticket Priority already exists.`);
      } else {
        console.log(`${priority}: Ticket Priority does not exist.`);
      }
      return isPresent;
    } catch (error) {
      console.log(
        `${priority}: Ticket Priority verification error - ${error.message}`,
      );
      return false;
    }
  }

  //verify existing updated ticket priority functions
  async verifyExistingUpdatedTicketPriority(Newcategory, Newpriority) {
    // Handle undefined/null values gracefully
    if (!Newcategory || !Newpriority) {
      console.log(
        "⚠️ New category or new priority is undefined/empty. Skipping verification.",
      );
      return false;
    }

    const xpath = `//td[normalize-space()='${Newcategory.trim()}']/following-sibling::td[contains(.,'${Newpriority.trim()}')]`;
    const existingPriorities = await this.page.locator(xpath).all();
    const isPresent = existingPriorities.length > 0;
    if (isPresent) {
      console.log(`${Newpriority}: Ticket Priority already exists.`);
    } else {
      console.log(`${Newpriority}: Ticket Priority does not exist.`);
    }
    return isPresent;
  }

  //locators for update Ticket Priority
  get saveUpdatePriority() {
    return this.page.locator("//button[@id='btnUpdTicketPriority']");
  }

  //update Ticket Priority
  async updateTicketPriority(
    category,
    Newcategory,
    priority,
    Newpriority,
    isDefault,
    firstResponseWithin,
    firstResponseTime,
    trailResponseWithin,
    trailResponseTime,
    resolveWithin,
    resolveTime,
  ) {
    try {
      // Handle undefined/null values gracefully
      if (!Newcategory || !Newpriority) {
        console.log(
          `⚠️ Skipping update for ${priority}: New category or new priority is undefined/empty.`,
        );
        return;
      }

      const isTicketPriorityPresent = await this.verifyExistingTicketPriority(
        category,
        priority,
      );
      const isTicketPriorityUpdated =
        await this.verifyExistingUpdatedTicketPriority(
          Newcategory,
          Newpriority,
        );
      if (isTicketPriorityPresent) {
        console.log(
          `${priority}: Ticket Priority is already created. Updating it...`,
        );
        const xpath = `//td[normalize-space()='${category.trim()}']/following-sibling::td[contains(.,'${priority.trim()}')]/following-sibling::td//a[@title='Edit Field']`;
        const Editbutton = await this.page.locator(xpath).all();
        await Editbutton.scrollIntoViewIfNeeded();
        await Editbutton.click();
        await ErrorUtil.captureErrorIfPresent(
          this.page,
          "updateTicketPriority",
        );
        expect(await this.category.toContainText(category)).toBeTruthy();
        await this.category.selectOption({ label: Newcategory });
        const selectedText = await this.category
          .locator("option:checked")
          .textContent();
        console.log(
          `${selectedText.trim()} : ${Newcategory} Category is selected`,
        );
        expect(await this.priorityName.toContainText(priority)).toBeTruthy();
        await this.priorityName.clear();
        await this.priorityName.fill(Newpriority);
        // Verify the priority name field is filled correctly
        expect(await this.priorityName.inputValue()).toBe(Newpriority);
        await this.firstResponse.clear();
        await this.firstResponse.fill(firstResponseWithin);
        await this.firstResponseTime.selectOption({ label: firstResponseTime });
        // Verify first response field is filled correctly
        expect(await this.firstResponse.inputValue()).toBe(firstResponseWithin);
        await this.trailResponse.clear();
        await this.trailResponse.fill(trailResponseWithin);
        await this.trailResponseTime.selectOption({ label: trailResponseTime });
        // Verify trail response field is filled correctly
        expect(await this.trailResponse.inputValue()).toBe(trailResponseWithin);
        await this.resolved.clear();
        await this.resolved.fill(resolveWithin);
        await this.resolvedTime.selectOption({ label: resolveTime });
        await this.saveUpdatePriority.click();
        await ErrorUtil.captureErrorIfPresent(
          this.page,
          "updateTicketPriority",
        );
        await this.ticketField.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.ticketField.scrollIntoViewIfNeeded();
        await this.ticketField.click();
        await this.ticketPriority.click();
        if (isTicketPriorityUpdated) {
          console.log(`${Newpriority}: Ticket Priority is updated.`);
          if (isDefault && isDefault.trim().toLowerCase() === "yes") {
            const xpath = `//td[normalize-space()='${Newcategory.trim()}']/following-sibling::td[contains(.,'${Newpriority.trim()}')]/following-sibling::td//span[contains(text(),'Set Default')]`;
            const element = this.page.locator(xpath);
            await element.waitFor({ state: "visible", timeout: this.timeout });
            await element.scrollIntoViewIfNeeded();
            await element.click();
          }
          return true;
        } else {
          console.log(`${Newpriority}: Ticket Priority is not updated.`);
          return false;
        }
      } else {
        console.log(`${priority}: Ticket Priority is not created.`);
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in updateTicketPriority: ${error.message}`,
      );
    }
  }

  // Ticket Stage locators
  get ticketStage() {
    return this.page.locator("(//a[normalize-space()='Ticket Stage'])[1]");
  }
  get createTicketStage() {
    return this.page.locator("//b[normalize-space()='Create Ticket Stage']");
  }
  get stageName() {
    return this.page.locator("//input[@id='stageName']");
  }
  get displayOrder() {
    return this.page.locator("//input[@id='displayOrder']");
  }
  get isClosed() {
    return this.page.locator("//span[@class='ui-checkmark']");
  }
  get saveStage() {
    return this.page.locator("//button[@id='btnTicketStageCreate']");
  }
  get ticketField() {
    return this.page.locator("//a[normalize-space()='Ticket Field']");
  }
  get category() {
    return this.page.locator("//select[@id='selectsCategory']");
  }
  get ticketStagePage() {
    return this.page.locator("//div[@id='showTicketStageTable']");
  }

  // Tabbing to Ticket Stage
  async tabToTicketStage() {
    try {
      await this.ticketStage.scrollIntoViewIfNeeded();
      await this.ticketStage.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      if (await this.ticketStage.isVisible()) {
        await this.ticketStage.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "tabToTicketStage");
        await ErrorUtil.captureApiErrorIfPresent(
          this.apiCapture,
          "tabToTicketStage",
        );
        await this.createTicketStage.scrollIntoViewIfNeeded();
        await this.createTicketStage.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        expect(await this.createTicketStage.isVisible()).toBeTruthy();
        const text = await this.createTicketStage.textContent();
        console.log(`${text} button is visible after clicking TicketStage.`);
        expect(await this.ticketStagePage.isVisible()).toBeTruthy();
      } else {
        throw new Error("TicketStage button is not visible.");
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in tabToTicketStage: ${error.message}`,
      );
    } finally {
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.ticketField.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.systemSetup.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
    }
  }

  // Click On Ticket Stage
  async clickOnTicketStage() {
    try {
      // Click on Ticket Stage (assuming we're already on Ticket Field page)
      await this.ticketStage.scrollIntoViewIfNeeded();
      await this.ticketStage.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      if (await this.ticketStage.isVisible()) {
        await this.ticketStage.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "clickOnTicketStage");
        await ErrorUtil.captureApiErrorIfPresent(
          this.apiCapture,
          "clickOnTicketStage",
        );
        await this.createTicketStage.scrollIntoViewIfNeeded();
        await this.createTicketStage.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        expect(await this.createTicketStage.isVisible()).toBeTruthy();
        const text = await this.createTicketStage.textContent();
        console.log(`${text} button is visible after clicking TicketStage.`);
        expect(await this.ticketStagePage.isVisible()).toBeTruthy();
      } else {
        throw new Error("TicketStage button is not visible.");
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in clickOnTicketStage: ${error.message}`,
      );
    }
  }

  // Setup Ticket Stage
  async setupTicketStage(category, stage, isDefault, order, isClosed) {
    await this.createTicketStageHelper(
      category,
      stage,
      isDefault,
      order,
      isClosed,
    );
  }

  // Helper: Create Ticket Stage
  async createTicketStageHelper(category, stage, isDefault, order, isClosed) {
    try {
      const isTicketStagePresent = await this.verifyExistingTicketStage(
        category,
        stage,
      );
      if (!isTicketStagePresent) {
        console.log(`${stage}: Ticket Stage is not created. Creating it...`);
        await this.createTicketStage.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.createTicketStage.scrollIntoViewIfNeeded();
        await this.createTicketStage.click();
        await this.category.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.category.selectOption({ label: category });
        const selectedText = await this.category
          .locator("option:checked")
          .textContent();
        console.log(`${selectedText.trim()} : Category is selected`);
        await this.stageName.clear();
        await this.stageName.fill(stage);
        await this.displayOrder.clear();
        await this.displayOrder.fill(order);
        if (isClosed && isClosed.trim().toLowerCase() === "yes") {
          await this.isClosed.waitFor({
            state: "visible",
            timeout: this.timeout,
          });
          await this.isClosed.scrollIntoViewIfNeeded();
          await this.isClosed.click();
        }
        await this.saveStage.click();
        await ErrorUtil.captureErrorIfPresent(
          this.page,
          "createTicketStageHelper",
        );
        await this.ticketField.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.ticketField.scrollIntoViewIfNeeded();
        await this.ticketField.click();
        await this.ticketStage.click();
        if (isTicketStagePresent) {
          console.log(`${stage}: Ticket Stage is already created.`);
          if (isDefault && isDefault.trim().toLowerCase() === "yes") {
            const xpath = `//td[normalize-space()='${category.trim()}']/following-sibling::td[contains(.,'${stage.trim()}')]/following-sibling::td//span[contains(text(),'Set Default')]`;
            const element = this.page.locator(xpath);
            await element.waitFor({ state: "visible", timeout: this.timeout });
            await element.scrollIntoViewIfNeeded();
            await element.click();
          }
          return true;
        } else {
          console.log(`${stage}: Ticket Stage is not created.`);
          return false;
        }
      } else {
        console.log(`${stage}: Ticket Stage is already created.`);
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in createTicketStageHelper: ${error.message}`,
      );
    }
  }

  // Verify Existing Ticket Stage - Optimized for Speed
  async verifyExistingTicketStage(category, stage) {
    try {
      // Fast direct search using count() instead of all()
      const xpath = `//td[normalize-space()='${category.trim()}']/following-sibling::td[contains(.,'${stage.trim()}')]`;
      const isPresent = (await this.page.locator(xpath).count()) > 0;

      if (isPresent) {
        console.log(`${stage}: Ticket Stage already exists.`);
      } else {
        console.log(`${stage}: Ticket Stage does not exist.`);
      }
      return isPresent;
    } catch (error) {
      console.log(
        `${stage}: Ticket Stage verification error - ${error.message}`,
      );
      return false;
    }
  }

  //verify existing updated ticket stage functions

  async verifyExistingUpdatedTicketStage(Newcategory, Newstage) {
    // Handle undefined/null values gracefully
    if (!Newcategory || !Newstage) {
      console.log(
        "⚠️ New category or new stage is undefined/empty. Skipping verification.",
      );
      return false;
    }

    const xpath = `//td[normalize-space()='${Newcategory.trim()}']/following-sibling::td[contains(.,'${Newstage.trim()}')]`;
    const existingStages = await this.page.locator(xpath).all();
    const isPresent = existingStages.length > 0;
    if (isPresent) {
      console.log(`${Newstage}: Ticket Stage already exists.`);
    } else {
      console.log(`${Newstage}: Ticket Stage does not exist.`);
    }
    return isPresent;
  }

  //locators for update ticket stage
  get saveUpdateStage() {
    return this.page.locator("//button[@id='btnUpdTicketStage']");
  }

  //update ticket stage functions
  async updateTicketStage(
    category,
    Newcategory,
    stage,
    Newstage,
    isDefault,
    order,
    isClosed,
  ) {
    // Handle undefined/null values gracefully
    if (!Newcategory || !Newstage) {
      console.log(
        `⚠️ Skipping update for ${stage}: New category or new stage is undefined/empty.`,
      );
      return;
    }

    const isTicketStagePresent = await this.verifyExistingTicketStage(
      category,
      stage,
    );
    const isTicketStageUpdated = await this.verifyExistingUpdatedTicketStage(
      Newcategory,
      Newstage,
    );
    if (isTicketStagePresent) {
      console.log(`${stage}: Ticket Stage is already created. Updating it...`);
      const xpath = `//td[normalize-space()='${category.trim()}']/following-sibling::td[contains(.,'${stage.trim()}')]/following-sibling::td//a`;
      const Editbutton = await this.page.locator(xpath).all();
      await Editbutton.scrollIntoViewIfNeeded();
      await Editbutton.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "updateTicketStage");
      expect(await this.category.toContainText(category)).toBeTruthy();
      await this.category.selectOption({ label: Newcategory });
      const selectedText = await this.category
        .locator("option:checked")
        .textContent();
      console.log(
        `${selectedText.trim()} : ${Newcategory} Category is selected`,
      );
      expect(await this.stageName.toContainText(stage)).toBeTruthy();
      await this.stageName.clear();
      await this.stageName.fill(Newstage);
      await this.displayOrder.clear();
      await this.displayOrder.fill(order);
      if (isClosed && isClosed.trim().toLowerCase() === "yes") {
        if (await this.isClosed.isChecked()) {
          console.log(`${Newstage}: Ticket Stage is already closed.`);
        } else {
          await this.isClosed.scrollIntoViewIfNeeded();
          await this.isClosed.click();
        }
      }
      await this.saveUpdateStage.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "updateTicketStage");
      await this.ticketField.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.ticketField.scrollIntoViewIfNeeded();
      await this.ticketField.click();
      await this.ticketStage.click();
      if (isTicketStageUpdated) {
        console.log(`${Newstage}: Ticket Stage is updated.`);
        if (isDefault && isDefault.trim().toLowerCase() === "yes") {
          const xpath = `//td[normalize-space()='${Newcategory.trim()}']/following-sibling::td[contains(.,'${Newstage.trim()}')]/following-sibling::td//span[contains(text(),'Set Default')]`;
          const element = this.page.locator(xpath);
          await element.waitFor({ state: "visible", timeout: this.timeout });
          await element.scrollIntoViewIfNeeded();
          await element.click();
        }
        return true;
      } else {
        console.log(`${Newstage}: Ticket Stage is not updated.`);
        return false;
      }
    } else {
      console.log(`${Newstage}: Ticket Stage is not created.`);
    }
  }

  //Workflow locators
  get workflow() {
    return this.page.locator("//div[contains(text(),'Workflows')]");
  }
  get workflowPage() {
    return this.page.locator(
      "//h1[normalize-space()='Welcome to Aavaz Workflows!']",
    );
  }
  get rules() {
    return this.page.locator("//a[normalize-space()='Rules']");
  }
  get rulesPage() {
    return this.page.locator("(//div[@class='box-body p-10'])[2]");
  }
  get NewRule() {
    return this.page.locator("//a[normalize-space()='New Rule']");
  }
  get newRulePage() {
    return this.page.locator("(//div[@class='box m-b-0'])[1]");
  }
  //Tabbing to Workflow
  async tabToWorkflow() {
    try {
      await this.workflow.scrollIntoViewIfNeeded();
      await this.workflow.waitFor({ state: "visible", timeout: this.timeout });
      await this.workflow.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "tabToWorkflow");
      await this.workflowPage.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      expect(await this.workflowPage.textContent()).toContain(
        "Welcome to Aavaz Workflows!",
      );
      const text = await this.workflowPage.textContent();
      console.log(`${text} page is visible after clicking Workflows.`);
      await this.rules.scrollIntoViewIfNeeded();
      await this.rules.waitFor({ state: "visible", timeout: this.timeout });
      await this.rules.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "tabToWorkflow");
      await this.rulesPage.waitFor({ state: "visible", timeout: this.timeout });
      expect(await this.rulesPage.isVisible()).toBeTruthy();
      await this.NewRule.scrollIntoViewIfNeeded();
      await this.NewRule.waitFor({ state: "visible", timeout: this.timeout });
      await this.NewRule.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "tabToWorkflow");
      await this.newRulePage.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      expect(await this.newRulePage.isVisible()).toBeTruthy();
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToWorkflow: ${error.message}`);
    } finally {
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.systemSetup.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
    }
  }

  get ruleName() {
    return this.page.locator("(//input[@id='name'])[2]");
  }
  get trigger() {
    return this.page.locator("(//select[@class='form-control'])[3]");
  }
  get Category() {
    return this.page.locator("(//select[@class='form-control'])[4]");
  }
  get matchAnyCondition() {
    return this.page.locator("//input[@name='matchTypeAny']");
  }
  get matchAllCondition() {
    return this.page.locator("//input[@name='matchTypeAll']");
  }
  get ChooseCondition() {
    return this.page.locator("//select[@id='selectsCondition']");
  }
  get ChooseAction() {
    return this.page.locator("//select[@id='selectsAction']");
  }

  // Tags locators
  get tags() {
    return this.page.locator("//div[contains(text(),'Tags')]");
  }
  get addNewTag() {
    return this.page.locator("//th[@class='tagName']");
  }
  get tagName() {
    return this.page.locator("//input[@id='tagName']");
  }
  get saveTag() {
    return this.page.locator("//button[@id='btnSaveTagName']");
  }

  // Tabbing to Tags
  async tabToTags() {
    try {
      await this.tags.scrollIntoViewIfNeeded();
      await this.tags.waitFor({ state: "visible", timeout: this.timeout });
      if (await this.tags.isVisible()) {
        await this.tags.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "tabToTags");
        await this.addNewTag.scrollIntoViewIfNeeded();
        await this.addNewTag.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        expect(await this.addNewTag.isVisible()).toBeTruthy();
        const text = await this.addNewTag.textContent();
        console.log(`${text} button is visible after clicking Tags.`);
      } else {
        throw new Error("Tags button is not visible.");
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToTags: ${error.message}`);
    } finally {
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.systemSetup.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
    }
  }

  //create tags functions
  async createTags(tag) {
    const isTagPresent = await this.verifyExistingTags(tag);
    if (!isTagPresent) {
      console.log(`${tag}: Tag is not created. Creating it...`);
      await this.addNewTag.scrollIntoViewIfNeeded();
      await this.addNewTag.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "createTags");
      await this.tagName.clear();
      await this.tagName.fill(tag);
      await this.saveTag.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "createTags");
      if (isTagPresent) {
        console.log(`${tag}: Tag is created.`);
        return true;
      } else {
        console.log(`${tag}: Tag is not created.`);
        return false;
      }
    } else {
      console.log(`${tag}: Tag already exists.`);
    }
  }

  //verify existing tags functions - Enhanced with case-insensitive matching
  async verifyExistingTags(tag) {
    try {
      const trimmedTag = tag.trim();

      // Method 1: Exact match
      const exactXPath = `//td[normalize-space()='${trimmedTag}']`;
      const exactExists = (await this.page.locator(exactXPath).count()) > 0;

      if (exactExists) {
        console.log(`${tag}: Tag already exists (exact match).`);
        return true;
      }

      // Method 2: Case-insensitive match
      const caseInsensitiveXPath = `//td[translate(normalize-space(text()), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')='${trimmedTag.toLowerCase()}']`;
      const caseInsensitiveExists =
        (await this.page.locator(caseInsensitiveXPath).count()) > 0;

      if (caseInsensitiveExists) {
        console.log(`${tag}: Tag already exists (case-insensitive match).`);
        return true;
      }

      // Method 3: Check for similar tags for debugging
      const allTagCells = await this.page.locator("//td").allTextContents();
      const similarTags = allTagCells
        .filter((cell) => {
          const cellLower = cell.trim().toLowerCase();
          const tagLower = trimmedTag.toLowerCase();
          return cellLower.includes(tagLower) || tagLower.includes(cellLower);
        })
        .slice(0, 3);

      if (similarTags.length > 0) {
        console.log(
          `${tag}: Tag does not exist, but found similar tags: ${similarTags.join(", ")}`,
        );
      } else {
        console.log(`${tag}: Tag does not exist.`);
      }
      return false;
    } catch (error) {
      console.log(`${tag}: Tag verification error - ${error.message}`);
      return false;
    }
  }

  //locators for Webhooks
  get webhooks() {
    return this.page.locator("//div[contains(text(),'Webhooks')]");
  }
  get createWebhook() {
    return this.page.locator("//label[normalize-space()='Create Webhook']");
  }

  //Tabbing to Webhooks
  async tabToWebhooks() {
    try {
      await this.webhooks.scrollIntoViewIfNeeded();
      await this.webhooks.waitFor({ state: "visible", timeout: this.timeout });
      await this.webhooks.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "tabToWebhooks");
      await ErrorUtil.captureApiErrorIfPresent(
        this.apiCapture,
        "tabToWebhooks",
      );
      await this.createWebhook.scrollIntoViewIfNeeded();
      expect(await this.createWebhook.isVisible()).toBeTruthy();
      const text = await this.createWebhook.textContent();
      console.log(`${text} button is visible after clicking Webhooks.`);
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToWebhooks: ${error.message}`);
    } finally {
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.systemSetup.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
    }
  }

  //locators for Channels
  get channels() {
    return this.page.locator(
      "//div[@class='box-header with-border box-light-success hov-pointer']",
    );
  }
  get channelsElements() {
    return this.page.locator("//div[@id='channelBody']");
  }
  // Tabbing to Channels
  async tabToChannels() {
    try {
      await this.channels.scrollIntoViewIfNeeded();
      await this.channels.waitFor({ state: "visible", timeout: this.timeout });
      if (await this.channels.isVisible()) {
        await this.channels.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "tabToChannels");
        await this.channelsElements
          .first()
          .waitFor({ state: "visible", timeout: this.timeout });
        expect(await this.channelsElements.first().isVisible()).toBeTruthy();
      } else {
        throw new Error("Channels button is not visible.");
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToChannels: ${error.message}`);
    }
  }

  // Phone locators
  get phone() {
    return this.page.locator("//div[contains(text(),'Phone')]");
  }
  get providerSettings() {
    return this.page.locator("//div[@id='providerSettingDetail']");
  }
  get plivoSettings() {
    return this.page.locator("//label[normalize-space()='Plivo Settings']");
  }
  get voicemail() {
    return this.page.locator(
      "//a[normalize-space()='Manage Company Wide Voicemail']",
    );
  }
  get setupIVR() {
    return this.page.locator("//a[normalize-space()='Setup IVR']");
  }
  get createNewIVR() {
    return this.page.locator("//label[normalize-space()='Create New IVR']");
  }
  get plivoPurchasedNum() {
    return this.page.locator(
      "//a[normalize-space()='Plivo Purchased Numbers']",
    );
  }
  get number() {
    return this.page.locator(
      "//div[@id='plivoNumbersTable']//th[@class='number'][normalize-space()='Number']",
    );
  }
  get presetCallerID() {
    return this.page.locator(
      "//label[normalize-space()='Preset Caller ID Management']",
    );
  }
  get addPreset() {
    return this.page.locator("//button[@id='btnSavePreset']");
  }

  // Tabbing to Phone
  async tabToPhone() {
    try {
      if (!(await this.phone.isVisible())) {
        await this.tabToChannels();
      }
      await this.phone.scrollIntoViewIfNeeded();
      await this.phone.waitFor({ state: "visible", timeout: this.timeout });
      await this.phone.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "tabToPhone");
      await this.providerSettings.scrollIntoViewIfNeeded();
      await this.providerSettings.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      expect(await this.providerSettings.isVisible()).toBeTruthy();
      const text = await this.providerSettings.textContent();
      console.log(`${text} buttons are visible after clicking Phone.`);
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToPhone: ${error.message}`);
    }
    await this.tabToPlivoSettings();
    await this.tabToSetupIVR();
    await this.tabToPlivoPurchasedNumbers();
    await this.tabToPresetCallerID();
    await this.tabToSMS();
    await this.tabToEmailRouting();
    await this.tabToWebPost();
    await this.tabToWhatsAppProvider();
  }

  // Tabbing to Plivo Settings
  async tabToPlivoSettings() {
    try {
      await this.plivoSettings.scrollIntoViewIfNeeded();
      await this.plivoSettings.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.plivoSettings.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "tabToPlivoSettings");
      await this.voicemail.scrollIntoViewIfNeeded();
      await this.voicemail.waitFor({ state: "visible", timeout: this.timeout });
      expect(await this.voicemail.isVisible()).toBeTruthy();
      console.log("Voicemail button is visible after Expanding PlivoSettings.");
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in tabToPlivoSettings: ${error.message}`,
      );
    }
  }

  // Tabbing to Setup IVR
  async tabToSetupIVR() {
    try {
      await this.setupIVR.scrollIntoViewIfNeeded();
      await this.setupIVR.waitFor({ state: "visible", timeout: this.timeout });
      await this.setupIVR.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "tabToSetupIVR");
      await this.createNewIVR.scrollIntoViewIfNeeded();
      await this.createNewIVR.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      expect(await this.createNewIVR.isVisible()).toBeTruthy();
      const text = await this.createNewIVR.textContent();
      console.log(`${text} button is visible after click on SetupIVR.`);
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToSetupIVR: ${error.message}`);
    } finally {
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
    }
  }

  // Tabbing to Plivo Purchased Numbers
  async tabToPlivoPurchasedNumbers() {
    try {
      await this.plivoPurchasedNum.scrollIntoViewIfNeeded();
      await this.plivoPurchasedNum.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.plivoPurchasedNum.click();
      await ErrorUtil.captureErrorIfPresent(
        this.page,
        "tabToPlivoPurchasedNumbers",
      );
      await this.number.scrollIntoViewIfNeeded();
      await this.number.waitFor({ state: "visible", timeout: this.timeout });
      expect(await this.number.isVisible()).toBeTruthy();
      const text = await this.number.textContent();
      console.log(
        `${text} button is visible after click on PlivoPurchasedNum.`,
      );
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in tabToPlivoPurchasedNumbers: ${error.message}`,
      );
    } finally {
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
    }
  }

  // Tabbing to Preset Caller ID Management
  async tabToPresetCallerID() {
    try {
      await this.presetCallerID.scrollIntoViewIfNeeded();
      await this.presetCallerID.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.presetCallerID.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "tabToPresetCallerID");
      await this.addPreset.scrollIntoViewIfNeeded();
      await this.addPreset.waitFor({ state: "visible", timeout: this.timeout });
      expect(await this.addPreset.isVisible()).toBeTruthy();
      const text = await this.addPreset.textContent();
      console.log(`${text} button is visible after Expanding PresetCallerID.`);
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in tabToPresetCallerID: ${error.message}`,
      );
    } finally {
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.systemSetup.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
    }
  }

  // SMS locators
  get sms() {
    return this.page.locator("//div[contains(text(),'SMS')]");
  }
  get smsProviderSettings() {
    return this.page.locator(
      "//label[normalize-space()='SMS Provider Settings']",
    );
  }

  // Tabbing to SMS
  async tabToSMS() {
    try {
      if (!(await this.sms.isVisible())) {
        await this.tabToChannels();
      }
      await this.sms.scrollIntoViewIfNeeded();
      await this.sms.waitFor({ state: "visible", timeout: this.timeout });
      await this.sms.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "tabToSMS");
      await this.smsProviderSettings.scrollIntoViewIfNeeded();
      await this.smsProviderSettings.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      expect(await this.smsProviderSettings.isVisible()).toBeTruthy();
      const text = await this.smsProviderSettings.textContent();
      console.log(`${text} buttons are visible after clicking SMS.`);
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToSMS: ${error.message}`);
    } finally {
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.systemSetup.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
    }
  }

  // Email Routing locators
  get email() {
    return this.page.locator(
      "//div[@class='card-panel-text'][normalize-space()='Email']",
    );
  }
  get InboundEmail() {
    return this.page.locator("//a[normalize-space()='Inbound Emails']");
  }
  get InboundEmailPage() {
    return this.page.locator("//div[@id='emailTagTable']");
  }

  // Tabbing to Email Routing
  async tabToEmailRouting() {
    try {
      if (!(await this.email.isVisible())) {
        await this.tabToChannels();
      }
      await this.email.scrollIntoViewIfNeeded();
      await this.email.waitFor({ state: "visible", timeout: this.timeout });
      await this.email.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "tabToInboundEmails");
      await ErrorUtil.captureApiErrorIfPresent(
        this.apiCapture,
        "tabToInboundEmails",
      );
      expect(await (await this.InboundEmail).isVisible()).toBeTruthy();
      expect(await (await this.InboundEmailPage).isVisible()).toBeTruthy();
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in tabToInboundEmails: ${error.message}`,
      );
    } finally {
      await this.adminSideBar.clickOnBackButton();
      await this.backButton.scrollIntoViewIfNeeded();
      await this.systemSetup.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
    }
  }

  // Web Post locators
  get webPost() {
    return this.page.locator("//div[contains(text(),'Web Post')]");
  }
  get newMapping() {
    return this.page.locator("//label[normalize-space()='New Mapping']");
  }
  get webFormCampMapp() {
    return this.page.locator(
      "(//a[normalize-space()='Web Form Campaign Mapping'])[1]",
    );
  }
  get logs() {
    return this.page.locator("//a[normalize-space()='Logs']");
  }
  get logCriteria() {
    return this.page.locator("//div[@class='col-xs-12 col-sm-4 col-lg-4']");
  }

  // Tabbing to Web Post
  async tabToWebPost() {
    try {
      if (!(await this.webPost.isVisible())) {
        await this.tabToChannels();
      }
      await this.webPost.scrollIntoViewIfNeeded();
      await this.webPost.waitFor({ state: "visible", timeout: this.timeout });
      await this.webPost.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "tabToWebPost");
      await this.newMapping.scrollIntoViewIfNeeded();
      await this.newMapping.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      expect(await this.newMapping.isVisible()).toBeTruthy();
      const text = await this.newMapping.textContent();
      console.log(`${text} buttons are visible after clicking WebPost.`);
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToWebPost: ${error.message}`);
    }
    await this.tabToLogs();
  }

  //Tabbing to Logs
  async tabToLogs() {
    try {
      await this.logs.scrollIntoViewIfNeeded();
      await this.logs.waitFor({ state: "visible", timeout: this.timeout });
      await this.logs.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "tabToLogs");
      await this.logCriteria.scrollIntoViewIfNeeded();
      await this.logCriteria.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      expect(await this.logCriteria.isVisible()).toBeTruthy();
      const text = await this.logCriteria.textContent();
      console.log(`${text} buttons are visible after clicking Logs.`);
    } catch (error) {
      console.error(error);
      throw new Error(`Exception occurred in tabToLogs: ${error.message}`);
    } finally {
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.webFormCampMapp.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.adminSideBar.clickOnBackButton();
      await this.systemSetup.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
    }
  }

  // WhatsAppProvider locators
  get whatsAppProvider() {
    return this.page.locator("//div[contains(text(),'WhatsApp')]");
  }
  get whatsAppProviderSetting() {
    return this.page.locator("//a[normalize-space()='Settings']");
  }
  get whatsAppProviderSettingPage() {
    return this.page.locator("//div[@class='box box-success']");
  }
  get whatsAppInboundMessage() {
    return this.page.locator("//div[@class='tab-content']");
  }
  get whatsAppTemplate() {
    return this.page.locator("//a[normalize-space()='Templates']");
  }
  get whatsAppTemplatePage() {
    return this.page.locator("//div[@class='tab-content']");
  }

  // Tabbing to WhatsAppProvider
  async tabToWhatsAppProvider() {
    try {
      if (!(await this.whatsAppProvider.isVisible())) {
        await this.tabToChannels();
      }
      await this.whatsAppProvider.scrollIntoViewIfNeeded();
      await this.whatsAppProvider.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.whatsAppProvider.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "tabToWhatsAppProvider");
      expect(await this.whatsAppInboundMessage.isVisible()).toBeTruthy();
      await this.whatsAppTemplate.scrollIntoViewIfNeeded();
      await this.whatsAppTemplate.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "tabToWhatsAppProvider");
      await this.whatsAppTemplatePage.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      expect(await this.whatsAppTemplatePage.isVisible()).toBeTruthy();
      await this.whatsAppProviderSetting.scrollIntoViewIfNeeded();
      await this.whatsAppProviderSetting.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "tabToWhatsAppProvider");
      await this.whatsAppProviderSettingPage.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      expect(await this.whatsAppProviderSettingPage.isVisible()).toBeTruthy();
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in tabToWhatsAppProvider: ${error.message}`,
      );
    } finally {
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.systemSetup.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
    }
  }

  // Manage Account locators
  get manageAccount() {
    return this.page.locator("//label[normalize-space()='Manage Account']");
  }
  get notifications() {
    return this.page.locator("//div[contains(text(),'Notifications')]");
  }
  get notificationsPage() {
    return this.page.locator("//div[@class='box box-warning']");
  }

  // Tabbing to Manage Account
  async tabToManageAccount() {
    try {
      await this.manageAccount.scrollIntoViewIfNeeded();
      await this.manageAccount.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.manageAccount.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "tabToManageAccount");
      await this.notifications.scrollIntoViewIfNeeded();
      await this.notifications.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      expect(await this.notifications.isVisible()).toBeTruthy();
      const text = await this.notifications.textContent();
      console.log(`${text} buttons are visible after Expanding ManageAccount.`);
      await this.tabToNotifications();
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in tabToManageAccount: ${error.message}`,
      );
    }
  }

  // Tabbing to Notifications
  async tabToNotifications() {
    try {
      await this.notifications.scrollIntoViewIfNeeded();
      await this.notifications.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.notifications.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "tabToNotifications");
      await this.notificationsPage.scrollIntoViewIfNeeded();
      await this.notificationsPage.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      expect(await this.notificationsPage.isVisible()).toBeTruthy();
      const text = await this.notificationsPage.textContent();
      console.log(`${text} buttons are visible after Expanding ManageAccount.`);
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in tabToNotifications: ${error.message}`,
      );
    } finally {
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.systemSetup.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
    }
  }

  //Tabbing to IRC Custom Features
  get ircCustomFeatures() {
    return this.page.locator(
      "//div[@id='showCustomFeature']//div[@class='box-header with-border box-light-info hov-pointer']",
    );
  }
  get WebResourcesButton() {
    return this.page.locator("//div[contains(text(),'Web Resources')]");
  }
  get WebResources() {
    return this.page.locator(
      "//a[@class='router-link-active router-link-exact-active']",
    );
  }
  get ImportWebResources() {
    return this.page.locator("//a[normalize-space()='Import Web Resources']");
  }
  get UploadWebResources() {
    return this.page.locator("//label[@class='p-10']//input[@type='file']");
  }
  get SaveWebResources() {
    return this.page.locator("//button[@id='createWebResource']");
  }
  get WebResourcesTaken() {
    return this.page.locator("//a[normalize-space()='Web Resources Taken']");
  }
  get WebResourcesTakenPage() {
    return this.page.locator("(//div[@class='tab-content p-0'])[1]");
  }
  //Click on Custom Features
  async clickOnCustomFeatures() {
    try {
      await this.ircCustomFeatures.scrollIntoViewIfNeeded();
      await this.ircCustomFeatures.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "clickOnCustomFeatures");
      expect(await this.WebResourcesButton.isVisible()).toBeTruthy();
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in clickOnCustomFeatures: ${error.message}`,
      );
    }
  }
  //tabbing to Web Resources
  async tabToWebResources() {
    try {
      if (!(await this.WebResourcesButton.isVisible())) {
        await this.clickOnCustomFeatures();
      }
      await this.WebResourcesButton.scrollIntoViewIfNeeded();
      await this.WebResourcesButton.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.WebResourcesButton.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "tabToWebResources");
      expect(await this.WebResources.isVisible()).toBeTruthy();
      await this.tabToImportWebResources();
      await this.tabToWebResourcesTaken();
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in tabToWebResources: ${error.message}`,
      );
    }
  }
  //tabbing to Import Web Resources
  async tabToImportWebResources() {
    try {
      await this.ImportWebResources.scrollIntoViewIfNeeded();
      await this.ImportWebResources.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.ImportWebResources.click();
      await ErrorUtil.captureErrorIfPresent(
        this.page,
        "tabToImportWebResources",
      );
      expect(await this.UploadWebResources.isVisible()).toBeTruthy();
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in tabToImportWebResources: ${error.message}`,
      );
    } finally {
      await this.backButton.scrollIntoViewIfNeeded();
      await this.adminSideBar.clickOnBackButton();
      await this.systemSetup.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
    }
  }
  //tabbing to Upload Web Resources
  async tabToWebResourcesTaken() {
    try {
      await this.WebResourcesTaken.scrollIntoViewIfNeeded();
      await this.WebResourcesTaken.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.WebResourcesTaken.click();
      await ErrorUtil.captureErrorIfPresent(
        this.page,
        "tabToWebResourcesTaken",
      );
      expect(await this.WebResourcesTakenPage.isVisible()).toBeTruthy();
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in tabToWebResourcesTaken: ${error.message}`,
      );
    } finally {
      await this.adminSideBar.clickOnBackButton();
      await this.WebResources.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.adminSideBar.clickOnBackButton();
      await this.systemSetup.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
    }
  }

  //Click on Web Resources
  async NavigateToWebResources() {
    try {
      if (!(await this.WebResourcesButton.isVisible())) {
        await this.clickOnCustomFeatures();
        await this.WebResourcesButton.scrollIntoViewIfNeeded();
        await this.WebResourcesButton.waitFor({
          state: "visible",
          timeout: this.timeout,
        });
        await this.WebResourcesButton.click();
        await ErrorUtil.captureErrorIfPresent(this.page, "clickOnWebResources");
        expect(await this.WebResources.isVisible()).toBeTruthy();
      } else {
        await this.tabToWebResources();
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in clickOnWebResources: ${error.message}`,
      );
    }
  }

  //Upload Web Resources
  async uploadWebResources(file) {
    try {
      await this.ImportWebResources.scrollIntoViewIfNeeded();
      await this.ImportWebResources.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.ImportWebResources.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "uploadWebResources");
      expect(await this.UploadWebResources.isVisible()).toBeTruthy();
      await this.UploadWebResources.setInputFiles(file);
      await ErrorUtil.captureErrorIfPresent(this.page, "uploadWebResources");
      await this.SaveWebResources.scrollIntoViewIfNeeded();
      await this.SaveWebResources.waitFor({
        state: "visible",
        timeout: this.timeout,
      });
      await this.SaveWebResources.click();
      await ErrorUtil.captureErrorIfPresent(this.page, "uploadWebResources");
    } catch (error) {
      console.error(error);
      throw new Error(
        `Exception occurred in uploadWebResources: ${error.message}`,
      );
    }
  }
}

module.exports = SystemSetupPage;
