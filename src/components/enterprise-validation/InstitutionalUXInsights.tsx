import React from 'react';
import { MousePointerClick } from 'lucide-react';
import { CognitiveLoadEvaluator } from '../../core/runtime/ux-hardening/CognitiveLoadEvaluator';

export function InstitutionalUXInsights({ tenantId }: { tenantId: string }) {
  const uxMetrics = CognitiveLoadEvaluator.evaluate(tenantId);

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <MousePointerClick className="text-amber-500" />
        <h3 className="text-sm font-semibold text-foreground">Executive UX Hardening</h3>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Cognitive Load (CFO)</span>
            <span className="font-bold text-amber-500">{(uxMetrics.cognitiveLoadScore * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-border/50 h-2 rounded overflow-hidden">
            <div className="bg-amber-500 h-full" style={{ width: `${uxMetrics.cognitiveLoadScore * 100}%` }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Navigation Friction</span>
            <span className="font-bold text-emerald-500">{(uxMetrics.navigationFriction * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-border/50 h-2 rounded overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${uxMetrics.navigationFriction * 100}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
