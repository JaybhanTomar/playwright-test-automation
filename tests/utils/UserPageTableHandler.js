const { expect } = require('@playwright/test');

/**
 * UserPageTableHandler utility class for handling user table pagination and email verification
 * Converted from Java Selenium to Playwright JavaScript
 */
class UserPageTableHandler {
  /**
   * Constructor to initialize page
   * @param {import('@playwright/test').Page} page - Playwright page object
   */
  constructor(page) {
    this.page = page;
    
    // Define locators with multiple fallbacks
    this.tableRows = page.locator("//tbody/tr | //table[@id='userTable']//tr[position()>1] | //table[contains(@class,'table')]//tr[position()>1] | //div[contains(@class,'table')]//tr[position()>1]");
    this.nextButton = page.locator("//div[@id='makDefaultSort']//li[6]//*[name()='svg'] | //div[@id='userPagiTop']//li[5]//*[name()='svg'] | //button[contains(text(),'Next')] | //a[contains(text(),'Next')]");
    this.previousButton = page.locator("//section[@class='content animated fadeIn']//li[1]//*[name()='svg'] | //div[@id='userPagiTop']//li[1]//*[name()='svg'] | //button[contains(text(),'Previous')] | //a[contains(text(),'Previous')]");
    this.nextPageButton = page.locator("//div[@id='makDefaultSort']//li[6]//*[name()='svg'] | //div[@id='userPagiTop']//li[5]//*[name()='svg'] | //button[contains(text(),'Next')] | //a[contains(text(),'Next')]");
    this.previousPageButton = page.locator("//section[@class='content animated fadeIn']//li[1]//*[name()='svg'] | //div[@id='userPagiTop']//li[1]//*[name()='svg'] | //button[contains(text(),'Previous')] | //a[contains(text(),'Previous')]");
    
    // Table column locators (based on your Java xpath patterns)
    this.emailColumn = "td:nth-child(2)"; // CSS selector for second column
    this.emailColumnXPath = ".//td[2]"; // XPath for second column
  }

  /**
   * Verify user email is present in the table
   * Converted from your Java VerifyUsers() method
   * @param {string} email - Email address to search for
   */
  async verifyUsers(email) {
    try {
      console.log(`🔍 Searching for user email: ${email}`);
      
      let isUserFound = false;
      let pageNumber = 1;

      do {
        console.log(`📄 Searching on page: ${pageNumber}`);
        
        // Get all rows on current page
        const rows = await this.tableRows.all();
        console.log(`📋 Found ${rows.length} rows on page ${pageNumber}`);

        for (const row of rows) {
          try {
            // Get email from row using CSS selector
            const emailElement = row.locator(this.emailColumn);

            // Check if email element exists
            const emailExists = await emailElement.count() > 0;
            if (!emailExists) {
              console.log(`⚠️ Row missing email column`);
              continue;
            }

            // Wait for element to be visible and get text
            await expect(emailElement).toBeVisible({ timeout: 5000 });
            const userEmail = (await emailElement.textContent())?.trim() || '';

            console.log(`  📧 Checking email: '${userEmail}'`);

            if (userEmail === email) {
              isUserFound = true;
              console.log(`✅ ${email}: User found on page: ${pageNumber}`);
              break;
            }
          } catch (error) {
            console.error(`⚠️ Error finding User details in a row: ${error.message}`);
            continue; // Move to the next row
          }
        }

        if (isUserFound) {
          break;
        }

        // Try to click next page
        const hasNextPage = await this.clickNextPage();
        if (!hasNextPage) {
          console.log(`📄 Reached last page (${pageNumber})`);
          break;
        }
        
        pageNumber++;
        
        // Wait for new page to load
        await this.page.waitForTimeout(1000);
        
      } while (true);

      // Verify user was found
      if (!isUserFound) {
        throw new Error(`useremail with id '${email}' not found on any page.`);
      }
      
      console.log(`✅ User verification completed successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Exception occurred in verifyUsers: ${error.message}`);
      throw error;
    } finally {
      // Reset to first page after search attempt
      await this.resetToFirstPage();
    }
  }

