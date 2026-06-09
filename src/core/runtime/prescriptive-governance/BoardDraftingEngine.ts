import { BoardAgenda, BoardResolution } from './PrescriptiveTypes';

export class BoardDraftingEngine {
  static generateResolutions(agenda: BoardAgenda): BoardResolution[] {
    const resolutions: BoardResolution[] = [];

    // Somente itens DELIBERATIVOS devem gerar minutas de resolução
    const deliberativeItems = agenda.items.filter(item => item.category === 'DELIBERATIVO');

    deliberativeItems.forEach((item, index) => {
      if (item.associatedAction) {
        resolutions.push({
          id: `res_${Date.now()}_${index}`,
          agendaItemId: item.id,
          title: `Deliberação sobre: ${item.associatedAction.title}`,
          recommendationType: item.associatedAction.urgency === 'CRITICAL' ? 'DELIBERACAO' : 'DIRECIONAMENTO_ESTRATEGICO',
          recommendedDraft: `Minuta recomendada para deliberação: Aprovar a execução imediata do plano "${item.associatedAction.actionPlan.title}" visando o resultado esperado de "${item.associatedAction.actionPlan.expectedOutcome}".`,
          justification: item.associatedAction.priorityReason,
          executionTrack: item.associatedAction.track
        });
      }
    });

    return resolutions;
  }
}
