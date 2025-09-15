/**
 * Utility for handling table row search with pagination in Playwright (locator-based, no dynamic XPath)
 * Usage: await TablePaginationHandler.findRowWithCellValue({ page, rowLocator, cellIndex, expectedValue, nextBtnLocator, prevBtnLocator })
 */

class TablePaginationHandler {
  /**
   * Get default pagination locators for a standard SVG-based pagination bar
   * @param {import('playwright').Page} page - Playwright page object
   * @returns {{ nextBtnLocator: import('playwright').Locator, prevBtnLocator: import('playwright').Locator }}
   */
  static getDefaultPaginationLocators(page) {
    const paginationControls = page.locator('ul.Pagination li.PaginationControl');
    const prevBtnLocator = paginationControls.nth(1); // second control is previous
    const nextBtnLocator = paginationControls.nth(3); // fourth control is next
    return { nextBtnLocator, prevBtnLocator };
  }

  static async findRowWithCellValue({ page, rowLocator, cellIndex, expectedValue, nextBtnLocator, prevBtnLocator }) {
  let foundRow = null;
  let pageIndex = 1;

  // Get initial rows to decide if pagination is needed
  let rows = await rowLocator.all();
  const totalRows = rows.length;

  const paginationRequired = totalRows > 20;

  do {
    rows = await rowLocator.all();
    for (const row of rows) {
      const cells = await row.locator('td').all();
      if (cells.length > cellIndex) {
        const cellValue = (await cells[cellIndex].textContent()).trim();
        if (cellValue === expectedValue) {
          foundRow = row;
          console.log(`✅ Found on page ${pageIndex}`);
          break;
        }
      }
    }

    if (foundRow || !paginationRequired) break;

    // Check if next button is visible & enabled
    const nextVisible = await nextBtnLocator.isVisible();
    const nextEnabled = !(await nextBtnLocator.isDisabled());

    if (nextVisible && nextEnabled) {
      await nextBtnLocator.click();
      await page.waitForTimeout(1000);
      pageIndex++;
    } else {
      break;
    }
  } while (!foundRow);

  // Reset to first page if required
  if (prevBtnLocator && paginationRequired) {
    try {
      while (await prevBtnLocator.isVisible() && !(await prevBtnLocator.isDisabled())) {
        await prevBtnLocator.click();
        await page.waitForTimeout(500);
      }
    } catch (e) {
      console.warn('⚠️ Reset to first page failed:', e.message);
    }
  }

  if (!foundRow) {
    console.warn(`❌ Row with value "${expectedValue}" not found in any page.`);
  }

  return foundRow;
}
}

module.exports = TablePaginationHandler;