  /**
   * Click next page button with enhanced detection
   * Helper method to handle pagination
   * @returns {boolean} True if next page was clicked, false if no more pages
   */
  async clickNextPage() {
    try {
      // Try multiple next button selectors
      const nextButtonSelectors = [
        this.nextButton,
        this.page.locator("//button[contains(text(),'Next')] | //a[contains(text(),'Next')]"),
        this.page.locator("//button[contains(@aria-label,'Next')] | //a[contains(@aria-label,'Next')]"),
        this.page.locator("//li[contains(@class,'next')] | //button[contains(@class,'next')]"),
        this.page.locator("//i[contains(@class,'fa-chevron-right')] | //i[contains(@class,'fa-arrow-right')]").locator('xpath=ancestor::button[1] | ancestor::a[1]'),
        this.page.locator("//span[contains(text(),'›')] | //span[contains(text(),'→')]").locator('xpath=ancestor::button[1] | ancestor::a[1]')
      ];

      let nextButton = null;
      let buttonFound = false;

      // Find the first available next button
      for (const selector of nextButtonSelectors) {
        try {
          const count = await selector.count();
          if (count > 0) {
            const isVisible = await selector.first().isVisible({ timeout: 2000 });
            if (isVisible) {
              nextButton = selector.first();
              buttonFound = true;
              console.log(`📄 Found next button using selector`);
              break;
            }
          }
        } catch (error) {
          continue;
        }
      }

      if (!buttonFound) {
        console.log(`📄 No next button found - likely on last page`);
        return false;
      }

      // Check if button is enabled
      const isEnabled = await nextButton.isEnabled({ timeout: 2000 });
      if (!isEnabled) {
        console.log(`📄 Next button is disabled - likely on last page`);
        return false;
      }

      // Scroll button into view and click
      await nextButton.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(500);

      await nextButton.click();
      console.log(`➡️ Clicked next page button`);

      // Wait for page to load
      await this.page.waitForTimeout(2000);
      await expect(this.tableRows.first()).toBeVisible({ timeout: 10000 });

      return true;
    } catch (error) {
      console.log(`📄 Next button element not found or not clickable: ${error.message}`);
      return false;
    }
  }

  /**
   * Reset to first page after search
   * Converted from your Java finally block logic
   */
  async resetToFirstPage() {
    try {
      console.log(`🔄 Resetting to first page...`);
      
      let attempts = 0;
      const maxAttempts = 20; // Prevent infinite loops
      
      while (attempts < maxAttempts) {
        try {
          // Check if previous button exists
          const previousButtonCount = await this.previousButton.count();
          if (previousButtonCount === 0) {
            console.log(`📄 Previous button not found - likely already on first page`);
            break;
          }
          
          // Check if previous button is enabled
          const isEnabled = await this.previousButton.isEnabled({ timeout: 2000 });
          if (!isEnabled) {
            console.log(`📄 Previous button disabled - already at first page`);
            break;
          }
          
          // Click previous button
          await this.previousButton.click();
          console.log(`⬅️ Clicked previous page button (attempt ${attempts + 1})`);
          
          // Wait for page to update
          await this.page.waitForTimeout(300);
          
          attempts++;
        } catch (error) {
          console.log(`⚠️ Error clicking previous button: ${error.message}`);
          break;
        }
      }
      
      if (attempts >= maxAttempts) {
        console.log(`⚠️ Reached maximum attempts (${maxAttempts}) while resetting to first page`);
      } else {
        console.log(`✅ Successfully reset to first page`);
      }
    } catch (error) {
      console.log(`⚠️ Could not return to first page: ${error.message}`);
    }
  }

