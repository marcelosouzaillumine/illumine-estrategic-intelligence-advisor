import { BoardIntelligenceInput } from './BoardIntelligenceAdapter';
import { BoardAttentionItem } from './BoardAttentionEngine';
import { FiduciaryRiskReport } from './FiduciaryRiskEngine';
import { BoardResolution } from './BoardResolutionLayer';

export interface AgendaBlock {
  title: string;
  items: string[];
}

export interface BoardAgenda {
  estrategia: AgendaBlock;
  financas: AgendaBlock;
  governanca: AgendaBlock;
  riscos: AgendaBlock;
}

export function generateBoardAgenda(
  input: BoardIntelligenceInput,
  attentionItems: BoardAttentionItem[],
  risks: FiduciaryRiskReport,
  resolutions: BoardResolution[]
): BoardAgenda {
  const agenda: BoardAgenda = {
    estrategia: { title: '1. Estratégia e Cenários', items: [] },
    financas: { title: '2. Desempenho Fiduciário', items: [] },
    governanca: { title: '3. Governança e Liderança', items: [] },
    riscos: { title: '4. Riscos Institucionais', items: [] },
  };

  // Populate Strategy
  if (!input.isBaseline && input.executiveRecommendation === '1º Recomendado') {
    agenda.estrategia.items.push(`Avaliação do Cenário Proposto: "${input.scenarioName}"`);
  } else {
    agenda.estrategia.items.push('Acompanhamento da Estratégia Vigente (Baseline)');
  }
  
  // Populate Finance
  agenda.financas.items.push(`Trajetória do Enterprise Value (${(input.enterpriseValue / 1000000).toFixed(1)}M)`);
  if (risks.financialRisk.level === 'Crítico' || risks.financialRisk.level === 'Elevado') {
    agenda.financas.items.push('ATENÇÃO: Reversão urgente de destruição de valor ou insolvência');
  }

  // Populate Governance
  if (risks.institutionalRisk.level === 'Elevado' || risks.institutionalRisk.level === 'Crítico') {
    agenda.governanca.items.push('Revisão da Pressão Sistêmica (GPI Elevado)');
  }
  if (input.longTermRoadmapItemsCount > 0) {
    agenda.governanca.items.push('Acompanhamento do Roadmap Institucional de Longo Prazo');
  }

  // Populate Risks
  attentionItems.filter(i => i.category === 'Escalar').forEach(item => {
    agenda.riscos.items.push(`ESCALADA: ${item.title}`);
  });
  if (agenda.riscos.items.length === 0) {
    agenda.riscos.items.push('Acompanhamento padrão de matriz de riscos fiduciários');
  }

  // Inject resolutions into respective blocks
  resolutions.forEach(res => {
    if (res.action === 'Deliberar' || res.action === 'Aprovação Emergencial') {
      agenda.estrategia.items.push(`DELIBERAÇÃO: ${res.topic}`);
    }
  });

  return agenda;
}
