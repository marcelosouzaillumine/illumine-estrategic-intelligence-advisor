import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: string | Date) {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR');
}

export function formatValue(val: number, un: string) {
  if (un === 'R$') return formatCurrency(val);
  if (un === '%') return (val * 100).toFixed(1) + '%';
  if (un === 'x') return val.toFixed(2) + 'x';
  if (un === 'dias') return val.toFixed(1) + ' dias';
  return val.toLocaleString('pt-BR');
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
