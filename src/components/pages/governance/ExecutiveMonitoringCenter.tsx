import React from 'react';
import { PageHeader } from '../../Common';
import { Target } from 'lucide-react';
import { Page } from '../../../app/navigation';
import { GovernanceCommandCenterProvider } from '../../../context/governance-command-center/GovernanceCommandCenterProvider';
import { GovernanceCommandCenterSurface } from '../../governance-command-center/GovernanceCommandCenterSurface';

interface GovernanceDashboardPageProps {
  clientId: string;
  onNavigate: (page: Page) => void;
  selectedMonth?: number;
  setSelectedMonth?: (month: number) => void;
  selectedYear?: number;
  setSelectedYear?: (year: number) => void;
}

export function ExecutiveMonitoringCenter({
  clientId,
  onNavigate
}: GovernanceDashboardPageProps) {
  return (
    <GovernanceCommandCenterProvider>
      <div className="space-y-6">
        <PageHeader 
          title="Executive Monitoring Center" 
          subtitle="Supervisão executiva e controle operacional de conformidade fiduciária" 
          icon={<Target size={24} className="text-primary" />} 
        />
        
        <GovernanceCommandCenterSurface />
      </div>
    </GovernanceCommandCenterProvider>
  );
}
