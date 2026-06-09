import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { InvestigationLink, InvestigationOriginSurface } from '../../types/investigation/InvestigationLink';
import { InstitutionalObservabilityRegistry } from '../../core/observability/InstitutionalObservabilityRegistry';

interface InvestigationLauncherProps {
  link: InvestigationLink;
  originSurface: InvestigationOriginSurface;
  className?: string;
}

export const InvestigationLauncher: React.FC<InvestigationLauncherProps> = ({ link, originSurface, className = '' }) => {
  const navigate = useNavigate();

  if (!link || !link.investigationAvailable) {
    return null; // Operação Fail Closed
  }

  const handleLaunch = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const tenantId = 'SYSTEM_TENANT'; // Resolved from context in real implementation
    const userId = 'CURRENT_USER';

    await InstitutionalObservabilityRegistry.recordInvestigationLinkOpened(
      tenantId,
      link.correlationId,
      userId,
      link.nodeId,
      originSurface
    );

    navigate(`/investigation/${link.nodeId}`);
  };

  return (
    <button
      onClick={handleLaunch}
      className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 transition-all ${className}`}
      title={`Investigar: ${link.title}`}
    >
      <Search size={12} className="group-hover:scale-110 transition-transform" />
      <span className="text-[10px] font-bold uppercase tracking-wider">Investigar</span>
    </button>
  );
};
