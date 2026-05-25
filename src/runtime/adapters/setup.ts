import { EngineRegistry } from '../EngineRegistry';
import { LegacyFinancialAdapter } from './LegacyFinancialAdapter';
import { LegacyDREAdapter } from './LegacyDREAdapter';
import { LegacyDFCAdapter } from './LegacyDFCAdapter';
import { StressTestAdapter } from './StressTestAdapter';
import { ExecutiveDecisionAdapter } from './ExecutiveDecisionAdapter';
import { InstitutionalMemoryAdapter } from './InstitutionalMemoryAdapter';

export function setupRuntimeAdapters() {
  EngineRegistry.register(LegacyFinancialAdapter);
  EngineRegistry.register(LegacyDREAdapter);
  EngineRegistry.register(LegacyDFCAdapter);
  EngineRegistry.register(StressTestAdapter);
  EngineRegistry.register(ExecutiveDecisionAdapter);
  EngineRegistry.register(InstitutionalMemoryAdapter);
}
