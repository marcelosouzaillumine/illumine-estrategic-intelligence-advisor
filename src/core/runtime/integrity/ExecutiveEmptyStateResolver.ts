export class ExecutiveEmptyStateResolver {
  public static readonly EMPTY_CYCLE = 'Nenhum lançamento identificado para o exercício selecionado.';
  public static readonly INSUFFICIENT_HISTORY = 'Histórico insuficiente para análise evolutiva.';
  public static readonly METRIC_UNAVAILABLE = 'Indicador indisponível por insuficiência estrutural de dados.';

  public static resolve(type: 'EMPTY_CYCLE' | 'INSUFFICIENT_HISTORY' | 'METRIC_UNAVAILABLE'): string {
    switch (type) {
      case 'EMPTY_CYCLE':
        return this.EMPTY_CYCLE;
      case 'INSUFFICIENT_HISTORY':
        return this.INSUFFICIENT_HISTORY;
      case 'METRIC_UNAVAILABLE':
        return this.METRIC_UNAVAILABLE;
      default:
        return 'Dados indisponíveis.';
    }
  }
}
