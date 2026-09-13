import React from 'react';
import { UIInvestigationNode } from '../../../../viewmodels/investigation/BoardInvestigationViewModel';
import { GitMerge, ArrowRight, History } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RelationshipExplorerProps {
  nodes: UIInvestigationNode[];
  title: string;
}

export const RelationshipExplorer: React.FC<RelationshipExplorerProps> = ({ nodes, title }) => {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="p-4 bg-surface-container border border-border rounded-xl">
        <h3 className="text-sm font-bold text-foreground mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground">
          Nenhuma relação causal disponível.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-eyebrow text-foreground uppercase tracking-wider">{title}</h3>
      <div className="flex flex-col gap-2">
        {nodes.map((node) => (
          <div key={node.id} className="p-3 bg-surface-container border border-border rounded-lg flex items-start gap-3 transition-colors hover:bg-surface-container-high">
            <div className="mt-0.5">
              <GitMerge className="text-primary" size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{node.title}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-[10px] font-mono text-muted-foreground bg-surface-container-highest px-1.5 py-0.5 rounded">
                  {node.type}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  node.confidence === 'VERIFIED' ? 'bg-success-soft0/10 text-emerald-400' :
                  node.confidence === 'HIGH' ? 'bg-primary text-primary' :
                  node.confidence === 'MEDIUM' ? 'bg-warning-soft0/10 text-amber-400' :
                  'bg-surface-container-highest text-muted-foreground'
                }`}>
                  {node.confidence}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Link 
                to={`/investigation/${node.id}`}
                className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-accent font-bold hover:underline"
              >
                Navegar <ArrowRight size={12} />
              </Link>
              <Link 
                to={`/governance-time-machine/${node.id}`}
                className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-sky-400 font-bold hover:underline"
              >
                <History size={12} /> Evolução
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
