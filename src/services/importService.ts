// Shared helpers are moved into functions to allow dynamic imports

// ─── Shared helpers ────────────────────────────────────────────────────────────

/** Converte string numérica no formato BR (1.234.567,89) ou US para número */
const parseBrNumber = (raw: string): number | null => {
  const s = raw.replace(/[R$\s]/g, '').trim();
  const negative = s.startsWith('(') && s.endsWith(')');
  const cleaned = s.replace(/[()]/g, '');
  
  let result: number;
  if (cleaned.includes(',') && cleaned.includes('.')) {
    // 1.234.567,89 → BR
    result = parseFloat(cleaned.replace(/\./g, '').replace(',', '.'));
  } else if (cleaned.includes(',')) {
    // 1.234,56 ou 1234,56 → BR
    result = parseFloat(cleaned.replace(/\./g, '').replace(',', '.'));
  } else if (cleaned.includes('.') && /\d\.\d{3}$/.test(cleaned)) {
    // 1.234 ou 1.234.567 → BR (ponto como milhar, sem decimais)
    result = parseFloat(cleaned.replace(/\./g, ''));
  } else {
    result = parseFloat(cleaned);
  }
  
  if (isNaN(result)) return null;
  return negative ? -result : result;
};

// ─── Financial entry type ─────────────────────────────────────────────────────
export interface FinancialEntry {
  category: string;
  value: number;
}

// ─── Financial PDF parser ─────────────────────────────────────────────────────
/**
 * Lê um PDF de demonstração financeira (BP, DRE, etc.) e retorna
 * pares { category, value }. Usa agrupamento por coordenada Y para
 * reconstituir as linhas e detecta valores numéricos BR ao final.
 */
export const parseFinancialPdf = async (
  file: File,
  onProgress?: (pct: number) => void
): Promise<FinancialEntry[]> => {
  const pdfjsLib = await import('pdfjs-dist');
  // @ts-ignore
  const pdfWorker = await import('pdfjs-dist/build/pdf.worker.mjs?url');
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker.default;

  const arrayBuffer = await file.arrayBuffer();
  if (onProgress) onProgress(5);
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const results: FinancialEntry[] = [];

  // Regex para encontrar valores numéricos BR ao final da linha
  // Aceita: 1.234,56  |  1.234.567,89  |  (1.234,56)  |  -1.234,56  |  1234
  const valueRegex = /[\(\-]?\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?\)?\s*$/;

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Agrupar itens de texto pela coordenada Y (mesma linha)
    const lineMap = new Map<number, { text: string; x: number }[]>();
    textContent.items.forEach((item: any) => {
      if (!item.str?.trim()) return;
      // Arredonda Y para agrupar itens na mesma linha (tolerância ±2px)
      const y = Math.round(item.transform[5] / 2) * 2;
      const x = item.transform[4];
      if (!lineMap.has(y)) lineMap.set(y, []);
      lineMap.get(y)!.push({ text: item.str, x });
    });

    // Ordenar linhas de cima para baixo (Y decrescente em PDF)
    const sortedYs = Array.from(lineMap.keys()).sort((a, b) => b - a);

    sortedYs.forEach(y => {
      // Ordenar itens da linha da esquerda para direita
      const items = lineMap.get(y)!.sort((a, b) => a.x - b.x);
      const lineText = items.map(i => i.text).join(' ').trim();
      if (!lineText) return;

      // Tentar extrair valor numérico ao final da linha
      const match = lineText.match(valueRegex);
      if (match) {
        const rawNum = match[0].trim();
        const value = parseBrNumber(rawNum);
        if (value !== null) {
          const category = lineText.slice(0, lineText.length - match[0].length).trim();
          if (category && category.length > 1) {
            results.push({ category, value });
            return;
          }
        }
      }

      // Fallback: a linha inteira como categoria sem valor (linha de título/grupo)
      // Só inclui se parece ser um nome de conta (não apenas números)
      if (!/^[\d.,()\s]+$/.test(lineText) && lineText.length > 2) {
        results.push({ category: lineText, value: 0 });
      }
    });

    if (onProgress) onProgress(5 + Math.round((pageNum / pdf.numPages) * 90));
  }

  return results;
};

