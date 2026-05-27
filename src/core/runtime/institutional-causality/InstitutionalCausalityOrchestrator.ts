import { HistoricalCycleData } from '../institutional-memory/types';
import {
  InstitutionalCausalityProfile,
  CycleMetrics,
  extractCycleMetrics,
  LOW_CONFIDENCE
} from './types';
import { CausalSequenceEngine } from './CausalSequenceEngine';
import { StructuralPropagationEngine } from './StructuralPropagationEngine';
import { LongitudinalRiskEngine } from './LongitudinalRiskEngine';
import { CausalConfidenceEngine } from './CausalConfidenceEngine';
import { GovernanceImpactChainEngine } from './GovernanceImpactChainEngine';
import { ExecutiveCausalNarrativeComposer } from './ExecutiveCausalNarrativeComposer';
import { InstitutionalGraphBuilder } from './InstitutionalGraphBuilder';
import { CausalLineageIntegrityEngine } from './CausalLineageIntegrityEngine';

export class InstitutionalCausalityOrchestrator {
  public static evaluate(runtimeHistory: HistoricalCycleData[]): InstitutionalCausalityProfile {
    const cycles = runtimeHistory || [];

    if (cycles.length < 3) {
      return {
        graph: { nodes: [], edges: [] },
        sequences: [],
        propagationVectors: [],
        longitudinalPatterns: [],
        confidenceProfile: {
          temporalConfidence: 0.0,
          structuralCoherenceConfidence: 0.0,
          evidenceDensityConfidence: 0.0,
          globalConfidence: LOW_CONFIDENCE
        },
        impactChains: [],
        narrative: 'Histórico insuficiente para inferência causal longitudinal.',
        lineageHash: 'EMPTY-HASH',
        propagationIntegrityHash: 'EMPTY-HASH',
        evidenceChainHash: 'EMPTY-HASH',
        historicalDensityRequirement: 'INSUFFICIENT'
      };
    }

    const sortedCycles = [...cycles].sort((a, b) => a.year - b.year);
    const metrics = sortedCycles.map(extractCycleMetrics);

    const confidenceProfile = CausalConfidenceEngine.evaluate(sortedCycles);
    const sequences = CausalSequenceEngine.detect(sortedCycles, metrics);
    const propagationVectors = StructuralPropagationEngine.detect(sortedCycles, metrics);
    const longitudinalPatterns = LongitudinalRiskEngine.detect(sortedCycles, metrics);
    const impactChains = GovernanceImpactChainEngine.build(sortedCycles, propagationVectors, longitudinalPatterns);

    const narrative = ExecutiveCausalNarrativeComposer.compose(
      sortedCycles,
      sequences,
      propagationVectors,
      longitudinalPatterns
    );

    const graph = InstitutionalGraphBuilder.build(sortedCycles, metrics, sequences, propagationVectors);
    const hashes = CausalLineageIntegrityEngine.generateHashes(sortedCycles, sequences, propagationVectors);

    return {
      graph,
      sequences,
      propagationVectors,
      longitudinalPatterns,
      confidenceProfile,
      impactChains,
      narrative,
      lineageHash: hashes.lineageHash,
      propagationIntegrityHash: hashes.propagationIntegrityHash,
      evidenceChainHash: hashes.evidenceChainHash,
      historicalDensityRequirement: 'SUFFICIENT'
    };
  }
}
