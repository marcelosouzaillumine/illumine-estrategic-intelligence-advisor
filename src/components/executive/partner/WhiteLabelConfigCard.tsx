import React from 'react';
import { Palette } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';

export interface WhiteLabelConfigCardProps {
  readonly brandName: string;
  readonly primaryColor: string;
}

export const WhiteLabelConfigCard: React.FC<WhiteLabelConfigCardProps> = ({ brandName, primaryColor }) => {
  return (
    <ExecutiveSurface className="p-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Palette className="w-3.5 h-3.5 text-primary" />
          <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
            White Label & Branding Customizado ({brandName})
          </ExecutiveText>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: primaryColor }} />
          <span className="font-mono text-muted-foreground">{primaryColor}</span>
        </div>
      </div>
    </ExecutiveSurface>
  );
};
