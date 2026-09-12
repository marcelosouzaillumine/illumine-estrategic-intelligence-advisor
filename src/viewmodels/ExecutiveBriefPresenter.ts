import { ExecutiveEvidencePackage, NarrativeBlock, ExecutionPlanItem, RiskItem } from '../../packages/shell/executive-intelligence-layer/src/contracts/ExecutiveEvidencePackage';

export interface ExecutiveBriefViewModel {
  header: {
    title: string;
    subtitle: string;
    statusBadge: string;
    statusVariant: 'success' | 'warning' | 'destructive' | 'default';
  };
  context: {
    financialState: string;
    confidence: number;
    dominantDriver: string;
    assumptions?: string[];
  };
  decisionIntent: {
    requestedDecision: string;
    decisionCategory: string;
  };
  evidenceTrail: any[];
  narrative: {
    blocks: NarrativeBlock[];
  };
  risks: {
    items: RiskItem[];
  };
  execution: {
    plan: ExecutionPlanItem[];
  };
  dataQuality?: {
    integrityScore: number;
    originScore: number;
    recencyScore: number;
    completenessScore: number;
    historicalReliabilityScore: number;
    warnings: string[];
    missingEvidence: string[];
    isComplete: boolean;
    dataSource: string;
    lastUpdatedAt: string;
  };
  confidenceMap?: {
    financial: { score: number; basis: string };
    causal: { score: number; basis: string };
    recommendation: { score: number; basis: string };
    uncertainties: string[];
    executiveJudgmentRequired: 'LOW' | 'MEDIUM' | 'HIGH';
  };
}

export class ExecutiveBriefPresenter {
  /**
   * Transforma o ExecutiveEvidencePackage (independente de UI) em um ViewModel consumível pelo React
   */
  public static present(pkg: ExecutiveEvidencePackage): ExecutiveBriefViewModel {
    
    // Map Severity to UI Variants
    let statusVariant: 'success' | 'warning' | 'destructive' | 'default' = 'default';
    if (pkg.executiveContext.severity === 'CRITICAL') statusVariant = 'destructive';
    else if (pkg.executiveContext.severity === 'HIGH') statusVariant = 'warning';
    else if (pkg.executiveContext.severity === 'LOW') statusVariant = 'success';

    return {
      header: {
        title: 'Executive Governance Brief',
        subtitle: `Sessão Cognitiva: ${pkg.cognitiveSessionId}`,
        statusBadge: pkg.executiveContext.financialState,
        statusVariant
      },
      context: {
        financialState: pkg.executiveContext.financialState,
        confidence: pkg.executiveContext.confidence,
        dominantDriver: pkg.executiveContext.dominantDriver,
        assumptions: pkg.decisionIntent.assumptions
      },
      decisionIntent: {
        requestedDecision: pkg.decisionIntent.requestedDecision,
        decisionCategory: pkg.decisionIntent.decisionCategory
      },
      evidenceTrail: pkg.evidenceTrail || [],
      narrative: {
        blocks: pkg.narrativeBlocks
      },
      risks: {
        items: pkg.riskMap || []
      },
      execution: {
        plan: pkg.executionPlan || []
      },
      dataQuality: pkg.dataQuality,
      confidenceMap: pkg.confidenceMap
    };
  }
}
