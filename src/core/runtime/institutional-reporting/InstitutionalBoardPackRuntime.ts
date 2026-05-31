// src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts

import { ExecutiveIntelligenceReport } from '../executive-intelligence-runtime';
import { InstitutionalBoardPackOutput, ReportGenerationStatus, ReportGenerationMetadata } from './institutional-reporting-types';
import { ExecutiveSnapshotEngine } from './engines/ExecutiveSnapshotEngine';
import { GovernanceReportingEngine } from './engines/GovernanceReportingEngine';
import { StrategicDirectionReportingEngine } from './engines/StrategicDirectionReportingEngine';
import { TreasuryPressureReportingEngine } from './engines/TreasuryPressureReportingEngine';
import { ContinuityReportingEngine } from './engines/ContinuityReportingEngine';
import { OperationalGovernanceReportingEngine } from './engines/OperationalGovernanceReportingEngine';
import { ExecutiveDirectiveReportingEngine } from './engines/ExecutiveDirectiveReportingEngine';
import { InstitutionalExplainabilityAppendixEngine } from './engines/InstitutionalExplainabilityAppendixEngine';
import { InstitutionalLineageAppendixEngine } from './engines/InstitutionalLineageAppendixEngine';
import { InstitutionalDisclosureEngine } from './engines/InstitutionalDisclosureEngine';
import { BoardResolutionAppendixEngine } from './engines/BoardResolutionAppendixEngine';
import { RuntimeComplianceEngine } from '../compliance/RuntimeComplianceEngine';

export class InstitutionalBoardPackRuntime {
  
  public static generate(report: ExecutiveIntelligenceReport): InstitutionalBoardPackOutput {
    
    // 1. Core Validate
    const runtimeMetadataAny = report.runtimeMetadata as any;
    if (!report.runtimeMetadata || !runtimeMetadataAny.lineageHash) {
      return this.createFailedReport('MISSING_LINEAGE_HASH');
    }

    if (!report.strategicIntelligence || !report.operationalGovernance || !report.executiveCommand) {
      return this.createFailedReport('INCOMPLETE_FIDUCIARY_LAYER');
    }

    // 2. Metadata & Lineage Verification
    const historicalCycles = runtimeMetadataAny.historicalCyclesAvailable || 0;
    const isFailClosed = historicalCycles < 2 || report.strategicIntelligence.posture === 'UNVERIFIABLE_POSTURE';
    
    // Hash do Board Pack gerado a partir do Hash do Executive Report
    const boardPackLineageHash = this.generateHash('BOARD_PACK', {
      sourceHash: runtimeMetadataAny.lineageHash,
      timestamp: new Date().toISOString()
    });

    const contextAny = report.institutionalContext as any;
    const metadata: ReportGenerationMetadata = {
      boardPackLineageHash,
      generationTimestamp: new Date().toISOString(),
      tenantId: contextAny.tenantId || "N/A",
      cycleReference: contextAny.currentCycle || "N/A",
      isImmutableSnapshot: true,
      confidenceThresholdMet: !isFailClosed,
      historicalCyclesAvailable: historicalCycles
    };

    const status: ReportGenerationStatus = isFailClosed ? 'RESTRICTED' : 'COMPLETE';

    // 3. Assemble Core Engines
    const executiveSnapshot = ExecutiveSnapshotEngine.generate(report);
    const governanceReport = GovernanceReportingEngine.generate(report);
    const strategicDirection = StrategicDirectionReportingEngine.generate(report);
    const treasuryReport = TreasuryPressureReportingEngine.generate(report);
    const continuityReport = ContinuityReportingEngine.generate(report);
    const operationalGovernance = OperationalGovernanceReportingEngine.generate(report);
    const executiveDirectives = ExecutiveDirectiveReportingEngine.generate(report);

    // 4. Assemble Appendices
    const explainabilityAppendix = InstitutionalExplainabilityAppendixEngine.generate(report);
    const lineageAppendix = InstitutionalLineageAppendixEngine.generate(report, boardPackLineageHash);
    const boardResolutionAppendix = BoardResolutionAppendixEngine.generate(report);
    
    const disclosures = InstitutionalDisclosureEngine.generate(report, metadata);
    const fiduciaryRestrictions = InstitutionalDisclosureEngine.generateRestrictions(report, metadata);

    // 5. Final Assembly
    const boardPack: InstitutionalBoardPackOutput = {
      status,
      metadata,
      executiveSnapshot,
      governanceReport,
      strategicDirection,
      continuityReport,
      treasuryReport,
      operationalGovernance,
      executiveDirectives,
      explainabilityAppendix,
      lineageAppendix,
      boardResolutionAppendix,
      disclosures,
      fiduciaryRestrictions
    };

    // 6. Fiduciary Constitution Compliance Check
    (RuntimeComplianceEngine as any).validateBoardPack(boardPack);

    return boardPack;
  }

  private static createFailedReport(reason: string): InstitutionalBoardPackOutput {
    return {
      status: 'FAILED',
      metadata: {
        boardPackLineageHash: 'FAILED_GENERATION',
        generationTimestamp: new Date().toISOString(),
        tenantId: 'UNKNOWN',
        cycleReference: 'UNKNOWN',
        isImmutableSnapshot: false,
        confidenceThresholdMet: false,
        historicalCyclesAvailable: 0
      },
      executiveSnapshot: null as any,
      governanceReport: null as any,
      strategicDirection: null as any,
      continuityReport: null as any,
      treasuryReport: null as any,
      operationalGovernance: null as any,
      executiveDirectives: null as any,
      explainabilityAppendix: null as any,
      lineageAppendix: null as any,
      boardResolutionAppendix: null as any,
      disclosures: [{ disclosureId: 'ERR', statement: `Generation failed: ${reason}`, severity: 'CRITICAL' }],
      fiduciaryRestrictions: [{ restrictionType: 'FAIL_CLOSED', description: reason, affectedRuntimes: ['ALL'] }]
    };
  }

  private static generateHash(prefix: string, payload: any): string {
    const rawStr = `${prefix}_${JSON.stringify(payload)}`;
    let hash = 5381;
    for (let i = 0; i < rawStr.length; i++) {
      hash = ((hash << 5) + hash) + rawStr.charCodeAt(i);
    }
    return `${prefix}_` + Math.abs(hash).toString(16).padStart(8, '0');
  }
}
