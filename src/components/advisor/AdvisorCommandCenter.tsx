import React, { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AdvisorWorkspaceShell } from './AdvisorWorkspaceShell';
import { AdvisorWorkspaceRuntime } from '../../core/advisor/AdvisorWorkspaceRuntime';
import { AdvisorContextEngine } from '../../core/advisor/AdvisorContextEngine';
import { MockAdvisorWorkspaceRepository } from '../../core/advisor/AdvisorWorkspaceRepository';
import { InstitutionalObservabilityRegistry } from '../../core/observability/InstitutionalObservabilityRegistry';

export const AdvisorCommandCenter: React.FC = () => {
  const { organizationId } = useParams<{ organizationId: string }>();
  
  const dependencies = useMemo(() => {
    // Usando Mock para focar na estrutura fiduciária e de observabilidade sem precisar instanciar Firestore real agora
    const repository = new MockAdvisorWorkspaceRepository();
    const runtime = new AdvisorWorkspaceRuntime(repository);
    const contextEngine = new AdvisorContextEngine(repository);
    
    return { runtime, contextEngine };
  }, []);

  const advisorId = 'CURRENT_ADVISOR';
  const tenantId = 'ADVISOR_FIRM_TENANT';

  useEffect(() => {
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
  }, [organizationId]);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200">
      <AdvisorWorkspaceShell 
        runtime={dependencies.runtime}
        contextEngine={dependencies.contextEngine}
        advisorId={advisorId}
        tenantId={tenantId}
      />
    </div>
  );
};
