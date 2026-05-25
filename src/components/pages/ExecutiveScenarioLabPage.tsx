import React from 'react';
import { PageHeader } from '../Common';
import { FlaskConical, ShieldAlert } from 'lucide-react';

export function ExecutiveScenarioLabPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Executive Scenario Lab" 
        subtitle="Simulação contrafactual e projeções executivas" 
        icon={<FlaskConical size={24} className="text-primary" />} 
      />
      <div className="flex flex-col items-center justify-center p-12 bg-surface-container/50 border border-border rounded-2xl h-[50vh]">
        <ShieldAlert size={48} className="text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-foreground mb-2">Ambiente em Isolamento</h3>
        <p className="text-sm text-muted-foreground max-w-md text-center">
          A inteligência de cenários executivos migrou 100% para o Consolidated Runtime.
          A renderização aguarda a nova subscrição do contexto oficial.
        </p>
      </div>
    </div>
  );
}
