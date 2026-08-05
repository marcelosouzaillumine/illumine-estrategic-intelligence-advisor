import React from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Loader2, Trash2, CheckCircle, AlertTriangle, Eraser } from 'lucide-react';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { StatusBadge } from '../Common';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { useCleanupToolPageViewModel } from '../../viewmodels/useCleanupToolPageViewModel';




export function CleanupTool() {
  // Adapter: useCleanupToolPageAdapter
  // ViewModel: useCleanupToolPageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = useCleanupToolPageViewModel();
  const { loading, status, clientId } = vmState;
  const setStatus = vmActions.setStatus;

  const clearData = async () => {
    if (!clientId) return;
    vmActions.setStatus([]);
    
    try {
      const q = query(
        collection(db, 'financial_entries'), 
        where('clientId', '==', clientId),
        where('type', '==', 'DRE'),
        where('year', 'in', [2025, 2026])
      );
      const snap = await getDocs(q);
      
      if (snap.empty) {
        setStatus((prev: any[]) => [...prev, { type: 'info', message: `Nenhum registro da DRE encontrado para 2025 e 2026.` }]);
      } else {
        const deletePromises = snap.docs.map(d => deleteDoc(doc(db, 'financial_entries', d.id)));
        await Promise.all(deletePromises);
        setStatus((prev: any[]) => [...prev, { type: 'success', message: `${snap.size} registros DRE de 2025-2026 removidos com sucesso.` }]);
      }
    } catch (e: any) {
      setStatus((prev: any[]) => [...prev, { type: 'error', message: `Erro: ${e.message}` }]);
    }
  };

  return (
    <ExecutivePageTemplate header={{
      title: "Limpeza de DRE (2025-2026)",
      description: "Ferramenta técnica para reparo e expurgo de dados contábeis em ambientes de homologação.",
    }}>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

        <div className="flex items-center gap-3">
          <StatusBadge status="Amarelo" label="Operação Destrutiva de Banco de Dados" />
        </div>
      
      </div>

      <div className="mt-12 mb-8 border-t border-border pt-8" />
      <ExecutiveAccordion
        title="Painel de Controle de Expurgos"
        subtitle="Monitore o andamento e execute o script de deleção de tabelas."
        variant="analytics"
        defaultExpanded
      >

      <div className="max-w-2xl mx-auto space-y-8">
        <div className="bg-card p-8 rounded-3xl border border-border shadow-xl">
          <h1 className="text-2xl font-bold text-primary mb-2">Painel de Expurgos Contábeis</h1>
          <p className="text-muted-foreground mb-6">Esta ferramenta irá apagar permanentemente os registros de DRE da empresa Empório referentes aos anos de 2025 e 2026.</p>
        
        {clientId ? (
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-6">
            <p className="text-sm font-bold text-blue-700">Empresa Identificada: Empório do Marmore</p>
            <p className="text-[10px] text-blue-600 uppercase tracking-widest mt-1">ID: {clientId}</p>
          </div>
        ) : !loading && (
          <div className="p-4 bg-critical-soft border border-rose-100 rounded-xl mb-6">
            <p className="text-sm font-bold text-rose-700">Erro: Empresa não encontrada no banco.</p>
          </div>
        )}

        <button
          onClick={clearData}
          disabled={loading || !clientId}
          className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rose-700 disabled:opacity-50 transition-all shadow-lg shadow-rose-900/20"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
          Zerar DRE (2025 e 2026)
        </button>
      </div>

      <div className="space-y-4">
        {status.map((s: any, i: number) => (
          <div key={i} className={`p-4 rounded-2xl border flex items-center gap-3 ${
            s.type === 'success' ? 'bg-success-soft border-emerald-100 text-emerald-700' :
            s.type === 'error' ? 'bg-critical-soft border-rose-100 text-rose-700' :
            'bg-slate-50 border-border text-muted-foreground'
          }`}>
            {s.type === 'success' ? <CheckCircle size={18} /> : 
             s.type === 'error' ? <AlertTriangle size={18} /> : 
             <Loader2 size={18} className={loading ? "animate-spin" : ""} />}
            <p className="text-xs font-bold">{s.message}</p>
          </div>
        ))}
      </div>
      </div>
      <ExecutiveSummarySection 
        status={{ label: 'Ferramenta de Manutenção', variant: 'warning' }}
        question="Qual a governança e controle de segurança para a execução de expurgos técnicos?"
        opinion="O comitê fiduciário homologa a ferramenta de limpeza para uso exclusivo em ambientes de homologação e testes."
        driver="Operações destrutivas controladas, isolamento por CNPJ e registro de auditoria."
        implication="Prevenção contra deleções acidentais de registros em ambientes de produção."
        executiveQuestion="Restringir o acesso deste console a perfis de superadministradores de infraestrutura."
      >
        <ExecutiveStrategicTensions tensions={[]} />
        <ExecutiveDecisionTrace trace={[]} />
      </ExecutiveSummarySection>
      </ExecutiveAccordion>
    </ExecutivePageTemplate>
  );
}
