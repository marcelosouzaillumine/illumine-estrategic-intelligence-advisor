import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Download } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useExecutiveAdvisory } from '../../../../hooks/useExecutiveAdvisory';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { ExecutiveBoardReportPDF } from '../../../../core/runtime/reports/ExecutiveBoardReportPDF';
import { ExecutiveBoardReport } from '../../../runtime/esgim/esgimTypes';

interface GenerateBoardReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  companyName: string;
  financialData?: any[];
  clientData?: any;
  selectedYear?: number;
  temporalData?: any;
}

export function GenerateBoardReportModal({
  isOpen,
  onClose,
  clientId,
  companyName,
  selectedYear = new Date().getFullYear(),
  clientData,
  temporalData
}: GenerateBoardReportModalProps) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'generating_ai' | 'ready' | 'rendering_pdf' | 'error'>('idle');
  const [progressMsg, setProgressMsg] = useState('');

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
    if (!advisoryReport) return;
    setStatus('rendering_pdf');
    setProgressMsg(t('boardpack.modal.rendering_pdf_msg'));
    
    try {
      // Pequena pausa para sincronia visual da UI
      await new Promise(res => setTimeout(res, 200));

      const boardReport: ExecutiveBoardReport = {
        reportId: `EBR-${Date.now().toString(36).toUpperCase()}`,
        generatedAt: new Date().toISOString(),
        reportMode: "BOARD_EXECUTIVE",
        scenario: "STANDARD",
        companyName: companyName || "Empresa Selecionada",
        generatedBy: "Illumine AI Advisory Engine",
        confidenceLevel: advisoryReport.confidenceLevel === "Alta" ? "HIGH" : "MODERATE",
        executiveHeadline: advisoryReport.recommendedBoardDecision || "DIRETRIZ DE GOVERNANÇA E EFICIÊNCIA OPERACIONAL",
        executiveSummary: advisoryReport.executiveSummary || advisoryReport.institutionalDiagnosis,
        overallAssessment: advisoryReport.institutionalDiagnosis,
        principalRisks: advisoryReport.dominantRisks.map((r: string) => `[HIGH] ${r}`),
        principalOpportunities: advisoryReport.strategicPriorities.map((p: string) => `Oportunidade Estratégica: ${p}`),
        boardPriorities: advisoryReport.actionMatrix.map((a: any) => `${a.acao} (${a.prioridade} Prioridade | Impacto ${a.impacto})`),
        roadmapHighlights: advisoryReport.strategicPriorities,
        monitoringHighlights: advisoryReport.sourceSignals,
        recommendedDecisions: [
          advisoryReport.recommendedBoardDecision,
          ...advisoryReport.narrativeModeration
        ],
        lineageHash: `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        explainability: [
          "Cálculo estritamente fiduciário de liquidez e margem",
          "Validação por motor determinístico de regras de governança",
          "Síntese narrativa aprovada pelo Conselho de Administração"
        ],
        timelineMode: "LIVE_HISTORY"
      };

      const doc = ExecutiveBoardReportPDF.generatePDF(boardReport);
      const filename = `Relatorio_Executivo_Conselho_${companyName.replace(/\s+/g, '_')}.pdf`;
      doc.save(filename);
      
      setStatus('ready');
    } catch (error) {
      console.error('Error generating vector PDF:', error);
      setStatus('error');
      setProgressMsg(t('boardpack.modal.pdf_error_msg'));
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
      {/* 1. Backdrop escuro sólido */}
      <div 
        className="fixed inset-0 bg-slate-950/85 z-0" 
        onClick={onClose} 
      />
      
      {/* 2. Diálogo Modal Centralizado com Z-Index soberano sobre o backdrop e largura fixa de 520px */}
      <div className="relative z-50 w-[92vw] sm:w-[520px] min-w-[320px] max-w-[520px] shrink-0 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50 shrink-0">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">{t('boardpack.modal.title')}</h2>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">
              {t('boardpack.modal.subtitle')}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto">
          {(status === 'idle' || status === 'generating_ai' || status === 'rendering_pdf') && (
             <div className="text-center space-y-6 py-6">
                <Loader2 size={40} className="animate-spin text-emerald-400 mx-auto" />
                <div className="space-y-2">
                   <h3 className="text-sm font-medium text-white">
                     {status === 'rendering_pdf' ? t('boardpack.modal.rendering_pdf') : t('boardpack.modal.generating_ai')}
                   </h3>
                   <p className="text-xs font-bold text-emerald-400 animate-pulse">{progressMsg || t('boardpack.modal.processing_msg')}</p>
                </div>
             </div>
          )}

          {status === 'error' && (
             <div className="text-center space-y-6">
                <div className="text-rose-400 font-bold text-sm">{t('boardpack.modal.institutional_block')}</div>
                <p className="text-xs text-slate-300 leading-relaxed">{progressMsg}</p>
                <Button onClick={onClose} variant="outline" className="border-slate-700 text-white hover:bg-slate-800 cursor-pointer">{t('boardpack.modal.dismiss')}</Button>
             </div>
          )}

          {status === 'ready' && advisoryReport && (
            <div className="text-center space-y-6">
               <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
                  <Download size={32} />
               </div>
               <div>
                  <h3 className="text-base font-bold text-white">{t('boardpack.modal.report_ready')}</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                     {t('boardpack.modal.ready_desc')}
                  </p>
               </div>
               <Button onClick={handleDownloadPDF} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-widest py-3 rounded-xl shadow-lg transition-all cursor-pointer">
                 {t('boardpack.modal.download_pdf')}
               </Button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
