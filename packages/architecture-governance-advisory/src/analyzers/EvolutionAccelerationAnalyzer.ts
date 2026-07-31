import { ArchitecturePatternAnalyzer } from './ArchitecturePatternAnalyzer';
import { AdvisoryContext, ArchitectureSignal } from '../models/index';

export class EvolutionAccelerationAnalyzer implements ArchitecturePatternAnalyzer {
  analyze(context: AdvisoryContext): ArchitectureSignal[] {
    const signals: ArchitectureSignal[] = [];
    
    // Simplificação mock para a fundação: detecta se existem muitos observations numa janela curta
    if (context.observations.length > 5) {
      signals.push({
        id: `SIG-ACC-${Date.now()}`,
        category: 'EVOLUTION',
        subject: context.targetSubject,
        type: 'EVOLUTION_ACCELERATION',
        confidence: 'MEDIUM',
        evidenceGraph: {
          nodes: context.observations.map(o => ({ id: o.id, type: 'EVOLUTION', referenceId: o.id })),
          edges: []
        }
      });
    }

    return signals;
  }
}
