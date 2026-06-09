
import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutGrid, 
  Activity, 
  FileText, 
  Coins, 
  BookOpen, 
  Settings2, 
  AlertTriangle,
  ShieldCheck,
  Upload,
  Plus,
  TrendingUp,
  LayoutDashboard,
  Presentation,
  Scale,
  Compass,
  Fingerprint,
  Target,
  Globe,
  ClipboardList,
  BarChart3,
  PieChart,
  Zap,
  Briefcase,
  Calculator,
  CreditCard,
  ArrowUpRight,
  CircleDollarSign,
  List,
  Landmark,
  Boxes,
  Rocket,
  LineChart,
  Percent,
  ShoppingBag,
  HardDrive,
  Layers,
  Bell,
  Users,
  Trash2,
  Save,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { collection, query, where, getDocs, orderBy, addDoc, updateDoc, doc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, AreaChart, Area } from 'recharts';
import { PageHeader } from '../Common';
import { cn, formatCurrency } from '../../lib/utils';
import { useAllFinancialData } from '../../hooks/useFinancialData';
import { DashboardSkeleton } from '../ui/skeletons';
import { PremissasClientePage } from './PremissasClientePage';

function KpiCardModeling({ label, value, tone = 'default', helper }: any) {
  return (
    <div className="bg-card p-6 rounded-3xl border border-border/60 shadow-sm hover:shadow-md transition-all group">
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] mb-2 group-hover:text-muted-foreground transition-colors whitespace-nowrap overflow-hidden text-ellipsis">{label}</p>
      <h3 className={cn(
        "text-2xl font-black tracking-tight leading-[1.2] whitespace-nowrap",
        tone === 'danger' ? "text-rose-600" : tone === 'success' ? "text-emerald-600" : "text-card-foreground"
      )}>{value}</h3>
      {helper && <p className="text-[10px] text-muted-foreground mt-2 font-medium italic opacity-80">{helper}</p>}
    </div>
  );
}

