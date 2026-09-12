import { sha256 } from '../../../workspace/runtime/executive/types';
import { HistoricalCycleData } from '../institutional-memory/types';
import { GovernanceImpactChain, StructuralPropagationVector, LongitudinalRiskPattern } from './types';

export class GovernanceImpactChainEngine {
  public static build(
    cycles: HistoricalCycleData[],
    propagationVectors: StructuralPropagationVector[],
    longitudinalPatterns: LongitudinalRiskPattern[]
  ): GovernanceImpactChain[] {
    if (cycles.length < 3) return [];

    const chains: GovernanceImpactChain[] = [];

    const hasStockLiq = propagationVectors.some(v => v.vectorId === 'VEC-STOCK-LIQ');
    const hasLiqSup = propagationVectors.some(v => v.vectorId === 'VEC-LIQ-SUP');
    const hasSupEq = propagationVectors.some(v => v.vectorId === 'VEC-SUP-EQ');
    const hasLiqDecline = longitudinalPatterns.some(p => p.patternId === 'PAT-LIQ-DECLINE');

    if (hasLiqSup && (hasLiqDecline || hasStockLiq)) {
      const desc = 'A dependência recorrente de fornecedores apresentou associação com a deterioração gradual da liquidez operacional e o aumento da pressão sobre o capital de giro.';
      const lineageHash = sha256(`LINEAGE-CHA-SUP-LIQ-${cycles.map(c => c.year).join('-')}`);
      const evidenceChainHash = sha256(`EVIDENCE-CHA-SUP-LIQ-${desc}`);
      chains.push({
        chainId: 'CHA-SUP-LIQ-NWC',
        description: desc,
        lineageHash,
        evidenceChainHash
      });
    }

    if (hasStockLiq && hasSupEq) {
      const desc = 'O acúmulo de estoques excessivos foi acompanhado por maior dependência de fornecedores e redução na autonomia patrimonial.';
      const lineageHash = sha256(`LINEAGE-CHA-STOCK-EQ-${cycles.map(c => c.year).join('-')}`);
      const evidenceChainHash = sha256(`EVIDENCE-CHA-STOCK-EQ-${desc}`);
      chains.push({
        chainId: 'CHA-STOCK-SUP-EQ',
        description: desc,
        lineageHash,
        evidenceChainHash
      });
    }

    return chains;
  }
}
