import { BoardIntelligenceInput } from './BoardIntelligenceAdapter';

export type AttentionCategory = 'Monitorar' | 'Deliberar' | 'Escalar';

export interface BoardAttentionItem {
  id: string;
  title: string;
  category: AttentionCategory;
  urgency: string; // e.g., 'Imediata', 'Próxima Reunião', 'Contínua'
  rationale: string;
}

export function generateAttentionItems(input: BoardIntelligenceInput): BoardAttentionItem[] {
  const items: BoardAttentionItem[] = [];

  // 1. Escalar (IRG > 60 or GPI > 70)
  if (input.irgScore > 60) {
    items.push({
      id: 'escalar-irg',
      title: 'Gap Crítico de Prontidão Institucional (IRG)',
      category: 'Escalar',
      urgency: 'Imediata',
      rationale: 'O nível de maturidade institucional e governança não suporta a operação projetada, exigindo intervenção diretiva imediata.'
    });
  }
  
  if (input.gpiScore > 70) {
    items.push({
      id: 'escalar-gpi',
      title: 'Pressão Sistêmica Elevada (GPI)',
      category: 'Escalar',
      urgency: 'Imediata',
      rationale: 'Risco iminente de sobrecarga nas lideranças e processos atuais devido à velocidade/complexidade projetada.'
    });
  }

  // 2. Deliberar (Decision needed on recommended scenarios or baseline changes)
  if (input.executiveRecommendation === '1º Recomendado' && !input.isBaseline) {
    items.push({
      id: 'deliberar-scenario',
      title: 'Aprovação de Novo Cenário Estratégico',
      category: 'Deliberar',
      urgency: 'Próxima Reunião',
      rationale: 'O comitê executivo (EDL) classificou este cenário como "1º Recomendado" e aguarda ratificação fiduciária do Conselho.'
    });
  } else if (input.isBaseline) {
    // If it's the baseline, maybe just monitor unless there are issues
    if (input.ieiScore < 50) {
      items.push({
        id: 'deliberar-baseline-risk',
        title: 'Mitigação de Risco Operacional no Baseline',
        category: 'Deliberar',
        urgency: 'Próxima Reunião',
        rationale: 'Apesar de ser o cenário base oficial, a capacidade de execução (IEI) está perigosamente baixa.'
      });
    }
  }

  // 3. Monitorar (Long-term roadmap, stable metrics)
  if (input.longTermRoadmapItemsCount > 0) {
    items.push({
      id: 'monitorar-roadmap',
      title: `Evolução do Roadmap Institucional de Longo Prazo (${input.longTermRoadmapItemsCount} ações)`,
      category: 'Monitorar',
      urgency: 'Contínua',
      rationale: 'Iniciativas de maturação lenta que preparam a base para saltos futuros de complexidade societária/operacional.'
    });
  }
  
  if (input.valueDelta > 0 && input.isBaseline) {
    items.push({
      id: 'monitorar-value',
      title: 'Acompanhamento da Criação de Valor',
      category: 'Monitorar',
      urgency: 'Contínua',
      rationale: 'Monitorar trimestralmente se a captura de valor projetada no Baseline está sendo de fato materializada.'
    });
  }

  // Fallback se não tiver itens (muito raro em cenários reais)
  if (items.length === 0) {
    items.push({
      id: 'monitorar-geral',
      title: 'Estabilidade Operacional',
      category: 'Monitorar',
      urgency: 'Contínua',
      rationale: 'Operação dentro dos conformes fiduciários sem alertas recentes.'
    });
  }

  return items;
}
