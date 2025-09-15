const path = require('path');
const ExcelUtils = require('../utils/ExcelUtils');

class ContactData {
  static WIOAddContactData() {
    const excelPath = path.join(__dirname, '../data/WIO.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'WIO Add Contact'); // ✅ FIXED
  }

  static WIOSearchContactData() {
    const excelPath = path.join(__dirname, '../data/WIO.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'WIO Search Contact'); // ✅ FIXED
  }
}

module.exports = ContactData;