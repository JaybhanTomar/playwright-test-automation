const path = require('path');
const ExcelUtils = require('../utils/ExcelUtils');

class RBLAdminData {
  // Category Data Methods
  static CategoryCreationData() {
    const excelPath = path.join(__dirname, '../data/RBL Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'CategoryCreation');
  }

  static CategoryUpdationData() {
    const excelPath = path.join(__dirname, '../data/RBL Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'CategoryUpdation');
  }

  // Skill Data Methods
  static SkillCreationData() {
    const excelPath = path.join(__dirname, '../data/RBL Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'SkillCreation');
  }

  static SkillUpdationData() {
    const excelPath = path.join(__dirname, '../data/RBL Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'SkillUpdation');
  }

  // Field Data Methods
  static FieldCreationData() {
    const excelPath = path.join(__dirname, '../data/RBL Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'FieldCreation');
  }

  static FieldUpdationData() {
    const excelPath = path.join(__dirname, '../data/RBL Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'FieldUpdation');
  }

  // Lead Field Data Methods
  static LeadFieldCreationData() {
    const excelPath = path.join(__dirname, '../data/RBL Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'LeadFieldCreation');
  }

  static LeadFieldUpdationData() {
    const excelPath = path.join(__dirname, '../data/RBL Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'LeadFieldUpdation');
  }

  // Lead Stage Data Methods
  static LeadStageCreationData() {
    const excelPath = path.join(__dirname, '../data/RBL Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'LeadStageCreation');
  }

  static LeadStageUpdationData() {
    const excelPath = path.join(__dirname, '../data/RBL Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'LeadStageUpdation');
  }

  // Lead Status Data Methods
  static LeadStatusCreationData() {
    const excelPath = path.join(__dirname, '../data/RBL Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'LeadStatusCreation');
  }

  static LeadStatusUpdationData() {
    const excelPath = path.join(__dirname, '../data/RBL Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'LeadStatusUpdation');
  }

  // Lead Lost Reason Data Methods
  static LeadLostReasonCreationData() {
    const excelPath = path.join(__dirname, '../data/RBL Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'LeadLostReasonCreation');
  }

  static LeadLostReasonUpdationData() {
    const excelPath = path.join(__dirname, '../data/RBL Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'LeadLostReasonUpdation');
  }

  // Disposition Question Data Methods
  static DispositionQuestionCreationData() {
    // Use the single Excel file provided by user
    const excelPath = path.join(__dirname, '../data/RBL Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'DispositionQuestionCreation');
  }

  static DispositionQuestionUpdationData() {
    // Use the single Excel file provided by user
    const excelPath = path.join(__dirname, '../data/RBL Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'DispositionQuestionUpdation');
  }

  // Disposition Screen Data Methods
  static DispositionScreenCreationData() {
    // Use the single Excel file provided by user
    const excelPath = path.join(__dirname, '../data/RBL Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'DispositionScreenCreation');
  }

  static DispositionScreenUpdationData() {
    // Use the single Excel file provided by user
    const excelPath = path.join(__dirname, '../data/RBL Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'DispositionScreenUpdation');
  }
}

module.exports = RBLAdminData;
