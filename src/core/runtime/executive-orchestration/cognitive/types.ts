import { ExecutiveSeverity } from '../../executive/types';

export type ExecutiveAttentionPriority = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'IMMEDIATE';
export type ExecutiveNarrativeHierarchy = 'PRIMARY' | 'SECONDARY' | 'SUPPORTING' | 'CONTEXTUAL' | 'ARCHIVAL';
export type ExecutiveCognitiveLoadLevel = 'MINIMAL' | 'CONTROLLED' | 'ELEVATED' | 'SATURATED';
export type ExecutiveSignalDensity = 'LIGHT' | 'BALANCED' | 'DENSE' | 'OVERLOADED';
export type ExecutiveDecisionUrgency = 'MONITOR' | 'REVIEW' | 'ACTION_REQUIRED' | 'EXECUTIVE_INTERVENTION' | 'BOARD_INTERVENTION';
export type ExecutiveNarrativeCompression = 'FULL' | 'SUMMARIZED' | 'EXECUTIVE_BRIEF' | 'CRITICAL_ONLY';

export interface CognitiveSignal {
  id: string;
  sourceModule: string;
  title: string;
  description: string;
  timestamp: string;
  rawSeverity: ExecutiveSeverity | 'INFO' | 'OK';
  fiduciaryEscalation?: boolean;
  lineageHash?: string;
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  urgencyOverride?: ExecutiveDecisionUrgency;
}

export interface PrioritizedAttentionItem {
  signal: CognitiveSignal;
  priority: ExecutiveAttentionPriority;
  urgency: ExecutiveDecisionUrgency;
  focusWeight: number; // 0.0 to 1.0
  deferred: boolean;
}

export interface NarrativeHierarchyBlock {
  level1: string; // Immediate Executive Concern
  level2: string; // Structural Cause
  level3: string; // Operational Consequence
  level4: string; // Strategic Impact
  level5: string; // Recommended Executive Action
}
