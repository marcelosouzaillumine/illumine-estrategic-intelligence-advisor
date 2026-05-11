
import React, { useState } from 'react';
import { TrendingUp, Search, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { PageHeader } from '../Common';
import { cn } from '../../lib/utils';
import { DATA } from '../../data';

export function PremissasEconomicasPage() {
  const econData = DATA.premissas.economicas;
  const [activeHistory, setActiveHistory] = useState<string | null>(null);

  return (
    <div className="space-y-12 pb-20">
      <PageHeader 
        title="Premissas Econômicas 2026" 
        description="Fatores macroeconômicos e indicadores financeiros atualizados via BCB, FGV e Tesouro Direto para suporte a projeções."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {econData.map((secao: any, idx: number) => {
          const isHistoryOpen = activeHistory === secao.categoria;
          
          return (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h3 className="text-md font-bold text-slate-800">{secao.categoria}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">{secao.fonte}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {secao.historico && (
                    <button 
                      onClick={() => setActiveHistory(isHistoryOpen ? null : secao.categoria)}
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all flex items-center gap-2",
                        isHistoryOpen 
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                          : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                      )}
                    >
                      {isHistoryOpen ? "Atuais" : "Histórico"}
                      <TrendingUp size={12} className={isHistoryOpen ? "animate-pulse" : ""} />
                    </button>
                  )}
                  <a 
                    href={secao.url} 
                    target="_blank" 
                    rel="no-referrer"
                    className="text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs"
                  >
                    Fonte
                    <Search size={10} />
                  </a>
                </div>
              </div>

              <div className="relative min-h-[300px] flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  {isHistoryOpen && secao.historico ? (
                    <motion.div 
                      key="history"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="absolute inset-0 p-6 flex flex-col"
                    >
                      <div className="flex-1 bg-slate-50 rounded-xl border border-slate-100 p-4">
                        <div className="mb-4">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {secao.categoria.includes('Câmbio') ? 'Evolução Dólar (R$)' : 'Evolução Meta Selic (%)'}
                          </span>
                        </div>
                        <div className="h-48 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={secao.historico}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                              <XAxis dataKey="data" fontSize={9} tickLine={false} axisLine={false} />
                              <YAxis fontSize={9} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                              <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                                formatter={(v: number) => [
                                  secao.categoria.includes('Câmbio') ? `R$ ${v.toFixed(2)}` : `${v.toFixed(2)}%`, 
                                  secao.categoria.includes('Câmbio') ? 'USD' : 'Selic'
                                ]}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="valor" 
                                stroke="#2563eb" 
                                strokeWidth={2} 
                                dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-4 p-3 bg-blue-100/50 rounded-lg border border-blue-200">
                          <p className="text-[10px] text-blue-800 leading-tight">
                            {secao.categoria.includes('Câmbio') 
                              ? 'Série histórica dos últimos 60 meses baseada no fechamento do mercado comercial. Os dados refletem a cotação real de encerramento e servem de base para projeções de fluxo de caixa e operações internacionais.'
                              : 'A Selic apresenta-se em patamar elevado de 14.65%, com sinalização de meta em 14.50% para o próximo período, mantendo a política monetária restritiva para controle inflacionário.'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="indicators"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-6 grid grid-cols-1 divide-y divide-slate-100"
                    >
                      {secao.indicadores.map((ind: any, i: number) => (
                        <div key={i} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between group">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{ind.nome}</span>
                            <span className="text-[10px] text-slate-400 italic mt-0.5">{ind.obs}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-black text-slate-800 block leading-tight">{ind.valor}</span>
                            <span className={cn(
                              "text-[8px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded border mt-1 inline-block",
                              ind.status === 'Manutenção' || ind.status === 'Vigente' || ind.status === 'Estável' 
                                ? 'bg-blue-50 text-blue-600 border-blue-100'
                                : ind.status === 'Alta Demanda' || ind.status === 'Rendimento Real' || ind.status === 'Recuperação' || ind.status === 'Dentro da Meta' || ind.status === 'Redução'
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                : ind.status === 'Deflação'
                                ? 'bg-amber-50 text-amber-600 border-amber-100'
                                : 'bg-slate-50 text-slate-500 border-slate-200'
                            )}>
                              {ind.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="mt-auto p-4 bg-slate-50 border-t border-slate-100">
                 <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                   Dados coletados e normalizados para o cenário de projeção Illumine 2026.
                 </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 bg-blue-600 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="max-w-xl">
            <h3 className="text-3xl font-black tracking-tight mb-4 italic">Conectividade com o Mercado</h3>
            <p className="text-blue-100 text-lg leading-relaxed font-light">
              Nossas premissas são fundamentadas nos relatórios mais recentes do mercado financeiro brasileiro, 
              garantindo que suas simulações de viabilidade e fluxo de caixa reflitam a realidade monetária e fiscal.
            </p>
          </div>
          <div className="flex flex-col gap-4 min-w-[200px]">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
              <span className="block text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">Última Atualização</span>
              <span className="text-xl font-bold">Maio / 2026</span>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
              <span className="block text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">Status do Sistema</span>
              <span className="text-xl font-bold flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
                Sincronizado
              </span>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-20 -right-20 text-white/5">
          <Activity size={300} />
        </div>
      </div>
    </div>
  );
}
