import { Provenance } from '../evidence/Provenance';

export interface ExecutiveNarrative {
  /**
   * Título executivo da narrativa.
   */
  title: string;

  /**
   * Gravidade da situação (STABLE, CAUTION, WARNING, CRITICAL, RECOVERY).
   */
  severity: string;

  /**
   * Resumo direto em linguagem de conselho.
   */
  summary: string;

  /**
   * Implicações causais (causa e efeito).
   */
  implications: string[];

  /**
   * Recomendações estratégicas de alto nível.
   */
  recommendations: string[];

  /**
   * Ações táticas derivadas da recomendação.
   */
  actions: string[];

  /**
   * Nível de confiança global na narrativa (0 a 100).
   */
  confidence: number;

  /**
   * Rastreabilidade das afirmações geradas pela narrativa.
   */
  sources: Provenance[];
}
