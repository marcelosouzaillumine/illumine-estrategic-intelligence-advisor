import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Search, Activity, RefreshCw, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PageHeader } from '../Common';
import { cn } from '../../lib/utils';
import { DATA } from '../../data';


import { db, auth, MASTER_ADMINS } from '../../lib/firebase';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';

export function PremissasEconomicasPage() {
  const [econData, setEconData] = useState(DATA.premissas.economicas);
  const [activeHistory, setActiveHistory] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    // Escutar premissas globais do Firestore
    const unsub = onSnapshot(doc(db, 'system', 'economic_premises'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.econData) setEconData(data.econData);
        if (data.lastSync) setLastSync(data.lastSync);
      }
    });
    return () => unsub();
  }, []);

  const handleSync = useCallback(async () => {
    if (isSyncing) return;
    
    // Apenas Master Admins podem disparar a sincronização manual para evitar custos de API excessivos
    const isMaster = auth.currentUser?.email && MASTER_ADMINS.includes(auth.currentUser.email);
    if (!isMaster) {
      alert("Apenas administradores master podem forçar a sincronização de mercado.");
      return;
    }

    setIsSyncing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const now = new Date();
      const formattedDate = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const formattedMonthYear = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

      let currentSelic = 14.50;
      let currentDollar = 4.9809; 
      let currentEuro = 5.772;
      let currentIpca = 4.39;

      try {
        const [currencyRes, selicRes, ipcaRes, ptaxRes] = await Promise.all([
          fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL').then(r => r.json()).catch(() => null),
          fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json').then(r => r.json()).catch(() => null),
          fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados/ultimos/1?formato=json').then(r => r.json()).catch(() => null),
          fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/1?formato=json').then(r => r.json()).catch(() => null)
        ]);

        if (ptaxRes?.[0]?.valor) {
          currentDollar = parseFloat(ptaxRes[0].valor);
        } else if (currencyRes?.USDBRL) {
          currentDollar = parseFloat(currencyRes.USDBRL.bid);
        }

        if (currencyRes?.EURBRL) currentEuro = parseFloat(currencyRes.EURBRL.bid);
        if (selicRes?.[0]?.valor) currentSelic = parseFloat(selicRes[0].valor);
        if (ipcaRes?.[0]?.valor) currentIpca = parseFloat(ipcaRes[0].valor);
      } catch (e) {
        console.warn("Falha na sincronização em tempo real.");
      }

      const updatedData = econData.map(secao => {
        const cat = secao.categoria.toLowerCase();
        const isSelic = cat.includes('taxas') || cat.includes('juros');
        const isCambio = cat.includes('câmbio') || cat.includes('moedas');
        const isInflacao = cat.includes('inflação');

        return {
          ...secao,
          indicadores: secao.indicadores.map((ind: any) => {
            let val = ind.valor;
            let status = 'Sincronizado';
            const nome = ind.nome.toLowerCase();

            if (isSelic && nome.includes('selic')) {
              val = `${currentSelic.toFixed(2)}% a.a.`;
            } else if (isCambio && nome.includes('dólar')) {
              val = `R$ ${currentDollar.toFixed(4).replace('.', ',')}`;
            } else if (isCambio && nome.includes('euro')) {
              val = `R$ ${currentEuro.toFixed(3).replace('.', ',')}`;
            } else if (isInflacao && nome.includes('ipca')) {
              val = `${currentIpca.toFixed(2)}%`;
            } else {
              status = 'Atualizado';
            }

            return {
              ...ind,
              valor: val,
              status: status,
              obs: (ind.obs.includes('Ref') || ind.obs.includes('Cotação') || ind.obs.includes('Referência'))
                ? `${ind.obs.split(':')[0]}: ${formattedDate}`
                : ind.obs
            };
          })
        };
      });

      // Gravar no Firestore para todos os usuários
      await setDoc(doc(db, 'system', 'economic_premises'), {
        econData: updatedData,
        lastSync: formattedDate,
        lastSyncFull: formattedMonthYear,
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser?.email
      });

    } catch (error) {
      console.error("Erro na sincronização de mercado:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [econData, isSyncing]);

  const [lastSyncFull, setLastSyncFull] = useState<string | null>(null);

  useEffect(() => {
    // Escutar premissas globais do Firestore
    const unsub = onSnapshot(doc(db, 'system', 'economic_premises'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.econData) setEconData(data.econData);
        if (data.lastSync) setLastSync(data.lastSync);
        if (data.lastSyncFull) setLastSyncFull(data.lastSyncFull);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const isMaster = auth.currentUser?.email && MASTER_ADMINS.includes(auth.currentUser.email);
    const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    if (isMaster && lastSync && lastSync !== today) {
      handleSync();
    }
  }, [lastSync, handleSync]);

  const lastSyncDisplay = lastSyncFull || "Aguardando sincronização...";

  return (
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade @container">
      <PageHeader 
        title="Premissas do Sistema" 
        subtitle="Configurações globais e indicadores de mercado atualizados para suporte estratégico."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {econData.map((secao: any, idx: number) => {
          const isHistoryOpen = activeHistory === secao.categoria;
          
          return (
            <div key={idx} className="bg-surface-container border-border rounded-[var(--radius-card)] shadow-sm hover:shadow-md hover:scale-105 transform transition-all overflow-hidden flex flex-col min-w-0">
              <div className="p-6 border-b border-border bg-surface-container/10 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-foreground truncate">{secao.categoria}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{secao.fonte}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {secao.historico && (
                    <button 
                      onClick={() => setActiveHistory(isHistoryOpen ? null : secao.categoria)}
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-2"
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
                    className="text-[10px] font-bold text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors flex items-center gap-1 bg-surface-container/10 px-3 py-1.5 rounded-lg border border-border shadow-xs"
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
                      <div className="flex-1 bg-slate-50 rounded-xl border border-border p-4">
                        <div className="mb-4">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
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
                        <div className="mt-4 p-3 bg-surface-container/50 rounded-lg border border-border">
                          <p className="text-[10px] text-foreground leading-tight">
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
                      className="p-6 grid grid-cols-1 divide-y divide-slate-100 overflow-hidden"
                    >
                      {secao.indicadores.map((ind: any, i: number) => (
                        <div key={i} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between group">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">{ind.nome}</span>
                            <span className="text-[10px] text-muted-foreground italic mt-0.5 truncate">{ind.obs}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-black text-foreground block leading-tight truncate">{ind.valor}</span>
                            <span className={cn(
                              "text-[8px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded-full border mt-1 inline-block",
                              ind.status === 'Manutenção' || ind.status === 'Vigente' || ind.status === 'Estável' || ind.status === 'Sincronizado'
                                ? 'bg-surface-container text-foreground border-border'
                                : ind.status === 'Alta Demanda' || ind.status === 'Rendimento Real' || ind.status === 'Recuperação' || ind.status === 'Dentro da Meta' || ind.status === 'Redução' || ind.status === 'Atualizado'
                                ? 'bg-success-soft text-emerald-600 border-emerald-100'
                                : ind.status === 'Deflação'
                                ? 'bg-warning-soft text-amber-600 border-amber-100'
                                : 'bg-surface-container text-muted-foreground border-border'
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
              
              <div className="mt-auto p-4 bg-slate-50 border-t border-border">
                 <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                   Dados coletados e normalizados para o cenário de projeção Illumine 2026.
                 </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 bg-surface-container/60 border border-border/20 rounded-[24px] shadow-sm hover:shadow-md hover:scale-105 transform transition-all p-8 text-foreground relative overflow-hidden backdrop-blur-sm">
        <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-6 text-left md:text-left">
          <div className="flex-1 min-w-0">
            <h3 className="text-3xl font-black tracking-tight mb-4 break-words self-start text-foreground">Conectividade com o Mercado</h3>
      <p className="text-executive-secondary text-lg leading-relaxed font-light break-words self-start">
              Nossas premissas são fundamentadas nos relatórios mais recentes do mercado financeiro brasileiro, 
              garantindo que suas simulações de viabilidade e fluxo de caixa reflitam a realidade monetária e fiscal.
            </p>
          </div>
          <div className="flex flex-col gap-6 min-w-[240px] flex-1">
            <div className="p-4 bg-surface-container/10 rounded-2xl backdrop-blur-sm border border-border/20">
              <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Última Atualização</span>
              <span className="text-xl font-bold capitalize">{lastSyncDisplay}</span>
            </div>
            <div className="p-4 bg-surface-container/10 rounded-2xl backdrop-blur-sm border border-border/20">
              <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Status do Sistema</span>
              <span className="text-xl font-bold flex items-center gap-2 justify-center md:justify-start">
                <div className={cn("w-3 h-3 rounded-full", isSyncing ? "bg-amber-400 animate-spin border-2 border-white border-t-transparent" : "bg-emerald-400 animate-pulse")} />
                {isSyncing ? "Sincronizando..." : "Sincronizado"}
              </span>
            </div>
            
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className={cn(
                "p-4 rounded-2xl border transition-all cursor-pointer group/sync text-left w-full disabled:opacity-50",
                isSyncing ? "bg-primary border-primary" : "bg-primary border-primary hover:bg-primary/90"
              )}
            >
              <div className="flex items-center justify-between group min-w-0">
                <div>
         <span className="block text-[10px] font-bold text-executive-secondary uppercase tracking-widest mb-1">Sincronização Diária</span>
                  <span className="text-xs font-bold text-secondary">
                    {isSyncing ? "Buscando dados no BCB..." : "Atualizar agora"}
                  </span>
                </div>
                <div className={cn(
                  "w-10 h-5 rounded-full relative shadow-inner transition-colors",
                  isSyncing ? "bg-warning-soft0" : "bg-success-soft0"
                )}>
                  <div className={cn(
                    "absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all",
                    isSyncing ? "left-1 animate-bounce" : "right-1"
                  )} />
                </div>
              </div>
            </button>
          </div>
        </div>
        <div className="absolute -bottom-20 -right-20 text-white/5">
          <Activity size={300} />
        </div>
      </div>
    </div>
  );
}
