import { RiskContext, RiskSignal } from '../models/index';
import { RiskPolicyCatalog } from '../policies/RiskPolicyCatalog';

export class CertificationExposureAnalyzer {
  constructor(private readonly catalog: RiskPolicyCatalog) {}

  analyze(context: RiskContext): RiskSignal[] {
    const signals: RiskSignal[] = [];

    // Lógica similar de filtro
    const certSignals = context.advisorySignals.filter(s => s.category === 'CERTIFICATION' && s.type === 'CERTIFICATION_DECAY');
    
    for (const signal of certSignals) {
      const rule = this.catalog.getRuleForSignal('CERTIFICATION_DECAY');
      if (rule) {
        signals.push({
          id: `RISK-SIG-CERT-${signal.id}`,
          category: 'CERTIFICATION',
          sourceSignalId: signal.id,
          evidence: [`Advisory Signal ${signal.id} categorized as ${rule.name}`],
          magnitude: rule.getMagnitude(signal.confidence),
          confidence: signal.confidence
        });
      }
    }

    return signals;
  }
}
