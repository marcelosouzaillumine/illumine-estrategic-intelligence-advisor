import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';

import { CommercialGovernanceBoundary } from '../src/capabilities/runtime/commercial-readiness/CommercialGovernanceBoundary';
import { RuntimeQuotaAuditTrail } from '../src/capabilities/runtime/commercial-readiness/RuntimeQuotaAuditTrail';
import { AdvisorEthicalBoundaryGuard } from '../src/capabilities/runtime/commercial-readiness/AdvisorEthicalBoundaryGuard';
import { AdvisorOperatingFramework } from '../src/capabilities/runtime/commercial-readiness/AdvisorOperatingFramework';
import { RuntimeUsageGovernance } from '../src/capabilities/runtime/commercial-readiness/RuntimeUsageGovernance';

describe('RC-1.2: Commercial Readiness & Enterprise Operationalization', () => {
  beforeEach(() => {
    RuntimeQuotaAuditTrail.clear();
    AdvisorOperatingFramework.clear();
  });

  it('1. plano BASIC tentando ocultar disclosure deve falhar', () => {
    assert.throws(
      () => CommercialGovernanceBoundary.assertSubordination(
        'BASIC',
        'HIGH',
        'HIGH',
        'WARNING',
        'WARNING',
        0,
        0,
        true, // DISCLOSURE SUPPRESSED
        false
      ),
      /Institutional disclosure cannot be suppressed/
    );
  });

  it('2. white-label tentando remover RuntimeDisclosureBanner deve falhar', () => {
    assert.throws(
      () => CommercialGovernanceBoundary.assertSubordination(
        'ENTERPRISE',
        'HIGH',
        'HIGH',
        'WARNING',
        'WARNING',
        0,
        0,
        false,
        true // BANNER REMOVED
      ),
      /White-label configuration cannot remove the mandatory RuntimeDisclosureBanner/
    );
  });

  it('3. Advisor tentando comparar tenants sem anonimização deve falhar', () => {
    assert.throws(
      () => AdvisorEthicalBoundaryGuard.assertEthicalComparison(
        'adv-123',
        'tenant-A',
        'tenant-B',
        false, // NOT ANONYMIZED
        false
      ),
      /Direct non-anonymized comparison between tenants/
    );
  });

  it('4. Advisor tentando exportar caminhos causais cruzados deve falhar', () => {
    assert.throws(
      () => AdvisorEthicalBoundaryGuard.assertEthicalComparison(
        'adv-123',
        'tenant-A',
        'tenant-B',
        true,
        true // ALLOW CROSS EXPORT
      ),
      /Exporting raw cross-tenant causality pathways is blocked/
    );
  });

  it('5. quota excedida tentando continuar execução deve lançar erro e logar no AuditTrail', () => {
    const tenant = 'tenant-test-limits';
    RuntimeUsageGovernance.resetUsage(tenant);

    // Initial usage under limits
    assert.doesNotThrow(() => {
      RuntimeUsageGovernance.assertExecutionBudget(tenant, 'BASIC', 300, 1);
    });

    // Exceed budget (BASIC limit is 500ms)
    assert.throws(
      () => RuntimeUsageGovernance.assertExecutionBudget(tenant, 'BASIC', 300, 1),
      /Budget limit exceeded/
    );

    const logs = RuntimeQuotaAuditTrail.getEvents(tenant);
    const denialLog = logs.find(l => l.eventType === 'EXECUTION_DENIAL');
    assert.ok(denialLog);
    assert.ok(denialLog.details.includes('Budget overflow'));
  });

  it('6. regra comercial tentando rebaixar severity de CRITICAL deve falhar', () => {
    assert.throws(
      () => CommercialGovernanceBoundary.assertSubordination(
        'CORPORATE',
        'HIGH',
        'HIGH',
        'CRITICAL', // ORIGINAL
        'WARNING', // REQUESTED DOWNGRADE
        0,
        0,
        false,
        false
      ),
      /cannot downgrade CRITICAL severity/
    );
  });

  it('7. branding tentando mascarar LOW confidence como HIGH/MEDIUM deve falhar', () => {
    assert.throws(
      () => CommercialGovernanceBoundary.assertSubordination(
        'ENTERPRISE',
        'LOW', // ORIGINAL
        'HIGH', // MASKED
        'WARNING',
        'WARNING',
        0,
        0,
        false,
        false
      ),
      /cannot mask LOW confidence states/
    );
  });

  it('8. advisor context switching e escopos autorizados', () => {
    const advisor = 'adv-governed';
    AdvisorOperatingFramework.registerAdvisorScope(advisor, ['tenant-A', 'tenant-B']);

    assert.doesNotThrow(() => {
      AdvisorOperatingFramework.switchTenantContext(advisor, 'tenant-A', 'tenant-B');
    });

    assert.throws(
      () => AdvisorOperatingFramework.switchTenantContext(advisor, 'tenant-B', 'tenant-C'),
      /is outside allowed scopes/
    );
  });
});
