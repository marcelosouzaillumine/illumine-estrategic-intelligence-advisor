import React from 'react';
import { UITwinDomain } from '../../viewmodels/digital-twin/InstitutionalDigitalTwinViewModel';
import { ShieldCheck, ShieldAlert, FileText, BarChart3, AlertCircle } from 'lucide-react';

interface DomainHealthExplorerProps {
  domains: UITwinDomain[];
}

export const DomainHealthExplorer: React.FC<DomainHealthExplorerProps> = ({ domains }) => {

  const renderConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case 'VERIFIED':
        return <span className="badge badge-success">Verificado</span>;
      case 'HIGH':
        return <span className="badge badge-info">Alta Conf.</span>;
      case 'MEDIUM':
        return <span className="badge badge-warning">Média Conf.</span>;
      case 'LOW':
        return <span className="badge badge-destructive">Baixa Conf.</span>;
      default:
        return <span className="badge bg-surface-container text-muted-foreground">Não Verificado</span>;
    }
  };

  return (
    <div className="space-y-4">
      {domains.map(domain => (
        <div key={domain.id} className="card-premium p-5 transition-colors hover:bg-surface-container-high">
          
          {/* Header do Domínio */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-display font-bold text-foreground">{domain.name}</h4>
                {renderConfidenceBadge(domain.confidence)}
              </div>
              <p className="text-eyebrow text-muted-foreground">{domain.type}</p>
            </div>
            {domain.status === 'N/A' || domain.status === 'UNKNOWN' ? (
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-muted-foreground">
                <AlertCircle size={14} />
              </div>
            ) : (
              <div className="text-right">
                <span className="text-eyebrow text-muted-foreground block mb-0.5">Status Persistido</span>
                <span className="text-xs font-bold text-foreground">{domain.status}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            {domain.description}
          </p>

          {/* Fail-closed checks */}
          {!domain.hasTimeline && !domain.hasGraphNode && domain.metrics.length === 0 ? (
            <div className="p-3 bg-surface-container rounded-lg border border-border flex items-center gap-2">
              <AlertCircle size={14} className="text-muted-foreground" />
              <span className="text-eyebrow text-muted-foreground font-bold">
                Estado institucional não disponível para este domínio.
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mt-4">
              
              {/* Métricas Persistidas */}
              {domain.metrics.length > 0 ? (
                <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                  {domain.metrics.map(metric => (
                    <div key={metric.label} className="p-2 bg-surface-container rounded border border-border">
                      <span className="text-eyebrow text-muted-foreground block truncate">{metric.label}</span>
                      <span className="text-xs font-bold text-foreground tabular-nums">{metric.value}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Indicadores de Conexão */}
              <div className={`p-2 rounded flex items-center gap-2 ${domain.hasGraphNode ? 'bg-insight text-insight border border-insight' : 'bg-surface-container text-muted-foreground border border-border'}`}>
                {domain.hasGraphNode ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                <span className="text-[10px] font-bold uppercase tracking-wider">Grafo</span>
              </div>
              
              <div className={`p-2 rounded flex items-center gap-2 ${domain.hasTimeline ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'bg-surface-container text-muted-foreground border border-border'}`}>
                {domain.hasTimeline ? <BarChart3 size={14} /> : <AlertCircle size={14} />}
                <span className="text-[10px] font-bold uppercase tracking-wider">Histórico</span>
              </div>

            </div>
          )}

        </div>
      ))}
    </div>
  );
};
