
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Percent, TrendingUp, TrendingDown, ShieldCheck, Lightbulb, Target, BookOpen, 
  Database, Tag, FileText, CheckCircle2, Calculator, BarChart3, Clock, 
  AlertTriangle, Globe, Landmark, ArrowRight, Download, Info, Loader2, Trash2
} from 'lucide-react';
import { PageHeader } from '../Common';
import { cn, formatCurrency } from '../../lib/utils';
import { ExecutiveCommentary } from '../ExecutiveCommentary';
import { useAnnualFinancialData } from '../../hooks/useFinancialData';
import { db } from '../../lib/firebase';
import { query, collection, where, onSnapshot } from 'firebase/firestore';
import { 
  TaxReformDiagnosis, 
  ProductInfo,
  calculateTaxImpact, 
  getTransitionScenarios, 
  getStrategicRecommendations,
  calculateReformScores,
  getNCMInsights,
  TAX_REFORM_CONSTANTS
} from '../../lib/taxIntelligence';

// --- Components ---

function MetricCard({ title, value, subtitle, icon: Icon, colorClass, trend }: any) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-2xl", colorClass)}>
          <Icon size={20} />
        </div>
        {trend !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full",
            trend > 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
          )}>
            {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-xl font-black text-slate-900">{value}</p>
      <p className="text-[10px] text-slate-500 font-medium mt-1">{subtitle}</p>
    </div>
  );
}

function ScoreGauge({ label, score, color }: { label: string, score: number, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-black text-slate-900">{score.toFixed(0)}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-1000", color)} 
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function ScenarioButton({ scenario, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-start p-4 rounded-2xl border-2 transition-all text-left",
        active 
          ? "border-primary bg-primary/5 shadow-md" 
          : "border-slate-100 bg-white hover:border-slate-200"
      )}
    >
      <span className={cn(
        "text-[10px] font-black uppercase tracking-widest mb-1",
        active ? "text-primary" : "text-slate-400"
      )}>{scenario.year}</span>
      <span className="text-xs font-black text-slate-900">{scenario.name}</span>
    </button>
  );
}

function TimelineItem({ year, event, desc, active }: any) {
  return (
    <div className="relative pl-12 pb-8 border-l-2 border-slate-100 last:border-0 ml-4">
      <div className={cn(
        "absolute -left-[17px] w-8 h-8 rounded-xl border-4 border-white flex items-center justify-center text-[10px] font-black z-10",
        active ? "bg-secondary text-white shadow-lg shadow-secondary/20" : "bg-slate-200 text-slate-500"
      )}>
        {year.substring(0, 4)}
      </div>
      <div>
        <h4 className="text-sm font-black text-slate-900">{event}</h4>
        <p className="text-xs text-slate-500 font-medium">{desc}</p>
      </div>
    </div>
  );
}

// --- Main Page ---


