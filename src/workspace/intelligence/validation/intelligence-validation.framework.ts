import { CFO_METRIC_RULES } from './metric-validation.rules';
import { CFO_ANOMALY_RULES } from './anomaly-detection.rules';

export interface ValidationResult {
  metricValidations: { metric: string; status: 'valid' | 'invalid'; error?: string }[];
  anomaliesDetected: { id: string; type: 'warning' | 'critical'; message: string }[];
  isValid: boolean;
}

export class IntelligenceValidationFramework {
  
  static validateSnapshot(snapshotPayload: any): ValidationResult {
    const result: ValidationResult = {
      metricValidations: [],
      anomaliesDetected: [],
      isValid: true
    };

    // 1. Metric Integrity
    const ebitdaMargin = snapshotPayload.performance?.ebitda?.margin;
    if (ebitdaMargin !== undefined) {
      const rule = CFO_METRIC_RULES.find(r => r.metric === 'ebitdaMargin');
      if (rule && (ebitdaMargin < rule.expectedRange.min || ebitdaMargin > rule.expectedRange.max)) {
        result.metricValidations.push({ metric: 'ebitdaMargin', status: 'invalid', error: 'Out of bounds' });
        result.isValid = false;
      } else {
        result.metricValidations.push({ metric: 'ebitdaMargin', status: 'valid' });
      }
    }

    // 2. Anomaly Detection
    CFO_ANOMALY_RULES.forEach(rule => {
      if (rule.condition(snapshotPayload)) {
        result.anomaliesDetected.push({
          id: rule.id,
          type: rule.alertType,
          message: rule.message
        });
      }
    });

    return result;
  }
}
