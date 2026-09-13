import React, { useEffect, useState } from 'react';
import { FiduciaryRuntimeAdapter, GovernanceCoordinationResult } from '../../../../services/FiduciaryRuntimeAdapter';
import { ShieldCheck, BookOpen } from 'lucide-react';

export function GovernancePlaybookPanel({ tenantId }: { tenantId: string }) {
  const [result, setResult] = useState<GovernanceCoordinationResult | null>(null);

  useEffect(() => {
    // Inicialização do Mock (Simula acionamento pelo Early Warning de Crise de Liquidez)
    const baseResult = FiduciaryRuntimeAdapter.InstitutionalOrchestrationEngine.clearSandbox(tenantId);
    
    const evidence = FiduciaryRuntimeAdapter.GovernanceRecommendationEvidenceBinder.bindEvidence(
      tenantId,
      'Gatilho sistêmico ativado via Fase 18 (Asfixia de Liquidez) cruzado com simulação de impacto da Fase 19.',
      'EXEC-ORCH-' + Date.now(),
      'BOARD_EMERGENCY_SCOPE',
      ['WF-CAP-99'],
      ['ALERT-LIQ-01'],
      ['SIM-DIVESTMENT-01']
    );

    const coordination = FiduciaryRuntimeAdapter.InstitutionalOrchestrationEngine.coordinate(tenantId, 'PB-LIQUIDITY-CRISIS-01', evidence);
    setResult(coordination);

    return () => {
      FiduciaryRuntimeAdapter.InstitutionalOrchestrationEngine.clearSandbox(tenantId);
    };
  }, [tenantId]);

  if (!result) {
    return <div className="text-muted-foreground p-4">Carregando sandbox de orquestração...</div>;
  }

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <BookOpen size={120} />
      </div>
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="text-primary fill-primary" size={20} />
        <h3 className="text-lg font-bold text-foreground">Playbook Ativo: {result.playbook.name}</h3>
      </div>
      <p className="text-sm text-foreground/80 max-w-2xl mb-4">
        {result.playbook.description}
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-background border border-border p-3 rounded flex flex-col">
          <span className="font-bold text-muted-foreground uppercase mb-1">Status</span>
          <span className="text-amber-500 font-bold">{result.recommendation.status}</span>
        </div>
        <div className="bg-background border border-border p-3 rounded flex flex-col">
          <span className="font-bold text-muted-foreground uppercase mb-1">Supervisão Exigida</span>
          <span className="text-foreground">{result.playbook.supervisionRequirement}</span>
        </div>
        <div className="bg-background border border-border p-3 rounded flex flex-col">
          <span className="font-bold text-muted-foreground uppercase mb-1">Tenant Scope</span>
          <span className="text-foreground">{result.playbook.tenantScope}</span>
        </div>
        <div className="bg-background border border-border p-3 rounded flex flex-col">
          <span className="font-bold text-muted-foreground uppercase mb-1">Coordination ID</span>
          <span className="text-foreground truncate" title={result.coordinationId}>{result.coordinationId}</span>
        </div>
      </div>
    </div>
  );
}