// ─── Financial Excel/CSV parser ───────────────────────────────────────────────
/**
 * Lê Excel/CSV de demonstração financeira.
 * Coluna 0 = nome da conta, Coluna 1 = valor numérico.
 */
export const parseFinancialExcel = async (
  file: File,
  onProgress?: (pct: number) => void
): Promise<FinancialEntry[]> => {
  const XLSX = await import('xlsx');
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (onProgress) onProgress(40);
        const wb = XLSX.read(e.target?.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
        if (onProgress) onProgress(80);

        const results: FinancialEntry[] = [];
        rawData.forEach((row, idx) => {
          const cat = row[0]?.toString().trim();
          if (!cat) return;
          // Pula linha de cabeçalho
          if (idx === 0 && /conta|descri|nome|category/i.test(cat)) return;
          const rawVal = row[1];
          const value = rawVal !== undefined && rawVal !== null && rawVal !== ''
            ? (typeof rawVal === 'number' ? rawVal : (parseBrNumber(rawVal.toString()) ?? 0))
            : 0;
          results.push({ category: cat, value });
        });
        resolve(results);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });
};

// ─── Financial TXT parser ─────────────────────────────────────────────────────
/**
 * Lê arquivo TXT de demonstração financeira.
 * Detecta separadores automaticamente (tab, ;, , ou múltiplos espaços).
 * Coluna 0 = nome da conta, Coluna 1 = valor numérico.
 */
export const parseFinancialTxt = async (
  file: File,
  onProgress?: (pct: number) => void
): Promise<FinancialEntry[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/);
        const results: FinancialEntry[] = [];

        lines.forEach((line, idx) => {
          if (onProgress && idx % 50 === 0) onProgress(20 + Math.round((idx / lines.length) * 70));
          const trimmed = line.trim();
          if (!trimmed) return;

          let parts: string[];
          if (trimmed.includes('\t'))   parts = trimmed.split('\t');
          else if (trimmed.includes(';')) parts = trimmed.split(';');
          else {
            // Tenta dividir no último grupo numérico (valor ao final)
            const m = trimmed.match(/^(.+?)\s{2,}([\d.,()\-]+)\s*$/);
            if (m) {
              parts = [m[1], m[2]];
            } else {
              parts = trimmed.split(',');
            }
          }

          const category = parts[0]?.trim();
          if (!category) return;
          const rawVal = parts[1]?.trim();
          const value = rawVal ? (parseBrNumber(rawVal) ?? 0) : 0;
          results.push({ category, value });
        });

        resolve(results);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file, 'utf-8');
  });
};

export interface ImportedAccount {
  code: string;
  name: string;
  type: string;
}

