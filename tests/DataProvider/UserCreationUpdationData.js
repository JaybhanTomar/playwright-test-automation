const path = require('path');
const ExcelUtils = require('../utils/ExcelUtils');

class UserCreationUpdationData {
  static UserCreationData() {
    const excelPath = path.join(__dirname, '../data/WorkFlow Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'UserCreationData');
  }

  static UserUpdationData() {
    const excelPath = path.join(__dirname, '../data/WorkFlow Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'UserUpdationData');
  }

  static userLoginData() {
    // Corrected path: go up one level to 'data/Login Creds Data.xlsx'
    const excelPath = path.join(__dirname, '../data/Login Creds Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'UserLoginData');
  }
}

module.exports = UserCreationUpdationData;
