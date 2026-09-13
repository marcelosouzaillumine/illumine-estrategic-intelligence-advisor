import React from 'react';
import { History, ExternalLink } from 'lucide-react';
import { AdvisorNavigationEngine } from '../../../../core/advisor/AdvisorNavigationEngine';
import { useNavigate } from 'react-router-dom';

interface AdvisorHistoricalSurfaceProps {
  organizationId: string | null;
}

export const AdvisorHistoricalSurface: React.FC<AdvisorHistoricalSurfaceProps> = ({ organizationId }) => {
  const navigate = useNavigate();

  return (
    <div className="card-premium h-full flex flex-col">
      
      <div className="flex justify-between items-start">
        <h3 className="text-eyebrow uppercase tracking-widest flex items-center gap-2">
          <History size={14} /> Memória Institucional
        </h3>
      </div>

      {!organizationId ? (
        <p className="text-sm text-muted-foreground italic p-4 bg-surface-container rounded-lg text-center mt-4">
          Selecione uma organização para visualizar a memória institucional.
        </p>
      ) : (
        <div className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground italic">
            Navegue pela evolução fiduciária deste tenant visualizando as decisões auditadas pela governança.
          </p>

          <button 
            onClick={() => AdvisorNavigationEngine.navigateToHistoricalTimeline(navigate, 'SYSTEM', 'root')}
            className="w-full flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container-high rounded-xl border border-border transition-colors"
          >
            <div className="text-left">
              <h5 className="text-sm font-display font-medium text-foreground">Governance Time Machine</h5>
              <p className="text-sm text-muted-foreground mt-1">Explorar Linha do Tempo</p>
            </div>
            <ExternalLink size={16} className="text-muted-foreground" />
          </button>
        </div>
      )}

    </div>
  );
};