export const parseExcel = async (file: File, onProgress?: (percent: number) => void): Promise<ImportedAccount[]> => {
  const XLSX = await import('xlsx');
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
        
        let codeCol = 0;
        let nameCol = 1;
        let headerFound = false;

        // Try to find the header in the first 10 rows
        for (let i = 0; i < Math.min(jsonData.length, 10); i++) {
          const row = jsonData[i];
          if (!row) continue;
          
          const foundCode = row.findIndex(c => String(c || '').toLowerCase().match(/código|conta|account|code/));
          const foundName = row.findIndex(c => String(c || '').toLowerCase().match(/nome|descrição|description|name/));
          
          if (foundCode !== -1 && foundName !== -1) {
            codeCol = foundCode;
            nameCol = foundName;
            headerFound = true;
            // Skip data processing for this row
            jsonData.splice(0, i + 1);
            break;
          }
        }

        // If no header found, we stick with 0 and 1 but check if row 0 looks like header
        if (!headerFound && jsonData.length > 0) {
          const col0 = String(jsonData[0][0] || '').toLowerCase();
          const col1 = String(jsonData[0][1] || '').toLowerCase();
          if (col0.includes('código') || col0.includes('conta') || col1.includes('nome') || col1.includes('descrição')) {
            jsonData.shift();
          }
        }

        jsonData.forEach((row) => {
          if (!row) return;
          const code = String(row[codeCol] || '').trim();
          const name = String(row[nameCol] || '').trim();

          if (code && name && code.trim().length > 0) {
            accounts.push({
              code,
              name: name.trim() || 'Sem nome',
              type: 'Pendente'
            });
          }
        });

        resolve(classifyAccounts(accounts));
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
            if (code && name && code.trim().length > 0) {
              accounts.push({
                code,
                name: name.trim() || 'Sem nome',
                type: 'Pendente'
              });
            }
          }
        });
        resolve(classifyAccounts(accounts));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const parsePdf = async (file: File, onProgress?: (percent: number) => void): Promise<ImportedAccount[]> => {
  const pdfjsLib = await import('pdfjs-dist');
  // @ts-ignore
  const pdfWorker = await import('pdfjs-dist/build/pdf.worker.mjs?url');
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker.default;

  const arrayBuffer = await file.arrayBuffer();
  if (onProgress) onProgress(10);
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // Group items by Y coordinate (same line) with a small tolerance (5px)
    const lineMap = new Map<number, { text: string; x: number }[]>();
    textContent.items.forEach((item: any) => {
      if (!item.str?.trim()) return;
      // Precision for line grouping - group items within 5px of each other
      const y = Math.floor(item.transform[5] / 5) * 5;
      const x = item.transform[4];
      if (!lineMap.has(y)) lineMap.set(y, []);
      lineMap.get(y)!.push({ text: item.str, x });
    });

    // Sort lines from top to bottom (Y descending in PDF)
    const sortedYs = Array.from(lineMap.keys()).sort((a, b) => b - a);
    sortedYs.forEach(y => {
      const items = lineMap.get(y)!.sort((a, b) => a.x - b.x);
      const lineText = items.map(it => it.text).join(' ').trim();
      if (lineText) fullText += lineText + '\n';
    });

    if (onProgress) {
      onProgress(10 + Math.round((i / pdf.numPages) * 80));
    }
  }

  const lines = fullText.split('\n');
  const accounts: ImportedAccount[] = [];
  
  // Pattern: Code (at least one digit/dot/hyphen/letter) followed by space and name
  // This is much more flexible to catch various account formats
  const pattern = /^([0-9.A-Z\-]{1,25})\s+(.+)$/;

  lines.forEach(line => {
    const match = line.trim().match(pattern);
    if (match) {
      const code = match[1];
      const name = match[2];
      accounts.push({
        code,
        name,
        type: 'Pendente'
      });
    }
  });

  return classifyAccounts(accounts);
};

export const parseDoc = async (file: File, onProgress?: (percent: number) => void): Promise<ImportedAccount[]> => {
  // Basic DOC parser: in a real app, this would use a library like mammoth or a backend service.
  // For this implementation, we provide a fallback message and try to read as text if it's actually text-based.
  if (onProgress) onProgress(50);
  
  // Try to read as text as a fallback (some legacy systems save CSV/TXT as .doc)
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text.includes('<?xml') || text.includes('PK\x03\x04')) {
        // This looks like a real DOCX or XML file, which we can't parse easily without libs
        alert('Arquivos .doc/.docx complexos requerem conversão para PDF ou Excel para melhor leitura. Tentando extração básica de texto...');
      }
      
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 5);
      const accounts: ImportedAccount[] = [];
      const pattern = /^([0-9.]{1,20})\s+(.+)$/;

        lines.forEach(line => {
        const match = line.trim().match(pattern);
        if (match) {
          accounts.push({
            code: match[1],
            name: match[2],
            type: 'Pendente'
          });
        }
      });
      resolve(classifyAccounts(accounts));
    };
    reader.readAsText(file);
  });
};

/**
 * Intelligent mapping: suggests accounting accounts for a managerial account based on name similarity
 */
export const suggestMapping = (managerialName: string, accountingAccounts: ImportedAccount[]): string[] => {
  const mName = managerialName.toLowerCase();
  return accountingAccounts
    .filter(acc => {
      const aName = acc.name.toLowerCase();
      return aName.includes(mName) || mName.includes(aName);
    })
    .map(acc => (acc as any).id)
    .filter(id => !!id);
};

/**
 * Inferred type from code and name, with root digit mapping
 */
