import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let activeCurrency = 'BRL';

export function setActiveCurrency(code: string) {
  activeCurrency = code;
}

export function formatCurrency(value: number, currencyCode: string = activeCurrency) {
  const symbols: Record<string, string> = {
    'BRL': 'R$',
    'USD': '$',
    'EUR': '€',
    'GBP': '£'
  };
  const symbol = symbols[currencyCode] || currencyCode;

  const formattedNumber = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return `${symbol}\u00A0${formattedNumber}`;
}

export function formatDate(date: string | Date) {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR');
}

export function formatValue(val: number, un: string, currencyCode: string = activeCurrency) {
  if (un === 'R$' || un === 'BRL' || un === 'USD' || un === 'EUR' || un === 'GBP' || un === 'currency') {
    return formatCurrency(val, currencyCode);
  }
  if (un === '%') {
    // Standardize: if value is < 1 (e.g. 0.242), multiply by 100. If > 1, assume it's already a percentage.
    const displayVal = (val > -1 && val < 1) ? val * 100 : val;
    return displayVal.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
  }
  if (un === 'x') return val.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + 'x';
  if (un === 'dias') return Math.floor(val).toLocaleString('pt-BR') + '\u00A0dias';
  
  // Absolute numbers: No decimals
  return Math.floor(val).toLocaleString('pt-BR');
}

export function calculateVPL(flows: number[], rate: number) {
  return flows.reduce((acc, flow, i) => acc + flow / Math.pow(1 + rate, i), 0);
}

export function calculateTIR(flows: number[]): number {
  let guest = 0.1;
  const TOLERANCE = 0.0001;
  const MAX_ITER = 100;

  for (let i = 0; i < MAX_ITER; i++) {
    let npv = 0;
    let dNPV = 0;
    for (let t = 0; t < flows.length; t++) {
      npv += flows[t] / Math.pow(1 + guest, t);
      dNPV -= t * flows[t] / Math.pow(1 + guest, t + 1);
    }
    if (Math.abs(dNPV) < 1e-10) break;
    const newGuest = guest - npv / dNPV;
    if (Math.abs(newGuest - guest) < TOLERANCE) return newGuest;
    guest = newGuest;
  }
  return guest;
}

export function calculatePayback(flows: number[]) {
  let cumulative = 0;
  for (let i = 0; i < flows.length; i++) {
    cumulative += flows[i];
    if (cumulative >= 0) {
      if (i === 0) return 0;
      const prevCumulative = cumulative - flows[i];
      const fraction = Math.abs(prevCumulative) / flows[i];
      return i + fraction - 1;
    }
  }
  return null;
}

export function validateCNPJ(cnpj: string) {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj.length !== 14 || !!cnpj.match(/(\d)\1{13}/)) return false;
  let length = cnpj.length - 2;
  let numbers = cnpj.substring(0, length);
  const digits = cnpj.substring(length);
  let sum = 0;
  let pos = length - 7;
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;
  length = length + 1;
  numbers = cnpj.substring(0, length);
  sum = 0;
  pos = length - 7;
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;
  return true;
}

export function validateCPF(cpf: string) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  let s = 0;
  for (let i = 0; i < 9; i++) s += parseInt(cpf.charAt(i)) * (10 - i);
  let r = 11 - (s % 11);
  if (r === 10 || r === 11) r = 0;
  if (r !== parseInt(cpf.charAt(9))) return false;
  s = 0;
  for (let i = 0; i < 10; i++) s += parseInt(cpf.charAt(i)) * (11 - i);
  r = 11 - (s % 11);
  if (r === 10 || r === 11) r = 0;
  if (r !== parseInt(cpf.charAt(10))) return false;
  return true;
}

export function formatDoc(doc: string) {
  const clean = doc.replace(/\D/g, '');
  if (clean.length === 11) {
    return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  if (clean.length === 14) {
    return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }
  return doc;
}

export function getThemeColors() {
  const isDark = typeof document !== 'undefined' && (
    document.documentElement.classList.contains('dark') || 
    document.body.classList.contains('dark')
  );

  if (isDark) {
    return {
      primary: '#FF8552',
      secondary: '#BAB86C',
      tertiary: '#BAB86C',
      success: '#10b981', // high contrast green
      border: 'rgba(255, 255, 255, 0.1)',
      mutedForeground: '#E5E5E5',
      cardBg: '#111F30',
      cardFg: '#FFFFFF'
    };
  }

  // Light Mode (default)
  return {
    primary: '#0E1C2C',
    secondary: '#FF8552',
    tertiary: '#BAB86C',
    success: '#0C7A3A',
    border: '#E2E8F0', // slate-200 for clean premium division lines
    mutedForeground: '#64748B', // slate-500 for excellent contrast (meets WCAG AA)
    cardBg: '#FFFFFF',
    cardFg: '#0E1C2C'
  };
}
