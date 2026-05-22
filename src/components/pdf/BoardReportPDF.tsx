import React, { ForwardedRef, forwardRef } from 'react';
import { BoardReportData } from '../../services/aiBoardReportService';
import { formatCurrency } from '../../lib/utils';
import { ShieldCheck, Activity, Target, Zap, Layout } from 'lucide-react';

interface BoardReportPDFProps {
  data: BoardReportData;
  companyName: string;
  reportDate: string;
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
        <span className="text-[8px] text-gray-400">BOARD ADVISORY REPORT</span>
      </div>
    )}
  </div>
);

export const BoardReportPDF = forwardRef(({ data, companyName, reportDate }: BoardReportPDFProps, ref: ForwardedRef<HTMLDivElement>) => {
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
            
            <h3 className="text-sm font-medium text-[#FF8552] tracking-widest uppercase mb-2">Relatório Executivo Premium</h3>
            <h1 className="text-5xl font-bold tracking-tighter leading-tight">{companyName}</h1>
            
            <div className="mt-12 space-y-2 border-l-2 border-[#BAB86C] pl-6">
              <p className="text-xs text-gray-300 font-medium uppercase tracking-widest">Data de Emissão: <span className="text-white">{reportDate}</span></p>
              <p className="text-xs text-gray-300 font-medium uppercase tracking-widest">Versão: <span className="text-white">v3.0.0 Corporate Resilience</span></p>
              <p className="text-xs text-gray-300 font-medium uppercase tracking-widest">Classificação: <span className="text-white">{data.scoreConsolidado.classificacaoGeral}</span></p>
            </div>
          </div>

          <div className="z-10 pt-10 border-t border-white/10">
             <h2 className="text-2xl font-bold tracking-tight">Illumine Corporate Intelligence</h2>
             <p className="text-xs text-gray-400 font-medium mt-1">Board Advisory & Governance Analytics</p>
          </div>
        </div>
      </A4Page>

      {/* PAGE 2: SUMÁRIO EXECUTIVO & SCORE */}
      <A4Page>
        <div className="mb-8 border-b-2 border-[#0E1C2C] pb-2">
           <h2 className="text-2xl font-bold text-[#0E1C2C] uppercase tracking-tight">Sumário Executivo & Score Corporativo</h2>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
           <div className="bg-[#f8f9fa] p-5 rounded-md border border-gray-200">
              <h3 className="text-[10px] font-bold text-[#FF8552] uppercase tracking-widest mb-3">Score Consolidado</h3>
              <div className="flex items-end gap-2 mb-4">
                 <span className="text-4xl font-black text-[#0E1C2C]">{data.scoreConsolidado.scorePatrimonial}</span>
                 <span className="text-xs text-gray-500 font-bold mb-1">/ 100</span>
              </div>
              <div className="space-y-3">
                 <div>
                    <div className="flex justify-between text-[9px] font-bold text-gray-600 mb-1 uppercase">
                       <span>Continuidade</span>
                       <span>{data.scoreConsolidado.indiceContinuidade}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                       <div className="h-full bg-[#0E1C2C]" style={{ width: `\${data.scoreConsolidado.indiceContinuidade}%` }} />
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-[9px] font-bold text-gray-600 mb-1 uppercase">
                       <span>Resiliência</span>
                       <span>{data.scoreConsolidado.resilienciaEstrutural}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                       <div className="h-full bg-[#BAB86C]" style={{ width: `\${data.scoreConsolidado.resilienciaEstrutural}%` }} />
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-[9px] font-bold text-gray-600 mb-1 uppercase">
                       <span>Liquidity Quality</span>
                       <span>{data.scoreConsolidado.liquidityQuality}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                       <div className="h-full bg-[#FF8552]" style={{ width: `\${data.scoreConsolidado.liquidityQuality}%` }} />
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              <div>
                 <h3 className="text-[10px] font-bold text-[#0E1C2C] uppercase tracking-widest mb-1">Diagnóstico Executivo</h3>
                 <p className="text-xs text-gray-700 leading-relaxed text-justify">{data.sumarioExecutivo.diagnostico}</p>
              </div>
              <div>
                 <h3 className="text-[10px] font-bold text-[#0E1C2C] uppercase tracking-widest mb-1">Tendência Projetada</h3>
                 <p className="text-xs text-gray-700 leading-relaxed text-justify">{data.sumarioExecutivo.tendenciaProjetada}</p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
           <div>
              <h3 className="text-[10px] font-bold text-[#0E1C2C] uppercase tracking-widest mb-3 border-b border-gray-200 pb-1">Forças Estruturais</h3>
              <ul className="space-y-2">
                 {data.sumarioExecutivo.forcasEstruturais.map((item, i) => (
                    <li key={i} className="text-[10px] text-gray-700 flex gap-2">
                       <span className="text-[#BAB86C] font-bold">✓</span> {item}
                    </li>
                 ))}
              </ul>
           </div>
           <div>
              <h3 className="text-[10px] font-bold text-[#0E1C2C] uppercase tracking-widest mb-3 border-b border-gray-200 pb-1">Fragilidades Críticas</h3>
              <ul className="space-y-2">
                 {data.sumarioExecutivo.fragilidadesCriticas.map((item, i) => (
                    <li key={i} className="text-[10px] text-gray-700 flex gap-2">
                       <span className="text-[#FF8552] font-bold">!</span> {item}
                    </li>
                 ))}
              </ul>
           </div>
        </div>
      </A4Page>

      {/* PAGE 3: ANÁLISE DAS DEMONSTRAÇÕES & LIQUIDITY */}
      <A4Page>
        <div className="mb-8 border-b-2 border-[#0E1C2C] pb-2">
           <h2 className="text-2xl font-bold text-[#0E1C2C] uppercase tracking-tight">Análise Estrutural & Liquidez</h2>
        </div>

        <div className="space-y-6">
           <div>
              <h3 className="text-[11px] font-bold text-[#0E1C2C] uppercase tracking-widest mb-2 flex items-center gap-2">
                 <Layout size={14} className="text-[#FF8552]"/> Balanço Patrimonial & Estrutura
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed text-justify bg-gray-50 p-4 rounded border border-gray-100">
                 {data.analiseDemonstracoes.balancoPatrimonial}
              </p>
           </div>
           
           <div>
              <h3 className="text-[11px] font-bold text-[#0E1C2C] uppercase tracking-widest mb-2 flex items-center gap-2">
                 <Activity size={14} className="text-[#FF8552]"/> Demonstração de Resultado (DRE)
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed text-justify bg-gray-50 p-4 rounded border border-gray-100">
                 {data.analiseDemonstracoes.dre}
              </p>
           </div>

           <div>
              <h3 className="text-[11px] font-bold text-[#0E1C2C] uppercase tracking-widest mb-2 flex items-center gap-2">
                 <Zap size={14} className="text-[#FF8552]"/> Liquidity Quality Intelligence
              </h3>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-[#0E1C2C] text-white p-4 rounded">
                    <h4 className="text-[9px] font-bold text-[#BAB86C] uppercase tracking-widest mb-2">Diagnóstico de Sustentabilidade</h4>
                    <p className="text-[10px] leading-relaxed">{data.liquidityIntelligence.diagnosticoSustentabilidade}</p>
                 </div>
                 <div className="border border-[#0E1C2C] p-4 rounded bg-white">
                    <h4 className="text-[9px] font-bold text-[#0E1C2C] uppercase tracking-widest mb-2">Qualidade da Liquidez</h4>
                    <p className="text-[10px] text-gray-800 leading-relaxed mb-3">{data.liquidityIntelligence.qualidadeLiquidez}</p>
                    <h4 className="text-[9px] font-bold text-[#FF8552] uppercase tracking-widest mb-1">Risco de Estrangulamento</h4>
                    <p className="text-[10px] text-gray-800 leading-relaxed font-bold">{data.liquidityIntelligence.riscoEstrangulamento}</p>
                 </div>
              </div>
           </div>
        </div>
      </A4Page>

      {/* PAGE 4: STRESS TESTING & BOARD INTELLIGENCE */}
      <A4Page>
        <div className="mb-8 border-b-2 border-[#0E1C2C] pb-2">
           <h2 className="text-2xl font-bold text-[#0E1C2C] uppercase tracking-tight">Board Intelligence & Action Plan</h2>
        </div>

        <div className="space-y-8">
           {/* Stress Testing */}
           <div>
              <h3 className="text-[11px] font-bold text-[#0E1C2C] uppercase tracking-widest mb-4">Stress Testing & Cenários</h3>
              <div className="space-y-3">
                 {data.stressTesting.simulacoes.map((sim, i) => (
                    <div key={i} className="flex flex-col border border-gray-200 rounded overflow-hidden">
                       <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                          <h4 className="text-[10px] font-bold text-[#0E1C2C] uppercase">{sim.cenario}</h4>
                       </div>
                       <div className="grid grid-cols-3 p-3 gap-4">
                          <div>
                             <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Impacto Estrutural</p>
                             <p className="text-[9px] text-gray-800">{sim.impactoEstrutural}</p>
                          </div>
                          <div>
                             <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Impacto de Caixa</p>
                             <p className="text-[9px] text-gray-800">{sim.impactoCaixa}</p>
                          </div>
                          <div>
                             <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Continuidade</p>
                             <p className="text-[9px] text-gray-800">{sim.impactoContinuidade}</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Action Plan */}
           <div>
              <h3 className="text-[11px] font-bold text-[#0E1C2C] uppercase tracking-widest mb-4">Action Plan Executivo</h3>
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-[#0E1C2C] text-white">
                       <th className="p-3 text-[9px] font-bold uppercase tracking-widest">Prioridade</th>
                       <th className="p-3 text-[9px] font-bold uppercase tracking-widest w-24">Urgência</th>
                       <th className="p-3 text-[9px] font-bold uppercase tracking-widest">Impacto Esperado</th>
                       <th className="p-3 text-[9px] font-bold uppercase tracking-widest w-24">Horizonte</th>
                    </tr>
                 </thead>
                 <tbody>
                    {data.actionPlan.map((action, i) => (
                       <tr key={i} className="border-b border-gray-200">
                          <td className="p-3 text-[10px] font-bold text-gray-800">{action.prioridade}</td>
                          <td className="p-3">
                             <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded \${
                                action.urgencia.toLowerCase() === 'alta' ? 'bg-[#FF8552]/20 text-[#FF8552]' : 'bg-gray-100 text-gray-600'
                             }`}>
                                {action.urgencia}
                             </span>
                          </td>
                          <td className="p-3 text-[10px] text-gray-600">{action.impactoEsperado}</td>
                          <td className="p-3 text-[10px] text-gray-600 font-bold">{action.horizonteTemporal}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </A4Page>

      {/* PAGE 5: PARECER TÉCNICO & CONCLUSÃO */}
      <A4Page>
        <div className="mb-8 border-b-2 border-[#0E1C2C] pb-2">
           <h2 className="text-2xl font-bold text-[#0E1C2C] uppercase tracking-tight">Parecer Técnico & Conclusão</h2>
        </div>

        <div className="space-y-6">
           <div className="bg-[#0E1C2C] p-6 rounded-md text-white shadow-xl">
              <h3 className="text-[12px] font-bold text-[#BAB86C] uppercase tracking-widest mb-4">Conclusão Executiva para o Board</h3>
              <p className="text-xs text-gray-200 leading-relaxed text-justify mb-6">
                 {data.conclusao.sinteseEstrategica}
              </p>
              
              <div className="bg-white/5 p-4 rounded border border-white/10 mb-4">
                 <h4 className="text-[9px] font-bold text-[#FF8552] uppercase tracking-widest mb-2">Recomendação Definitiva</h4>
                 <p className="text-[11px] font-medium leading-relaxed italic">"{data.conclusao.recomendacaoBoard}"</p>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded">
                 <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Crescimento Saudável?</h4>
                 <p className="text-[10px] text-gray-800 font-medium">{data.parecerTecnico.crescimentoSaudavel}</p>
              </div>
              <div className="p-4 border border-gray-200 rounded">
                 <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Risco Estrutural?</h4>
                 <p className="text-[10px] text-gray-800 font-medium">{data.parecerTecnico.riscoEstrutural}</p>
              </div>
              <div className="p-4 border border-gray-200 rounded">
                 <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Necessidade de Capitalização?</h4>
                 <p className="text-[10px] text-gray-800 font-medium">{data.parecerTecnico.necessidadeCapitalizacao}</p>
              </div>
              <div className="p-4 border border-gray-200 rounded">
                 <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Caixa Suporta Operação?</h4>
                 <p className="text-[10px] text-gray-800 font-medium">{data.parecerTecnico.caixaSuportaOperacao}</p>
              </div>
           </div>

           <div className="pt-8 border-t border-gray-200 text-center">
             <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full text-gray-400 mb-4">
                <Target size={20} />
             </div>
             <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Fim do Relatório Executivo</p>
             <p className="text-[8px] text-gray-400 uppercase tracking-widest mt-1">Gerado pelo Motor de Inteligência Corporativa Illumine</p>
           </div>
        </div>
      </A4Page>

    </div>
  );
});

BoardReportPDF.displayName = 'BoardReportPDF';
