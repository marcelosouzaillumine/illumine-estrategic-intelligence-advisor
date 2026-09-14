import { ArchitecturePatternAnalyzer } from './ArchitecturePatternAnalyzer';
import { AdvisoryContext, ArchitectureSignal } from '../models/index';

export class BoundaryEvolutionAnalyzer implements ArchitecturePatternAnalyzer {
  analyze(context: AdvisoryContext): ArchitectureSignal[] {
    const signals: ArchitectureSignal[] = [];
    const obs = context.observations.find(o => o.metric === 'boundary-contracts' && Number(o.after) > Number(o.before));
    
    if (obs) {
      signals.push({
        id: `SIG-BND-${Date.now()}`,
        category: 'BOUNDARY',
        subject: context.targetSubject,
        type: 'BOUNDARY_EXPANSION',
        confidence: 'HIGH',
        evidenceGraph: {
          nodes: [{ id: obs.id, type: 'EVOLUTION', referenceId: obs.id }],
          edges: []
        }
      });
    }

    return signals;
  }
}
