import * as fs from 'fs';

const filePath = '/Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/pages/BalanceSheetPage.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add imports for AreaChart, Area
content = content.replace(
  "BarChart,\n  Bar,",
  "AreaChart,\n  Area,\n  BarChart,\n  Bar,"
);

// 2. Replace Hero Section
const newHeroSection = `      {/* ── Resiliência e Maturidade (Health Scores) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-950 text-white rounded-[32px] p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between border border-white/10 group">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none transition-all duration-700 group-hover:bg-indigo-500/30" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[60px] -ml-20 -mb-20 pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/50 mb-2">Score Patrimonial</h3>
            <h2 className="text-3xl font-black mb-8 leading-tight">Resiliência<br/>Financeira</h2>
            
            <div className="flex items-end gap-2 mb-4">
              <span className="text-[80px] font-black leading-none tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">
                {resilienciaGlobal.toFixed(0)}
              </span>
              <span className="text-2xl font-black text-white/30 mb-2">/100</span>
            </div>
            
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mt-2 shadow-inner">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Nível {maturidade}</span>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <span className={cn("text-4xl font-black tracking-tighter drop-shadow-md", \`text-\${hs.color}-400\`)}>{hs.val.toFixed(0)}</span>
                  <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden shadow-inner">
                    <div className={cn("h-full rounded-full transition-all duration-1000 ease-out", \`bg-\${hs.color}-500\`)} style={{ width: \`\${hs.val}%\` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Inteligência Patrimonial (Leitura Causal) ── */}
      <div className="mb-12">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 pl-2">Advisory AI • Leitura Causal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {causalInsights.map((insight, i) => {
            const isAlert = insight.type.includes('Problema') || insight.type.includes('Risco');
            const isGood = insight.type.includes('Potencial') || insight.title.includes('Solidez');
            return (
              <div key={i} className={cn(
                "p-8 rounded-[32px] border flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden group",
                isAlert ? "bg-gradient-to-br from-rose-50/80 to-white border-rose-100/50" : isGood ? "bg-gradient-to-br from-emerald-50/80 to-white border-emerald-100/50" : "bg-gradient-to-br from-blue-50/80 to-white border-blue-100/50"
              )}>
                <div className={cn(
                  "absolute -top-10 -right-10 w-40 h-40 blur-[50px] rounded-full opacity-30 transition-opacity duration-500 group-hover:opacity-50", 
                  isAlert ? "bg-rose-400" : isGood ? "bg-emerald-400" : "bg-blue-400"
                )} />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm backdrop-blur-sm border",
                      isAlert ? "bg-rose-100/50 text-rose-600 border-rose-200/50" : isGood ? "bg-emerald-100/50 text-emerald-600 border-emerald-200/50" : "bg-blue-100/50 text-blue-600 border-blue-200/50"
                    )}>
                      {isAlert ? <TrendingDown size={20} strokeWidth={2} /> : isGood ? <TrendingUp size={20} strokeWidth={2} /> : <Info size={20} strokeWidth={2} />}
                    </div>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest",
                      isAlert ? "text-rose-500" : isGood ? "text-emerald-500" : "text-blue-500"
                    )}>{insight.type}</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-3 leading-tight">{insight.title}</h4>
                  <p className="text-xs font-medium text-slate-600 leading-relaxed">{insight.desc}</p>
                </div>
              </div>
            )
          })}
          {causalInsights.length === 0 && (
             <div className="col-span-full py-12 text-center opacity-50 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
               <Database size={32} className="mx-auto mb-4 text-slate-400" />
               <p className="text-sm font-bold text-slate-500">Aguardando dados para gerar leitura causal.</p>
             </div>
          )}
        </div>
      </div>`;

content = content.replace(
  /\{\/\* ── Resiliência e Maturidade \(Health Scores\) ── \*\/\}([\s\S]*?)\{\/\* ── Indicadores Estratégicos Originais e Expandidos ── \*\/\}/,
  newHeroSection + "\n\n      {/* ── Indicadores Estratégicos Originais e Expandidos ── */}"
);


// 3. Replace Chart Section
const newChartSection = `      {/* ── Análise de Evolução e Gráficos ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="text-lg font-black text-slate-900">Evolução Patrimonial</h3>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em] mt-1">Comparativo de 5 Anos</p>
            </div>
            <div className="flex gap-5 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ativo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.5)]" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Passivo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">PL</span>
              </div>
            </div>
          </div>
          
          <div className="h-[320px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAtivo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPassivo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="year" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900/90 text-white p-5 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-white/50">{payload[0].payload.year}</p>
                          <div className="space-y-3">
                            {payload.map((p: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between gap-10">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                                  <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{p.name}</span>
                                </div>
                                <span className="text-xs font-black tabular-nums">{formatCurrency(p.value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="ativo" name="Ativo" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAtivo)" />
                <Area type="monotone" dataKey="passivo" name="Passivo" stroke="#94a3b8" strokeWidth={3} fillOpacity={1} fill="url(#colorPassivo)" />
                <Area type="monotone" dataKey="pl" name="PL" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorPl)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>`;

