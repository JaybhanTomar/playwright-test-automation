const path = require('path');
const ExcelUtils = require('../utils/ExcelUtils');

class CampaignCreationUpdationData {
  static CampaignCreationData() {
    const excelPath = path.join(__dirname, '../data/Campaign Creation Updation Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'Creation Data');
  }

  static CampaignModificationData() {
    const excelPath = path.join(__dirname, '../data/Campaign Creation Updation Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'Updation Data');
  }
}


module.exports = CampaignCreationUpdationData;
