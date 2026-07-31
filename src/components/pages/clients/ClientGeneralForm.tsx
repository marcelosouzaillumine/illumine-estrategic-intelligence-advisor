import React from 'react';
import { 
  Plus, Search, Filter, ChevronLeft, ChevronRight, MoreHorizontal, Edit3, Trash2, Building2, MapPin, Users, Activity, FileText, LayoutGrid, Loader2, X, ShieldCheck, Briefcase, History, DollarSign, Landmark, TrendingUp, AlertCircle, Sparkles, Link2, Image as ImageIcon, Upload, Key, Save, Calendar, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EmployeeManager } from "../../EmployeeManager";
import { ClientImportHistory } from "../../ClientImportHistory";
import { ClientLoginAudit } from "../../ClientLoginAudit";
import { ClientUserManager } from "../../ClientUserManager";
import { Button } from "../../ui/button";
import { MarkdownText } from "../../Common";
import { ExecutiveSurface } from "../../ui/executive-surface";
import { ExecutiveHeading } from "../../ui/executive-heading";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

import { cn, formatDoc, formatCurrency } from "../../../lib/utils";

export const ClientGeneralForm = ({ state, computed, actions }: any) => {
  const { 
    view, loading, cnpjQuery, error, editingId, formData, validationErrors, 
    tempUnit, tempBranch, tempContact, activeFormTab, showAllBranches, partners
  } = state;
  
  const { 
    setView, setCnpjQuery, setFormData, setValidationErrors, 
    setTempUnit, setTempBranch, setTempContact, setActiveFormTab, 
    setShowAllBranches, validateField, fetchCNPJ, handleImageUpload, handleSave
  } = actions;

  const { allSegments } = computed;
  
  // We need isMaster and isPartner - we can pass them in state or get from props
  const isMaster = state.isMaster || true;
  const userPartnerIds = state.userPartnerIds || [];
  const isPartner = state.isPartner || false;
  const [showSegmentSuggestions, setShowSegmentSuggestions] = React.useState(false);

    return (
      <div className="space-y-6">
        <div className="w-full">
          {/* Executive Tabs Navigation — Canonical Line Variant */}
          <div className="border-b border-border bg-transparent mb-6">
            <div className="flex overflow-x-auto no-scrollbar gap-2 px-2">
              {[
                { id: "dados", label: "Empresa", icon: Building2 },
                { id: "estrutura", label: "Estrutura", icon: LayoutGrid },
                { id: "fiscal", label: "Fiscal", icon: Landmark },
                { id: "contato", label: "Contatos", icon: Users },
                { id: "usuarios", label: "Usuários", icon: Key },
                { id: "importacao", label: "Importações", icon: History },
                { id: "acessos", label: "Acessos", icon: ShieldCheck },
                { id: "auditoria", label: "Auditoria", icon: Activity },
                { id: "relatorio_ia", label: "Insights IA", icon: Sparkles },
              ].map(tab => (
                <Button
                  key={tab.id}
                  variant="ghost"
                  onClick={() => setActiveFormTab(tab.id as any)}
                  className={cn(
                    "rounded-none border-b-2 border-transparent px-4 py-6 text-sm font-semibold rounded-t-lg transition-all",
                    activeFormTab === tab.id 
                      ? "border-primary text-foreground bg-surface-container/30" 
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-container/20 hover:border-border"
                  )}
                >
                  {React.createElement(tab.icon as any, { size: 16, className: "mr-2" })}
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="p-6 md:p-10 flex-1 bg-card">
            {activeFormTab === "dados" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                {/* 1. Perfil Estratégico Section */}
                <ExecutiveSurface padding="lg" radius="xl" className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <ExecutiveHeading as="h3">Perfil Estratégico</ExecutiveHeading>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Defina a natureza e os parâmetros de gestão</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <Label>Tipo de Organização</Label>
                      <Select 
                        value={formData.type}
                        onValueChange={(val) => setFormData({...formData, type: val as any})}
                      >
                        <SelectTrigger className="w-full h-12 bg-background">
                          <SelectValue placeholder="Selecione o tipo..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="for-profit">Com Fins Lucrativos</SelectItem>
                          <SelectItem value="third-sector">Terceiro Setor (ONG/OSC)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Origem da Organização</Label>
                      <Select 
                        value={formData.origin}
                        onValueChange={(val) => setFormData({...formData, origin: val as any})}
                      >
                        <SelectTrigger className="w-full h-12 bg-background">
                          <SelectValue placeholder="Selecione a origem..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nacional">Nacional (Brasil)</SelectItem>
                          <SelectItem value="internacional">Internacional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Moeda de Gestão</Label>
                      <Select 
                        value={formData.currency}
                        onValueChange={(val) => setFormData({...formData, currency: val as any})}
                      >
                        <SelectTrigger className="w-full h-12 bg-background">
                          <SelectValue placeholder="Selecione a moeda..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BRL">Real (BRL)</SelectItem>
                          <SelectItem value="USD">Dólar (USD)</SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                          <SelectItem value="GBP">Libra (GBP)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Status da Empresa</Label>
                      <Select 
                        value={formData.status || "Em Implantação"}
                        onValueChange={(val) => setFormData({...formData, status: val})}
                        disabled={!isMaster}
                      >
                        <SelectTrigger className="w-full h-12 bg-background">
                          <SelectValue placeholder="Selecione o status..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Em Implantação">Em Implantação</SelectItem>
                          <SelectItem value="Ativo">Ativo</SelectItem>
                          <SelectItem value="Inativo">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.type === "third-sector" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-6 bg-success-soft border border-success/20 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-success-soft flex items-center justify-center text-success border border-success/30">
                          <LayoutGrid size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-success uppercase tracking-widest">Gestão por Projetos</p>
                          <p className="text-xs font-medium text-success/80 mt-1">Segregação automática de registros por projeto</p>
                        </div>
                      </div>
                      <input 
                        type="checkbox"
                        checked={formData.projectBased}
                        onChange={(e) => setFormData({...formData, projectBased: e.target.checked})}
                        className="w-5 h-5 accent-success"
                      />
                    </motion.div>
                  )}
                </ExecutiveSurface>

                <div className="grid grid-cols-1 gap-10">
                  {/* 2. Identificação Section */}
                  <ExecutiveSurface padding="lg" radius="xl" className="space-y-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <ExecutiveHeading as="h3">Identificação Jurídica</ExecutiveHeading>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Dados oficiais e vínculos de gestão</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label>{formData.origin === "nacional" ? "Número do CNPJ" : "Tax ID / Registration Number"}</Label>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="relative flex-1">
                            <Input 
                              type="text" 
                              value={formData.origin === "nacional" ? cnpjQuery : formData.cnpj}
                              onChange={(e) => {
                                if (formData.origin === "nacional") {
                                  const masked = formatDoc(e.target.value);
                                  setCnpjQuery(masked);
                                  validateField("cnpj", masked);
                                } else {
                                  setFormData({...formData, cnpj: e.target.value});
                                  validateField("cnpj", e.target.value);
                                }
                              }}
                              placeholder={formData.origin === "nacional" ? "00.000.000/0000-00" : "Registration ID"}
                              className={cn(
                                "w-full pl-12 pr-6 py-4 bg-background border rounded-md text-body-sm font-medium outline-none focus:border-secondary transition-all shadow-sm",
                                validationErrors.cnpj ? "border-destructive" : "border-border"
                              )}
                            />
                            <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          </div>
                          {formData.origin === "nacional" && (
                            <Button variant="outline" size="sm" 
                              onClick={fetchCNPJ}
                              disabled={loading || cnpjQuery.replace(/\D/g, "").length !== 14 || !!validationErrors.cnpj}
                              className="whitespace-nowrap"
                            >
                              {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} className="mr-2" />}
                              SINCRONIZAR
                            </Button>
                          )}
                        </div>
                        {validationErrors.cnpj && <p className="text-[10px] text-destructive font-medium mt-2 uppercase tracking-widest">{validationErrors.cnpj}</p>}
                      </div>
                      {error && (
                        <div className="mt-4 p-4 bg-critical-soft border border-destructive/20 rounded-md flex items-start gap-3">
                          <AlertCircle size={16} className="text-destructive shrink-0 mt-0.5" />
                          <div>
                            <p className="text-body-sm font-medium text-destructive uppercase tracking-widest mb-1">Erro de Sincronização</p>
                            <p className="text-body-sm text-destructive/80 font-medium leading-relaxed">{error}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Razão Social</Label>
                        <Input 
                          type="text" 
                          value={formData.razao}
                          onChange={(e) => {
                            setFormData({...formData, razao: e.target.value});
                            validateField("razao", e.target.value);
                          }}
                          className={cn(
                            "w-full h-12 bg-background",
                            validationErrors.razao && "border-destructive focus-visible:ring-destructive/30"
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nome Fantasia</Label>
                        <Input 
                          type="text" 
                          value={formData.fantasia}
                          onChange={(e) => {
                            setFormData({...formData, fantasia: e.target.value});
                            validateField("fantasia", e.target.value);
                          }}
                          className={cn(
                            "w-full h-12 bg-background",
                            validationErrors.fantasia && "border-destructive focus-visible:ring-destructive/30"
                          )}
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border flex flex-col md:flex-row md:items-end justify-between gap-6">
                      <div className="flex-1 space-y-2">
                        <Label>Parceiro Estratégico Responsável</Label>
                        <Select 
                          value={formData.partnerId || ""}
                          onValueChange={(val) => setFormData({...formData, partnerId: val})}
                          disabled={!isMaster}
                        >
                          <SelectTrigger className="w-full h-12 bg-background">
                            <SelectValue placeholder="Selecione um parceiro..." />
                          </SelectTrigger>
                          <SelectContent>
                            {isMaster && <SelectItem value="">Atendimento Direto (Sem Parceiro)</SelectItem>}
                            {!isMaster && isPartner && <SelectItem value={userPartnerIds[0]}>Sua Unidade de Negócio</SelectItem>}
                            {partners.map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.fantasia || p.razao}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-4 bg-background p-3 px-5 rounded-lg border border-border shrink-0">
                        <span className="text-sm font-bold text-foreground">Empresa Modelo</span>
                        <input 
                          type="checkbox"
                          checked={formData.isModel}
                          onChange={(e) => setFormData({...formData, isModel: e.target.checked})}
                          className="w-5 h-5 accent-secondary"
                        />
                      </div>
                    </div>

                    <AnimatePresence>
                      {formData.isModel && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-8 bg-secondary/5 rounded-sm border border-secondary/10 space-y-6 shadow-inner">
                            <div className="flex items-center justify-between">
                              <div>
                                <ExecutiveHeading as="h4" className="flex items-center gap-2">
                                  <Sparkles size={14} /> Parâmetros de Geração IA
                                </ExecutiveHeading>
                              </div>
                              <div className="text-[10px] text-muted-foreground italic">
                                Geradores de dados sintéticos foram migrados para scripts via CLI corporativa.
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[
                                { id: "governanca", label: "Governança" },
                                { id: "financeiro", label: "Financeiro" },
                                { id: "comercial", label: "Comercial" },
                                { id: "operacional", label: "Operacional" },
                              ].map(axis => (
                                <div key={axis.id} className="space-y-1.5">
                                  <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest italic">{axis.label}</label>
                                  <textarea 
                                    value={(formData.modelAxisDescriptions as any)?.[axis.id] || ""}
                                    onChange={(e) => setFormData({
                                      ...formData, 
                                      modelAxisDescriptions: {
                                        ...(formData.modelAxisDescriptions || {}),
                                        [axis.id]: e.target.value
                                      } as any
                                    })}
                                    rows={1}
                                    className="w-full px-4 py-2.5 bg-card border border-border rounded-sm text-[11px] font-medium text-foreground outline-none focus:ring-1 focus:ring-secondary/20 transition-all resize-none shadow-sm italic"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="pt-10 border-t border-border space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1.5">
                          <Label className="mb-0">Quadro Societário</Label>
                          <span className="text-[10px] text-muted-foreground font-medium italic">* Percentuais calculados com base no capital social integralizado.</span>
                        </div>
                        <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormData({...formData, socios: [...formData.socios, { nome: "", participacao: 0 }]})}
                          className="text-secondary hover:text-secondary hover:bg-secondary/10 uppercase tracking-widest"
                        >
                          <Plus size={14} className="mr-2" /> Adicionar Sócio
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {formData.socios.map((s, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-4 bg-background border border-border rounded-lg relative group/socio hover:border-secondary/30 transition-all shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-surface-container border border-border flex items-center justify-center text-muted-foreground group-hover/socio:text-secondary transition-all shrink-0">
                              <Users size={18} strokeWidth={1.5} />
                            </div>
                            <div className="flex-1 min-w-0 space-y-2">
                              <Input 
                                type="text"
                                value={s.nome}
                                onChange={(e) => {
                                  const newSocios = [...formData.socios];
                                  newSocios[idx].nome = e.target.value;
                                  setFormData({...formData, socios: newSocios});
                                }}
                                placeholder="Nome do Sócio"
                                className="w-full bg-transparent h-8 border-transparent hover:border-border focus-visible:ring-secondary/20 px-2 -ml-2"
                              />
                              <div className="flex items-center gap-2 px-1">
                                <input 
                                  type="number"
                                  value={s.participacao}
                                  onChange={(e) => {
                                    const newSocios = [...formData.socios];
                                    newSocios[idx].participacao = parseFloat(e.target.value) || 0;
                                    setFormData({...formData, socios: newSocios});
                                  }}
                                  placeholder="0.00"
                                  className="w-16 bg-transparent text-[11px] font-medium text-secondary outline-none border-b border-transparent focus:border-secondary/30"
                                />
                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">% participação</span>
                              </div>
                            </div>
                            <Button 
                              variant="destructive"
                              size="icon"
                              onClick={() => setFormData({...formData, socios: formData.socios.filter((_, i) => i !== idx)})}
                              className="absolute -top-2 -right-2 w-7 h-7 rounded-full shadow-md opacity-0 group-hover/socio:opacity-100 transition-all"
                            >
                              <X size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ExecutiveSurface>

                {/* 3. Localização Section */}
                <ExecutiveSurface padding="lg" radius="xl" className="space-y-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <ExecutiveHeading as="h3">Presença e Localização</ExecutiveHeading>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Endereço e canais digitais</p>
                    </div>
                  </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Fundação</Label>
                        <div className="px-4 md:px-6 h-12 bg-surface-container/50 border border-border rounded-lg text-sm text-muted-foreground font-medium flex items-center gap-3 shadow-inner">
                          <Calendar size={16} className="text-secondary" />
                          {formData.dataFundacao || "--/--/----"}
                        </div>
                      </div>
                      <div className="space-y-2">
                         <Label>Porte</Label>
                         <div className="px-4 md:px-6 h-12 bg-surface-container/50 border border-border rounded-lg text-sm text-muted-foreground font-medium flex items-center gap-3 shadow-inner">
                          <Building2 size={16} className="text-secondary" />
                          {formData.porte || "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Endereço Completo</Label>
                      <textarea 
                        rows={3}
                        value={formData.endereco}
                        onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                        className="w-full px-4 md:px-6 py-2.5 md:py-4 bg-background border border-border rounded-lg text-sm outline-none focus-visible:border-transparent focus-visible:ring-1 focus-visible:ring-secondary/30 transition-all leading-relaxed shadow-sm"
                        placeholder="Logradouro, número, bairro, cidade - UF"
                      />
                    </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-border">
                        <div className="space-y-2">
                          <Label>Segmento de Atuação</Label>
                          <div className="relative">
                            <Input 
                              type="text" 
                              placeholder="Ex: Agronegócio, Tecnologia, Saúde..."
                              value={formData.segmentoAtuacao || ""}
                              onChange={(e) => {
                                setFormData({...formData, segmentoAtuacao: e.target.value});
                                setShowSegmentSuggestions(true);
                              }}
                              onFocus={() => setShowSegmentSuggestions(true)}
                              onBlur={() => setTimeout(() => setShowSegmentSuggestions(false), 200)}
                              className="w-full pl-12 h-12 bg-background shadow-sm"
                            />
                            <Activity size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            
                            <AnimatePresence>
                              {showSegmentSuggestions && (
                                <motion.div 
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="absolute z-50 left-0 right-0 top-full mt-2 bg-white border border-border-main rounded-xl shadow-xl max-h-48 overflow-y-auto overflow-x-hidden no-scrollbar"
                                >
                                  {allSegments
                                    .filter(s => s.toLowerCase().includes((formData.segmentoAtuacao || "").toLowerCase()))
                                    .map((seg, idx) => (
                                      <button
                                        key={idx}
                                        onClick={() => {
                                          setFormData({...formData, segmentoAtuacao: seg});
                                          setShowSegmentSuggestions(false);
                                        }}
                                        className="w-full text-left px-5 py-3 text-xs font-bold text-text-main hover:bg-secondary/5 hover:text-secondary transition-all border-b border-border-soft last:border-0"
                                      >
                                        {seg}
                                      </button>
                                    ))
                                  }
                                  {formData.segmentoAtuacao && !allSegments.some(s => s.toLowerCase() === formData.segmentoAtuacao.toLowerCase()) && (
                                    <button
                                      onClick={() => setShowSegmentSuggestions(false)}
                                      className="w-full text-left px-5 py-3 text-xs font-black text-secondary bg-secondary/5 flex items-center gap-2"
                                    >
                                      <Plus size={14} /> Sugerir Novo: "{formData.segmentoAtuacao}"
                                    </button>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Website</Label>
                          <div className="relative">
                            <Input 
                              type="text" 
                              placeholder="https://exemplo.com.br"
                              value={formData.website}
                              onChange={(e) => setFormData({...formData, website: e.target.value})}
                              className="w-full pl-12 h-12 bg-background shadow-sm"
                            />
                            <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                        <div className="space-y-4 bg-surface-container/30 p-6 rounded-xl border border-border">
                          <div className="flex items-center justify-between">
                            <Label className="mb-0">Logo da Empresa</Label>
                            <label className="cursor-pointer text-[9px] font-black text-secondary uppercase hover:underline flex items-center gap-1.5 transition-all">
                              <Upload size={12} /> Importar Logo
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "logo")} />
                            </label>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-background border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-sm transition-all group-hover:border-secondary/30">
                              {formData.logo ? (
                                <img src={formData.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                              ) : (
                                <ImageIcon size={24} className="text-muted-foreground/40" />
                              )}
                            </div>
                            <div className="relative flex-1">
                              <Input 
                                type="text" 
                                placeholder="URL da Logo ou Base64"
                                value={formData.logo.startsWith("data:image") ? "Imagem Carregada Localmente" : formData.logo}
                                onChange={(e) => setFormData({...formData, logo: e.target.value})}
                                readOnly={formData.logo.startsWith("data:image")}
                                className={cn(
                                  "w-full h-11 bg-background text-xs",
                                  formData.logo.startsWith("data:image") && "text-secondary italic"
                                )}
                              />
                              {formData.logo.startsWith("data:image") && (
                                <Button 
                                  variant="destructive" 
                                  size="icon" 
                                  onClick={() => setFormData({...formData, logo: ""})} 
                                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full shadow-sm"
                                >
                                  <X size={12} />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 bg-surface-container/30 p-6 rounded-xl border border-border">
                          <div className="flex items-center justify-between">
                            <Label className="mb-0">Ícone / Avatar</Label>
                            <label className="cursor-pointer text-[9px] font-black text-secondary uppercase hover:underline flex items-center gap-1.5 transition-all">
                              <Upload size={12} /> Importar Ícone
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "icon")} />
                            </label>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-background border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-sm transition-all group-hover:border-secondary/30">
                              {formData.icon ? (
                                <img src={formData.icon} alt="Icon" className="w-full h-full object-contain p-2" />
                              ) : (
                                <ImageIcon size={24} className="text-muted-foreground/40" />
                              )}
                            </div>
                            <div className="relative flex-1">
                              <Input 
                                type="text" 
                                placeholder="URL do Ícone ou Base64"
                                value={formData.icon.startsWith("data:image") ? "Imagem Carregada Localmente" : formData.icon}
                                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                                readOnly={formData.icon.startsWith("data:image")}
                                className={cn(
                                  "w-full h-11 bg-background text-xs",
                                  formData.icon.startsWith("data:image") && "text-secondary italic"
                                )}
                              />
                              {formData.icon.startsWith("data:image") && (
                                <Button 
                                  variant="destructive" 
                                  size="icon" 
                                  onClick={() => setFormData({...formData, icon: ""})} 
                                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full shadow-sm"
                                >
                                  <X size={12} />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                    <div className="space-y-4 pt-10 border-t border-border">
                      <Label>Ecossistema Digital</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.socialMedia.map((sm, idx) => (
                          <div key={idx} className="flex gap-2 items-center bg-background p-2 rounded-lg border border-border shadow-sm group/sm">
                            <Select 
                              value={sm.platform}
                              onValueChange={(val) => {
                                const newSM = [...formData.socialMedia];
                                newSM[idx].platform = val;
                                setFormData({...formData, socialMedia: newSM});
                              }}
                            >
                              <SelectTrigger className="w-[130px] h-10 border-none bg-surface-container/50 focus:ring-0">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                <SelectItem value="Instagram">Instagram</SelectItem>
                                <SelectItem value="Facebook">Facebook</SelectItem>
                                <SelectItem value="Twitter">X / Twitter</SelectItem>
                                <SelectItem value="YouTube">YouTube</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input 
                              type="text" 
                              placeholder="URL do perfil"
                              value={sm.url}
                              onChange={(e) => {
                                const newSM = [...formData.socialMedia];
                                newSM[idx].url = e.target.value;
                                setFormData({...formData, socialMedia: newSM});
                              }}
                              className="flex-1 h-10 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
                            />
                            <Button 
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newSM = formData.socialMedia.filter((_, i) => i !== idx);
                                setFormData({...formData, socialMedia: newSM});
                              }}
                              className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                            >
                              <X size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData({...formData, socialMedia: [...formData.socialMedia, { platform: "LinkedIn", url: "" }]})}
                        className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] hover:bg-secondary/10 mt-2"
                      >
                        <Plus size={14} className="mr-2" /> Adicionar Presença Digital
                      </Button>
                    </div>
                  </ExecutiveSurface>
                </div>
              </motion.div>
            )}

            {activeFormTab === "estrutura" && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <ExecutiveSurface padding="lg" radius="xl">
                        <ExecutiveHeading as="h4" className="mb-6 flex items-center gap-3">
                          <Activity size={18} className="text-secondary" /> Unidades de Negócio
                        </ExecutiveHeading>
                        <div className="flex gap-3 mb-6">
                          <Input 
                            type="text" 
                            placeholder="Ex: Medicina Laboratorial"
                            value={tempUnit}
                            onChange={(e) => setTempUnit(e.target.value)}
                            className="flex-1 h-12 bg-background shadow-sm"
                          />
                          <Button 
                            variant="secondary"
                            size="icon"
                            onClick={() => {
                              if (tempUnit) {
                                setFormData({...formData, unidadesNegocio: [...formData.unidadesNegocio, tempUnit]});
                                setTempUnit("");
                              }
                            }}
                            className="h-12 w-12 shrink-0"
                          >
                            <Plus size={20} />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.unidadesNegocio.map((u, i) => (
                            <span key={i} className="pl-4 pr-1 py-1 bg-background border border-border rounded-full text-xs font-medium text-muted-foreground flex items-center gap-2 shadow-sm">
                              {u}
                              <Button 
                                variant="ghost"
                                size="icon"
                                onClick={() => setFormData({...formData, unidadesNegocio: formData.unidadesNegocio.filter((_, idx) => idx !== i)})} 
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors w-6 h-6 rounded-full"
                              >
                                <X size={12} />
                              </Button>
                            </span>
                          ))}
                        </div>
                      </ExecutiveSurface>

                      <ExecutiveSurface padding="lg" radius="xl">
                        <ExecutiveHeading as="h4" className="mb-6 flex items-center gap-3">
                          <Landmark size={18} className="text-secondary" /> Centro de Custos Contábil
                        </ExecutiveHeading>
                        <div className="space-y-4">
                          <Label>Código / Nome do Centro de Custo</Label>
                          <Input 
                            type="text" 
                            placeholder="Ex: 01.01 - Administração Central"
                            value={formData.centroCustosContabil || ""}
                            onChange={(e) => setFormData({...formData, centroCustosContabil: e.target.value})}
                            className="w-full h-12 bg-background shadow-sm"
                          />
                        </div>
                      </ExecutiveSurface>
                    </div>

                   <div className="space-y-6">
                      <ExecutiveSurface padding="lg" radius="xl">
                        <ExecutiveHeading as="h4" className="mb-6 flex items-center gap-3">
                          <Building2 size={18} className="text-secondary" /> Filiais e Filas
                        </ExecutiveHeading>
                        <div className="space-y-4">
                          <Input 
                            type="text" placeholder="Nome da Unidade / Filial"
                            value={tempBranch.nome}
                            onChange={(e) => setTempBranch({...tempBranch, nome: e.target.value})}
                            className="w-full h-12 bg-background shadow-sm"
                          />
                          <div className="flex gap-3">
                            <Input 
                              type="text" placeholder="Cidade / UF"
                              value={tempBranch.cidade}
                              onChange={(e) => setTempBranch({...tempBranch, cidade: e.target.value})}
                              className="flex-1 h-12 bg-background shadow-sm"
                            />
                            <Button 
                              variant="secondary"
                              className="h-12"
                              onClick={() => {
                                if (tempBranch.nome) {
                                  setFormData({...formData, filiais: [...formData.filiais, tempBranch]});
                                  setTempBranch({ nome: "", cidade: "", cnpj: "" });
                                }
                              }}
                            >Adicionar</Button>
                          </div>
                        </div>
                        <div className="mt-8 space-y-3">
                          {formData.filiais.map((f, i) => (
                            <div key={i} className="flex justify-between items-center bg-background p-4 rounded-xl border border-border shadow-sm group">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center text-muted-foreground group-hover:text-secondary transition-all"><MapPin size={16} /></div>
                                <div>
                                  <p className="text-sm font-semibold text-foreground">{f.nome}</p>
                                  <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest">{f.cidade}</p>
                                </div>
                              </div>
                              <Button 
                                variant="ghost"
                                size="icon"
                                onClick={() => setFormData({...formData, filiais: formData.filiais.filter((_, idx) => idx !== i)})} 
                                className="text-destructive hover:bg-destructive/10 transition-all rounded-full"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          ))}
                          {formData.filiais.length === 0 && (
                            <p className="text-[10px] text-muted-foreground italic font-medium">Nenhuma filial cadastrada.</p>
                          )}
                        </div>
                      </ExecutiveSurface>
                   </div>
                </div>
              </motion.div>
            )}
            {activeFormTab === "fiscal" && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
                <ExecutiveSurface padding="lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-2">
                      <ExecutiveHeading as="h4" className="flex items-center gap-3">
                        <Landmark size={20} className="text-secondary" /> Enquadramento Tributário
                      </ExecutiveHeading>
                      <p className="text-[11px] text-muted-foreground font-medium lowercase italic">Defina o regime federal principal para automatização dos cálculos de rentabilidade.</p>
                    </div>
                    
                    <div className="flex bg-surface-container p-1 rounded-lg border border-border">
                      {["Simples Nacional", "Lucro Presumido", "Lucro Real"].map(regime => (
                        <Button
                          key={regime}
                          variant="ghost"
                          onClick={() => setFormData({...formData, regime})}
                          className={cn(
                            "flex-1 px-4 md:px-6 py-2 md:py-2.5 rounded-md text-sm font-medium transition-all",
                            formData.regime === regime 
                              ? "bg-background text-foreground shadow-sm" 
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {regime}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8 border-t border-border">
                    {formData.regime === "Lucro Real" && (
                      <div className="space-y-2">
                        <Label>Método de Apuração (LR)</Label>
                        <Select 
                          value={formData.regimeReal}
                          onValueChange={(val) => setFormData({...formData, regimeReal: val})}
                        >
                          <SelectTrigger className="w-full h-12 bg-background shadow-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cumulativo">Cumulativo (654/98)</SelectItem>
                            <SelectItem value="Não Cumulativo">Não Cumulativo (10.637/10.833)</SelectItem>
                            <SelectItem value="Híbrido">Híbrido (Misto)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {formData.regime === "Lucro Presumido" && (
                      <div className="space-y-2">
                        <Label>Cálculo Padrão IRPJ/CSLL</Label>
                        <Select 
                          value={formData.cnaePresuncao}
                          onValueChange={(val) => setFormData({...formData, cnaePresuncao: val})}
                        >
                          <SelectTrigger className="w-full h-12 bg-background shadow-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Venda de produtos / Mercadorias">Comércio (8% / 12%)</SelectItem>
                            <SelectItem value="Prestação de Serviços Genéricos">Serviços (32%)</SelectItem>
                            <SelectItem value="Serviços de Saúde">Saúde (8% / 12%)</SelectItem>
                            <SelectItem value="Serviços de Transporte">Transporte (16% / 32%)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Porte Declarado</Label>
                      <div className="h-12 px-4 bg-surface-container/50 border border-border rounded-lg text-sm font-medium text-muted-foreground flex items-center shadow-inner">
                        {formData.porte || "Não identificado"}
                      </div>
                    </div>
                  </div>
                </ExecutiveSurface>

                {/* 2. Main Tax Activity Section (Nested Grid) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                  
                  {/* Left Column: Revenue History (Simples only) or Detail Parameters */}
                  <div className="space-y-10">
                    {formData.regime === "Simples Nacional" ? (
                      <ExecutiveSurface padding="lg">
                        <div className="absolute top-0 left-0 w-full h-1 bg-secondary/20"></div>
                        
                        <div className="flex items-center justify-between">
                          <ExecutiveHeading as="h5" className="flex items-center gap-3">
                            <History size={18} className="text-secondary" /> Histórico RBT12
                          </ExecutiveHeading>
                          <label className="cursor-pointer px-5 py-2.5 bg-bg-card hover:bg-bg-surface text-secondary border border-border-main rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm">
                            <FileText size={14} /> Importar Dados
                            <input 
                              type="file" 
                              accept=".csv" 
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const text = event.target?.result as string;
                                  const lines = text.split("\n").filter(l => l.trim());
                                  const newHistory = [...formData.historicoFaturamento];
                                  lines.slice(0, 12).forEach((line, i) => {
                                    const parts = line.split(/[,;]/);
                                    if (parts.length >= 3) {
                                      newHistory[i] = {
                                        mes: parts[0].trim().toUpperCase(),
                                        ano: parts[1].trim(),
                                        valor: parseFloat(parts[2].replace(/[R$ \.]/g, "").replace(",", ".")) || 0
                                      };
                                    }
                                  });
                                  const newRbt12 = newHistory.reduce((acc, curr) => acc + (curr.valor || 0), 0);
                                  setFormData({ ...formData, historicoFaturamento: newHistory, rbt12: newRbt12 });
                                };
                                reader.readAsText(file, "UTF-8");
                              }}
                            />
                          </label>
                        </div>

                        <div className="bg-bg-card rounded-2xl border border-border-main overflow-hidden shadow-sm">
                          <div className="max-h-[460px] overflow-y-auto custom-scrollbar">
                            <Table>
                              <TableHeader className="sticky top-0 bg-bg-surface/95 backdrop-blur-md z-10">
                                <TableRow>
                                  <TableHead className="px-4 md:px-6 py-2.5 md:py-4 text-[10px] font-black text-text-dim uppercase tracking-widest">Referência</TableHead>
                                  <TableHead className="px-4 md:px-6 py-2.5 md:py-4 text-[10px] font-black text-text-dim uppercase tracking-widest text-right">Faturamento Bruto</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody className="divide-y divide-border-soft">
                                {(formData.historicoFaturamento || Array(12).fill({ mes: "", ano: "", valor: 0 })).map((item, idx) => (
                                  <TableRow key={idx} className="hover:bg-bg-surface/50 transition-colors group">
                                    <TableCell className="px-4 md:px-6 py-2.5 md:py-4">
                                      <div className="flex items-center gap-3">
                                        <select 
                                          value={item.mes}
                                          onChange={(e) => {
                                            const newHist = [...formData.historicoFaturamento];
                                            newHist[idx] = { ...newHist[idx], mes: e.target.value };
                                            setFormData({ ...formData, historicoFaturamento: newHist });
                                          }}
                                          className="bg-transparent text-[11px] font-black text-text-main uppercase outline-none cursor-pointer focus:text-secondary"
                                        >
                                          <option value="">Mês</option>
                                          {["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"].map(m => (
                                            <option key={m} value={m}>{m}</option>
                                          ))}
                                        </select>
                                        <span className="text-border-main font-bold">/</span>
                                        <select 
                                          value={item.ano}
                                          onChange={(e) => {
                                            const newHist = [...formData.historicoFaturamento];
                                            newHist[idx] = { ...newHist[idx], ano: e.target.value };
                                            setFormData({ ...formData, historicoFaturamento: newHist });
                                          }}
                                          className="bg-transparent text-[11px] font-black text-text-main uppercase outline-none cursor-pointer focus:text-secondary"
                                        >
                                          <option value="">Ano</option>
                                          {Array.from({ length: 11 }, (_, i) => (new Date().getFullYear() - 5 + i).toString()).map(y => (
                                            <option key={y} value={y}>{y}</option>
                                          ))}
                                        </select>
                                      </div>
                                    </TableCell>
                                    <TableCell className="px-4 md:px-6 py-2.5 md:py-4 text-right">
                                      <div className="flex items-center justify-end gap-2 group">
                                        <span className="text-[10px] font-black text-text-dim group-focus-within:text-secondary">R$</span>
                                        <input 
                                          type="number"
                                          value={item.valor}
                                          onChange={(e) => {
                                            const newHist = [...formData.historicoFaturamento];
                                            newHist[idx] = { ...newHist[idx], valor: parseFloat(e.target.value) || 0 };
                                            const newRbt12 = newHist.reduce((acc, curr) => acc + (curr.valor || 0), 0);
                                            setFormData({ ...formData, historicoFaturamento: newHist, rbt12: newRbt12 });
                                          }}
                                          className="w-32 bg-transparent text-sm font-black text-text-main text-right outline-none border-b border-transparent focus:border-secondary transition-all py-1"
                                          placeholder="0.00"
                                        />
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>

                        <div className="bg-primary p-8 rounded-standard relative overflow-hidden shadow-floating group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                           <div className="relative z-10 space-y-6">
                              <div>
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] block mb-4">Faturamento Mês Referência</label>
                                <div className="relative flex items-center">
                                  <span className="text-accent font-black text-sm absolute left-0">R$</span>
                                  <input 
                                    type="number"
                                    value={formData.faturamentoMensal}
                                    onChange={(e) => setFormData({...formData, faturamentoMensal: parseFloat(e.target.value) || 0})}
                                    className="w-full bg-transparent pl-8 py-2 text-3xl font-display font-black text-white outline-none border-b border-white/10 focus:border-accent transition-all"
                                    placeholder="0.00"
                                  />
                                </div>
                              </div>

                              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] block">Acumulado RBT12</label>
                                <div className="text-2xl font-display font-black text-accent tracking-tight">
                                  {formatCurrency(formData.rbt12 || 0)}
                                </div>
                              </div>
                           </div>
                        </div>
                      </ExecutiveSurface>
                    ) : (
                    <ExecutiveSurface padding="lg">
                       <div className="space-y-4">
                          <ExecutiveHeading as="h5" className="flex items-center gap-2">
                             <TrendingUp size={16} className="text-secondary" /> Volume de Faturamento
                          </ExecutiveHeading>
                          <div className="bg-bg-surface p-6 rounded-standard border border-border-main flex flex-col justify-center space-y-3">
                             <label className="text-label block px-1">
                               Receita Bruta Mensal (Ref.)
                             </label>
                             <div className="relative">
                               <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-3 text-text-dim border-r border-border-soft pr-4">
                                 <DollarSign size={20} />
                                 <span className="text-[9px] font-black uppercase tracking-widest">BRL</span>
                               </div>
                               <input 
                                 type="number"
                                 value={formData.faturamentoMensal}
                                 onChange={(e) => setFormData({...formData, faturamentoMensal: parseFloat(e.target.value) || 0})}
                                 className="w-full pl-28 pr-8 py-5 bg-bg-card border border-border-main rounded-standard text-2xl font-display font-black text-text-main outline-none focus:border-secondary transition-all shadow-inner-soft"
                                 placeholder="0,00"
                               />
                             </div>
                          </div>
                       </div>
                    </ExecutiveSurface>
                    )}
                  </div>

                  {/* Right Column: Actitivy & CNAEs */}
                  <div className="space-y-10">
                    <div className="bg-white p-8 rounded-[32px] border border-border shadow-sm space-y-8">
                       <div className="flex items-center justify-between">
                          <ExecutiveHeading as="h5" className="flex items-center gap-2">
                             <Activity size={16} className="text-primary" /> Segregação de Atividade
                          </ExecutiveHeading>
                          {formData.regime === "Simples Nacional" && (
                             <span className="px-3 py-1 bg-primary/5 text-primary text-[9px] font-black uppercase rounded-full border border-primary/10">Base Anexos I a V</span>
                          )}
                       </div>

                       <div className="space-y-6">
                         {/* Primary CNAE Detail Card */}
                         <div className="bg-slate-50/80 p-6 rounded-[28px] border border-border space-y-6">
                            <div className="flex items-start gap-4">
                               <div className="w-12 h-12 bg-white rounded-2xl border border-border flex items-center justify-center text-primary shrink-0 shadow-sm">
                                  <ShieldCheck size={24} />
                               </div>
                               <div className="space-y-1 min-w-0 flex-1">
                                  <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] block">Atividade Principal</label>
                                  <p className="text-[11px] font-bold text-muted-foreground">{formData.cnae}</p>
                               </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                               {formData.regime === "Simples Nacional" ? (
                                  <div className="space-y-2">
                                     <Label>Enquadramento do Anexo</Label>
                                     <Select 
                                       value={formData.cnaeAnexo}
                                       onValueChange={(val) => setFormData({...formData, cnaeAnexo: val})}
                                     >
                                        <SelectTrigger className="w-full h-12 bg-background shadow-sm">
                                           <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                           {["Anexo I - Comércio", "Anexo II - Indústria", "Anexo III - Serviços", "Anexo IV - Serviços Esp.", "Anexo V - Serviços F.R"].map((anexo, i) => (
                                              <SelectItem key={i} value={`Anexo ${["I","II","III","IV","V"][i]}`}>{anexo}</SelectItem>
                                           ))}
                                        </SelectContent>
                                     </Select>
                                  </div>
                               ) : formData.regime === "Lucro Presumido" ? (
                                  <div className="space-y-2">
                                     <Label>Presunção IRPJ/CSLL</Label>
                                     <Input 
                                       type="text"
                                       readOnly
                                       value={formData.cnaePresuncao}
                                       className="w-full h-12 bg-surface-container/50 text-muted-foreground shadow-sm"
                                     />
                                  </div>
                               ) : (
                                  /* Lucro Real */
                                  formData.regimeReal === "Híbrido" ? (
                                    <div className="space-y-2">
                                      <Label>Enquadramento PIS/COFINS</Label>
                                      <Select 
                                        value={formData.cnaeRegimeReal}
                                        onValueChange={(val) => setFormData({...formData, cnaeRegimeReal: val})}
                                      >
                                        <SelectTrigger className="w-full h-12 bg-background shadow-sm">
                                           <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Cumulativo">Cumulativo</SelectItem>
                                          <SelectItem value="Não Cumulativo">Não Cumulativo</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      <Label>Enquadramento Automático (LR)</Label>
                                      <div className="px-4 h-12 flex items-center bg-surface-container/50 rounded-lg text-sm font-medium text-muted-foreground italic border border-border shadow-inner">
                                        Aplicado regime geral: {formData.regimeReal}
                                      </div>
                                    </div>
                                  )
                               )}
                            </div>
                         </div>

                         {/* Secondary CNAEs Section */}
                         <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                               <Label className="text-[10px] font-black uppercase tracking-widest shrink-0">Secundários ({formData.cnaesSecundarios.length})</Label>
                               <div className="h-px bg-border flex-1 mx-4"></div>
                               <Button 
                                 variant="ghost"
                                 size="sm"
                                 onClick={() => {
                                    const newCnae = { codigo: "", descricao: "", anexo: "Anexo I", presuncao: "Venda de produtos / Mercadorias", regimeReal: "Não Cumulativo" };
                                    setFormData({...formData, cnaesSecundarios: [...formData.cnaesSecundarios, newCnae]});
                                 }}
                                 className="text-[9px] font-black text-secondary uppercase hover:bg-secondary/10"
                               >
                                  <Plus size={14} className="mr-1" /> Cadastrar
                               </Button>
                            </div>

                            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                               {formData.cnaesSecundarios.map((c, idx) => (
                                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-border group space-y-4">
                                     <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 text-[10px] font-black text-muted-foreground leading-tight">
                                           {c.codigo} - {c.descricao}
                                        </div>
                                        <Button 
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => setFormData({...formData, cnaesSecundarios: formData.cnaesSecundarios.filter((_, i) => i !== idx)})}
                                          className="text-destructive hover:bg-destructive/10 rounded-full shrink-0 w-8 h-8"
                                        >
                                           <X size={14} />
                                        </Button>
                                     </div>
                                     
                                     <div className="grid grid-cols-1 gap-2 pt-2 border-t border-border">
                                        {formData.regime === "Simples Nacional" && (
                                           <Select 
                                             value={c.anexo}
                                             onValueChange={(val) => {
                                                const newList = [...formData.cnaesSecundarios];
                                                newList[idx] = { ...newList[idx], anexo: val };
                                                setFormData({ ...formData, cnaesSecundarios: newList });
                                             }}
                                           >
                                              <SelectTrigger className="w-full h-8 bg-background shadow-sm text-[9px] font-black uppercase">
                                                 <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="Anexo I">Anexo I</SelectItem>
                                                <SelectItem value="Anexo II">Anexo II</SelectItem>
                                                <SelectItem value="Anexo III">Anexo III</SelectItem>
                                                <SelectItem value="Anexo IV">Anexo IV</SelectItem>
                                                <SelectItem value="Anexo V">Anexo V</SelectItem>
                                              </SelectContent>
                                           </Select>
                                        )}
                                        {formData.regime === "Lucro Presumido" && (
                                           <Select 
                                             value={c.presuncao}
                                             onValueChange={(val) => {
                                                const newList = [...formData.cnaesSecundarios];
                                                newList[idx] = { ...newList[idx], presuncao: val };
                                                setFormData({ ...formData, cnaesSecundarios: newList });
                                             }}
                                           >
                                              <SelectTrigger className="w-full h-8 bg-background shadow-sm text-[9px] font-black uppercase">
                                                 <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="Venda de produtos / Mercadorias">Venda de produtos</SelectItem>
                                                <SelectItem value="Prestação de Serviços Genéricos">Serviços Genéricos</SelectItem>
                                                <SelectItem value="Serviços de Saúde">Serviços de Saúde</SelectItem>
                                                <SelectItem value="Serviços de Transporte">Transporte</SelectItem>
                                              </SelectContent>
                                           </Select>
                                        )}
                                        {formData.regime === "Lucro Real" && formData.regimeReal === "Híbrido" && (
                                           <Select 
                                             value={c.regimeReal}
                                             onValueChange={(val) => {
                                                const newList = [...formData.cnaesSecundarios];
                                                newList[idx] = { ...newList[idx], regimeReal: val };
                                                setFormData({ ...formData, cnaesSecundarios: newList });
                                             }}
                                           >
                                              <SelectTrigger className="w-full h-8 bg-background shadow-sm text-[9px] font-black uppercase">
                                                 <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="Cumulativo">Cumulativo</SelectItem>
                                                <SelectItem value="Não Cumulativo">Não Cumulativo</SelectItem>
                                              </SelectContent>
                                           </Select>
                                        )}
                                        {formData.regime === "Lucro Real" && formData.regimeReal !== "Híbrido" && (
                                           <div className="px-3 h-8 flex items-center justify-center bg-surface-container/50 rounded-lg text-[9px] font-black text-muted-foreground uppercase italic border border-border shadow-inner">
                                              Regime LR: {formData.regimeReal}
                                           </div>
                                        )}
                                     </div>
                                  </div>
                               ))}
                            </div>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* 3. Payroll Taxes Section */}
                <div className="bg-white p-8 rounded-[32px] border border-border shadow-sm space-y-8">
                  <div className="space-y-1">
                    <ExecutiveHeading as="h5" className="flex items-center gap-2">
                       <Users size={20} className="text-secondary" /> Encargos de Folha de Pagamento
                    </ExecutiveHeading>
                    <p className="text-[11px] text-muted-foreground font-medium lowercase">Configure os encargos incidentes sobre a folha de pagamento para as simulações.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <Label>FGTS (%)</Label>
                      <Input 
                        type="number"
                        value={formData.folhaFgts}
                        onChange={(e) => setFormData({...formData, folhaFgts: parseFloat(e.target.value) || 0})}
                        className="w-full h-12 bg-background shadow-sm font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>INSS Patronal (%)</Label>
                      <Input 
                        type="number"
                        value={formData.folhaInssPatronal}
                        onChange={(e) => setFormData({...formData, folhaInssPatronal: parseFloat(e.target.value) || 0})}
                        className="w-full h-12 bg-background shadow-sm font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>RAT / FAP (%)</Label>
                      <Input 
                        type="number"
                        step="0.01"
                        value={formData.folhaInssRat}
                        onChange={(e) => setFormData({...formData, folhaInssRat: parseFloat(e.target.value) || 0})}
                        className="w-full h-12 bg-background shadow-sm font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Terceiros / Outros (%)</Label>
                      <Input 
                        type="number"
                        step="0.01"
                        value={formData.folhaInssTerceiros}
                        onChange={(e) => setFormData({...formData, folhaInssTerceiros: parseFloat(e.target.value) || 0})}
                        className="w-full h-12 bg-background shadow-sm font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>INSS Funcionário (Médio %)</Label>
                      <Input 
                        type="number"
                        value={formData.folhaInssFuncionario}
                        onChange={(e) => setFormData({...formData, folhaInssFuncionario: parseFloat(e.target.value) || 0})}
                        className="w-full h-12 bg-background shadow-sm font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Multa FGTS (%)</Label>
                      <Input 
                        type="number"
                        value={formData.folhaMultaFgts}
                        onChange={(e) => setFormData({...formData, folhaMultaFgts: parseFloat(e.target.value) || 0})}
                        className="w-full h-12 bg-background shadow-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block px-1">Tabela de IRRF (Folha de Pagamento)</label>
                    <div className="bg-slate-50/50 rounded-2xl border border-border overflow-hidden">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-100/50">
                            <th className="px-4 md:px-6 py-2 md:py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Base de Cálculo (Até R$)</th>
                            <th className="px-4 md:px-6 py-2 md:py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Alíquota (%)</th>
                            <th className="px-4 md:px-6 py-2 md:py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Dedução (R$)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {formData.folhaTabelaIRRF.map((item, idx) => (
                            <tr key={idx}>
                              <td className="px-4 md:px-6 py-2 md:py-3">
                                <Input 
                                  type="number"
                                  value={item.base}
                                  onChange={(e) => {
                                    const newTabela = [...formData.folhaTabelaIRRF];
                                    newTabela[idx] = { ...newTabela[idx], base: parseFloat(e.target.value) || 0 };
                                    setFormData({ ...formData, folhaTabelaIRRF: newTabela });
                                  }}
                                  className="w-full h-8 bg-transparent border-transparent focus-visible:border-secondary shadow-none font-bold"
                                />
                              </td>
                              <td className="px-4 md:px-6 py-2 md:py-3">
                                <Input 
                                  type="number"
                                  value={item.aliquota}
                                  onChange={(e) => {
                                    const newTabela = [...formData.folhaTabelaIRRF];
                                    newTabela[idx] = { ...newTabela[idx], aliquota: parseFloat(e.target.value) || 0 };
                                    setFormData({ ...formData, folhaTabelaIRRF: newTabela });
                                  }}
                                  className="w-full h-8 bg-transparent border-transparent focus-visible:border-secondary shadow-none font-bold"
                                />
                              </td>
                              <td className="px-4 md:px-6 py-2 md:py-3">
                                <Input 
                                  type="number"
                                  value={item.deducao}
                                  onChange={(e) => {
                                    const newTabela = [...formData.folhaTabelaIRRF];
                                    newTabela[idx] = { ...newTabela[idx], deducao: parseFloat(e.target.value) || 0 };
                                    setFormData({ ...formData, folhaTabelaIRRF: newTabela });
                                  }}
                                  className="w-full h-8 bg-transparent border-transparent focus-visible:border-secondary shadow-none font-bold"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeFormTab === "contato" && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
                <ExecutiveSurface padding="lg">
                  <ExecutiveHeading as="h3" className="mb-10 flex items-center gap-3">
                    <ShieldCheck size={20} className="text-primary" /> Contato Principal (Decisor)
                  </ExecutiveHeading>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-2">
                      <Label>Nome Completo</Label>
                      <Input 
                        type="text" 
                        value={formData.contato.nome}
                        onChange={(e) => {
                          setFormData({...formData, contato: {...formData.contato, nome: e.target.value}});
                          validateField("contatoNome", e.target.value);
                        }}
                        className={cn(
                          "w-full h-12 bg-background font-bold shadow-sm",
                          validationErrors.contatoNome ? "border-destructive focus-visible:ring-destructive" : ""
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cargo / Função</Label>
                      <Input 
                        type="text" 
                        value={formData.contato.funcao}
                        onChange={(e) => setFormData({...formData, contato: {...formData.contato, funcao: e.target.value}})}
                        className="w-full h-12 bg-background font-bold shadow-sm"
                      />
                    </div>
                     <div className="space-y-2">
                      <Label>E-mail Corporativo</Label>
                      <Input 
                        type="email" 
                        value={formData.contato.email}
                        onChange={(e) => {
                          setFormData({...formData, contato: {...formData.contato, email: e.target.value}});
                          validateField("email", e.target.value);
                        }}
                        className={cn(
                          "w-full h-12 bg-background font-bold shadow-sm",
                          validationErrors.email ? "border-destructive focus-visible:ring-destructive" : ""
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefone / WhatsApp</Label>
                      <Input 
                        type="tel" 
                        value={formData.contato.telefone}
                        onChange={(e) => setFormData({...formData, contato: {...formData.contato, telefone: e.target.value}})}
                        className="w-full h-12 bg-background font-bold shadow-sm"
                      />
                    </div>
                  </div>
                </ExecutiveSurface>

                <ExecutiveSurface padding="lg" radius="xl">
                   <ExecutiveHeading as="h4" className="mb-10 flex items-center gap-3">
                     <Users size={18} className="text-secondary" /> Contatos Adicionais
                   </ExecutiveHeading>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input 
                            type="text" placeholder="Nome" 
                            value={tempContact.nome}
                            onChange={(e) => setTempContact({...tempContact, nome: e.target.value})}
                            className="w-full h-12 bg-background shadow-sm"
                          />
                          <Input 
                            type="text" placeholder="Cargo" 
                            value={tempContact.cargo}
                            onChange={(e) => setTempContact({...tempContact, cargo: e.target.value})}
                            className="w-full h-12 bg-background shadow-sm"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input 
                            type="email" placeholder="E-mail" 
                            value={tempContact.email}
                            onChange={(e) => setTempContact({...tempContact, email: e.target.value})}
                            className="w-full h-12 bg-background shadow-sm"
                          />
                          <div className="flex gap-2">
                            <Input 
                              type="tel" placeholder="Telefone" 
                              value={tempContact.tel}
                              onChange={(e) => setTempContact({...tempContact, tel: e.target.value})}
                              className="flex-1 h-12 bg-background shadow-sm"
                            />
                            <Button 
                              variant="secondary"
                              size="icon"
                              className="h-12 w-12 shrink-0"
                              onClick={() => {
                                if (tempContact.nome) {
                                  setFormData({...formData, contatosAdicionais: [...formData.contatosAdicionais, tempContact]});
                                  setTempContact({ nome: "", email: "", tel: "", cargo: "" });
                                }
                              }}
                            >
                              <Plus size={18} />
                            </Button>
                          </div>
                        </div>
                     </div>

                     <div className="space-y-3">
                        {formData.contatosAdicionais.map((c, i) => (
                          <div key={i} className="flex items-center justify-between bg-background p-4 rounded-xl border border-border shadow-sm group">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center text-muted-foreground group-hover:text-secondary transition-all shadow-sm"><Users size={16} /></div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">{c.nome} <span className="text-muted-foreground font-medium text-[10px] ml-2 uppercase tracking-widest">({c.cargo})</span></p>
                                <p className="text-[11px] text-muted-foreground font-medium italic">{c.email} • {c.tel}</p>
                              </div>
                            </div>
                            <Button 
                              variant="ghost"
                              size="icon"
                              onClick={() => setFormData({...formData, contatosAdicionais: formData.contatosAdicionais.filter((_, idx) => idx !== i)})}
                              className="text-destructive hover:bg-destructive/10 transition-all rounded-full"
                            >
                              <X size={18} />
                            </Button>
                          </div>
                        ))}
                        {formData.contatosAdicionais.length === 0 && (
                          <div className="h-full flex items-center justify-center border-2 border-dashed border-border rounded-xl p-8 text-muted-foreground text-xs font-medium uppercase tracking-widest italic">
                            Nenhum contato adicional
                          </div>
                        )}
                     </div>
                    </div>
                  </ExecutiveSurface>
              </motion.div>
            )}

            {activeFormTab === "usuarios" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
                {editingId ? (
                  <ClientUserManager clientId={editingId} />
                ) : (
                  <ExecutiveSurface padding="lg">
                    <div className="w-24 h-24 bg-card rounded-md flex items-center justify-center text-muted-foreground mx-auto shadow-md border border-border">
                        <Key size={40} className="opacity-50" />
                    </div>
                    <div className="space-y-2">
                      <ExecutiveHeading as="h4">Aguardando Cadastro</ExecutiveHeading>
                      <p className="text-body-sm text-muted-foreground font-medium uppercase tracking-widest max-w-[300px] mx-auto leading-relaxed">Para gerenciar usuários e acessos, conclua primeiro o salvamento dos dados básicos da empresa.</p>
                    </div>
                  </ExecutiveSurface>
                )}
              </div>
            )}

            {activeFormTab === "pessoal" && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                 {editingId ? (
                   <EmployeeManager clientId={editingId} clientConfig={formData} />
                 ) : (
                   <ExecutiveSurface padding="lg" className="w-full text-center space-y-6 py-24">
                      <div className="w-20 h-20 bg-card rounded-2xl flex items-center justify-center text-muted-foreground shadow-sm border border-border mx-auto">
                          <AlertCircle size={32} />
                      </div>
                      <div className="space-y-2 w-full max-w-[400px] mx-auto">
                        <ExecutiveHeading as="h4">Salve o cliente primeiro</ExecutiveHeading>
                        <p className="text-body-sm text-muted-foreground">Para gerenciar o quadro de pessoal, você precisa primeiro concluir o cadastro básico do cliente.</p>
                      </div>
                   </ExecutiveSurface>
                 )}
              </motion.div>
            )}

            {activeFormTab === "relatorio_ia" && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                {(formData as any).aiAnalysis ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-10">
                      <ExecutiveSurface padding="lg">
                        <ExecutiveHeading as="h4" className="flex items-center gap-3">
                          <AlertCircle size={18} className="text-destructive" /> Desafios Estratégicos
                        </ExecutiveHeading>
                        <div className="space-y-4">
                          {((formData as any).aiAnalysis.challenges || []).map((c: string, i: number) => (
                            <div key={i} className="text-body-sm text-muted-foreground font-medium leading-relaxed bg-surface-container p-4 rounded-md border border-border">
                              <MarkdownText text={c} />
                            </div>
                          ))}
                        </div>
                      </ExecutiveSurface>

                      <ExecutiveSurface padding="lg">
                        <ExecutiveHeading as="h4" className="flex items-center gap-3">
                          <TrendingUp size={18} className="text-success" /> Oportunidades de Crescimento
                        </ExecutiveHeading>
                        <div className="space-y-4">
                          {((formData as any).aiAnalysis.growthSuggestions || []).map((c: string, i: number) => (
                            <div key={i} className="text-body-sm text-muted-foreground font-medium leading-relaxed bg-surface-container p-4 rounded-md border border-border">
                              <MarkdownText text={c} />
                            </div>
                          ))}
                        </div>
                      </ExecutiveSurface>
                    </div>

                    <div className="space-y-10">
                      <div className="bg-primary p-10 rounded-md text-primary-foreground space-y-6 shadow-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                        <ExecutiveHeading as="h4" className="flex items-center gap-2">
                          <ShieldCheck size={14} /> Governança & Estrutura
                        </ExecutiveHeading>
                        <div className="text-body-sm font-medium leading-relaxed text-primary-foreground/90 italic">
                          "<MarkdownText text={((formData as any).aiAnalysis?.governance || "N/A")} />"
                        </div>
                      </div>

                      <ExecutiveSurface padding="lg">
                        <ExecutiveHeading as="h4">Fluxo Operacional</ExecutiveHeading>
                        <div className="text-body-sm text-muted-foreground font-medium leading-relaxed bg-surface-container p-5 rounded-md border border-border border-dashed italic">
                          <MarkdownText text={((formData as any).aiAnalysis?.operationalFlow || "N/A")} />
                        </div>
                      </ExecutiveSurface>

                      <ExecutiveSurface padding="lg">
                        <ExecutiveHeading as="h4" className="flex items-center gap-3">
                          <LayoutGrid size={18} className="text-secondary" /> Dashboards Sugeridos
                        </ExecutiveHeading>
                        <div className="flex flex-wrap gap-3">
                          {((formData as any).aiAnalysis?.dashboardIdeas || []).map((c: string, i: number) => (
                            <span key={i} className="px-4 py-2 bg-secondary/10 text-secondary text-[10px] font-medium uppercase rounded-full border border-secondary/20">
                              <MarkdownText text={c} />
                            </span>
                          ))}
                        </div>
                      </ExecutiveSurface>
                    </div>
                  </div>
                ) : (
                  <ExecutiveSurface padding="lg" className="w-full text-center space-y-6 py-24">
                    <div className="w-20 h-20 bg-card rounded-2xl flex items-center justify-center text-secondary shadow-sm border border-border mx-auto">
                        <Sparkles size={32} />
                    </div>
                    <div className="space-y-2 w-full max-w-[400px] mx-auto">
                      <ExecutiveHeading as="h4">Sem Análise de IA</ExecutiveHeading>
                      <p className="text-body-sm text-muted-foreground">Este cliente não possui um relatório gerencial automatizado vinculado no momento.</p>
                    </div>
                  </ExecutiveSurface>
                )}
              </motion.div>
            )}

            {["importacao", "acessos", "auditoria"].map(tab => (
              activeFormTab === tab && !editingId && (
                <ExecutiveSurface padding="lg" className="w-full text-center space-y-6 py-24">
                  <div className="w-20 h-20 bg-card rounded-2xl flex items-center justify-center text-muted-foreground shadow-sm border border-border mx-auto">
                      <AlertCircle size={32} />
                  </div>
                  <div className="space-y-2 w-full max-w-[400px] mx-auto">
                    <ExecutiveHeading as="h4">Aguardando Cadastro</ExecutiveHeading>
                    <p className="text-body-sm text-muted-foreground">Para visualizar esta seção, você precisa primeiro concluir o cadastro básico da empresa.</p>
                  </div>
                </ExecutiveSurface>
              )
            ))}
          </div>
        </div>
      </div>

    );
};
