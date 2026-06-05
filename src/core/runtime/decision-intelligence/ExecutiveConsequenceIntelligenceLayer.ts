export interface ConsequenceProfile {
  consequenceOfAction: string;
  consequenceOfInaction: string;
  impactHorizon: string;
  reversibility: 'Alta possibilidade de recuperação' | 'Recuperação possível mediante ação rápida' | 'Recuperação difícil sem mudanças estruturais';
}

export class ExecutiveConsequenceIntelligenceLayer {
  /**
   * Evaluates organization financial parameters to compile consequence profiles.
   */
  public static evaluate(
    fco: number,
    runwayMonths: number,
    netIncome: number
  ): ConsequenceProfile {
    const isCritical = runwayMonths < 3 || (fco < 0 && runwayMonths < 6) || netIncome < -100000;
    const isModerate = !isCritical && (runwayMonths < 6 || fco < 0 || netIncome < 0);

    if (isCritical) {
      return {
        consequenceOfAction: 'A readequação imediata da queima operacional preservará a autonomia de capital da tesouraria e restaurará o runway básico para continuidade.',
        consequenceOfInaction: 'Se nenhuma ação for tomada, a instituição poderá ampliar sua dependência de capital externo, reduzir sua capacidade de investimento e aumentar sua exposição a riscos de continuidade operacional.',
        impactHorizon: 'Imediato (0-3 meses)',
        reversibility: 'Recuperação difícil sem mudanças estruturais'
      };
    } else if (isModerate) {
      return {
        consequenceOfAction: 'A otimização dos prazos de giro e redução de despesas não essenciais estabilizará as reservas de caixa sem necessidade de aportes adicionais.',
        consequenceOfInaction: 'A manutenção da queima de caixa sem ajuste estrutural erosionará gradualmente a reserva de contingência, elevando a vulnerabilidade a choques de liquidez.',
        impactHorizon: 'Curto Prazo (3-6 meses)',
        reversibility: 'Recuperação possível mediante ação rápida'
      };
    } else {
      return {
        consequenceOfAction: 'A alocação de caixa livre em Capex produtivo ou reservas de rendimento acelerará o crescimento orgânico e a solidez patrimonial.',
        consequenceOfInaction: 'A ausência de reinvestimento planejado dos excedentes de caixa pode gerar obsolescência operacional no médio prazo, reduzindo a competitividade.',
        impactHorizon: 'Médio a Longo Prazo (12+ meses)',
        reversibility: 'Alta possibilidade de recuperação'
      };
    }
  }
}
