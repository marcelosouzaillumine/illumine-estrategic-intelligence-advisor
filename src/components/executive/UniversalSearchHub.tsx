import React from 'react';
import { Search, X, Network, Database, History, Target } from 'lucide-react';
import { useUniversalSearchHubViewModel } from '../../capabilities/executive/presentation/view-models/useUniversalSearchHubViewModel';

export const UniversalSearchHub: React.FC = () => {
  const { state, computed, actions } = useUniversalSearchHubViewModel();

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header / Input */}
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Search size={20} className="text-muted-foreground" />
          <input
            type="text"
            autoFocus
            placeholder="Busca Institucional (Riscos, Cenários, Decisões)..."
            value={state.query}
            onChange={e => actions.setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-muted-foreground placeholder:text-muted-foreground text-lg"
          />
          <button 
            onClick={() => actions.setIsOpen(false)}
            className="p-1 hover:bg-slate-800 rounded-lg text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!computed.isSearchQueryEmpty && !computed.hasResults ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>Nenhum objeto encontrado.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {state.results.map(result => (
                <button
                  key={result.id}
                  onClick={() => actions.handleCrossNavigation(result)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 border border-border flex items-center justify-center text-muted-foreground group-hover:text-accent group-hover:border-accent transition-colors">
                      {result.type === 'SCENARIO' && <Target size={18} />}
                      {result.type === 'RISK' && <Network size={18} />}
                      {result.type === 'KPI' && <Database size={18} />}
                    </div>
                    <div>
                      <h4 className="text-muted-foreground font-medium">{result.title}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="text-primary font-mono">{result.type}</span>
                        <span>•</span>
                        <span>ID: {result.id}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground bg-slate-800 px-2 py-1 rounded">
                    {result.domain}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-3 border-t border-border bg-slate-900/50 text-xs text-muted-foreground flex justify-between items-center">
          <span>Busca Institucional Determinística</span>
          <span className="flex items-center gap-1">
            Navegue com <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-border font-sans text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-border font-sans text-[10px]">↓</kbd> e selecione com <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-border font-sans text-[10px]">Enter</kbd>
          </span>
        </div>
      </div>
    </div>
  );
};
