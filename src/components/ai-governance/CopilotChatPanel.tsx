import React, { useState } from 'react';
import { Send, Bot } from 'lucide-react';
import { InstitutionalCopilotRuntime } from '../../core/runtime/ai-governance/InstitutionalCopilotRuntime';
import { MockLLMProvider } from '../../core/runtime/ai-governance/providers/MockLLMProvider';
import { AIQueryRequest, AIQueryResponse } from '../../core/runtime/ai-governance/AIGovernanceTypes';
import { CopilotSessionHistory } from './CopilotSessionHistory';
import { CopilotGroundingBadge } from './CopilotGroundingBadge';
import { CopilotSourceReferences } from './CopilotSourceReferences';
import { CopilotPolicyWarning } from './CopilotPolicyWarning';
import { CopilotTracePanel } from './CopilotTracePanel';

const provider = new MockLLMProvider(500);
const runtime = new InstitutionalCopilotRuntime(provider);

export function CopilotChatPanel() {
  const [messages, setMessages] = useState<{ role: string; content: string; responseMeta?: AIQueryResponse }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Hardcoded for demonstration. In production, this comes from TenancyProvider Context.
  const mockTenant = 'TENANT-HQ';
  const mockWorkspace = 'WS-1';
  const mockRole = 'MASTER_ADMIN';

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const request: AIQueryRequest = {
      query: userMessage,
      tenantId: mockTenant,
      workspaceId: mockWorkspace,
      userId: 'USER-1',
      role: mockRole,
      requestedContexts: ['REPORT'] // Padrão
    };

    const response = await runtime.processQuery(request);

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: response.blocked ? '' : response.answer,
      responseMeta: response
    }]);

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[600px] bg-background border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-xl p-4 text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-surface-container border border-border text-foreground'}`}>
              
              {m.role === 'assistant' && (
                <div className="mb-2 flex items-center gap-2 pb-2 border-b border-border/50">
                  <Bot size={16} className="text-primary" />
                  <span className="font-semibold text-xs">Illumine AI</span>
                  {m.responseMeta && <CopilotGroundingBadge references={m.responseMeta.groundingReferences} />}
                </div>
              )}

              {m.content && <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>}

              {m.responseMeta?.blocked && m.responseMeta.blockReason && (
                <CopilotPolicyWarning reason={m.responseMeta.blockReason} />
              )}

              {m.responseMeta?.groundingReferences && m.responseMeta.groundingReferences.length > 0 && (
                <CopilotSourceReferences references={m.responseMeta.groundingReferences} />
              )}

              {m.responseMeta && (
                <CopilotTracePanel traceId={m.responseMeta.aiTraceId} riskLevel={m.responseMeta.riskLevel} />
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-xl p-4 bg-surface-container border border-border text-foreground flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75"></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border bg-surface-container/50">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte ao Copiloto Institucional..."
            className="w-full bg-background border border-border rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md bg-primary text-primary-foreground disabled:opacity-50 transition-opacity hover:opacity-90"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
