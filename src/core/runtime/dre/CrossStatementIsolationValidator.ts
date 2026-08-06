/**
 * CrossStatementIsolationValidator
 * 
 * Garante que a DRE não emita recomendações oriundas de liquidez, caixa,
 * capital de giro, endividamento ou qualquer outro demonstrativo.
 * 
 * A DRE é exclusivamente responsável por: Receita, Margem, Estrutura,
 * Break-even, Escala e Resultado.
 */

const BLOCKED_DRE_TERMS = [
  // Liquidez e Caixa (domínio do DFC/BP)
  'liquidez', 'caixa', 'runway', 'fluxo de caixa', 'cash', 'tesouraria',
  'capital de giro', 'ciclo financeiro', 'ciclo médio',
  // Endividamento (domínio do BP)
  'endividamento', 'dívida', 'financiamento', 'empréstimo', 'captação',
  'amortização', 'covenants',
  // Estoque (domínio do BP/DFC)
  'estoque', 'inventário', 'giro de estoque',
  // Fornecedores (domínio do BP)
  'fornecedores', 'contas a pagar', 'contas a receber',
  // Outros demonstrativos
  'patrimônio líquido', 'ativo total', 'passivo total',
];

const ALLOWED_DRE_DOMAINS = [
  'receita', 'margem', 'estrutura', 'break-even', 'equilíbrio', 'escala',
  'resultado', 'lucro', 'prejuízo', 'ebitda', 'custo', 'despesa', 'administrativo',
  'operacional', 'contribuição', 'cobertura', 'absorção', 'faturamento',
  'preço', 'volume', 'mix', 'eficiência comercial', 'estrutura fixa',
];

export interface CrossStatementValidationResult {
  isValid: boolean;
  blockedTerms: string[];
  recommendations: string[];
}

export class CrossStatementIsolationValidator {
  /**
   * Valida que uma narrativa ou recomendação pertence ao domínio da DRE.
   */
  public static validateDRERecommendation(text: string): CrossStatementValidationResult {
    const lowerText = text.toLowerCase();
    const blockedTerms = BLOCKED_DRE_TERMS.filter(term => lowerText.includes(term.toLowerCase()));
    const isValid = blockedTerms.length === 0;

    const recommendations = blockedTerms.map(term =>
      `Termo "${term}" pertence ao domínio de Liquidez/Caixa/Balanço. Redirecionar para DFC ou BP.`
    );

    return { isValid, blockedTerms, recommendations };
  }

  /**
   * Filtra recomendações de um array, removendo as que violam o isolamento da DRE.
   */
  public static filterDRERecommendations(items: string[]): string[] {
    return items.filter(item => {
      const { isValid } = this.validateDRERecommendation(item);
      return isValid;
    });
  }

  /**
   * Verifica se uma recomendação pertence ao domínio DRE (receita/margem/estrutura).
   */
  public static isWithinDREDomain(text: string): boolean {
    const lowerText = text.toLowerCase();
    return ALLOWED_DRE_DOMAINS.some(domain => lowerText.includes(domain));
  }
}
