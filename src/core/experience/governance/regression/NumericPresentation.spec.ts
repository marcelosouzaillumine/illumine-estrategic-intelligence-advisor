import { describe, it, expect } from 'vitest';
import { ExecutiveFormattingService } from '../../../../capabilities/financial/intelligence/formatting/ExecutiveFormattingService';

describe('NumericPresentation', () => {
  it('should format percentage correctly without leaking raw float', () => {
    const rawValue = 0.28367423338969044;
    const formatted = ExecutiveFormattingService.formatPercentage(rawValue);
    
    expect(formatted).toBe('28,4%');
    expect(formatted).not.toContain('0.2836');
  });

  it('should format currency correctly', () => {
    const formatted = ExecutiveFormattingService.formatCurrency(1234567.89);
    // Em Node (ou browsers dependendo da locale) o toLocaleString('pt-BR') pode ter variações de no-break space.
    // Vamos checar apenas o formato básico esperado.
    expect(formatted.replace(/\s/g, ' ')).toContain('R$ 1.234.567,89');
  });
});
