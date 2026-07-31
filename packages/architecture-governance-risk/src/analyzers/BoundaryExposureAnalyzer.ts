import { RiskContext, RiskSignal } from '../models/index';
import { RiskPolicyCatalog } from '../policies/RiskPolicyCatalog';

export class BoundaryExposureAnalyzer {
  constructor(private readonly catalog: RiskPolicyCatalog) {}

  analyze(context: RiskContext): RiskSignal[] {
    const signals: RiskSignal[] = [];

    const boundSignals = context.advisorySignals.filter(s => s.category === 'BOUNDARY' && s.type === 'BOUNDARY_EXPANSION');
    
    for (const signal of boundSignals) {
      const rule = this.catalog.getRuleForSignal('BOUNDARY_EXPANSION');
      if (rule) {
        signals.push({
          id: `RISK-SIG-BND-${signal.id}`,
          category: 'BOUNDARY',
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
