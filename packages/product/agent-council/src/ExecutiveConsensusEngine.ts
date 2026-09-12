import { AgentOpinionContract } from '@illumine/executive-contracts';

export interface ConsensusAnalysis {
  readonly consensusScore: number;
  readonly confidenceScore: number;
  readonly evidenceStrength: number;
  readonly alignmentScore: number;
  readonly conflictLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export class ExecutiveConsensusEngine {
  public static calculateConsensus(opinions: readonly AgentOpinionContract[]): ConsensusAnalysis {
    const total = opinions.length;
    const approveCount = opinions.filter(o => o.votedDecision === 'APPROVE').length;
    const reservationCount = opinions.filter(o => o.votedDecision === 'APPROVE_WITH_RESERVATIONS').length;

    const consensusScore = Math.round(((approveCount + reservationCount * 0.75) / total) * 100);
    const avgConfidence = Math.round(opinions.reduce((acc, o) => acc + o.confidenceScore, 0) / total);
    
    let conflictLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (reservationCount >= 2) conflictLevel = 'MEDIUM';
    if (opinions.some(o => o.votedDecision === 'REJECT')) conflictLevel = 'HIGH';

    return {
      consensusScore,
      confidenceScore: avgConfidence,
      evidenceStrength: 95.0,
      alignmentScore: consensusScore,
      conflictLevel
    };
  }
}
