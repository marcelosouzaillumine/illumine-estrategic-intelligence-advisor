// src/core/runtime/institutional-reporting/engines/ExecutiveReportExportEngine.ts

import { ExecutiveIntelligenceReport } from '../../executive-intelligence-runtime';
import { ReportVariant } from '../institutional-reporting-types';
import { InstitutionalBoardPackDocumentRuntime, InstitutionalBoardPackDocumentOutput } from '../InstitutionalBoardPackDocumentRuntime';

export class ExecutiveReportExportEngine {
  
  /**
   * Orchestrates the export of the Executive Report to various variants.
   */
  public static export(report: ExecutiveIntelligenceReport, targetVariant: ReportVariant): InstitutionalBoardPackDocumentOutput {
    // 1. Validate payload basics before export
    if (!report) {
      throw new Error('Fiduciary Governance: Cannot export undefined report.');
    }

    // 2. Delegate to Agnostic Document Runtime
    const documentAgnostic = InstitutionalBoardPackDocumentRuntime.generateDocument(report, targetVariant);

    // 3. (Future) Implement Specific Renderer Handlers (e.g. PDF, Word)
    // For now, we return the agnostic payload that any renderer can consume

    return documentAgnostic;
  }

  public static exportAllVariants(report: ExecutiveIntelligenceReport): Record<ReportVariant, InstitutionalBoardPackDocumentOutput> {
    return {
      'BANKING': this.export(report, 'BANKING'),
      'INVESTOR': this.export(report, 'INVESTOR'),
      'AUDIT': this.export(report, 'AUDIT'),
      'TURNAROUND': this.export(report, 'TURNAROUND'),
      'BOARD': this.export(report, 'BOARD'),
      'MANAGEMENT': this.export(report, 'MANAGEMENT')
    };
  }
}
