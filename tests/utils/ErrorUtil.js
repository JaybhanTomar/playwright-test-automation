class ErrorUtil {
  static TIMEOUT_MS = 2000; // Check timeout for each locator
  static DISAPPEAR_TIMEOUT_MS = 10000; // Max time to wait for popup to disappear

  static ERROR_LOCATORS = [
    '#pageMessages',
    'div.alert.animated.flipInX.alert-warning',
    "//*[contains(text(),'Oops!') or contains(text(),'unexpected error')]"
  ];

  static async captureErrorIfPresent(page, testName = 'unknown', force = false) {
    if (page.isClosed()) return;

    let errorFound = false;

    for (const locator of ErrorUtil.ERROR_LOCATORS) {
      try {
        const elements = await page.locator(locator).all();
        for (const element of elements) {
          const text = await element.textContent({ timeout: ErrorUtil.TIMEOUT_MS });
          const trimmedText = text?.trim().toLowerCase() || '';

          if (trimmedText && (trimmedText.includes('error') || trimmedText.includes('oops'))) {
            errorFound = true;
            if (!page.isClosed()) {
              const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
              const safeTestName = testName.replace(/[^a-zA-Z0-9-_]/g, '_');
              const screenshotPath = `error-${safeTestName}-${timestamp}.png`;
              await page.screenshot({ path: screenshotPath, fullPage: true });
              console.log(`Screenshot captured at: ${screenshotPath}`);
            }
            throw new Error(`Captured error banner: "${text?.trim()}"`);
          }
        }
      } catch (error) {
        if (error.message.includes('Captured error banner:')) {
          throw error;
        }
        // Ignore other locator errors
      }
    }

    if (force && !errorFound && !page.isClosed()) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const safeTestName = testName.replace(/[^a-zA-Z0-9-_]/g, '_');
      const screenshotPath = `error-${safeTestName}-${timestamp}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Screenshot (forced) captured at: ${screenshotPath}`);
    }
  }

  /**
   * Wait until known error banners disappear from the screen.
   * @param {import('playwright').Page} page
   */
  static async waitForErrorToDisappear(page) {
    if (page.isClosed()) return;

    for (const locator of ErrorUtil.ERROR_LOCATORS) {
      const popup = page.locator(locator);
      try {
        await popup.waitFor({ state: 'detached', timeout: ErrorUtil.DISAPPEAR_TIMEOUT_MS });
        console.log(`Error popup "${locator}" has disappeared.`);
      } catch (e) {
        console.warn(`Timeout waiting for error popup to disappear: ${locator}`);
        // You can throw here if you want to fail test when error popup doesn't go away
      }
    }
  }

  /**
   * Throws an error if the API response status is 400 or above.
   * @param {import('playwright').APIResponse} response
   * @param {string} [context] - Optional context for error message
   */
  static async throwIfApiError(response, context = '') {
    if (response.status() >= 400) {
      const body = await response.text();
      throw new Error(
        `API failed${context ? ` (${context})` : ''}: ${response.url()} with status ${response.status()}\nResponse body: ${body}`
      );
    }
  }

  /**
   * Throws an error if any failed API calls are present in the provided array.
   * @param {Array} failedApis - Array of failed API call objects (from ApiCapture)
   * @param {string} [context] - Optional context for error message
   */
  static throwIfAnyApiFailed(failedApis, context = '') {
    if (failedApis && failedApis.length > 0) {
      const details = failedApis.map(api =>
        `${api.method} ${api.url} (${api.status})\nResponse: ${api.responseBody}`
      ).join('\n\n');
      throw new Error(
        `API failure(s) detected${context ? ` (${context})` : ''}:\n${details}`
      );
    }
  }

  /**
   * Checks for failed API calls in the provided ApiCapture instance and throws if any are present.
   * @param {ApiCapture} apiCapture - The ApiCapture instance monitoring API calls
   * @param {string} [context] - Optional context for error message
   */
  static async captureApiErrorIfPresent(apiCapture, context = '') {
    if (apiCapture && typeof apiCapture.getFailedApis === 'function') {
      const failedApis = apiCapture.getFailedApis();
      if (failedApis && failedApis.length > 0) {
        const details = failedApis.map(api =>
          `${api.method} ${api.url} (${api.status})\nResponse: ${api.responseBody}`
        ).join('\n\n');
        throw new Error(
          `API failure(s) detected${context ? ` (${context})` : ''}:\n${details}`
        );
      }
    }
  }
}

module.exports = ErrorUtil;