  /**
   * Get all users from current page with enhanced detection
   * Helper method to extract all user data from current page
   * @returns {Array<Object>} Array of user objects
   */
  async getAllUsersFromCurrentPage() {
    try {
      const users = [];

      // Ensure table is scrolled into view
      const tableLocator = this.page.locator("//table[@id='userTable'] | //table[contains(@class,'table')]").first();
      await tableLocator.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(500);

      const rows = await this.tableRows.all();
      console.log(`📊 Processing ${rows.length} rows on current page...`);

      for (let i = 0; i < rows.length; i++) {
        try {
          const row = rows[i];

          // Scroll row into view
          await row.scrollIntoViewIfNeeded();

          // Try multiple approaches to get email
          let email = '';

          // Approach 1: Use CSS selector for 2nd column
          try {
            const emailElement = row.locator(this.emailColumn);
            email = (await emailElement.textContent())?.trim() || '';
          } catch (error) {
            // Continue to next approach
          }

          // Approach 2: Try XPath for 2nd column
          if (!email) {
            try {
              const emailElement = row.locator("xpath=.//td[2]");
              email = (await emailElement.textContent())?.trim() || '';
            } catch (error) {
              // Continue to next approach
            }
          }

          // Approach 3: Get all cells and use 2nd one
          if (!email) {
            try {
              const cells = await row.locator('td').all();
              if (cells.length >= 2) {
                email = (await cells[1].textContent())?.trim() || '';
              }
            } catch (error) {
              // Continue to next approach
            }
          }

          // Approach 4: Look for email pattern in any cell
          if (!email) {
            try {
              const cells = await row.locator('td').all();
              for (const cell of cells) {
                const cellText = (await cell.textContent())?.trim() || '';
                if (cellText.includes('@') && cellText.includes('.')) {
                  email = cellText;
                  break;
                }
              }
            } catch (error) {
              // Continue
            }
          }

          if (email) {
            // Try to get additional user data from other columns
            const userData = await this.extractUserRowData(row);

            // Ensure we use the email we found, not from userData
            const userObject = {
              index: i + 1,
              email: email,  // Use the email we extracted above
              ...userData
            };

            // Override email in case extractUserRowData overwrote it
            userObject.email = email;

            users.push(userObject);
            console.log(`  📧 Found user ${i + 1}: ${email}`);
          } else {
            console.log(`  ⚠️ No email found in row ${i + 1}`);
          }
        } catch (error) {
          console.log(`⚠️ Error reading user row ${i + 1}: ${error.message}`);
          continue;
        }
      }

      console.log(`📊 Extracted ${users.length} users from current page`);
      return users;
    } catch (error) {
      console.error(`❌ Error getting users from current page: ${error.message}`);
      return [];
    }
  }

