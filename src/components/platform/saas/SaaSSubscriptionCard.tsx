import React from 'react';
import { CreditCard } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { SaaSSubscriptionContract } from '@illumine/executive-contracts';

export interface SaaSSubscriptionCardProps {
  readonly subscription: SaaSSubscriptionContract;
}

export const SaaSSubscriptionCard: React.FC<SaaSSubscriptionCardProps> = ({ subscription }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Assinatura SaaS — Plano {subscription.planId}
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="success">
          {subscription.status}
        </ExecutiveBadge>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
        <span>Recursos Habilitados: <strong className="text-foreground">{subscription.enabledFeatures.join(', ')}</strong></span>
      </div>
    </ExecutiveSurface>
  );
};
