/**
 * Contrato de Evidência Financeira Rastreável
 */
export interface FinancialEvidenceContract {
  /**
   * Tipo da evidência. (Ex: 'FACT', 'INTERPRETATION', 'HYPOTHESIS')
   * Permite que a inteligência demonstre o nível de abstração da afirmação.
   */
  level: 'FACT' | 'INTERPRETATION' | 'HYPOTHESIS';

  /**
   * Grau de confiança na afirmação.
   * Fatos matemáticos possuem 100%. Hipóteses causais dependem de contexto (ex: 45%).
   */
  confidence: number;

  /**
   * O texto da evidência (Ex: 'O patrimônio líquido reduziu R$13 milhões entre 2023 e 2025.')
   */
  description: string;

  /**
   * Referência à fonte primária dos dados que sustentam este fato.
   */
  sourceTraceId?: string;
}
