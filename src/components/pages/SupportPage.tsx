

import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { AdminSupportPanel } from './SupportPage/AdminSupportPanel';
import { ClientSupportPanel } from './SupportPage/ClientSupportPanel';
import { ShieldAlert, User as UserIcon, LifeBuoy } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { StatusBadge } from '../Common';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { useSupportPageViewModel } from '../../viewmodels/useSupportPageViewModel';

interface SupportPageProps {
  selectedClient?: string;
  isMaster?: boolean;
  user?: any | null;
}


export const SupportPage: React.FC<SupportPageProps> = ({ selectedClient, isMaster }) => {
  // Adapter: useSupportPageAdapter
  // ViewModel: useSupportPageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = useSupportPageViewModel({ clientId: selectedClient || '' });
  const portal = createPortal;
  const { translateLabel: t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'master' | 'client'>('master');

  const switcher = isMaster ? (
    <div className="flex mb-10 -mt-6 xl:ml-[4.5rem]">
      <div className="flex items-center gap-2 p-1.5 bg-surface-container border border-border rounded-full shadow-inner animate-executive-fade">
        <button
          onClick={() => setActiveTab('master')}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-full text-[11px] font-medium uppercase tracking-widest transition-all",
            activeTab === 'master' 
              ? "bg-secondary text-white shadow-premium" 
              : "text-muted-foreground hover:text-foreground hover:bg-black/5"
          )}
        >
          <ShieldAlert size={16} />
          Visão Master
        </button>
        <button
          onClick={() => setActiveTab('client')}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-full text-[11px] font-medium uppercase tracking-widest transition-all",
            activeTab === 'client' 
              ? "bg-primary text-white shadow-premium" 
              : "text-muted-foreground hover:text-foreground hover:bg-black/5"
          )}
        >
          <UserIcon size={16} />
          Meu Suporte
        </button>
      </div>
    </div>
  ) : null;

  const content = isMaster ? (
    activeTab === 'master' ? (
      <AdminSupportPanel headerAddon={switcher} />
    ) : (
      <ClientSupportPanel selectedClient={selectedClient} headerAddon={switcher} />
    )
  ) : (
    <ClientSupportPanel selectedClient={selectedClient} />
  );

  return (
    <ExecutivePageTemplate header={{
      title: "Central de Suporte & Fale Conosco",
      description: "Canal direto de governança corporativa, chamados e assistência técnica fiduciária.",
    }}>

      {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE ATENDIMENTO E SUPORTE) --- */}
      <ExecutiveSummarySection 
        className="mb-8"
        status={{ label: 'Suporte Ativo', variant: 'success' }}
        question="Como a central de suporte assegura a resolução ágil dos chamados operacionais e fiduciários?"
        opinion="O comitê fiduciário acompanha os indicadores de SLA, atestando a eficiência do atendimento ao cliente."
        driver="Chamados abertos, tempo médio de primeira resposta e índice de satisfação."
        implication="Manutenção do fluxo contínuo das operações sem interrupções críticas."
        action="Acompanhar semanalmente a fila de tickets prioritários para alocação de recursos de suporte."
      >
        <ExecutiveStrategicTensions tensions={[]} />
        <ExecutiveDecisionTrace trace={[]} />
      </ExecutiveSummarySection>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

        <div className="flex items-center gap-3">
          <StatusBadge status="Verde" label="Atendimento Conectado" />
        </div>
      
      </div>

      <div className="mt-12 mb-8 border-t border-border pt-8" />
      <ExecutiveAccordion
        title="Ajuda e Chamados"
        subtitle="Gerencie suas solicitações abertas ou abra um novo chamado."
        variant="analytics"
        defaultExpanded
      >

        {content}
      </ExecutiveAccordion>
    </ExecutivePageTemplate>
  );
};
