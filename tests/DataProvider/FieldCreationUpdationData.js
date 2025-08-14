const path = require('path');
const ExcelUtils = require('../utils/ExcelUtils');

class SystemSetupData { 
  static FieldCreationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'FieldCreation');
  }

  static FieldUpdationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'FieldUpdation');
  }

  static CategoryCreationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'CategoryCreation');
  }

  static CategoryUpdationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'CategoryUpdation');
  }

  static SkillCreationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'SkillCreation');
  }

  static SkillUpdationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'SkillUpdation');
  }

  static LeadFieldCreationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'LeadFieldCreation');
  }
  static LeadFieldUpdationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'LeadFieldUpdation');
  }

  static LeadStageCreationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'LeadStageCreation');
  }

  static LeadStageUpdationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'LeadStageUpdation');
  }
  
  static LeadStatusCreationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'LeadStatusCreation');
  }

  static LeadStatusUpdationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'LeadStatusUpdation');
  }

  static LeadLostReasonCreationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'LeadLostReasonCreation');
  }

  static LeadLostReasonUpdationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'LeadLostReasonUpdation');
  }


  static IRCFieldCreationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'IRCFieldCreation');
  }

  static IRCFieldUpdationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx'); 
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'IRCFieldUpdation');
  }

  static JDTemplateCreationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'JDTemplatesCreation');
  }

  static JDTemplateUpdationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'JDTemplatesUpdation');
  }

  // Ticket Field Data Methods
  static TicketFieldCreationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'TicketFieldCreation');
  }

  static TicketFieldUpdationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'TicketFieldUpdation');
  }

  static TicketTypeCreationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'TicketTypeCreation');
  }

  static TicketTypeUpdationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'TicketTypeUpdation');
  }

  static TicketPriorityCreationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'TicketPriorityCreation');
  }

  static TicketPriorityUpdationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'TicketPriorityUpdation');
  }

  static TicketStageCreationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'TicketStageCreation');
  }

  static TicketStageUpdationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'TicketStageUpdation');
  }

  // For Dispositions
  static DispositionQuestionCreationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'DispositionQuestionCreation');
  }

  static DispositionQuestionUpdationData() {
    const excelPath = path.join(__dirname, '../data/Field Test Data.xlsx');
    return ExcelUtils.readExcelDataAsObjects(excelPath, 'DispositionQuestionUpdation');
  }
  
}

module.exports = SystemSetupData;