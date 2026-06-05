import React, { ForwardedRef, forwardRef } from 'react';
import { formatCurrency } from '../../lib/utils';
import { ShieldCheck, Activity, Target, Zap, Layout } from 'lucide-react';
import { ExecutiveAdvisoryReport } from '../../lib/executive-advisory-engine';
import { TemporalBoardPackSection } from './TemporalBoardPackSection';
import { ExecutiveLabelResolver } from '../../services/FiduciaryRuntimeAdapter';
import { ExecutiveDisclosureResolver } from '../../services/FiduciaryRuntimeAdapter';

interface BoardReportPDFProps {
  data: ExecutiveAdvisoryReport;
  companyName: string;
  reportDate: string;
  temporalData?: any;
  t?: (k: string) => string;
}

// A4 proportions: 210 x 297 mm -> ~794 x 1123 px (at 96 DPI)
// We use a specific wrapper for each page to ensure clean html2canvas capture per page.
export const A4Page = ({ children, isCover = false }: { children: React.ReactNode, isCover?: boolean }) => (
  <div 
    className="pdf-page bg-white relative overflow-hidden" 
    style={{ 
      width: '794px', 
      height: '1123px', 
      boxSizing: 'border-box',
      padding: isCover ? '0' : '40px',
      pageBreakAfter: 'always',
      marginBottom: '20px',
      border: '1px solid #e5e5e5', // visible in preview
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
    }}
  >
    {children}
    {!isCover && (
      <div className="absolute bottom-6 left-10 right-10 flex justify-between items-center border-t border-gray-200 pt-2">
        <span className="text-[9px] font-bold text-[#BAB86C] tracking-widest uppercase">Illumine Corporate Intelligence</span>
        <span className="text-[8px] text-gray-400 uppercase">BOARD ADVISORY REPORT</span>
      </div>
    )}
  </div>
);

