import React from 'react';
import { Sparkles, Command } from 'lucide-react';

export function ExecutiveCommandBar() {
  return (
    <div className="flex-1 max-w-2xl px-4 hidden md:block">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Sparkles className="h-4 w-4 text-primary opacity-70 group-focus-within:opacity-100 transition-opacity" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-12 py-2 bg-background border border-border rounded-full text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
          placeholder="Analise queda de margem, gere recomendações ou digite um comando..."
          readOnly
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium text-muted-foreground border border-border bg-card">
            <Command className="w-3 h-3" /> K
          </kbd>
        </div>
      </div>
    </div>
  );
}
