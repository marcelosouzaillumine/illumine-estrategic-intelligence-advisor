export interface CompressedAdvisory {
  situacaoAtual: string;
  restricaoPrincipal: string;
  prioridadeEstrategica: string;
  outlook: string;
  fullTextLength: number;
}

export class CashExecutiveAdvisoryEngine {
  /**
   * Sintetiza o Advisory em formato executivo comprimido (max 600 caracteres)
   */
  public static compress(
    isBurning: boolean,
    dependencyCritical: boolean,
    primaryConstraint: string,
    runwayCritical: boolean
  ): CompressedAdvisory {
    
    let situacaoAtual = '';
    let restricao = '';
    let prioridade = '';
    let outlook = '';

    if (isBurning) {
      if (dependencyCritical) {
        situacaoAtual = 'A companhia dependeu da capitalização dos sócios para sustentar a liquidez.';
      } else {
        situacaoAtual = 'A operação consumiu reservas acumuladas para sustentar a liquidez no período.';
      }
      
      restricao = 'A operação consumiu caixa em ritmo superior à capacidade de geração operacional.';
      prioridade = 'Restabelecer a autossuficiência financeira operacional.';
      
      if (runwayCritical) {
        outlook = 'Sem reversão da geração operacional negativa de caixa, novos aportes serão necessários urgentemente para sustentar a continuidade.';
      } else {
        outlook = 'Sem reversão da geração operacional negativa de caixa, novos aportes serão necessários a médio prazo para sustentar a continuidade.';
      }
    } else {
      situacaoAtual = 'A operação foi capaz de gerar caixa e manter sua independência financeira estrutural.';
      restricao = 'Otimização de capital de giro (estoques e recebíveis) para acelerar a conversão.';
      prioridade = 'Manter a eficiência operacional e reinvestir o caixa excedente com segurança.';
      outlook = 'Mantido o ciclo atual, a companhia continuará expandindo suas margens de liquidez organicamente.';
    }

    const fullText = `${situacaoAtual} ${restricao} ${prioridade} ${outlook}`;

    // Guarantee < 600 chars rule
    if (fullText.length > 600) {
      outlook = 'Risco de continuidade requer ajustes táticos (texto condensado).';
    }

    return {
      situacaoAtual,
      restricaoPrincipal: restricao,
      prioridadeEstrategica: prioridade,
      outlook,
      fullTextLength: `${situacaoAtual} ${restricao} ${prioridade} ${outlook}`.length
    };
  }
}
