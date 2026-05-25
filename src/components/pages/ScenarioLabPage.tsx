import React from 'react';
import { PageHeader } from '../Common';
import { FlaskConical, ShieldAlert } from 'lucide-react';

export function ScenarioLabPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Laboratório de Cenários Preditivos" 
        subtitle="Simulação contrafactual e testes de estresse (Sandbox)" 
        icon={<FlaskConical size={24} className="text-primary" />} 
      />
      <div className="flex flex-col items-center justify-center p-12 bg-surface-container/50 border border-border rounded-2xl h-[50vh]">
        <ShieldAlert size={48} className="text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-foreground mb-2">Simulação Temporariamente Indisponível</h3>
        <p className="text-sm text-muted-foreground max-w-md text-center">
          O Laboratório de Cenários está passando por um Hardening Institucional para garantir a topologia do Runtime Consolidado. Nenhuma simulação local está permitida neste ambiente.
        </p>
      </div>
    </div>
  );
}