function FinancialModelTable({ table, title, subtitle }: { table: any, title: string, subtitle?: string }) {
  const headers = table.headers.map((h: any, i: number) => `Ano ${h || i + 1}`);

  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
      <div className="p-8 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-card-foreground">{title}</h2>
          {subtitle && <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest mt-1">{subtitle}</p>}
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
            <tr className="bg-surface-high/50 sticky top-0 z-20">
              <th className="px-5 md:px-8 py-2.5 md:py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border sticky left-0 top-0 bg-surface-high shadow-[2px_0_5px_rgba(0,0,0,0.05)] z-30">Indicador</th>
              {headers.map((h: any) => (
                <th key={h} className="px-5 md:px-8 py-2.5 md:py-4 text-right text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border whitespace-nowrap bg-surface-high">
                  <div className="flex flex-col items-end">
                    <span>{h}</span>
                    <span className="hidden md:inline text-[8px] opacity-40 font-bold">Projeção</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {table.rows.map((row: any) => (
              <tr key={row.item} className="hover:bg-surface-high/50 transition-colors group">
                <td className="px-5 md:px-8 py-2.5 md:py-4 text-xs font-bold text-muted-foreground sticky left-0 bg-card group-hover:bg-surface-high shadow-[2px_0_5px_rgba(0,0,0,0.05)] z-10">{row.item}</td>
                {row.values.map((v: any, i: number) => {
                  const isNumeric = typeof v === 'number' && Number.isFinite(v);
                  const isInvalid = !isNumeric;

                  return (
                    <td key={i} className={cn(
                      "px-5 md:px-8 py-2.5 md:py-4 text-xs font-black text-right transition-all",
                      isNumeric && v < 0 ? "text-rose-500" : "text-card-foreground",
                      isInvalid ? "bg-rose-50/50" : ""
                    )}>
                      <div className="flex items-center justify-end gap-1.5">
                        {isInvalid && (
                          <AlertTriangle size={12} className="text-rose-400 shrink-0" />
                        )}
                        <span>
                          {isNumeric ? formatCurrency(v) : (v ?? "-")}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InputsDataEntryView({ selectedClient }: { selectedClient: string }) {
  const [inputs, setInputs] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!selectedClient) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const qInputs = query(collection(db, 'modeling_inputs'), where('clientId', '==', selectedClient));
        const snapInputs = await getDocs(qInputs);
        setInputs(snapInputs.docs.map(doc => ({ id: doc.id, ...doc.data() as any })));

        const qAccounts = query(collection(db, 'account_plans'), where('clientId', '==', selectedClient), orderBy('code', 'asc'));
        const snapAccounts = await getDocs(qAccounts);
        const allAccounts = snapAccounts.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        const managerial = allAccounts.filter(a => a.planType === 'managerial');
        setAccounts(managerial.length > 0 ? managerial : allAccounts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedClient]);

  const handleAddRow = () => {
    setInputs([...inputs, { _isNew: true, id: Date.now().toString(), tipo: 'Capex', descricao: '', accountId: '', valorInicial: 0 }]);
  };

  const handleSave = async () => {
    if (!selectedClient) return;
    setSaving(true);
    try {
      for (const item of inputs) {
        const payload = {
          clientId: selectedClient,
          tipo: item.tipo,
          descricao: item.descricao,
          accountId: item.accountId,
          valorInicial: item.valorInicial,
          updatedAt: serverTimestamp()
        };
        if (item._isNew) {
          const docRef = await addDoc(collection(db, 'modeling_inputs'), payload);
          item.id = docRef.id;
          delete item._isNew;
        } else {
          await updateDoc(doc(db, 'modeling_inputs', item.id), payload);
        }
      }
      setInputs([...inputs]);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'modeling_inputs');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, index: number) => {
    const item = inputs[index];
    if (!item._isNew) {
      await deleteDoc(doc(db, 'modeling_inputs', id));
    }
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  };

  const updateInput = (index: number, field: string, value: any) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8">
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-8 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-card-foreground">Entrada de Dados (Inputs)</h2>
            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Lançamento de Capex, Receitas e Despesas vinculadas ao plano de contas contábil</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAddRow} className="px-4 md:px-6 py-1.5 md:py-2 bg-secondary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-md shadow-secondary/20 flex items-center gap-2">
              <Plus size={14} /> NOVO LANÇAMENTO
            </button>
            <button onClick={handleSave} disabled={saving} className="px-4 md:px-6 py-1.5 md:py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 disabled:opacity-50">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} SALVAR
            </button>
          </div>
        </div>
        
        {inputs.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center bg-surface-high">
            <div className="w-16 h-16 bg-card rounded-2xl shadow-sm flex items-center justify-center mb-4 text-muted-foreground">
              <Layers size={32} />
            </div>
            <h3 className="text-sm font-bold text-card-foreground mb-2">Nenhum input manual cadastrado</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Adicione valores projetados para Capex, Receitas ou Despesas que complementarão o modelo estrutural.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-high">
                  <th className="px-5 md:px-8 py-2.5 md:py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">Tipo</th>
                  <th className="px-5 md:px-8 py-2.5 md:py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">Descrição</th>
                  <th className="px-5 md:px-8 py-2.5 md:py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">Plano de Contas</th>
                  <th className="px-5 md:px-8 py-2.5 md:py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border text-right">Valor Inicial</th>
                  <th className="px-5 md:px-8 py-2.5 md:py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {inputs.map((item, index) => (
                  <tr key={item.id} className="hover:bg-surface-high/50 transition-colors">
                    <td className="px-5 md:px-8 py-2.5 md:py-4">
                      <select 
                        value={item.tipo} 
                        onChange={(e) => updateInput(index, 'tipo', e.target.value)}
                        className="text-sm font-bold text-card-foreground bg-card px-3 py-2 rounded-xl border border-border outline-none w-full"
                      >
                        <option value="Capex">Capex</option>
                        <option value="Receita">Receita</option>
                        <option value="Despesa">Despesa</option>
                      </select>
                    </td>
                    <td className="px-5 md:px-8 py-2.5 md:py-4">
                      <input 
                        type="text" 
                        value={item.descricao} 
                        onChange={(e) => updateInput(index, 'descricao', e.target.value)}
                        placeholder="Ex: Aquisição de Máquinas"
                        className="text-sm font-medium text-card-foreground bg-card px-3 py-2 rounded-xl border border-border outline-none w-full"
                      />
                    </td>
                    <td className="px-5 md:px-8 py-2.5 md:py-4">
                      <select 
                        value={item.accountId || ''} 
                        onChange={(e) => updateInput(index, 'accountId', e.target.value)}
                        className="text-sm font-bold text-card-foreground bg-card px-3 py-2 rounded-xl border border-border outline-none w-full"
                      >
                        <option value="">Selecione uma conta...</option>
                        {accounts.map(acc => (
                          <option key={acc.id || acc.code} value={acc.id || acc.code}>
                            {"\u00A0".repeat(((acc.level || 1) - 1) * 3)}{acc.code} - {acc.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 md:px-8 py-2.5 md:py-4 text-right">
                      <input 
                        type="number" 
                        value={item.valorInicial} 
                        onChange={(e) => updateInput(index, 'valorInicial', parseFloat(e.target.value) || 0)}
                        className="text-sm font-black text-card-foreground bg-card px-3 py-2 rounded-xl border border-border outline-none w-32 text-right"
                      />
                    </td>
                    <td className="px-5 md:px-8 py-2.5 md:py-4 text-right">
                      <button onClick={() => handleDelete(item.id, index)} className="p-2 text-muted-foreground hover:text-rose-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ConfiguracaoProjecaoEstrutural({ hasData }: { hasData: boolean }) {
  return (
    <div className="space-y-8">
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-8 border-b border-border">
          <h2 className="text-lg font-black text-card-foreground">Configuração de Projeção (Estrutural)</h2>
          <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Parâmetros base para o horizonte de 5 Anos.</p>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-4">Econômico</span>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-muted-foreground">IPCA (Inflação Meta)</span>
                <span className="font-black text-blue-600">3.85% a.a.</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-muted-foreground">Taxa Selic Target</span>
                <span className="font-black text-blue-600">14.65% a.a.</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-muted-foreground">PIB Projetado 2026</span>
                <span className="font-black text-blue-600">2.1%</span>
              </div>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-4">Operacional Cliente</span>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-muted-foreground">Growth Target (Market)</span>
                <span className="font-black text-emerald-600">{hasData ? "12.00%" : "---"}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-muted-foreground">Escalabilidade Custos</span>
                <span className="font-black text-emerald-600">{hasData ? "45% da Receita" : "---"}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-muted-foreground">Depreciação Média</span>
                <span className="font-black text-emerald-600">{hasData ? "10.00% a.a." : "---"}</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-high p-6 rounded-2xl border border-border flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="text-blue-600" size={20} />
              <h4 className="text-sm font-black text-card-foreground uppercase italic">Conformidade Fiscal</h4>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
              O modelo utiliza as regras de apuração do Lucro Real e Presumido conforme o regime tributário vinculado ao cadastro do cliente para cálculo de IR/CSLL.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-8 border-b border-border">
          <h2 className="text-lg font-black text-card-foreground">Dicionário de Variáveis de Projeção</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-high/50">
                <th className="px-5 md:px-8 py-2.5 md:py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">Indicador</th>
                <th className="px-5 md:px-8 py-2.5 md:py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">Descrição Técnica</th>
                <th className="px-5 md:px-8 py-2.5 md:py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border italic">Impacto no Modelo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {[
                { i: "FCFF", d: "Free Cash Flow to the Firm", m: "Capacidade líquida de pagamento de dívida e dividendos." },
                { i: "EBITDA Margin", d: "Margem operacional antes de impostos e despesas financeiras", m: "Principal métrica de eficiência core da operação." },
                { i: "NCG Variation", d: "Necessidade de Capital de Giro", m: "Consumo de caixa gerado pelo prazo médio de recebimento e estoques." },
                { i: "Capex Plan", d: "Capital Expenditure", m: "Investimentos em ativos fixos necessários para suportar o crescimento." }
              ].map((item, idx) => (
                <tr key={idx} className="hover:bg-surface-high/50 transition-colors">
                  <td className="px-5 md:px-8 py-2.5 md:py-4 text-xs font-black text-card-foreground">{item.i}</td>
                  <td className="px-5 md:px-8 py-2.5 md:py-4 text-xs font-medium text-muted-foreground">{item.d}</td>
                  <td className="px-5 md:px-8 py-2.5 md:py-4 text-xs font-bold text-blue-600 italic">{item.m}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function FinancialModelingPage({ clients, selectedClient, setSelectedClient }: { clients: any[], selectedClient: string, setSelectedClient: (id: string) => void }) {
  const [tab, setTab] = useState("configuracao");
  const { dbData } = useAllFinancialData(selectedClient);
  const hasData = dbData && dbData.length > 0;
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModeling, setEditingModeling] = useState<any>(null);
  
  // Base Data Selection
  const activeClient = useMemo(() => 
    clients.find(c => c.id === selectedClient) || clients[0]
  , [clients, selectedClient]);

  const clientName = activeClient?.fantasia || activeClient?.name || 'Cliente';

  // Projection Engine (Delegated to Runtime)
  const projection = useMemo(() => {
    const years = [2026, 2027, 2028, 2029, 2030];

    const dreGerencialRows: any[] = [
      { item: "Receita Bruta", values: [0,0,0,0,0] },
      { item: "Custos Variáveis", values: [0,0,0,0,0] },
      { item: "Margem de Contribuição", values: [0,0,0,0,0] },
      { item: "Despesas Fixas", values: [0,0,0,0,0] },
      { item: "EBITDA Gerencial", values: [0,0,0,0,0] },
    ];

    const dreContabilRows: any[] = [
      { item: "Receita Líquida", values: [0,0,0,0,0] },
      { item: "Lucro Bruto", values: [0,0,0,0,0] },
      { item: "EBIT", values: [0,0,0,0,0] },
      { item: "Impostos (IRPJ/CSLL)", values: [0,0,0,0,0] },
      { item: "Lucro Líquido", values: [0,0,0,0,0] },
    ];

    const fluxoCaixaRows: any[] = [
      { item: "EBITDA", values: [0,0,0,0,0] },
      { item: "(-) Capex", values: [0,0,0,0,0] },
      { item: "(-) Variação NCG", values: [0,0,0,0,0] },
      { item: "(+) Amortização", values: [0,0,0,0,0] },
      { item: "Fluxo de Caixa Livre (FCFF)", values: [0,0,0,0,0] },
    ];

    const balancoRows: any[] = [
      { item: "Ativo Circulante", values: [0,0,0,0,0] },
      { item: "Ativo Não Circulante", values: [0,0,0,0,0] },
      { item: "Patrimônio Líquido", values: [0,0,0,0,0] },
      { item: "Passivo Oneroso", values: [0,0,0,0,0] },
    ];

    return { 
      years, 
      dreGerencial: { headers: years, rows: dreGerencialRows }, 
      dreContabil: { headers: years, rows: dreContabilRows },
      fluxoCaixa: { headers: years, rows: fluxoCaixaRows },
      balanco: { headers: years, rows: balancoRows }
    };
  }, [activeClient, selectedClient, dbData]);

  const tabs = [
    { id: 'configuracao', label: 'Configuração da Projeção', icon: Settings2 },
    { id: 'premissas', label: 'Premissas do Cliente', icon: ShieldCheck },
    { id: 'inputs', label: 'Inputs', icon: Layers },
    { id: 'dreGerencial', label: 'DRE Gerencial', icon: Activity },
    { id: 'caixa', label: 'Fluxo de Caixa', icon: Coins },
    { id: 'balanco', label: 'Balanço Patrimonial', icon: BookOpen },
    { id: 'dreContabil', label: 'DRE Contábil', icon: FileText },
  ];

  return (
    <div className="space-y-10 pb-20 animate-executive-fade">
      <PageHeader 
        title="Engenharia Financeira" 
        subtitle={`Projeção estratégica de cenários, sensibilidade e projetos de inovação · ${clientName}`}
        icon={<TrendingUp className="text-secondary" size={24} />}
        color="bg-primary"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface/60 p-4 rounded-3xl border border-border/60 backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 md:px-6 py-2 md:py-2.5 bg-card border border-border text-muted-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-surface-high transition-all flex items-center gap-2"
          >
            <Upload size={14} /> IMPORTAR DADOS
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setEditingModeling(null); setIsModalOpen(true); }}
            className="px-8 py-2.5 bg-secondary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl hover:shadow-secondary/20 transition-all shadow-lg shadow-secondary/10 flex items-center gap-2"
          >
            <Plus size={16} /> NOVO CENÁRIO
          </button>
        </div>
      </div>


      <div className="flex bg-surface-high p-1 rounded-xl w-fit overflow-x-auto max-w-full">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all whitespace-nowrap",
                tab === t.id 
                  ? "bg-card text-blue-600 shadow-sm" 
                  : "text-muted-foreground hover:text-card-foreground hover:bg-surface-low/50"
              )}
            >
              {(() => {
                const Icon = t.icon;
                return <Icon size={13} />;
              })()}
            </button>
          ))}
        </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'configuracao' && (
             <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <KpiCardModeling label="Status do Módulo" value={"Em Migração"} helper="Aguardando Runtime Engine" tone="default" />
                  <KpiCardModeling label="Geração de Caixa" value={"---"} helper="FCF Total Projected" tone="default" />
                  <KpiCardModeling label="Tax Efficiency" value={hasData ? activeClient?.regime : '---'} helper={hasData ? `Baseado em ${activeClient?.regime}` : 'Aguardando Dados'} />
                  <KpiCardModeling label="Proj. Debt Score" value={"---"} helper="EBITDA / Dívida Ano 5" tone="default" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-card p-8 rounded-3xl border border-border">
                    <h3 className="text-sm font-bold text-card-foreground mb-2">Escalabilidade de Receita</h3>
                    <p className="text-[11px] text-muted-foreground font-bold mb-8 uppercase tracking-widest">PROJEÇÃO ANUAL (5 ANOS)</p>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={projection.dreGerencial.rows[0].values.map((v: any, i: number) => ({ year: projection.years[i], value: v }))}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} tickFormatter={(v) => `R$${(v/1000000).toFixed(1)}M`} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            formatter={(v: any) => [formatCurrency(v), 'Receita Bruta']}
                          />
                          <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-card p-8 rounded-3xl border border-border">
                    <h3 className="text-sm font-bold text-card-foreground mb-2">Fluxo de Caixa Livre (FCFF)</h3>
                    <p className="text-[11px] text-muted-foreground font-bold mb-8 uppercase tracking-widest">CAPACIDADE DE DISTRIBUIÇÃO</p>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={projection.fluxoCaixa.rows[4].values.map((v: any, i: number) => ({ year: projection.years[i], fcff: v }))}>
                          <defs>
                            <linearGradient id="colorFcff" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            formatter={(v: any) => [formatCurrency(v), 'FCFF']}
                          />
                          <Area type="monotone" dataKey="fcff" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorFcff)" dot={{ r: 4, fill: '#8b5cf6' }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <ConfiguracaoProjecaoEstrutural hasData={hasData} />
                </div>
             </div>
          )}

          {tab === 'dreGerencial' && <FinancialModelTable table={projection.dreGerencial} title="DRE Gerencial" subtitle="Foco em performance operacional e EBITDA (5 Anos)." />}
          {tab === 'dreContabil' && <FinancialModelTable table={projection.dreContabil} title="DRE Contábil / Fiscal" subtitle="Foco em apuração fiscal, IRPJ/CSLL e Lucro Líquido Final." />}
          {tab === 'caixa' && <FinancialModelTable table={projection.fluxoCaixa} title="Geração de Caixa Livre (FCFF)" subtitle="Caminho do EBITDA para o Caixa disponível após impostos, capex e NCG." />}
          {tab === 'balanco' && <FinancialModelTable table={projection.balanco} title="Balanço Patrimonial Projetado" subtitle="Evolução de ativos, capital de giro e endividamento." />}
          {tab === 'inputs' && <InputsDataEntryView selectedClient={selectedClient} />}
          {tab === 'premissas' && <PremissasClientePage clients={clients} selectedClient={selectedClient} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
