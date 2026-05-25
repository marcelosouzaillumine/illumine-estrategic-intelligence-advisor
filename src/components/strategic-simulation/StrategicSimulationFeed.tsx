import React, { useEffect, useState } from 'react';
import { StrategicDecisionSimulator } from '../../core/runtime/strategic-simulation/StrategicDecisionSimulator';
import { StrategicSimulationResult, StrategicSimulationInput } from '../../core/runtime/strategic-simulation/StrategicSimulationTypes';
import { StrategicDecisionEvidenceBinder } from '../../core/runtime/strategic-simulation/StrategicDecisionEvidenceBinder';
import { Landmark, Play } from 'lucide-react';

export function StrategicSimulationFeed({ tenantId }: { tenantId: string }) {
  const [result, setResult] = useState<StrategicSimulationResult | null>(null);

  useEffect(() => {
    // Inicialização do Mock (simulando que o usuário apertou "Executar Simulação" ou ela roda ao entrar)
    StrategicDecisionSimulator.clearSandbox(tenantId);
    
    const evidence = StrategicDecisionEvidenceBinder.bindEvidence(
      tenantId,
      'Proposta de venda da subsidiária operacional sul por problemas contínuos de fluxo de caixa.',
      'EXEC-' + Date.now(),
      ['WF-CAP-99'],
      ['ALERT-LIQ-01'],
      ['SCN-STR-02'],
      ['BMK-09'],
      ['PATT-KG-05']
    );

    const input: StrategicSimulationInput = {
      simulationId: 'SIM-' + Date.now(),
      tenantId,
      decision: {
        decisionId: 'DEC-' + Date.now(),
        tenantId,
        category: 'DIVESTMENT',
        title: 'Venda de Subsidiária Estratégica (Região Sul)',
        description: 'Simulação dos impactos de desinvestimento total da subsidiária sul para injeção imediata de caixa.',
        evidence
      },
      timeframeMonths: 24
    };

    const simResult = StrategicDecisionSimulator.simulate(input);
    setResult(simResult);
    
    return () => {
      // Limpeza de sandbox ao desmontar
      StrategicDecisionSimulator.clearSandbox(tenantId);
    };
  }, [tenantId]);

  if (!result) {
    return <div className="text-muted-foreground p-4">Carregando sandbox estratégico...</div>;
  }

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Landmark size={120} />
      </div>
      <div className="flex items-center gap-2 mb-4">
        <Play className="text-primary fill-primary" size={20} />
        <h3 className="text-lg font-bold text-foreground">Sandbox Ativo: {result.input.decision.title}</h3>
      </div>
      <p className="text-sm text-foreground/80 max-w-2xl">
        {result.input.decision.description}
      </p>
      <div className="mt-4 flex gap-4 text-xs font-mono text-muted-foreground">
        <span className="bg-background px-2 py-1 rounded border border-border">SIM ID: {result.simulationId}</span>
        <span className="bg-background px-2 py-1 rounded border border-border">TIMEFRAME: {result.input.timeframeMonths} meses</span>
      </div>
    </div>
  );
}
