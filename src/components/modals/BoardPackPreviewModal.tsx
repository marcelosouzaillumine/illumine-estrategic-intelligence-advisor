// src/components/modals/BoardPackPreviewModal.tsx

import React, { useState } from 'react';
import { X, Download, Share2, ShieldCheck, Activity, Target, Workflow, AlertCircle, Compass, HelpCircle, FileDown } from 'lucide-react';
import { FiduciaryRuntimeAdapter, BoardPack, BoardPackSlide, ESGIMScenario, ESGIMMode } from '../../services/FiduciaryRuntimeAdapter';

interface BoardPackPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  mode: ESGIMMode;
  scenario: ESGIMScenario;
  companyName: string;
}

export function BoardPackPreviewModal({
  isOpen,
  onClose,
  clientId,
  mode,
  scenario,
  companyName
}: BoardPackPreviewModalProps) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate board pack model dynamically based on cockpit state
  const pack: BoardPack = FiduciaryRuntimeAdapter.boardPackGeneratorEngine.generateBoardPack(
    clientId,
    mode,
    scenario,
    companyName
  );

  const activeSlide = pack.slides[activeSlideIndex];

  const handleDownloadPPTX = async () => {
    try {
      await FiduciaryRuntimeAdapter.BoardPackPPTXGenerator.generatePPTX(pack, true);
    } catch (err) {
      console.error('Erro ao exportar PPTX:', err);
    }
  };

  const handleDownloadPDF = () => {
    try {
      const doc = FiduciaryRuntimeAdapter.BoardPackPDFGenerator.generatePDF(pack);
      const filename = `Board_Pack_Apresentacao_${pack.title.replace(/\s+/g, '_')}_${pack.scenario}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error('Erro ao exportar PDF do Board Pack:', err);
    }
  };

  const handleShare = () => {
    const stubUrl = `https://illumine.advisory.net/share/board-pack/stub-${pack.packId}`;
    navigator.clipboard.writeText(stubUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Readiness level labeling
  const getReadinessLevel = (score: number) => {
    if (score >= 85) return { text: 'ALTA CONFIANÇA', color: 'text-emerald-400 border-emerald-500/20 bg-success-soft0/10' };
    if (score >= 70) return { text: 'MODERADA CONFIANÇA', color: 'text-blue-400 border-blue-500/20 bg-blue-500/10' };
    if (score >= 50) return { text: 'MÉDIA CONFIANÇA', color: 'text-amber-400 border-amber-500/20 bg-warning-soft0/10' };
    return { text: 'BAIXA CONFIANÇA', color: 'text-rose-400 border-rose-500/20 bg-critical-soft0/10' };
  };

  const readiness = getReadinessLevel(pack.decisionReadinessScore);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#03080F]/80 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="bg-[#060D17] border border-white/10 w-full max-w-5xl max-h-[92vh] rounded-2xl shadow-2xl relative z-10 flex flex-col overflow-hidden text-white">
        
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FF8552]/10 border border-[#FF8552]/20 text-[#FF8552] rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-black block">Board Communication Layer</span>
              <h2 className="text-base font-display font-medium text-muted-foreground">Board Pack Presenter (BPG™ v1.0)</h2>
            </div>
          </div>

          {/* Decision Readiness Score Badge */}
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider ${readiness.color}`}>
              Readiness: {pack.decisionReadinessScore}/100 - {readiness.text}
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white/5 rounded-full transition-all text-muted-foreground hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Area - Presentation layout (16:9 Preview on Left, Selector on Right) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-950/20">
          
          {/* 16:9 Presentation Slide Preview Container */}
          <div className="flex-1 p-6 md:p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5 overflow-y-auto">
            
            {/* Widescreen mock slide */}
            <div className={`aspect-[16/9] w-full max-w-[720px] rounded-xl border border-white/10 shadow-2xl relative flex flex-col p-8 select-none transition-all duration-300 ${activeSlide.slideNumber === 1 || activeSlide.slideNumber === 12 ? 'bg-[#0E1C2C] text-white' : 'bg-white text-muted-foreground'}`}>
              
              {/* Slide Header */}
              {activeSlide.slideNumber !== 1 && (
                <div className="flex justify-between items-start border-b border-border pb-2">
                  <div>
                    <h3 className={`text-base font-black tracking-tight ${activeSlide.slideNumber === 12 ? 'text-[#BAB86C]' : 'text-[#0E1C2C]'}`}>
                      {activeSlide.title}
                    </h3>
                    <p className={`text-[8px] italic font-semibold mt-0.5 ${activeSlide.slideNumber === 12 ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                      Objetivo: {activeSlide.objective}
                    </p>
                  </div>
                  
                  {activeSlide.slideNumber !== 12 && (
                    <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                      activeSlide.meetingCriticality === 'CRITICAL' ? 'bg-critical-soft border-rose-200 text-rose-600' :
                      activeSlide.meetingCriticality === 'HIGH' ? 'bg-warning-soft border-amber-200 text-amber-600' :
                      activeSlide.meetingCriticality === 'MODERATE' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                      'bg-slate-50 border-border text-muted-foreground'
                    }`}>
                      {activeSlide.meetingCriticality}
                    </span>
                  )}
                </div>
              )}

              {/* Slide Content Visual Layouts */}
              <div className="flex-1 mt-6 flex flex-col justify-start overflow-y-auto">
                {activeSlide.slideNumber === 1 ? (
                  // Cover Slide Custom Styling
                  <div className="h-full flex flex-col justify-between py-2">
                    <div className="w-8 h-8 bg-[#BAB86C] rounded-md flex-shrink-0" />
                    <div>
                      <h1 className="text-2xl font-black tracking-tight text-white mb-2 text-primary">{activeSlide.title}</h1>
                      <p className="text-xs italic text-[#BAB86C] font-light">"{pack.executiveHeadline}"</p>
                    </div>
                    
                    <div className="flex justify-between items-end border-t border-white/10 pt-4">
                      {/* Cognitive Badge */}
                      <div className="p-2 border border-[#BAB86C]/30 bg-white/5 rounded-md">
                        <span className="text-[7px] font-bold text-[#BAB86C] block uppercase tracking-widest">COGNITIVE CERTIFICATION</span>
                        <span className="text-[8px] font-black text-white block">LEVEL 5 - COGNITIVELY CERTIFIED</span>
                      </div>
                      
                      <div className="text-[8px] font-mono text-muted-foreground text-right">
                        <div>Cenário: {pack.scenario}</div>
                        <div>Readiness Score: {pack.decisionReadinessScore}/100</div>
                      </div>
                    </div>
                  </div>
                ) : activeSlide.visualType === 'SCORECARD' ? (
                  // Scorecard Grid view
                  <div className="grid grid-cols-2 gap-3">
                    {activeSlide.content.map((bullet, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 border border-border rounded-lg flex items-center gap-2">
                        <span className="w-1 h-8 bg-[#BAB86C] rounded flex-shrink-0" />
                        <p className="text-[10px] text-muted-foreground leading-snug font-semibold">{bullet}</p>
                      </div>
                    ))}
                  </div>
                ) : activeSlide.visualType === 'RISK_MATRIX' ? (
                  // Risk Grid list view
                  <div className="space-y-2">
                    {activeSlide.content.map((bullet, idx) => {
                      const isCritical = bullet.includes('[CRITICAL]') || bullet.includes('[Curto Prazo]') || bullet.includes('Violação') || bullet.includes('Caixa');
                      return (
                        <div key={idx} className="p-2 bg-slate-50 border border-border rounded-lg flex items-center gap-2">
                          <span className={`w-1 h-6 rounded flex-shrink-0 ${isCritical ? 'bg-[#FF8552]' : 'bg-[#BAB86C]'}`} />
                          <p className="text-[9px] text-[#0E1C2C] font-medium leading-normal">{bullet}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : activeSlide.visualType === 'DECISION' ? (
                  // Decisions Double Card grid
                  <div className="space-y-2.5">
                    {activeSlide.content.map((bullet, idx) => {
                      const parts = bullet.split(' - ');
                      return (
                        <div key={idx} className="p-2.5 bg-slate-50 border border-border rounded-lg flex items-start gap-2">
                          <span className="w-1 h-10 bg-[#FF8552] rounded flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10px] font-black text-[#0E1C2C]">{parts[0]}</p>
                            <p className="text-[9px] text-muted-foreground leading-normal mt-0.5">{parts[1]}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Standard Bullets view
                  <ul className={`space-y-2.5 text-[10px] ${activeSlide.slideNumber === 12 ? 'font-mono text-muted-foreground' : 'text-muted-foreground'}`}>
                    {activeSlide.content.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${activeSlide.slideNumber === 12 ? 'bg-[#BAB86C]' : 'bg-[#0E1C2C]'}`} />
                        <span className="leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Slide Footer */}
              {activeSlide.slideNumber !== 1 && (
                <div className="border-t border-border mt-4 pt-2.5 flex justify-between items-center text-[7px] text-muted-foreground">
                  <span>Illumine Governance™ | ESGIM™ | IRI™ | BPE™ | GRE™ | GML™ | EBRG™</span>
                  <span>Cenário: {pack.scenario}  |  Modo: {pack.timelineMode}</span>
                </div>
              )}

            </div>

          </div>

          {/* Slide Deck Selector Panel (Right Sidebar) */}
          <div className="w-full lg:w-72 bg-slate-950/40 p-5 flex flex-col max-h-[40vh] lg:max-h-none overflow-y-auto">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-4">Estrutura de Slides (12 Slides)</h3>
            <div className="space-y-1.5 flex-1 pr-1">
              {pack.slides.map((slide, idx) => {
                const isActive = activeSlideIndex === idx;
                const isAnnex = slide.slideNumber === 12;

                return (
                  <button
                    key={idx}
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center gap-2.5 border ${
                      isActive 
                        ? 'bg-[#FF8552]/10 border-[#FF8552]/40 text-[#FF8552] font-bold shadow-md' 
                        : isAnnex 
                        ? 'bg-slate-950/40 border-white/5 hover:border-[#BAB86C]/30 text-muted-foreground hover:text-[#BAB86C]' 
                        : 'bg-slate-950/40 border-white/5 hover:border-white/10 text-muted-foreground hover:text-white'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${
                      isActive ? 'bg-[#FF8552] text-white' : isAnnex ? 'bg-[#BAB86C]/20 text-[#BAB86C]' : 'bg-white/5 text-muted-foreground'
                    }`}>
                      {isAnnex ? 'A' : slide.slideNumber}
                    </span>
                    <div className="truncate">
                      <div className="truncate">{isAnnex ? 'Anexo: Traceability' : slide.title.replace(/^\d+\.\s*/, '')}</div>
                      <div className="text-[8px] text-muted-foreground font-mono truncate">{slide.visualType}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Actions Panel */}
        <div className="p-5 border-t border-white/5 bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Share Stub Link button */}
          <button 
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 border border-white/5 hover:border-white/10 text-muted-foreground hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
          >
            <Share2 size={14} />
            {copied ? (
              <span className="text-emerald-400">Link seguro copiado!</span>
            ) : (
              <span>Copiar link de compartilhamento seguro (stub / placeholder)</span>
            )}
          </button>

          {/* Export and Close actions */}
          <div className="flex items-center justify-end gap-3 flex-wrap">
            <button 
              onClick={onClose} 
              className="px-5 py-2.5 bg-slate-950 border border-white/5 hover:bg-slate-900 rounded-xl text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-muted-foreground transition-all"
            >
              Fechar
            </button>
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-muted-foreground transition-all"
            >
              <FileDown size={14} />
              Exportar PDF
            </button>
            <button 
              onClick={handleDownloadPPTX}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#FF8552] hover:bg-[#FF8552]/90 rounded-xl text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all"
            >
              <Download size={14} />
              Exportar PPTX (Principal)
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
