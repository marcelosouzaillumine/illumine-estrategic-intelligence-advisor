import { RiskContext, RiskSignal } from '../models/index';
import { RiskPolicyCatalog } from '../policies/RiskPolicyCatalog';

export class DependencyExposureAnalyzer {
  constructor(private readonly catalog: RiskPolicyCatalog) {}

  analyze(context: RiskContext): RiskSignal[] {
    const signals: RiskSignal[] = [];

    const depSignals = context.advisorySignals.filter(s => s.category === 'DEPENDENCY' && s.type === 'DEPENDENCY_EXPANSION');
    
    for (const signal of depSignals) {
      const rule = this.catalog.getRuleForSignal('DEPENDENCY_EXPANSION');
      if (rule) {
        signals.push({
          id: `RISK-SIG-DEP-${signal.id}`,
          category: 'DEPENDENCY',
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
