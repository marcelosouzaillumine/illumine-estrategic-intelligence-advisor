import React from 'react';
import { Network } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { UniversalOntologyContract } from '@illumine/executive-contracts';

export interface UniversalOntologyCardProps {
  readonly ontology: UniversalOntologyContract;
}

export const UniversalOntologyCard: React.FC<UniversalOntologyCardProps> = ({ ontology }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Ontologia Universal — Domínio {ontology.domain}
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="neutral">
          Entidade: {ontology.entityType}
        </ExecutiveBadge>
      </div>

      <p className="text-muted-foreground text-xs leading-relaxed mt-1">
        <strong className="text-foreground">Definição Semântica: </strong>{ontology.semanticDefinition}
      </p>

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
        <span>Propriedades-Chave: <strong className="text-foreground">{ontology.keyProperties.join(', ')}</strong></span>
        <span>Relacionamentos: <strong className="text-primary">{ontology.relationships.join(', ')}</strong></span>
      </div>
    </ExecutiveSurface>
  );
};
