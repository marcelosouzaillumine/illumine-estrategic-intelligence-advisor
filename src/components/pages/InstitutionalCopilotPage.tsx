

import React, { useState } from 'react';
import { Bot, ShieldCheck } from 'lucide-react';
import { PageHeader, StatusBadge } from '../Common';
import { CopilotChatPanel } from '../ai-governance/CopilotChatPanel';
import { CopilotContextSelector } from '../ai-governance/CopilotContextSelector';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveHeading } from '../ui/executive-heading';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { useInstitutionalCopilotPageViewModel } from '../../viewmodels/useInstitutionalCopilotPageViewModel';
import { TenantIsolationContext } from '../../../packages/security/tenant-isolation-kernel/src';

export function InstitutionalAdvisoryPage() {
  // Adapter: useInstitutionalCopilotPageAdapter
  // ViewModel: useInstitutionalCopilotPageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = useInstitutionalCopilotPageViewModel({ clientId: '' });
  const [contexts, setContexts] = useState<string[]>(['REPORT']);

  // Representa o contexto extraído do Authentication/Governance Layer (nunca criado pela UI em prod)
  const certifiedContext: TenantIsolationContext = {
    tenantId: 'ACME-001',
    organizationId: 'ORG-ACME',
    userId: 'EXEC-001',
    authorizationScope: 'EXECUTIVE_BOARD',
    isolationBoundaryId: 'BOUNDARY-ACME-001',
    traceId: `AUTH-TRACE-${Date.now()}`,
    createdAt: new Date()
  };

  const toggleContext = (ctx: string) => {
    setContexts(prev => prev.includes(ctx) ? prev.filter(c => c !== ctx) : [...prev, ctx]);
  };

  return (
    <ExecutivePageTemplate header={{
      title: "Illumine Advisory™",
      description: "Inteligência Institucional Governeada. Respostas com grounding criptográfico e rastreabilidade fiduciária.",
    }}>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

        <div className="flex items-center gap-3">
          <StatusBadge status="Verde" label="IA Governeada Ativa" />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shrink-0">
          <ShieldCheck size={14} className="text-emerald-500" /> AI Governance Active
        </div>
      
      </div>

      <div className="mt-12 mb-8 border-t border-border pt-8" />
      <ExecutiveAccordion
        title="Painel de Grounding e Chat"
        subtitle="Interaja com a inteligência institucional dentro das diretrizes de governança."
        variant="analytics"
        defaultExpanded
      >

      <div className="space-y-12">

      <div className="card-premium p-8 space-y-6">
        <div className="space-y-2">
          <h3 className="text-h3 font-medium text-foreground tracking-tight">Contextos Permitidos na Sessão</h3>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
            Selecione os contextos autorizados para esta sessão de consulta
          </p>
        </div>
        <CopilotContextSelector selectedContexts={contexts} onToggle={toggleContext} />
      </div>

      <CopilotChatPanel tenantIsolationContext={certifiedContext} />
      </div>
      <ExecutiveSummarySection 
        status={{ label: 'Grounding Validade', variant: 'success' }}
        question="Como o sistema garante a precisão fiduciária nas respostas institucionais?"
        opinion="O comitê fiduciário homologa o motor de grounding criptográfico garantindo zero alucinações nas respostas."
        driver="Base fiduciária de conhecimento, checagem de alçadas e restrição de contexto."
        implication="Consultas rápidas com suporte documental auditável."
        executiveQuestion="Manter atualizados os contextos e arquivos de alçada fiduciária."
      >
        <ExecutiveStrategicTensions tensions={[]} />
        <ExecutiveDecisionTrace trace={[]} />
      </ExecutiveSummarySection>
      </ExecutiveAccordion>
    </ExecutivePageTemplate>
  );
}
