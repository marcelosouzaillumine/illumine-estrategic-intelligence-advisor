import React, { useState } from 'react';
import { PageHeader } from '../../../../components/Common';
import { Database, Search } from 'lucide-react';
import { RecurrenceExplorer } from '../../../../components/memory/RecurrenceExplorer';
import { MemoryLineageViewer } from '../../../../components/memory/MemoryLineageViewer';
import { InstitutionalMemoryRuntime } from '../../../../core/memory/InstitutionalMemoryRuntime';
import { MockInstitutionalMemoryRepository } from '../../../../core/memory/InstitutionalMemoryRepository';
import { InstitutionalLearningQueryEngine } from '../../../../core/memory/InstitutionalLearningQueryEngine';
import { useNavigate } from 'react-router-dom';

export const InstitutionalMemoryWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const [activeMemoryId, setActiveMemoryId] = useState<string | null>(null);

  const runtime = new InstitutionalMemoryRuntime(new MockInstitutionalMemoryRepository());
  const queryEngine = new InstitutionalLearningQueryEngine(runtime);

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-10 space-y-8 pb-32 animate-executive-fade">
      <div className="flex justify-between items-start mb-4">
        <PageHeader
          title="Institutional Memory & Data Fabric"
          subtitle="Exploração rastreável do acervo fiduciário e recorrência de fatos organizacionais."
          icon={Database}
          transparent
        />
        <button
          onClick={() => {
            const navRef = {
              tenantId: 'SYSTEM_TENANT',
              sourceWorkspace: 'MEMORY_WORKSPACE',
              targetWorkspace: 'ADVISOR',
              correlationId: `nav-${Date.now()}`
            };
            navigate(`/advisor`, { state: { navRef } });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors border border-border shadow-sm"
        >
          <Search size={16} className="text-emerald-400" />
          <span>Voltar ao Advisor Workspace</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-slate-900/60 border border-border rounded-2xl p-6 text-center">
            <h4 className="text-sm font-bold text-muted-foreground">Registros de Memória</h4>
            <p className="text-xs text-muted-foreground mt-2">Selecione um fato para analisar recorrência e evidências</p>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <RecurrenceExplorer memoryId={activeMemoryId} queryEngine={queryEngine} />
        </div>

        <div className="xl:col-span-5 space-y-6">
          <MemoryLineageViewer memoryId={activeMemoryId} />
        </div>
      </div>
    </div>
  );
};
