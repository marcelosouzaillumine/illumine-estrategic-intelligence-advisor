import { ExecutiveIntelligenceReport } from '../runtime/executive-intelligence-runtime';
import { ExecutiveDeliveryOrchestrator, DeliveryStep, StepContent } from './ExecutiveDeliveryOrchestrator';

export interface BoardEvidenceData {
  datasetHash: string;
  tenantId: string;
  executionId: string;
  calibrationProfile: string;
  confidenceLevel: string;
  dataCompleteness: number;
  auditFlags: string[];
  narrativeRestrictions: string[];
  timestamp: string;
  reportVersion: string;
}

export interface BoardJourneyState {
  isFullscreenActive: boolean;
  currentStepIndex: number;
  steps: StepContent[];
  evidenceModeActive: boolean;
}

export class GuidedBoardJourneyRuntime {
  private report: ExecutiveIntelligenceReport;
  private state: BoardJourneyState;
  private listeners: (() => void)[] = [];

  constructor(report: ExecutiveIntelligenceReport) {
    if (!report) {
      throw new Error('[Guided Board Journey] Relatório contábil-financeiro é obrigatório.');
    }
    this.report = report;
    this.state = {
      isFullscreenActive: false,
      currentStepIndex: 0,
      steps: ExecutiveDeliveryOrchestrator.orchestrate(report),
      evidenceModeActive: false,
    };
  }

  public getReport(): ExecutiveIntelligenceReport {
    return this.report;
  }

  public getState(): BoardJourneyState {
    return { ...this.state };
  }

  public startJourney(): void {
    this.state.isFullscreenActive = true;
    this.state.currentStepIndex = 0;
    this.notify();
  }

  public exitJourney(): void {
    this.state.isFullscreenActive = false;
    this.notify();
  }

  public nextStep(): void {
    if (this.state.currentStepIndex < this.state.steps.length - 1) {
      this.state.currentStepIndex++;
      this.notify();
    }
  }

  public prevStep(): void {
    if (this.state.currentStepIndex > 0) {
      this.state.currentStepIndex--;
      this.notify();
    }
  }

  public goToStep(index: number): void {
    if (index >= 0 && index < this.state.steps.length) {
      this.state.currentStepIndex = index;
      this.notify();
    }
  }

  public toggleEvidenceMode(active?: boolean): void {
    this.state.evidenceModeActive = active !== undefined ? active : !this.state.evidenceModeActive;
    this.notify();
  }

  /**
   * BOARD_EVIDENCE_MODE
   * Exposes raw fiduciarily auditable evidence from the core runtime.
   * STRICTLY PASSIVE: DOES NOT INTERPRET THE EVIDENCE.
   */
  public getBoardEvidence(): BoardEvidenceData {
    const rMeta = this.report.runtimeMetadata as any;
    const lineage = rMeta?.lineage as any;
    
    return {
      datasetHash: lineage?.datasetHash || 'HASH-N/A',
      tenantId: lineage?.tenantId || 'SANDBOX-TENANT',
      executionId: rMeta?.importId || 'EXEC-N/A',
      calibrationProfile: this.report.runtimeMetadata?.calibrationProfileId || 'balanced',
      confidenceLevel: this.report.compliance?.confidenceLevel || 'MEDIUM_CONFIDENCE',
      dataCompleteness: this.report.compliance?.dataCompleteness || 0,
      auditFlags: this.report.compliance?.auditFlags || [],
      narrativeRestrictions: this.report.compliance?.narrativeRestrictions || [],
      timestamp: rMeta?.timestamp || new Date().toISOString(),
      reportVersion: this.report.runtimeMetadata?.engineVersion || 'RC-1',
    };
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }
}
