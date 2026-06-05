import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { InstitutionalOfferingRegistry } from '../../services/FiduciaryRuntimeAdapter';

export function CommercialPackagingViewer({ tenantId }: { tenantId: string }) {
  const tiers = InstitutionalOfferingRegistry.getTiers();

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="text-indigo-500" />
        <h3 className="text-sm font-semibold text-foreground">Commercial Packaging</h3>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {tiers.map(tier => (
          <div key={tier.tierId} className="flex justify-between items-center p-3 bg-background border border-border/50 rounded">
            <div>
              <span className="text-xs font-bold text-foreground block">{tier.name}</span>
              <span className="text-[10px] text-muted-foreground">{tier.features.join(', ')}</span>
            </div>
            <span className="text-sm font-bold text-indigo-500">${tier.basePrice}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
