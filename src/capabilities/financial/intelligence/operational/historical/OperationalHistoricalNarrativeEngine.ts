import { HistoricalMovement, HistoricalIntelligence, HistoricalTrajectoryClassification } from '../../../contracts/HistoricalIntelligence';

export class OperationalHistoricalNarrativeEngine {
  static synthesize(
    movements: HistoricalMovement[],
    periodsAnalyzed: number,
    firstYear: number,
    lastYear: number
  ): HistoricalIntelligence {
    
    let confidence = 'low';
    if (periodsAnalyzed >= 4) confidence = 'high';
    else if (periodsAnalyzed >= 2) confidence = 'medium';

    let classification: HistoricalTrajectoryClassification = 'stable';
    let explanation = 'As métricas operacionais mantiveram-se estáveis no período avaliado.';
    let observation = 'Manutenção da estrutura de resultados operacionais.';
    let implication = 'O desempenho operacional atual não indica rompimentos drásticos com o padrão histórico.';

    const revMovement = movements.find(m => m.metric === 'Receita Líquida');
    const opexMovement = movements.find(m => m.metric === 'OPEX');

    if (revMovement && typeof revMovement.variation.percentage === 'number') {
      if (revMovement.variation.percentage > 5) {
        classification = 'strengthening';
        explanation = 'A receita líquida demonstrou trajetória de expansão nos períodos analisados.';
        observation = `Entre ${firstYear} e ${lastYear}, a receita líquida apresentou crescimento contínuo.`;
        implication = 'A expansão contínua da receita fortalece a capacidade de diluição de custos fixos.';
      } else if (revMovement.variation.percentage < -5) {
        classification = 'deteriorating';
        explanation = 'A receita líquida apresentou retração nos períodos analisados.';
        observation = `Entre ${firstYear} e ${lastYear}, observou-se contração na geração de receita.`;
        implication = 'O encolhimento das receitas pode pressionar as margens caso a estrutura de custos não seja ajustada proporcionalmente.';
      }

      // Check operational divergence (OPEX growing faster than Revenue) over the period
      if (opexMovement && typeof opexMovement.variation.percentage === 'number' && revMovement.variation.percentage > 0 && opexMovement.variation.percentage > revMovement.variation.percentage) {
         classification = classification === 'strengthening' ? 'attention' : 'deteriorating';
         explanation = 'A receita líquida expandiu, porém o peso da estrutura operacional (OPEX) cresceu em ritmo superior.';
         observation = `O crescimento da receita ocorreu simultaneamente a uma expansão percentualmente maior do OPEX.`;
         implication = 'O crescimento está demandando peso estrutural crescente, o que pressiona a eficiência operacional.';
      }
    }

    if (periodsAnalyzed < 2) {
      classification = 'insufficient';
      explanation = 'O volume de períodos disponíveis não suporta a determinação de uma trajetória histórica operacional.';
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
      movements,
      executiveContext: {
        observation,
        implication
      }
    };
  }
}
