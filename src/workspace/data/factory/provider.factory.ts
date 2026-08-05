import { CfoIntelligenceProvider } from '../types/cfo-intelligence.types';
import { MockCfoProvider } from '../providers/mock-cfo.provider';
import { CeoIntelligenceProvider } from '../types/ceo-intelligence.types';
import { MockCeoProvider } from '../providers/mock-ceo.provider';
import { CommercialIntelligenceProvider } from '../providers/commercial-intelligence.provider';
import { MockCommercialProvider } from '../providers/mock-commercial.provider';
import { OperationalIntelligenceProvider } from '../providers/operational-intelligence.provider';
import { MockCooProvider } from '../providers/mock-coo.provider';
import { PeopleIntelligenceProvider } from '../providers/people-intelligence.provider';
import { MockPeopleProvider } from '../providers/mock-people.provider';
import { GovernanceIntelligenceProvider } from '../providers/governance-intelligence.provider';
import { MockGovernanceProvider } from '../providers/mock-governance.provider';
import { RiskIntelligenceProvider } from '../providers/risk-intelligence.provider';
import { MockRiskProvider } from '../providers/mock-risk.provider';
import { InnovationIntelligenceProvider } from '../providers/innovation-intelligence.provider';
import { MockInnovationProvider } from '../providers/mock-innovation.provider';
import { EnterpriseIntelligenceProvider } from '../../intelligence/providers/enterprise-intelligence.provider';
import { MockEnterpriseIntelligenceProvider } from '../../intelligence/providers/mock/mock-enterprise-intelligence.provider';
// FirebaseCfoProvider no longer connects directly to firebase, it should use Query/Repository.
// We can use a general CfoProvider that relies on queries.
// For now we'll export the mock or the refactored one.

export class ProviderFactory {
  static getCfoProvider(providerType: 'mock' | 'enterprise' = 'enterprise'): CfoIntelligenceProvider {
    if (providerType === 'mock') {
      return new MockCfoProvider();
    }
    // TODO: Return EnterpriseCfoProvider which uses Query Layer
    return new MockCfoProvider();
  }

  static getCeoProvider(providerType: 'mock' | 'enterprise' = 'mock'): CeoIntelligenceProvider {
    if (providerType === 'mock') {
      return new MockCeoProvider();
    }
    return new MockCeoProvider();
  }

  static getCommercialProvider(tenantId?: string): CommercialIntelligenceProvider {
    return new MockCommercialProvider();
  }

  static getCooProvider(providerType: 'mock' | 'enterprise' = 'mock'): OperationalIntelligenceProvider {
    return new MockCooProvider();
  }

  static getPeopleProvider(providerType: 'mock' | 'enterprise' = 'mock'): PeopleIntelligenceProvider {
    return new MockPeopleProvider();
  }

  static getGovernanceProvider(providerType: 'mock' | 'enterprise' = 'mock'): GovernanceIntelligenceProvider {
    return new MockGovernanceProvider();
  }

  static getRiskProvider(providerType: 'mock' | 'enterprise' = 'mock'): RiskIntelligenceProvider {
    return new MockRiskProvider();
  }

  static getInnovationProvider(providerType: 'mock' | 'enterprise' = 'mock'): InnovationIntelligenceProvider {
    return new MockInnovationProvider();
  }

  static getEnterpriseIntelligenceProvider(providerType: 'mock' | 'enterprise' = 'mock'): EnterpriseIntelligenceProvider {
    return new MockEnterpriseIntelligenceProvider();
  }

  static getBoardProvider(): any {
    // To be implemented
    return null;
  }
}
