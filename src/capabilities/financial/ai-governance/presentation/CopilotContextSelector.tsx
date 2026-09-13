import React from 'react';
import { Database, FileText } from 'lucide-react';

export function CopilotContextSelector({ selectedContexts, onToggle }: { selectedContexts: string[], onToggle: (ctx: string) => void }) {
  const availableContexts = [
    { id: 'REPORT', label: 'Executive Reports' },
    { id: 'SNAPSHOT', label: 'Financial Snapshots' },
    { id: 'VIOLATION', label: 'Governance Violations' }
  ];

  return (
    <div className="flex gap-2">
      {availableContexts.map(ctx => (
        <button
          key={ctx.id}
          onClick={() => onToggle(ctx.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            selectedContexts.includes(ctx.id) 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-surface-container border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          {ctx.id === 'REPORT' ? <FileText size={12} /> : <Database size={12} />}
          {ctx.label}
        </button>
      ))}
    </div>
  );
}
