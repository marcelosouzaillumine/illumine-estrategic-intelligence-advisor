import React from 'react';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { Info } from 'lucide-react';
import { NarrativeBlock } from '../../../../../packages/shell/executive-intelligence-layer/src/contracts/ExecutiveEvidencePackage';

interface DecisionNarrativePanelProps {
  blocks: NarrativeBlock[];
}

export function DecisionNarrativePanel({ blocks }: DecisionNarrativePanelProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <ExecutiveSurface variant="default" padding="lg" radius="lg" className="border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Info size={16} className="text-executive-primary" />
        <ExecutiveHeading as="h4" className="text-foreground tracking-widest uppercase text-sm">
          Decision Narrative Panel™
        </ExecutiveHeading>
      </div>

      <div className="space-y-6">
        {blocks.map((block, i) => (
          <div key={i} className="space-y-2">
            <ExecutiveHeading as="h5" className="text-foreground text-sm font-semibold">
              {block.title}
            </ExecutiveHeading>
            <ExecutiveText variant="body" className="text-muted-foreground leading-relaxed">
              {block.body}
            </ExecutiveText>
            {block.recommendation && (
              <ExecutiveText variant="body" className="text-foreground font-medium mt-2">
                Recomendação: {block.recommendation}
              </ExecutiveText>
            )}
          </div>
        ))}
      </div>
    </ExecutiveSurface>
  );
}