export const inferType = (code: string, name: string, rootMap?: Record<string, string>): string => {
  const cleanName = name.toLowerCase().trim();
  const firstChar = code.charAt(0);
  const firstGroup = code.split('.')[0];

  // 1. Explicit group names (Level 1) - Highest priority
  if (cleanName === 'ativo') return 'Ativo';
  if (cleanName === 'passivo') return 'Passivo';
  
  const isPL = cleanName.includes('patrimônio líquido') || 
               cleanName.includes('patrimonio liquido') || 
               cleanName === 'pl' || 
               cleanName.includes('capital social') || 
               cleanName.includes('lucros ou prejuízos') || 
               cleanName.includes('lucros acumulados') || 
               cleanName.includes('prejuízos acumulados') || 
               cleanName.includes('distribuição de lucros') ||
               cleanName.includes('reservas de lucros');
               
  if (isPL) return 'Patrimônio Líquido';

  const isReceita = cleanName.startsWith('receitas') || 
                    cleanName.startsWith('receita bruta') || 
                    cleanName.includes('receita de vendas') || 
                    cleanName.includes('receitas operacionais') || 
                    cleanName.includes('faturamento');
  
  if (isReceita && !cleanName.includes('a receber') && !cleanName.includes('antecipada') && !cleanName.includes('deduções')) return 'Receitas';

  const isDespesa = cleanName.startsWith('despesa') || 
                    cleanName.includes('despesas operacionais') || 
                    cleanName.includes('custos e despesas') || 
                    cleanName.includes('despesas administrativas') ||
                    cleanName.includes('impostos sobre vendas') ||
                    cleanName.includes('deduções') ||
                    cleanName.includes('deducoes');

  if (isDespesa) return 'Despesas';

  const isCusto = cleanName.startsWith('custo') || 
                  cleanName.includes('custo das mercadorias') || 
                  cleanName.includes('custo dos serviços') ||
                  cleanName.includes('cpv') ||
                  cleanName.includes('cmv') ||
                  cleanName.includes('csp');
                  
  if (isCusto) return 'Despesas';

  if (cleanName.includes('resultado apurado') || 
      cleanName.includes('lucro/prejuízo') || 
      cleanName.includes('lucro líquido') ||
      cleanName.includes('demonstração do resultado')) return 'Resultado Apurado';

  // 2. Use discovered root map if available (matches by first character or first group)
  if (rootMap) {
    if (rootMap[firstGroup]) return rootMap[firstGroup];
    if (rootMap[firstChar]) return rootMap[firstChar];
  }

  // 3. Fallback standard mapping (based on first character)
  switch (firstChar) {
    case '1': return 'Ativo';
    case '2': return 'Passivo';
    case '3': return 'Patrimônio Líquido'; 
    case '4': return 'Receitas';
    case '5': return 'Despesas';
    case '6': return 'Resultado Apurado';
    default: return 'Despesas';
  }
};

/**
 * Processes a list of imported accounts to ensure subaccounts follow their root group's category.
 */
export const classifyAccounts = (accounts: ImportedAccount[]): ImportedAccount[] => {
  const rootMap: Record<string, string> = {};
  
  // 1. Identify roots by name (ANY level)
  // We sort accounts to find shortest codes first (potential roots)
  const sortedAccounts = [...accounts].sort((a, b) => a.code.length - b.code.length);
  
  sortedAccounts.forEach(acc => {
    const type = inferType(acc.code, acc.name);
    // Explicit matches for roots based on account name
    const isExplicitRoot = 
      acc.name.toLowerCase() === 'ativo' || 
      acc.name.toLowerCase() === 'passivo' || 
      acc.name.toLowerCase().includes('patrimônio líquido') || 
      acc.name.toLowerCase().includes('receitas') || 
      acc.name.toLowerCase().includes('despesas') ||
      acc.name.toLowerCase().includes('custos') ||
      acc.name.toLowerCase().includes('deduções') ||
      acc.name.toLowerCase().includes('impostos');

    if (isExplicitRoot) {
       rootMap[acc.code] = type;
       // If it's a single digit (1, 2, 3, 4), it defines the whole group
       if (acc.code.length === 1) {
         rootMap[acc.code.charAt(0)] = type;
       }
    }
  });

  // 2. Fallbacks for standard digits if not explicitly overridden by file roots
  const standardMapping: Record<string, string> = {
    '1': 'Ativo',
    '2': 'Passivo',
    '3': 'Patrimônio Líquido',
    '4': 'Receitas',
    '5': 'Despesas',
    '6': 'Resultado Apurado'
  };

  Object.entries(standardMapping).forEach(([digit, type]) => {
    if (!rootMap[digit]) rootMap[digit] = type;
  });

  // 3. Apply root map with highest priority (Group Integrity)
  const rootKeys = Object.keys(rootMap).sort((a, b) => b.length - a.length);

  return accounts.map(acc => {
    // Priority 1: Check if the name itself is an explicit group (level 1-2)
    const selfType = inferType(acc.code, acc.name);
    const isShortCode = acc.code.length <= 4;
    
    // Priority 2: Longest matching prefix from discovered roots
    const matchingRoot = rootKeys.find(rk => acc.code.startsWith(rk));
    
    // Logic: If it's a short code and name matches a category, use it (defines a new root).
    // Otherwise, follow the parent root's category.
    let finalType: string;
    if (isShortCode && ['Ativo', 'Passivo', 'Patrimônio Líquido', 'Receitas', 'Despesas', 'Resultado Apurado'].includes(selfType)) {
      finalType = selfType;
    } else {
      finalType = matchingRoot ? rootMap[matchingRoot] : selfType;
    }

    return { ...acc, type: finalType };
  });
};

