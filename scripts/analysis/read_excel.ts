import * as xlsx from 'xlsx';
import * as fs from 'fs';

const filePath = '/Users/marcelosouza/Documents/illumine-strategic-governance-advisor/docs/Granatum_Balanco_DRE_2023.xlsx';

if (!fs.existsSync(filePath)) {
  console.log('File not found');
  process.exit(1);
}

const workbook = xlsx.readFile(filePath, { cellFormula: true });
console.log('Sheet Names:', workbook.SheetNames);

const dreSheetName = workbook.SheetNames.find(n => n.toLowerCase().includes('dre')) || workbook.SheetNames[0];
console.log('\n--- Reading Sheet:', dreSheetName, '---\n');

const sheet = workbook.Sheets[dreSheetName];
const range = xlsx.utils.decode_range(sheet['!ref'] || 'A1:A1');

for (let R = range.s.r; R <= range.e.r; ++R) {
  let rowStr = `Row ${R + 1}: `;
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cellAddress = xlsx.utils.encode_cell({ r: R, c: C });
    const cell = sheet[cellAddress];
    if (cell) {
      if (cell.f) {
         rowStr += `[${cellAddress}: Formula(${cell.f}) Value(${cell.v})] `;
      } else {
         rowStr += `[${cellAddress}: ${cell.v}] `;
      }
    }
  }
  if (rowStr.trim() !== `Row ${R + 1}:`) {
    console.log(rowStr);
  }
}
