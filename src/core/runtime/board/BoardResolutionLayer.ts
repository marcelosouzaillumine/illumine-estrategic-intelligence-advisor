import { BoardIntelligenceInput } from './BoardIntelligenceAdapter';
import { BoardAttentionItem } from './BoardAttentionEngine';

export interface BoardResolution {
  action: string;
  topic: string;
  justification: string;
  impact: string;
}

export function generateBoardResolutions(
  input: BoardIntelligenceInput, 
  attentionItems: BoardAttentionItem[]
): BoardResolution[] {
  const resolutions: BoardResolution[] = [];

  const deliberarItems = attentionItems.filter(i => i.category === 'Deliberar');
  const escalarItems = attentionItems.filter(i => i.category === 'Escalar');

  // For every Escalar, we need an immediate corrective resolution
  escalarItems.forEach(item => {
    resolutions.push({
      action: 'Aprovação Emergencial',
      topic: `Plano de contingência para: ${item.title}`,
      justification: item.rationale,
      impact: 'Estancamento de risco fiduciário e proteção da continuidade operacional.'
    });
  });

  // For scenarios that are recommended
  if (input.executiveRecommendation === '1º Recomendado' && !input.isBaseline) {
    resolutions.push({
      action: 'Deliberar',
      topic: `Aprovação do Cenário "${input.scenarioName}"`,
      justification: 'Tema recomendado para deliberação do Conselho por apresentar o melhor equilíbrio entre geração de valor e capacidade de execução.',
      impact: `Criação projetada de valor no montante de R$ ${(input.valueDelta / 1000000).toFixed(1)}M, suportada por análise determinística de riscos.`
    });
  }

  // If no critical/approval decisions, suggest standard governance resolutions
  if (resolutions.length === 0) {
    resolutions.push({
      action: 'Aprovação Ad-hoc',
      topic: 'Manutenção do Baseline Operacional Vigente',
      justification: 'Tema recomendado para deliberação do Conselho, atestando a ausência de desvios significativos nas projeções do trimestre.',
      impact: 'Garantia de compliance com o mandato fiduciário aprovado anteriormente.'
    });
  }

  return resolutions;
}