export function TaxReformImpactPage({ clientId, selectedYear }: any) {
  const [activeTab, setActiveTab] = useState('diagnosis');
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [diagnosis, setDiagnosis] = useState<TaxReformDiagnosis>({
    regimeTributario: 'Lucro Real',
    faturamentoMensal: 0,
    faturamentoAnual: 0,
    margemLiquida: 0,
    margemEBITDA: 0,
    folhaPercentual: 0,
    percentualServicos: 0,
    percentualProdutos: 0,
    percentualIndustria: 0,
    percentualComercio: 0,
    percentualExportacao: 0,
    percentualInterestadual: 0,
    creditosAtuais: 0,
    beneficiosFiscais: false,
    aliquotaEfetivaAtual: 0, 
    cargaTributariaEfetiva: 0,
    dependenciaCreditoFiscal: 'Média',
    setorEconomico: '',
    produtos: []
  });

  const [newProduct, setNewProduct] = useState<Partial<ProductInfo>>({
    descricao: '',
    ncm: '',
    valorMensal: 0,
    tipo: 'Produto'
  });

  const { dbData: dreData, loading: loadingDRE } = useAnnualFinancialData(clientId, selectedYear || new Date().getFullYear(), 'DRE');

  const hasData = useMemo(() => {
    return (diagnosis.faturamentoAnual > 0) || (diagnosis.produtos && diagnosis.produtos.length > 0);
  }, [diagnosis.faturamentoAnual, diagnosis.produtos]);

  // Fetch products from precificacao
  useEffect(() => {
    if (!clientId) return;
    setLoadingProducts(true);
    const q = query(collection(db, 'precificacao'), where('clientId', '==', clientId));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbProducts = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          descricao: data.nome,
          ncm: data.ncm || '0000.00.00',
          valorMensal: (data.precoVenda || 0) * 10, // Simulated monthly volume
          tipo: 'Produto'
        } as ProductInfo;
      });
      
      setDiagnosis(prev => ({ ...prev, produtos: dbProducts }));
      setLoadingProducts(false);
    });

    return () => unsubscribe();
  }, [clientId]);

  useEffect(() => {
    if (dreData && dreData.length > 0) {
      const getValue = (name: string) => {
        const search = name.toLowerCase();
        return dreData.filter(d => (d.conta || d.category || '').toLowerCase().includes(search)).reduce((acc, d) => acc + (d.val || d.valor || 0), 0);
      };

      const rb = getValue('receita operacional bruta') || getValue('faturamento');
      const ebitda = getValue('ebitda');
      const lucro = getValue('lucro líquido');

      if (rb > 0) {
        setDiagnosis(prev => ({
          ...prev,
          faturamentoMensal: rb / 12,
          faturamentoAnual: rb,
          margemEBITDA: ebitda / rb,
          margemLiquida: lucro / rb,
        }));
      }
    }
  }, [dreData]);

  const scenarios = getTransitionScenarios();
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0]);
  const metrics = useMemo(() => calculateTaxImpact(diagnosis, selectedScenario), [diagnosis, selectedScenario]);
  const recommendations = useMemo(() => getStrategicRecommendations(diagnosis, metrics), [diagnosis, metrics]);
  const scores = useMemo(() => calculateReformScores(diagnosis, metrics), [diagnosis, metrics]);
  const ncmInsights = useMemo(() => getNCMInsights(diagnosis.produtos || []), [diagnosis.produtos]);

  const addProduct = () => {
    if (newProduct.descricao && newProduct.valorMensal) {
      setDiagnosis(prev => ({
        ...prev,
        produtos: [...(prev.produtos || []), { ...newProduct, id: Math.random().toString(36).substr(2, 9) } as ProductInfo]
      }));
      setNewProduct({ descricao: '', ncm: '', valorMensal: 0, tipo: 'Produto' });
    }
  };

  const removeProduct = (id: string) => {
    setDiagnosis(prev => ({
      ...prev,
      produtos: (prev.produtos || []).filter(p => p.id !== id)
    }));
  };

  const tabs = [
    { id: 'diagnosis', label: '1. Diagnóstico & NCM', icon: Calculator },
    { id: 'simulation', label: '2. Simulação & Transição', icon: BarChart3 },
    { id: 'regulatory', label: '3. Inteligência Regulatória', icon: Landmark },
    { id: 'reports', label: '4. Relatórios Estratégicos', icon: FileText },
  ];

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      <PageHeader 
        title="Simulador de Impacto Tributário" 
        subtitle="Análise estratégica e projeção de transição para o novo modelo tributário (CBS/IBS)." 
        icon={Calculator}
        color="bg-slate-900"
      />

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 -mb-[2px]",
              activeTab === tab.id 
                ? "border-primary text-primary bg-primary/5 rounded-t-2xl" 
                : "border-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-8">
          
          {activeTab === 'diagnosis' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                      <Calculator size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-extrabold text-slate-900">Configuração do Diagnóstico</h3>
                      <p className="text-xs text-slate-500 font-medium">Parâmetros operacionais e financeiros reais (DRE sincronizada).</p>
                    </div>
                  </div>
                  {loadingDRE && (
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                      <Loader2 size={14} className="animate-spin" />
                      Sincronizando...
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-12">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Regime Tributário Atual</label>
                      <select 
                        value={diagnosis.regimeTributario}
                        onChange={(e) => setDiagnosis({...diagnosis, regimeTributario: e.target.value as any})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                      >
                        <option value="Lucro Real">Lucro Real</option>
                        <option value="Lucro Presumido">Lucro Presumido</option>
                        <option value="Simples">Simples Nacional</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Faturamento Mensal (R$)</label>
                      <input 
                        type="number"
                        value={diagnosis.faturamentoMensal}
                        onChange={(e) => setDiagnosis({...diagnosis, faturamentoMensal: Number(e.target.value)})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Margem EBITDA (%)</label>
                      <input 
                        type="number"
                        value={(diagnosis.margemEBITDA * 100).toFixed(1)}
                        onChange={(e) => setDiagnosis({...diagnosis, margemEBITDA: Number(e.target.value) / 100})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Alíquota Efetiva Atual (%)</label>
                      <input 
                        type="number"
                        value={(diagnosis.aliquotaEfetivaAtual * 100).toFixed(2)}
                        onChange={(e) => setDiagnosis({...diagnosis, aliquotaEfetivaAtual: Number(e.target.value) / 100})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* NCM & Product Mapping Section */}
                <div className="border-t border-slate-100 pt-10">
                  <div className="flex items-center gap-3 mb-8">
                    <Tag size={20} className="text-secondary" />
                    <h4 className="text-lg font-display font-extrabold text-slate-900">Mapeamento de Produtos e NCM</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                    <div className="md:col-span-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase mb-2 block">Descrição</label>
                      <input 
                        placeholder="Ex: Notebook XPS"
                        value={newProduct.descricao}
                        onChange={e => setNewProduct({...newProduct, descricao: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase mb-2 block">NCM</label>
                      <input 
                        placeholder="0000.00.00"
                        value={newProduct.ncm}
                        onChange={e => setNewProduct({...newProduct, ncm: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase mb-2 block">Valor Mensal (R$)</label>
                      <input 
                        type="number"
                        value={newProduct.valorMensal || ''}
                        onChange={e => setNewProduct({...newProduct, valorMensal: Number(e.target.value)})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex items-end">
                      <button 
                        onClick={addProduct}
                        className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {(diagnosis.produtos || []).map(p => (
                      <div key={p.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all">
                        <div className="flex items-center gap-6">
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase">Descrição</p>
                            <p className="text-sm font-bold text-slate-900">{p.descricao}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase">NCM</p>
                            <p className="text-xs font-mono font-bold text-slate-600">{p.ncm || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase">Faturamento</p>
                            <p className="text-xs font-bold text-slate-900">{formatCurrency(p.valorMensal)}</p>
                          </div>
                        </div>
                        <button onClick={() => removeProduct(p.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* NCM Insights Section */}
              {hasData && ncmInsights.length > 0 && (
                <div className="bg-amber-50 rounded-[40px] border border-amber-100 p-10 shadow-sm">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-white text-amber-600 rounded-2xl flex items-center justify-center shadow-sm">
                      <Lightbulb size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-extrabold text-amber-900">NCM Insights: Oportunidades & Riscos</h3>
                      <p className="text-xs text-amber-700 font-medium">Análise automática de enquadramento tributário para otimização do IVA.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ncmInsights.map((insight, idx) => (
                      <div key={idx} className="bg-white rounded-3xl p-6 border border-amber-200/50 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[9px] font-black bg-amber-100 text-amber-700 px-3 py-1 rounded-full uppercase">Sugestão NCM</span>
                          <span className="text-sm font-black text-emerald-600">{insight.potencialEconomia}</span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 mb-1">{insight.descricao}</h4>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-xs font-mono text-slate-400 line-through">{insight.ncmOriginal}</span>
                          <ArrowRight size={14} className="text-slate-400" />
                          <span className="text-xs font-mono font-bold text-primary">{insight.ncmSugerida}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl">
                          <p className="text-[10px] text-slate-600 font-medium leading-relaxed italic">"{insight.motivo}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </div>
            )}

            {activeTab === 'simulation' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              {!hasData ? (
                <div className="bg-white rounded-[40px] border border-slate-200 p-20 shadow-sm text-center">
                  <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                    <BarChart3 size={32} />
                  </div>
                  <h3 className="text-xl font-display font-extrabold text-slate-900 mb-2">Simulação Indisponível</h3>
                  <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto">
                    Insira o faturamento ou cadastre produtos no primeiro passo para desbloquear o Laboratório de Cenários.
                  </p>
                  <button 
                    onClick={() => setActiveTab('diagnosis')}
                    className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all"
                  >
                    Configurar Diagnóstico
                  </button>
                </div>
              ) : (
                <>
                  {/* Scenario Selector */}
                  <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-lg font-display font-extrabold text-slate-900">Laboratório de Cenários</h3>
                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase">
                        <Clock size={14} />
                        Linha do Tempo Oficial
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {scenarios.map(s => (
                        <ScenarioButton 
                          key={s.year} 
                          scenario={s} 
                          active={selectedScenario.year === s.year}
                          onClick={() => setSelectedScenario(s)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Simulation Results */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MetricCard 
                      title="Carga Tributária Total"
                      value={formatCurrency(metrics.futureTaxTotal)}
                      subtitle={`Vs. ${formatCurrency(metrics.currentTaxTotal)} atual`}
                      icon={Percent}
                      colorClass="bg-blue-50 text-blue-600"
                      trend={metrics.deltaPercentage}
                    />
                    <MetricCard 
                      title="Impacto no EBITDA"
                      value={formatCurrency(metrics.impactOnEBITDA)}
                      subtitle="Redução direta na margem"
                      icon={BarChart3}
                      colorClass="bg-rose-50 text-rose-600"
                    />
                    <MetricCard 
                      title="Necessidade de Capital"
                      value={formatCurrency(metrics.splitPaymentImpact)}
                      subtitle="Efeito Split Payment no caixa"
                      icon={ArrowRight}
                      colorClass="bg-amber-50 text-amber-600"
                    />
                  </div>

                  {/* Comparison Chart Mockup */}
                  <div className="bg-slate-900 rounded-[40px] p-10 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-10 opacity-10">
                      <Globe size={200} />
                    </div>
                    <div className="relative z-10">
                      <h4 className="text-xl font-display font-extrabold mb-8 flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                          <TrendingUp size={20} className="text-secondary" />
                        </div>
                        Projeção de Fluxo de Caixa Tributário
                      </h4>
                      
                      <div className="h-64 flex items-end gap-4 mb-6">
                        {scenarios.map((s, i) => {
                          const scenarioMetrics = calculateTaxImpact(diagnosis, s);
                          // Calculate relative height based on total tax vs current
                          // We'll use 100% for the highest value in the transition
                          const maxImpact = Math.max(...scenarios.map(sc => calculateTaxImpact(diagnosis, sc).futureTaxTotal));
                          const height = maxImpact > 0 ? (scenarioMetrics.futureTaxTotal / maxImpact) * 100 : 0;
                          
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-4">
                              <div className="w-full relative group">
                                <div 
                                  className={cn(
                                    "w-full rounded-t-xl transition-all duration-1000",
                                    s.year === selectedScenario.year ? "bg-secondary shadow-[0_0_30px_rgba(255,133,82,0.4)]" : "bg-white/20"
                                  )} 
                                  style={{ height: `${height}%` }}
                                >
                                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-white text-slate-900 text-[10px] font-black px-2 py-1 rounded shadow-xl">
                                    {formatCurrency(scenarioMetrics.futureTaxTotal)}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[10px] font-black text-slate-500">{s.year}</span>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-white/10 pt-8">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Ganhos de Eficiência (Créditos)</p>
                          <div className="flex items-center gap-4">
                            <div className="text-3xl font-black text-emerald-400">+{formatCurrency(metrics.creditGain)}</div>
                            <div className="text-[10px] text-slate-400 leading-tight">Potencial de aproveitamento de créditos em toda a cadeia operacional.</div>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Exposição ao Imposto Seletivo</p>
                          <div className="flex items-center gap-4">
                            <div className="text-3xl font-black text-rose-400">{selectedScenario.isRate > 0 ? "ALTA" : "BAIXA"}</div>
                            <div className="text-[10px] text-slate-400 leading-tight">Risco de incidência sobre insumos específicos (extração, açúcar, etc).</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'regulatory' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                      <Landmark size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-extrabold text-slate-900">Central de Atualizações</h3>
                      <p className="text-xs text-slate-500 font-medium">Acompanhamento regulatório em tempo real via IA Illumine.</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase">
                    Configurar Alertas
                  </button>
                </div>

                <div className="space-y-6">
                  {[
                    { date: '12 Mai 2026', title: 'Regulamentação do Split Payment', source: 'Receita Federal', impact: 'Impacto direto no fluxo de caixa operacional.' },
                    { date: '08 Mai 2026', title: 'Novas Alíquotas de Referência CBS/IBS', source: 'Comitê Gestor', impact: 'Ajuste na projeção de carga para setor de serviços.' },
                    { date: '05 Mai 2026', title: 'Critérios de Não-Cumulatividade Plena', source: 'Congresso Nacional', impact: 'Expansão da base de créditos sobre bens de consumo.' },
                  ].map((update, idx) => (
                    <div key={idx} className="group p-6 rounded-3xl border border-slate-100 hover:border-primary/20 hover:bg-primary/5 transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{update.date} • {update.source}</span>
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                          <ArrowRight size={12} />
                        </div>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 mb-2">{update.title}</h4>
                      <p className="text-xs text-slate-500 font-medium">{update.impact}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-[40px] p-10 border border-slate-100">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Cronograma de Transição Federativa</h4>
                <div className="max-w-xl">
                  <TimelineItem year="2026" event="Início CBS (0,9%) e IBS (0,1%)" desc="Período de teste com compensação total." active />
                  <TimelineItem year="2027" event="Extinção de PIS e COFINS" desc="Vigência plena da CBS (Contribuição sobre Bens e Serviços)." />
                  <TimelineItem year="2029" event="Transição do ICMS e ISS" desc="Redução progressiva de 1/10 ao ano até 2032." />
                  <TimelineItem year="2033" event="Unificação Plena (IVA Dual)" desc="Extinção total dos tributos antigos." />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm text-center">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-[32px] flex items-center justify-center mx-auto mb-6">
                  <FileText size={32} />
                </div>
                <h3 className="text-2xl font-display font-extrabold text-slate-900 mb-4">Central de Relatórios Executivos</h3>
                <p className="text-sm text-slate-500 font-medium max-w-md mx-auto mb-10">
                  Gere visões estratégicas completas para o Board e CFO, com projeções de 10 anos e análise de sensibilidade.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <button 
                    disabled={!hasData}
                    className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-primary transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-3 bg-white rounded-2xl shadow-sm">
                        <BarChart3 size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 block">Relatório de Impacto</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">PDF • 12 Páginas</span>
                      </div>
                    </div>
                    <Download size={20} className="text-slate-300 group-hover:text-primary transition-all" />
                  </button>
                  <button 
                    disabled={!hasData}
                    className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-primary transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-3 bg-white rounded-2xl shadow-sm">
                        <Database size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 block">DRE Projetada (Transition)</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">XLSX • Full Model</span>
                      </div>
                    </div>
                    <Download size={20} className="text-slate-300 group-hover:text-primary transition-all" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Sidebar: Intelligence & Recommendations */}
        <div className="space-y-8">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl border bg-blue-50 text-blue-600 border-blue-100">
              <ShieldCheck size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xl font-display font-extrabold text-slate-900 tracking-tight leading-none mb-1">Tax Intelligence</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Parecer CFO Advisory</p>
            </div>
          </div>
          
          <div className="bg-white border-2 border-primary rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Target size={120} />
            </div>
            <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Lightbulb size={16} className="text-secondary" />
              Diretrizes de Transição
            </h4>
            
            <div className="space-y-6 mb-8 mt-4">
              {hasData ? (
                recommendations.map((rec, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="text-[11px] font-black text-slate-900 uppercase">{rec.title}</h5>
                      <span className={cn(
                        "text-[8px] font-black px-2 py-0.5 rounded-full",
                        rec.urgency === 'Crítica' ? "bg-rose-500 text-white" : "bg-primary text-white"
                      )}>{rec.urgency}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{rec.desc}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                   <p className="text-[9px] font-black uppercase tracking-widest">Aguardando dados para análise estratégica</p>
                </div>
              )}
              {hasData && recommendations.length === 0 && (
                <p className="text-[10px] text-slate-400 italic">Nenhuma recomendação crítica para este cenário.</p>
              )}
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-100">
              <ScoreGauge label="Score de Impacto" score={hasData ? scores.impact : 0} color="bg-rose-500" />
              <ScoreGauge label="Vulnerabilidade Setorial" score={hasData ? scores.vulnerability : 0} color="bg-amber-500" />
              <ScoreGauge label="Maturidade Fiscal" score={hasData ? scores.maturity : 0} color="bg-emerald-500" />
            </div>
          </div>

          <ExecutiveCommentary 
            reportType="TAX_REFORM"
            clientId={clientId}
            year={2026}
            month={3}
          />
        </div>
      </div>
    </div>
  );
}
