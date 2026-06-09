import React, { useState, useEffect } from 'react';
import { Search, X, Network, Database, History, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: string;
  title: string;
  domain: string;
  targetWorkspace: string;
  path: string;
}

export const UniversalSearchHub: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mock de Busca Institucional - Somente dados oficiais e estritos
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const mockData: SearchResult[] = [
      { id: 'sc-123', type: 'SCENARIO', title: 'Macroeconomia Q3', domain: 'War Room', targetWorkspace: 'WAR_ROOM', path: '/war-room' },
      { id: 'risk-456', type: 'RISK', title: 'Exposição Cambial', domain: 'Investigation', targetWorkspace: 'INVESTIGATION', path: '/investigation/risk-456' },
      { id: 'kpi-789', type: 'KPI', title: 'Índice de Resiliência', domain: 'Digital Twin', targetWorkspace: 'DIGITAL_TWIN', path: '/digital-twin' }
    ];

    const filtered = mockData.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) || 
      item.type.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
  }, [query]);

  const handleCrossNavigation = (result: SearchResult) => {
    const navRef = {
      tenantId: 'SYSTEM_TENANT',
      sourceWorkspace: 'UNIVERSAL_SEARCH',
      targetWorkspace: result.targetWorkspace,
      correlationId: `nav-${Date.now()}`
    };
    
    // Observersibilidade: UNIVERSAL_SEARCH_RESULT_SELECTED poderia ser disparada aqui
    
    setIsOpen(false);
    setQuery('');
    navigate(result.path, { state: { navRef } });
  };

  if (!isOpen) return null;

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
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-muted-foreground placeholder:text-muted-foreground text-lg"
          />
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-slate-800 rounded-lg text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim().length > 0 && results.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>Nenhum objeto encontrado.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map(result => (
                <button
                  key={result.id}
                  onClick={() => handleCrossNavigation(result)}
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
