import { describe, it, expect } from 'vitest';
import { CapabilityEntity } from '../src/entities/CapabilityEntity';
import { RuleEntity } from '../src/entities/RuleEntity';
import { 
  createCapabilityId, 
  createWaveId, 
  createRuleId,
  Lifecycle, 
  CertificationStatus, 
  CapabilityType,
  RuleCategory,
  Severity
} from '@illumine/architecture-governance-types';

describe('Governance Domain Integrity', () => {
  it('should instantiate a pure CapabilityEntity without errors', () => {
    const capability = new CapabilityEntity(
      createCapabilityId('CAP-001'),
      'Architecture Governance Center',
      '1.0.0' as any,
      'Platform',
      'Governance',
      createWaveId('G0'),
      createWaveId('G0'),
      createWaveId('G0'),
      5,
      Lifecycle.BETA,
      CapabilityType.CORE,
      CertificationStatus.PENDING,
      { health: 100, risk: 'LOW', complexity: 10, maturity: 5, certification: 0 },
      { 
        health: { score: 100, classification: 'Platinum', delta: 0 },
        risk: 'LOW', trend: 'STABLE', architecture: 100, product: 100,
        ai: 100, security: 100, performance: 100, scalability: 100,
        governance: 100, data: 100, ux: 100, commercial: 100
      },
      [],
      { type: 'root', direction: 'BIDIRECTIONAL', confidence: 'HIGH', strength: 100, origin: 'none', target: 'none', metadata: {} },
      []
    );

    expect(capability.id).toBe('CAP-001');
    expect(capability.lifecycle).toBe(Lifecycle.BETA);
  });

  it('should instantiate a pure RuleEntity without errors', () => {
    const rule = new RuleEntity(
      createRuleId('AR-001'),
      'v1',
      RuleCategory.ARCHITECTURAL,
      Severity.CRITICAL,
      'Platform Freeze Rule',
      false,
      'CONSTITUTION.md',
      'ADR-001'
    );

    expect(rule.id).toBe('AR-001');
    expect(rule.severity).toBe(Severity.CRITICAL);
  });
});
