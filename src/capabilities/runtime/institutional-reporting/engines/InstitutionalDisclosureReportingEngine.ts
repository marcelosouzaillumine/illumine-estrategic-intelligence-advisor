// src/core/runtime/institutional-reporting/engines/InstitutionalDisclosureEngine.ts

import { ExecutiveIntelligenceReport } from '../../../../core/runtime/executive-intelligence-runtime';
import { BoardPackMetadata, FiduciaryRestriction, ReportGenerationStatus } from '../institutional-reporting-types';
import { InstitutionalDisclosure, RuntimeSeverity } from '../../../../core/runtime/shared/runtime-contracts';

export class InstitutionalDisclosureReportingEngine {
  
  public static generate(report: ExecutiveIntelligenceReport, metadata: BoardPackMetadata): InstitutionalDisclosure[] {
    const disclosures: InstitutionalDisclosure[] = [];

    disclosures.push({
      disclosureId: 'DISC_IMMUTABLE_SNAPSHOT',
      message: 'This document represents a frozen, immutable snapshot of the institutional runtime. Future dynamic recalibrations will not alter this artifact.',
      severity: 'MODERATE',
      disclosureType: 'LIMITATION',
      sourceRuntime: 'InstitutionalReporting',
      restrictionLevel: 'NONE'
    });

    return disclosures;
  }

  public static generateRestrictions(report: ExecutiveIntelligenceReport, metadata: BoardPackMetadata): FiduciaryRestriction[] {
    const restrictions: FiduciaryRestriction[] = [];

    const runtimeMetadataAny = report.runtimeMetadata as unknown as { lineageHash?: string, historicalCyclesAvailable?: number };
    if (!report.runtimeMetadata || !runtimeMetadataAny.lineageHash) {
      restrictions.push({
        restrictionType: 'UNVERIFIABLE_LINEAGE',
        description: 'Missing cryptographic lineage trace.',
        affectedRuntimes: ['ALL']
      });
    }

    // Append restrictions from the compliance/fiduciary enforcement layer
    if (report.compliance?.fiduciaryEnforcement?.fiduciaryRestrictions) {
      restrictions.push(...(report.advisory?.fiduciaryEnforcement?.fiduciaryRestrictions || report.compliance?.fiduciaryEnforcement?.fiduciaryRestrictions || []));
    }

    const historicalCycles = runtimeMetadataAny.historicalCyclesAvailable || 0;
    if (historicalCycles > 0 && historicalCycles < 2) {
      if (!restrictions.some(r => r.restrictionType === 'INSUFFICIENT_HISTORY')) {
        restrictions.push({
          restrictionType: 'INSUFFICIENT_HISTORY',
          description: 'Insuficiência de histórico operacional e ciclos fiduciários.',
          affectedRuntimes: ['all']
        });
      }
    }

    return restrictions;
  }

}
