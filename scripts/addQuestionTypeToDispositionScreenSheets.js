/**
 * Add QuestionType to DispositionScreenCreation sheets in Excel files.
 * Files: tests/data/RBL Test Data.xlsx, tests/data/Field Test Data.xlsx
 * Sheet: DispositionScreenCreation
 * Adds QuestionType with default "Main Question" when missing.
 */

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

function ensureQuestionTypeColumn(filePath, fileLabel) {
  console.log(`\n📝 Processing ${fileLabel}...`);
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return;
  }

  const wb = XLSX.readFile(filePath);
  const sheetName = 'DispositionScreenCreation';
  const ws = wb.Sheets[sheetName];
  if (!ws) {
    console.log(`⚠️ Sheet not found: ${sheetName} (skipping ${fileLabel})`);
    return;
  }

  // Read existing rows and headers
  const rows = XLSX.utils.sheet_to_json(ws);
  const headerRow = XLSX.utils.sheet_to_json(ws, { header: 1 })[0] || [];

  const hasDesc = headerRow.includes('Description');
  const hasQuestionType = headerRow.includes('QuestionType');

  console.log(`📋 Current headers in ${fileLabel}:`, headerRow);

  // Add QuestionType to each row if missing
  const updatedRows = rows.map(r => ({
    DispositionScreenName: r.DispositionScreenName || '',
    Type: r.Type || '',
    Category: r.Category || '',
    Question: r.Question || '',
    QuestionType: r.QuestionType || 'Main Question',
    ...(hasDesc ? { Description: r.Description || '' } : {})
  }));

  // Build new headers, placing QuestionType after Question
  const headers = ['DispositionScreenName', 'Type', 'Category', 'Question', 'QuestionType'];
  if (hasDesc) headers.push('Description');

  const newSheet = XLSX.utils.json_to_sheet(updatedRows, { header: headers });
  wb.Sheets[sheetName] = newSheet;

  // Backup before writing
  const backupPath = filePath.replace(/\.xlsx$/, '_withQuestionType_backup.xlsx');
  fs.copyFileSync(filePath, backupPath);
  console.log(`✅ Backup created: ${path.basename(backupPath)}`);

  XLSX.writeFile(wb, filePath);
  console.log(`✅ Updated ${fileLabel} with QuestionType column`);

  // Verify
  const wb2 = XLSX.readFile(filePath);
  const ws2 = wb2.Sheets[sheetName];
  const rows2 = XLSX.utils.sheet_to_json(ws2);
  const headers2 = XLSX.utils.sheet_to_json(ws2, { header: 1 })[0] || [];
  console.log(`🔎 New headers in ${fileLabel}:`, headers2);
  console.log(`🔢 Rows: ${rows2.length}; Sample:`, rows2[0]);
}

function main() {
  console.log('🚀 Adding QuestionType to DispositionScreenCreation sheets...');
  const rblPath = path.join(__dirname, '../tests/data/RBL Test Data.xlsx');
  const fieldPath = path.join(__dirname, '../tests/data/Field Test Data.xlsx');

  ensureQuestionTypeColumn(rblPath, 'RBL Test Data.xlsx');
  ensureQuestionTypeColumn(fieldPath, 'Field Test Data.xlsx');

  console.log('\n🎉 Completed adding QuestionType.');
}

if (require.main === module) {
  main();
}

module.exports = { ensureQuestionTypeColumn };
