const path = require('path');
const ExcelUtils = require('../utils/ExcelUtils');

class DocumentData {
  static uploadDocumentData() {
    const excelPath = path.join(__dirname, '../data/Document Update Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'Upload Document'); // ✅ FIXED
  }

  static UpdateDocumentData() {
    const excelPath = path.join(__dirname, '../data/Document Update Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'Update Document'); // ✅ FIXED
  }

  static ImportData() {
    const excelPath = path.join(__dirname, '../data/Document Update Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'Import File'); // ✅ FIXED
  }

  static AppendToListData() {
    const excelPath = path.join(__dirname, '../data/Document Update Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'Append To List'); // ✅ FIXED
  }

  static IrcImportData() {
    const excelPath = path.join(__dirname, '../data/Document Update Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'IRC_ImportFile'); // ✅ FIXED
  }

  static WebResourcesData() {
    const excelPath = path.join(__dirname, '../data/Document Update Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'IRCWebResources'); // ✅ FIXED
  }
}

module.exports = DocumentData;
