import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
import { Clock } from 'lucide-react';
import { ExecutiveDecisionContext } from '@illumine/executive-decision-intelligence';

interface ExecutiveDecisionHistoryCardProps {
  decision: ExecutiveDecisionContext;
}

export function ExecutiveDecisionHistoryCard({ decision }: ExecutiveDecisionHistoryCardProps) {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <CardTitle className="text-sm font-semibold">Decision History</CardTitle>
        </div>
        <CardDescription className="text-xs text-slate-500">
          ID: {decision.decisionId}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="border-l-2 border-slate-200 pl-3">
            <p className="text-xs font-semibold text-slate-500">Context</p>
            <p className="text-sm text-slate-700">{(decision.constraints as any)?.urgency || 'Normal'}</p>
          </div>
          <div className="border-l-2 border-slate-200 pl-3">
            <p className="text-xs font-semibold text-slate-500">Authority</p>
            <p className="text-sm text-slate-700">{(decision as any).executiveBrief?.decisionAuthority || (decision as any).authority || 'Executive Board'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
