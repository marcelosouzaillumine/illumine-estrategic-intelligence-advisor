export interface ExecutiveNarrativeBlock {
  readonly title?: string;
  readonly content: string;
}

export interface ExecutiveImpactBlock {
  readonly level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  readonly description: string;
  readonly affectedAreas: string[];
}

export interface ExecutiveRecommendation {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly urgency: 'NORMAL' | 'URGENT' | 'IMMEDIATE';
  readonly explainability?: any;
}

export interface ExecutiveRisk {
  readonly id: string;
  readonly type: string;
  readonly severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  readonly description: string;
}

export interface ExecutiveDecision {
  readonly id: string;
  readonly question: string;
  readonly context: string;
  readonly options: string[];
}

export interface ExecutiveAction {
  readonly id: string;
  readonly label: string;
  readonly intent: string;
  readonly requiresConfirmation: boolean;
}

/**
 * ExecutiveResponseContract
 * 
 * Contrato rigoroso de resposta. A IA deixa de retornar strings soltas
 * e passa a retornar este JSON-schema versionado.
 */
export interface ExecutiveResponseContract {
  readonly schemaVersion: "1.0";
  readonly executiveSummary?: string;
  readonly currentSituation?: ExecutiveNarrativeBlock;
  readonly intelligenceInterpretation?: ExecutiveNarrativeBlock;
  readonly businessImpact?: ExecutiveImpactBlock;
  readonly recommendations?: ExecutiveRecommendation[];
  readonly risks?: ExecutiveRisk[];
  readonly decisionsRequired?: ExecutiveDecision[];
  readonly nextActions?: ExecutiveAction[];
}
