// src/core/runtime/institutional-reporting/engines/InstitutionalDisclosureEngine.ts

import { ExecutiveIntelligenceReport } from '../../executive-intelligence-runtime';
import { BoardPackMetadata, FiduciaryRestriction, ReportGenerationStatus } from '../institutional-reporting-types';
import { InstitutionalDisclosure, RuntimeSeverity } from '../../shared/runtime-contracts';

export class InstitutionalDisclosureEngine {
  
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

    const runtimeMetadataAny = report.runtimeMetadata as unknown as { lineageHash?: string };
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
