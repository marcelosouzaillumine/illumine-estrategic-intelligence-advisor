import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Landmark, 
  TrendingUp, 
  Activity, 
  History, 
  FileText, 
  DollarSign, 
  Users, 
  Plus, 
  X,
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { PageHeader } from '../Common';
import { cn, formatCurrency } from '../../lib/utils';

interface FiscalTributarioPageProps {
  clientId: string;
}

export function FiscalTributarioPage({ clientId }: FiscalTributarioPageProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clientData, setClientData] = useState<any>(null);

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    
    const unsub = onSnapshot(doc(db, 'clients', clientId), (snap) => {
      if (snap.exists()) {
        setClientData(snap.data());
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching client for fiscal data:", err);
      setLoading(false);
    });

    return () => unsub();
  }, [clientId]);

  const handleSave = async () => {
    if (!clientId || !clientData) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'clients', clientId), {
        ...clientData,
        updatedAt: serverTimestamp()
      });
      alert('Configurações fiscais salvas com sucesso!');
    } catch (error) {
      console.error("Error saving fiscal data:", error);
      alert('Erro ao salvar configurações fiscais.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="animate-spin text-secondary" size={32} />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Carregando dados fiscais...</p>
      </div>
    );
  }

  if (!clientId) {
    return (
      <div className="bg-slate-50 border border-slate-100 p-12 rounded-[32px] text-center space-y-4">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mx-auto shadow-sm">
          <AlertCircle size={32} />
        </div>
        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Nenhuma Empresa Selecionada</h4>
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest max-w-[250px] mx-auto">
          Selecione uma empresa no topo da página para gerenciar as configurações fiscais.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Fiscal & Tributário" 
          description={`Configurações de enquadramento, alíquotas e encargos de folha para ${clientData?.fantasia || 'a empresa'}.`}
        />
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={16} />}
          Salvar Configurações
        </button>
      </div>

      <div className="space-y-10">
        {/* 1. Regime Selector Card */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Landmark size={20} className="text-secondary" /> Enquadramento Tributário
              </h4>
              <p className="text-[11px] text-slate-400 font-medium lowercase">Defina o regime federal principal para o cálculo automático de impostos.</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {['Simples Nacional', 'Lucro Presumido', 'Lucro Real'].map(regime => (
                <button
                  key={regime}
                  onClick={() => setClientData({...clientData, regime})}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    clientData.regime === regime 
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                      : "bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100"
                  )}
                >
                  {regime}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8 border-t border-slate-100">
            {clientData.regime === 'Lucro Real' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Método de Apuração (LR)</label>
                <select 
                  value={clientData.regimeReal}
                  onChange={(e) => setClientData({...clientData, regimeReal: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-secondary/10 transition-all"
                >
                  <option value="Cumulativo">Cumulativo (654/98)</option>
                  <option value="Não Cumulativo">Não Cumulativo (10.637/10.833)</option>
                  <option value="Híbrido">Híbrido (Misto)</option>
                </select>
              </div>
            )}

            {clientData.regime === 'Lucro Presumido' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Cálculo Padrão IRPJ/CSLL</label>
                <select 
                  value={clientData.cnaePresuncao}
                  onChange={(e) => setClientData({...clientData, cnaePresuncao: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-secondary/10 transition-all"
                >
                  <option value="Venda de produtos / Mercadorias">Comércio (8% / 12%)</option>
                  <option value="Prestação de Serviços Genéricos">Serviços (32%)</option>
                  <option value="Serviços de Saúde">Saúde (8% / 12%)</option>
                  <option value="Serviços de Transporte">Transporte (16% / 32%)</option>
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Porte Declarado (Faturamento)</label>
              <input 
                type="text" 
                value={clientData.porte}
                readOnly
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-sm font-bold text-slate-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-10">
            {clientData.regime === 'Simples Nacional' ? (
              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-secondary/60"></div>
                <div className="flex items-center justify-between">
                  <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <History size={16} className="text-secondary" /> Histórico RBT12
                  </h5>
                </div>
                <div className="bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden">
                  <div className="max-h-[460px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-slate-100/90 backdrop-blur-sm z-10">
                        <tr className="border-b border-slate-200">
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Referência</th>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valor Bruto</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(clientData.historicoFaturamento || []).map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-white transition-colors group">
                            <td className="px-6 py-4">
                              <div className="text-[11px] font-black text-slate-700 uppercase">{item.mes}/{item.ano}</div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <input 
                                type="number"
                                value={item.valor}
                                onChange={(e) => {
                                  const newHist = [...clientData.historicoFaturamento];
                                  newHist[idx] = { ...newHist[idx], valor: parseFloat(e.target.value) || 0 };
                                  const newRbt12 = newHist.reduce((acc, curr) => acc + (curr.valor || 0), 0);
                                  setClientData({ ...clientData, historicoFaturamento: newHist, rbt12: newRbt12 });
                                }}
                                className="w-32 bg-transparent text-xs font-black text-slate-800 text-right outline-none border-b border-transparent focus:border-secondary transition-all py-1"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block opacity-70">Total RBT12 (Acumulado)</label>
                  <div className="text-2xl font-black text-emerald-400 font-display tracking-tight">
                    {formatCurrency(clientData.rbt12 || 0)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
                <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp size={16} className="text-primary" /> Faturamento Base
                </h5>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
                  <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest block">Receita Mensal de Referência</label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-3 text-slate-400 pr-4">
                      <DollarSign size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest">BRL</span>
                    </div>
                    <input 
                      type="number"
                      value={clientData.faturamentoMensal}
                      onChange={(e) => setClientData({...clientData, faturamentoMensal: parseFloat(e.target.value) || 0})}
                      className="w-full pl-24 pr-8 py-5 bg-white border border-slate-200 rounded-2xl text-2xl font-black text-slate-900 outline-none focus:border-primary/20 transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-10">
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
              <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <Activity size={16} className="text-primary" /> Segregação de Atividade
              </h5>
              <div className="bg-slate-50/80 p-6 rounded-[28px] border border-slate-100 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-primary shrink-0 shadow-sm">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] block">Atividade Principal</label>
                    <p className="text-[11px] font-bold text-slate-600 truncate">{clientData.cnae}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {clientData.regime === 'Simples Nacional' ? (
                    <select 
                      value={clientData.cnaeAnexo}
                      onChange={(e) => setClientData({...clientData, cnaeAnexo: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black outline-none focus:border-primary transition-all"
                    >
                      {['Anexo I - Comércio', 'Anexo II - Indústria', 'Anexo III - Serviços', 'Anexo IV - Serviços Esp.', 'Anexo V - Serviços F.R'].map((anexo, i) => (
                        <option key={i} value={`Anexo ${['I','II','III','IV','V'][i]}`}>{anexo}</option>
                      ))}
                    </select>
                  ) : clientData.regime === 'Lucro Presumido' ? (
                    <input 
                      type="text"
                      readOnly
                      value={clientData.cnaePresuncao}
                      className="w-full px-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-black text-slate-400 outline-none"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-slate-100/50 rounded-2xl text-xs font-black text-slate-500 italic">
                      Aplicado regime geral: {clientData.regimeReal}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Payroll Taxes Section */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
          <div className="space-y-1">
            <h5 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Users size={20} className="text-secondary" /> Encargos de Folha de Pagamento
            </h5>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'FGTS (%)', key: 'folhaFgts' },
              { label: 'INSS Patronal (%)', key: 'folhaInssPatronal' },
              { label: 'INSS Func. (%)', key: 'folhaInssFuncionario' },
              { label: 'Multa FGTS (%)', key: 'folhaMultaFgts' }
            ].map(item => (
              <div key={item.key} className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">{item.label}</label>
                <input 
                  type="number"
                  value={clientData[item.key]}
                  onChange={(e) => setClientData({...clientData, [item.key]: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-secondary/10 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
