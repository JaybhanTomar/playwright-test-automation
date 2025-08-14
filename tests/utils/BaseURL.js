class BaseURL {
  constructor(page = null) {
    this.page = page;
    this.environments = {
      qc2: 'https://qc2.devaavaz.biz/',
      qc3: 'https://qc3.devaavaz.biz/',
      qc4: 'https://qc4.devaavaz.biz/',
      qc5: 'https://qc5.devaavaz.biz/',
      qc6: 'https://qc6.devaavaz.biz/',
      qc7: 'https://qc7.devaavaz.biz/',
      uat361: 'https://uat-361.aavaz.biz/',
      i361: 'https://i-361.aavaz.biz/'
    };
  }

  getEnvironmentUrl(environment) {
    // If the environment value looks like a URL, use it directly
    if (environment.startsWith('http://') || environment.startsWith('https://')) {
      return environment;
    }
    // Otherwise, use the mapping
    const url = this.environments[environment.toLowerCase()];
    if (!url) {
      console.warn(`⚠️ Environment '${environment}' not found. Available environments: ${Object.keys(this.environments).join(', ')}`);
      return this.environments.qc2; // Default to qc2
    }
    return url;
  }

  getAllEnvironments() {
    return { ...this.environments };
  }

  setEnvironmentUrl(environment, url) {
    this.environments[environment.toLowerCase()] = url;
  }

  async qc2() {
    if (!this.page) {
      throw new Error('Page instance not provided. Initialize BaseURL with page parameter.');
    }
    await this.page.goto(this.environments.qc2);
    console.log('✅ Navigated to QC2:', this.environments.qc2);
  }

  async qc3() {
    if (!this.page) {
      throw new Error('Page instance not provided. Initialize BaseURL with page parameter.');
    }
    await this.page.goto(this.environments.qc3);
    console.log('✅ Navigated to QC3:', this.environments.qc3);
  }

  async qc4() {
    if (!this.page) {
      throw new Error('Page instance not provided. Initialize BaseURL with page parameter.');
    }
    await this.page.goto(this.environments.qc4);
    console.log('✅ Navigated to QC4:', this.environments.qc4);
  }

  async qc5() {
    if (!this.page) {
      throw new Error('Page instance not provided. Initialize BaseURL with page parameter.');
    }
    await this.page.goto(this.environments.qc5);
    console.log('✅ Navigated to QC5:', this.environments.qc5);
  }

  async qc6() {
    if (!this.page) {
      throw new Error('Page instance not provided. Initialize BaseURL with page parameter.');
    }
    await this.page.goto(this.environments.qc6);
    console.log('✅ Navigated to QC6:', this.environments.qc6);
  }

  async qc7() {
    if (!this.page) {
      throw new Error('Page instance not provided. Initialize BaseURL with page parameter.');
    }
    await this.page.goto(this.environments.qc7);
    console.log('✅ Navigated to QC7:', this.environments.qc7);
  }

  async uat361() {
    if (!this.page) {
      throw new Error('Page instance not provided. Initialize BaseURL with page parameter.');
    }
    await this.page.goto(this.environments.uat361);
    console.log('✅ Navigated to UAT361:', this.environments.uat361);
  }

  async i361(){
    if (!this.page) {
      throw new Error('Page instance not provided. Initialize BaseURL with page parameter.');
    }
    await this.page.goto(this.environments.i361);
    console.log('✅ Navigated to UAT361:', this.environments.i361);
  }
}

module.exports = BaseURL;
