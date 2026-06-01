import { ExecutiveIntelligenceReport } from '../executive-intelligence-runtime';
import { InstitutionalBoardPackOutput, ReportGenerationStatus } from './institutional-reporting-types';
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
import { BoardPackMetadata } from './institutional-reporting-types';

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
    
    const contextAny = report.institutionalContext as any;
    
    // Hash do Board Pack gerado a partir do Hash do Executive Report de forma estritamente determinística
    const boardPackLineageHash = this.generateHash('BOARD_PACK', {
      sourceHash: runtimeMetadataAny.lineageHash,
      tenantId: contextAny.tenantId || "N/A",
      cycleReference: contextAny.currentCycle || "N/A"
    });

    const metadata: BoardPackMetadata = {
      boardPackLineageHash: boardPackLineageHash as any,
      generationTimestamp: new Date().toISOString(),
      tenantId: contextAny.tenantId || "N/A",
      cycleReference: contextAny.currentCycle || "N/A",
      snapshotIntegrityStatus: isFailClosed ? 'COMPROMISED' : 'SECURE',
      immutabilityStatus: 'IMMUTABLE',
      runtimeSources: ['ExecutiveSnapshotEngine', 'GovernanceReportingEngine'],
      reportGenerationTimestamp: new Date().toISOString(),
      lineageHash: runtimeMetadataAny.lineageHash,
      executionId: runtimeMetadataAny.executionId || "N/A",
      timestamp: new Date().toISOString()
    };

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
    const lineageAppendix = InstitutionalLineageAppendixEngine.generate(report, boardPackLineageHash as any);
    const boardResolutionAppendix = BoardResolutionAppendixEngine.generate(report);
    
    const disclosures = InstitutionalDisclosureEngine.generate(report, metadata);
    const fiduciaryRestrictions = InstitutionalDisclosureEngine.generateRestrictions(report, metadata);

    // 5. Sovereign Status Resolution
    let finalStatus: ReportGenerationStatus = 'COMPLETE';
    if (isFailClosed) {
      finalStatus = 'RESTRICTED';
    }

    const output: InstitutionalBoardPackOutput = {
      status: finalStatus,
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
      disclosureSet: disclosures,
      fiduciaryRestrictions
    };

    // 6. Hard-Fail Audit (Fase 2)
    RuntimeComplianceEngine.validate(output, 'render');

    return output;
  }

  private static createFailedReport(reason: string): InstitutionalBoardPackOutput {
    return {
      status: 'FAILED',
      metadata: {
        boardPackLineageHash: 'FAILED' as any,
        generationTimestamp: new Date().toISOString(),
        tenantId: 'N/A',
        cycleReference: 'N/A',
        snapshotIntegrityStatus: 'COMPROMISED',
        immutabilityStatus: 'MUTABLE',
        runtimeSources: [],
        reportGenerationTimestamp: new Date().toISOString(),
        lineageHash: 'FAILED',
        executionId: 'FAILED',
        timestamp: new Date().toISOString()
      },
      executiveSnapshot: {} as any,
      governanceReport: {} as any,
      strategicDirection: {} as any,
      continuityReport: {} as any,
      treasuryReport: {} as any,
      operationalGovernance: {} as any,
      executiveDirectives: {} as any,
      explainabilityAppendix: {} as any,
      lineageAppendix: {} as any,
      boardResolutionAppendix: {} as any,
      disclosureSet: [],
      fiduciaryRestrictions: []
    };
  }

  private static generateHash(prefix: string, data: Record<string, string>): string {
    return `${prefix}_${Buffer.from(JSON.stringify(data)).toString('base64').substring(0, 16)}`;
  }
}
