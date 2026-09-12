import { RiskContext, RiskSignal } from '../models/index';
import { RiskPolicyCatalog } from '../policies/RiskPolicyCatalog';

export class EvolutionVolatilityAnalyzer {
  constructor(private readonly catalog: RiskPolicyCatalog) {}

  analyze(context: RiskContext): RiskSignal[] {
    const signals: RiskSignal[] = [];

    const evoSignals = context.advisorySignals.filter(s => s.category === 'EVOLUTION' && s.type === 'EVOLUTION_ACCELERATION');
    
    for (const signal of evoSignals) {
      const rule = this.catalog.getRuleForSignal('EVOLUTION_ACCELERATION');
      if (rule) {
        signals.push({
          id: `RISK-SIG-EVO-${signal.id}`,
          category: 'EVOLUTION',
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
