// src/core/runtime/lifecycle/LifecycleConsistencyValidator.ts

import { SemanticLifecycleProfile } from './LifecycleSemanticAuthority';

export interface ConsistencyValidationResult {
  isValid: boolean;
  violations: Array<{
    rule: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    message: string;
    blocked: boolean;
  }>;
}

export class LifecycleConsistencyValidator {
  public static validate(
    profile: SemanticLifecycleProfile,
    textsToValidate: string[]
  ): ConsistencyValidationResult {
    const violations: ConsistencyValidationResult['violations'] = [];
    const isEarly = profile.lifecycleStage === 'INITIAL_CAPITALIZATION' || profile.lifecycleStage === 'EARLY_GROWTH';

    if (isEarly && profile.forbiddenLabels.length > 0) {
      for (const text of textsToValidate) {
        if (!text) continue;
        const normalizedText = text.toLowerCase();
        
        for (const forbidden of profile.forbiddenLabels) {
          const normalizedForbidden = forbidden.toLowerCase();
          if (normalizedText.includes(normalizedForbidden)) {
            violations.push({
              rule: 'EARLY_STAGE_SEMANTIC_CONTRADICTION',
              severity: 'CRITICAL',
              message: `Violação Semântica: O termo proibido '${forbidden}' foi detectado em ambiente de fase inicial (${profile.lifecycleStage}).`,
              blocked: true
            });
          }
        }
      }
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }
}
