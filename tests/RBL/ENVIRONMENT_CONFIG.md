# RBL Environment Configuration Guide

This guide explains how to configure and use the centralized environment settings for all RBL tests.

## 🎯 **Quick Start**

### **Change Environment for All RBL Tests**

1. **Edit the configuration file:**
   ```bash
   # Open the RBL configuration file
   nano tests/RBL/config/RBLConfig.js
   ```

2. **Change the environment:**
   ```javascript
   // In RBLConfig.js, change this line:
   this.defaultEnvironment = 'qc2'; // Change to 'qc6', 'uat361', etc.
   ```

3. **Run tests - they will all use the new environment:**
   ```bash
   # All RBL tests will use the configured environment
   npx playwright test tests/RBL/
   
   # Individual tests also use the same environment
   npx playwright test tests/RBL/RBL/B_setupCategory.spec.js
   ```

## 📁 **Configuration Files**

### **1. Main Configuration (`tests/RBL/config/RBLConfig.js`)**
- **Purpose**: Central configuration for all RBL tests
- **Key Settings**:
  - `defaultEnvironment`: Target environment ('qc2', 'qc6', 'uat361')
  - `testTimeout`: Timeout for all RBL tests (default: 10 minutes)
  - `headless`: Browser mode (default: false)
  - `browserOptions`: Browser launch configuration
  - `pageOptions`: Page-level settings

### **2. Test Setup Utility (`tests/RBL/utils/RBLTestSetup.js`)**
- **Purpose**: Common setup functionality for all RBL tests
- **Features**:
  - Automatic browser initialization with RBL config
  - Environment navigation using RBL config
  - Login handling
  - System Setup navigation
  - Enhanced cleanup with error handling

## 🔧 **Available Environments**

| Environment | Code | Description |
|-------------|------|-------------|
| QC2 | `'qc2'` | Default RBL environment |
| QC6 | `'qc6'` | Alternative test environment |
| UAT361 | `'uat361'` | UAT environment |

## 📝 **Configuration Options**

### **Environment Settings**
```javascript
// In tests/RBL/config/RBLConfig.js
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

1. **Switch to QC6 for all RBL tests:**
   ```javascript
   // Edit tests/RBL/config/RBLConfig.js
   this.defaultEnvironment = 'qc6';
   ```
   ```bash
   # All tests now use QC6
   npx playwright test tests/RBL/
   ```

2. **Switch to UAT361:**
   ```javascript
   // Edit tests/RBL/config/RBLConfig.js
   this.defaultEnvironment = 'uat361';
   ```

3. **Run in headless mode:**
   ```javascript
   // Edit tests/RBL/config/RBLConfig.js
   this.headless = true;
   ```

### **Test File Structure**
All RBL tests now follow this pattern:
```javascript
const { test } = require('@playwright/test');
const RBLTestSetup = require('../utils/RBLTestSetup.js');
const RBLAdminData = require('../../DataProvider/RBLAdminData.js');

test.describe.serial('RBL - Test Name', () => {
  let rblSetup, sys, apiCapture;

  // Use RBL Config for timeout
  test.setTimeout(RBLTestSetup.getTestTimeout());

  test.beforeAll(async () => {
    // Initialize with centralized config
    rblSetup = new RBLTestSetup();
    const instances = await rblSetup.completeSetup();
    
    sys = instances.sys;
    apiCapture = instances.apiCapture;
  });

  test.afterAll(async () => {
    await rblSetup.cleanup();
  });
});
```

## 🔍 **Verification**

### **Check Current Configuration**
When tests run, you'll see configuration logs:
```
📋 RBL Configuration:
   Environment: QC2
   Headless: false
   Timeout: 600s
   Browser Args: --start-maximized, --disable-web-security, --disable-features=VizDisplayCompositor

🌐 RBL Config: Navigating to QC2 environment
✅ RBL Config: Successfully navigated to QC2
```

### **Verify Environment Switch**
1. Change environment in config
2. Run any RBL test
3. Check the logs for environment confirmation

## 📋 **Benefits**

✅ **Single Point of Configuration**: Change environment once, affects all tests
✅ **Consistent Settings**: All RBL tests use identical configuration
✅ **Easy Environment Switching**: No need to modify individual test files
✅ **Individual Test Support**: Single tests also use centralized config
✅ **Enhanced Error Handling**: Improved cleanup and error management
✅ **Detailed Logging**: Clear visibility into configuration and environment

## 🛠️ **Troubleshooting**

### **Environment Not Switching**
- Verify `RBLConfig.js` has been saved with changes
- Check test logs for environment confirmation
- Ensure test files are using `RBLTestSetup`

### **Tests Timing Out**
- Increase `testTimeout` in `RBLConfig.js`
- Check network connectivity to target environment
- Verify environment is accessible

### **Browser Issues**
- Adjust `browserOptions` in `RBLConfig.js`
- Try switching `headless` mode
- Check browser arguments compatibility