export const BoardReportPDF = forwardRef(({ data, companyName, reportDate, temporalData, t }: BoardReportPDFProps, ref: ForwardedRef<HTMLDivElement>) => {
  const translate = t || ((k: string) => k);

  return (
    <div ref={ref} className="pdf-container bg-gray-100 p-8 flex flex-col items-center">
      
      {/* PAGE 1: CAPA EXECUTIVA */}
      <A4Page isCover>
        <div className="w-full h-full bg-[#0E1C2C] text-white flex flex-col relative p-12">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF8552] opacity-10 rounded-bl-full blur-3xl" />
          
          <div className="flex-1 flex flex-col justify-center space-y-8 z-10">
            <div className="w-20 h-20 bg-[#BAB86C] rounded flex items-center justify-center text-[#0E1C2C] mb-8">
               <ShieldCheck size={40} />
            </div>
            
            <h3 className="text-sm font-medium text-[#FF8552] tracking-widest uppercase mb-2">{translate('boardpack.title')}</h3>
            <h1 className="text-5xl font-bold tracking-tighter leading-tight">{companyName}</h1>
            
            <div className="mt-12 space-y-2 border-l-2 border-[#BAB86C] pl-6">
              <p className="text-xs text-gray-300 font-medium uppercase tracking-widest">{translate('boardpack.pdf.issue_date')}: <span className="text-white">{reportDate}</span></p>
              <p className="text-xs text-gray-300 font-medium uppercase tracking-widest">{translate('boardpack.pdf.temporal_scope')}: <span className="text-[#BAB86C]">{translate('boardpack.pdf.active_isolation')}</span></p>
              <p className="text-xs text-gray-300 font-medium uppercase tracking-widest">{translate('boardpack.pdf.inference_confidence')}: <span className="text-white">{data.confidenceLevel}</span></p>
              <p className="text-xs text-gray-300 font-medium uppercase tracking-widest">{translate('boardpack.pdf.executive_posture')}: <span className="text-white">{data.executivePosture}</span></p>
            </div>
          </div>

          <div className="z-10 pt-10 border-t border-white/10">
             <h2 className="text-2xl font-bold tracking-tight">Illumine Corporate Intelligence</h2>
             <p className="text-xs text-gray-400 font-medium mt-1">{translate('boardpack.pdf.powered_by')}</p>
          </div>
        </div>
      </A4Page>

      {/* PAGE 2: SUMÁRIO EXECUTIVO & DIAGNÓSTICO */}
      <A4Page>
        <div className="mb-8 border-b-2 border-[#0E1C2C] pb-2">
           <h2 className="text-2xl font-bold text-[#0E1C2C] uppercase tracking-tight">{translate('boardpack.pdf.executive_synthesis')}</h2>
        </div>

        <div className="space-y-6 mb-8">
           <div className="bg-[#f8f9fa] p-5 rounded-md border border-gray-200">
              <h3 className="text-[10px] font-bold text-[#FF8552] uppercase tracking-widest mb-3">{translate('boardpack.pdf.executive_summary')}</h3>
              <p className="text-xs text-gray-800 leading-relaxed text-justify font-medium">{data.executiveSummary}</p>
           </div>
        </div>

        <div className="space-y-4">
            <div>
                <h3 className="text-[10px] font-bold text-[#0E1C2C] uppercase tracking-widest mb-1 border-b border-gray-200 pb-1">{translate('boardpack.pdf.institutional_diagnosis')}</h3>
                <p className="text-xs text-gray-700 leading-relaxed text-justify mt-2">{data.institutionalDiagnosis}</p>
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8 mt-8">
           <div>
              <h3 className="text-[10px] font-bold text-[#0E1C2C] uppercase tracking-widest mb-3 border-b border-gray-200 pb-1 flex items-center gap-2">
                 <Target size={12} className="text-[#BAB86C]"/> {translate('boardpack.pdf.strategic_priorities')}
              </h3>
              <ul className="space-y-2">
                 {data.strategicPriorities.map((item, i) => (
                    <li key={i} className="text-[10px] text-gray-700 flex gap-2">
                       <span className="text-[#BAB86C] font-bold">•</span> {ExecutiveLabelResolver.resolve(item, t)}
                    </li>
                 ))}
              </ul>
           </div>
           <div>
              <h3 className="text-[10px] font-bold text-[#0E1C2C] uppercase tracking-widest mb-3 border-b border-gray-200 pb-1 flex items-center gap-2">
                 <Activity size={12} className="text-[#FF8552]"/> {translate('boardpack.pdf.dominant_risks')}
              </h3>
              <ul className="space-y-2">
                 {data.dominantRisks.map((item, i) => (
                    <li key={i} className="text-[10px] text-gray-700 flex gap-2">
                       <span className="text-[#FF8552] font-bold">!</span> {ExecutiveDisclosureResolver.resolve(item)}
                    </li>
                 ))}
              </ul>
           </div>
        </div>
      </A4Page>

      {/* PAGE 3: ACTION MATRIX */}
      <A4Page>
        <div className="mb-8 border-b-2 border-[#0E1C2C] pb-2">
           <h2 className="text-2xl font-bold text-[#0E1C2C] uppercase tracking-tight">{translate('boardpack.pdf.action_matrix')}</h2>
        </div>

        <div className="space-y-6">
           <div>
              <h3 className="text-[11px] font-bold text-[#0E1C2C] uppercase tracking-widest mb-4">{translate('boardpack.pdf.executive_action_plan')}</h3>
              <div className="space-y-3">
                  {data.actionMatrix.map((action, i) => (
                    <div key={i} className="flex flex-col border border-gray-200 rounded overflow-hidden">
                       <div className="bg-[#0E1C2C] text-white px-4 py-2 flex justify-between items-center">
                          <h4 className="text-[10px] font-bold uppercase">{ExecutiveLabelResolver.resolve(action.acao, t)}</h4>
                          <span className="text-[8px] font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded">
                              {action.prioridade}
                          </span>
                       </div>
                       <div className="grid grid-cols-3 p-3 gap-4 bg-gray-50">
                          <div>
                             <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">{translate('boardpack.pdf.impact')}</p>
                             <p className="text-[9px] text-gray-800 font-bold">{action.impacto}</p>
                          </div>
                          <div>
                             <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">{translate('boardpack.pdf.speed')}</p>
                             <p className="text-[9px] text-gray-800 font-bold">{action.velocidade}</p>
                          </div>
                          <div>
                             <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">{translate('boardpack.pdf.complexity')}</p>
                             <p className="text-[9px] text-gray-800 font-bold">{action.complexidade}</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </A4Page>

      {/* PAGE 4: GOVERNANÇA & MODERAÇÃO */}
      <A4Page>
        <div className="mb-8 border-b-2 border-[#0E1C2C] pb-2">
           <h2 className="text-2xl font-bold text-[#0E1C2C] uppercase tracking-tight">{translate('boardpack.pdf.institutional_governance')}</h2>
        </div>

        <div className="space-y-6">
           <div className="bg-[#0E1C2C] p-6 rounded-md text-white shadow-xl">
              <h3 className="text-[12px] font-bold text-[#BAB86C] uppercase tracking-widest mb-4 flex items-center gap-2">
                 <ShieldCheck size={16}/> {translate('boardpack.pdf.final_board_decision')}
              </h3>
              
              <div className="bg-white/5 p-4 rounded border border-white/10 mb-4">
                 <p className="text-[11px] font-medium leading-relaxed italic text-center">"{data.recommendedBoardDecision}"</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-gray-50 border border-gray-200 p-4 rounded">
                <h3 className="text-[10px] font-bold text-[#0E1C2C] uppercase tracking-widest mb-3 border-b border-gray-200 pb-1">{translate('boardpack.pdf.narrative_moderation')}</h3>
                <ul className="space-y-2">
                   {data.narrativeModeration.map((item, i) => (
                      <li key={i} className="text-[10px] text-gray-700 flex items-start gap-2">
                         <span className="text-[#BAB86C] font-bold mt-0.5">■</span> {item}
                      </li>
                   ))}
                </ul>
             </div>
             
             <div className="bg-gray-50 border border-gray-200 p-4 rounded">
                <h3 className="text-[10px] font-bold text-[#0E1C2C] uppercase tracking-widest mb-3 border-b border-gray-200 pb-1">{translate('boardpack.pdf.source_signals')}</h3>
                <ul className="space-y-2">
                   {data.sourceSignals.map((item, i) => (
                      <li key={i} className="text-[9px] text-gray-700 font-mono flex items-start gap-2">
                         <span className="text-blue-500 font-bold mt-0.5">&gt;</span> {item}
                      </li>
                   ))}
                </ul>
             </div>
           </div>

           {data.blockedFalsePositives.length > 0 && (
             <div className="bg-rose-50 border border-rose-200 p-4 rounded">
                <h3 className="text-[10px] font-bold text-rose-800 uppercase tracking-widest mb-3 border-b border-rose-200 pb-1 flex items-center gap-2">
                   <Zap size={12}/> {translate('boardpack.pdf.blocked_false_positives')}
                </h3>
                <ul className="space-y-2">
                   {data.blockedFalsePositives.map((item, i) => (
                      <li key={i} className="text-[10px] text-rose-700 flex items-start gap-2">
                         <span className="text-rose-500 font-bold mt-0.5">✖</span> {item}
                      </li>
                   ))}
                </ul>
             </div>
           )}

            <div className="pt-8 border-t border-gray-200 text-center">
             <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full text-gray-400 mb-4">
                <Target size={20} />
             </div>
             <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{translate('boardpack.pdf.end_of_report')}</p>
             <p className="text-[8px] text-gray-400 uppercase tracking-widest mt-1">{translate('boardpack.pdf.produced_by')}</p>
           </div>
        </div>
      </A4Page>

      {temporalData && (
        <A4Page>
          <div className="mb-8 border-b-2 border-[#0E1C2C] pb-2">
            <h2 className="text-2xl font-bold text-[#0E1C2C] uppercase tracking-tight">{translate('boardpack.pdf.appendix_title')}</h2>
          </div>
          <div className="space-y-6">
            <TemporalBoardPackSection temporalData={temporalData} />
          </div>
        </A4Page>
      )}

    </div>
  );
});

BoardReportPDF.displayName = 'BoardReportPDF';
