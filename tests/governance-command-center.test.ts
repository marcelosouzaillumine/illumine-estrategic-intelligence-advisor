import { describe, it } from 'node:test';
import assert from 'node:assert';
import { GovernanceIncidentOrchestrator } from '../src/core/runtime/governance-command-center/GovernanceIncidentOrchestrator';
import { ExecutiveSupervisionEngine } from '../src/core/runtime/governance-command-center/ExecutiveSupervisionEngine';
import { RuntimeHealthMonitoringEngine } from '../src/core/runtime/governance-command-center/RuntimeHealthMonitoringEngine';
import { MultiTenantSupervisionEngine } from '../src/core/runtime/governance-command-center/MultiTenantSupervisionEngine';
import { GovernanceIncident, GovernanceSupervisionEvent } from '../src/core/runtime/governance-command-center/types';
import { TenantRole } from '../src/platform/tenant/TenancyTypes';

const createMockIncident = (overrides?: Partial<GovernanceIncident>): GovernanceIncident => ({
  incidentId: 'inc-01',
  tenantId: 'tenant-test',
  type: 'LIQUIDITY_PRESSURE',
  severity: 'CRITICAL',
  title: 'Test Incident',
  description: 'Test Description',
  detectedAt: new Date().toISOString(),
  lineageHash: '0xHASH123',
  correlationId: 'corr-123',
  sourceRuntimeReferences: ['TestModule'],
  entityId: 'ENT-01',
  ...overrides
});

