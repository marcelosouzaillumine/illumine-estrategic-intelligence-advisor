import { FinancialIntelligenceCapability } from '../financial-intelligence/financial-intelligence-capability';
import { GovernanceIntelligenceCapability } from '../governance-intelligence/governance-intelligence-capability';
import { OperationalIntelligenceCapability } from '../operational-intelligence/operational-intelligence-capability';
import { StrategicAnalysisCapability } from '../strategic-analysis/strategic-analysis-capability';
import { RiskIntelligenceCapability } from '../risk-intelligence/risk-intelligence-capability';

export interface CapabilityRegistryItem {
  id: string;
  name: string;
  features: string[];
}

export class CapabilityRegistry {
  private readonly capabilities = new Map<string, CapabilityRegistryItem>([
    [
      'finance-intelligence',
      {
        id: 'finance-intelligence',
        name: FinancialIntelligenceCapability.manifest.name,
        features: ['dre-analysis', 'cashflow-analysis', 'liquidity-assessment', 'capital-structure-optimization']
      }
    ],
    [
      'governance-intelligence',
      {
        id: 'governance-intelligence',
        name: GovernanceIntelligenceCapability.manifest.name,
        features: ['board-vote-audit', 'decision-integrity-scoring', 'compliance-verification']
      }
    ],
    [
      'operational-intelligence',
      {
        id: 'operational-intelligence',
        name: OperationalIntelligenceCapability.manifest.name,
        features: ['workflow-binding', 'sla-tracking', 'process-efficiency']
      }
    ],
    [
      'strategic-analysis',
      {
        id: 'strategic-analysis',
        name: StrategicAnalysisCapability.manifest.name,
        features: ['ma-opportunity-scoring', 'joint-venture-analysis', 'market-expansion']
      }
    ],
    [
      'risk-intelligence',
      {
        id: 'risk-intelligence',
        name: RiskIntelligenceCapability.manifest.name,
        features: ['cyber-risk-mapping', 'fx-hedging-analysis', 'institutional-risk-tracking']
      }
    ]
  ]);

  public getCapability(id: string): CapabilityRegistryItem | undefined {
    return this.capabilities.get(id);
  }
}

export const capabilityRegistry = new CapabilityRegistry();
