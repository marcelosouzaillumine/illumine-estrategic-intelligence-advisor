import { AdvisorWorkspaceRuntime } from '../../../core/advisor/AdvisorWorkspaceRuntime';
import { AdvisorContextEngine } from '../../../core/advisor/AdvisorContextEngine';
import { MockAdvisorWorkspaceRepository } from '../../../core/advisor/AdvisorWorkspaceRepository';
import { InstitutionalObservabilityRegistry } from '../../../core/observability/InstitutionalObservabilityRegistry';

export class AdvisorCommandApplicationService {
  private static repository = new MockAdvisorWorkspaceRepository();
  public static runtime = new AdvisorWorkspaceRuntime(AdvisorCommandApplicationService.repository);
  public static contextEngine = new AdvisorContextEngine(AdvisorCommandApplicationService.repository);

  static recordWorkspaceOpened(organizationId: string | undefined, advisorId: string, tenantId: string) {
    InstitutionalObservabilityRegistry.recordEvent({
      eventId: crypto.randomUUID(),
      eventType: 'ADVISOR_WORKSPACE_OPENED',
      tenantId,
      correlationId: crypto.randomUUID(),
      engineId: 'AdvisorWorkspaceRuntime',
      timestamp: new Date().toISOString(),
      severity: 'INFO',
      userId: advisorId,
      role: 'ADVISOR',
      lineageId: 'N/A',
      runtimeAuthority: 'System',
      sourceModule: 'AdvisorCommandCenter',
      targetOutput: 'UI',
      metadata: { organizationId }
    }).catch(console.error);
  }
}