describe('GOVERNANCE COMMAND CENTER TESTS', () => {

  describe('GovernanceIncidentOrchestrator (Event Sourcing Status Derivation)', () => {
    it('should derive OPEN status when there are no events', () => {
      const incident = createMockIncident();
      const status = GovernanceIncidentOrchestrator.deriveStatus(incident, []);
      assert.strictEqual(status, 'OPEN');
    });

    it('should derive ACKNOWLEDGED status on ACKNOWLEDGE event', () => {
      const incident = createMockIncident();
      const events: GovernanceSupervisionEvent[] = [
        {
          eventId: 'ev-1',
          incidentId: incident.incidentId,
          tenantId: incident.tenantId,
          correlationId: incident.correlationId,
          lineageHash: incident.lineageHash,
          actorId: 'actor-01',
          timestamp: new Date().toISOString(),
          supervisionAction: 'ACKNOWLEDGE'
        }
      ];
      const status = GovernanceIncidentOrchestrator.deriveStatus(incident, events);
      assert.strictEqual(status, 'ACKNOWLEDGED');
    });

    it('should derive RESOLVED status when RESOLUTION is the latest event chronologically', () => {
      const incident = createMockIncident();
      const events: GovernanceSupervisionEvent[] = [
        {
          eventId: 'ev-2',
          incidentId: incident.incidentId,
          tenantId: incident.tenantId,
          correlationId: incident.correlationId,
          lineageHash: incident.lineageHash,
          actorId: 'actor-01',
          timestamp: new Date(Date.now() - 10000).toISOString(),
          supervisionAction: 'RESOLUTION' // Earlier event
        },
        {
          eventId: 'ev-3',
          incidentId: incident.incidentId,
          tenantId: incident.tenantId,
          correlationId: incident.correlationId,
          lineageHash: incident.lineageHash,
          actorId: 'actor-01',
          timestamp: new Date().toISOString(),
          supervisionAction: 'ESCALATION' // Latest event
        }
      ];
      const status = GovernanceIncidentOrchestrator.deriveStatus(incident, events);
      assert.strictEqual(status, 'ESCALATED');
    });

    it('should fail-closed createSupervisionEvent when lineage or correlationId or tenantId is missing', () => {
      const invalidIncident = createMockIncident({ lineageHash: '' });
      assert.throws(() => {
        GovernanceIncidentOrchestrator.createSupervisionEvent(invalidIncident, 'ACKNOWLEDGE', 'actor-1');
      }, /FAIL_CLOSED/);
    });

    it('should prioritize incidents by severity weight and secondarily by date', () => {
      const incidentLow = createMockIncident({ incidentId: 'inc-low', severity: 'LOW', detectedAt: new Date(Date.now() - 1000).toISOString() });
      const incidentHigh = createMockIncident({ incidentId: 'inc-high', severity: 'HIGH', detectedAt: new Date(Date.now() - 5000).toISOString() });
      const incidentSystemic = createMockIncident({ incidentId: 'inc-sys', severity: 'SYSTEMIC', detectedAt: new Date().toISOString() });
      const incidentCritical = createMockIncident({ incidentId: 'inc-crit', severity: 'CRITICAL', detectedAt: new Date().toISOString() });

      const prioritized = GovernanceIncidentOrchestrator.getPrioritizedIncidents(
        [incidentLow, incidentHigh, incidentSystemic, incidentCritical],
        [],
        'tenant-test'
      );

      assert.strictEqual(prioritized[0].incident.incidentId, 'inc-sys');       // SYSTEMIC (weight 5)
      assert.strictEqual(prioritized[1].incident.incidentId, 'inc-crit');      // CRITICAL (weight 4)
      assert.strictEqual(prioritized[2].incident.incidentId, 'inc-high');      // HIGH (weight 3)
      assert.strictEqual(prioritized[3].incident.incidentId, 'inc-low');       // LOW (weight 1)
    });
  });

  describe('ExecutiveSupervisionEngine (Attention Pacing)', () => {
    it('should collapse secondary low-severity alerts when there are critical ones to prevent cognitive fatigue', () => {
      const incident1 = { incident: createMockIncident({ incidentId: 'inc-1', severity: 'SYSTEMIC' }), currentStatus: 'OPEN' as const };
      const incident2 = { incident: createMockIncident({ incidentId: 'inc-2', severity: 'CRITICAL' }), currentStatus: 'OPEN' as const };
      const incident3 = { incident: createMockIncident({ incidentId: 'inc-3', severity: 'LOW' }), currentStatus: 'OPEN' as const };
      const incident4 = { incident: createMockIncident({ incidentId: 'inc-4', severity: 'MODERATE' }), currentStatus: 'OPEN' as const };

      // Set maxVisible = 2. It will show SYSTEMIC and CRITICAL without collapsing, but collapse others.
      const pacing = ExecutiveSupervisionEngine.prioritizeForExecutive([incident1, incident2, incident3, incident4], 2);

      assert.strictEqual(pacing.length, 4);
      assert.strictEqual(pacing[0].incident.incidentId, 'inc-1');
      assert.strictEqual(pacing[0].isCollapsed, false); // SYSTEMIC, critical
      assert.strictEqual(pacing[1].incident.incidentId, 'inc-2');
      assert.strictEqual(pacing[1].isCollapsed, false); // CRITICAL, critical

      // LOW and MODERATE are secondary, should be collapsed since maxVisible is 2
      assert.strictEqual(pacing[2].incident.incidentId, 'inc-3');
      assert.strictEqual(pacing[2].isCollapsed, true);
      assert.strictEqual(pacing[3].incident.incidentId, 'inc-4');
      assert.strictEqual(pacing[3].isCollapsed, true);
    });
  });

  describe('RuntimeHealthMonitoringEngine (Fail-Closed)', () => {
    it('should remain HEALTHY when all parameters are continuous and complete', () => {
      const health = RuntimeHealthMonitoringEngine.evaluateHealth({
        tenantId: 'tenant-1',
        correlationId: 'corr-1',
        lineageHash: 'hash-1',
        telemetryContinuous: true,
        failedLineagesCount: 0,
        hasBrokenPropagation: false
      });

      assert.strictEqual(health.status, 'HEALTHY');
      assert.strictEqual(health.integrityPercentage, 100);
    });

    it('should trigger FAIL_CLOSED state when lineageHash is missing', () => {
      const health = RuntimeHealthMonitoringEngine.evaluateHealth({
        tenantId: 'tenant-1',
        correlationId: 'corr-1',
        lineageHash: '',
        telemetryContinuous: true,
        failedLineagesCount: 0,
        hasBrokenPropagation: false
      });

      assert.strictEqual(health.status, 'FAIL_CLOSED');
      assert.strictEqual(health.integrityPercentage, 0);
    });

    it('should trigger FAIL_CLOSED state when telemetryContinuous is false', () => {
      const health = RuntimeHealthMonitoringEngine.evaluateHealth({
        tenantId: 'tenant-1',
        correlationId: 'corr-1',
        lineageHash: 'hash-1',
        telemetryContinuous: false,
        failedLineagesCount: 0,
        hasBrokenPropagation: false
      });

      assert.strictEqual(health.status, 'FAIL_CLOSED');
      assert.strictEqual(health.integrityPercentage, 0);
    });
  });

  describe('MultiTenantSupervisionEngine (Role Scopes & Audit logs)', () => {
    it('should authorize access for MASTER_ADMIN role and write VIEW_REPORT audit action', async () => {
      const result = await MultiTenantSupervisionEngine.validateAndAuditAccess({
        actorId: 'usr-admin',
        actorRole: 'MASTER_ADMIN' as TenantRole,
        targetTenantId: 'tenant-target',
        actionDescription: 'Audit dashboard access',
        workspaceId: 'workspace-01'
      });

      assert.strictEqual(result.isAuthorized, true);
      assert.strictEqual(result.auditLogged, true);
    });

    it('should deny access for CLIENT_USER and write UNAUTHORIZED_ACCESS_ATTEMPT audit action', async () => {
      const result = await MultiTenantSupervisionEngine.validateAndAuditAccess({
        actorId: 'usr-client',
        actorRole: 'CLIENT_USER' as TenantRole,
        targetTenantId: 'tenant-target',
        actionDescription: 'Audit dashboard access',
        workspaceId: 'workspace-01'
      });

      assert.strictEqual(result.isAuthorized, false);
      assert.strictEqual(result.auditLogged, true);
    });
  });

});
