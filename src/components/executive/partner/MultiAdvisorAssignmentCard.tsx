import React from 'react';
import { Users } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';
import { AdvisoryAssignmentContract } from '@illumine/executive-contracts';

export interface MultiAdvisorAssignmentCardProps {
  readonly assignments: readonly AdvisoryAssignmentContract[];
}

export const MultiAdvisorAssignmentCard: React.FC<MultiAdvisorAssignmentCardProps> = ({ assignments }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
        <Users className="w-4 h-4 text-primary" />
        <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
          Atribuição Multi-Advisor por Empresa
        </ExecutiveText>
      </div>

      <div className="space-y-2 text-xs">
        {assignments.map(a => (
          <div key={a.assignmentId} className="flex items-center justify-between p-2 bg-surface-container/30 rounded border border-border/30">
            <span>Especialidade: <strong className="text-foreground">{a.roleType}</strong></span>
            <span>Advisor ID: <strong className="text-primary">{a.advisorId}</strong></span>
            <span>Escopo: <strong className="text-foreground">{a.permissionScope}</strong></span>
          </div>
        ))}
      </div>
    </ExecutiveSurface>
  );
};
