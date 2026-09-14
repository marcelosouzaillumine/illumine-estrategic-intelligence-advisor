import { ExecutiveDashboardState, HeaderView, PriorityView, ScenarioView, NarrativeViewBlock } from './ExecutiveDashboardState';
import { BoardPackage } from '../contracts/BoardPackage';
import { TechnicalAssessment } from '../contracts/TechnicalAssessment';

export class DashboardStateBuilder {
  

  /**
   * Converte a Deliberação Oficial (BoardPackage) para visualização no Deliberation Center.
   */
  public static buildFromBoardPackage(boardPkg: BoardPackage): ExecutiveDashboardState {
    const scenarios: ScenarioView[] = [];

    // Map Options if no final decision, or if there is a decision map that
    if (!boardPkg.finalDecisionRecord) {
      boardPkg.optionsConsidered.forEach(opt => {
        scenarios.push({
          id: opt.id,
          type: 'OPTIMIZATION',
          name: opt.name,
          description: opt.description,
          isAllowed: true,
          steps: opt.impact
        });
      });
    } else if (boardPkg.finalDecisionRecord.status === 'APPROVED' || boardPkg.finalDecisionRecord.status === 'PARTIALLY_APPROVED') {
      scenarios.push({
        id: 'delib-1',
        type: 'OPTIMIZATION',
        name: 'Ação Aprovada',
        description: boardPkg.finalDecisionRecord.justification,
        isAllowed: true,
        steps: boardPkg.finalDecisionRecord.conditions
      });
    }

    const decisionStatus = boardPkg.finalDecisionRecord?.status || 'POSTPONED';
    const confidence = 0.9;

    return {
      sessionId: boardPkg.sessionId,
      header: {
        title: `Sessão: ${boardPkg.sessionId}`,
        subtitle: boardPkg.executiveQuestion.text,
        statusBadge: decisionStatus,
        statusVariant: decisionStatus === 'APPROVED' ? 'success' : decisionStatus === 'BLOCKED' ? 'destructive' : 'warning',
        contextDescription: `Deliberação baseada em ${boardPkg.assessments.missingDomains?.length === 0 ? 'dados completos' : 'dados parciais'}. Confiança: ${(confidence * 100).toFixed(0)}%`
      },
      kpis: [],
      priorities: boardPkg.risks.map(r => ({
        id: r.id,
        title: r.description,
        description: r.mitigation,
        type: 'ALERT',
        actionableContext: 'Análise de Risco',
        priorityLevel: r.severity
      })),
      scenarios,
      narrative: [
        {
          type: 'DIAGNOSIS',
          title: 'Trade-offs e Conflitos Identificados',
          body: boardPkg.conflictsIdentified.join('. ') + ' ' + boardPkg.tradeoffs.join('. '),
          priority: 'CRITICAL',
          recommendation: ''
        }
      ],
      execution: { plan: [] },
      confidence: {
        overallConfidence: confidence,
        reasoning: 'Agregação dos especialistas',
        factors: []
      }
    };
  }
}
