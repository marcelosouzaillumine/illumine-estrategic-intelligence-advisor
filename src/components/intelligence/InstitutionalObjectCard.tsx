import React from 'react';
import { InstitutionalIntelligenceContext } from '../../types/intelligence/InstitutionalIntelligenceContext';
import { Network, History, Database, ShieldAlert, FileText, Info } from 'lucide-react';

interface Props {
  context: InstitutionalIntelligenceContext | null;
}

export const InstitutionalObjectCard: React.FC<Props> = ({ context }) => {
  if (!context) {
    return (
      <div className="card-premium p-6 text-center text-muted-foreground">
        <Info size={32} className="mx-auto mb-4 text-muted-foreground/60" />
        <p className="text-sm">Contexto indisponível.</p>
      </div>
    );
  }

  const { object, provenance, state, history, evidence, causality, impacts } = context;

  return (
    <div className="card-premium p-6 space-y-6">
      {/* Cabeçalho / Objeto */}
      <div className="border-b border-border pb-4">
        <span className="badge badge-info">
          {object.objectType}
        </span>
        <h2 className="text-h3 font-display mt-2 text-foreground">{object.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{object.description}</p>
        
        {provenance ? (
          <div className="mt-4 p-3 bg-surface-container rounded-lg border border-border text-xs text-muted-foreground">
            <span className="font-bold block text-foreground mb-1">Proveniência</span>
            <p>Origem: {provenance.origin}</p>
            <p>Runtime: {provenance.runtimeProducer}</p>
          </div>
        ) : (
          <p className="mt-4 text-xs italic text-muted-foreground">Proveniência indisponível.</p>
        )}
      </div>

      {/* Estado Atual */}
      <div>
        <h3 className="text-eyebrow text-foreground mb-3 flex items-center gap-2">
          <ActivityIcon /> Estado Atual
        </h3>
        {state ? (
          <div className="p-3 bg-surface-container rounded-lg">
            <p className="text-sm text-foreground">Status: <span className="font-mono text-emerald-400">{state.status}</span></p>
            <p className="text-xs text-muted-foreground mt-1">Atualizado em: {new Date(state.lastUpdated).toLocaleDateString()}</p>
          </div>
        ) : (
          <p className="text-xs italic text-muted-foreground">Estado indisponível.</p>
        )}
      </div>

      {/* Histórico */}
      <div>
        <h3 className="text-eyebrow text-foreground mb-3 flex items-center gap-2">
          <History size={14} /> Histórico
        </h3>
        {history.length > 0 ? (
          <ul className="space-y-2">
            {history.map((h, i) => (
              <li key={i} className="text-xs text-muted-foreground p-2 bg-surface-container rounded border border-border">
                <span className="text-sky-400 font-mono mr-2 tabular-nums">{new Date(h.timestamp).toLocaleDateString()}</span>
                {h.description}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs italic text-muted-foreground">Histórico indisponível.</p>
        )}
      </div>

      {/* Evidências */}
      <div>
        <h3 className="text-eyebrow text-foreground mb-3 flex items-center gap-2">
          <FileText size={14} /> Evidências
        </h3>
        {evidence.length > 0 ? (
          <ul className="space-y-2">
            {evidence.map((e, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-center justify-between p-2 bg-surface-container rounded border border-border">
                <span>{e.title}</span>
                <span className="text-[9px] uppercase bg-surface-container-highest px-1 py-0.5 rounded text-foreground">{e.validity}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs italic text-muted-foreground">Evidências indisponíveis.</p>
        )}
      </div>

      {/* Relações Causais */}
      <div>
        <h3 className="text-eyebrow text-foreground mb-3 flex items-center gap-2">
          <Network size={14} /> Relações Causais
        </h3>
        {causality.length > 0 ? (
          <ul className="space-y-2">
            {causality.map((c, i) => (
              <li key={i} className="text-xs text-muted-foreground p-2 bg-surface-container rounded border border-border">
                <span className="text-primary font-bold mr-1">{c.relationshipType}</span>
                {c.targetTitle}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs italic text-muted-foreground">Relacionamentos indisponíveis.</p>
        )}
      </div>

      {/* Impactos Estratégicos */}
      <div>
        <h3 className="text-eyebrow text-foreground mb-3 flex items-center gap-2">
          <ShieldAlert size={14} /> Impactos Estratégicos
        </h3>
        {impacts.length > 0 ? (
          <ul className="space-y-2">
            {impacts.map((imp, i) => (
              <li key={i} className="text-xs text-muted-foreground p-2 bg-surface-container rounded border border-border">
                <span className="text-amber-400 font-bold mr-1 block mb-1">[{imp.domain}]</span>
                {imp.description}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs italic text-muted-foreground">Impactos indisponíveis.</p>
        )}
      </div>

    </div>
  );
};

function ActivityIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  );
}
