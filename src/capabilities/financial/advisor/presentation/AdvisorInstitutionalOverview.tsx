import React from 'react';
import { UIOrganizationPortfolioItem, UIAdvisorInsight } from '../../../../viewmodels/advisor/AdvisorWorkspaceViewModel';
import { Layers, Lightbulb, ExternalLink } from 'lucide-react';
import { AdvisorNavigationEngine } from '../../../../core/advisor/AdvisorNavigationEngine';
import { useNavigate } from 'react-router-dom';

interface AdvisorInstitutionalOverviewProps {
  organization: UIOrganizationPortfolioItem;
  insights: UIAdvisorInsight[];
}

export const AdvisorInstitutionalOverview: React.FC<AdvisorInstitutionalOverviewProps> = ({
  organization,
  insights
}) => {
  const navigate = useNavigate();

  return (
    <div className="card-premium h-full space-y-6">
      
      {/* Header Institucional */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-h4 font-display font-medium text-foreground">{organization.name}</h3>
          <p className="text-eyebrow uppercase mt-1">Visão Institucional Consolidada</p>
          <button 
            onClick={() => AdvisorNavigationEngine.navigateToDigitalTwin(navigate, organization.id)}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-accent hover:text-accent transition-colors mt-2"
          >  
            <Layers size={14} /> Abrir Digital Twin
          </button>
        </div>
      </div>

      <div className="h-px bg-border w-full" />

      {/* Insights Resumidos */}
      <div>
        <h4 className="text-eyebrow uppercase mb-4 flex items-center gap-2">
          <Lightbulb size={14} /> Insights Institucionais (Read-Only)
        </h4>

        {insights.length === 0 ? (
          <p className="text-sm text-muted-foreground italic p-4 bg-surface-container rounded-lg">
            Sem insights ativos reportados pelas engines fiduciárias para esta organização.
          </p>
        ) : (
          <div className="space-y-3">
            {insights.map(insight => (
              <div key={insight.id} className="p-4 bg-surface-container-low rounded-xl border border-border">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest bg-surface-container px-2 py-0.5 rounded">
                    {insight.source}
                  </span>
                  <span className="text-[9px] text-muted-foreground">{insight.date}</span>
                </div>
                <h5 className="text-sm font-display font-medium text-foreground mb-1">{insight.title}</h5>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{insight.summary}</p>
                
                <div className="flex justify-end">
                  <button className="flex items-center gap-1 text-[10px] text-accent hover:text-accent uppercase font-bold tracking-wider">
                    Ver Contexto <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