export interface ImportedTransaction {
  entidade: string;
  documento: string;
  emissao: string;
  vencimento: string;
  valor: number;
  valorAberto?: number;
  status: string;
  categoria?: string;
  centroCusto?: string;
}

export const parseTransactionsExcel = async (file: File, onProgress?: (percent: number) => void): Promise<ImportedTransaction[]> => {
  const XLSX = await import('xlsx');
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (onProgress) onProgress(50);
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        if (onProgress) onProgress(100);

        const transactions: ImportedTransaction[] = [];
        
        let entCol = 0, docCol = 1, emiCol = 2, venCol = 3, valCol = 4, openCol = -1, staCol = 5, catCol = -1, ccCol = -1;
        let headerRowIndex = -1;

        if (jsonData.length > 0) {
           // Procura o cabeçalho nas primeiras 20 linhas
           for (let i = 0; i < Math.min(jsonData.length, 20); i++) {
             const rawRow = jsonData[i];
             if (!Array.isArray(rawRow)) continue;
             
             const row = rawRow.map(h => String(h || '').toLowerCase());
             if (row.some(h => h && typeof h === 'string' && (h.includes('fornecedor') || h.includes('cliente') || h.includes('nome') || h.includes('entidade') || h.includes('valor') || h.includes('venc') || h.includes('preço')))) {
                headerRowIndex = i;
                const header = row;
                
                const findIndex = (keywords: string[]) => {
                   // Tenta correspondência exata primeiro
                   let idx = header.findIndex(h => h && typeof h === 'string' && keywords.includes(h));
                   if (idx !== -1) return idx;
                   // Fallback para inclusão
                   idx = header.findIndex(h => h && typeof h === 'string' && keywords.some(k => h.includes(k)));
                   return idx !== -1 ? idx : undefined;
                 };
                
                entCol = findIndex(['fornecedor', 'cliente', 'nome', 'entidade', 'favorecido', 'pessoa', 'razão']) ?? 0;
                docCol = findIndex(['doc', 'nf', 'nota', 'título', 'id', 'referência']) ?? 1;
                emiCol = findIndex(['emi', 'lançamento', 'data']) ?? 2;
                venCol = findIndex(['venc', 'prazo']) ?? 3;
                openCol = findIndex(['aberto', 'saldo', 'pendente', 'líquido']) ?? -1;
                valCol = findIndex(['total', 'bruto', 'valor', 'quantia']) ?? 4;
                
                if (valCol === openCol && openCol !== -1) {
                   const betterVal = header.findIndex((h, idx) => 
                     idx !== openCol && (h.includes('valor') || h.includes('total')) && !h.includes('aberto')
                   );
                   if (betterVal !== -1) valCol = betterVal;
                }
                staCol = findIndex(['status', 'situa', 'pago', 'liquida']) ?? 5;
                catCol = findIndex(['cat', 'plano', 'conta', 'grupo', 'tipo']) ?? -1;
                ccCol = findIndex(['centro', 'custo', 'cc', 'unidade', 'filial']) ?? -1;
                break;
             }
           }

           // Se não achou cabeçalho por keywords, tenta o fallback de coluna numérica
           if (headerRowIndex === -1) {
             const sampleRow = jsonData.find((r, i) => i > 0 && Array.isArray(r) && r.some(c => typeof c === 'number' && c > 0));
             if (sampleRow && Array.isArray(sampleRow)) {
                const autoValCol = sampleRow.findIndex(c => typeof c === 'number' && c > 0);
                if (autoValCol !== -1) valCol = autoValCol;
             }
           }
        }

        jsonData.forEach((row, index) => {
          if (index <= headerRowIndex) return; // pular cabeçalho e lixo acima dele
          if (index === 0 && headerRowIndex === -1) return; // pular primeira linha se não detectou nada
          
          if (!row || row.length === 0) return;

          const entidade = String(row[entCol] || '').trim();
          
          // Ignorar linhas de total do Excel
          if (entidade.toLowerCase().includes('total')) return;

          const documento = String(row[docCol] || '').trim();
          
          let emissao = '';
          if (row[emiCol]) {
             if (typeof row[emiCol] === 'number') {
                const date = new Date(Math.round((row[emiCol] - 25569) * 86400 * 1000));
                emissao = date.toISOString().split('T')[0];
             } else {
                const parts = String(row[emiCol]).split(/[/-]/);
                if (parts.length === 3) {
                  emissao = parts[2].length === 4 ? `${parts[2]}-${parts[1]}-${parts[0]}` : String(row[emiCol]);
                }
             }
          }
          if (!emissao || emissao.includes('NaN')) emissao = '';

          let vencimento = '';
          if (row[venCol]) {
             if (typeof row[venCol] === 'number') {
                const date = new Date(Math.round((row[venCol] - 25569) * 86400 * 1000));
                vencimento = date.toISOString().split('T')[0];
             } else {
                const parts = String(row[venCol]).split(/[/-]/);
                if (parts.length === 3) {
                  vencimento = parts[2].length === 4 ? `${parts[2]}-${parts[1]}-${parts[0]}` : String(row[venCol]);
                }
             }
          }
          if (!vencimento || vencimento.includes('NaN')) vencimento = '';

          const rawVal = row[valCol];
          const valor = rawVal ? (typeof rawVal === 'number' ? rawVal : (parseBrNumber(String(rawVal)) ?? 0)) : 0;
          
          let valorAberto = valor;
          if (openCol !== -1 && row[openCol] !== undefined) {
             const rawOpen = row[openCol];
             valorAberto = typeof rawOpen === 'number' ? rawOpen : (parseBrNumber(String(rawOpen)) ?? valor);
          }
          
          let status = String(row[staCol] || '').trim();
          const todayIso = new Date().toISOString().split('T')[0];
          
          // Se o status for vazio ou não for 'Pago', recalculamos com base na data
          if (!status || status.toLowerCase() !== 'pago') {
             if (vencimento && vencimento < todayIso) {
                status = 'Em atraso';
             } else {
                status = status || 'A vencer';
             }
          } else {
             const sLower = status.toLowerCase();
             if (sLower.includes('pago') || sLower.includes('recebido') || sLower.includes('liquid')) status = 'Pago';
             else if (sLower.includes('atraso') || sLower.includes('vencid')) status = 'Em atraso';
             else status = 'A vencer';
          }

          const categoria = catCol !== -1 ? String(row[catCol] || '').trim() : '';
          const centroCusto = ccCol !== -1 ? String(row[ccCol] || '').trim() : '';

          // Validação flexível: precisa de algum valor. Se entidade for vazia, chamamos de 'Desconhecido'
          if (valor !== null && typeof valor === 'number' && !Number.isNaN(valor)) {
            const finalEntidade = entidade && entidade !== 'undefined' ? entidade : 'Desconhecido';
            transactions.push({ 
              entidade: finalEntidade, 
              documento, emissao, vencimento, valor, valorAberto, status, categoria, centroCusto 
            });
          }
        });
        resolve(transactions);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const parseTransactionsPdf = async (file: File, onProgress?: (percent: number) => void): Promise<ImportedTransaction[]> => {
  const pdfjsLib = await import('pdfjs-dist');
  // @ts-ignore
  const pdfWorker = await import('pdfjs-dist/build/pdf.worker.mjs?url');
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker.default;

  const arrayBuffer = await file.arrayBuffer();
  if (onProgress) onProgress(10);
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const transactions: ImportedTransaction[] = [];

  const dateRegex = /\b(\d{2}[\/\-]\d{2}[\/\-]\d{2,4})\b/g;
  const valueRegex = /[\(\-]?(?:R\$\s*)?\b\d{1,3}(?:\.\d{3})*,\d{2}\b\)?/;

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    const lineMap = new Map<number, { text: string; x: number }[]>();
    textContent.items.forEach((item: any) => {
      if (!item.str?.trim()) return;
      const y = Math.round(item.transform[5] / 2) * 2;
      const x = item.transform[4];
      if (!lineMap.has(y)) lineMap.set(y, []);
      lineMap.get(y)!.push({ text: item.str, x });
    });

    const sortedYs = Array.from(lineMap.keys()).sort((a, b) => b - a);
    
    sortedYs.forEach(y => {
      const items = lineMap.get(y)!.sort((a, b) => a.x - b.x);
      const lineText = items.map(i => i.text).join(' ').trim();
      
      if (!lineText) return;

      const dates = lineText.match(dateRegex);
      const valueMatch = lineText.match(valueRegex);

      if (valueMatch) {
         const rawVal = valueMatch[0];
         const valor = parseBrNumber(rawVal);
         
         if (valor && valor > 0) {
            if (dates && dates.length > 0) {
               const dateStr = dates[dates.length - 1];
               const parts = dateStr.split(/[\/\-]/);
               let year = parts[2];
               if (year.length === 2) year = '20' + year;
               const vencimento = `${year}-${parts[1]}-${parts[0]}`;
               
               let emissao = vencimento;
               if (dates.length > 1) {
                  const eParts = dates[0].split(/[\/\-]/);
                  let eYear = eParts[2];
                  if (eYear.length === 2) eYear = '20' + eYear;
                  emissao = `${eYear}-${eParts[1]}-${eParts[0]}`;
               }

               let entidade = lineText
                 .replace(rawVal, '')
                 .replace(dateRegex, '')
                 .replace(/^[^\w]+|[^\w]+$/g, '')
                 .trim();
                 
               if (!entidade || entidade.length < 2) entidade = '';

               const status = '';

               transactions.push({
                 entidade: entidade.substring(0, 50),
                 documento: '',
                 emissao,
                 vencimento,
                 valor,
                 status
               });
            }
         }
      }
    });

    if (onProgress) onProgress(10 + Math.round((pageNum / pdf.numPages) * 80));
  }

  return transactions;
};
// ─── Bank Statement Parsers ───────────────────────────────────────────────────

