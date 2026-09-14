import React from 'react';
import { UITwinDomain, UITwinRelationship } from '../../../../viewmodels/digital-twin/InstitutionalDigitalTwinViewModel';
import { Layers, Network, History, FileText } from 'lucide-react';

interface ExecutiveDigitalTwinDashboardProps {
  domains: UITwinDomain[];
  relationships: UITwinRelationship[];
}

export const ExecutiveDigitalTwinDashboard: React.FC<ExecutiveDigitalTwinDashboardProps> = ({ domains, relationships }) => {
  const totalDomains = domains.length;
  const totalRelationships = relationships.length;
  const domainsWithHistory = domains.filter(d => d.hasTimeline).length;
  const domainsWithGraph = domains.filter(d => d.hasGraphNode).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {/* Total Domains */}
      <div className="card-premium p-5 flex items-center justify-between">
        <div>
          <span className="text-eyebrow text-muted-foreground block mb-1">Domínios Institucionais</span>
          <span className="text-h2 font-display font-black text-foreground tabular-nums">{totalDomains}</span>
        </div>
        <Layers size={24} className="text-primary" />
      </div>

      {/* Total Relationships */}
      <div className="card-premium p-5 flex items-center justify-between">
        <div>
          <span className="text-eyebrow text-muted-foreground block mb-1">Conexões Estruturais</span>
          <span className="text-h2 font-display font-black text-foreground tabular-nums">{totalRelationships}</span>
        </div>
        <Network size={24} className="text-sky-400/50" />
      </div>

      {/* Cobertura Histórica */}
      <div className="card-premium p-5 flex items-center justify-between">
        <div>
          <span className="text-eyebrow text-muted-foreground block mb-1">Cobertura Histórica</span>
          <span className="text-h2 font-display font-black text-emerald-400 tabular-nums">{totalDomains > 0 ? Math.round((domainsWithHistory / totalDomains) * 100) : 0}%</span>
        </div>
        <History size={24} className="text-emerald-400/50" />
      </div>

      {/* Rastreabilidade Causal */}
      <div className="card-premium p-5 flex items-center justify-between">
        <div>
          <span className="text-eyebrow text-muted-foreground block mb-1">Integração Causal</span>
          <span className="text-h2 font-display font-black text-amber-400 tabular-nums">{totalDomains > 0 ? Math.round((domainsWithGraph / totalDomains) * 100) : 0}%</span>
        </div>
        <FileText size={24} className="text-amber-400/50" />
      </div>
    </div>
  );
};
