const path = require('path');
const ExcelUtils = require('../utils/ExcelUtils');

class DispositionScreenData {
  // Disposition Screen Creation Data
  static DispositionScreenCreationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'DispositionScreenCreation');
  }

  // Disposition Screen Updation Data
  static DispositionScreenUpdationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'DispositionScreenUpdation');
  }

  // Get sample disposition screen data for testing
  static getSampleDispositionScreenData() {
    return [
      {
        DispositionScreenName: 'Test Disposition Screen 1',
        Type: 'Negative',
        Category: 'General',
        Question: 'Not Interested',
        Description: 'Screen for negative dispositions'
      },
      {
        DispositionScreenName: 'Test Disposition Screen 2', 
        Type: 'Positive',
        Category: 'General',
        Question: 'Interested',
        Description: 'Screen for positive dispositions'
      },
      {
        DispositionScreenName: 'Test Disposition Screen 3',
        Type: 'Indeterminate', 
        Category: 'General',
        Question: 'Call Back Later',
        Description: 'Screen for indeterminate dispositions'
      }
    ];
  }
}

module.exports = DispositionScreenData;
