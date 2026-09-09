import * as fs from 'fs';

const filePath = '/Users/marcelosouza/Documents/illumine-strategic-governance-advisor/src/components/pages/BalanceSheetPage.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

const newHeroSection = `      {/* ── Resiliência e Maturidade (Health Scores) ── */}
      <div className="mb-12">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-[40px] p-10 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between border border-slate-700/50 mb-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none transition-all duration-500" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
          
          <div className="w-full md:w-auto md:flex-1 flex flex-col items-center md:items-start z-10 text-center md:text-left mb-10 md:mb-0 md:mr-10">
            <h3 className="text-3xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">Score Patrimonial</h3>
            <p className="text-sm md:text-base text-indigo-100/80 font-medium leading-relaxed w-full">
              Índice composto que avalia a saúde estrutural, folga de caixa, proteção contra choques de curto prazo e a qualidade do financiamento de longo prazo.
            </p>
            
            <div className={cn("px-6 py-3 mt-8 rounded-full border shadow-inner backdrop-blur-sm text-xs font-bold uppercase tracking-wider inline-flex", 
              resilienciaGlobal >= 81 ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
              resilienciaGlobal >= 61 ? 'bg-indigo-500/5 text-indigo-300 border-indigo-500/10' : 
              resilienciaGlobal >= 41 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
              resilienciaGlobal >= 21 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-red-600/20 text-red-400 border-red-500/30')}>
              Nível {maturidade}
            </div>
          </div>

          <div className="relative w-48 h-48 flex items-center justify-center shrink-0 z-10">
            {/* SVG Gradients */}
            <svg width="0" height="0">
              <defs>
                <linearGradient id="score-gradient-patrimonial" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={resilienciaGlobal >= 80 ? "#6366f1" : resilienciaGlobal >= 50 ? "#f59e0b" : "#ef4444"} />
                  <stop offset="100%" stopColor={resilienciaGlobal >= 80 ? "#818cf8" : resilienciaGlobal >= 50 ? "#fbbf24" : "#f87171"} />
                </linearGradient>
              </defs>
            </svg>
            <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_12px_rgba(0,0,0,0.5)]" viewBox="0 0 192 192">
              <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800/80" />
              <circle cx="96" cy="96" r="84" stroke="url(#score-gradient-patrimonial)" strokeWidth="12" fill="transparent" 
                strokeDasharray="528" 
                strokeDashoffset={528 - (528 * resilienciaGlobal) / 100}
                strokeLinecap="round" 
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-6xl font-black text-white filter drop-shadow-sm leading-none absolute">{resilienciaGlobal.toFixed(0)}</span>
               <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest absolute bottom-9">/ 100</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Operacional', val: hsOperacional, color: 'emerald' },
            { label: 'Patrimonial', val: hsPatrimonial, color: 'blue' },
            { label: 'Liquidez', val: hsLiquidez, color: 'amber' },
            { label: 'Estrutural', val: hsEstrutural, color: 'purple' }
          ].map((hs, i) => (
            <div key={i} className="bg-slate-950 border border-white/5 rounded-[32px] p-6 flex flex-col justify-between relative overflow-hidden group transition-all duration-500 hover:-translate-y-1 hover:border-white/10 shadow-xl">
              <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[40px] -mr-16 -mt-16 pointer-events-none opacity-40 transition-opacity duration-500 group-hover:opacity-70", \`bg-\${hs.color}-500/30\`)} />
              
              <div className="relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 block">{hs.label}</span>
                <div className="mt-8">
                  <span className="text-4xl font-black tracking-tighter drop-shadow-md text-white">{hs.val.toFixed(0)}</span>
                  <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden shadow-inner">
                    <div className={cn("h-full rounded-full transition-all duration-1000 ease-out", \`bg-\${hs.color}-500\`)} style={{ width: \`\${hs.val}%\` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>`;

content = content.replace(
  /\{\/\* ── Resiliência e Maturidade \(Health Scores\) ── \*\/\}[\s\S]*?\{\/\* ── Inteligência Patrimonial \(Leitura Causal\) ── \*\/\}/,
  newHeroSection + "\n\n      {/* ── Inteligência Patrimonial (Leitura Causal) ── */}"
);

fs.writeFileSync(filePath, content);
console.log("Updated BalanceSheetPage hero section successfully.");
