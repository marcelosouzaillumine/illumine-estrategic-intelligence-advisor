export type DecisionPackageState =
  | "OBSERVED"
  | "CONTEXTUALIZED"
  | "MEMORY_ENRICHED"
  | "SCENARIO_ANALYZED"
  | "FORECASTED"
  | "DEBATED"
  | "CONSENSUS_FORMED"
  | "REASONED"
  | "REFLECTED"
  | "GOVERNANCE_VALIDATED"
  | "CERTIFIED"
  | "PRESENTED"
  | "EXECUTED"
  | "LEARNED";

export interface GlobalIdentifier {
  decisionPackageId: string;
  observationId?: string;
  evidenceIds: string[];
  reasoningVersion: number;
  consensusVersion: number;
  learningVersion: number;
}

export interface ExecutiveDecisionPackage {
  /**
   * The global immutable identity chain
   */
  identity: GlobalIdentifier;
  
  /**
   * Current state in the Executive Cognitive Runtime
   */
  state: DecisionPackageState;
  
  /**
   * Timestamp of when this version was created (Immutability guarantee)
   */
  versionTimestamp: number;
  
  /**
   * Payloads from each step of the ECR
   */
  observation?: any;
  context?: any;
  memory?: any;
  scenarios?: any[];
  forecast?: any;
  debate?: any;
  consensus?: any;
  reasoning?: any;
  reflection?: any;
  governance?: any;
  recommendation?: any;
  
  /**
   * Points to the previous version of this package, enforcing immutable lineage
   */
  previousVersionId?: string;
}
