import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
import { ExecutiveBadge as Badge } from '../../../../components/ui/executive-badge';
import { Scale, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { CognitiveGovernanceScore } from '../../../../../packages/shell/executive-cognitive-runtime/src/contracts/ExecutiveCognitiveGovernance';

interface ExecutiveCognitiveGovernanceCardProps {
  score: CognitiveGovernanceScore;
}

export function ExecutiveCognitiveGovernanceCard({ score }: ExecutiveCognitiveGovernanceCardProps) {
  const getScoreColor = (value: number) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 75) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <Card className="border-slate-200 shadow-sm bg-white hover:border-slate-300 transition-colors">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <Scale className="w-4 h-4 text-slate-600" />
            Cognitive Governance Score™
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold ${getScoreColor(score.overallScore)}`}>
              {score.overallScore}
            </span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
        </div>
        <CardDescription className="text-xs mt-1">
          Metacognitive validation of reasoning depth, diversity, and evidence quality.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Evidence Quality</span>
            <span className="font-medium">{score.evidenceQuality}/20</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Reasoning</span>
            <span className="font-medium">{score.reasoningCompleteness}/20</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Contradictions</span>
            <span className="font-medium">{score.contradictionAnalysis}/15</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Agent Diversity</span>
            <span className="font-medium">{score.agentDiversity}/15</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Historical Val.</span>
            <span className="font-medium">{score.historicalValidation}/15</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Reflection</span>
            <span className="font-medium">{score.reflectionQuality}/15</span>
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-100">
          {score.strengths.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" /> Strengths
              </p>
              <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                {score.strengths.map((str, i) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>
          )}
          
          {score.warnings.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-500" /> Warnings
              </p>
              <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                {score.warnings.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
