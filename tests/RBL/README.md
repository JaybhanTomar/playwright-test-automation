# RBL Test Suite

This folder contains all RBL (Revenue Based Lead) related test specifications following the same structure as IRC tests.

## 📁 Folder Structure

```
tests/RBL/RBL/
├── 1_Tabbing.spec.js                    # Navigation and tabbing functionality
├── A_UsersCreationUpdation.spec.js      # User creation and updation tests
├── B_setupCategory.spec.js              # Category setup tests
├── C_setupSkill.spec.js                 # Skill setup tests
├── D_setupField.spec.js                 # Field creation tests
├── E_setupLeadField.spec.js             # Lead field creation tests
├── F_setupLeadProcessField.spec.js      # Lead Stage, Status & Lost Reason (Combined)
├── I_setupDispositionQuestion.spec.js   # Disposition question setup tests
├── J_setupImportTest.spec.js            # Import functionality tests
└── K_setupCampaignCreation.spec.js      # Campaign creation tests
```

## 📊 Data Source

All RBL tests use data from:
- **Excel File**: `tests/data/RBL Test Data.xlsx`
- **Data Provider**: `tests/DataProvider/RBLAdminData.js`

## 🎯 Test Categories

### 1. **Navigation Tests**
- `1_Tabbing.spec.js` - Basic navigation and tabbing functionality

### 2. **User Management**
- `A_UsersCreationUpdation.spec.js` - User creation and updates

### 3. **System Setup Tests**
- `B_setupCategory.spec.js` - Category management
- `C_setupSkill.spec.js` - Skill management
- `D_setupField.spec.js` - Field creation and management
- `E_setupLeadField.spec.js` - Lead-specific field management

### 4. **Lead Management**
- `F_setupLeadProcessField.spec.js` - Combined Lead Stage, Status & Lost Reason tests (follows Sanity pattern)

### 5. **Advanced Setup**
- `I_setupDispositionQuestion.spec.js` - Disposition question setup
- `J_setupImportTest.spec.js` - Import functionality
- `K_setupCampaignCreation.spec.js` - Campaign creation

## � **Key Improvements Based on Sanity Folder Pattern**

### **Enhanced Lead Process Field Test (`F_setupLeadProcessField.spec.js`)**
Following the pattern from `tests/Sanity/CreateleadprocessField.spec.js`, this file combines:

1. **Lead Stage Creation and Updation**
   - Click on Lead Stage → Setup → Click → Update pattern
   - Data validation and error handling
   - Navigation between sections

2. **Lead Status Creation and Updation**
   - Click on Lead Status → Setup → Click → Update pattern
   - Comprehensive data validation
   - Proper navigation flow

3. **Lead Lost Reason Creation and Updation**
   - Click on Lead Lost Reason → Setup → Click → Update pattern
   - Error handling for missing data
   - Sequential test execution

### **Enhanced Features**
- **Extended Timeouts**: 10-minute timeout for data processing
- **Better Error Handling**: Comprehensive try-catch blocks
- **Data Validation**: Checks for empty/missing data before processing
- **Improved Logging**: Detailed console output with emojis
- **Navigation Patterns**: Proper navigation between test sections

## �🔧 Configuration

### Environment
- **Target Environment**: QC2 (`baseUrlUtil.qc2()`)
- **Browser**: Chromium (headless: false)
- **API Monitoring**: Enabled for all tests

### Data Methods Available
Each test uses corresponding methods from `RBLAdminData`:

```javascript
// Category Data
RBLAdminData.CategoryCreationData()
RBLAdminData.CategoryUpdationData()

// Skill Data
RBLAdminData.SkillCreationData()
RBLAdminData.SkillUpdationData()

// Field Data
RBLAdminData.FieldCreationData()
RBLAdminData.FieldUpdationData()

// Lead Field Data
RBLAdminData.LeadFieldCreationData()
RBLAdminData.LeadFieldUpdationData()

// Lead Stage Data
RBLAdminData.LeadStageCreationData()
RBLAdminData.LeadStageUpdationData()

// Lead Status Data
RBLAdminData.LeadStatusCreationData()
RBLAdminData.LeadStatusUpdationData()

// Lead Lost Reason Data
RBLAdminData.LeadLostReasonCreationData()
RBLAdminData.LeadLostReasonUpdationData()

// Disposition Question Data
RBLAdminData.DispositionQuestionCreationData()
RBLAdminData.DispositionQuestionUpdationData()
```

## 🚀 Running Tests

### Run Individual Test
```bash
npx playwright test tests/RBL/RBL/B_setupCategory.spec.js
```

### Run All RBL Tests
```bash
npx playwright test tests/RBL/
```

### Run Specific Test Pattern
```bash
npx playwright test tests/RBL/RBL/setup*.spec.js
```

## 📝 Test Execution Order

Tests are designed to run independently, but the recommended order is:

1. **1_Tabbing.spec.js** - Verify navigation works
2. **A_UsersCreationUpdation.spec.js** - Set up users
3. **B_setupCategory.spec.js** - Create categories first
4. **C_setupSkill.spec.js** - Create skills
5. **D_setupField.spec.js** - Create fields
6. **E_setupLeadField.spec.js** - Create lead fields
7. **F_setupLeadStage.spec.js** - Set up lead stages
8. **G_setupLeadStatus.spec.js** - Set up lead status
9. **H_setupLeadLostReason.spec.js** - Set up lost reasons
10. **I_setupDispositionQuestion.spec.js** - Set up questions
11. **J_setupImportTest.spec.js** - Test import functionality
12. **K_setupCampaignCreation.spec.js** - Create campaigns

## 🔍 Features

- **API Monitoring**: All tests include API capture and logging
- **Data-Driven**: Tests read from Excel files via data providers
- **Logging**: Comprehensive console logging for debugging
- **Error Handling**: Proper error handling and reporting
- **Allure Integration**: Compatible with Allure reporting
- **Skip Options**: Update tests are skipped by default (can be enabled)

## 📋 Notes

- All update tests are currently skipped (`test.skip`) - remove `.skip` to enable
- Tests use QC2 environment by default
- Each test includes proper setup and teardown
- API summaries are logged after each test suite
- Tests follow the same pattern as IRC tests for consistency

---

## 🎯 **NEW: Centralized Environment Configuration**

### **Single Point of Control**
All RBL tests now use **centralized configuration** from `tests/RBL/config/RBLConfig.js`:

✅ **Change environment once** - affects all RBL tests
✅ **Individual tests** also use the same environment
✅ **No need to modify** individual test files
✅ **Consistent settings** across all RBL tests

### **Quick Environment Change**
```javascript
// Edit tests/RBL/config/RBLConfig.js
this.defaultEnvironment = 'qc2'; // Change to 'qc6', 'uat361', etc.
```

### **Available Environments**
- `'qc2'` - Default RBL environment
- `'qc6'` - Alternative test environment
- `'uat361'` - UAT environment

### **Configuration Files**
- `tests/RBL/config/RBLConfig.js` - Main configuration
- `tests/RBL/utils/RBLTestSetup.js` - Common setup utility
- `tests/RBL/ENVIRONMENT_CONFIG.md` - Detailed configuration guide

### **Usage**
```bash
# All RBL tests use configured environment
npx playwright test tests/RBL/

# Individual tests also use same environment
npx playwright test tests/RBL/RBL/B_setupCategory.spec.js
```

**📖 For detailed configuration instructions, see: `tests/RBL/ENVIRONMENT_CONFIG.md`**
