# IRC Environment Configuration Guide

This guide explains how to configure and use the centralized environment settings for all IRC tests.

## 🎯 **Quick Start**

### **Change Environment for All IRC Tests**

1. **Edit the configuration file:**
   ```bash
   # Open the IRC configuration file
   nano tests/IRC/config/IRCConfig.js
   ```

2. **Change the environment:**
   ```javascript
   // In IRCConfig.js, change this line:
   this.defaultEnvironment = 'qc2'; // Change to 'qc6', 'uat361', etc.
   ```

3. **Run tests - they will all use the new environment:**
   ```bash
   # All IRC tests will use the configured environment
   npx playwright test tests/IRC/
   
   # Individual tests also use the same environment
   npx playwright test tests/IRC/IRC/B_setupCategory.spec.js
   ```

## 📁 **Configuration Files**

### **1. Main Configuration (`tests/IRC/config/IRCConfig.js`)**
- **Purpose**: Central configuration for all IRC tests
- **Key Settings**:
  - `defaultEnvironment`: Target environment ('qc2', 'qc6', 'uat361')
  - `testTimeout`: Timeout for all IRC tests (default: 10 minutes)
  - `headless`: Browser mode (default: false)
  - `browserOptions`: Browser launch configuration
  - `pageOptions`: Page-level settings

### **2. Test Setup Utility (`tests/IRC/utils/IRCTestSetup.js`)**
- **Purpose**: Common setup functionality for all IRC tests
- **Features**:
  - Automatic browser initialization with IRC config
  - Environment navigation using IRC config
  - Login handling
  - System Setup navigation
  - Enhanced cleanup with error handling

## 🔧 **Available Environments**

| Environment | Code | Description |
|-------------|------|-------------|
| QC2 | `'qc2'` | Default IRC environment |
| QC6 | `'qc6'` | Alternative test environment |
| UAT361 | `'uat361'` | UAT environment |

## 📝 **Configuration Options**

### **Environment Settings**
```javascript
// In tests/IRC/config/IRCConfig.js
this.defaultEnvironment = 'qc2'; // Change this to switch environments
```

### **Browser Settings**
```javascript
// Headless mode
this.headless = false; // Set to true for headless execution

// Browser arguments
this.browserOptions = {
  headless: this.headless,
  args: [
    '--start-maximized',
    '--disable-web-security',
    '--disable-features=VizDisplayCompositor'
  ]
};
```

### **Timeout Settings**
```javascript
// Test timeout (in milliseconds)
this.testTimeout = 600000; // 10 minutes

// Page timeouts
this.pageOptions = {
  actionTimeout: 10000,      // 10 seconds
  navigationTimeout: 15000   // 15 seconds
};
```

## 🚀 **Usage Examples**

### **Running Tests with Different Environments**

1. **Switch to QC6 for all IRC tests:**
   ```javascript
   // Edit tests/IRC/config/IRCConfig.js
   this.defaultEnvironment = 'qc6';
   ```
   ```bash
   # All tests now use QC6
   npx playwright test tests/IRC/
   ```

2. **Switch to UAT361:**
   ```javascript
   // Edit tests/IRC/config/IRCConfig.js
   this.defaultEnvironment = 'uat361';
   ```

3. **Run in headless mode:**
   ```javascript
   // Edit tests/IRC/config/IRCConfig.js
   this.headless = true;
   ```

### **Test File Structure**
All IRC tests now follow this pattern:
```javascript
const { test } = require('@playwright/test');
const IRCTestSetup = require('../utils/IRCTestSetup.js');

test.describe.serial('IRC - Test Name', () => {
  let ircSetup, sys, apiCapture;

  // Use IRC Config for timeout
  test.setTimeout(IRCTestSetup.getTestTimeout());

  test.beforeAll(async () => {
    // Initialize with centralized config
    ircSetup = new IRCTestSetup();
    const instances = await ircSetup.completeSetup();
    
    sys = instances.sys;
    apiCapture = instances.apiCapture;
  });

  test.afterAll(async () => {
    await ircSetup.cleanup();
  });
});
```

## 🔍 **Verification**

### **Check Current Configuration**
When tests run, you'll see configuration logs:
```
📋 IRC Configuration:
   Environment: QC2
   Headless: false
   Timeout: 600s
   Browser Args: --start-maximized, --disable-web-security, --disable-features=VizDisplayCompositor

🌐 IRC Config: Navigating to QC2 environment
✅ IRC Config: Successfully navigated to QC2
```

### **Verify Environment Switch**
1. Change environment in config
2. Run any IRC test
3. Check the logs for environment confirmation

## 📋 **Benefits**

✅ **Single Point of Configuration**: Change environment once, affects all tests
✅ **Consistent Settings**: All IRC tests use identical configuration
✅ **Easy Environment Switching**: No need to modify individual test files
✅ **Individual Test Support**: Single tests also use centralized config
✅ **Enhanced Error Handling**: Improved cleanup and error management
✅ **Detailed Logging**: Clear visibility into configuration and environment
