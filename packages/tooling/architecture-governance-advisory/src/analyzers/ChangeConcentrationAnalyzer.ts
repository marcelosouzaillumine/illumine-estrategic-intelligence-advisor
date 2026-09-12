import { ArchitecturePatternAnalyzer } from './ArchitecturePatternAnalyzer';
import { AdvisoryContext, ArchitectureSignal } from '../models/index';

export class ChangeConcentrationAnalyzer implements ArchitecturePatternAnalyzer {
  analyze(context: AdvisoryContext): ArchitectureSignal[] {
    const signals: ArchitectureSignal[] = [];
    const obs = context.observations.find(o => o.metric === 'change-count' && Number(o.after) > 10);
    
    if (obs) {
      signals.push({
        id: `SIG-CHG-${Date.now()}`,
        category: 'EVOLUTION',
        subject: context.targetSubject,
        type: 'CHANGE_CONCENTRATION',
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
