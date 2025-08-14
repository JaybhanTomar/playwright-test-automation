const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class DocumentsPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    // Use unique, robust selectors (update as needed for your app)
    this.systemSetupButton = page.getByRole('button', { name: /system setup/i });
    this.documentsTab = page.getByRole('tab', { name: /documents/i });
    this.addNewDocumentBtn = page.getByRole('button', { name: /add new document/i });
    this.categorySelect = page.locator('#selectCategoryId, select[name="category"]');
    this.nameInput = page.locator('#getName, input[name="name"]');
    this.fileInput = page.locator('input[type="file"]');
    this.descriptionInput = page.locator('#getDescription, textarea[name="description"]');
    this.saveBtn = page.getByRole('button', { name: /save|upload/i });
    this.documentsTable = page.locator('#documentsTable');
  }

  async gotoDocuments() {
    await this.systemSetupButton.click();
    await this.documentsTab.waitFor({ state: 'visible', timeout: 10000 });
    await this.documentsTab.click();
    await expect(this.addNewDocumentBtn).toBeVisible();
  }

  async addDocument({ category, DocumentName, filePath, description }) {
    try {
      const isDocumentExists = await this.documentExists(DocumentName);
      if (!isDocumentExists) {
        console.log(`Document ${DocumentName} does not exist, adding new document`);
    await this.addNewDocumentBtn.click();
    if (category) await this.categorySelect.selectOption({ label: category });
    if (DocumentName) await this.nameInput.fill(DocumentName);
    if (description) await this.descriptionInput.fill(description);
    if (filePath) await this.fileInput.setInputFiles(filePath);
    await this.saveBtn.click();
    await this.page.locator('#pageMessages').waitFor({ state: 'hidden', timeout: 10000 });
    await expect(this.documentsTable).toBeVisible();
    if (isDocumentExists) {
      console.log(`Document ${DocumentName} is uploaded successfully`);
      return true;
    } else {
      console.log(`Document ${DocumentName} is not uploaded`);
      return false; 
      }
    } else {
      console.log(`Document ${DocumentName} already exists`);
      return true;
    } 
  }catch (error) {
      console.log(`Error adding document ${DocumentName}:`, error);
    }
  }

  async documentExists(DocumentName) {
    const row = this.page.locator(`#documentsTable td`, { hasText: DocumentName })
    const isVisible = await row.isVisible();
    if (isVisible) {
      console.log(`Document ${DocumentName} exists`);
    }
    else {
      console.log(`Document ${DocumentName} does not exist`);
    }
    return isVisible;
  }

  //Verify Update Document
  async verifyUpdateDocument(newDocumentName) {
    const row = this.page.locator(`#documentsTable td`, { hasText: newDocumentName })
    const isVisible = await row.isVisible();
    if (isVisible) {
      console.log(`Document ${newDocumentName} exists`);
    }
    else {
      console.log(`Document ${newDocumentName} does not exist`);
    }
    return isVisible;
  }

  async updateDocument(DocumentName, category, newDocumentName, description) {
    try {
      const isDocumentExists = await this.documentExists(DocumentName); 
      const isUpdatedDocumentExists = await this.verifyUpdateDocument(newDocumentName);
      if (isDocumentExists) {
        const row = this.page.locator(`#documentsTable tr`, { has: this.page.locator('td', { hasText: DocumentName }) });
    const editBtn = row.getByRole('button', { name: /edit/i });
    await editBtn.click();
    if (category) await this.page.locator('#selectsCategory').selectOption({ label: category });
    if (newDocumentName) await this.page.locator('#docName').fill(newDocumentName);
    if (description) await this.page.locator('#docDescription').fill(description);
    await this.page.locator('#btnUpdDocument').click();
    await this.page.locator('#pageMessages').waitFor({ state: 'hidden', timeout: 10000 });
    await expect(this.page.locator(`#documentsTable td`, { hasText: newDocumentName })).toBeVisible();
    if (isUpdatedDocumentExists) {
      console.log(`Document ${newDocumentName} is updated successfully`);
      return true;
    } else {
      console.log(`Document ${newDocumentName} is not updated`);
      return false;
    }
    }
    } catch (error) {
      console.log(`Error updating document ${DocumentName}:`, error);
    }
  }
}

module.exports = DocumentsPage;
