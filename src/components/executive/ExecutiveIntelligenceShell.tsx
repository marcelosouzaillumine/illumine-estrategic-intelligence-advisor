import React, { useState } from 'react';
import { ExecutiveInsightsPanel } from './ExecutiveInsightsPanel';
import { ExecutiveIntelligenceDrawer } from './ExecutiveIntelligenceDrawer';
import { ExecutiveAgentActionMenu } from './ExecutiveAgentActionMenu';
import { ExecutiveAgentActionRegistry } from '@illumine/executive-page-intelligence';
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

  const actionMappings = ExecutiveAgentActionRegistry.getAllMappings();

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      {/* Top Insights Panel */}
      <div className="px-6 pt-6">
        <ExecutiveInsightsPanel
          pageTitle={pageTitle}
          onExplore={() => setIsDrawerOpen(true)}
        />
      </div>

      {/* Main Page Content */}
      <main className="px-6 pb-24">
        {children}

        {/* Agent Action Surface */}
        <div className="mt-8">
          <ExecutiveAgentActionMenu
            mappings={actionMappings}
            onSelectAction={() => setIsDrawerOpen(true)}
          />
        </div>
      </main>

      {/* Persistent Drawer */}
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
          <div className="w-80 rounded-2xl border border-slate-800 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-blue-400" />
                <h4 className="text-xs font-semibold text-slate-100">Executive Copilot</h4>
              </div>
              <button onClick={() => setIsCopilotOpen(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>
            <div className="space-y-2 text-[11px] text-slate-300">
              <p><strong>Empresa:</strong> {companyName}</p>
              <p><strong>Página:</strong> {pageTitle}</p>
              <p><strong>Período:</strong> 2026-YTD</p>
              <div className="mt-3 rounded-lg bg-slate-950 p-2 border border-slate-800 space-y-1">
                <p className="text-slate-400">Sugestões de análise:</p>
                <button onClick={() => setIsDrawerOpen(true)} className="block text-blue-400 hover:underline">
                  • Explicar variação dos indicadores
                </button>
                <button onClick={() => setIsDrawerOpen(true)} className="block text-blue-400 hover:underline">
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
