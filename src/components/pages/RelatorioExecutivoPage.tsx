
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  Target, 
  Activity, 
  Zap, 
  FileText,
  FileDown,
  MessageSquarePlus,
  Layout,
  CheckCircle2,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { formatCurrency, cn } from '../../lib/utils';
import { useModuleData } from '../../hooks/useModuleData';
import { useRealIndicatorData } from '../../hooks/useRealIndicatorData';
import { useAllFinancialData } from '../../hooks/useFinancialData';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { evaluateFinancialRules } from '../../lib/governanceIntelligence';
import { GovernanceInsightPanel } from '../GovernanceInsightPanel';

interface RelatorioExecutivoPageProps {
  clientId: string;
  selectedMonth: number;
  selectedYear: number;
}

interface OKR {
  id: string;
  titulo: string;
  progressoGeral: number;
}

interface Diagnostico {
  id: string;
  descricao: string;
  iveScore: number;
}

interface Diretrizes {
  proposito: string;
  historia: string;
  missao: string;
  visao: string;
  valores: { nome: string; definicao: string }[];
}

export function RelatorioExecutivoPage({ clientId, selectedMonth, selectedYear }: RelatorioExecutivoPageProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [consultantNotes, setConsultantNotes] = useState('');

  const { data: okrs } = useModuleData<OKR>(clientId, 'okrs');
  const { data: diagnostico } = useModuleData<Diagnostico>(clientId, 'diagnostico');
  const { data: diretrizes } = useModuleData<Diretrizes>(clientId, 'diretrizes');
  const { kpis } = useRealIndicatorData(clientId, selectedMonth, selectedYear);

  const mvv = diretrizes && diretrizes.length > 0 ? diretrizes[0] : null;
  const topDiagnostico = useMemo(() => [...(diagnostico || [])].sort((a, b) => (b.iveScore || 0) - (a.iveScore || 0)).slice(0, 3), [diagnostico]);
  const topOkrs = useMemo(() => [...(okrs || [])].sort((a, b) => (b.progressoGeral || 0) - (a.progressoGeral || 0)).slice(0, 3), [okrs]);
  
  const sacerdotalRules = useMemo(() => evaluateFinancialRules(kpis), [kpis]);
  
  const [dbIndicators, setDbIndicators] = useState<any[]>([]);
  useEffect(() => {
    if (!clientId) return;
    const q = query(
      collection(db, 'indicators'),
      where('clientId', '==', clientId),
      where('ano', '==', selectedYear),
      where('mes', '==', selectedMonth)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDbIndicators(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [clientId, selectedYear, selectedMonth]);

  const getIndicatorValue = (name: string, fallback: number = 0) => {
    const ind = dbIndicators.find(i => i.ind === name || i.ind?.toLowerCase() === name.toLowerCase());
    return ind ? ind.val : fallback;
  };

  const actionStats = useMemo(() => {
    if (!okrs) return { total: 0, completed: 0, pending: 0 };
    // This is just a simulation or we could fetch real action_items here
    return { total: 12, completed: 8, pending: 4 }; 
  }, [okrs]);

  const generateReportSummary = async () => {
    setIsAiLoading(true);
    // Simulation of AI summary generation based on indicators
    setTimeout(() => {
      setAiSummary(`Com base nos indicadores de ${selectedMonth}/${selectedYear}, observamos uma margem EBITDA de ${(kpis.ebitda ?? 0) > 0 ? 'saudável' : 'crítica'}. As prioridades do IVE indicam necessidade de foco em ${topDiagnostico[0]?.descricao || 'processos internos'}.`);
      setIsAiLoading(false);
    }, 1500);
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`relatorio-executivo-${clientId}-${selectedMonth}-${selectedYear}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Control Bar */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Painel de Compliance</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Gerador de Relatórios Mensais</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={generateReportSummary}
            disabled={isAiLoading}
            className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all disabled:opacity-50"
          >
            {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <TrendingUp size={14} />} 
            {aiSummary ? 'Regerar Resumo IA' : 'Gerar Resumo IA'}
          </button>
          <button
            onClick={downloadPDF}
            disabled={isGenerating}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-xl hover:shadow-primary/20 transition-all shadow-lg shadow-primary/10 disabled:opacity-50"
          >
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />} Exportar PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
               <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                 <MessageSquarePlus size={16} className="text-primary" /> Notas do Consultor
               </h4>
               <textarea 
                 value={consultantNotes}
                 onChange={e => setConsultantNotes(e.target.value)}
                 className="w-full h-64 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium outline-none focus:ring-2 focus:ring-primary/10 resize-none"
                 placeholder="Adicione suas observações personalizadas aqui..."
               />
               <p className="text-[10px] text-slate-400 font-medium italic">
                 Dica: Use estas notas para destacar pontos específicos da reunião mensal.
               </p>
            </div>
         </div>

         <div className="lg:col-span-3">
            {/* PDF PREVIEW CONTAINER */}
            <div 
              ref={reportRef}
              className="bg-white shadow-2xl rounded-[40px] border border-slate-100 p-16 max-w-[800px] mx-auto overflow-hidden font-sans text-slate-800"
            >
               {/* Cover/Header */}
               <div className="border-b-4 border-primary pb-10 mb-12 flex justify-between items-end">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white">
                           <Layout size={24} />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">Relatório Executivo</h1>
                     </div>
                     <div className="space-y-1">
                        <p className="text-sm font-black text-secondary tracking-widest uppercase">Illumine Strategic Advisory</p>
                        <p className="text-xs font-bold text-slate-400">Referência: {selectedMonth}/{selectedYear}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="bg-slate-900 text-white px-4 py-2 rounded-xl inline-block mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest">Confidencial</span>
                     </div>
                  </div>
               </div>

               {/* Strategic Core */}
               <div className="grid grid-cols-2 gap-12 mb-12 border-b border-slate-100 pb-12">
                  <div className="bg-primary p-10 rounded-[32px] text-white shadow-xl">
                     <p className="text-primary/60 text-[8px] font-black uppercase tracking-[0.2em] mb-1">Propósito</p>
                     <p className="text-white text-[11px] font-medium leading-relaxed italic">"{mvv?.proposito || 'Propósito não definido'}"</p>
                     <div className="mt-8 flex gap-4">
                        <div>
                           <p className="text-primary/60 text-[8px] font-black uppercase tracking-[0.2em] mb-1">Missão</p>
                           <p className="text-[9px] font-medium opacity-80 leading-relaxed truncate max-w-[150px]">{mvv?.missao || 'Não definida'}</p>
                        </div>
                        <div>
                           <p className="text-primary/60 text-[8px] font-black uppercase tracking-[0.2em] mb-1">Visão</p>
                           <p className="text-[9px] font-medium opacity-80 leading-relaxed truncate max-w-[150px]">{mvv?.visao || 'Não definida'}</p>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <h4 className="text-xs font-black text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
                       <ShieldAlert size={14} /> Top Prioridades (IVE)
                     </h4>
                     <div className="space-y-2">
                        {topDiagnostico.map(item => (
                          <div key={item.id} className="flex justify-between items-center bg-slate-50 px-4 py-2 rounded-xl text-[10px]">
                             <span className="font-bold text-slate-600 truncate mr-2">{item.descricao}</span>
                             <span className="font-black text-rose-500 shrink-0">{item.iveScore}</span>
                          </div>
                        ))}
                        {topDiagnostico.length === 0 && (
                          <p className="text-[10px] text-slate-400 italic">Nenhuma prioridade identificada.</p>
                        )}
                     </div>
                  </div>
               </div>

               {/* Section: AI Summary */}
               <div className="bg-slate-900 rounded-[32px] p-10 text-white mb-12 relative overflow-hidden">
                  <div className="absolute right-0 top-0 p-8 text-secondary/10">
                     <TrendingUp size={120} strokeWidth={1} />
                  </div>
                  <div className="relative z-10 space-y-6">
                     <h4 className="text-sm font-black text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
                       <TrendingUp size={16} /> Resumo Executivo & Insights Consultivos
                     </h4>
                     {aiSummary ? (
                       <div className="prose prose-invert prose-xs text-slate-300 leading-relaxed font-medium">
                         {aiSummary.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                       </div>
                     ) : (
                       <p className="text-slate-500 text-xs italic py-10 text-center">Clique em "Gerar Resumo IA" para uma análise automática dos padrões financeiros.</p>
                     )}
                  </div>
               </div>

               {/* Section: Leitura por Princípios (Governança) */}
               {sacerdotalRules.length > 0 && (
                 <div className="mb-12">
                   <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                     <ShieldCheck size={16} className="text-indigo-500" /> Leitura por Fundamentos de Gestão
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {sacerdotalRules.slice(0, 2).map((rule, idx) => (
                       <GovernanceInsightPanel 
                         key={idx}
                         principleId={rule.principleId}
                         misalignment={rule.misalignment}
                         impact={rule.impact}
                         recommendation={rule.recommendation}
                       />
                     ))}
                   </div>
                 </div>
               )}

               {/* Section: KPIs & OKRs */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                       <BarChart3 size={16} className="text-primary" /> Cockpit de Indicadores Estratégicos
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                       {[
                         { label: 'Margem Líquida', value: getIndicatorValue('Margem Líquida', kpis.margemLiquida), suf: '%' },
                         { label: 'EBITDA', value: getIndicatorValue('EBITDA', kpis.ebitda), isCur: true },
                         { label: 'Churn Rate', value: getIndicatorValue('Churn Rate', 0), suf: '%', color: 'text-rose-500' },
                         { label: 'Win Rate', value: getIndicatorValue('Win Rate', 0), suf: '%' },
                         { label: 'ROI Marketing', value: getIndicatorValue('ROI de Marketing', 0), suf: 'x' },
                         { label: 'OTIF', value: getIndicatorValue('OTIF', 0), suf: '%' },
                         { label: 'eNPS', value: getIndicatorValue('eNPS', 0) },
                         { label: 'Liq. Corrente', value: getIndicatorValue('Liquidez Corrente', kpis.liquidezCorrente), fix: 2 }
                       ].map(k => (
                         <div key={k.label} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                            <span className="text-[8px] font-bold text-slate-400 uppercase mb-1">{k.label}</span>
                            <span className={cn("text-sm font-black", k.color || "text-slate-800")}>
                              {(k as any).isCur ? formatCurrency(k.value as number) : (k.value as number)?.toFixed(k.fix || 1)}{(k as any).suf}
                            </span>
                         </div>
                       ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                       <CheckCircle2 size={16} className="text-secondary" /> Status do Roadmap de Execução
                    </h4>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-6">
                       <div className="flex justify-between items-end">
                          <div>
                             <p className="text-[24px] font-black text-slate-900 leading-none">{actionStats.completed}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Ações Concluídas</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[24px] font-black text-secondary leading-none">{actionStats.pending}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Em Execução</p>
                          </div>
                       </div>
                       <div className="h-2.5 bg-white rounded-full overflow-hidden border border-slate-100 p-0.5">
                          <div 
                            className="h-full bg-secondary rounded-full" 
                            style={{ width: `${(actionStats.completed / actionStats.total) * 100}%` }} 
                          />
                       </div>
                    </div>

                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <CheckCircle2 size={16} className="text-secondary" /> Principais OKRs
                    </h4>
                    <div className="space-y-4">
                       {topOkrs.map(okr => (
                         <div key={okr.id} className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                               <span>{okr.titulo}</span>
                               <span className="font-black">{okr.progressoGeral?.toFixed(0)}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full bg-secondary transition-all" style={{ width: `${okr.progressoGeral}%` }} />
                            </div>
                         </div>
                       ))}
                       {topOkrs.length === 0 && (
                          <p className="text-[10px] text-slate-400 italic text-center py-4">Nenhum OKR ativo encontrado.</p>
                       )}
                    </div>
                  </div>
               </div>

               {/* Consultant Notes Section in PDF */}
               {consultantNotes && (
                 <div className="pt-10 border-t border-slate-100">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Notas Estratégicas</h4>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed whitespace-pre-wrap">{consultantNotes}</p>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
