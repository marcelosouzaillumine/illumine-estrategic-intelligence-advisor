import React, { useState } from 'react';
import { GraphQueryEngine } from '../../services/FiduciaryRuntimeAdapter';
import { GraphQueryResult } from '../../services/FiduciaryRuntimeAdapter';
import { Terminal, Play } from 'lucide-react';
import { SemanticRelationshipPanel } from './SemanticRelationshipPanel';

export function GraphQueryConsole({ tenantId }: { tenantId: string }) {
  const [result, setResult] = useState<GraphQueryResult | null>(null);

  const executeMockQuery = () => {
    // Simulando: "Quais decisions foram trigadas por alerts?"
    const res = GraphQueryEngine.executeQuery({
      queryId: 'QUERY-TEST',
      tenantId,
      requestorId: 'UI_CONSOLE',
      intent: 'Encontrar triplas que envolvam Alert e Decision via causalidade',
      nodeTypes: ['ALERT', 'WORKFLOW', 'DECISION']
    });
    setResult(res);
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 text-slate-300 font-mono text-sm relative">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
          <Terminal size={14} className="text-emerald-500" />
          <span className="text-emerald-500 text-xs tracking-widest">GRAPH_QUERY_ENGINE</span>
        </div>
        <div>
          <span className="text-purple-400">SELECT</span> path <br/>
          <span className="text-purple-400">FROM</span> InstitutionalKnowledgeGraph <br/>
          <span className="text-purple-400">WHERE</span> node.type IN ['ALERT', 'WORKFLOW', 'DECISION'] <br/>
          <span className="text-purple-400">WITH</span> tenantScope = '{tenantId}'
        </div>
        
        <button 
          onClick={executeMockQuery}
          className="absolute top-4 right-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500 p-2 rounded transition-colors"
        >
          <Play size={14} fill="currentColor" />
        </button>
      </div>

      {result && (
        <div className="animate-in fade-in slide-in-from-top-4">
          <SemanticRelationshipPanel data={result} />
        </div>
      )}
    </div>
  );
}
