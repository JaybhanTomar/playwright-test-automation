const { expect } = require('@playwright/test');

/**
 * DatePicker Utility Class
 * Handles date picker interactions across the application
 */
class DatePicker {
  constructor(page) {
    this.page = page;
  }

  // Select date from date picker
  async selectDate(datePickerLocator, targetDate) {
    try {
      console.log(`📅 Selecting date: ${targetDate}`);
      
      // Click to open date picker
      await datePickerLocator.click();
      await this.page.waitForTimeout(1000);
      
      // Parse target date
      const date = new Date(targetDate);
      const targetYear = date.getFullYear();
      const targetMonth = date.getMonth(); // 0-based
      const targetDay = date.getDate();
      
      // Navigate to correct year and month
      await this.navigateToYearMonth(targetYear, targetMonth);
      
      // Select the day
      const dayLocator = this.page.locator(`//td[@data-date='${targetDay}'] | //button[text()='${targetDay}']`);
      await dayLocator.click();
      
      console.log(`✅ Date selected: ${targetDate}`);
      return true;
    } catch (error) {
      console.error(`❌ Error selecting date: ${error.message}`);
      return false;
    }
  }

  /**
   * Select a date in flatpickr by a date string in 'YYYY-MM-DD' format
   * @param {string} datePickerLocator - Playwright locator for the input or button that opens the date picker
   * @param {string} dayContainerSelector - Selector for the day container (e.g., 'div.dayContainer')
   * @param {string} dateString - in 'YYYY-MM-DD' format
   */
  async selectDateByISO(datePickerLocator, dayContainerSelector, dateString) {
    try {
      // First try to use flatpickr API directly (for readonly inputs)
      const inputId = await datePickerLocator.getAttribute('id');
      if (inputId) {
        const success = await this.setFlatpickrDate(inputId, dateString);
        if (success) {
          return;
        }
      }

      // Fallback to manual date picker interaction
      await this.manualDateSelection(datePickerLocator, dayContainerSelector, dateString);
    } catch (error) {
      console.log(`⚠️ Date selection failed: ${error.message}`);
      throw error;
    }
  }

  // Set date using flatpickr API directly (for readonly inputs)
  async setFlatpickrDate(inputId, dateString) {
    try {
      // Convert various date formats to flatpickr-compatible format
      const convertedDate = this.convertToFlatpickrFormat(dateString);

      console.log(`📅 Setting flatpickr date: "${dateString}" -> "${convertedDate}" for input #${inputId}`);

      const success = await this.page.evaluate(({ id, date }) => {
        const input = document.getElementById(id);
        if (input && input._flatpickr) {
          try {
            input._flatpickr.setDate(date, true);
            return true;
          } catch (e) {
            console.log('Flatpickr setDate failed:', e.message);
            return false;
          }
        }
        return false;
      }, { id: inputId, date: convertedDate });

      if (success) {
        console.log(`✅ Successfully set flatpickr date: ${convertedDate}`);
        return true;
      } else {
        console.log(`⚠️ Flatpickr API not available for input #${inputId}`);
        return false;
      }
    } catch (error) {
      console.log(`⚠️ Flatpickr date setting failed: ${error.message}`);
      return false;
    }
  }

  // Convert various date formats to flatpickr-compatible format
  convertToFlatpickrFormat(dateString) {
    if (!dateString || dateString.trim() === '') return '';

    try {
      // Handle Excel format like '25-08-13' -> '13/08/2025'
      if (dateString.match(/^\d{2}-\d{2}-\d{2}$/)) {
        const parts = dateString.trim().split('-');
        let [year, month, day] = parts;
        // Convert 2-digit year to 4-digit year
        const currentYear = new Date().getFullYear();
        const currentCentury = Math.floor(currentYear / 100) * 100;
        year = currentCentury + parseInt(year);
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
      }

      // Handle ISO format 'YYYY-MM-DD' -> 'DD/MM/YYYY'
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
      }

      // Return as-is if already in DD/MM/YYYY format
      if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        return dateString;
      }

