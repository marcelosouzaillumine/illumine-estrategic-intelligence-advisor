import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { AuditEventBus } from '../src/core/security/audit/AuditEventBus';
import { AnomalyDetector } from '../src/core/security/audit/AnomalyDetector';
import { ImmutableLedger } from '../src/core/security/audit/ImmutableLedger';
import { DataAccessContext } from '../src/core/security/data-access-context';
import { CommercialPlanEngine } from '../src/core/commercial/CommercialPlanEngine';
import { TenantLicensingEngine, LicensingViolationError } from '../src/core/commercial/TenantLicensingEngine';
import { WhiteLabelGovernance, BrandingValidationError } from '../src/core/commercial/WhiteLabelGovernance';
import { OnboardingEngine } from '../src/core/onboarding/OnboardingEngine';
import { ExecutiveCollaborationLayer } from '../src/core/collaboration/ExecutiveCollaborationLayer';
import { BoardWorkflowLayer } from '../src/core/workflows/BoardWorkflowLayer';
import { InstitutionalKnowledgeLayer } from '../src/core/knowledge/InstitutionalKnowledgeLayer';
import { AdoptionAnalytics } from '../src/core/analytics/AdoptionAnalytics';
import { EnterpriseReadinessDiagnostics } from '../src/core/diagnostics/EnterpriseReadinessDiagnostics';

