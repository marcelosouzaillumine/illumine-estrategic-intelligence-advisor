
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
import { formatCurrency, cn, formatValue } from '../../lib/utils';
import { useModuleData } from '../../hooks/useModuleData';
import { useRealIndicatorData } from '../../hooks/useRealIndicatorData';
import { useAllFinancialData } from '../../hooks/useFinancialData';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { evaluateFinancialRules } from '../../lib/governanceIntelligence';
import { GovernanceInsightPanel } from '../GovernanceInsightPanel';
import { PageHeader, StatusBadge, KpiCard } from '../Common';
import { ObjetivoOKR as OKR, DiagnosticoItem as Diagnostico, Diretriz as Diretrizes } from '../../types/modules';
import { Button } from '../ui/button';
import { RelatorioDemonstracoes5Anos } from './RelatorioDemonstracoes5Anos';

interface ActionItem {
  id?: string;
  status: 'Pendente' | 'Em curso' | 'Concluído' | 'Impedido';
}

interface RelatorioExecutivoPageProps {
  clientId: string;
  selectedMonth: number;
  selectedYear: number;
}



export function RelatorioExecutivoPage({ clientId, selectedMonth, selectedYear }: RelatorioExecutivoPageProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [consultantNotes, setConsultantNotes] = useState('');

  const { data: okrs } = useModuleData<OKR>('okrs', clientId);
  const { data: diagnostico } = useModuleData<Diagnostico>('diagnostico', clientId);
  const { data: diretrizes } = useModuleData<Diretrizes>('diretrizes', clientId);
  const { data: actions } = useModuleData<ActionItem>('action_items', clientId);
  const { kpis } = useRealIndicatorData(clientId, selectedMonth, selectedYear);

  type ReportType = 'full' | 'governance' | 'financial' | 'operational' | 'demonstracoes-5-anos';
  const [reportType, setReportType] = useState<ReportType>('full');

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
    if (!actions || actions.length === 0) return { total: 0, completed: 0, pending: 0 };
    return {
      total: actions.length,
      completed: actions.filter(a => a.status === 'Concluído').length,
      pending: actions.filter(a => a.status === 'Pendente' || a.status === 'Em curso').length
    };
  }, [actions]);

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

  const hasData = dbIndicators.length > 0 || okrs.length > 0 || actions.length > 0;

  return (
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title="Relatório Executivo Estratégico"
        subtitle="Consolidação mensal de performance, governança e roadmap tático."
        icon={ShieldCheck}
        color="executive"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <select 
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportType)}
            className="bg-card border border-border rounded-md px-4 md:px-6 py-2 md:py-2.5 text-[10px] font-medium uppercase tracking-widest text-foreground outline-none cursor-pointer hover:border-secondary transition-all"
          >
            <option value="full">Executivo Full AI</option>
            <option value="governance">Eixo Governança</option>
            <option value="financial">Eixo Financeiro</option>
            <option value="operational">Eixo Operacional</option>
            <option value="demonstracoes-5-anos">Demonstrações Contábeis (5 Anos)</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={generateReportSummary}
            disabled={isAiLoading}
            variant="outline"
            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 font-medium uppercase tracking-widest text-[10px]"
          >
            {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <TrendingUp size={14} />} 
            {aiSummary ? 'Regerar Resumo' : 'Gerar com IA'}
          </Button>
          <Button
            onClick={downloadPDF}
            disabled={isGenerating}
            className="bg-secondary text-primary hover:bg-white hover:text-primary px-4 md:px-6 py-2 md:py-2.5 font-bold uppercase tracking-widest text-[10px] shadow-xl"
          >
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />} PDF
          </Button>
        </div>
      </div>

      {reportType === 'demonstracoes-5-anos' ? (
        <RelatorioDemonstracoes5Anos clientId={clientId} selectedYear={selectedYear} />
      ) : hasData === false && !isAiLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-10 animate-executive-fade py-12">
           <div className="relative">
              <div className="absolute inset-0 bg-primary blur-3xl opacity-10 animate-pulse" />
              <div className="w-40 h-40 rounded-md bg-executive flex items-center justify-center text-secondary shadow-premium relative z-10 border border-white/5 mx-auto">
                <ShieldCheck size={80} strokeWidth={1} />
              </div>
           </div>
           
           <div className="text-center space-y-4 w-full max-w-2xl mx-auto px-6">
              <h2 className="text-h1 font-medium text-foreground tracking-tight leading-tight">Relatório Executivo Silencioso</h2>
              <p className="text-muted-foreground w-full max-w-2xl mx-auto font-medium leading-relaxed italic">
                Não identificamos dados estratégicos, indicadores ou planos de ação para o período de <strong>{['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][(selectedMonth || 1) - 1]} de {selectedYear}</strong>. 
                Importe os dados ou defina OKRs para gerar o relatório.
              </p>
           </div>
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="lg:col-span-1 space-y-6">
            <div className="card-premium p-8 space-y-6">
               <h4 className="text-[10px] font-medium text-foreground uppercase tracking-widest flex items-center gap-2">
                 <MessageSquarePlus size={16} className="text-primary" /> Notas do Consultor
               </h4>
               <textarea 
                 value={consultantNotes}
                 onChange={e => setConsultantNotes(e.target.value)}
                 className="w-full h-64 p-4 bg-surface-container border border-border rounded-md text-xs font-medium outline-none focus:border-secondary transition-all resize-none italic"
                 placeholder="Adicione suas observações personalizadas aqui..."
               />
               <p className="text-[10px] text-muted-foreground font-medium italic uppercase tracking-widest">
                 Dica: Use estas notas para destacar pontos específicos da reunião mensal.
               </p>
            </div>
         </div>

         <div className="lg:col-span-3">
            {/* PDF PREVIEW CONTAINER */}
            <div 
              ref={reportRef}
              className="bg-card shadow-premium rounded-md border border-border p-16 max-w-[800px] mx-auto overflow-hidden font-sans text-foreground"
            >
               {/* Cover/Header */}
               <div className="border-b-4 border-secondary pb-10 mb-12 flex justify-between items-end">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center text-white">
                           <Layout size={24} />
                        </div>
                        <h1 className="text-4xl font-medium tracking-tighter text-foreground uppercase">Relatório Executivo</h1>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-medium text-secondary tracking-widest uppercase">Illumine Strategic Advisory</p>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Referência: {selectedMonth}/{selectedYear}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="bg-executive text-white px-4 py-2 rounded-md inline-block mb-2">
                        <span className="text-[10px] font-medium uppercase tracking-widest">Confidencial</span>
                     </div>
                  </div>
               </div>

               {/* Strategic Core */}
               {(reportType === 'full' || reportType === 'governance') && (
                 <div className="grid grid-cols-2 gap-12 mb-12 border-b border-border pb-12">
                    <div className="bg-executive p-10 rounded-md text-white shadow-premium">
                       <p className="text-secondary text-[8px] font-medium uppercase tracking-widest mb-1">Propósito</p>
                       <p className="text-white text-[11px] font-medium leading-relaxed italic">"{mvv?.proposito || 'Propósito não definido'}"</p>
                       <div className="mt-8 flex gap-4">
                          <div>
                             <p className="text-secondary/60 text-[8px] font-medium uppercase tracking-widest mb-1">Missão</p>
                             <p className="text-[9px] font-medium opacity-80 leading-relaxed italic break-words overflow-visible">{mvv?.missao || 'Não definida'}</p>
                          </div>
                          <div>
                             <p className="text-secondary/60 text-[8px] font-medium uppercase tracking-widest mb-1">Visão</p>
                             <p className="text-[9px] font-medium opacity-80 leading-relaxed italic break-words overflow-visible">{mvv?.visao || 'Não definida'}</p>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-medium text-secondary uppercase tracking-widest flex items-center gap-2">
                         <ShieldAlert size={14} /> Top Prioridades (IVE)
                       </h4>
                       <div className="space-y-2">
                          {topDiagnostico.map(item => (
                            <div key={item.id} className="flex justify-between items-center bg-surface-container px-4 py-2 rounded-md text-[10px] border border-border">
                               <span className="font-medium text-muted-foreground break-words overflow-visible mr-2 italic leading-normal">{item.descricao}</span>
                               <span className="font-medium text-destructive shrink-0">{item.iveScore}</span>
                            </div>
                          ))}
                          {topDiagnostico.length === 0 && (
                            <p className="text-[10px] text-muted-foreground italic uppercase tracking-widest">Nenhuma prioridade identificada.</p>
                          )}
                       </div>
                    </div>
                 </div>
               )}

               {/* Section: AI Summary */}
               <div className="bg-executive rounded-md p-10 text-white mb-12 relative overflow-hidden border border-white/10">
                  <div className="absolute right-0 top-0 p-8 text-secondary/10">
                     <TrendingUp size={120} strokeWidth={1} />
                  </div>
                  <div className="relative z-10 space-y-6">
                     <h4 className="text-[10px] font-medium text-secondary uppercase tracking-widest flex items-center gap-2">
                       <TrendingUp size={16} /> Resumo Executivo & Insights Consultivos
                     </h4>
                     {aiSummary ? (
                       <div className="text-xs text-white/80 leading-relaxed font-medium italic">
                         {aiSummary.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                       </div>
                     ) : (
                       <p className="text-white/20 text-[10px] font-medium uppercase tracking-widest py-10 text-center">Clique em "Gerar Resumo IA" para uma análise automática dos padrões financeiros.</p>
                     )}
                  </div>
               </div>

               {/* Section: Leitura por Princípios (Governança) */}
               {sacerdotalRules.length > 0 && (reportType === 'full' || reportType === 'governance') && (
                 <div className="mb-12">
                   <h4 className="text-[10px] font-medium text-foreground uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-border pb-4">
                     <ShieldCheck size={16} className="text-secondary" /> Leitura por Fundamentos de Gestão
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
                  {(reportType === 'full' || reportType === 'financial') && (
                    <div>
                      <h4 className="text-[10px] font-medium text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                         <BarChart3 size={16} className="text-primary" /> Cockpit de Indicadores Estratégicos
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                         {[
                           { label: 'Margem Líquida', value: getIndicatorValue('Margem Líquida', kpis.margemLiquida), suf: '%' },
                           { label: 'EBITDA', value: getIndicatorValue('EBITDA', kpis.ebitda), isCur: true },
                           { label: 'Churn Rate', value: getIndicatorValue('Churn Rate', 0), suf: '%', color: 'text-destructive' },
                           { label: 'Win Rate', value: getIndicatorValue('Win Rate', 0), suf: '%' },
                           { label: 'ROI Marketing', value: getIndicatorValue('ROI de Marketing', 0), suf: 'x' },
                           { label: 'OTIF', value: getIndicatorValue('OTIF', 0), suf: '%' },
                           { label: 'eNPS', value: getIndicatorValue('eNPS', 0) },
                           { label: 'Liq. Corrente', value: getIndicatorValue('Liquidez Corrente', kpis.liquidezCorrente), fix: 2 }
                         ].map(k => (
                           <div key={k.label} className="bg-surface-container p-4 rounded-md border border-border flex flex-col items-center text-center">
                              <span className="text-[8px] font-medium text-muted-foreground uppercase mb-1 tracking-widest">{k.label}</span>
                              <span className={cn("text-sm font-medium tracking-tight", k.color || "text-foreground")}>
                                {(k as any).isCur ? formatCurrency(k.value as number) : (k.value as number)?.toFixed(k.fix || 1)}{(k as any).suf}
                              </span>
                           </div>
                         ))}
                      </div>
                    </div>
                  )}
                  
                  {(reportType === 'full' || reportType === 'operational') && (
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-medium text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                         <CheckCircle2 size={16} className="text-secondary" /> Status do Roadmap de Execução
                      </h4>
                      <div className="bg-surface-container p-6 rounded-md border border-border space-y-6">
                         <div className="flex justify-between items-end">
                            <div>
                               <p className="text-[24px] font-medium text-foreground tracking-tighter leading-none">{actionStats.completed}</p>
                               <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">Ações Concluídas</p>
                            </div>
                            <div className="text-right">
                               <p className="text-[24px] font-medium text-secondary tracking-tighter leading-none">{actionStats.pending}</p>
                               <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">Em Execução</p>
                            </div>
                         </div>
                         <div className="h-2.5 bg-card rounded-full overflow-hidden border border-border p-0.5">
                            <div 
                              className="h-full bg-secondary rounded-full shadow-premium" 
                              style={{ width: `${actionStats.total > 0 ? (actionStats.completed / actionStats.total) * 100 : 0}%` }} 
                            />
                         </div>
                      </div>

                      <h4 className="text-[10px] font-medium text-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                         <CheckCircle2 size={16} className="text-secondary" /> Principais OKRs
                      </h4>
                      <div className="space-y-4">
                         {topOkrs.map(okr => (
                           <div key={okr.id} className="space-y-1">
                              <div className="flex justify-between text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1">
                                 <span>{okr.titulo}</span>
                                 <span className="font-medium text-foreground">{okr.progressoGeral?.toFixed(0)}%</span>
                              </div>
                              <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                                 <div className="h-full bg-secondary transition-all shadow-premium" style={{ width: `${okr.progressoGeral}%` }} />
                              </div>
                           </div>
                         ))}
                         {topOkrs.length === 0 && (
                            <p className="text-[10px] text-muted-foreground italic text-center py-4 uppercase tracking-widest">Nenhum OKR ativo encontrado.</p>
                         )}
                      </div>
                    </div>
                  )}
               </div>

               {/* Consultant Notes Section in PDF */}
               {consultantNotes && (
                 <div className="pt-10 border-t border-border">
                    <h4 className="text-[10px] font-medium text-foreground uppercase tracking-widest mb-4">Notas Estratégicas</h4>
                    <p className="text-xs font-medium text-muted-foreground leading-relaxed whitespace-pre-wrap italic">"{consultantNotes}"</p>
                 </div>
               )}
            </div>
         </div>
      </div>
      )}
    </div>
  );
}
