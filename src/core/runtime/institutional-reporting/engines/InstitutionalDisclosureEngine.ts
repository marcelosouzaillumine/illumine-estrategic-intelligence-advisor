// src/core/runtime/institutional-reporting/engines/InstitutionalDisclosureEngine.ts

import { ExecutiveIntelligenceReport } from '../../executive-intelligence-runtime';
import { InstitutionalDisclosure, ReportGenerationMetadata, FiduciaryRestriction } from '../institutional-reporting-types';

export class InstitutionalDisclosureEngine {
  
  public static generate(report: ExecutiveIntelligenceReport, metadata: ReportGenerationMetadata): InstitutionalDisclosure[] {
    const disclosures: InstitutionalDisclosure[] = [];

    disclosures.push({
      disclosureId: 'DISC_IMMUTABLE_SNAPSHOT',
      statement: 'This document represents a frozen, immutable snapshot of the institutional runtime. Future dynamic recalibrations will not alter this artifact.',
      severity: 'INFO'
    });

    if (metadata.historicalCyclesAvailable < 2) {
      disclosures.push({
        disclosureId: 'DISC_INSUFFICIENT_HISTORY',
        statement: 'The institution operates with insufficient historical longitudinal data. All predictive and trajectory analyses are forcibly deactivated (Fail-Closed).',
        severity: 'WARNING'
      });
    }

    if (!metadata.confidenceThresholdMet) {
      disclosures.push({
        disclosureId: 'DISC_LOW_CONFIDENCE',
        statement: 'Core strategic intelligence engines have restricted confidence scores. Outputs are explicitly limited to observable facts.',
        severity: 'CRITICAL'
      });
    }

    return disclosures;
  }

  public static generateRestrictions(report: ExecutiveIntelligenceReport, metadata: ReportGenerationMetadata): FiduciaryRestriction[] {
    const restrictions: FiduciaryRestriction[] = [];

    if (metadata.historicalCyclesAvailable < 2) {
      restrictions.push({
        restrictionType: 'INSUFFICIENT_HISTORY',
        description: 'Less than 2 verified cycles available for interpretation.',
        affectedRuntimes: ['Strategic Direction', 'Longitudinal Trajectory', 'Predictive Early Warning']
      });
    }

    const runtimeMetadataAny = report.runtimeMetadata as any;
    if (!report.runtimeMetadata || !runtimeMetadataAny.lineageHash) {
      restrictions.push({
        restrictionType: 'UNVERIFIABLE_LINEAGE',
        description: 'Missing cryptographic lineage trace.',
        affectedRuntimes: ['ALL']
      });
    }

    return restrictions;
  }

}
