import { ExecutiveIntelligenceReport } from '../runtime/executive-intelligence-runtime';
import { CalibrationEngine } from '../runtime/calibration/CalibrationEngine';

export type PresentationStage = 
  | 'SUMMARY' 
  | 'CONTEXT' 
  | 'FINANCIAL_HEALTH' 
  | 'CAUSALITY' 
  | 'PROPAGATION' 
  | 'MITIGATION_PLAN';

export interface BoardEvidenceData {
  lineageHash: string;
  connectorId: string;
  sourceProvenance: string;
  causalChain: { event: string; rootCause: string; impact: string };
  confidenceLevel: string;
  warnings: string[];
  runtimeMetadata: any;
  calibrationProfile: string;
  exportSnapshotReference?: string;
}

export class BoardPresentationRuntime {
  private currentStage: PresentationStage = 'SUMMARY';
  private evidenceModeEnabled: boolean = false;
  private activeReport: ExecutiveIntelligenceReport | null = null;
  private exportSnapshotId?: string;

  constructor(report: ExecutiveIntelligenceReport, exportSnapshotId?: string) {
    if (!report) {
      throw new Error('[Board Presentation] Relatório de inteligência executiva ativa obrigatório.');
    }
    this.activeReport = report;
    this.exportSnapshotId = exportSnapshotId || `EXP-${Date.now()}`;
  }

  public getStage(): PresentationStage {
    return this.currentStage;
  }

  public getReport(): ExecutiveIntelligenceReport {
    if (!this.activeReport) throw new Error('[Board Presentation] Nenhum relatório ativo.');
    return this.activeReport;
  }

  /**
   * Transition to next slide enforcing chronological governance sequence.
   * direct jumps SUMMARY -> MITIGATION_PLAN are strictly forbidden.
   */
  public transitionTo(targetStage: PresentationStage): void {
    const STAGE_ORDER: PresentationStage[] = [
      'SUMMARY',
      'CONTEXT',
      'FINANCIAL_HEALTH',
      'CAUSALITY',
      'PROPAGATION',
      'MITIGATION_PLAN'
    ];

    const currentIndex = STAGE_ORDER.indexOf(this.currentStage);
    const targetIndex = STAGE_ORDER.indexOf(targetStage);

    if (targetIndex === -1) {
      throw new Error(`[Board Presentation] Estágio de destino "${targetStage}" inválido.`);
    }

    // Free backward navigation, but strict step-by-step forward navigation
    if (targetIndex > currentIndex) {
      const diff = targetIndex - currentIndex;
      if (diff > 1) {
        throw new Error(`[Board Presentation] Saltos diretos proibidos: não é possível pular de ${this.currentStage} para ${targetStage}.`);
      }
    }

    this.currentStage = targetStage;
  }

  public enableEvidenceMode(enabled: boolean): void {
    this.evidenceModeEnabled = enabled;
  }

  public isEvidenceModeEnabled(): boolean {
    return this.evidenceModeEnabled;
  }

  /**
   * Compiles data for BOARD_EVIDENCE_MODE, gathering fiduciarily verified data
   * directly from the runtime outputs, with zero local recalculation.
   */
  public getEvidenceData(): BoardEvidenceData {
    if (!this.activeReport) {
      throw new Error('[Board Presentation] Não é possível expor evidências sem relatório ativo.');
    }

    const { compliance, runtimeMetadata, context, causality } = this.activeReport;

    const lineage = (runtimeMetadata as any)?.lineage as any;
    const lineageHash = lineage?.datasetHash || 'HASH-N/A';
    const connectorId = lineage?.connectorId || 'CONN-N/A';
    const userAgent = lineage?.timestamp || new Date().toISOString();
    const sourceProvenance = `Enviado por: ${lineage?.timestamp ? 'Importador Oficial' : 'Sandbox Mode'} | ${userAgent}`;

    const warnings = runtimeMetadata?.performance?.warnings || [];

    return {
      lineageHash,
      connectorId,
      sourceProvenance,
      causalChain: {
        event: causality?.event || 'N/A',
        rootCause: causality?.rootCause || 'N/A',
        impact: causality?.strategicImpact || 'N/A'
      },
      confidenceLevel: compliance.confidenceLevel,
      warnings,
      runtimeMetadata: {
        latencyMs: (runtimeMetadata as any)?.performance?.totalExecutionTimeMs || (runtimeMetadata as any)?.executionTimeMs || 0,
        recursionDepth: (runtimeMetadata as any)?.lineage?.depth || 0,
        loopsDetected: runtimeMetadata?.executionLoopsDetected || false
      },
      calibrationProfile: CalibrationEngine.getActiveProfileId(),
      exportSnapshotReference: this.exportSnapshotId
    };
  }
}
