class ApiCapture {
  constructor(page) {
    this.page = page;
    this.apiCalls = [];
    this.failedApis = [];
  }

  // Start monitoring API calls
  startMonitoring() {
    this.page.on('response', async (response) => {
      if (response.request().resourceType() === 'xhr' || response.request().resourceType() === 'fetch') {
        const apiCall = {
          url: response.url(),
          method: response.request().method(),
          status: response.status(),
          statusText: response.statusText(),
          timestamp: new Date().toISOString()
        };

        try {
          const body = await response.text();
          apiCall.responseBody = body;
        } catch (error) {
          apiCall.responseBody = 'Unable to read response body';
        }

        this.apiCalls.push(apiCall);

        // Log failed APIs
        if (response.status() >= 400) {
          this.failedApis.push(apiCall);
          console.error(`❌ API Failed: ${response.url()} - Status: ${response.status()}`);

          // Check if continue-on-failure is enabled
          const continueOnFailure = process.env.CONTINUE_ON_FAILURE === 'true' || true;

          if (!continueOnFailure) {
            throw new Error(
              `API failed: ${response.url()} with status ${response.status()}\nResponse body: ${apiCall.responseBody}`
            );
          } else {
            console.log(`⏭️ Continuing despite API failure (continue-on-failure enabled)...`);
          }
        }
      }
    });
  }

  // Get all captured API calls
  getApiCalls() {
    return this.apiCalls;
  }

  // Get failed API calls
  getFailedApis() {
    return this.failedApis;
  }

  // Clear captured data
  clear() {
    this.apiCalls = [];
    this.failedApis = [];
  }

  // Log API summary
  logApiSummary() {
    console.log(`📊 API Summary: ${this.apiCalls.length} calls, ${this.failedApis.length} failed`);
    if (this.failedApis.length > 0) {
      console.log('❌ Failed APIs:');
      this.failedApis.forEach(api => {
        console.log(`  - ${api.method} ${api.url} (${api.status})`);
      });
    }
  }
}

module.exports = ApiCapture; 