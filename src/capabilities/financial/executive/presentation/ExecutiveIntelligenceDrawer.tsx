import React from 'react';
import { X, ShieldCheck, FileText, Bot, HelpCircle } from 'lucide-react';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { ExecutiveBadge } from '../../../../components/ui/executive-badge';

export interface ExecutiveIntelligenceDrawerProps {
  isOpen: boolean;
  pageContext: string;
  onClose: () => void;
}

export const ExecutiveIntelligenceDrawer: React.FC<ExecutiveIntelligenceDrawerProps> = ({
  isOpen,
  pageContext,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-96 flex-col border-l border-border bg-card/95 text-card-foreground shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-secondary" />
          <ExecutiveHeading as="h3" variant="moduleTitle" className="text-sm font-semibold text-foreground">
            Executive Advisor — {pageContext}
          </ExecutiveHeading>
        </div>
        <button 
          onClick={onClose} 
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-container hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        <ExecutiveSurface variant="default" radius="md" padding="md" className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-secondary font-semibold">
            <FileText className="h-4 w-4 text-secondary" />
            <ExecutiveHeading as="h4" variant="submoduleTitle" className="text-foreground">Resumo Executivo</ExecutiveHeading>
          </div>
          <ExecutiveText variant="bodyStandard" className="text-muted-foreground">
            Análise institucional ativa para {pageContext}: monitoramento contínuo de variações operacionais, estrutura de custos e integridade fiduciária do exercício.
          </ExecutiveText>
        </ExecutiveSurface>

        <ExecutiveSurface variant="default" radius="md" padding="md" className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-warning font-semibold">
            <ShieldCheck className="h-4 w-4 text-warning" />
            <ExecutiveHeading as="h4" variant="submoduleTitle" className="text-foreground">Evidências Auditadas</ExecutiveHeading>
          </div>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs">
            <li>Consolidação e aderência aos padrões contábeis</li>
            <li>Conformidade com a estrutura de capital e governança</li>
            <li>Rastreabilidade fiduciária dos lançamentos do exercício</li>
          </ul>
        </ExecutiveSurface>

        <ExecutiveSurface variant="default" radius="md" padding="md" className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-success font-semibold">
            <Bot className="h-4 w-4 text-success" />
            <ExecutiveHeading as="h4" variant="submoduleTitle" className="text-foreground">Agentes Consultados</ExecutiveHeading>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <ExecutiveBadge variant="neutral">CFO Agent</ExecutiveBadge>
            <ExecutiveBadge variant="neutral">Risk Agent</ExecutiveBadge>
            <ExecutiveBadge variant="neutral">Simulation Agent</ExecutiveBadge>
          </div>
        </ExecutiveSurface>
      </div>

      <div className="border-t border-border p-4 bg-card">
        <div className="relative">
          <input
            type="text"
            placeholder="Pergunte sobre esta análise..."
            className="w-full rounded-lg border border-border bg-surface-container px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-secondary focus:outline-none transition-all"
          />
          <HelpCircle className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};
