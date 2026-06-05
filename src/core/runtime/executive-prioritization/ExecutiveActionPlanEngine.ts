// src/core/runtime/executive-prioritization/ExecutiveActionPlanEngine.ts

import { RatedRecommendation, ExecutivePriorityRankingEngine } from './ExecutivePriorityRankingEngine';
import { BoardDecisionGovernanceValidator } from './BoardDecisionGovernanceValidator';

export interface ExecutiveAction {
  acao: string;
  responsavel: string;
  prazo: string;
  impactoEsperado: string;
  origin: string;
  evidence: string[];
}

export class ExecutiveActionPlanEngine {
  public static generate(report: any): ExecutiveAction[] {
    const ranked = ExecutivePriorityRankingEngine.rank(report);
    
    // Filter to keep only Directory-level domains (Revenue, Costs, Cash, Processes, Operations)
    const directoryActions = BoardDecisionGovernanceValidator.filterDirectoryActions(ranked);

    // Map to output structure
    const actions: ExecutiveAction[] = directoryActions.map(a => ({
      acao: a.action,
      responsavel: a.responsible,
      prazo: a.prazoRecomendadoLabel === 'Imediata' ? 'Imediato' : a.prazoRecomendadoLabel === 'Curto Prazo' ? '30 dias' : '90 dias',
      impactoEsperado: a.impactoEsperado,
      origin: a.origin,
      evidence: a.evidence
    }));

    // If we have fewer than 5 actions, let's supplement with default operational improvements
    const netProfit = report.metrics?.netProfit ?? report.metrics?.netIncome ?? 0;
    const fco = report.metrics?.fco ?? report.cashSustainabilityReport?.sourceMetrics?.fco ?? 0;

    const defaults: ExecutiveAction[] = [];

    if (fco < 0 && !actions.some(a => a.acao.toLowerCase().includes('recebimento') || a.acao.toLowerCase().includes('cobrança'))) {
      defaults.push({
        acao: 'Rever prazos médios de recebimento de clientes e intensificar cobranças de inadimplentes.',
        responsavel: 'Financeiro / Contas a Receber',
        prazo: '15 dias',
        impactoEsperado: 'Redução do ciclo de conversão de caixa e aceleração da entrada de caixa.',
        origin: 'DFC',
        evidence: ['Fluxo de caixa operacional deficitário.']
      });
    }

    if (netProfit < 0 && !actions.some(a => a.acao.toLowerCase().includes('custos') || a.acao.toLowerCase().includes('despesas'))) {
      defaults.push({
        acao: 'Congelar novos gastos comerciais discricionários e focar em canais de vendas com ROI comprovado.',
        responsavel: 'Diretor Comercial / Marketing',
        prazo: '30 dias',
        impactoEsperado: 'Aumento da eficiência de vendas e redução do custo de aquisição de clientes (CAC).',
        origin: 'DRE',
        evidence: ['Operação deficitária no exercício.']
      });
    }

    if (!actions.some(a => a.acao.toLowerCase().includes('conciliação') || a.acao.toLowerCase().includes('auditoria'))) {
      defaults.push({
        acao: 'Implementar fechamento financeiro semanal com conciliação bancária 100% automatizada.',
        responsavel: 'Controladoria',
        prazo: '30 dias',
        impactoEsperado: 'Mitigação de erros de lançamentos e maior confiabilidade de dados para DFC.',
        origin: 'Processos',
        evidence: ['Necessidade preventiva de fortalecimento de governança contábil.']
      });
    }

    // Add standard operational optimization if still needed
    defaults.push({
      acao: 'Renegociar prazos de pagamento com fornecedores chave para estender o prazo de desembolso.',
      responsavel: 'Compras / Suprimentos',
      prazo: '45 dias',
      impactoEsperado: 'Melhoria no capital de giro sem necessidade de captação de dívida.',
      origin: 'Operação',
      evidence: ['Preservação preventiva da liquidez corrente.']
    });

    defaults.push({
      acao: 'Revisar tabela de preços e precificação por canal para mitigar erosão de margem bruta.',
      responsavel: 'CEO / Comercial',
      prazo: '30 dias',
      impactoEsperado: 'Melhoria na margem de contribuição média ponderada.',
      origin: 'Receita',
      evidence: ['Necessidade de otimização de margem de contribuição.']
    });

    // Merge and return exactly up to 5 actions
    const merged = [...actions, ...defaults];
    const unique = merged.filter((item, index) => 
      merged.findIndex(x => x.acao === item.acao) === index
    );

    return unique.slice(0, 5);
  }
}
