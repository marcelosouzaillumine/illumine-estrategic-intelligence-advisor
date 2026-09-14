import { ArchitecturePatternAnalyzer } from './ArchitecturePatternAnalyzer';
import { AdvisoryContext, ArchitectureSignal } from '../models/index';

export class DependencyTopologyAnalyzer implements ArchitecturePatternAnalyzer {
  analyze(context: AdvisoryContext): ArchitectureSignal[] {
    const signals: ArchitectureSignal[] = [];

    // Lógica determinística e matemática pura para identificar topologias
    const obs = context.observations.find(o => o.metric === 'fan-out' && Number(o.after) > 15);
    
    if (obs) {
      signals.push({
        id: `SIG-DEP-${Date.now()}`,
        category: 'DEPENDENCY',
        subject: context.targetSubject,
        type: 'DEPENDENCY_EXPANSION',
        confidence: 'HIGH',
        evidenceGraph: {
          nodes: [{ id: obs.id, type: 'EVALUATION', referenceId: obs.id }],
          edges: []
        }
      });
    }

    return signals;
  }
}
