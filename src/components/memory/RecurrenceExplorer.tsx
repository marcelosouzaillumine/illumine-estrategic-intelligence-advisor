import React, { useEffect, useState } from 'react';
import { InstitutionalLearningQueryEngine } from '../../core/memory/InstitutionalLearningQueryEngine';

interface Props {
  memoryId: string | null;
  queryEngine: InstitutionalLearningQueryEngine;
}

export const RecurrenceExplorer: React.FC<Props> = ({ memoryId, queryEngine }) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!memoryId) return;
    queryEngine.countRecurrences('tenant_1', memoryId).then(setCount);
  }, [memoryId, queryEngine]);

  if (!memoryId) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
        <p className="text-slate-500 text-sm">Nenhum fato selecionado para explorar recorrência.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-sm font-bold text-slate-200 mb-4">Recorrência Histórica</h3>
      <div className="flex items-center gap-4">
        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <span className="block text-3xl font-bold text-emerald-400">{count}</span>
          <span className="text-xs text-slate-500 uppercase tracking-wider">Ocorrências</span>
        </div>
        <p className="text-xs text-slate-400">
          Esta métrica representa quantas vezes este Fato Institucional voltou a se manifestar no Knowledge Graph.
        </p>
      </div>
    </div>
  );
};