content = content.replace(
  /\{\/\* ── Análise de Evolução e Gráficos ─────────────────────────────────── \*\/\}([\s\S]*?)<Bar dataKey="pl" name="PL" fill="#a855f7" radius=\{\[4, 4, 0, 0\]\} \/>\s*<\/BarChart>\s*<\/ResponsiveContainer>\s*<\/div>\s*<\/div>/,
  newChartSection
);

// 4. Replace Tables
const newTables = `      {/* ── Tabelas Detalhadas com AV/AH ─────────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2 mb-2">
          <div>
            <h3 className="text-lg font-black text-slate-900">Análise Estrutural Detalhada</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">Composição Horizontal e Vertical</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm">
               <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">AV: Análise Vertical</span>
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">AH: Análise Horizontal</span>
             </div>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] border border-dashed border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Calendar size={28} className="text-slate-300" />
            </div>
            <p className="text-sm font-black text-slate-500">Nenhum dado encontrado</p>
            <p className="text-xs font-medium text-slate-400 mt-2">
              Importe ou insira manualmente os dados para o ano {filterYear}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Seções de Tabelas */}
            {[
              { title: 'Ativo', data: comparativeAnalysis.filter(r => (r.tipo || r.type || '').toLowerCase() === 'ativo'), color: 'emerald' },
              { title: 'Passivo', data: comparativeAnalysis.filter(r => (r.tipo || r.type || '').toLowerCase() === 'passivo' && !isPL(r)), color: 'blue' },
              { title: 'Patrimônio Líquido', data: comparativeAnalysis.filter(r => isPL(r)), color: 'purple' }
            ].map((section, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-[32px] shadow-sm overflow-hidden group">
                <div className={cn("px-6 py-5 border-b flex items-center justify-between bg-slate-50/50", \`border-\${section.color}-100/50\`)}>
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-6 rounded-full", \`bg-\${section.color}-500\`)} />
                    <h4 className="text-base font-black text-slate-900 tracking-tight">{section.title}</h4>
                  </div>
                  <span className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full", \`bg-\${section.color}-50 text-\${section.color}-600\`)}>
                    Detalhamento Estrutural
                  </span>
                </div>
                
                <div className="p-2">
                  {/* Header Row */}
                  <div className="flex items-center px-4 py-3 border-b border-slate-100/50 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <div className="flex-1">Conta Contábil</div>
                    <div className="w-32 text-right">Saldo (R$)</div>
                    <div className="w-24 text-right">AV (%)</div>
                    <div className="w-28 text-right">AH (%)</div>
                  </div>
                  
                  {/* Data Rows */}
                  <div className="space-y-1 mt-2">
                    {section.data.map((row: any, i: number) => (
                      <div key={i} className={cn(
                        "flex items-center px-4 py-3 rounded-2xl transition-all duration-200 hover:bg-slate-50",
                        row.level === 1 ? "bg-slate-50/50" : ""
                      )}>
                        <div className="flex-1 flex items-center">
                          <span 
                            className={cn(
                              "text-xs block truncate pr-4", 
                              row.level === 1 ? "font-black text-slate-800" : "font-semibold text-slate-500"
                            )}
                            style={{ paddingLeft: row.level > 1 ? \`\${(row.level - 1) * 16}px\` : '0px' }}
                          >
                            {row.level > 1 && (
                              <span className="inline-block w-3 h-[1px] bg-slate-300 mr-2 align-middle opacity-50" />
                            )}
                            {row.conta === 'Patrimônio Líquido' ? 'Patrimônio' : row.conta}
                          </span>
                        </div>
                        
                        <div className="w-32 text-right font-display text-sm font-bold text-slate-700 tabular-nums">
                          {formatCurrency(row.val)}
                        </div>
                        
                        <div className="w-24 text-right flex justify-end">
                          <span className="inline-flex items-center justify-center px-2 py-1 rounded-lg bg-slate-100/50 text-slate-500 text-[10px] font-black tabular-nums border border-slate-200/50">
                            {row.av.toFixed(2)}%
                          </span>
                        </div>
                        
                        <div className="w-28 text-right flex justify-end">
                          {row.ah !== 0 ? (
                            <span className={cn(
                              "inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black tabular-nums border",
                              row.ah > 0 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : row.ah < 0 ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-slate-50 text-slate-400 border-slate-200"
                            )}>
                              {row.ah > 0 ? <TrendingUp size={10} strokeWidth={3} /> : <TrendingDown size={10} strokeWidth={3} />}
                              {Math.abs(row.ah).toFixed(2)}%
                            </span>
                          ) : (
                             <span className="inline-flex items-center justify-center px-2 py-1 text-slate-300 text-[10px] font-black">
                               —
                             </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>`;

content = content.replace(
  /\{\/\* ── Tabelas Detalhadas com AV\/AH ─────────────────────────────────── \*\/\}([\s\S]*?)<\/div>\s*\{\/\* ── Comentário Executivo ─────────────────────────────────────────── \*\/\}/,
  newTables + "\n\n      {/* ── Comentário Executivo ─────────────────────────────────────────── */}"
);

fs.writeFileSync(filePath, content);
console.log("Updated BalanceSheetPage.tsx with premium redesign successfully.");
