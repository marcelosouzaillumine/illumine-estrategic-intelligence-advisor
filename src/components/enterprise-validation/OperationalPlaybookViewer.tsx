import React from 'react';
import { BookOpen } from 'lucide-react';
import { EnterpriseOnboardingPlaybook } from '../../services/FiduciaryRuntimeAdapter';

export function OperationalPlaybookViewer({ tenantId }: { tenantId: string }) {
  const playbook = EnterpriseOnboardingPlaybook.getPlaybook();

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="text-amber-500" />
        <h3 className="text-sm font-semibold text-foreground">Active Playbook: {playbook.name}</h3>
      </div>
      <div className="space-y-2">
        {playbook.steps.map((step, idx) => (
          <div key={idx} className="flex gap-3 items-center text-sm p-2 bg-background rounded border border-border/50">
            <span className="w-5 h-5 flex items-center justify-center bg-amber-500/20 text-amber-500 rounded-full text-xs font-bold">{idx + 1}</span>
            <span className="text-foreground">{step}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-muted-foreground text-right">
        Estimated Time: <span className="font-bold text-foreground">{playbook.estimatedTimeHours} hours</span>
      </div>
    </div>
  );
}
