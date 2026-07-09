import React from 'react';
import { Target, History, Network, Compass, ChevronRight } from 'lucide-react';
import { InstitutionalWorkspaceType } from '../../types/intelligence/InstitutionalNavigationReference';
import { useNavigationAdapter } from '../../adapters/ui/useNavigationAdapter';

export interface GuidedJourney {
  id: string;
  title: string;
  description: string;
  targetWorkspace: InstitutionalWorkspaceType;
  path: string;
  iconType: 'TARGET' | 'HISTORY' | 'NETWORK' | 'COMPASS';
}

interface Props {
  journey: GuidedJourney;
}

export const GuidedInvestigationCard: React.FC<Props> = ({ journey }) => {
  const { navigateToWorkspace } = useNavigationAdapter();

  const handleStartJourney = () => {
    navigateToWorkspace(journey.targetWorkspace);
  };

  const getIcon = () => {
    switch (journey.iconType) {
      case 'TARGET': return <Target className="text-amber-400" size={24} />;
      case 'HISTORY': return <History className="text-sky-400" size={24} />;
      case 'NETWORK': return <Network className="text-primary" size={24} />;
      case 'COMPASS': return <Compass className="text-teal-400" size={24} />;
      default: return <Target className="text-muted-foreground" size={24} />;
    }
  };

  return (
    <button
      onClick={handleStartJourney}
      className="group w-full flex items-start gap-4 p-5 card-premium hover:shadow-md transition-all text-left"
    >
      <div className="w-12 h-12 rounded-xl bg-surface-container-high border border-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
        {getIcon()}
      </div>
      <div className="flex-1">
        <h4 className="text-foreground font-display font-bold text-lg mb-1">{journey.title}</h4>
        <p className="text-muted-foreground text-sm leading-relaxed">{journey.description}</p>
      </div>
      <div className="shrink-0 pt-2 text-muted group-hover:text-foreground transition-colors">
        <ChevronRight size={20} />
      </div>
    </button>
  );
};
