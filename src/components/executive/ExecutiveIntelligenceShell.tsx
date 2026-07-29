import React, { useState } from 'react';
import { ExecutiveIntelligenceDrawer } from './ExecutiveIntelligenceDrawer';
import { Bot, Sparkles } from 'lucide-react';

export interface ExecutiveIntelligenceShellProps {
  children: React.ReactNode;
  pageTitle: string;
  pageContext: string;
  userRole?: string;
  companyName?: string;
}

export const ExecutiveIntelligenceShell: React.FC<ExecutiveIntelligenceShellProps> = ({
  children,
  pageTitle,
  pageContext,
  companyName = 'Grupo Corporativo'
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
            className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-xs font-semibold text-white shadow-xl hover:from-blue-500 hover:to-indigo-500 transition-all border border-blue-400/30"
          >
            <Sparkles className="h-4 w-4 text-blue-200 animate-pulse" />
            <span>Executive Copilot</span>
          </button>
        ) : (
          <div className="w-80 rounded-2xl border border-border bg-card p-4 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-secondary" />
                <h4 className="text-xs font-semibold text-primary">Executive Copilot</h4>
              </div>
              <button onClick={() => setIsCopilotOpen(false)} className="text-executive-secondary hover:text-primary text-xs">✕</button>
            </div>
            <div className="space-y-2 text-[11px] text-executive-secondary">
              <p><strong className="text-primary">Empresa:</strong> {companyName}</p>
              <p><strong className="text-primary">Página:</strong> {pageTitle}</p>
              <p><strong className="text-primary">Período:</strong> 2026-YTD</p>
              <div className="mt-3 rounded-lg bg-surface-container p-2 border border-border space-y-1">
                <p className="text-executive-secondary font-medium">Sugestões de análise:</p>
                <button onClick={() => setIsDrawerOpen(true)} className="block text-secondary hover:underline text-left">
                  • Explicar variação dos indicadores
                </button>
                <button onClick={() => setIsDrawerOpen(true)} className="block text-secondary hover:underline text-left">
                  • Analisar riscos financeiros
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
