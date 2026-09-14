import { StagingValidationWarning } from '../../../capabilities/runtime/integrations/IntegrationGovernanceTypes';

export type AdvisoryVerbosity = 'low' | 'medium' | 'high';

export interface CalibrationParameters {
  confidenceCollapseThreshold: number; // e.g. 0.45
  confidenceDegradedThreshold: number; // e.g. 0.65
  stressPropagationSensitivity: number; // e.g. 1.0 (multiplier)
  temporalCausalitySensitivity: number; // e.g. 1.0 (multiplier)
  warningMaterialityThreshold: number; // e.g. 0.05 (5%)
  scenarioVolatilityWeighting: number; // e.g. 1.0
  advisoryVerbosity: AdvisoryVerbosity;
  degradedModeThresholdMs: number; // e.g. 500ms
  advisoryAggressiveness: number; // e.g. 1.0
  suppressedWarnings: StagingValidationWarning[];
}

export interface CalibrationParameterDiff {
  parameter: keyof CalibrationParameters;
  before: any;
  after: any;
}

export interface CalibrationProfileVersion {
  profileId: string;
  version: string;
  createdAt: string;
  actorId: string;
  rationale: string;
  diff: CalibrationParameterDiff[];
  previousVersion?: string;
}

// Critical Warnings that can never be hidden or suppressed under any circumstances
export const NON_SUPPRESSIBLE_WARNINGS: StagingValidationWarning[] = [
  'INVALID_BALANCE_SHEET',
  'SIGN_INVERSION',
  'CASHFLOW_MISMATCH',
  'HIERARCHY_BREAK',
  'INCOMPLETE_DATASET'
];
