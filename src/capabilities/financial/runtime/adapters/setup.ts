import { EngineRegistry } from '../../../../runtime/EngineRegistry';
import { LegacyFinancialAdapter } from '../../../../runtime/adapters/LegacyFinancialAdapter';
import { LegacyDREAdapter } from '../../../../runtime/adapters/LegacyDREAdapter';
import { LegacyDFCAdapter } from '../../../../runtime/adapters/LegacyDFCAdapter';
import { FinancialLineageIntegrityAdapter } from '../../../../runtime/adapters/FinancialLineageIntegrityAdapter';
import { CapitalGovernanceAdapter } from '../../../../runtime/adapters/CapitalGovernanceAdapter';
import { EconomicNormalizationAdapter } from '../../../../runtime/adapters/EconomicNormalizationAdapter';
import { StressTestAdapter } from '../../../../runtime/adapters/StressTestAdapter';
import { ExecutiveDecisionAdapter } from '../../../../runtime/adapters/ExecutiveDecisionAdapter';
import { InstitutionalMemoryAdapter } from '../../../../runtime/adapters/InstitutionalMemoryAdapter';
import { BoardRiskMatrixAdapter } from '../../../../runtime/adapters/BoardRiskMatrixAdapter';
import { CreditCommitteeSimulatorAdapter } from '../../../../runtime/adapters/CreditCommitteeSimulatorAdapter';
import { SovereignDecisionAdapter } from '../../../../runtime/adapters/SovereignDecisionAdapter';
import { ExecutiveExecutionAdapter } from '../../../../runtime/adapters/ExecutiveExecutionAdapter';

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



