import { ExecutivePriority, BoardAgenda, BoardAgendaItem } from './PrescriptiveTypes';
import { DecisionMatrixOutput } from './DecisionMatrixEngine';

export class BoardAgendaEngine {
  static generateAgenda(
    matrix: DecisionMatrixOutput,
    scoreOutput: any
  ): BoardAgenda {
    const items: BoardAgendaItem[] = [];

    // 1. INFORMATIVO
    // Adiciona visão geral baseada no Score e Trajetória
    items.push({
      id: `agenda_info_${Date.now()}`,
      category: 'INFORMATIVO',
      topic: 'Atualização do Contexto Institucional',
      context: `Score Institucional Preditivo: ${scoreOutput.predictiveScore}. Trajetória: ${scoreOutput.trajectory}. Nível de Risco Sistêmico: ${scoreOutput.systemicRiskLevel}.`
    });

    // Itens estratégicos (Alto Impacto, Baixa Urgência)
    matrix.strategicPlanning.forEach((action, idx) => {
      items.push({
        id: `agenda_info_strat_${idx}`,
        category: 'INFORMATIVO',
        topic: `[Estratégico] ${action.title}`,
        context: action.description,
        associatedAction: action
      });
    });

    // 2. DELIBERATIVO
    // Apenas itens Críticos (Alta Urgência, Alto Impacto)
    matrix.dayZeroCritical.forEach((action, idx) => {
      items.push({
        id: `agenda_delib_${idx}`,
        category: 'DELIBERATIVO',
        topic: `[Crítico] ${action.title}`,
        context: `Justificativa Fiduciária: ${action.priorityReason}. Necessita deliberação imediata.`,
        associatedAction: action
      });
    });

    // Quick Wins também podem ser deliberados se exigirem aprovação executiva rápida
    matrix.quickWins.forEach((action, idx) => {
      items.push({
        id: `agenda_delib_qw_${idx}`,
        category: 'DELIBERATIVO',
        topic: `[Ação Rápida] ${action.title}`,
        context: action.description,
        associatedAction: action
      });
    });

    // 3. MONITORAMENTO
    // Itens de baixa urgência e baixo impacto
    matrix.monitoring.forEach((action, idx) => {
      items.push({
        id: `agenda_monit_${idx}`,
        category: 'MONITORAMENTO',
        topic: action.title,
        context: action.description,
        associatedAction: action
      });
    });

    return {
      dateGenerated: new Date().toISOString(),
      items
    };
  }
}