  /**
   * Extract data from a user row
   * Helper method to get all column data from a user row
   * @param {import('@playwright/test').Locator} row - Row locator
   * @returns {Object} User data object
   */
  async extractUserRowData(row) {
    try {
      const cells = await row.locator('td').all();
      const userData = {};
      
      // Common user table columns (adjust based on your actual table structure)
      const columnMappings = {
        0: 'name',
        1: 'userEmail',  // Don't overwrite the email we already extracted
        2: 'role',
        3: 'extension',
        4: 'status',
        5: 'lastLogin',
        6: 'timezone',
        7: 'actions'
      };
      
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const cellText = (await cell.textContent())?.trim() || '';
        const columnName = columnMappings[i] || `column_${i + 1}`;
        userData[columnName] = cellText;
      }
      
      return userData;
    } catch (error) {
      console.log(`⚠️ Error extracting user row data: ${error.message}`);
      return {};
    }
  }

  /**
   * Search for user across all pages and return detailed results
   * Enhanced method that returns comprehensive search information
   * @param {string} email - Email address to search for
   * @returns {Object} Search result object
   */
  async searchUserAcrossPages(email) {
    try {
      console.log(`🔍 Comprehensive search for user email: ${email}`);
      
      const searchResult = {
        found: false,
        pageNumber: null,
        rowIndex: null,
        totalPagesSearched: 0,
        totalUsersChecked: 0,
        user: null
      };

      let pageNumber = 1;

      do {
        console.log(`📄 Searching on page: ${pageNumber}`);
        searchResult.totalPagesSearched = pageNumber;
        
        const users = await this.getAllUsersFromCurrentPage();
        searchResult.totalUsersChecked += users.length;
        
        for (const user of users) {
          if (user.email === email) {
            searchResult.found = true;
            searchResult.pageNumber = pageNumber;
            searchResult.rowIndex = user.index;
            searchResult.user = user;
            
            console.log(`✅ User found on page ${pageNumber}, row ${user.index}`);
            return searchResult;
          }
        }

        // Try to go to next page
        const hasNextPage = await this.clickNextPage();
        if (!hasNextPage) {
          break;
        }
        
        pageNumber++;
        await this.page.waitForTimeout(1000);
        
      } while (true);

      console.log(`📊 Search completed: ${searchResult.totalUsersChecked} users checked across ${searchResult.totalPagesSearched} pages`);
      return searchResult;
    } catch (error) {
      console.error(`❌ Error during comprehensive user search: ${error.message}`);
      throw error;
    } finally {
      // Reset to first page
      await this.resetToFirstPage();
    }
  }

  /**
   * Wait for user table to load with enhanced scrolling and detection
   * Helper method to ensure table is ready and fully visible
   */
  async waitForTableLoad() {
    try {
      console.log(`⏳ Waiting for user table to load...`);

      // Scroll to ensure table is in view
      await this.page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      await this.page.waitForTimeout(500);

      // Wait for table to be visible
      const tableLocator = this.page.locator("//table[@id='userTable'] | //table[contains(@class,'table')] | //div[contains(@class,'table')]").first();
      await expect(tableLocator).toBeVisible({ timeout: 10000 });

      // Scroll table into view
      await tableLocator.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(500);

      // Wait for at least one row to be visible
      await expect(this.tableRows.first()).toBeVisible({ timeout: 10000 });

      // Additional wait for dynamic content
      await this.page.waitForTimeout(1000);

      const rowCount = await this.tableRows.count();
      console.log(`✅ User table loaded with ${rowCount} rows`);

      // Log table structure for debugging
      if (rowCount > 0) {
        try {
          const firstRow = this.tableRows.first();
          const cells = await firstRow.locator('td').all();
          console.log(`📋 Table has ${cells.length} columns per row`);

          // Log first few cell contents for debugging
          for (let i = 0; i < Math.min(cells.length, 5); i++) {
            const cellText = await cells[i].textContent();
            console.log(`  Column ${i + 1}: "${cellText?.trim() || 'empty'}"`);
          }
        } catch (debugError) {
          console.log(`⚠️ Could not debug table structure: ${debugError.message}`);
        }
      }

      return true;
    } catch (error) {
      console.error(`❌ Error waiting for user table to load: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check if user exists before creation (simple boolean check)
   * @param {string} email - Email to check
   * @returns {boolean} - True if user exists, false otherwise
   */
  async doesUserExist(email) {
    try {
      console.log(`🔍 Enhanced check: Does user exist? ${email}`);

      const searchResult = await this.searchUserAcrossPages(email);

      if (searchResult.found) {
        console.log(`✅ User exists: ${email} (found on page ${searchResult.pageNumber})`);
        return true;
      } else {
        console.log(`ℹ️ User does not exist: ${email} (searched ${searchResult.totalPagesSearched} pages)`);

        // Take screenshot for debugging when user not found
        try {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const screenshotPath = `test-results/user-search-debug-${timestamp}.png`;
          await this.page.screenshot({ path: screenshotPath, fullPage: true });
          console.log(`📸 Debug screenshot saved: ${screenshotPath}`);
        } catch (screenshotError) {
          console.log(`⚠️ Could not save debug screenshot: ${screenshotError.message}`);
        }

        return false;
      }
    } catch (error) {
      console.error(`❌ Error checking user existence: ${error.message}`);
      return false; // Assume user doesn't exist if there's an error
    }
  }

  // ==========================================
  // HIGH-LEVEL BUSINESS METHODS (POM Best Practices)
  // ==========================================

  /**
   * Analyze user existence for bulk operations (High-level POM method)
   * @param {Array} emailsToCheck - Array of emails to check
   * @returns {Object} - {existing: [], missing: [], summary: string}
   */
  async analyzeUserExistence(emailsToCheck) {
    try {
      console.log(`📊 Analyzing existence of ${emailsToCheck.length} users...`);

      // Ensure table is ready
      await this.waitForTableLoad();

      // Perform the check
      const result = await this.checkMultipleUsers(emailsToCheck);

      // Add summary
      result.summary = `Found ${result.existing.length} existing, ${result.missing.length} missing out of ${emailsToCheck.length} users`;

      console.log(`📊 Analysis complete: ${result.summary}`);
      return result;

    } catch (error) {
      console.error(`❌ Error analyzing user existence: ${error.message}`);
      return {
        existing: [],
        missing: emailsToCheck,
        totalChecked: emailsToCheck.length,
        summary: `Analysis failed: ${error.message}`
      };
    }
  }

  /**
   * Get list of existing users for comparison (efficient single-pass method)
   * @param {Array} emailsToCheck - Array of emails to check
   * @returns {Object} - {existing: [], missing: []}
   */
  async checkMultipleUsers(emailsToCheck) {
    try {
      console.log(`📊 Efficiently checking existence of ${emailsToCheck.length} users...`);

      const result = {
        existing: [],
        missing: [...emailsToCheck], // Start with all as missing
        totalChecked: emailsToCheck.length
      };

      let pageNumber = 1;
      let totalUsersScanned = 0;

      // Reset to first page
      await this.resetToFirstPage();

      // Search through all pages once
      do {
        console.log(`📄 Scanning page ${pageNumber} for users...`);

        // Wait for table to load
        await this.waitForTableLoad();

        // Get all users on current page
        const usersOnPage = await this.getAllUsersFromCurrentPage();
        totalUsersScanned += usersOnPage.length;

        // Check each user on this page
        for (const user of usersOnPage) {
          console.log(`🔍 Checking if ${user.email} is in list: [${emailsToCheck.join(', ')}]`);

          if (emailsToCheck.includes(user.email)) {
            // Move from missing to existing
            result.existing.push(user.email);
            const index = result.missing.indexOf(user.email);
            if (index > -1) {
              result.missing.splice(index, 1);
            }
            console.log(`✅ Found existing user: ${user.email} on page ${pageNumber}`);
          } else {
            console.log(`ℹ️ User ${user.email} not in our search list`);
          }
        }

        // Stop early if we found all users
        if (result.missing.length === 0) {
          console.log(`🎯 All users found! Stopping search early.`);
          break;
        }

        // Try to go to next page
        const hasNextPage = await this.clickNextPage();
        if (!hasNextPage) {
          console.log(`📄 Reached last page (${pageNumber})`);
          break;
        }

        pageNumber++;
        await this.page.waitForTimeout(1000);

      } while (true);

      console.log(`📊 Efficient user existence check complete:`);
      console.log(`  📄 Pages scanned: ${pageNumber}`);
      console.log(`  👥 Total users scanned: ${totalUsersScanned}`);
      console.log(`  ✅ Existing users: ${result.existing.length}`);
      console.log(`  ➕ Missing users: ${result.missing.length}`);

      return result;
    } catch (error) {
      console.error(`❌ Error checking multiple users: ${error.message}`);
      return { existing: [], missing: emailsToCheck, totalChecked: emailsToCheck.length };
    } finally {
      // Reset to first page
      await this.resetToFirstPage();
    }
  }

  /**
   * Delete user by email (enhanced version)
   * @param {string} email - Email of user to delete
   * @returns {boolean} - Success status
   */
  async deleteUser(email) {
    try {
      console.log(`🗑️ Attempting to delete user: ${email}`);

      const searchResult = await this.searchUserAcrossPages(email);
      if (!searchResult.found) {
        console.log(`ℹ️ User not found for deletion: ${email}`);
        return false;
      }

      // Navigate to the page where user was found
      await this.resetToFirstPage();
      for (let i = 1; i < searchResult.pageNumber; i++) {
        await this.clickNextPage();
      }

      // Find the user row and delete button
      const userRow = this.page.locator(`//tbody/tr[${searchResult.rowIndex}]`);
      const deleteButton = userRow.locator("//button[contains(@class,'btn-danger')] | //i[contains(@class,'fa-trash')] | //a[contains(text(),'Delete')]").first();

      const deleteButtonCount = await deleteButton.count();
      if (deleteButtonCount > 0) {
        await deleteButton.scrollIntoViewIfNeeded();
        await deleteButton.click();
        await this.page.waitForTimeout(1000);

        // Handle confirmation dialog
        try {
          const confirmButton = this.page.locator("//button[contains(text(),'Yes')] | //button[contains(text(),'Confirm')] | //button[contains(text(),'Delete')]").first();
          const confirmCount = await confirmButton.count();
          if (confirmCount > 0) {
            await confirmButton.click();
            await this.page.waitForTimeout(2000);
          }
        } catch (confirmError) {
          console.log(`⚠️ No confirmation dialog for ${email}`);
        }

        console.log(`✅ Successfully deleted user: ${email}`);
        return true;
      } else {
        console.log(`⚠️ Delete button not found for user: ${email}`);
        return false;
      }

    } catch (error) {
      console.error(`❌ Error deleting user ${email}: ${error.message}`);
      return false;
    }
  }
}

module.exports = UserPageTableHandler;