export interface BankTransaction {
  date: string;
  description: string;
  amount: number;
}

/** Parse OFX (Open Financial Exchange) bank statements */
export const parseBankStatementOfx = async (file: File): Promise<BankTransaction[]> => {
  const text = await file.text();
  const transactions: BankTransaction[] = [];
  
  // Find all <STMTTRN> blocks
  const stmttrnRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/g;
  let match;
  
  while ((match = stmttrnRegex.exec(text)) !== null) {
    const block = match[1];
    
    // Extract fields
    const dateMatch = block.match(/<DTPOSTED>(\d{8})/);
    const amountMatch = block.match(/<TRNAMT>([\-\d.]+)/);
    const memoMatch = block.match(/<MEMO>([^<\r\n]+)/) || block.match(/<NAME>([^<\r\n]+)/);
    
    if (dateMatch && amountMatch) {
      const rawDate = dateMatch[1]; // YYYYMMDD
      const date = `${rawDate.substring(0, 4)}-${rawDate.substring(4, 6)}-${rawDate.substring(6, 8)}`;
      const amount = parseFloat(amountMatch[1]);
      const description = memoMatch ? memoMatch[1].trim() : "Transação Bancária";
      
      transactions.push({ date, description, amount });
    }
  }
  
  return transactions;
};

