const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

class ExcelUtils {
  
  static readExcelData(excelFilePath, sheetName) {
    // Resolve path relative to project root if not absolute
    const resolvedPath = path.isAbsolute(excelFilePath)
      ? excelFilePath
      : path.resolve(process.cwd(), excelFilePath);
    const dataList = [];
    let workbook = null;

    try {
      console.log(`📊 Reading Excel file: ${resolvedPath}, Sheet: ${sheetName}`);

      // Check if file exists
      if (!fs.existsSync(resolvedPath)) {
        console.error(`❌ Error: Excel file not found: ${resolvedPath}`);
        console.log(`💡 Tip: Place your Excel files in the 'data' folder at project root`);
        return [];
      }

      // Read the workbook
      workbook = XLSX.readFile(resolvedPath);

      // Check if sheet exists
      if (!workbook.Sheets[sheetName]) {
        console.error(`❌ Error: Sheet '${sheetName}' not found in workbook: ${resolvedPath}`);
        console.log(`Available sheets: ${Object.keys(workbook.Sheets).join(', ')}`);
        return [];
      }

      const sheet = workbook.Sheets[sheetName];
      
      // Convert sheet to JSON array (equivalent to reading rows)
      const jsonData = XLSX.utils.sheet_to_json(sheet, { 
        header: 1, // Use array of arrays instead of objects
        defval: '', // Default value for empty cells
        raw: false // Format values as strings
      });

      if (jsonData.length === 0) {
        console.log(`ℹ️ No physical rows found in sheet '${sheetName}'.`);
        return [];
      }

      // Get header row (equivalent to headerRow in Java)
      const headerRow = jsonData[0];
      if (!headerRow || headerRow.length === 0) {
        console.error(`❌ Error: Excel sheet seems empty or has no header row.`);
        return [];
      }

      const colCount = headerRow.length;
      if (colCount === 0) {
        console.log(`ℹ️ No physical cells found in header row of sheet '${sheetName}'.`);
        return [];
      }

      console.log(`📋 Found ${jsonData.length - 1} data rows with ${colCount} columns`);

      // Process data rows (start from index 1, skip header)
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        
        if (!row || this.isRowEmpty(row)) {
          continue;
        }

        // Ensure row has same number of columns as header
        const rowData = new Array(colCount);
        let hasNonEmptyCell = false;

        for (let j = 0; j < colCount; j++) {
          let value = row[j] || '';
          
          // Convert to string and trim (equivalent to formatter.formatCellValue)
          value = String(value).trim();
          
          // Handle time formatting (equivalent to your date/time logic)
          value = this.formatTimeIfNeeded(value);
          
          rowData[j] = value;
          
          if (value !== '') {
            hasNonEmptyCell = true;
          }
        }

        // Only add rows that have at least one non-empty cell
        if (hasNonEmptyCell) {
          dataList.push(rowData);
        }
      }

      console.log(`✅ Successfully read ${dataList.length} data rows from Excel`);
      return dataList;

    } catch (error) {
      console.error(`❌ Error reading Excel file: ${resolvedPath}. ${error.message}`);
      console.error(error.stack);
      return [];
    }
  }

  static isRowEmpty(row) {
    if (!row || row.length === 0) {
      return true;
    }

    for (let i = 0; i < row.length; i++) {
      const cell = row[i];
      if (cell !== null && cell !== undefined && String(cell).trim() !== '') {
        return false;
      }
    }
    return true;
  }

  static formatTimeIfNeeded(value) {
    try {
      // Check if value looks like a decimal time (Excel time format)
      if (typeof value === 'string' && value.includes('.') && !isNaN(parseFloat(value))) {
        const numValue = parseFloat(value);
        
        // Excel stores time as decimal (0.5 = 12:00:00)
        if (numValue >= 0 && numValue < 1) {
          const totalSeconds = Math.round(numValue * 24 * 60 * 60);
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          
          const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          console.log(`🕐 Converted time: ${value} → ${formattedTime}`);
          return formattedTime;
        }
      }
      
      // Check if value is already in time format (HH:mm:ss)
      if (typeof value === 'string' && /^\d{1,2}:\d{2}:\d{2}$/.test(value)) {
        return value;
      }
      
      return value;
    } catch (error) {
      console.warn(`⚠️ Warning: Error formatting time value '${value}'. Using original value. Error: ${error.message}`);
      return value;
    }
  }

  static getSheetNames(excelFilePath) {
    try {
      if (!fs.existsSync(excelFilePath)) {
        console.error(`❌ Error: Excel file not found: ${excelFilePath}`);
        return [];
      }

      const workbook = XLSX.readFile(excelFilePath);
      const sheetNames = Object.keys(workbook.Sheets);
      
      console.log(`📋 Available sheets in ${path.basename(excelFilePath)}: ${sheetNames.join(', ')}`);
      return sheetNames;
    } catch (error) {
      console.error(`❌ Error reading sheet names from: ${excelFilePath}. ${error.message}`);
      return [];
    }
  }

  static readExcelDataAsObjects(excelFilePath, sheetName) {
    try {
      console.log(`📊 Reading Excel as objects: ${excelFilePath}, Sheet: ${sheetName}`);

      if (!fs.existsSync(excelFilePath)) {
        console.error(`❌ Error: Excel file not found: ${excelFilePath}`);
        return [];
      }

      const workbook = XLSX.readFile(excelFilePath);

      if (!workbook.Sheets[sheetName]) {
        console.error(`❌ Error: Sheet '${sheetName}' not found in workbook: ${excelFilePath}`);
        return [];
      }

      const sheet = workbook.Sheets[sheetName];
      
      // Convert sheet to JSON objects
      const jsonData = XLSX.utils.sheet_to_json(sheet, {
        defval: '', // Default value for empty cells
        raw: false // Format values as strings
      });

      // Process each object to format time values
      const processedData = jsonData.map(row => {
        const processedRow = {};
        for (const [key, value] of Object.entries(row)) {
          processedRow[key] = this.formatTimeIfNeeded(String(value).trim());
        }
        return processedRow;
      });

      console.log(`✅ Successfully read ${processedData.length} data objects from Excel`);
      return processedData;
    } catch (error) {
      console.error(`❌ Error reading Excel file as objects: ${excelFilePath}. ${error.message}`);
      return [];
    }
  }

  static validateExcelFile(excelFilePath, sheetName) {
    try {
      if (!fs.existsSync(excelFilePath)) {
        console.error(`❌ Excel file not found: ${excelFilePath}`);
        return false;
      }

      const workbook = XLSX.readFile(excelFilePath);
      
      if (!workbook.Sheets[sheetName]) {
        console.error(`❌ Sheet '${sheetName}' not found. Available sheets: ${Object.keys(workbook.Sheets).join(', ')}`);
        return false;
      }

      console.log(`✅ Excel file and sheet validated successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Error validating Excel file: ${error.message}`);
      return false;
    }
  }

  static getExcelFileInfo(excelFilePath) {
    try {
      if (!fs.existsSync(excelFilePath)) {
        return { exists: false, error: 'File not found' };
      }

      const stats = fs.statSync(excelFilePath);
      const workbook = XLSX.readFile(excelFilePath);
      const sheetNames = Object.keys(workbook.Sheets);

      return {
        exists: true,
        fileName: path.basename(excelFilePath),
        filePath: excelFilePath,
        fileSize: stats.size,
        lastModified: stats.mtime,
        sheetCount: sheetNames.length,
        sheetNames: sheetNames
      };
    } catch (error) {
      return { exists: false, error: error.message };
    }
  }
}

module.exports = ExcelUtils;
