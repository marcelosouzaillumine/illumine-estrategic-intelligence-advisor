import React from 'react';
import { useInvestigationLink } from '../../hooks/investigation/useInvestigationLink';
import { InvestigationLauncher } from './InvestigationLauncher';
import { InvestigationOriginSurface } from '../../types/investigation/InvestigationLink';

interface InvestigationLauncherWrapperProps {
  tenantId: string;
  nodeId: string;
  originSurface: InvestigationOriginSurface;
  className?: string;
}

export const InvestigationLauncherWrapper: React.FC<InvestigationLauncherWrapperProps> = ({
  tenantId,
  nodeId,
  originSurface,
  className
}) => {
  const link = useInvestigationLink(tenantId, nodeId, originSurface);

  if (!link) {
    return null; // Operação Fail Closed
  }

  return (
    <InvestigationLauncher link={link} originSurface={originSurface} className={className} />
  );
};
