export class DLPABoardDecisionSupportEngine {
  static evaluate(
    formationQuality: string,
    netIncome: number,
    preservationRatio: number,
    capitalConsumedRatio: number,
    capitalRecoveryRequiredAmount: number,
    distributionCapacity: string,
    capitalDependencyClassification: string,
    capitalDependencyValue: number,
    endingEquity: number
  ) {
    const formation = (formationQuality === 'Dependente de Capitalização' || capitalDependencyValue > 1.0)
      ? 'Capitalização dos sócios.'
      : 'Geração própria de resultados.';

    const wealthGeneration = netIncome > 0
      ? 'Sim, houve lucro no exercício.'
      : 'Não houve. O exercício registrou prejuízo líquido.';

    const preservado = (preservationRatio * 100).toFixed(1).replace('.', ',');
    const consumido = (capitalConsumedRatio * 100).toFixed(1).replace('.', ',');
    
    let preservation = '';
    if (endingEquity <= 0) {
      preservation = 'Não. O capital foi totalmente erodido por prejuízos acumulados (insolvência patrimonial).';
    } else if (preservationRatio >= 1.0) {
      preservation = 'Sim. 100,0% do capital permanece preservado.';
    } else {
      preservation = `Parcialmente. ${preservado}% permanece preservado. ${consumido}% já foi consumido por prejuízos acumulados.`;
    }

    let capacity = '';
    if (distributionCapacity === 'Livre') {
      capacity = 'Livre, passível de distribuição.';
    } else if (distributionCapacity === 'Bloqueada') {
      capacity = 'Bloqueada devido a prejuízos acumulados.';
    } else if (distributionCapacity === 'Restrita') {
      capacity = 'Restrita devido a prejuízos ou ausência de lucros.';
    } else if (distributionCapacity === 'Condicionada') {
      capacity = 'Condicionada à absorção prévia de prejuízos acumulados.';
    } else {
      capacity = `${distributionCapacity}.`;
    }

    const recoveryRequired = capitalRecoveryRequiredAmount <= 0
      ? 'R$ 0,00 (0,0% do capital originalmente aportado)'
      : `R$ ${capitalRecoveryRequiredAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${(capitalConsumedRatio * 100).toFixed(1).replace('.', ',')}% do capital originalmente aportado)`;

    const dependency = endingEquity <= 0
      ? 'Crítica (Patrimônio Líquido negativo).'
      : `${capitalDependencyClassification} (razão de ${capitalDependencyValue.toFixed(2).replace('.', ',')}x entre Capital e PL).`;

    const whatHappens = 'A continuidade da destruição de resultados poderá consumir progressivamente a parcela remanescente do capital aportado pelos sócios, ampliando a dependência de novas capitalizações e reduzindo a capacidade futura de distribuição de riqueza.';

    let priority = 'Expandir a geração de caixa e otimizar alocação de recursos.';
    if (endingEquity <= 0) {
      priority = 'Imediato aporte de capital pelos sócios para restaurar solvência e integridade fiduciária.';
    } else if (capitalConsumedRatio >= 0.40 || netIncome <= 0 || distributionCapacity === 'Bloqueada') {
      priority = 'Recuperar rentabilidade e recompor a integridade do capital aportado.';
    }

    const framework = [
      { question: 'Como o patrimônio foi formado?', answer: formation },
      { question: 'Houve geração de riqueza?', answer: wealthGeneration },
      { question: 'O capital dos sócios foi preservado?', answer: preservation },
      { question: 'Existe capacidade distributiva?', answer: capacity },
      { question: 'Quanto capital ainda precisa ser recuperado?', answer: recoveryRequired },
      { question: 'Qual a dependência dos sócios?', answer: dependency },
      { question: 'Se nada for feito, o que acontece?', answer: whatHappens },
      { question: 'Qual a prioridade do Conselho?', answer: priority }
    ];

    return {
      value: framework,
      classification: 'Framework Executivo',
      narrative: 'Apresentação estruturada para o Conselho Consultivo.',
      rationale: 'Consolidação de múltiplas métricas para resposta direta às teses da governança de capital.',
      sourceMetrics: {
        formationQuality,
        netIncome,
        preservationRatio,
        capitalConsumedRatio,
        capitalRecoveryRequiredAmount,
        distributionCapacity,
        capitalDependencyClassification,
        capitalDependencyValue,
        endingEquity
      },
      confidenceLevel: 'HIGH'
    };
  }
}
