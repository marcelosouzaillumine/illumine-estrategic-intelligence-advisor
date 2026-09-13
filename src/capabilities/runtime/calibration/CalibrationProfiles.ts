import { CalibrationParameters } from './CalibrationTypes';

export const CONSERVATIVE_PROFILE: CalibrationParameters = {
  confidenceCollapseThreshold: 0.55,
  confidenceDegradedThreshold: 0.75,
  stressPropagationSensitivity: 1.5,
  temporalCausalitySensitivity: 1.5,
  warningMaterialityThreshold: 0.02, // more strict
  scenarioVolatilityWeighting: 1.4,  // worse-case scenario emphasis
  advisoryVerbosity: 'high',
  degradedModeThresholdMs: 300,      // tighter limit
  advisoryAggressiveness: 0.7,       // cautious recommendations
  suppressedWarnings: []
};

export const BALANCED_PROFILE: CalibrationParameters = {
  confidenceCollapseThreshold: 0.45,
  confidenceDegradedThreshold: 0.65,
  stressPropagationSensitivity: 1.0,
  temporalCausalitySensitivity: 1.0,
  warningMaterialityThreshold: 0.05,
  scenarioVolatilityWeighting: 1.0,
  advisoryVerbosity: 'medium',
  degradedModeThresholdMs: 500,
  advisoryAggressiveness: 1.0,
  suppressedWarnings: []
};

export const AGGRESSIVE_PROFILE: CalibrationParameters = {
  confidenceCollapseThreshold: 0.35,
  confidenceDegradedThreshold: 0.55,
  stressPropagationSensitivity: 0.6,
  temporalCausalitySensitivity: 0.6,
  warningMaterialityThreshold: 0.10, // more tolerant
  scenarioVolatilityWeighting: 0.7,
  advisoryVerbosity: 'low',
  degradedModeThresholdMs: 800,
  advisoryAggressiveness: 1.5,
  suppressedWarnings: ['LOW_IMPORT_CONFIDENCE', 'MATERIALITY_THRESHOLD_EXCEEDED']
};

export const BOARD_MODE_PROFILE: CalibrationParameters = {
  confidenceCollapseThreshold: 0.50,
  confidenceDegradedThreshold: 0.70,
  stressPropagationSensitivity: 1.2,
  temporalCausalitySensitivity: 1.0,
  warningMaterialityThreshold: 0.05,
  scenarioVolatilityWeighting: 1.1,
  advisoryVerbosity: 'low',          // clean and short
  degradedModeThresholdMs: 400,
  advisoryAggressiveness: 0.8,
  suppressedWarnings: ['LOW_IMPORT_CONFIDENCE', 'MATERIALITY_THRESHOLD_EXCEEDED', 'POLICY_VERSION_MISMATCH']
};

export const ADVISOR_MODE_PROFILE: CalibrationParameters = {
  confidenceCollapseThreshold: 0.40,
  confidenceDegradedThreshold: 0.60,
  stressPropagationSensitivity: 1.3,
  temporalCausalitySensitivity: 1.4,
  warningMaterialityThreshold: 0.03,
  scenarioVolatilityWeighting: 1.2,
  advisoryVerbosity: 'high',         // detailed analysis
  degradedModeThresholdMs: 600,
  advisoryAggressiveness: 1.2,
  suppressedWarnings: []
};

export const CALIBRATION_PROFILES: Record<string, CalibrationParameters> = {
  conservative: CONSERVATIVE_PROFILE,
  balanced: BALANCED_PROFILE,
  aggressive: AGGRESSIVE_PROFILE,
  board_mode: BOARD_MODE_PROFILE,
  advisor_mode: ADVISOR_MODE_PROFILE
};
