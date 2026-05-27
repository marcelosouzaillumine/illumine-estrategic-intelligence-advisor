import React, { useState } from 'react';
import { useInstitutionalMemory } from '../../context/institutional-memory/InstitutionalMemoryProvider';
import { Search, Compass, BookOpen, Fingerprint } from 'lucide-react';
import { cn } from '../../lib/utils';

export function GovernanceHistoryExplorer() {
  const { records, lineageIntegrity } = useInstitutionalMemory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  if (lineageIntegrity === 'FAIL_CLOSED' || records.length === 0) {
    return null;
  }

  const filteredRecords = records.filter(r => 
    r.causalSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.narrativeSnapshot.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.governanceCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedRecord = records.find(r => r.memoryId === selectedRecordId);

  return (
    <div className="card-premium p-8 bg-card/45 border border-border/60 space-y-6 animate-executive-fade leading-relaxed">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-secondary" />
          <div>
            <h3 className="text-h3 font-display font-medium text-foreground tracking-tight">Histórico de Snapshots de Governança</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Exploração e auditoria de registros passados</p>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex items-center bg-surface-container/60 border border-border rounded-lg px-3 py-1.5 w-full sm:w-64 text-xs">
          <Search className="w-4 h-4 text-muted-foreground/60 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Buscar snapshots..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none p-0 outline-none text-foreground w-full focus:ring-0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left list (2 cols) */}
        <div className="lg:col-span-1 space-y-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
          {filteredRecords.map(r => (
            <button
              key={r.memoryId}
              onClick={() => setSelectedRecordId(r.memoryId)}
              className={cn(
                "w-full text-left p-4 rounded-xl border transition-all text-xs font-semibold space-y-1.5",
                selectedRecordId === r.memoryId
                  ? "bg-secondary/5 border-secondary text-foreground"
                  : "bg-surface-container/20 border-border/40 hover:bg-surface-container/30 text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-muted-foreground">
                <span>{new Date(r.timestamp).toLocaleDateString()}</span>
                <span>{r.governanceCategory}</span>
              </div>
              <h4 className="font-semibold text-foreground line-clamp-1">{r.causalSummary}</h4>
              <span className="text-[9px] font-mono text-muted-foreground block truncate">Lineage: {r.lineageHash}</span>
            </button>
          ))}
        </div>

        {/* Selected Snapshot Inspector (2 cols) */}
        <div className="lg:col-span-2 border-l border-border/40 pl-0 lg:pl-8">
          {selectedRecord ? (
            <div className="space-y-6 animate-executive-fade">
              <div>
                <span className="px-2 py-0.5 bg-secondary/15 text-secondary text-[8px] font-black uppercase tracking-wider rounded border border-secondary/25">
                  Snapshot: {selectedRecord.memorySource}
                </span>
                <h3 className="text-h3 font-display font-medium text-foreground tracking-tight mt-2">
                  {selectedRecord.causalSummary}
                </h3>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                  Data de Ingestão: {new Date(selectedRecord.timestamp).toLocaleString()}
                </p>
              </div>

              <div className="space-y-4 text-xs font-medium">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Resumo Narrativo</span>
                  <p className="p-4 rounded-xl bg-surface-container/25 border border-border/40 text-muted-foreground leading-relaxed">
                    {selectedRecord.narrativeSnapshot}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Severidade</span>
                    <p className="font-semibold text-foreground mt-0.5">{selectedRecord.severityLevel}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Urgença Executiva</span>
                    <p className="font-semibold text-foreground mt-0.5">{selectedRecord.executiveUrgency}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Recomendações Emitidas</span>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground font-medium">
                    {selectedRecord.recommendationSnapshot.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-border/40 flex flex-wrap justify-between gap-4 text-[10px] text-muted-foreground font-mono">
                  <span className="flex items-center gap-1">
                    <Fingerprint size={11} />
                    Lineage: {selectedRecord.lineageHash}
                  </span>
                  <span>Reference ID: {selectedRecord.runtimeReferenceId}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-center p-8 text-muted-foreground text-xs italic">
              <Compass className="w-8 h-8 text-muted-foreground/60 mb-2" />
              <span>Selecione um registro no painel lateral para inspecionar os detalhes do snapshot fiduciário.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
