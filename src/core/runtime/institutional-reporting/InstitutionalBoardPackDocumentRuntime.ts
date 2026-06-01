// src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.ts

import { ExecutiveIntelligenceReport } from '../executive-intelligence-runtime';
import { FiduciaryNarrativeFormattingEngine } from './engines/FiduciaryNarrativeFormattingEngine';
import { BoardPackLineageHash } from '../shared/lineage-types';

export type ReportVariant = 'BANKING' | 'INVESTOR' | 'AUDIT' | 'TURNAROUND' | 'BOARD' | 'MANAGEMENT';

export interface InstitutionalBoardPackDocumentOutput {
  status: 'COMPLETE' | 'RESTRICTED' | 'FAILED';
  structuredJson: Record<string, unknown>;
  markdownSections: Record<string, string>;
  reportVariant: ReportVariant;
  lineageHash: BoardPackLineageHash | 'FAILED_GENERATION';
  confidence: 'HIGH' | 'MODERATE' | 'LOW' | 'BLOCKED';
  restrictions: unknown[];
  narrativeBlocks: Record<string, string>;
  evidenceAppendix: unknown[];
  auditTrail: string[];
  exportMetadata: {
    generatedAt: string;
    variant: ReportVariant;
    tenantId: string;
    cycleReference: string;
  };
}

export class InstitutionalBoardPackDocumentRuntime {
  
  public static generateDocument(report: ExecutiveIntelligenceReport, variant: ReportVariant): InstitutionalBoardPackDocumentOutput {
    const isRestricted = this.hasRestrictions(report);
    const status = (report as unknown as { institutionalStability?: { stabilityClassification?: string } }).institutionalStability?.stabilityClassification === 'BLOCKED_BY_ACCOUNTING_INTEGRITY' ? 'FAILED' : (isRestricted ? 'RESTRICTED' : 'COMPLETE');
    
    let confidence: 'HIGH' | 'MODERATE' | 'LOW' | 'BLOCKED' = 'HIGH';
    if (status === 'FAILED') confidence = 'BLOCKED';
    else if (status === 'RESTRICTED') confidence = 'LOW';

    const rawNarrative = report.strategicIntelligence?.thesis.unifiedThesisStatement || 'Narrative missing.';
    const formattedNarrative = FiduciaryNarrativeFormattingEngine.format(report, rawNarrative, variant);

    const lineageHash = ((report.runtimeMetadata as unknown as { lineageHash?: string })?.lineageHash) || 'FAILED_GENERATION';

    return {
      status,
      structuredJson: { ...report },
      markdownSections: {
        thesis: `## Institutional Thesis\n\n${formattedNarrative}`,
        restrictions: `## Restrictions\n\n${isRestricted ? 'ACTIVE' : 'NONE'}`
      },
      reportVariant: variant,
      lineageHash: lineageHash as BoardPackLineageHash,
      confidence,
      restrictions: isRestricted ? [{ description: 'Restricted Fiduciary Status Active' }] : [],
      narrativeBlocks: {
        executiveSummary: FiduciaryNarrativeFormattingEngine.format(report, 'Executive Summary: ' + formattedNarrative, variant)
      },
      evidenceAppendix: (report as unknown as { institutionalStability?: { evidenceTrail?: unknown[] } }).institutionalStability?.evidenceTrail || [],
      auditTrail: [],
      exportMetadata: {
        generatedAt: new Date().toISOString(),
        variant,
        tenantId: report.institutionalContext.tenantId || 'UNKNOWN',
        cycleReference: report.institutionalContext.currentCycle || 'UNKNOWN'
      }
    };
  }

  private static hasRestrictions(report: ExecutiveIntelligenceReport): boolean {
    const trajectory = report.longitudinalCashIntelligence?.trajectoryClassification;
    if (trajectory && ['ARTIFICIAL_TURNAROUND', 'CHRONIC_DEPENDENCY', 'PROGRESSIVE_DETERIORATION'].includes(trajectory)) {
      return true;
    }
    if (report.strategicIntelligence?.posture === 'UNVERIFIABLE_POSTURE') {
      return true;
    }
    return false;
  }
}
