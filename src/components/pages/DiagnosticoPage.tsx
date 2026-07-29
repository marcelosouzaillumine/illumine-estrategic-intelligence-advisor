import React from 'react';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { DiagnosticNarrative } from './diagnosis/DiagnosticNarrative';
import { useDiagnosticoPageViewModel } from '../../viewmodels/useDiagnosticoPageViewModel';
import { StatusBadge } from '../Common';

export function DiagnosticoPage(props?: any) {
  const { state } = useDiagnosticoPageViewModel(props);

  return (
    <ExecutivePageTemplate
      header={{
        title: 'Diagnóstico Empresarial Executivo (EAA)',
        subtitle: 'Avaliação Canônica de Maturidade Organizacional, Governança e Riscos Estratégicos',
        badge: 'DIAGNOSTIC EAA — L4 READY'
      }}
    >
      {/* Control Bar (Context Controls & Actions) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <StatusBadge status="Ativo" label="Diagnóstico EAA Homologado" />
          <StatusBadge status="Verde" label="L4 Architecture Ready" />
        </div>
      </div>

      <div className="space-y-8">
        <DiagnosticNarrative
          maturityScore={state.maturityScore}
          governanceScore={state.governanceScore}
          financialHealthScore={state.financialHealthScore}
        />
      </div>
    </ExecutivePageTemplate>
  );
}
