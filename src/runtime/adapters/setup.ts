import { EngineRegistry } from '../EngineRegistry';
import { LegacyFinancialAdapter } from './LegacyFinancialAdapter';
import { LegacyDREAdapter } from './LegacyDREAdapter';
import { LegacyDFCAdapter } from './LegacyDFCAdapter';
import { FinancialLineageIntegrityAdapter } from './FinancialLineageIntegrityAdapter';
import { CapitalGovernanceAdapter } from './CapitalGovernanceAdapter';
import { EconomicNormalizationAdapter } from './EconomicNormalizationAdapter';
import { StressTestAdapter } from './StressTestAdapter';
import { ExecutiveDecisionAdapter } from './ExecutiveDecisionAdapter';
import { InstitutionalMemoryAdapter } from './InstitutionalMemoryAdapter';
import { BoardRiskMatrixAdapter } from './BoardRiskMatrixAdapter';
import { CreditCommitteeSimulatorAdapter } from './CreditCommitteeSimulatorAdapter';
import { SovereignDecisionAdapter } from './SovereignDecisionAdapter';
import { ExecutiveExecutionAdapter } from './ExecutiveExecutionAdapter';

export function setupRuntimeAdapters() {
  EngineRegistry.register(LegacyFinancialAdapter);
  EngineRegistry.register(LegacyDREAdapter);
  EngineRegistry.register(LegacyDFCAdapter);
  EngineRegistry.register(FinancialLineageIntegrityAdapter);
  EngineRegistry.register(CapitalGovernanceAdapter);
  EngineRegistry.register(EconomicNormalizationAdapter);
  EngineRegistry.register(StressTestAdapter);
  EngineRegistry.register(ExecutiveDecisionAdapter);
  EngineRegistry.register(InstitutionalMemoryAdapter);
  EngineRegistry.register(BoardRiskMatrixAdapter);
  EngineRegistry.register(CreditCommitteeSimulatorAdapter);
  EngineRegistry.register(SovereignDecisionAdapter);
  EngineRegistry.register(ExecutiveExecutionAdapter);
}



