// src/core/runtime/operational-governance/InstitutionalOperationalGovernanceRuntime.ts

import { ExecutiveIntelligenceReport } from '../executive-intelligence-runtime';
import { OperationalGovernanceAdapter } from './operational-governance-adapter';
import { ExecutionIntegrityEngine } from './ExecutionIntegrityEngine';
import { OperationalStabilityGuard } from './OperationalStabilityGuard';
import { InstitutionalFrictionEngine } from './InstitutionalFrictionEngine';
import { OperationalContinuityEngine } from './OperationalContinuityEngine';
import { InstitutionalDependencyEngine } from './InstitutionalDependencyEngine';
import { StrategicExecutionAlignmentEngine } from './StrategicExecutionAlignmentEngine';
import { OperationalGovernanceThesisEngine } from './OperationalGovernanceThesisEngine';
import { OperationalGovernanceExplainabilityEngine } from './OperationalGovernanceExplainabilityEngine';
import { OperationalGovernanceMemoryEngine } from './OperationalGovernanceMemoryEngine';
import { InstitutionalOperationalGovernanceOutput } from './operational-governance-types';

export class InstitutionalOperationalGovernanceRuntime {
  static evaluate(
    report: ExecutiveIntelligenceReport, 
    historicalStatusBuffer: string[] = []
  ): InstitutionalOperationalGovernanceOutput {
    
    // 1. Adapter extracts necessary data preserving isolation
    const context = OperationalGovernanceAdapter.extractContext(report);

    // 2. Core Execution Integrity & Guard
    const rawExecutionState = ExecutionIntegrityEngine.evaluate(context);
    const executionIntegrity = OperationalStabilityGuard.applyGuard(rawExecutionState, historicalStatusBuffer);

    // 3. Friction & Dependency
    const frictions = InstitutionalFrictionEngine.evaluate(context);
    const dependencies = InstitutionalDependencyEngine.evaluate(context);

    // 4. Continuity & Alignment
    const continuity = OperationalContinuityEngine.evaluate(context, executionIntegrity);
    const strategicAlignment = StrategicExecutionAlignmentEngine.evaluate(context, executionIntegrity);
    
    // 5. Thesis & Explainability
    const thesis = OperationalGovernanceThesisEngine.evaluate(context, executionIntegrity, continuity, strategicAlignment);
    const explainability = OperationalGovernanceExplainabilityEngine.evaluate(context, frictions, dependencies, strategicAlignment);

    const output: InstitutionalOperationalGovernanceOutput = {
      runtimeMetadata: {
        generatedAt: new Date().toISOString(),
        runtimeVersion: '1.0.0',
        contractVersion: 'RC_1_13A',
        tenantId: context.tenantId || 'UNKNOWN',
        cycleReference: (context as unknown as { cycleReference?: string }).cycleReference || 'UNKNOWN'
      },
      lineage: {
        lineageHash: context.lineageHash as unknown as import('../shared/lineage-types').LineageHash,
        parentHashes: []
      },
      disclosures: [],
      compliance: {
        integrityStatus: 'INTACT',
        complianceStatus: 'COMPLIANT',
        complianceBlockers: []
      },
      executionIntegrity,
      frictions,
      continuity,
      dependencies,
      strategicAlignment,
      thesis,
      explainability,
      _persistenceDelta: null
    };

    // 6. Memory Delta
    output._persistenceDelta = OperationalGovernanceMemoryEngine.generatePersistenceDelta(context, output);


    return output;
  }
}
