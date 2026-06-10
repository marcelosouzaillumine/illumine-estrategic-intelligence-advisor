import React, { useState } from 'react';
import { Bot, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../Common';
import { CopilotChatPanel } from '../ai-governance/CopilotChatPanel';
import { CopilotContextSelector } from '../ai-governance/CopilotContextSelector';

export function InstitutionalCopilotPage() {
  const [contexts, setContexts] = useState<string[]>(['REPORT']);

  const toggleContext = (ctx: string) => {
    setContexts(prev => prev.includes(ctx) ? prev.filter(c => c !== ctx) : [...prev, ctx]);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <PageHeader
          title="Copiloto Institucional"
          subtitle="Inteligência Artificial Governeada. Respostas com grounding criptográfico e rastreabilidade fiduciária."
          icon={Bot}
          transparent
        />
        <div className="flex items-center gap-2 px-4 py-2 bg-success-soft text-success border border-success/20 rounded-button text-[10px] font-bold uppercase tracking-widest shrink-0">
          <ShieldCheck size={14} /> AI Governance Active
        </div>
      </div>

      <div className="card-premium p-8 space-y-6">
        <div className="space-y-2">
          <h3 className="text-h3 font-medium text-foreground tracking-tight">Contextos Permitidos na Sessão</h3>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
            Selecione os contextos autorizados para esta sessão de consulta
          </p>
        </div>
        <CopilotContextSelector selectedContexts={contexts} onToggle={toggleContext} />
      </div>

      <CopilotChatPanel />
    </div>
  );
}
