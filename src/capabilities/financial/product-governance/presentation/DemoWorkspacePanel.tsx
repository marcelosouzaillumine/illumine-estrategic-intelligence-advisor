import React from 'react';
import { TestTubeDiagonal } from 'lucide-react';

export function DemoWorkspacePanel({ isDemo }: { isDemo: boolean }) {
  if (!isDemo) return null;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-4">
      <TestTubeDiagonal className="text-primary mt-0.5" />
      <div>
        <h3 className="text-sm font-semibold text-primary uppercase tracking-widest">Demo Isolation Active</h3>
        <p className="text-xs text-foreground mt-1">Este workspace está rodando em sandbox fiduciário. Nenhuma alteração afetará a rede real de inteligência nem benchmarks institucionais.</p>
      </div>
    </div>
  );
}
