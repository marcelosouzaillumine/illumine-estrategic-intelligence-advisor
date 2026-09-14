export class DisplayValueFormatter {
  public static formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
  }

  public static formatPercentage(value: number, decimals: number = 1): string {
    return new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value / 100);
  }

  public static formatRatio(value: number, decimals: number = 2): string {
    return `${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value)}x`;
  }

  public static formatDays(value: number): string {
    return `${Math.round(value)} dias`;
  }

  public static formatIndex(value: number, decimals: number = 2): string {
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
  }

  public static formatNumber(value: number, decimals: number = 2): string {
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
  }
}
