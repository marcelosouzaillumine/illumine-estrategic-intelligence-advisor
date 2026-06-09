import React, { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { InstitutionalDigitalTwinWorkspace } from '../digital-twin/InstitutionalDigitalTwinWorkspace';
import { InstitutionalDigitalTwinRuntime } from '../../core/digital-twin/InstitutionalDigitalTwinRuntime';
import { TwinAssemblyEngine } from '../../core/digital-twin/TwinAssemblyEngine';
import { FirestoreTwinRepository } from '../../services/digital-twin/FirestoreTwinRepository';
import { InstitutionalObservabilityRegistry } from '../../core/observability/InstitutionalObservabilityRegistry';

export const InstitutionalDigitalTwinPage: React.FC = () => {
  const { domainId } = useParams<{ domainId: string }>();
  
  const dependencies = useMemo(() => {
    const repository = new FirestoreTwinRepository();
    const runtime = new InstitutionalDigitalTwinRuntime(repository);
    const assemblyEngine = new TwinAssemblyEngine(repository);
    
    return { runtime, assemblyEngine };
  }, []);

  const tenantId = 'SYSTEM_TENANT';
  const userId = 'CURRENT_USER'; // Would come from auth context

  useEffect(() => {
    InstitutionalObservabilityRegistry.recordEvent({
      eventId: crypto.randomUUID(),
      eventType: 'DIGITAL_TWIN_OPENED',
      tenantId,
      correlationId: crypto.randomUUID(),
      engineId: 'InstitutionalDigitalTwinRuntime',
      timestamp: new Date().toISOString(),
      severity: 'INFO',
      userId,
      role: 'EXECUTIVE',
      lineageId: 'N/A',
      runtimeAuthority: 'System',
      sourceModule: 'InstitutionalDigitalTwin',
      targetOutput: 'UI',
      metadata: { domainId }
    }).catch(console.error);
  }, [domainId]);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200">
      <InstitutionalDigitalTwinWorkspace 
        runtime={dependencies.runtime}
        assemblyEngine={dependencies.assemblyEngine}
        tenantId={tenantId}
      />
    </div>
  );
};
