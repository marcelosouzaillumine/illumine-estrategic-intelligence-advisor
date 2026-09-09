// src/components/modals/ExecutiveBoardReportModal.tsx

import React, { useState } from 'react';
import { X, Download, Share2, ShieldCheck, Activity, Target, Workflow, AlertCircle, Compass } from 'lucide-react';
import { FiduciaryRuntimeAdapter, ESGIMScenario, ESGIMMode, ExecutiveBoardReport } from '../../services/FiduciaryRuntimeAdapter';
import { useExecutiveFormatter } from '../../core/localization';

interface ExecutiveBoardReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  mode: ESGIMMode;
  scenario: ESGIMScenario;
  companyName: string;
}

export function ExecutiveBoardReportModal({
  isOpen,
  onClose,
  clientId,
  mode,
  scenario,
  companyName
}: ExecutiveBoardReportModalProps) {
  const [copied, setCopied] = useState(false);
  const formatter = useExecutiveFormatter();

  if (!isOpen) return null;

  // Generate report dynamically based on current cockpit state
  const report: ExecutiveBoardReport = FiduciaryRuntimeAdapter.executiveBoardReportEngine.generateReport(
    clientId,
    mode,
    scenario,
    companyName
  );

  const handleDownloadPDF = () => {
    try {
      const doc = FiduciaryRuntimeAdapter.ExecutiveBoardReportPDF.generatePDF(report);
      const filename = `Relatorio_Executivo_Conselho_${report.companyName.replace(/\s+/g, '_')}_${report.scenario}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error('Erro ao exportar PDF:', err);
    }
  };

  const handleShare = () => {
    const stubUrl = `https://illumine.advisory.net/share/report/stub-${report.reportId}`;
    navigator.clipboard.writeText(stubUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[var(--color-background)]/80 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="bg-[var(--color-background)] border border-white/10 w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl relative z-10 flex flex-col overflow-hidden text-white">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)] rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-black block">Board Communication Governance</span>
              <h2 className="text-base font-display font-medium text-muted-foreground">Relatório Executivo do Conselho (EBRG™)</h2>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/5 rounded-full transition-all text-muted-foreground hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content - Preview Pane */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-slate-950/20">
          
          {/* Timeline & Metadata Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-950/40 border border-white/5 rounded-xl text-xs font-mono text-muted-foreground">
            <div className="space-y-1">
              <div><strong className="text-muted-foreground">Report ID:</strong> {report.reportId}</div>
              <div><strong className="text-muted-foreground">Gerado em:</strong> {formatter.date(report.generatedAt)}</div>
              <div><strong className="text-muted-foreground">Empresa:</strong> {report.companyName}</div>
            </div>
            <div className="space-y-1 md:text-right">
              <div><strong className="text-muted-foreground">Nível Confiança:</strong> <span className="text-emerald-400 font-bold">{report.confidenceLevel}</span></div>
              <div><strong className="text-muted-foreground">Cenário:</strong> <span className="text-[var(--color-accent)]">{report.scenario}</span></div>
              <div><strong className="text-muted-foreground">Modo Linha Temporal:</strong> <span className="text-primary">{report.timelineMode}</span></div>
            </div>
          </div>

          {/* Section 1: Headline & Executive Summary */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[var(--color-accent)]" />
              1. Resumo Executivo & Manchete
            </h4>
            <div className="p-5 bg-slate-950/40 border border-white/5 rounded-xl space-y-4">
              <h5 className="text-lg font-light leading-snug tracking-tight text-amber-300 italic">
                "{report.executiveHeadline}"
              </h5>
              <p className="text-xs text-muted-foreground leading-relaxed text-justify border-l-2 border-[var(--color-accent)]/30 pl-4">
                {report.executiveSummary}
              </p>
            </div>
          </div>

          {/* Section 2: Risks & Opportunities Register */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Risks */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                2. Register de Riscos e Exposições
              </h4>
              <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-2.5">
                {report.principalRisks.map((risk, i) => {
                  const isCritical = risk.includes('[CRITICAL]');
                  const isHigh = risk.includes('[HIGH]');
                  const badgeColor = isCritical ? 'text-rose-400' : isHigh ? 'text-amber-400' : 'text-muted-foreground';
                  
                  return (
                    <div key={i} className="text-xs flex items-start gap-2 leading-relaxed pb-2 border-b border-white/5 last:border-0 last:pb-0">
                      <span className={`${badgeColor} font-black font-mono`}>[{isCritical ? 'CRIT' : isHigh ? 'HIGH' : 'WARN'}]</span>
                      <span className="text-muted-foreground">{risk.replace(/\[.*?\]\s*/, '')}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Opportunities */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-400" />
                3. Oportunidades de Geração de Valor
              </h4>
              <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-2.5">
                {report.principalOpportunities.map((opp, i) => {
                  const isShort = opp.includes('[Curto Prazo]');
                  const isMedium = opp.includes('[Médio Prazo]');
                  const badgeColor = isShort ? 'text-emerald-400' : isMedium ? 'text-sky-400' : 'text-primary';

                  return (
                    <div key={i} className="text-xs flex items-start gap-2 leading-relaxed pb-2 border-b border-white/5 last:border-0 last:pb-0">
                      <span className={`${badgeColor} font-bold font-mono`}>[{isShort ? 'CURTO' : isMedium ? 'MÉDIO' : 'LONGO'}]</span>
                      <span className="text-muted-foreground">{opp.replace(/\[.*?\]\s*/, '')}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Section 3: Recommended Priorities & Roadmap */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Priorities */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-400" />
                4. Recomendações Prioritárias (BPE™)
              </h4>
              <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-3">
                {report.boardPriorities.map((priority, i) => (
                  <div key={i} className="text-xs text-muted-foreground flex items-start gap-2 pb-1.5 border-b border-white/5 last:border-0 last:pb-0">
                    <span className="text-amber-400 font-bold">#{i + 1}</span>
                    <span>{priority.replace(/#\d+\s+\[Score\s+\d+\]\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Roadmap */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Workflow className="w-4 h-4 text-primary" />
                5. Destaques do Roadmap (GRE™)
              </h4>
              <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-3">
                {report.roadmapHighlights.map((hl, i) => (
                  <div key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Section 4: Monitoring (GML) & Decision Support */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Monitoring */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-sky-400" />
                6. Destaques de Monitoramento (GML™)
              </h4>
              <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-2.5">
                {report.monitoringHighlights.map((hl, i) => (
                  <div key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-sky-400 font-bold">→</span>
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decisions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                7. Matriz de Decisões Recomendadas
              </h4>
              <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-3">
                {report.recommendedDecisions.map((dec, i) => {
                  const parts = dec.split(' | ');
                  const decTitle = parts[0]?.replace('Decisão: ', '') || '';
                  const horizon = parts[3]?.replace('Horizonte: ', '') || '';

                  return (
                    <div key={i} className="text-xs pb-2 border-b border-white/5 last:border-0 last:pb-0 space-y-1">
                      <div className="font-bold text-muted-foreground">{i + 1}. {decTitle}</div>
                      <div className="text-[10px] text-muted-foreground">{parts[1]?.replace('Justificativa: ', '')}</div>
                      <div className="text-[10px] text-emerald-400 font-medium">{parts[2]?.replace('Benefício: ', '')}</div>
                      <div className="text-[9px] text-[var(--color-state-healthy)] font-mono tracking-wider uppercase font-bold">{horizon}</div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Section 5: Explainability Appendix */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              8. Apêndice de Explicabilidade & Rastreabilidade (Conciso)
            </h4>
            <div className="p-5 bg-slate-950/40 border border-white/5 rounded-xl space-y-3 font-mono text-[10px]">
              <div className="space-y-1.5">
                {report.explainability.map((exp, i) => (
                  <div key={i} className="text-muted-foreground">• {exp}</div>
                ))}
              </div>
              <div className="border-t border-white/5 pt-2.5">
                <span className="text-muted-foreground uppercase text-[9px] font-bold block mb-1">Linhagem de Processamento (Lineage Hash)</span>
                <span className="text-primary break-all select-all">{report.lineageHash}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-white/5 bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Share Button (Stub) */}
          <button 
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 border border-white/5 hover:border-white/10 text-muted-foreground hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all relative overflow-visible"
          >
            <Share2 size={14} />
            {copied ? (
              <span className="text-emerald-400">Link seguro copiado!</span>
            ) : (
              <span>Copiar link de compartilhamento seguro (stub / placeholder)</span>
            )}
          </button>

          {/* Download and Close buttons */}
          <div className="flex items-center justify-end gap-3">
            <button 
              onClick={onClose} 
              className="px-5 py-2 bg-slate-950 border border-white/5 hover:bg-slate-900 rounded-xl text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-muted-foreground transition-all"
            >
              Fechar
            </button>
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-5 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 rounded-xl text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all"
            >
              <Download size={14} />
              Exportar PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
