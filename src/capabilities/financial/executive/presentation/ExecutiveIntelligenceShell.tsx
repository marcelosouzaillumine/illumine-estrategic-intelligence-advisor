import React, { useState } from 'react';
import { ExecutiveIntelligenceDrawer } from '../../../../components/executive/ExecutiveIntelligenceDrawer';
import { Bot, Sparkles, X } from 'lucide-react';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { ExecutiveBadge } from '../../../../components/ui/executive-badge';
import { BRAND } from '../../../../config/brand';
export interface ExecutiveIntelligenceShellProps {
  children: React.ReactNode;
  pageTitle: string;
  pageContext: string;
  userRole?: string;
  companyName?: string;
  selectedYear?: number | string;
}

export const ExecutiveIntelligenceShell: React.FC<ExecutiveIntelligenceShellProps> = ({
  children,
  pageTitle,
  pageContext,
  companyName = 'Grupo Corporativo',
  selectedYear
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  return (
    <div className="relative min-h-screen text-foreground">
      {/* Main Page Content */}
      <main className="px-6 py-6 pb-24">
        {children}
      </main>

      {/* Persistent Intelligence Drawer */}
      <ExecutiveIntelligenceDrawer
        isOpen={isDrawerOpen}
        pageContext={pageContext}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Global Executive Copilot Floating Trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isCopilotOpen ? (
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground shadow-xl hover:bg-primary/90 transition-all border border-border/50 cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-primary-foreground animate-pulse" />
            <ExecutiveText variant="microLabel" className="text-primary-foreground font-semibold">
              {BRAND.advisoryName}
            </ExecutiveText>
          </button>
        ) : (
          <ExecutiveSurface variant="default" radius="md" padding="md" elevation="lg" className="w-80 shadow-2xl backdrop-blur-md border border-border">
            <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-secondary" />
                <ExecutiveHeading as="h4" variant="submoduleTitle" className="text-foreground">
                  {BRAND.advisoryName}
                </ExecutiveHeading>
              </div>
              <button 
                onClick={() => setIsCopilotOpen(false)} 
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1 rounded-md"
              >
                <X size={14} />
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <ExecutiveText variant="microLabel" className="text-muted-foreground">Empresa</ExecutiveText>
                <ExecutiveText variant="bodyStandard" className="font-medium text-foreground">{companyName}</ExecutiveText>
              </div>
              <div className="flex justify-between items-center text-xs">
                <ExecutiveText variant="microLabel" className="text-muted-foreground">Página</ExecutiveText>
                <ExecutiveText variant="bodyStandard" className="font-medium text-foreground">{pageTitle}</ExecutiveText>
              </div>
              <div className="flex justify-between items-center text-xs">
                <ExecutiveText variant="microLabel" className="text-muted-foreground">Período</ExecutiveText>
                <ExecutiveBadge variant="neutral">{selectedYear ? `${selectedYear}-YTD` : '2026-YTD'}</ExecutiveBadge>
              </div>

              <ExecutiveSurface variant="transparent" padding="sm" className="mt-3 bg-muted/20 border border-border/40 rounded-lg space-y-1.5">
                <ExecutiveText variant="microLabel" className="text-muted-foreground mb-1 block">Sugestões de análise:</ExecutiveText>
                <button 
                  onClick={() => setIsDrawerOpen(true)} 
                  className="block text-xs text-secondary hover:underline text-left font-medium cursor-pointer w-full"
                >
                  • Explicar variação dos indicadores
                </button>
                <button 
                  onClick={() => setIsDrawerOpen(true)} 
                  className="block text-xs text-secondary hover:underline text-left font-medium cursor-pointer w-full"
                >
                  • Analisar riscos financeiros
                </button>
              </ExecutiveSurface>
            </div>
          </ExecutiveSurface>
        )}
      </div>
    </div>
  );
};
