import { ExecutiveDecisionEvent, DecisionCategory, DecisionSeverity } from './InstitutionalDecisionTypes';

export interface TimelineDecisionEntry {
  decision: DecisionCategory;
  impactedCycle: string;
  affectedDomain: string;
  observedImpact: string;
  fiduciaryRisk: boolean;
  causalRelation: string;
  evidence: string;
  confidence: string;
  severity: DecisionSeverity;
}

export class FiduciaryDecisionTimeline {
  public static extract(decisions: ExecutiveDecisionEvent[]): TimelineDecisionEntry[] {
    if (!decisions || decisions.length === 0) {
      return [];
    }

    // Ordenar por data da decisão (garantir consistência cronológica)
    const sortedDecisions = [...decisions].sort((a, b) => new Date(a.decisionDate).getTime() - new Date(b.decisionDate).getTime());

    return sortedDecisions.map(d => {
      let causalRelation = 'Indeterminada';
      if (d.fiduciaryRiskFlag && d.observedImpact.runwayImpactMonths > 0) {
        causalRelation = 'Alívio temporário ou artificial de liquidez';
      } else if (d.observedImpact.runwayImpactMonths < 0 && d.observedImpact.fcoImpact < 0) {
        causalRelation = 'Deterioração direta de FCO e Runway';
      } else if (d.observedImpact.runwayImpactMonths > 0 && d.observedImpact.fcoImpact > 0) {
        causalRelation = 'Melhora estrutural direta';
      }

      return {
        decision: d.decisionType,
        impactedCycle: d.linkedFinancialCycle,
        affectedDomain: d.affectedDomain,
        observedImpact: `Impacto FCO: ${d.observedImpact.fcoImpact} | Runway: ${d.observedImpact.runwayImpactMonths} meses`,
        fiduciaryRisk: d.fiduciaryRiskFlag,
        causalRelation,
        evidence: d.evidenceSource,
        confidence: d.confidence,
        severity: d.decisionSeverity
      };
    });
  }
}
