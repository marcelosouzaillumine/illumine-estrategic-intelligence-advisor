import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export interface ImportedAccount {
  code: string;
  name: string;
  type: string;
}

export const parseExcel = async (file: File, onProgress?: (percent: number) => void): Promise<ImportedAccount[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (onProgress) onProgress(50);
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        if (onProgress) onProgress(100);

        const accounts: ImportedAccount[] = [];
        
        // Skip header if necessary and look for code/name
        // We assume column 0 is code and column 1 is name, or search for headers
        let codeCol = 0;
        let nameCol = 1;

        jsonData.forEach((row, index) => {
          if (index === 0) {
            // Check if first row is header
            const col0 = String(row[0] || '').toLowerCase();
            const col1 = String(row[1] || '').toLowerCase();
            if (col0.includes('código') || col0.includes('conta') || col1.includes('nome') || col1.includes('descrição')) {
              return; // skip header
            }
          }

          const code = String(row[codeCol] || '').trim();
          const name = String(row[nameCol] || '').trim();

          if (code && name) {
            accounts.push({
              code,
              name,
              type: inferTypeFromCode(code)
            });
          }
        });

        resolve(accounts);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const parseTxt = async (file: File, onProgress?: (percent: number) => void): Promise<ImportedAccount[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (onProgress) onProgress(20);
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/);
        const accounts: ImportedAccount[] = [];

        lines.forEach((line, index) => {
          if (onProgress && index % 100 === 0) {
            onProgress(20 + Math.round((index / lines.length) * 80));
          }
          // Detect separator: tab, semicolon, comma
          let parts: string[] = [];
          if (line.includes('\t')) parts = line.split('\t');
          else if (line.includes(';')) parts = line.split(';');
          else if (line.includes(',')) parts = line.split(',');
          else {
            // Try fixed width or space if just two parts
            parts = line.split(/\s{2,}/);
            if (parts.length < 2) parts = line.split(' ');
          }

          if (parts.length >= 2) {
            const code = parts[0].trim();
            const name = parts[1].trim();
            if (code && name && code.match(/^[0-9.]+$/)) {
              accounts.push({
                code,
                name,
                type: inferTypeFromCode(code)
              });
            }
          }
        });
        resolve(accounts);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const parsePdf = async (file: File, onProgress?: (percent: number) => void): Promise<ImportedAccount[]> => {
  const arrayBuffer = await file.arrayBuffer();
  if (onProgress) onProgress(10);
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n';
    if (onProgress) {
      // PDF processing takes 10-90% of the bar
      onProgress(10 + Math.round((i / pdf.numPages) * 80));
    }
  }

  // Very basic regex-based parsing for accounts like "1.01.01.001 Account Name"
  const lines = fullText.split('\n');
  const accounts: ImportedAccount[] = [];
  
  // Pattern: Code (numbers and dots) followed by space and name
  const pattern = /^([0-9.]+)\s+(.+)$/;

  lines.forEach(line => {
    const match = line.trim().match(pattern);
    if (match) {
      const code = match[1];
      const name = match[2];
      accounts.push({
        code,
        name,
        type: inferTypeFromCode(code)
      });
    }
  });

  return accounts;
};

const inferTypeFromCode = (code: string): string => {
  const firstDigit = code.charAt(0);
  switch (firstDigit) {
    case '1': return 'Ativo';
    case '2': return 'Passivo'; // or PL
    case '3': return 'Patrimônio Líquido'; // This varies by chart, but standard usually puts 2 as Passivo/PL
    case '4': return 'Receita';
    case '5': return 'Custo';
    case '6': return 'Despesa';
    default: return 'Despesa';
  }
};
