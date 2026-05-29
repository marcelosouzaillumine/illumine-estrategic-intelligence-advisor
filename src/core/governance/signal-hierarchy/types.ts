import { GovernanceModuleDefinition } from '../moduleDefinitions';

import { RuntimeResolutionStatus } from '../types';
export type { RuntimeResolutionStatus };

export type SignalCategory = 
  | 'Financial' 
  | 'Operational' 
  | 'Fiduciary' 
  | 'Compliance' 
  | 'Strategic'
  | 'Cultural'
  | 'Tenant_Security';

export type SignalSeverity = 
  | 'CRITICAL' 
  | 'HIGH' 
  | 'MEDIUM' 
  | 'LOW';

export type FiduciaryCriticality = 
  | 'SEVERE_BREACH' 
  | 'ELEVATED_RISK' 
  | 'STANDARD_MONITORING' 
  | 'NO_IMPACT';

export type CognitivePriority = 
  | 'IMMEDIATE_ACTION' 
  | 'BOARD_AWARENESS' 
  | 'EXECUTIVE_SUMMARY' 
  | 'BACKGROUND_LOG';

export interface GovernanceSignal {
  id: string;
  sourceModule: string; // From moduleDefinitions ids
  category: SignalCategory;
  severity: SignalSeverity;
  fiduciaryCriticality: FiduciaryCriticality;
  cognitivePriority: CognitivePriority;
  escalationRequired: boolean;
  timestamp: string;
  causalDependencies?: string[];
  metadata?: Record<string, any>;
  message?: string;
}

export interface SignalEngineResolution<T> {
  status: RuntimeResolutionStatus;
  data: T | null;
  reason?: string;
}
