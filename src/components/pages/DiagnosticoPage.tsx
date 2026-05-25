
import React, { useState, useMemo } from "react";
import { 
  AlertTriangle, Plus, Trash2, Edit2,
  TrendingUp, Activity, ShieldAlert, Target,
  Link2, Check, X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useModuleData } from "../../hooks/useModuleData";
import { DiagnosticoItem, ObjetivoOKR, EixoGestao, ClassificacaoSWOT, TipoRisco, Gravidade, Urgencia, Tendencia, ImpactoFinanceiro } from "../../types/modules";
import { cn } from "../../lib/utils";
import { SectionHeader, PageHeader } from "../Common";
import { GOVERNANCE_PRINCIPLES } from "../../lib/governanceIntelligence";
import { GovernanceInsightPanel } from "../GovernanceInsightPanel";
import { DashboardSkeleton } from "../ui/skeletons";

const EIXOS: EixoGestao[] = [
  "Governança Corporativa", "Cultura Organizacional", "Gestão Administrativa e Financeira", "Gestão de Inovação", "Gestão de Marketing", "Gestão Comercial", "Gestão Operacional"
];

interface DiagnosticoPageProps {
  clientId: string;
  selectedYear?: number;
  selectedMonth?: number;
}

export function DiagnosticoPage({ clientId, selectedYear, selectedMonth }: DiagnosticoPageProps) {
  const { data, add, update, remove, loading } = useModuleData<DiagnosticoItem>("diagnostico", clientId);
  const { data: okrsData, add: addOkr, update: updateOkr } = useModuleData<ObjetivoOKR>("okrs", clientId);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  // OKR link modal
  const [linkingItem, setLinkingItem] = useState<DiagnosticoItem | null>(null);
  const [linkTab, setLinkTab] = useState<"vincular" | "criar">("vincular");
  const [linkSaving, setLinkSaving] = useState(false);
  const [newOkrTrimestre, setNewOkrTrimestre] = useState("Q1");
  const [newOkrAno, setNewOkrAno] = useState("2026");
  const [newOkrForm, setNewOkrForm] = useState({ titulo: "", eixo: "Governança Corporativa" as EixoGestao, responsavel: "" });
  const [newKrForm, setNewKrForm] = useState({ descricao: "", kpi: "", tipo: "Percentual" as "Percentual" | "Monetário" | "Unidade", meta: 0 });
  
  const [formData, setFormData] = useState<Partial<DiagnosticoItem>>({
    descricao: "",
    eixo: "Governança Corporativa",
    swot: "Fraqueza",
    tipoRisco: "Operacional",
    gravidade: 3,
    urgencia: 3,
    tendencia: 3,
    impactoFinanceiro: 3,
    efeitoFinanceiro: "Faturamento",
    custoInvestimento: "Médio",
    retornoInvestimento: "Médio Prazo (90-180 dias)"
  });

  const calculateIVE = (g: number, u: number, t: number, i: number) => {
    return g * u * t * i;
  };

  const SWOT_MULTIPLIERS: Record<string, { label: string; value: number; color: string }> = {
    "Oportunidade": { label: "×1.3", value: 1.3, color: "text-emerald-600" },
    "Força":        { label: "×1.1", value: 1.1, color: "text-sky-500" },
    "Fraqueza":     { label: "×1.0", value: 1.0, color: "text-slate-400" },
    "Ameaça":       { label: "×0.8", value: 0.8, color: "text-rose-500" },
  };

  const EFEITO_MULTIPLIERS: Record<string, { value: number; color: string }> = {
    "EBITDA":          { value: 1.4, color: "text-emerald-600" },
    "Faturamento":     { value: 1.3, color: "text-sky-600" },
    "Capital de Giro": { value: 1.2, color: "text-amber-500" },
    "Endividamento":   { value: 0.7, color: "text-rose-500" },
  };

  const CUSTO_MULTIPLIERS: Record<string, { value: number }> = {
    "Baixo": { value: 1.4 },
    "Médio": { value: 1.0 },
    "Alto":  { value: 0.7 },
  };

  const ROI_MULTIPLIERS: Record<string, { value: number; color: string }> = {
    "Imediato (< 30 dias)":       { value: 1.5, color: "text-emerald-600" },
    "Curto Prazo (30-90 dias)":   { value: 1.3, color: "text-emerald-500" },
    "Médio Prazo (90-180 dias)":  { value: 1.1, color: "text-amber-500" },
    "Longo Prazo (6-12 meses)":   { value: 0.9, color: "text-orange-500" },
    "Incerto (> 12 meses)":       { value: 0.7, color: "text-rose-500" },
  };

  const sortedData = useMemo(() => {
    return data.filter(d => {
      if (d.ano === undefined) return true; // Global/legacy items
      const matchYear = d.ano === selectedYear;
      const matchMonth = d.mes ? d.mes === selectedMonth : true;
      return matchYear && matchMonth;
    }).sort((a, b) => b.iveScore - a.iveScore);
  }, [data, selectedYear, selectedMonth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      const baseScore  = calculateIVE(formData.gravidade!, formData.urgencia!, formData.tendencia!, formData.impactoFinanceiro!);
      const swotMult   = SWOT_MULTIPLIERS[formData.swot!]?.value    ?? 1;
      const efeitoMult = EFEITO_MULTIPLIERS[formData.efeitoFinanceiro!]?.value ?? 1;
      const custoMult  = CUSTO_MULTIPLIERS[formData.custoInvestimento!]?.value ?? 1;
      const roiMult    = ROI_MULTIPLIERS[formData.retornoInvestimento!]?.value   ?? 1;
      const ive = Math.round(baseScore * swotMult * efeitoMult * custoMult * roiMult);
      const payload = { 
        ...formData, 
        iveScore: ive,
        ano: formData.ano || selectedYear,
        mes: formData.mes || selectedMonth
      };

      if (editingId) {
        await update(editingId, payload);
        setEditingId(null);
      } else {
        await add(payload);
        setShowAddForm(false);
      }

      // Reset form
      setFormData({
        descricao: "",
        eixo: "Governança Corporativa",
        swot: "Fraqueza",
        tipoRisco: "Operacional",
        gravidade: 3,
        urgencia: 3,
        tendencia: 3,
        impactoFinanceiro: 3,
        efeitoFinanceiro: "Faturamento",
        custoInvestimento: "Médio",
        retornoInvestimento: "Médio Prazo (90-180 dias)",
        ano: selectedYear,
        mes: selectedMonth
      });
    } catch (err: any) {
      setSaveError(err.message ?? "Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item: DiagnosticoItem) => {
    setFormData(item);
    setEditingId(item.id!);
    setShowAddForm(true);
  };

  const openLinkModal = (item: DiagnosticoItem) => {
    setLinkingItem(item);
    setLinkTab("vincular");
    setNewOkrForm({ titulo: "", eixo: item.eixo, responsavel: "" });
    setNewOkrTrimestre("Q1");
    setNewOkrAno("2026");
    // Pre-fill KR based on efeitoFinanceiro
    const kpiSugestao = item.efeitoFinanceiro === "EBITDA" ? "EBITDA (R$)"
      : item.efeitoFinanceiro === "Faturamento" ? "Faturamento Bruto (R$)"
      : item.efeitoFinanceiro === "Capital de Giro" ? "Capital de Giro Líquido (R$)"
      : "Nível de Endividamento (%)";
    setNewKrForm({ descricao: `Melhorar ${item.efeitoFinanceiro}`, kpi: kpiSugestao, tipo: item.efeitoFinanceiro === "Endividamento" ? "Percentual" : "Monetário", meta: 0 });
  };

  const handleToggleOkrLink = async (diagnostico: DiagnosticoItem, okrId: string) => {
    const current = diagnostico.okrVinculado ?? [];
    const isLinked = current.includes(okrId);
    const newLinks = isLinked ? current.filter(id => id !== okrId) : [...current, okrId];

    // Partial update: only change okrVinculado
    await update(diagnostico.id!, { okrVinculado: newLinks });

    const okr = okrsData.find(o => o.id === okrId);
    if (okr) {
      const okrLinks = okr.vinculoDiagnostico ?? [];
      const newOkrLinks = isLinked
        ? okrLinks.filter(id => id !== diagnostico.id)
        : [...okrLinks, diagnostico.id!];
      // Partial update: only change vinculoDiagnostico
      await updateOkr(okrId, { vinculoDiagnostico: newOkrLinks });
    }
    setLinkingItem(prev => prev ? { ...prev, okrVinculado: newLinks } : null);
  };

  const handleCreateOkrFromDiagnostico = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkingItem) return;
    setLinkSaving(true);
    const periodo = `${newOkrTrimestre} ${newOkrAno}`;
    // Build KR if filled in
    const keyResults = newKrForm.descricao && newKrForm.kpi ? [{
      id: crypto.randomUUID(),
      descricao: newKrForm.descricao,
      kpi: newKrForm.kpi,
      tipo: newKrForm.tipo,
      meta: newKrForm.meta,
      atual: 0,
      status: "Not Started" as const,
      progresso: 0,
    }] : [];
    try {
      const newOkrId = await addOkr({
        titulo: newOkrForm.titulo,
        eixo: newOkrForm.eixo,
        responsavel: newOkrForm.responsavel,
        periodo,
        progressoGeral: 0,
        keyResults,
        vinculoDiagnostico: [linkingItem.id!],
      });
      const newLinks = [...(linkingItem.okrVinculado ?? []), newOkrId];
      await update(linkingItem.id!, { okrVinculado: newLinks });
      setLinkingItem(prev => prev ? { ...prev, okrVinculado: newLinks } : null);
      setLinkTab("vincular");
      setNewOkrForm({ titulo: "", eixo: linkingItem.eixo, responsavel: "" });
      setNewKrForm({ descricao: "", kpi: "", tipo: "Percentual", meta: 0 });
    } finally {
      setLinkSaving(false);
    }
  };


  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title="Diagnóstico & IVE" 
        subtitle="Priorização inteligente baseada na Matriz GUT + IVE (Índice de Valor Estratégico)."
        icon={ShieldAlert}
        color="executive"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="px-4 md:px-6 py-2 md:py-3 bg-card border border-border rounded-md shadow-sm flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-secondary" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Score de Priorização Ativo</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              if (!showAddForm) setEditingId(null);
            }}
            className={cn(
              "btn-executive",
              showAddForm 
                ? "bg-surface-container text-foreground border border-border" 
                : "bg-secondary text-white shadow-xl shadow-secondary/20"
            )}
          >
            {showAddForm ? "CANCELAR" : <><Plus size={16} /> NOVO ITEM DE DIAGNÓSTICO</>}
          </button>
        </div>
      </div>


      <div className="bg-surface-container/30 rounded-xl p-6 border border-border/80 shadow-sm relative overflow-hidden backdrop-blur-sm">
        <h3 className="text-body-sm font-semibold text-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
          <Target size={16} className="text-secondary" /> O que é o IVE e qual sua importância?
        </h3>
        <p className="text-body-sm text-muted-foreground leading-relaxed font-normal">
          O <strong className="text-foreground font-medium">Índice de Valor Estratégico (IVE)</strong> é uma métrica avançada criada para medir o verdadeiro impacto de uma ação no negócio. Ao invés de focar apenas em mitigar riscos, o IVE prioriza a <strong className="text-secondary font-semibold">Geração de Valor</strong>, cruzando a urgência do problema com o potencial de <strong className="text-success font-semibold">Retorno sobre Investimento (ROI)</strong>, <strong className="text-foreground font-semibold">Efeito Financeiro</strong> e <strong className="text-warning font-semibold">Custo</strong>.
          Itens com maior IVE são as prioridades absolutas: requerem menor esforço financeiro e entregam o maior resultado no caixa ou EBITDA da empresa.
        </p>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="card-premium p-10 overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest block mb-2 px-1">Descrição do Problema/Oportunidade</label>
                      <input 
                        required
                        value={formData.descricao}
                        onChange={e => setFormData({...formData, descricao: e.target.value})}
                        className="w-full px-4 md:px-6 py-2.5 md:py-4 bg-surface-container border border-border rounded-md outline-none focus:ring-1 focus:ring-primary/20 transition-all font-medium text-foreground text-sm uppercase tracking-widest placeholder:text-muted-foreground/30 shadow-inner"
                        placeholder="Ex: Alta rotatividade no setor operacional"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest block mb-2 px-1">Eixo de Gestão</label>
                        <select 
                          value={formData.eixo}
                          onChange={e => setFormData({...formData, eixo: e.target.value as EixoGestao})}
                          className="w-full px-4 py-3 bg-surface-container border border-border rounded-md font-medium text-[10px] uppercase tracking-widest outline-none shadow-inner"
                        >
                          {EIXOS.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest block mb-2 px-1">Classificação SWOT</label>
                        <select 
                          value={formData.swot}
                          onChange={e => setFormData({...formData, swot: e.target.value as ClassificacaoSWOT})}
                          className="w-full px-4 py-3 bg-surface-container border border-border rounded-md font-medium text-[10px] uppercase tracking-widest outline-none shadow-inner"
                        >
                          <option value="Força">Força</option>
                          <option value="Fraqueza">Fraqueza</option>
                          <option value="Oportunidade">Oportunidade</option>
                          <option value="Ameaça">Ameaça</option>
                        </select>
                      </div>
                    </div>
                 </div>

                 <div className="space-y-6 bg-surface-container/30 p-8 rounded-md border border-border shadow-inner">
                    <h4 className="text-[10px] font-medium text-primary uppercase tracking-[0.2em] mb-4">Parâmetros de Pontuação (1-5)</h4>
                    <div className="grid grid-cols-2 gap-6">
                      {[
                        { label: "Gravidade", field: "gravidade" },
                        { label: "Urgência", field: "urgencia" },
                        { label: "Tendência", field: "tendencia" },
                        { label: "Impacto Fin.", field: "impactoFinanceiro" },
                      ].map(p => (
                        <div key={p.field}>
                          <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest block mb-2">{p.label}</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(v => (
                              <button
                                key={v}
                                type="button"
                                onClick={() => setFormData({...formData, [p.field]: v})}
                                className={cn(
                                  "w-full h-10 rounded-sm text-[10px] font-medium transition-all shadow-sm",
                                  (formData as any)[p.field] === v ? "bg-executive text-white shadow-premium" : "bg-card text-muted-foreground border border-border hover:border-secondary/30"
                                )}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                {/* Efeito Financeiro */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">
                    Efeito Financeiro
                  </label>
                  <select 
                    value={formData.efeitoFinanceiro}
                    onChange={e => setFormData({...formData, efeitoFinanceiro: e.target.value as any})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none"
                  >
                    <option value="EBITDA">EBITDA ×1.4 ⬆️</option>
                    <option value="Faturamento">Faturamento ×1.3</option>
                    <option value="Capital de Giro">Capital de Giro ×1.2</option>
                    <option value="Endividamento">Endividamento ×0.7 ⬇️</option>
                  </select>
                </div>

                {/* Custo de Investimento */}
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest block mb-2 px-1">
                    Custo Invest.
                  </label>
                  <select 
                    value={formData.custoInvestimento}
                    onChange={e => setFormData({...formData, custoInvestimento: e.target.value as any})}
                    className="w-full px-4 py-3 bg-surface-container border border-border rounded-md font-medium text-[10px] uppercase tracking-widest outline-none shadow-inner"
                  >
                    <option value="Baixo">Baixo ×1.4 ⬆️</option>
                    <option value="Médio">Médio ×1.0</option>
                    <option value="Alto">Alto ×0.7 ⬇️</option>
                  </select>
                </div>

                {/* Retorno de Investimento */}
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest block mb-2 px-1">
                    Retorno Invest.
                  </label>
                  <select 
                    value={formData.retornoInvestimento}
                    onChange={e => setFormData({...formData, retornoInvestimento: e.target.value as any})}
                    className="w-full px-4 py-3 bg-surface-container border border-border rounded-md font-medium text-[10px] uppercase tracking-widest outline-none shadow-inner"
                  >
                    <option value="Imediato (< 30 dias)">Imediato (&lt; 30 dias) ×1.5</option>
                    <option value="Curto Prazo (30-90 dias)">Curto Prazo (30–90 dias) ×1.3</option>
                    <option value="Médio Prazo (90-180 dias)">Médio Prazo (90–180 dias) ×1.1</option>
                    <option value="Longo Prazo (6-12 meses)">Longo Prazo (6–12 meses) ×0.9</option>
                    <option value="Incerto (> 12 meses)">Incerto (&gt; 12 meses) ×0.7</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                {saveError && (
                  <div className="px-4 md:px-6 py-2 md:py-3 bg-destructive/10 border border-destructive/20 rounded-md text-[10px] font-medium text-destructive uppercase tracking-widest">
                    ⚠️ {saveError}
                  </div>
                )}
                <div className="flex justify-end">
                  <button 
                    type="submit"
                    disabled={saving}
                    className="btn-executive bg-secondary shadow-xl shadow-secondary/20"
                  >
                    {saving ? "Salvando..." : editingId ? "Salvar Alterações" : "Confirmar Diagnóstico"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* IVE Ranking List */}
      <div className="space-y-4">
        {sortedData.map((item, idx) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={item.id}
            className="group card-premium p-6 flex items-center gap-8"
          >
            <div className="flex flex-col items-center justify-center bg-surface-container w-28 h-28 rounded-md border border-border shrink-0 gap-0.5 shadow-inner">
               <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Score IVE</span>
               <span className={cn(
                 "text-3xl font-medium tracking-tighter",
                 item.iveScore >= 400 ? "text-destructive" : item.iveScore >= 200 ? "text-warning" : "text-success"
               )}>
                 {item.iveScore}
               </span>
               {SWOT_MULTIPLIERS[item.swot] && (
                 <span className={cn("text-[9px] font-medium uppercase tracking-widest", SWOT_MULTIPLIERS[item.swot].color)}>
                   {SWOT_MULTIPLIERS[item.swot].label} SWOT
                 </span>
               )}
            </div>

            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center gap-3">
                <span className={cn(
                  "px-2 py-0.5 rounded-sm text-[8px] font-medium uppercase tracking-widest border",
                  item.swot === "Fraqueza" || item.swot === "Ameaça" ? "bg-destructive/5 text-destructive border-destructive/20" : "bg-success/5 text-success border-success/20"
                )}>
                  {item.swot}
                </span>
                <span className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest border border-border px-2 py-0.5 rounded-sm bg-surface-container/30">
                  {item.eixo}
                </span>
              </div>
              <h4 className="text-lg font-medium text-foreground tracking-tight uppercase pr-4">{item.descricao}</h4>
              <div className="flex items-center gap-6 text-[9px] font-medium text-muted-foreground uppercase tracking-widest">
                <div className="flex items-center gap-1.5"><ShieldAlert size={14} className="text-secondary" /> {item.tipoRisco}</div>
                <div className={cn("flex items-center gap-1.5", EFEITO_MULTIPLIERS[item.efeitoFinanceiro]?.color ?? "text-muted-foreground")}>
                  <Activity size={14} /> {item.efeitoFinanceiro}
                </div>
                <div className={cn("flex items-center gap-1.5", ROI_MULTIPLIERS[item.retornoInvestimento]?.color ?? "text-muted-foreground")}>
                  <TrendingUp size={14} /> {item.retornoInvestimento}
                </div>
                <div className="flex items-center gap-1.5">
                  Custo: <span className="text-foreground font-medium">{item.custoInvestimento}</span>
                </div>
              </div>

              {/* OKR badges */}
              {(item.okrVinculado ?? []).length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {(item.okrVinculado ?? []).map(okrId => {
                    const okr = okrsData.find(o => o.id === okrId);
                    return okr ? (
                      <span key={okrId} className="flex items-center gap-1 text-[8px] font-medium bg-secondary/10 text-secondary px-2 py-0.5 rounded-sm border border-secondary/20 uppercase tracking-widest shadow-sm">
                        <Target size={9} /> {okr.titulo.substring(0, 30)}{okr.titulo.length > 30 ? "..." : ""}
                      </span>
                    ) : null;
                  })}
                </div>
              )}

              {/* Governance Badge */}
              <div className="mt-4 pt-4 border-t border-border">
                <GovernanceInsightPanel 
                  principleId={GOVERNANCE_PRINCIPLES.find(p => p.axis === item.eixo)?.id || "gov_1"} 
                  compact 
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => openLinkModal(item)} className="p-3 text-muted-foreground hover:text-secondary hover:bg-secondary/10 rounded-md transition-all shadow-sm border border-transparent hover:border-secondary/20" title="Vincular OKR">
                 <Link2 size={18} />
               </button>
               <button onClick={() => startEdit(item)} className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all shadow-sm border border-transparent hover:border-primary/20">
                 <Edit2 size={18} />
               </button>
               <button onClick={() => remove(item.id!)} className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all shadow-sm border border-transparent hover:border-destructive/20">
                 <Trash2 size={18} />
               </button>
            </div>
          </motion.div>
        ))}
        {data.length === 0 && (
          <div className="py-32 text-center flex flex-col items-center gap-4 text-muted-foreground/30">
            <AlertTriangle size={64} strokeWidth={1} />
            <p className="font-medium uppercase tracking-widest text-[10px]">Nenhum item de diagnóstico registrado.</p>
          </div>
        )}
      </div>

      {/* OKR Link Modal */}
      <AnimatePresence>
        {linkingItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-executive/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setLinkingItem(null); }}
          >
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="card-premium border-none shadow-2xl w-full max-w-xl flex flex-col overflow-hidden max-h-[80vh]"
            >
              <div className="p-8 border-b border-border flex justify-between items-start shrink-0 bg-surface-container/30 shadow-inner">
                <div>
                  <p className="text-[10px] font-medium text-secondary uppercase tracking-widest">Conexão Estratégica</p>
                  <h3 className="text-xl font-medium text-foreground mt-1 uppercase tracking-tighter">Vincular IVE a OKR</h3>
                  <p className="text-[10px] text-muted-foreground mt-1 font-medium max-w-xs uppercase tracking-widest italic">{linkingItem.descricao}</p>
                </div>
                <button onClick={() => setLinkingItem(null)} className="p-2 text-muted-foreground hover:text-foreground rounded-md"><X size={20} /></button>
              </div>

              <div className="flex border-b border-border px-8 shrink-0 bg-card">
                {(["vincular", "criar"] as const).map(tab => (
                  <button key={tab} onClick={() => setLinkTab(tab)}
                    className={cn("py-4 px-1 mr-6 text-[10px] font-medium uppercase tracking-widest border-b-2 transition-all",
                      linkTab === tab ? "border-secondary text-secondary shadow-premium" : "border-transparent text-muted-foreground hover:text-foreground")}
                  >
                    {tab === "vincular" ? "Vincular Existente" : "+ Criar Objetivo (OKR)"}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-8 bg-surface-container/10">
                {linkTab === "vincular" ? (
                  okrsData.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground/30 flex flex-col items-center gap-3">
                      <Target size={40} strokeWidth={1} />
                      <p className="font-medium uppercase tracking-widest text-[10px]">Nenhum OKR cadastrado ainda.</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest italic">OKR é opcional — vincule quando fizer sentido estratégico.</p>
                      <button onClick={() => setLinkTab("criar")} className="text-secondary font-medium text-[10px] uppercase tracking-widest underline shadow-sm">Criar agora</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest italic mb-4">OKR é opcional. Vincule somente quando fizer sentido estratégico para este diagnóstico.</p>
                      {okrsData.map(okr => {
                        const isLinked = (linkingItem.okrVinculado ?? []).includes(okr.id!);
                        return (
                          <div key={okr.id} className={cn("rounded-md border-2 transition-all overflow-hidden shadow-sm",
                            isLinked ? "border-secondary" : "border-border")}>
                            <button onClick={() => handleToggleOkrLink(linkingItem, okr.id!)}
                              className={cn("w-full text-left p-4 transition-all shadow-inner",
                                isLinked ? "bg-secondary/5" : "bg-surface-container/30 hover:bg-card")}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mb-1 italic">{okr.eixo} • {okr.periodo}</p>
                                  <p className="font-medium text-foreground text-sm uppercase tracking-tighter leading-tight">{okr.titulo}</p>
                                </div>
                                <div className={cn("w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all mt-0.5 shadow-sm",
                                  isLinked ? "bg-secondary border-secondary" : "border-border bg-card")}>
                                  {isLinked && <Check size={12} className="text-white" />}
                                </div>
                              </div>
                            </button>
                            {/* KRs do OKR */}
                            {okr.keyResults.length > 0 && (
                              <div className="px-4 pb-3 space-y-1 border-t border-border bg-card/50">
                                {okr.keyResults.map(kr => (
                                  <div key={kr.id} className="flex items-center gap-2 pt-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-secondary/40 shrink-0 shadow-sm" />
                                    <span className="text-[9px] font-medium text-muted-foreground flex-1 uppercase tracking-widest italic">{kr.descricao}</span>
                                    <span className="text-[8px] font-medium text-muted-foreground/40 uppercase tracking-widest">{kr.kpi}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : (
                  <form onSubmit={handleCreateOkrFromDiagnostico} className="space-y-5">
                    <div>
                      <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest block mb-2">Título do Objetivo</label>
                      <input required value={newOkrForm.titulo} onChange={e => setNewOkrForm({...newOkrForm, titulo: e.target.value})}
                        className="w-full px-5 py-3 bg-card border border-border rounded-md font-medium text-foreground text-sm uppercase tracking-widest placeholder:text-muted-foreground/30 shadow-inner outline-none focus:ring-1 focus:ring-secondary/20"
                        placeholder="Ex: Aumentar EBITDA em 20% no Q2"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest block mb-2">Eixo</label>
                        <select value={newOkrForm.eixo} onChange={e => setNewOkrForm({...newOkrForm, eixo: e.target.value as EixoGestao})}
                          className="w-full px-3 py-3 bg-card border border-border rounded-md font-medium text-[9px] uppercase tracking-widest outline-none shadow-inner">
                          {EIXOS.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest block mb-2">Trimestre</label>
                        <select value={newOkrTrimestre} onChange={e => setNewOkrTrimestre(e.target.value)}
                          className="w-full px-3 py-3 bg-card border border-border rounded-md font-medium text-[9px] uppercase tracking-widest outline-none shadow-inner">
                          {["Q1","Q2","Q3","Q4"].map(q => <option key={q} value={q}>{q}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest block mb-2">Ano</label>
                        <select value={newOkrAno} onChange={e => setNewOkrAno(e.target.value)}
                          className="w-full px-3 py-3 bg-card border border-border rounded-md font-medium text-[9px] uppercase tracking-widest outline-none shadow-inner">
                          {Array.from({ length: 11 }, (_, i) => (new Date().getFullYear() - 5 + i).toString()).map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest block mb-2">Responsável</label>
                      <input value={newOkrForm.responsavel} onChange={e => setNewOkrForm({...newOkrForm, responsavel: e.target.value})}
                        className="w-full px-5 py-3 bg-card border border-border rounded-md font-medium text-foreground text-[10px] uppercase tracking-widest outline-none shadow-inner"
                        placeholder="Nome do responsável" />
                    </div>

                    {/* KR pré-preenchido */}
                    <div className="border-t border-border pt-4">
                      <p className="text-[10px] font-medium text-primary uppercase tracking-widest mb-3">Key Result (opcional)</p>
                      <div className="space-y-3 bg-surface-container/30 rounded-md p-4 shadow-inner">
                        <div>
                          <label className="text-[9px] font-medium text-muted-foreground uppercase mb-1.5 block">Descrição do KR</label>
                          <input value={newKrForm.descricao} onChange={e => setNewKrForm({...newKrForm, descricao: e.target.value})}
                            className="w-full px-4 py-2.5 bg-card border border-border rounded-md font-medium text-sm text-foreground uppercase tracking-widest placeholder:text-muted-foreground/30 outline-none shadow-inner"
                            placeholder="Ex: Aumentar EBITDA mensal" />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-1">
                            <label className="text-[9px] font-medium text-muted-foreground uppercase mb-1.5 block">KPI</label>
                            <input value={newKrForm.kpi} onChange={e => setNewKrForm({...newKrForm, kpi: e.target.value})}
                              className="w-full px-3 py-2.5 bg-card border border-border rounded-md font-medium text-[9px] uppercase tracking-widest outline-none shadow-inner"
                              placeholder="EBITDA (R$)" />
                          </div>
                          <div>
                            <label className="text-[9px] font-medium text-muted-foreground uppercase mb-1.5 block">Tipo</label>
                            <select value={newKrForm.tipo} onChange={e => setNewKrForm({...newKrForm, tipo: e.target.value as any})}
                              className="w-full px-2 py-2.5 bg-card border border-border rounded-md font-medium text-[9px] uppercase tracking-widest outline-none shadow-inner">
                              <option value="Percentual">%</option>
                              <option value="Monetário">R$</option>
                              <option value="Unidade">Un</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[9px] font-medium text-muted-foreground uppercase mb-1.5 block">Meta</label>
                            <input type="number" value={newKrForm.meta} onChange={e => setNewKrForm({...newKrForm, meta: +e.target.value})}
                              className="w-full px-3 py-2.5 bg-card border border-border rounded-md font-medium text-[9px] uppercase tracking-widest outline-none shadow-inner" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button type="submit" disabled={linkSaving}
                        className="btn-executive bg-secondary shadow-xl shadow-secondary/20">
                        {linkSaving ? "Criando..." : "Criar OKR e Vincular"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
