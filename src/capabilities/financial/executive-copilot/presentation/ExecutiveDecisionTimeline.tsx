import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { GitCommit, PlayCircle, Flag, BookOpen } from 'lucide-react';

export function ExecutiveDecisionTimeline() {
  const steps = [
    { label: 'Decisão Criada', icon: <GitCommit className="w-4 h-4 text-slate-500" /> },
    { label: 'Alternativas Avaliadas', icon: <GitCommit className="w-4 h-4 text-slate-500" /> },
    { label: 'Decisão Aprovada', icon: <GitCommit className="w-4 h-4 text-blue-500" /> },
    { label: 'Execução', icon: <PlayCircle className="w-4 h-4 text-green-500" /> },
    { label: 'Resultado Observado', icon: <Flag className="w-4 h-4 text-amber-500" /> },
    { label: 'Aprendizado Institucional', icon: <BookOpen className="w-4 h-4 text-purple-500" /> },
  ];

  return (
    <Card className="bg-white shadow-sm border-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-semibold">Decision Cycle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative border-l border-slate-200 ml-3 space-y-6">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex items-center">
              <div className="absolute -left-[9px] bg-white p-1 rounded-full border border-slate-200 shadow-sm">
                {step.icon}
              </div>
              <div className="pl-6 text-sm font-medium text-slate-700">
                {step.label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
