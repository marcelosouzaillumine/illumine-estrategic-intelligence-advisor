import React, { useState } from 'react';
import { Bot, ShieldCheck } from 'lucide-react';
import { CopilotChatPanel } from '../ai-governance/CopilotChatPanel';
import { CopilotContextSelector } from '../ai-governance/CopilotContextSelector';

export function InstitutionalCopilotPage() {
  const [contexts, setContexts] = useState<string[]>(['REPORT']);

  const toggleContext = (ctx: string) => {
    setContexts(prev => prev.includes(ctx) ? prev.filter(c => c !== ctx) : [...prev, ctx]);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Bot className="text-primary" />
            Copiloto Institucional
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Inteligência Artificial Governeada. Respostas com grounding criptográfico e rastreabilidade fiduciária.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full">
          <ShieldCheck size={14} /> AI Governance Active
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Contextos Permitidos na Sessão:</p>
          <CopilotContextSelector selectedContexts={contexts} onToggle={toggleContext} />
        </div>

        <CopilotChatPanel />
      </div>
    </div>
  );
}
