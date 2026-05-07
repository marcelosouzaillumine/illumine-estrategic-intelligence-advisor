
import React, { useState, useRef, useMemo } from 'react';
import { 
  FileDown, 
  Printer, 
  Layout, 
  FileText, 
  Target, 
  TrendingUp, 
  ShieldAlert,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  MessageSquarePlus,
  Share2,
  BarChart3
} from 'lucide-react';
import { motion } from 'motion/react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useModuleData } from '../../hooks/useModuleData';
import { useAllFinancialData } from '../../hooks/useFinancialData';
import { useRealIndicatorData } from '../../hooks/useRealIndicatorData';
import { Diretriz, DiagnosticoItem, ObjetivoOKR } from '../../types/modules';
import { generateAdvisoryParecer } from '../../services/advisoryAiService';
import { formatCurrency, cn } from '../../lib/utils';

interface RelatorioExecutivoPageProps {
  clientId: string;
  selectedYear: number;
  selectedMonth: number;
}

export function RelatorioExecutivoPage({ clientId, selectedYear, selectedMonth }: RelatorioExecutivoPageProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [consultantNotes, setConsultantNotes] = useState('');

  // Data Fetching
  const { data: diretrizes } = useModuleData<Diretriz>('diretrizes', clientId);
  const { data: diagnostico } = useModuleData<DiagnosticoItem>('diagnostico', clientId);
  const { data: okrs } = useModuleData<ObjetivoOKR>('okrs', clientId);
  const { dbData } = useAllFinancialData(clientId);
  const { kpis } = useRealIndicatorData(clientId, selectedMonth, selectedYear);

  const mvv = diretrizes[0];
  const topDiagnostico = useMemo(() => [...diagnostico].sort((a, b) => b.fivScore - a.fivScore).slice(0, 3), [diagnostico]);
  const topOkrs = useMemo(() => [...okrs].sort((a, b) => b.progressoGeral - a.progressoGeral).slice(0, 3), [okrs]);

  const generateReportSummary = async () => {
    setIsAiLoading(true);
    try {
      const summary = await generateAdvisoryParecer({
        clientName: "Cliente", // Hardcoded for now
        industry: "Serviços",
        month: selectedMonth.toString(),
        year: selectedYear,
        metrics: kpis,
        patterns: [] // Should get patterns from a logic helper
      });
      setAiSummary(summary);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Relatorio_Executivo_${clientId}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
    } finally {
      setIsGenerating(true);
      setTimeout(() => setIsGenerating(false), 500);
    }
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="flex justify-between items-center bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm sticky top-4 z-30">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Gerador de Relatórios</h2>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em]">Exportação Executiva em PDF</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={generateReportSummary}
            disabled={isAiLoading}
            className="flex items-center gap-2 px-6 py-3 bg-secondary/10 text-secondary rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-secondary/20 transition-all border border-secondary/20 disabled:opacity-50"
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
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Documento Confidencial</p>
                  </div>
               </div>

               {/* Section: MVV */}
               <div className="grid grid-cols-2 gap-8 mb-12">
                  <div className="space-y-4">
                     <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                       <Target size={14} /> Missão & Visão
                     </h4>
                     <p className="text-[10px] font-bold text-slate-500 italic border-l-2 border-slate-100 pl-4">
                        {mvv?.missao || 'Missão não definida.'}
                     </p>
                     <p className="text-[10px] font-bold text-slate-500 italic border-l-2 border-slate-100 pl-4">
                        {mvv?.visao || 'Visão não definida.'}
                     </p>
                  </div>
                  <div className="space-y-4">
                     <h4 className="text-xs font-black text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
                       <ShieldAlert size={14} /> Top Prioridades (FIV)
                     </h4>
                     <div className="space-y-2">
                        {topDiagnostico.map(item => (
                          <div key={item.id} className="flex justify-between items-center bg-slate-50 px-4 py-2 rounded-xl text-[10px]">
                             <span className="font-bold text-slate-600 truncate mr-2">{item.descricao}</span>
                             <span className="font-black text-rose-500 shrink-0">{item.fivScore}</span>
                          </div>
                        ))}
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

               {/* Section: KPIs & OKRs */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                       <BarChart3 size={16} className="text-primary" /> KPIs Críticos do Período
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                       {[
                         { label: 'Margem Líquida', value: kpis.margemLiquida, suf: '%' },
                         { label: 'EBITDA', value: kpis.ebitda, isCur: true },
                         { label: 'Retorno Ativo', value: kpis.roa, suf: '%' },
                         { label: 'Liq. Corrente', value: kpis.liquidezCorrente, fix: 2 }
                       ].map(k => (
                         <div key={k.label} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                            <span className="text-[8px] font-bold text-slate-400 uppercase mb-1">{k.label}</span>
                            <span className="text-sm font-black text-slate-800">
                              {(k as any).isCur ? formatCurrency(k.value as number) : (k.value as number)?.toFixed(k.fix || 1)}{(k as any).suf}
                            </span>
                         </div>
                       ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                       <CheckCircle2 size={16} className="text-secondary" /> Progresso OKRs Estatégicos
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
                    </div>
                  </div>
               </div>

               {/* Section: Consultant Recommendations */}
               {consultantNotes && (
                 <div className="border-2 border-primary/20 bg-primary/5 rounded-[32px] p-8 mb-12">
                    <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Recomendações do Account Executive</h4>
                    <div className="text-xs font-bold text-slate-600 italic whitespace-pre-wrap leading-relaxed">
                       {consultantNotes}
                    </div>
                 </div>
               )}

               {/* Footer */}
               <div className="mt-20 pt-8 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <div>© {new Date().getFullYear()} Illumine Advisory - Todos os direitos reservados.</div>
                  <div className="italic">Genuinamente estratégico.</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
