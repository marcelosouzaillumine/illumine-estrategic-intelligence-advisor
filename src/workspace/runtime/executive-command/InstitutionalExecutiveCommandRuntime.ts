// src/core/runtime/executive-command/InstitutionalExecutiveCommandRuntime.ts

import { ExecutiveIntelligenceReport } from '../../core/runtime/executive-intelligence-runtime';
import { CommandAdapter } from './command-adapter';
import { InstitutionalDirectiveEngine } from './InstitutionalDirectiveEngine';
import { ExecutiveDriftDetectionEngine } from './ExecutiveDriftDetectionEngine';
import { InstitutionalAlignmentEngine } from './InstitutionalAlignmentEngine';
import { GovernanceExecutionTrackingEngine } from './GovernanceExecutionTrackingEngine';
import { StrategicOrchestrationEngine } from './StrategicOrchestrationEngine';
import { ExecutiveCommandThesisEngine } from './ExecutiveCommandThesisEngine';
import { ExecutiveCommandExplainabilityEngine } from './ExecutiveCommandExplainabilityEngine';
import { ExecutiveCommandMemoryEngine } from './ExecutiveCommandMemoryEngine';
import { InstitutionalExecutiveCommandOutput } from './executive-command-types';

export class InstitutionalExecutiveCommandRuntime {
  static evaluate(report: ExecutiveIntelligenceReport): InstitutionalExecutiveCommandOutput {
    // 1. Adapter extracts necessary data preserving isolation
    const context = CommandAdapter.extractContext(report);

    // 2. Run deterministic core engines
    const activeDirectives = InstitutionalDirectiveEngine.evaluate(context);
    const driftEvents = ExecutiveDriftDetectionEngine.evaluate(context, activeDirectives);
    const institutionalAlignment = InstitutionalAlignmentEngine.evaluate(context, activeDirectives, driftEvents);
    const governanceTracking = GovernanceExecutionTrackingEngine.evaluate(context);
    const strategicOrchestration = StrategicOrchestrationEngine.evaluate(context, activeDirectives, driftEvents, institutionalAlignment);
    
    const commandThesis = ExecutiveCommandThesisEngine.evaluate(
      context, activeDirectives, driftEvents, institutionalAlignment, strategicOrchestration
    );
    
    const explainability = ExecutiveCommandExplainabilityEngine.evaluate(
      context, activeDirectives, driftEvents
    );

    const output: InstitutionalExecutiveCommandOutput = {
      activeDirectives,
      driftEvents,
      institutionalAlignment,
      governanceTracking,
      strategicOrchestration,
      commandThesis,
      explainability
    };

    // 3. Generate persistence delta for external layers (UI/Firebase) to write to Firestore
    const persistenceDelta = ExecutiveCommandMemoryEngine.generatePersistenceDelta(context, output);

    return {
      ...output,
      _persistenceDelta: persistenceDelta
    } as unknown as InstitutionalExecutiveCommandOutput;
  }
}
