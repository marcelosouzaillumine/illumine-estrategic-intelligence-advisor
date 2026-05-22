import React, { useState, useRef } from 'react';
import { X, Loader2, Download, Bot } from 'lucide-react';
import { Button } from '../ui/button';
import { generateBoardReportFull, BoardReportData } from '../../services/aiBoardReportService';
import { FinancialEntry } from '../../hooks/useHistoricalDemonstracoes';
import { BoardReportPDF } from '../pdf/BoardReportPDF';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'motion/react';

interface GenerateBoardReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  companyName: string;
  financialData: FinancialEntry[];
}

export function GenerateBoardReportModal({
  isOpen,
  onClose,
  companyName,
  financialData
}: GenerateBoardReportModalProps) {
  const [status, setStatus] = useState<'idle' | 'generating_ai' | 'ready' | 'rendering_pdf' | 'error'>('idle');
  const [progressMsg, setProgressMsg] = useState('');
  const [reportData, setReportData] = useState<BoardReportData | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleGenerateAI = async () => {
    try {
      setStatus('generating_ai');
      const data = await generateBoardReportFull(companyName, financialData, (msg) => {
        setProgressMsg(msg);
      });
      setReportData(data);
      setStatus('ready');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setProgressMsg(err.message || 'Erro ao gerar o relatório com IA.');
    }
  };

  const handleDownloadPDF = async () => {
    if (!reportData || !pdfRef.current) return;
    setStatus('rendering_pdf');
    setProgressMsg('Renderizando PDF de alta resolução...');
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      // Wait for React to mount the component fully
      await new Promise(res => setTimeout(res, 500));
      
      const pages = pdfRef.current.querySelectorAll('.pdf-page');
      
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i] as HTMLElement, {
          scale: 2, // High res
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/png');
        if (i > 0) pdf.addPage();
        
        // A4 proportions exactly
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
        setProgressMsg(`Processando página ${i + 1} de ${pages.length}...`);
      }
      
      pdf.save(`Board_Advisory_Report_${companyName.replace(/\\s+/g, '_')}.pdf`);
      setStatus('ready');
    } catch (error) {
      console.error('Error generating PDF:', error);
      setStatus('error');
      setProgressMsg('Erro ao compilar o PDF.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-card w-full max-w-lg rounded-xl border border-border shadow-2xl relative z-10 overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-surface-container/30">
          <div>
            <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">Board Advisory Report</h2>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1">
              Geração Assistida por IA
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full transition-colors text-muted-foreground">
            <X size={18} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {status === 'idle' && (
            <div className="text-center space-y-6">
               <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  <Bot size={32} />
               </div>
               <div>
                  <h3 className="text-sm font-medium text-foreground">Motor de Inteligência Ativo</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                     Esta operação utilizará o histórico financeiro de 6 anos para gerar um parecer executivo de alto nível, incluindo diagnósticos patrimoniais, resiliência e simulações estruturais.
                  </p>
               </div>
               <Button onClick={handleGenerateAI} className="w-full bg-[#0E1C2C] text-[#BAB86C] hover:bg-[#0E1C2C]/90 font-bold uppercase tracking-widest">
                 Iniciar Geração IA
               </Button>
            </div>
          )}

          {(status === 'generating_ai' || status === 'rendering_pdf') && (
             <div className="text-center space-y-6 py-6">
                <Loader2 size={40} className="animate-spin text-secondary mx-auto" />
                <div className="space-y-2">
                   <h3 className="text-sm font-medium text-foreground">
                     {status === 'generating_ai' ? 'Processamento IA' : 'Montagem do Documento'}
                   </h3>
                   <p className="text-xs font-bold text-primary animate-pulse">{progressMsg}</p>
                </div>
             </div>
          )}

          {status === 'error' && (
             <div className="text-center space-y-6">
                <div className="text-destructive font-bold text-sm">Ocorreu um Erro</div>
                <p className="text-xs text-muted-foreground">{progressMsg}</p>
                <Button onClick={() => setStatus('idle')} variant="outline">Tentar Novamente</Button>
             </div>
          )}

          {status === 'ready' && reportData && (
            <div className="text-center space-y-6">
               <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
                  <Download size={32} />
               </div>
               <div>
                  <h3 className="text-sm font-medium text-foreground">Relatório Pronto</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                     A inteligência corporativa concluiu a análise. O relatório de 14 sessões está pronto para ser baixado.
                  </p>
               </div>
               <Button onClick={handleDownloadPDF} className="w-full bg-[#FF8552] text-white hover:bg-[#FF8552]/90 font-bold uppercase tracking-widest">
                 Baixar PDF Premium
               </Button>
            </div>
          )}
        </div>
      </div>

      {/* Hidden PDF Render Container */}
      <div className="fixed top-[2000px] left-0 opacity-0 pointer-events-none z-[-10]">
        {reportData && (
          <BoardReportPDF 
             ref={pdfRef} 
             data={reportData} 
             companyName={companyName} 
             reportDate={new Date().toLocaleDateString('pt-BR')} 
          />
        )}
      </div>
    </div>
  );
}
