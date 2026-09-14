import { HistoricalMovement, HistoricalIntelligence, HistoricalTrajectoryClassification } from '../../contracts/HistoricalIntelligence';

export class HistoricalNarrativeEngine {
  static synthesize(
    movements: HistoricalMovement[],
    periodsAnalyzed: number,
    firstYear: number,
    lastYear: number
  ): HistoricalIntelligence {
    
    const hasUnavailable = movements.some(m => m.variation.percentage === 'UNAVAILABLE');
    const hasNotApplicable = movements.some(m => m.variation.percentage === 'NOT_APPLICABLE' || m.variation.percentage === 'SIGN_INVERSION');
    
    let confidence = 'low';
    if (periodsAnalyzed >= 4 && !hasUnavailable) {
        confidence = hasNotApplicable ? 'medium' : 'high';
    } else if (periodsAnalyzed >= 2 && !hasUnavailable) {
        confidence = 'medium';
    }

    const enrichedMovements = movements.map(m => {
      let interpretation = `A rubrica de ${m.metric} não apresentou variação material no período analisado.`;
      
      if (m.variation.percentage === 'UNAVAILABLE') {
          interpretation = 'Dados insuficientes para cálculo de evolução no período.';
      } else if (m.variation.percentage === 'ZERO_CHANGE') {
          interpretation = `A rubrica de ${m.metric} apresentou estabilidade exata no período analisado.`;
      } else if (m.variation.percentage === 'NOT_APPLICABLE') {
          interpretation = `Houve movimentação em ${m.metric}, porém a variação percentual não é calculável devido à base de comparação nula.`;
      } else if (m.variation.percentage === 'SIGN_INVERSION') {
          interpretation = `Houve inversão de sinal em ${m.metric} no período analisado.`;
      } else if (typeof m.variation.percentage === 'number') {
        const val = m.variation.percentage;
        if (val > 300) {
            interpretation = `Houve expansão expressiva em ${m.metric} em relação à base comparativa.`;
        } else if (val > 5) {
            interpretation = `Houve expansão em ${m.metric} no período analisado.`;
        } else if (val < -300) {
            interpretation = `Houve retração expressiva em ${m.metric} em relação à base comparativa.`;
        } else if (val < -5) {
            interpretation = `Houve retração em ${m.metric} no período analisado.`;
        }
      }
      return { ...m, interpretation };
    });

    let classification: HistoricalTrajectoryClassification = 'stable';
    let explanation = 'A estrutura patrimonial manteve constância ao longo dos períodos avaliados.';
    let observation = 'Manutenção da estrutura de capital.';
    let implication = 'As decisões operacionais recentes não alteraram substancialmente o perfil patrimonial da organização.';

    if (periodsAnalyzed < 2) {
      classification = 'insufficient';
      explanation = 'Cobertura histórica insuficiente.';
      observation = 'Existe apenas um período disponível. Não é possível determinar direção, tendência ou inflexão patrimonial.';
      implication = 'Requer acúmulo de dados adicionais para determinação de série histórica.';
    } else if (periodsAnalyzed === 2) {
      classification = 'insufficient'; // We don't declare structural trend with 2
      explanation = 'Dois períodos analisados permitem observar variação absoluta e direção.';
      observation = `Observa-se apenas a variação do período entre ${firstYear} e ${lastYear}.`;
      implication = 'Sem dados adicionais, não é possível declarar uma tendência estrutural.';
    } else if (enrichedMovements.length > 0) {
      // Analyze general direction of all material movements for 3+ periods
      const strengthening = enrichedMovements.filter(m => m.variation.percentage !== 'NOT_APPLICABLE' && m.variation.percentage !== 'SIGN_INVERSION' && (m.variation.percentage as number) > 5 && m.metric !== 'Passivo Circulante' && m.metric !== 'Passivos Financeiros');
      const deteriorating = enrichedMovements.filter(m => m.variation.percentage !== 'NOT_APPLICABLE' && m.variation.percentage !== 'SIGN_INVERSION' && (((m.variation.percentage as number) < -5 && m.metric === 'Patrimônio Líquido') || ((m.variation.percentage as number) > 10 && m.metric === 'Passivos Financeiros')));
      
      const isVolatile = enrichedMovements.some(m => m.variation.percentage !== 'NOT_APPLICABLE' && m.variation.percentage !== 'SIGN_INVERSION' && Math.abs(m.variation.percentage as number) > 30);

      if (isVolatile && periodsAnalyzed >= 3) {
         classification = 'volatile';
         explanation = 'A série histórica demonstra oscilações significativas nas métricas patrimoniais, apontando volatilidade nos ciclos.';
         observation = `Entre ${firstYear} e ${lastYear} houve movimentações agressivas em contas patrimoniais críticas.`;
         implication = 'A instabilidade pode dificultar o planejamento financeiro sustentável.';
      } else if (deteriorating.length > strengthening.length && periodsAnalyzed >= 4) {
         classification = 'deteriorating';
         explanation = 'Os indicadores apontam para redução do capital estrutural ao longo dos exercícios avaliados.';
         observation = `A estrutura apresentou deterioração progressiva no período analisado (${firstYear} a ${lastYear}).`;
         implication = 'Este movimento restringe a flexibilidade financeira para novos ciclos operacionais.';
      } else if (strengthening.length > deteriorating.length && periodsAnalyzed >= 4) {
         classification = 'strengthening';
         explanation = 'Os indicadores atestam evolução quantitativa na capacidade de financiamento e retenção de valor.';
         observation = `A estrutura apresentou fortalecimento progressivo no período analisado (${firstYear} a ${lastYear}).`;
         implication = 'Este movimento amplia a capacidade autônoma de suporte a novas operações.';
      } else if (periodsAnalyzed === 3) {
         // for 3 periods we allow volatility and inflection (which is handled in movements), but don't force a macro trend unless very obvious
         classification = 'stable';
         explanation = 'Análise de três períodos permite avaliar inflexões e direções.';
         observation = `Acompanhamento de três exercícios entre ${firstYear} e ${lastYear}.`;
         implication = 'Monitoramento sugerido para validar tendências emergentes.';
      }
    }

    return {
      available: true,
      periodCoverage: {
        firstYear,
        lastYear,
        periodsAnalyzed
      },
      trajectory: {
        classification,
        confidence,
        explanation
      },
      movements: enrichedMovements,
      executiveContext: {
        observation,
        implication
      }
    };
  }
}
