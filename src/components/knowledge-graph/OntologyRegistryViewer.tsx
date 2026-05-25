import React from 'react';
import { InstitutionalOntologyRegistry } from '../../core/runtime/knowledge-graph/InstitutionalOntologyRegistry';
import { Library } from 'lucide-react';

export function OntologyRegistryViewer() {
  const ontologies = InstitutionalOntologyRegistry.getOntologies();

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Library className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Institutional Ontology Map</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ontologies.map(o => (
          <div key={o.ontologyId} className="p-3 bg-background border border-border rounded text-sm">
             <div className="flex justify-between items-start mb-2">
               <span className="font-bold text-foreground">{o.label}</span>
               <span className="text-[10px] bg-surface-container border border-border text-muted-foreground px-1.5 py-0.5 rounded">
                 {o.category}
               </span>
             </div>
             <p className="text-xs text-muted-foreground">{o.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