      // Try to parse as Date and convert
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }

      return dateString; // Return as-is if no conversion possible
    } catch (error) {
      console.log(`⚠️ Date conversion error for "${dateString}": ${error.message}`);
      return dateString;
    }
  }

  // Manual date picker interaction (fallback method)
  async manualDateSelection(datePickerLocator, dayContainerSelector, dateString) {
    // Open the date picker
    await datePickerLocator.click();
    // Convert 'YYYY-MM-DD' to 'Month D, YYYY'
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    const ariaLabel = `${month} ${day}, ${year}`;
    const dayLocator = this.page.locator(`${dayContainerSelector} .flatpickr-day[aria-label='${ariaLabel}']`);
    await dayLocator.scrollIntoViewIfNeeded();
    await dayLocator.click();
    console.log(`✅ Selected date: ${ariaLabel}`);
  }

  // Navigate to specific year and month
  async navigateToYearMonth(targetYear, targetMonth) {
    try {
      // Get current displayed month/year
      const monthYearDisplay = this.page.locator("//div[@class='datepicker-switch'] | //th[@class='datepicker-switch']");
      
      let attempts = 0;
      const maxAttempts = 24; // Prevent infinite loops
      
      while (attempts < maxAttempts) {
        const currentDisplay = await monthYearDisplay.textContent();
        const [currentMonthName, currentYear] = currentDisplay.trim().split(' ');
        const currentMonth = this.getMonthNumber(currentMonthName);
        
        if (parseInt(currentYear) === targetYear && currentMonth === targetMonth) {
          break; // We're at the target month/year
        }
        
        // Navigate forward or backward
        if (parseInt(currentYear) < targetYear || 
           (parseInt(currentYear) === targetYear && currentMonth < targetMonth)) {
          // Go forward
          const nextButton = this.page.locator("//th[@class='next'] | //button[@class='next']");
          await nextButton.click();
        } else {
          // Go backward
          const prevButton = this.page.locator("//th[@class='prev'] | //button[@class='prev']");
          await prevButton.click();
        }
        
        await this.page.waitForTimeout(500);
        attempts++;
      }
      
      if (attempts >= maxAttempts) {
        throw new Error('Could not navigate to target month/year');
      }
      
    } catch (error) {
      console.error(`❌ Error navigating to year/month: ${error.message}`);
      throw error;
    }
  }

  // Convert month name to number (0-based)
  getMonthNumber(monthName) {
    const months = {
      'January': 0, 'February': 1, 'March': 2, 'April': 3,
      'May': 4, 'June': 5, 'July': 6, 'August': 7,
      'September': 8, 'October': 9, 'November': 10, 'December': 11,
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3,
      'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7,
      'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    return months[monthName] || 0;
  }

  // Select date range
  async selectDateRange(startDatePickerLocator, endDatePickerLocator, startDate, endDate) {
    try {
      console.log(`📅 Selecting date range: ${startDate} to ${endDate}`);
      
      await this.selectDate(startDatePickerLocator, startDate);
      await this.page.waitForTimeout(1000);
      await this.selectDate(endDatePickerLocator, endDate);
      
      console.log(`✅ Date range selected: ${startDate} to ${endDate}`);
      return true;
    } catch (error) {
      console.error(`❌ Error selecting date range: ${error.message}`);
      return false;
    }
  }

  // Get current selected date
  async getCurrentDate(datePickerLocator) {
    try {
      const currentValue = await datePickerLocator.inputValue();
      return currentValue;
    } catch (error) {
      console.error(`❌ Error getting current date: ${error.message}`);
      return '';
    }
  }

  // Clear date selection
  async clearDate(datePickerLocator) {
    try {
      await datePickerLocator.clear();
      console.log('✅ Date cleared');
      return true;
    } catch (error) {
      console.error(`❌ Error clearing date: ${error.message}`);
      return false;
    }
  }

  // Validate date format
  isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }

  // Format date for display
  formatDate(date, format = 'MM/DD/YYYY') {
    try {
      const d = new Date(date);
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const year = d.getFullYear();
      
      switch (format) {
        case 'MM/DD/YYYY':
          return `${month}/${day}/${year}`;
        case 'DD/MM/YYYY':
          return `${day}/${month}/${year}`;
        case 'YYYY-MM-DD':
          return `${year}-${month}-${day}`;
        default:
          return `${month}/${day}/${year}`;
      }
    } catch (error) {
      console.error(`❌ Error formatting date: ${error.message}`);
      return '';
    }
  }
}

module.exports = DatePicker;
