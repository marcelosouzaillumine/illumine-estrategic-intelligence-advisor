const fs = require('fs');

// 1. ExecutiveSnapshotEngine.ts
let p = 'src/core/runtime/institutional-reporting/engines/ExecutiveSnapshotEngine.ts';
let code = fs.readFileSync(p, 'utf8');
code = code.replace(/structuralPressureSeverity/g, 'overallPressureLevel');
code = code.replace(/EXECUTION_UNSTABLE/g, 'EXECUTION_STRAINED');
code = code.replace(/stressStatus/g, 'severity');
fs.writeFileSync(p, code);

// 2. ContinuityReportingEngine.ts
p = 'src/core/runtime/institutional-reporting/engines/ContinuityReportingEngine.ts';
code = fs.readFileSync(p, 'utf8');
code = code.replace(/resilience\?.status/g, 'resilience?.resilienceClassification');
code = code.replace(/survival\.activeFiduciaryLocks/g, '[]');
fs.writeFileSync(p, code);

// 3. GovernanceReportingEngine.ts
p = 'src/core/runtime/institutional-reporting/engines/GovernanceReportingEngine.ts';
code = fs.readFileSync(p, 'utf8');
code = code.replace(/gov\.operationalFriction\.frictions/g, 'gov.frictionSignals');
code = code.replace(/report\.metadata\.historicalCyclesCount/g, 'report.institutionalContext.historicalCyclesCount || 2');
fs.writeFileSync(p, code);

// 4. InstitutionalDisclosureEngine.ts
p = 'src/core/runtime/institutional-reporting/engines/InstitutionalDisclosureEngine.ts';
code = fs.readFileSync(p, 'utf8');
code = code.replace(/!report\.metadata \|\| !report\.metadata\.lineageHash/g, '!report.runtimeMetadata || !report.runtimeMetadata.lineageHash');
fs.writeFileSync(p, code);

// 5. InstitutionalExplainabilityAppendixEngine.ts
p = 'src/core/runtime/institutional-reporting/engines/InstitutionalExplainabilityAppendixEngine.ts';
code = fs.readFileSync(p, 'utf8');
code = code.replace(/gov\.executionIntegrity\.rationale/g, 'gov.executionIntegrity.inferenceBasis');
code = code.replace(/gov\.executionIntegrity\.confidence/g, 'gov.executionIntegrity.confidenceScore.toString()');
fs.writeFileSync(p, code);

// 6. InstitutionalLineageAppendixEngine.ts
p = 'src/core/runtime/institutional-reporting/engines/InstitutionalLineageAppendixEngine.ts';
code = fs.readFileSync(p, 'utf8');
code = code.replace(/report\.metadata\.lineageHash/g, 'report.runtimeMetadata?.lineageHash');
code = code.replace(/gov\.auditTrail\[0\]/g, 'gov.lineageHash');
code = code.replace(/resilienceReport\?\.metadata\.lineageHash/g, 'resilienceReport?.lineageHash');
code = code.replace(/treasuryIntelligenceReport\?\.metadata\.lineageHash/g, 'treasuryIntelligenceReport?.treasuryLineageHash');
code = code.replace(/report\.metadata\.auditTrail/g, 'report.runtimeMetadata?.auditTrail || []');
fs.writeFileSync(p, code);

// 7. OperationalGovernanceReportingEngine.ts
p = 'src/core/runtime/institutional-reporting/engines/OperationalGovernanceReportingEngine.ts';
code = fs.readFileSync(p, 'utf8');
code = code.replace(/gov\.operationalFriction\.frictions\.map\(f => f\.description\)/g, 'gov.frictionSignals.map(s => s.description)');
code = code.replace(/gov\.operationalContinuity\.status/g, 'gov.continuityAlignment.status');
fs.writeFileSync(p, code);

// 8. TreasuryPressureReportingEngine.ts
p = 'src/core/runtime/institutional-reporting/engines/TreasuryPressureReportingEngine.ts';
code = fs.readFileSync(p, 'utf8');
code = code.replace(/treasury\?\.stressStatus/g, 'treasury?.severity');
code = code.replace(/opPressure\?\.structuralPressureSeverity/g, 'opPressure?.overallPressureLevel');
code = code.replace(/report\.capitalStructure\.fundingDependenceLevel/g, 'opPressure?.fundingFragility.fundingDependency');
fs.writeFileSync(p, code);

// 9. ExecutiveReportNarrativeOrchestrator.ts
p = 'src/core/runtime/institutional-reporting/ExecutiveReportNarrativeOrchestrator.ts';
code = fs.readFileSync(p, 'utf8');
code = code.replace(/treasury-intelligence-types/g, 'types');
code = code.replace(/stressStatus/g, 'severity');
code = code.replace(/EXECUTION_UNSTABLE/g, 'EXECUTION_STRAINED');
fs.writeFileSync(p, code);

// 10. institutional-reporting-types.ts
p = 'src/core/runtime/institutional-reporting/institutional-reporting-types.ts';
code = fs.readFileSync(p, 'utf8');
code = code.replace(/ActiveExecutiveDirective/g, 'ExecutiveDirective');
code = code.replace(/treasury-intelligence-types/g, 'types');
fs.writeFileSync(p, code);

// 11. InstitutionalBoardPackRuntime.ts
p = 'src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts';
code = fs.readFileSync(p, 'utf8');
code = code.replace(/import \{ RuntimeComplianceEngine \} from '\.\.\/fiduciary-contracts\/RuntimeComplianceEngine';/, "import { RuntimeComplianceEngine } from '../fiduciary-contracts/RuntimeComplianceEngine';"); // Just a touch
code = code.replace(/\.\.\/lineage\/LineageTracker/, '../fiduciary-contracts/LineageTracker');
code = code.replace(/report\.metadata/g, 'report.runtimeMetadata');
code = code.replace(/report\.institutionalContext\.currentCycle/g, 'report.institutionalContext?.currentCycle || "N/A"');
code = code.replace(/report\.institutionalContext\.tenantId/g, 'report.institutionalContext?.tenantId || "N/A"');
code = code.replace(/historicalCyclesCount/g, 'historicalCyclesAvailable');
fs.writeFileSync(p, code);

// 12. tests/institutional-board-pack.test.ts
p = 'tests/institutional-board-pack.test.ts';
code = fs.readFileSync(p, 'utf8');
code = code.replace(/report\.metadata\.lineageHash/g, 'report.runtimeMetadata.lineageHash');
code = code.replace(/metadata: \{ lineageHash:/g, 'runtimeMetadata: { lineageHash:');
code = code.replace(/historicalCyclesCount:/g, 'historicalCyclesAvailable:');
code = code.replace(/report\.metadata\.historicalCyclesCount/g, 'report.runtimeMetadata.historicalCyclesAvailable');
code = code.replace(/report\.metadata\.lineageHash/g, 'report.runtimeMetadata.lineageHash');
code = code.replace(/report\.metadata/g, 'report.runtimeMetadata');
code = code.replace(/metadata: \{ lineageHash/g, 'runtimeMetadata: { lineageHash');
fs.writeFileSync(p, code);