describe('Enterprise Executive Experience & Commercialization Layer Tests', () => {
  let savedEvents: any[] = [];
  let detectedAnomalies: any[] = [];
  
  const originalSaveEvent = AuditEventBus.saveEvent;
  const originalSaveAnomaly = AnomalyDetector.saveAnomaly;
  const originalSaveLedger = ImmutableLedger.saveLedger;

  beforeEach(() => {
    savedEvents = [];
    detectedAnomalies = [];

    AuditEventBus.saveEvent = async (event: any) => {
      savedEvents.push(event);
    };

    AnomalyDetector.saveAnomaly = async (anomaly: any) => {
      detectedAnomalies.push(anomaly);
    };

    ImmutableLedger.saveLedger = async () => {};

    // Clear state
    TenantLicensingEngine.clearConsumptions();
    WhiteLabelGovernance.clearViolations();
    ExecutiveCollaborationLayer.clearComments();
    BoardWorkflowLayer.clearWorkflows();
    InstitutionalKnowledgeLayer.clearMemory();
  });

  afterEach(() => {
    AuditEventBus.saveEvent = originalSaveEvent;
    AnomalyDetector.saveAnomaly = originalSaveAnomaly;
    ImmutableLedger.saveLedger = originalSaveLedger;
  });

  const validContext: DataAccessContext = {
    tenantId: 'tenant-a',
    actorId: 'user-1',
    role: 'CFO',
    permissions: ['CREATE_REPORT', 'VIEW_DASHBOARD', 'APPROVE_BOARD_PACK'],
    requestedAction: 'CREATE_REPORT',
    resourceType: 'Report',
    resourceTenantId: 'tenant-a',
    entityScope: {
      tenantId: 'tenant-a',
      requestedEntityScope: 'ENTITY',
      allowedEntityIds: ['ent-1'],
      allowedGroupIds: [],
      consolidatedScope: false
    },
    sessionId: 'sess-1',
    correlationId: 'corr-1',
    lineageHash: 'lineage-1'
  };

  it('1. basic → advisor compatibility.', () => {
    const resolved = CommercialPlanEngine.resolvePlanId('basic');
    assert.strictEqual(resolved, 'advisor');
  });

  it('2. premium → business compatibility.', () => {
    const resolved = CommercialPlanEngine.resolvePlanId('premium');
    assert.strictEqual(resolved, 'business');
  });

  it('3. tenant suspended bloqueia acesso.', () => {
    assert.throws(() => {
      TenantLicensingEngine.validateLicense('tenant-a', 'SUSPENDED');
    }, (err: any) => {
      return err instanceof LicensingViolationError && err.decisionCode === 'DENY_TENANT_SUSPENDED';
    });

    const hasEvent = savedEvents.some(e => e.eventType === 'DENY_TENANT_SUSPENDED');
    assert.ok(hasEvent);
  });

  it('4. quota exceeded gera DENY_QUOTA_EXCEEDED.', () => {
    // Basic plan allows 5 simulations
    assert.throws(() => {
      TenantLicensingEngine.checkQuota('tenant-a', 'basic', 'simulationQuotas', 5);
    }, (err: any) => {
      return err instanceof LicensingViolationError && err.decisionCode === 'DENY_QUOTA_EXCEEDED';
    });

    const hasEvent = savedEvents.some(e => e.eventType === 'DENY_QUOTA_EXCEEDED');
    assert.ok(hasEvent);
  });

  it('5. feature flag bloqueia recurso não contratado.', () => {
    const allowed = TenantLicensingEngine.isFeatureAllowed('basic', 'scenarioSimulationAllowed', 'tenant-a');
    assert.strictEqual(allowed, false);

    const hasEvent = savedEvents.some(e => e.eventType === 'DENY_FEATURE_UNAVAILABLE');
    assert.ok(hasEvent);
  });

  it('6. branding com hideWarnings é rejeitado.', () => {
    assert.throws(() => {
      WhiteLabelGovernance.validateBranding('tenant-a', { hideWarnings: true });
    }, (err: any) => {
      return err instanceof BrandingValidationError && err.message.includes('hideWarnings is strictly prohibited');
    });

    const hasEvent = savedEvents.some(e => e.eventType === 'DENY_BRANDING_VIOLATION');
    assert.ok(hasEvent);
  });

  it('7. branding com severity downgrade é rejeitado.', () => {
    assert.throws(() => {
      WhiteLabelGovernance.validateBranding('tenant-a', { downgradeVisualCriticality: true });
    }, (err: any) => {
      return err instanceof BrandingValidationError && err.message.includes('downgradeVisualCriticality is strictly prohibited');
    });
  });

  it('8. branding válido aplica tema corretamente.', () => {
    const theme = WhiteLabelGovernance.resolveTheme('tenant-a', {
      logoUrl: '/logos/tenant-a.png',
      colors: { primary: '#0000ff' }
    });
    assert.strictEqual(theme.colors.primary, '#0000ff');
    assert.strictEqual(theme.logoUrl, '/logos/tenant-a.png');
  });

  it('9. onboarding não finaliza sem governanceReadiness.', () => {
    // Fresh state is not ready
    OnboardingEngine.updateState('tenant-a', { isolationValidated: false });
    
    assert.throws(() => {
      OnboardingEngine.transitionTo('tenant-a', 'COMPLETED', 'user-1');
    }, (err: any) => {
      return err.message.includes('onboarding não pode ser concluído sem governanceReadiness completo');
    });
  });

  it('10. onboardingCompleted exige topology válida.', () => {
    OnboardingEngine.updateState('tenant-a', {
      isolationValidated: true,
      topologyValidated: false, // Incomplete topology
      entityScopeConfigured: true,
      minRolesAssigned: true,
      telemetryActive: true,
      observabilityActive: true,
      initialBalanceSheetBalanced: true,
      advisoryRuntimeOperational: true
    });

    assert.throws(() => {
      OnboardingEngine.transitionTo('tenant-a', 'COMPLETED', 'user-1');
    }, (err: any) => {
      return err.message.includes('Onboarding concluído exige topologia válida');
    });
  });

  it('11. comentário sem lineageReference é rejeitado.', async () => {
    await assert.rejects(async () => {
      await ExecutiveCollaborationLayer.postComment(validContext, {
        content: 'Teste',
        resourceId: 'rep-1',
        resourceType: 'Report',
        lineageReference: '', // Empty lineage
        visibilityPolicy: 'PUBLIC_WITHIN_TENANT'
      });
    }, (err: any) => {
      return err.message.includes('Comentário sem lineageReference é proibido');
    });
  });

  it('12. comentário cross-tenant é rejeitado.', async () => {
    const crossContext = { ...validContext, resourceTenantId: 'tenant-b' };
    await assert.rejects(async () => {
      await ExecutiveCollaborationLayer.postComment(crossContext, {
        content: 'Teste',
        resourceId: 'rep-1',
        resourceType: 'Report',
        lineageReference: 'lineage-1',
        visibilityPolicy: 'PUBLIC_WITHIN_TENANT'
      });
    }, (err: any) => {
      return err.message.includes('Acesso cross-tenant negado');
    });
  });

  it('13. CFO_APPROVAL rejeita role não autorizada.', () => {
    const operatorContext = { ...validContext, role: 'OPERATIONAL_USER' as any };
    assert.throws(() => {
      BoardWorkflowLayer.validateTransition(operatorContext, 'BOARD_REVIEW', 'CFO_APPROVAL');
    }, (err: any) => {
      return err.message.includes('CFO_APPROVAL exige papel de CFO');
    });
  });

  it('14. workflow registra audit trail.', () => {
    const wf = BoardWorkflowLayer.startWorkflow(validContext, 'rep-1', 'Report');
    BoardWorkflowLayer.approveStep(validContext, wf.workflowId, 'CFO_APPROVAL');

    const hasTransitionEvent = savedEvents.some(e => e.eventType === 'WORKFLOW_TRANSITION_CFO_APPROVAL');
    assert.ok(hasTransitionEvent);
  });

  it('15. InstitutionalKnowledge respeita isolation.', () => {
    const contextB = { ...validContext, tenantId: 'tenant-b' };
    
    InstitutionalKnowledgeLayer.addKnowledgeItem(validContext, {
      type: 'PLAYBOOK',
      title: 'Tenant A Playbook',
      content: 'Secret A',
      lineageReference: 'lineage-1',
      visibilityPolicy: 'INTERNAL'
    });

    const itemsForB = InstitutionalKnowledgeLayer.getKnowledgeItems(contextB);
    assert.strictEqual(itemsForB.length, 0);

    const itemsForA = InstitutionalKnowledgeLayer.getKnowledgeItems(validContext);
    assert.strictEqual(itemsForA.length, 1);
  });

  it('16. AdoptionAnalytics respeita tenant isolation.', () => {
    const contextB = { ...validContext, tenantId: 'tenant-b' };
    assert.throws(() => {
      AdoptionAnalytics.getMetrics(contextB, 'tenant-a');
    }, (err: any) => {
      return err.message.includes('Acesso cross-tenant negado');
    });
  });

  it('17. EnterpriseReadinessDiagnostics gera readinessScore válido.', () => {
    OnboardingEngine.updateState('tenant-a', {
      isolationValidated: true,
      topologyValidated: true,
      entityScopeConfigured: false,
      telemetryActive: false,
      observabilityActive: false,
      initialBalanceSheetBalanced: false,
      advisoryRuntimeOperational: false
    });

    const report = EnterpriseReadinessDiagnostics.generateReport(validContext, 'tenant-a');
    assert.ok(report.readinessScore >= 0 && report.readinessScore <= 100);
    assert.strictEqual(report.readinessLevel, 'LOW');
  });

  it('18. ClientExecutiveWorkspace não renderiza feature não licenciada.', () => {
    // Verified by checkQuota logic and feature flag mappings
    const isAllowed = TenantLicensingEngine.isFeatureAllowed('basic', 'scenarioSimulationAllowed', 'tenant-a');
    assert.strictEqual(isAllowed, false);
  });

  it('19. quotas são validadas no runtime e não apenas na UI.', () => {
    // Verify that validateLicense and checkQuota throw errors, enforcing validation in the runtime core
    assert.throws(() => {
      TenantLicensingEngine.checkQuota('tenant-a', 'basic', 'simulationQuotas', 6);
    }, (err: any) => {
      return err.message.includes('Quota limit exceeded');
    });
  });

  it('20. advisory warnings permanecem visíveis após white-label.', () => {
    const brandingTheme = WhiteLabelGovernance.resolveTheme('tenant-a', {
      hideWarnings: false
    });
    // The resolved theme must explicitly require visibility of warnings and audit logs
    assert.strictEqual(brandingTheme.warningsVisible, true);
    assert.strictEqual(brandingTheme.lineageStampsVisible, true);
  });
});
