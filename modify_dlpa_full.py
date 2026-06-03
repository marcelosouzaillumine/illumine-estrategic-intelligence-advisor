import re

with open('src/components/pages/DLPAPage.tsx', 'r') as f:
    content = f.read()

# Define the boundaries of the replacement
start_marker = "      {/* Control Bar */}"
end_marker = "      {/* Modals */}"

if start_marker in content and end_marker in content:
    before = content.split(start_marker)[0]
    after = content.split(end_marker)[1]
else:
    print("Markers not found!")
    exit(1)

new_jsx = """      {/* Control Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          {loading && <Loader2 size={14} className="animate-spin text-secondary" />}
          <div className="bg-card border border-border rounded-md px-4 py-2 flex items-center gap-3 shadow-sm">
            <Database size={14} className={hasData ? 'text-success' : 'text-muted-foreground/30'} />
            <span className={cn('text-[10px] font-medium uppercase tracking-[0.2em]', hasData ? 'text-success' : 'text-muted-foreground/40')}>
              {hasData
                ? `${dbDataDLPA.length} registro${dbDataDLPA.length !== 1 ? 's' : ''} · DLPA ${filterYear}`
                : `Amostra · DLPA ${filterYear}`}
            </span>
          </div>
        </div>
        {actionButtons}
      </div>

      {!loading && !hasData && (
        <div className="bg-white border border-dashed border-slate-300 rounded-[40px] p-16 text-center shadow-sm">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-5">
            <BookOpen size={28} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-black text-slate-700 mb-2">Nenhum dado DLPA encontrado</h3>
          <p className="text-sm text-slate-400 leading-relaxed mx-auto" style={{ maxWidth: '36rem' }}>
            Importe ou lance manualmente os dados da Demonstração de Lucros e Prejuízos Acumulados para {filterYear}.
          </p>
          <div className="flex gap-3 mt-6 justify-center">
            <button onClick={() => setShowManualModal(true)} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus size={16} /> Lançar DLPA
            </button>
            <button onClick={() => setShowImportModal(true)} className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2">
              <Upload size={16} /> Importar
            </button>
          </div>
        </div>
      )}

      {hasData && (
        <div className="space-y-6 mb-12">
          {/* --- 1. PREMIUM SCORE HERO BANNER --- */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-[40px] p-10 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between border border-slate-700/50">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
            
            <div className="w-full md:w-auto md:flex-1 flex flex-col items-center md:items-start z-10 text-center md:text-left mb-10 md:mb-0 md:mr-10">
              <h3 className="text-3xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">Governança de Capital</h3>
              <p className="text-sm md:text-base text-indigo-100/80 font-medium leading-relaxed max-w-2xl w-full">
                {narrative || 'Análise estrutural do comportamento fiduciário e destinação de lucros.'}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                <div className="px-6 py-3 rounded-full border shadow-inner backdrop-blur-sm z-10 bg-white/10 text-white border-white/20">
                  <span className="text-sm font-black uppercase tracking-widest">{maturityStyle.label}</span>
                </div>
                {cpiStatus && cpiStatus !== 'NEUTRO' && (
                  <div className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm z-10 text-xs font-bold uppercase tracking-widest text-slate-300">
                    <span>Estrutura:</span>
                    <span className={cn(
                      cpiStatus.includes('Erosão') || cpiStatus.includes('Colapso') ? 'text-rose-400' :
                      cpiStatus.includes('Preservad') ? 'text-emerald-400' : 'text-blue-400'
                    )}>
                      {cpiStatus}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="relative w-48 h-48 flex items-center justify-center shrink-0 z-10 bg-black/20 rounded-[40px] border border-white/10 shadow-inner p-6">
              <ScoreRing
                value={behavior?.capitalReinforcementIndex ?? 0}
                label="Índice de Reforço"
                color={
                  (behavior?.capitalReinforcementIndex ?? 0) >= 80 ? 'emerald' :
                  (behavior?.capitalReinforcementIndex ?? 0) >= 50 ? 'blue' :
                  (behavior?.capitalReinforcementIndex ?? 0) >= 30 ? 'amber' : 'rose'
                }
              />
            </div>
          </div>

          {/* --- 2. DECOMPOSIÇÃO EXECUTIVA (KPIs) --- */}
          <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden">
            <h3 className="text-2xl font-black text-slate-900 mb-6 relative z-10">Decomposição de Indicadores</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10">
              <div className="border-l-4 rounded-r-3xl rounded-l-md p-6 flex flex-col shadow-sm transition-all hover:shadow-md bg-slate-50 border-emerald-500">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-emerald-900">Lucro Líquido</h4>
                </div>
                <p className="text-sm font-medium text-slate-700 leading-relaxed flex-1 mb-6">Resultado do exercício operado como base para distribuição fiduciária.</p>
                <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-200/60">
                  <span className="text-3xl font-black text-slate-800 tracking-tight">{formatCurrency(dlpaMetrics?.lucroLiquido ?? 0)}</span>
                </div>
              </div>

              <div className="border-l-4 rounded-r-3xl rounded-l-md p-6 flex flex-col shadow-sm transition-all hover:shadow-md bg-slate-50 border-blue-500">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-blue-900">Dividendos / Distribuição</h4>
                </div>
                <p className="text-sm font-medium text-slate-700 leading-relaxed flex-1 mb-6">Capital distribuído aos sócios, impactando diretamente a retenção.</p>
                <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-200/60">
                  <span className="text-3xl font-black text-slate-800 tracking-tight">{formatCurrency(dlpaMetrics?.dividendos ?? 0)}</span>
                  <span className="text-[9px] font-bold text-slate-400">TAXA {(distribution ? distribution.distributionRatio * 100 : 0).toFixed(1)}%</span>
                </div>
              </div>

              <div className="border-l-4 rounded-r-3xl rounded-l-md p-6 flex flex-col shadow-sm transition-all hover:shadow-md bg-slate-50 border-indigo-500">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-900">Lucro Retido</h4>
                </div>
                <p className="text-sm font-medium text-slate-700 leading-relaxed flex-1 mb-6">Reinvestimento e reservas para fortalecimento da estrutura de capital.</p>
                <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-200/60">
                  <span className="text-3xl font-black text-slate-800 tracking-tight">{formatCurrency(retentionValue)}</span>
                  <span className="text-[9px] font-bold text-slate-400">TAXA {(retention ? retention.retentionRatio * 100 : 0).toFixed(1)}%</span>
                </div>
              </div>

              <div className="border-l-4 rounded-r-3xl rounded-l-md p-6 flex flex-col shadow-sm transition-all hover:shadow-md bg-slate-50 border-purple-500">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-purple-900">Preservação Patrimonial</h4>
                </div>
                <p className="text-sm font-medium text-slate-700 leading-relaxed flex-1 mb-6">Relação direta entre PL Final e o Capital Social (CPI).</p>
                <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-200/60">
                  <span className="text-3xl font-black text-slate-800 tracking-tight">{(cpi * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            {/* Mensagens Fiduciárias */}
            {fiduciaryOutput?.fiduciaryWarnings && fiduciaryOutput.fiduciaryWarnings.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                {fiduciaryOutput.fiduciaryWarnings.map((warning: string, idx: number) => (
                  <div key={idx} className="p-4 bg-rose-50/50 border-l-4 border-rose-500 rounded-r-xl flex gap-3">
                    <AlertTriangle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                    <span className="text-xs font-bold text-rose-900 leading-relaxed">{warning}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- 3. GRÁFICOS & MAPA DE GOVERNANÇA --- */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100 flex flex-col">
              <h3 className="text-xl font-black text-slate-900 mb-2">Lucro vs Distribuição Histórica</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-3xl mb-8">
                Evolução dos últimos 5 anos de destinação de resultados.
              </p>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={8} />
                    <YAxis hide />
                    <Tooltip
                      cursor={{ fill: '#f8fafc' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100">
                              <p className="text-[10px] font-black uppercase tracking-widest mb-3 text-slate-400">{payload[0]?.payload?.year}</p>
                              {payload.map((p: any, i: number) => (
                                <div key={i} className="flex items-center justify-between gap-6 mb-1">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                    <span className="text-[10px] font-bold text-slate-600 uppercase">{p.name}</span>
                                  </div>
                                  <span className="text-xs font-black text-slate-900">{formatCurrency(p.value)}</span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="LucroLíquido" name="Lucro Líquido" fill="#3b82f6" radius={[5, 5, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="Dividendos"   name="Dividendos"    fill="#f43f5e" radius={[5, 5, 0, 0]} maxBarSize={40} />
                    <Line type="monotone" dataKey="ReservaLegal" name="Reserva Legal" stroke="#8b5cf6" strokeWidth={3}
                      dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar de Governança Integrado */}
            <div className="bg-slate-900 text-white rounded-[40px] p-10 shadow-2xl relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

              <h3 className="text-xl font-black text-white mb-2 relative z-10">Radar de Governança</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8 relative z-10">Dimensões Institucionais de Retenção de Capital.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 relative z-10">
                {[
                  { label: 'Sustentabilidade Patrimonial', value: cpiStatus !== 'NEUTRO' ? cpiStatus : '—', badge: preservationStyle.label, badgeColor: preservationStyle.color, icon: ShieldCheck },
                  { label: 'Dependência de Capitalização', value: fiduciaryOutput?.capitalSupportRatio === 'NOT_AVAILABLE' ? 'N/A' : fiduciaryOutput?.capitalSupportRatio != null ? `${(fiduciaryOutput.capitalSupportRatio * 100).toFixed(1)}%` : '—', badge: retentionStyle.label, badgeColor: retentionStyle.color, icon: BookMarked },
                  { label: 'Capacidade Distributiva', value: distribution?.distributionRatio != null && distribution.distributionRatio > 0 ? `${(distribution.distributionRatio * 100).toFixed(1)}%` : 'Inexistente', badge: distributionStyle.label, badgeColor: distributionStyle.color, icon: PieChartIcon },
                  { label: 'Integridade Patrimonial', value: preservation ? `${(preservation.equityPreservationRatio * 100).toFixed(1)}%` : '—', badge: preservationStyle.label, badgeColor: preservationStyle.color, icon: ShieldCheck }
                ].map(({ label, value, badge, badgeColor, icon: Icon }) => {
                  const darkBadgeColor = badgeColor.replace('700', '400').replace('600', '400').replace(/bg-[a-z]+-50/g, 'bg-white/5').replace(/border-[a-z]+-200/g, 'border-white/10').replace(/border-[a-z]+-100/g, 'border-white/10');
                  return (
                  <div key={label} className="p-5 bg-white/[0.03] rounded-2xl border border-white/10 flex flex-col gap-3 hover:bg-white/[0.08] transition-all duration-300 backdrop-blur-md shadow-lg group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                          <Icon size={18} className="text-white/80" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.15em] mb-0.5">{label}</p>
                          <p className={cn('text-xs font-bold px-2 py-0.5 rounded border inline-block mt-1', darkBadgeColor)}>{badge}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-lg font-black text-white tracking-tight text-right">{value}</p>
                  </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* --- 4. TABELA DETALHADA --- */}
          <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                  <FileText size={20} className="text-blue-500" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">Detalhamento DLPA — {filterYear}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Demonstração Contábil Importada</p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                {dbDataDLPA.length} lançamentos
              </span>
            </div>
            <div className="overflow-x-auto p-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição da Conta</th>
                    <th className="text-right py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor (R$)</th>
                    <th className="text-right py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Natureza</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {dbDataDLPA.map((row: any, i: number) => {
                    const v = Number(row.val || row.valor || row.value || 0);
                    const isNegative = v < 0;
                    const conta = row.conta || row.category || row.nome || '—';
                    const isTotal = conta.toLowerCase().includes('total') ||
                      conta.toLowerCase().includes('saldo') ||
                      conta.toLowerCase().includes('lucro liquido') ||
                      conta.toLowerCase().includes('resultado');
                    return (
                      <tr key={row.id || i} className={cn('hover:bg-slate-50 transition-colors', isTotal ? 'bg-slate-50/60' : '')}>
                        <td className="py-4 px-8">
                          <span className={cn('block', isTotal ? 'text-slate-900 font-black text-sm' : 'text-slate-600 font-medium pl-4 text-sm')}>
                            {conta}
                          </span>
                        </td>
                        <td className={cn('py-4 px-8 text-right font-mono font-bold text-sm',
                          isNegative ? 'text-rose-600' : 'text-slate-700',
                          isTotal && 'text-slate-900 font-black')}>
                          {formatCurrency(v)}
                        </td>
                        <td className="py-4 px-8 text-right">
                          <span className={cn('text-[9px] font-black uppercase px-3 py-1 rounded-full border',
                            isNegative ? 'bg-rose-50 text-rose-600 border-rose-200' : v > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'
                          )}>
                            {isNegative ? 'Redução' : v > 0 ? 'Adição' : 'Neutro'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {dlpaMetrics && (
                  <tfoot>
                    <tr className="bg-slate-900 text-white rounded-b-3xl overflow-hidden">
                      <td className="py-6 px-8 text-sm font-black uppercase tracking-widest rounded-bl-[32px]">
                        {dlpaMetrics.lucroLiquido < 0 ? "Prejuízo Acumulado" : "Saldo de Lucros Retidos"}
                      </td>
                      <td className={cn('py-6 px-8 text-right font-mono font-black text-lg',
                        retentionValue >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                        {formatCurrency(retentionValue)}
                      </td>
                      <td className="py-6 px-8 text-right rounded-br-[32px]">
                        <span className="text-[10px] font-black uppercase px-3 py-1.5 rounded-full bg-white/10 text-white border border-white/20">
                          Calculado
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}"""

with open('src/components/pages/DLPAPage.tsx', 'w') as f:
    f.write(before + new_jsx + after)

print("DLPA Rewrite Complete!")
