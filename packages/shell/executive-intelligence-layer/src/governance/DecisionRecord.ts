export enum DecisionStatus {
  DRAFT = 'DRAFT',
  PROPOSED = 'PROPOSED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  APPROVED_WITH_CONDITIONS = 'APPROVED_WITH_CONDITIONS',
  EXECUTING = 'EXECUTING',
  COMPLETED = 'COMPLETED',
  MEASURED = 'MEASURED',
  LEARNED = 'LEARNED',
  REJECTED = 'REJECTED'
}

export interface EvidenceSnapshot {
  generatedAt: string;
  financialState: string;
  metrics: Array<{
    name: string;
    value: number;
    period: string;
  }>;
  risks: string[];
  confidence: number;
}

export interface StrategicScenario {
  id: string;
  name: string;
  description: string;
  action: string;
  impacts: Array<{ metric: string; direction: 'up' | 'down' | 'neutral'; magnitude: string; description: string }>;
  isRecommended: boolean;
}

export interface DecisionSignature {
  decisionId: string;
  approvedBy: string;
  role: string;
  evidenceVersion: string;
  confidenceScore: number;
  riskAcceptance: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  signatureDate: string;
  modelAlgorithmVersion: string;
  humanOverride: boolean;
}

export interface DecisionOutcome {
  decisionId: string;
  expectedOutcome: Array<{ metric: string; value: string }>;
  actualOutcome?: Array<{ metric: string; value: string }>;
  variance?: Array<{ metric: string; delta: string; status: 'ACHIEVED' | 'UNDERPERFORMED' | 'OVERPERFORMED' }>;
  successStatus: 'PENDING' | 'SUCCESS' | 'PARTIAL' | 'FAILURE';
  lessonsLearned: string[];
  validatedBy?: string;
}

export interface DecisionRecord {
  id: string;
  companyId: string;
  createdAt: string;
  
  decisionContext: {
    decisionType: string;
    decisionObjective: string;
    strategicQuestion: string;
    financialState: string;
    businessStage: string;
    urgency: string;
  };
  
  intention: {
    question: string;
    proposedDecision: string;
    expectedOutcome: string;
  };
  
  evidenceSnapshot: EvidenceSnapshot;
  
  deliberation: {
    scenarios: StrategicScenario[];
    keyConcerns: string[];
    premisesChallenged: string[];
    alternatives: string[];
    assumptions: string[];
    objections: string[];
    executiveNotes: string;
    boardComments: string;
    finalRationale: string;
  };
  
  approval: {
    status: DecisionStatus;
    signature?: DecisionSignature;
  };
  
  execution: {
    owner: string;
    deadline: string;
    metrics: string[];
  };
  
  learning: DecisionOutcome;
}

/**
 * Architectural Gate: Evidence Gate
 * Não aprova decisão sem evidências.
 */
export function validateEvidenceGate(record: DecisionRecord): { valid: boolean; reason?: string } {
  if (!record.evidenceSnapshot || record.evidenceSnapshot.metrics.length === 0) {
    return { valid: false, reason: 'BLOCKED: Missing Evidence Snapshot' };
  }
  return { valid: true };
}

/**
 * Architectural Gate: Authority Gate
 * Não permite aprovação acima da alçada de risco.
 */
export function validateAuthorityGate(record: DecisionRecord, actingRole: string): { valid: boolean; reason?: string } {
  const risk = record.decisionContext.financialState === 'RISCO DE CONTINUIDADE' ? 'CRITICAL' : 'MODERATE';
  
  if (risk === 'CRITICAL' && actingRole !== 'BOARD') {
    return { valid: false, reason: `BLOCKED: Critical decisions require BOARD authority. User has ${actingRole}.` };
  }
  
  return { valid: true };
}

/**
 * Architectural Gate: Outcome Gate
 * Uma decisão aprovada precisa ter owner, prazo e métrica de sucesso (Expected Outcome).
 */
export function validateOutcomeGate(record: DecisionRecord): { valid: boolean; reason?: string } {
  if (!record.execution.owner || record.execution.owner.trim() === '') {
    return { valid: false, reason: 'BLOCKED: Missing Decision Execution Owner' };
  }
  if (!record.learning || !record.learning.expectedOutcome || record.learning.expectedOutcome.length === 0) {
    return { valid: false, reason: 'BLOCKED: Missing Expected Outcome metrics' };
  }
  return { valid: true };
}

/**
 * Architectural Gate: Decision Memory Integrity Gate
 * Valida se a decisão pode existir no estado APPROVED garantindo todos os gates.
 */
export function validateDecisionMemoryIntegrity(record: DecisionRecord): { valid: boolean; reason?: string } {
  if (record.approval.status === DecisionStatus.APPROVED || record.approval.status === DecisionStatus.APPROVED_WITH_CONDITIONS) {
    
    const evidenceGate = validateEvidenceGate(record);
    if (!evidenceGate.valid) return evidenceGate;
    
    const outcomeGate = validateOutcomeGate(record);
    if (!outcomeGate.valid) return outcomeGate;
    
    if (!record.deliberation.finalRationale || record.deliberation.finalRationale.trim() === '') {
      return { valid: false, reason: 'BLOCKED: Missing Decision Rationale (Justificativa)' };
    }
    
    if (!record.approval.signature) {
      return { valid: false, reason: 'BLOCKED: Missing Executive Decision Signature' };
    }
  }
  
  return { valid: true };
}
