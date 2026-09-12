import { ExecutionCommitment } from './ExecutionGovernanceTypes';
import { validateExecutionImpact } from './ImpactValidationEngine';

export interface BoardFollowupItem {
  commitmentId: string;
  topic: string;
  category: 'MONITORAMENTO';
  urgency: 'NORMAL' | 'HIGH' | 'CRITICAL';
  narrative: string;
}

export function generateBoardFollowupAgenda(commitments: ExecutionCommitment[]): BoardFollowupItem[] {
  const followups: BoardFollowupItem[] = [];

  for (const commitment of commitments) {
    if (commitment.status === 'PENDING' || commitment.status === 'IN_PROGRESS') {
      const isCriticalSlippage = commitment.slippage?.overallSlippageScore > 60;
      
      followups.push({
        commitmentId: commitment.id,
        topic: `Acompanhamento: ${commitment.title}`,
        category: 'MONITORAMENTO',
        urgency: isCriticalSlippage ? 'CRITICAL' : 'NORMAL',
        narrative: isCriticalSlippage 
          ? `Alerta de Slippage Crítico. O ciclo estourou ou o escopo reduziu severamente. Score de Slippage: ${commitment.slippage.overallSlippageScore}.`
          : `Monitoramento contínuo do andamento. ciclo estimado: ${commitment.expectedCompletionDate.toLocaleDateString()}.`
      });
    } else if (commitment.status === 'DEVIATED' || commitment.status === 'EXECUTED') {
      const impact = validateExecutionImpact(commitment);
      
      if (!impact.isValidated || commitment.status === 'DEVIATED') {
        followups.push({
          commitmentId: commitment.id,
          topic: `Revisão Pós-Execução: ${commitment.title}`,
          category: 'MONITORAMENTO',
          urgency: 'HIGH',
          narrative: `Executado com desvio de impacto ou escopo. Avaliação de Impacto: ${impact.validationNarrative}`
        });
      }
    } else if (commitment.status === 'ABORTED') {
      followups.push({
        commitmentId: commitment.id,
        topic: `Justificativa de Cancelamento: ${commitment.title}`,
        category: 'MONITORAMENTO',
        urgency: 'HIGH',
        narrative: `Ação previamente aprovada foi cancelada pela gestão. Requer apreciação do conselho para reavaliação de estratégia.`
      });
    }
  }

  return followups.sort((a, b) => {
    const urgencyWeight = { 'CRITICAL': 3, 'HIGH': 2, 'NORMAL': 1 };
    return urgencyWeight[b.urgency] - urgencyWeight[a.urgency];
  });
}
