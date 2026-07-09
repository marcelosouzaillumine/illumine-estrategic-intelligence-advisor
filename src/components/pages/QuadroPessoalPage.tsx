import React, { useState, useEffect } from 'react';
import { Users, Loader2, AlertCircle } from 'lucide-react';
import { useQuadroPessoalAdapter } from '../../adapters/ui/useQuadroPessoalAdapter';
import { PageHeader } from '../Common';
import { EmployeeManager } from '../EmployeeManager';
import { DashboardSkeleton } from '../ui/skeletons';

interface QuadroPessoalPageProps {
  clientId: string;
}

export function QuadroPessoalPage({ clientId }: QuadroPessoalPageProps) {
  const { loading, clientData } = useQuadroPessoalAdapter(clientId);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!clientId) {
    return (
      <div className="bg-slate-50 border border-border p-12 rounded-[32px] text-center space-y-4">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-muted-foreground mx-auto shadow-sm">
          <Users size={32} />
        </div>
    <h4 className="text-sm font-black text-executive-secondary uppercase tracking-widest">Nenhuma Empresa Selecionada</h4>
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest max-w-[250px] mx-auto">
          Selecione uma empresa no topo da página para gerenciar o quadro de pessoal.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32">
      <PageHeader 
        title="Quadro de Pessoal" 
        subtitle={`Gestão e cadastro de colaboradores para ${clientData?.fantasia || 'a empresa'}.`}
      />

      <div className="bg-white p-2 rounded-[32px] border border-border shadow-sm overflow-hidden">
        <EmployeeManager clientId={clientId} clientConfig={clientData} />
      </div>
    </div>
  );
}
