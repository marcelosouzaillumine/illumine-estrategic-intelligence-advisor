import React, { useState, useRef, useEffect } from 'react';
import { X, Loader2, Download, Bot } from 'lucide-react';
import { Button } from '../ui/button';
import { useExecutiveAdvisory } from '../../hooks/useExecutiveAdvisory';
import { BoardReportPDF } from '../pdf/BoardReportPDF';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useLanguage } from '../../contexts/LanguageContext';

interface GenerateBoardReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  companyName: string;
  financialData: any[];
  clientData?: any;
  selectedYear: number;
  temporalData?: any;
}

export function GenerateBoardReportModal({
  isOpen,
  onClose,
  clientId,
  companyName,
  selectedYear,
  clientData,
  temporalData
}: GenerateBoardReportModalProps) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'generating_ai' | 'ready' | 'rendering_pdf' | 'error'>('idle');
  const [progressMsg, setProgressMsg] = useState('');
  const pdfRef = useRef<HTMLDivElement>(null);

  const { advisoryReport, loading: advisoryLoading } = useExecutiveAdvisory(clientId, selectedYear, 12, clientData);

  useEffect(() => {
    if (isOpen) {
      if (advisoryLoading) {
        setStatus('generating_ai');
        setProgressMsg(t('boardpack.modal.processing_msg'));
      } else if (advisoryReport) {
        setStatus('ready');
      } else {
        setStatus('error');
        setProgressMsg(t('boardpack.modal.error_msg'));
      }
    } else {
      setStatus('idle');
    }
  }, [isOpen, advisoryLoading, advisoryReport, t]);

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    if (!advisoryReport || !pdfRef.current) return;
    setStatus('rendering_pdf');
    setProgressMsg(t('boardpack.modal.rendering_pdf_msg'));
    
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
        setProgressMsg(
          t('boardpack.modal.processing_page_msg')
            .replace('{page}', String(i + 1))
            .replace('{total}', String(pages.length))
        );
      }
      
      pdf.save(`Board_Advisory_Report_${companyName.replace(/\s+/g, '_')}.pdf`);
      setStatus('ready');
    } catch (error) {
      console.error('Error generating PDF:', error);
      setStatus('error');
      setProgressMsg(t('boardpack.modal.pdf_error_msg'));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-card w-full max-w-lg rounded-xl border border-border shadow-2xl relative z-10 overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-surface-container/30">
          <div>
            <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">{t('boardpack.modal.title')}</h2>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1">
              {t('boardpack.modal.subtitle')}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full transition-colors text-muted-foreground">
            <X size={18} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {(status === 'generating_ai' || status === 'rendering_pdf') && (
             <div className="text-center space-y-6 py-6">
                <Loader2 size={40} className="animate-spin text-secondary mx-auto" />
                <div className="space-y-2">
                   <h3 className="text-sm font-medium text-foreground">
                     {status === 'generating_ai' ? t('boardpack.modal.generating_ai') : t('boardpack.modal.rendering_pdf')}
                   </h3>
                   <p className="text-xs font-bold text-primary animate-pulse">{progressMsg}</p>
                </div>
             </div>
          )}

          {status === 'error' && (
             <div className="text-center space-y-6">
                <div className="text-destructive font-bold text-sm">{t('boardpack.modal.institutional_block')}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{progressMsg}</p>
                <Button onClick={onClose} variant="outline">{t('boardpack.modal.dismiss')}</Button>
             </div>
          )}

          {status === 'ready' && advisoryReport && (
            <div className="text-center space-y-6">
               <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
                  <Download size={32} />
               </div>
               <div>
                  <h3 className="text-sm font-medium text-foreground">{t('boardpack.modal.report_ready')}</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                     {t('boardpack.modal.ready_desc')}
                  </p>
               </div>
               <Button onClick={handleDownloadPDF} className="w-full bg-[#FF8552] text-white hover:bg-[#FF8552]/90 font-bold uppercase tracking-widest">
                 {t('boardpack.modal.download_pdf')}
               </Button>
            </div>
          )}
        </div>
      </div>

      {/* Hidden PDF Render Container */}
      <div className="fixed top-[2000px] left-0 opacity-0 pointer-events-none z-[-10]">
        {advisoryReport && (
          <BoardReportPDF 
             ref={pdfRef} 
             data={advisoryReport} 
             companyName={companyName} 
             reportDate={new Date().toLocaleDateString('pt-BR')} 
             temporalData={temporalData}
             t={t}
          />
        )}
      </div>
    </div>
  );
}
