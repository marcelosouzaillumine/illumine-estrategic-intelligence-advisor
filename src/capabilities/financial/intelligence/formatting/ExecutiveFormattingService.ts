export class ExecutiveFormattingService {
  static formatPercentage(decimalValue: number): string {
    if (isNaN(decimalValue)) return '-';
    return (decimalValue * 100).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
  }

  static formatCurrency(value: number): string {
    if (isNaN(value)) return '-';
    return 'R$ ' + value.toLocaleString('pt-BR');
  }

  static formatIndex(value: number): string {
    if (isNaN(value)) return '-';
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
