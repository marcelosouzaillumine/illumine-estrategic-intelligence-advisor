export class CapitalRecoverabilityEngine {
  static evaluate(endingEquity: number, tempoRecuperacao: number | null | 'Não Estimável') {
    if (endingEquity <= 0) {
      return {
        classification: 'Recuperabilidade Comprometida',
        narrative: 'A recuperação patrimonial está comprometida devido à insolvência (patrimônio líquido negativo), demandando imediato aporte de capital pelos sócios.',
        rationale: `PL Final (R$ ${endingEquity}) é menor ou igual a zero.`
      };
    }

    if (tempoRecuperacao === null || tempoRecuperacao === 'Não Estimável' || typeof tempoRecuperacao === 'string') {
      return {
        classification: 'Não Estimável',
        narrative: 'A companhia ainda não gera lucro recorrente suficiente para estimar um horizonte confiável de recomposição do capital consumido.',
        rationale: 'Horizonte de recuperação é indefinido.'
      };
    }

    let classification = 'Crítica';
    let narrative = `O tempo estimado de recomposição patrimonial supera 10 anos (${tempoRecuperacao.toFixed(1).replace('.', ',')} anos), configurando recuperabilidade crítica.`;
    
    if (tempoRecuperacao < 2) {
      classification = 'Alta';
      narrative = `O tempo estimado de recomposição patrimonial é curto (${tempoRecuperacao.toFixed(1).replace('.', ',')} anos), configurando alta recuperabilidade.`;
    } else if (tempoRecuperacao < 5) {
      classification = 'Moderada';
      narrative = `O tempo estimado de recomposição patrimonial é de médio prazo (${tempoRecuperacao.toFixed(1).replace('.', ',')} anos), configurando recuperabilidade moderada.`;
    } else if (tempoRecuperacao < 10) {
      classification = 'Baixa';
      narrative = `O tempo estimado de recomposição patrimonial é de longo prazo (${tempoRecuperacao.toFixed(1).replace('.', ',')} anos), configurando baixa recuperabilidade.`;
    }

    return {
      classification,
      narrative,
      rationale: `Horizonte de recuperação calculado em ${tempoRecuperacao.toFixed(2)} anos.`
    };
  }
}
