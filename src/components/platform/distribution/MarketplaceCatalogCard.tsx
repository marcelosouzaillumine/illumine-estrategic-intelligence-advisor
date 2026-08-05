import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { MarketplaceCatalogContract } from '@illumine/executive-contracts';
import { useExecutiveFormatter } from '../../../core/localization';

export interface MarketplaceCatalogCardProps {
  readonly item: MarketplaceCatalogContract;
}

export const MarketplaceCatalogCard: React.FC<MarketplaceCatalogCardProps> = ({ item }) => {
  const formatter = useExecutiveFormatter();
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Catálogo Marketplace — {item.title}
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="neutral">
          {item.category}
        </ExecutiveBadge>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
        <span>Preço: <strong className="text-success">{formatter.currency(item.priceValue)}</strong></span>
        <span>Rating: <strong className="text-foreground">★ {item.ratingScore}</strong></span>
        <span>Vendas: <strong className="text-primary">{formatter.number(item.salesCount)} downloads</strong></span>
      </div>
    </ExecutiveSurface>
  );
};
