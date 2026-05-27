import { HistoricalCycleData } from '../institutional-memory/types';
import {
  InstitutionalCausalityNode,
  InstitutionalAssociationEdge,
  InstitutionalCausalityGraph,
  CycleMetrics,
  CausalSequence,
  StructuralPropagationVector
} from './types';

export class InstitutionalGraphBuilder {
  public static build(
    cycles: HistoricalCycleData[],
    metrics: CycleMetrics[],
    sequences: CausalSequence[],
    propagationVectors: StructuralPropagationVector[]
  ): InstitutionalCausalityGraph {
    if (cycles.length < 3) {
      return { nodes: [], edges: [] };
    }

    const nodes: InstitutionalCausalityNode[] = [];
    const edges: InstitutionalAssociationEdge[] = [];

    // 1. Add Nodes for metrics alerts & events in each year
    for (const m of metrics) {
      nodes.push({
        id: `METRIC-LC-${m.year}`,
        type: 'METRIC_ALERT',
        label: `Liquidez Corrente: ${m.liqCorrente.toFixed(2)}`,
        cycleYear: m.year
      });

      nodes.push({
        id: `METRIC-SCORE-${m.year}`,
        type: 'METRIC_ALERT',
        label: `Score Composto: ${m.compositeScore}`,
        cycleYear: m.year
      });
    }

    // 2. Add Nodes and Edges for sequences
    for (const seq of sequences) {
      for (const step of seq.steps) {
        const nodeId = `SEQ-NODE-${step.cycleYear}-${step.eventDescription.replace(/\s+/g, '-').toUpperCase()}`;
        if (!nodes.some(n => n.id === nodeId)) {
          nodes.push({
            id: nodeId,
            type: 'EVENT',
            label: step.eventDescription,
            cycleYear: step.cycleYear
          });
        }
      }

      for (let i = 0; i < seq.steps.length - 1; i++) {
        const step1 = seq.steps[i];
        const step2 = seq.steps[i + 1];
        const sourceId = `SEQ-NODE-${step1.cycleYear}-${step1.eventDescription.replace(/\s+/g, '-').toUpperCase()}`;
        const targetId = `SEQ-NODE-${step2.cycleYear}-${step2.eventDescription.replace(/\s+/g, '-').toUpperCase()}`;
        
        edges.push({
          source: sourceId,
          target: targetId,
          relationType: 'TEMPORAL_PRECEDENCE',
          confidence: seq.confidence
        });
      }
    }

    // 3. Add Nodes and Edges for propagation vectors
    for (const vec of propagationVectors) {
      const nodeId = `PROP-VEC-${vec.vectorId}`;
      nodes.push({
        id: nodeId,
        type: 'STRUCTURAL_STRAIN',
        label: vec.description,
        cycleYear: metrics[metrics.length - 1].year
      });

      const year = metrics[metrics.length - 1].year;
      edges.push({
        source: `METRIC-LC-${year}`,
        target: nodeId,
        relationType: 'STRUCTURAL_PROPAGATION',
        confidence: 0.9
      });
    }

    return { nodes, edges };
  }
}