/** Specialized Excel parser for bank statements */
export const parseBankStatementExcel = async (file: File): Promise<BankTransaction[]> => {
  const XLSX = await import('xlsx');
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
        
        const transactions: BankTransaction[] = [];
        
        // Find columns: Date, Description, Amount
        let dateCol = -1, descCol = -1, amountCol = -1;
        
        for (let i = 0; i < Math.min(jsonData.length, 20); i++) {
          const row = jsonData[i].map(c => String(c || '').toLowerCase());
          if (row.some(c => c.includes('data') || c.includes('venc') || c.includes('hist') || c.includes('desc') || c.includes('valor') || c.includes('saldo'))) {
            dateCol = row.findIndex(c => c.includes('data') || c.includes('venc'));
            descCol = row.findIndex(c => c.includes('hist') || c.includes('desc') || c.includes('operac'));
            amountCol = row.findIndex(c => c.includes('valor') || c.includes('quantia') || c.includes('importe'));
            if (dateCol !== -1 && amountCol !== -1) {
               jsonData.splice(0, i + 1);
               break;
            }
          }
        }
        
        jsonData.forEach(row => {
          if (!row || row.length === 0) return;
          
          let date = '';
          if (row[dateCol]) {
            if (typeof row[dateCol] === 'number') {
              const d = new Date(Math.round((row[dateCol] - 25569) * 86400 * 1000));
              date = d.toISOString().split('T')[0];
            } else {
              const s = String(row[dateCol]);
              const parts = s.split(/[/-]/);
              if (parts.length === 3) date = parts[2].length === 4 ? `${parts[2]}-${parts[1]}-${parts[0]}` : s;
            }
          }
          
          const rawAmt = row[amountCol];
          const amount = typeof rawAmt === 'number' ? rawAmt : (parseBrNumber(String(rawAmt || '')) || 0);
          const description = String(row[descCol] || 'Transação').trim();
          
          if (date && amount !== 0) {
            transactions.push({ date, description, amount });
          }
        });
        
        resolve(transactions);
      } catch (err) { reject(err); }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

