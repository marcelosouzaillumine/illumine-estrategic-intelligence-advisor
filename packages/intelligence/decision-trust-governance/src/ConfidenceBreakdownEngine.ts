import { DecisionTrustContract } from '@illumine/executive-contracts';

export class ConfidenceBreakdownEngine {
  public static summarizeBreakdown(trustContract: DecisionTrustContract): string {
    const bd = trustContract.confidenceBreakdown;
    return `Score de Confiança Global (${trustContract.overallConfidenceScore}%): Dados (${bd.dataQualityScore}%), Histórico (${bd.historicalVolumeScore}%), Benchmark (${bd.benchmarkCoverageScore}%), Consenso do Conselho (${bd.councilConsensusScore}%).`;
  }
}
