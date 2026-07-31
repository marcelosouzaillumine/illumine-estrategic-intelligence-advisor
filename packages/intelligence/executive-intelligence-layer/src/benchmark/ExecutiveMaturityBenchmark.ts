/**
 * Índice de Maturidade de Inteligência Executiva (Illumine Executive Maturity Index™)
 * Substitui a visão rasa de "Comparativo de Receita" por uma avaliação da governança decisória.
 */
export interface ExecutiveMaturityBenchmark {
  /**
   * Identificador único do índice.
   */
  id: string;

  /**
   * Data da medição.
   */
  date: string;

  /**
   * 1. Data Integrity: Posso confiar nos dados?
   * (Medido pela % de dados que passam ilesos pela camada de integridade).
   */
  dataIntegrity: number;

  /**
   * 2. Financial Control: Existe previsibilidade financeira?
   * (Medido pela resiliência de liquidez e aderência do orçado vs realizado).
   */
  financialControl: number;

  /**
   * 3. Decision Governance: Decisões seguem critérios?
   * (Medido pela % de decisões que passam pelos portões sem serem bloqueadas).
   */
  decisionGovernance: number;

  /**
   * 4. Execution Discipline: Estratégia vira ação?
   * (Medido pelo acompanhamento das ações recomendadas vs executadas).
   */
  executionDiscipline: number;

  /**
   * 5. Learning Capacity: A empresa aprende?
   * (Medido pelo volume de LearningEvents gerados retroalimentando o sistema).
   */
  learningCapacity: number;

  /**
   * 6. Leadership Maturity: Existe governança executiva?
   * (Score global composto pelo respeito às alçadas e qualidade das premissas).
   */
  leadershipMaturity: number;

  /**
   * Score global ponderado. (0 a 100)
   */
  illumineIndexScore: number;
}
