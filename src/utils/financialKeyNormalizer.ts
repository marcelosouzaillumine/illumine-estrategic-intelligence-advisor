/**
 * centralized financial key normalizer utility.
 * ensures case-insensitive, accent-insensitive, and symbol-agnostic matching.
 */

export function normalizeKey(s: string): string {
  if (!s) return '';
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/^[0-9.]+\s*[-]\s*/, '') // remove leading outline numbers/dots like "1.1 - "
    .replace(/^[()=/\-+.\s]+|[()=/\-+.\s]+$/g, '') // remove leading/trailing symbols like (=), (+), (-)
    .trim();
}

export function isDocTypeDRE(docType: string): boolean {
  if (!docType) return false;
  const norm = docType.toLowerCase();
  return norm === 'dre' || norm === 'dre gerencial' || norm === 'dre contabil' || norm.includes('dre');
}

export function isDocTypeBP(docType: string): boolean {
  if (!docType) return false;
  const norm = docType.toLowerCase();
  return norm === 'bp' || norm === 'balanço patrimonial' || norm.includes('balan');
}

export function isDocTypeDFC(docType: string): boolean {
  if (!docType) return false;
  const norm = docType.toLowerCase();
  return norm === 'dfc' || norm.includes('fluxo de caixa');
}

export function isDocTypeDLPA(docType: string): boolean {
  if (!docType) return false;
  const norm = docType.toLowerCase();
  return norm === 'dlpa';
}

export function matchFinancialKey(categoryName: string, targetNames: string[]): boolean {
  const cat = normalizeKey(categoryName);
  if (!cat) return false;

  const normalizedTargets = targetNames.map(normalizeKey);

  return normalizedTargets.some(name => {
    if (!name) return false;
    
    // Generic terms safeguard:
    if (name === 'caixa' || name === 'banco' || name === 'bancos') {
      const hasExclusion = cat.includes('passivo') || 
                           cat.includes('emprestimo') || 
                           cat.includes('financiamento') || 
                           cat.includes('credito') || 
                           cat.includes('mutuo') || 
                           cat.includes('devedor') || 
                           cat.includes('pagar');
      if (hasExclusion) {
        return cat === name; // Only allow exact match
      }
    }
    
    return cat === name || cat.includes(name) || name.includes(cat);
  });
}
