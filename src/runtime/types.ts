export type RuntimeConfidence = 'LOW' | 'MEDIUM' | 'HIGH';
export type MemoryClassification = 'STRUCTURAL_SNAPSHOT' | 'LIMITED_COMPARISON' | 'MODERATE_TREND' | 'ROBUST_LONGITUDINAL_MEMORY' | 'BLOCKED_INSUFFICIENT_HISTORY';

export interface RuntimeViolation {
  rule: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  sourceEngine?: string;
  blocked: boolean;
  entityId?: string; // Topologia: origem do erro em um grupo
}

export interface CausalityChain {
  trigger: string;
  consequence: string;
  amplification: string | null;
  mitigation: string | null;
  businessImpact: string;
  structuralRisk: string;
  institutionalImpact: string;
}

export interface AdvisoryNarrative {
  diagnostic: string;
  executiveNarrative?: string;
  cause: string;
  consequence: string;
  sensitivity: string;
  risk: string;
  priority: string;
  strategicMovement: string;
}

export interface InferenceBlock {
  domain: string;
  semanticSource?: string;
  lifecycleProfile?: any;
  semanticContext?: any;
  cqsSemantic?: string | null;
  eqsSemantic?: string | null;
  executiveNarrative?: string;
  semanticAudit?: any;
  executiveLifecycleContext?: import('../core/runtime/lifecycle/ExecutiveLifecycleContextResolver').ExecutiveLifecycleContext;
  metrics: Record<string, any>;
  causality: CausalityChain[];
  narrative: AdvisoryNarrative | null;
  confidence: RuntimeConfidence;
  evidenceLevel: string;
  score: number | string | null;
}

export interface RuntimeInput {
  rawFinancialData: any; // Type accurately later
  dreData?: any[]; // Type accurately later
  dfcData?: any[]; // Type accurately later
  businessIdentity?: any; // Type accurately later
  governanceMetrics?: any;
  historicalCyclesCount: number;
  isMockData: boolean;

  // Topology Layer (Multi-Entity)
  groupId?: string;
  targetEntityId?: string;
  entityPath?: string[];
  consolidationScope?: string[];
  reportingBoundary?: 'LEGAL' | 'MANAGERIAL' | 'EQUITY';
  financialRuntimeContext?: any;
}


export interface InstitutionalContext {
  input: RuntimeInput;
  normalizedData: Record<string, any>;
  inferences: Record<string, InferenceBlock>;
  globalConfidence: RuntimeConfidence;
  violations: RuntimeViolation[];
  executedEngines: string[];
  executionStatus: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'BLOCKED';
}

export interface EngineExecutionResult {
  engineName: string;
  success: boolean;
  confidence: RuntimeConfidence;
  inference?: InferenceBlock;
  violations?: RuntimeViolation[];
}

export interface EngineDefinition {
  name: string;
  priority: number;
  dependencies: string[];
  requiredData: (keyof RuntimeInput)[];
  inferenceScope: string;
  minimumEvidenceLevel: string;
  execute: (context: InstitutionalContext) => Promise<EngineExecutionResult>;
}

export interface RuntimeOutput {
  status: 'SUCCESS' | 'PARTIALLY_COMPLIANT' | 'NON_COMPLIANT' | 'BLOCKED';
  globalConfidence: RuntimeConfidence;
  inferences: Record<string, InferenceBlock>;
  advisory: AdvisoryNarrative[];
  scores: Record<string, number | string>;
  violations: RuntimeViolation[];
  context: InstitutionalContext;
  
  // Topology Layer (Multi-Entity)
  lineage?: {
    originEntityId: string;
    computationPath: string[];
  }[];
}
