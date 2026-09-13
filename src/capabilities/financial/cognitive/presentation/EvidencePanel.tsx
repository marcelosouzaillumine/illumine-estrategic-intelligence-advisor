import React from 'react';
import { CognitiveEvidenceItem } from '../../../../viewmodels/cognitive/ExecutiveCognitiveViewModel';

interface EvidencePanelProps {
  evidences: CognitiveEvidenceItem[];
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ evidences }) => {
  if (!evidences || evidences.length === 0) {
    return (
      <div className="p-6 mb-6 bg-surface-container/30 border border-border rounded-xl">
        <h3 className="text-lg font-bold text-foreground mb-2">Evidências Institucionais</h3>
        <p className="text-sm text-muted-foreground">
          Nenhuma evidência conectada disponível para a estrutura cognitiva atual. O grafo falhou em traçar um suporte determinístico ("Fail Closed").
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 mb-6 bg-card border border-border shadow-sm rounded-xl overflow-x-auto">
      <h3 className="text-lg font-bold text-foreground mb-2">Evidências Institucionais</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Fontes determinísticas que sustentam o nó atual no Knowledge Graph.
      </p>
      
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="py-2 px-3 text-xs uppercase tracking-wider text-muted-foreground font-semibold">ID</th>
            <th className="py-2 px-3 text-xs uppercase tracking-wider text-muted-foreground font-semibold">Título/Fato</th>
            <th className="py-2 px-3 text-xs uppercase tracking-wider text-muted-foreground font-semibold">Fonte</th>
            <th className="py-2 px-3 text-xs uppercase tracking-wider text-muted-foreground font-semibold">Tipo</th>
            <th className="py-2 px-3 text-xs uppercase tracking-wider text-muted-foreground font-semibold text-right">Confiança</th>
          </tr>
        </thead>
        <tbody>
          {evidences.map((ev) => (
            <tr key={ev.id} className="border-b border-border/50 hover:bg-surface-container/30 transition-colors">
              <td className="py-3 px-3 text-xs font-mono text-muted-foreground">{ev.id.split('-').pop()}</td>
              <td className="py-3 px-3 text-sm text-foreground font-medium">{ev.title}</td>
              <td className="py-3 px-3 text-sm">
                <span className="px-2 py-0.5 border border-border rounded-full text-xs text-muted-foreground">
                  {ev.source}
                </span>
              </td>
              <td className="py-3 px-3 text-sm text-muted-foreground">{ev.type}</td>
              <td className="py-3 px-3 text-right">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  ev.confidence === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                  ev.confidence === 'HIGH' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                  ev.confidence === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                  'bg-slate-100 text-muted-foreground border border-border'
                }`}>
                  {ev.confidence}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
