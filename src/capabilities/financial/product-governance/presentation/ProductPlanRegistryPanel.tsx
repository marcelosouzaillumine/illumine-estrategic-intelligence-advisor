import React from 'react';
import { ProductPlanRegistry } from '../../../../services/FiduciaryRuntimeAdapter';
import { ShieldCheck } from 'lucide-react';

export function ProductPlanRegistryPanel() {
  const plans = ProductPlanRegistry.getAllPlans();

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <ShieldCheck className="text-primary" /> Catálogo de Planos Institucionais
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map(plan => (
          <div key={plan.planId} className="border border-border/50 bg-background p-4 rounded hover:border-primary/50 transition-colors">
            <div className="text-sm font-bold text-foreground mb-1 uppercase tracking-wider">{plan.name}</div>
            <div className="text-xs text-muted-foreground line-clamp-2 mb-3 h-8">{plan.description}</div>
            <div className="text-[10px] text-muted-foreground uppercase font-semibold mb-1 border-t border-border/30 pt-2">Features Base</div>
            <div className="flex flex-wrap gap-1 mt-2">
              {Object.entries(plan.entitlements)
                .filter(([_, enabled]) => enabled)
                .slice(0, 3)
                .map(([featId]) => (
                  <span key={featId} className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">
                    {featId.replace(/_/g, ' ')}
                  </span>
                ))}
              {Object.entries(plan.entitlements).filter(([_, enabled]) => enabled).length > 3 && (
                <span className="text-[9px] bg-surface-container text-muted-foreground px-1.5 py-0.5 rounded border border-border">
                  +{Object.entries(plan.entitlements).filter(([_, enabled]) => enabled).length - 3} mais
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