/** Specialized PDF parser for bank statements */
export const parseBankStatementPdf = async (file: File): Promise<BankTransaction[]> => {
  const pdfjsLib = await import('pdfjs-dist');
  // @ts-ignore
  const pdfWorker = await import('pdfjs-dist/build/pdf.worker.mjs?url');
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker.default;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const transactions: BankTransaction[] = [];
  
  const dateRegex = /\b(\d{2}[\/\-]\d{2}[\/\-]\d{2,4})\b/;
  const valueRegex = /[\(\-]?\d{1,3}(?:\.\d{3})*,\d{2}\b\)?/;
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    const lineMap = new Map<number, string>();
    textContent.items.forEach((item: any) => {
      const y = Math.round(item.transform[5]);
      lineMap.set(y, (lineMap.get(y) || '') + ' ' + item.str);
    });
    
    const sortedYs = Array.from(lineMap.keys()).sort((a, b) => b - a);
    sortedYs.forEach(y => {
      const line = lineMap.get(y)!;
      const dateMatch = line.match(dateRegex);
      const valueMatch = line.match(valueRegex);
      
      if (dateMatch && valueMatch) {
        const parts = dateMatch[1].split(/[/-]/);
        const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
        const date = `${year}-${parts[1]}-${parts[0]}`;
        const amount = parseBrNumber(valueMatch[0]) || 0;
        const description = line.replace(dateMatch[0], '').replace(valueMatch[0], '').trim();
        
        if (amount !== 0) {
          transactions.push({ date, description, amount });
        }
      }
    });
  }
  
  return transactions;
};

/** Specialized TXT parser for bank statements */
export const parseBankStatementTxt = async (file: File): Promise<BankTransaction[]> => {
  const text = await file.text();
  const lines = text.split(/\r?\n/);
  const transactions: BankTransaction[] = [];
  
  const dateRegex = /\b(\d{2}[\/\-]\d{2}[\/\-]\d{2,4})\b/;
  
  lines.forEach(line => {
    const dateMatch = line.match(dateRegex);
    if (dateMatch) {
      const parts = dateMatch[1].split(/[/-]/);
      const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
      const date = `${year}-${parts[1]}-${parts[0]}`;
      
      const rest = line.replace(dateMatch[0], '').trim();
      const valueMatch = rest.match(/[\(\-]?\d{1,3}(?:\.\d{3})*,\d{2}\b\)?/);
      
      if (valueMatch) {
        const amount = parseBrNumber(valueMatch[0]) || 0;
        const description = rest.replace(valueMatch[0], '').trim();
        if (amount !== 0) {
          transactions.push({ date, description, amount });
        }
      }
    }
  });
  
  return transactions;
};
