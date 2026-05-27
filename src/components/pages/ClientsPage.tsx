
import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  Building2, 
  MapPin, 
  Users, 
  Activity,
  FileText,
  LayoutGrid,
  Loader2,
  X,
  ShieldCheck,
  Briefcase,
  History,
  DollarSign,
  Landmark,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Link2,
  Image as ImageIcon,
  Upload,
  Key,
  Save,
  Calendar,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, where, getDocs, writeBatch, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { PageHeader, StatusBadge, MarkdownText } from "../Common";
import { DATA } from "../../data";
import { cn, formatCurrency, validateCNPJ, formatDoc } from "../../lib/utils";
import { useDataTable } from "../../hooks/useDataTable";
import { EmployeeManager } from "../EmployeeManager";
// Removed GenerateAICompanyModal import
import { ClientImportHistory } from "../ClientImportHistory";
import { ClientLoginAudit } from "../ClientLoginAudit";
import { ClientUserManager } from "../ClientUserManager";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export function ClientsPage({ clients, setClients, setSelectedClient, isMaster, isPartner, userPartnerIds }: any) {
  const [view, setView] = useState<"list" | "form">("list");
  const [loading, setLoading] = useState(false);
  const [cnpjQuery, setCnpjQuery] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [clientToDelete, setClientToDelete] = useState<{ id: string, name: string } | null>(null);
// isAIModalOpen removed
  const [showSegmentSuggestions, setShowSegmentSuggestions] = useState(false);
  const [fullClients, setFullClients] = useState<any[]>([]);

  useEffect(() => {
    if (isMaster) {
      const unsubscribe = onSnapshot(query(collection(db, "clients")), (snapshot) => {
        setFullClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    } else if (clients && clients.length > 0) {
      const clientIds = clients.map((c: any) => c.id);
      if (clientIds.length <= 10) {
        const unsubscribe = onSnapshot(query(collection(db, "clients"), where("__name__", "in", clientIds)), (snapshot) => {
          setFullClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
      } else {
        const unsubscribe = onSnapshot(query(collection(db, "clients")), (snapshot) => {
          const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setFullClients(all.filter(c => clientIds.includes(c.id)));
        });
        return () => unsubscribe();
      }
    } else {
      setFullClients([]);
    }
  }, [isMaster, clients]);
  
  const allSegments = useMemo(() => {
    const segments = new Set<string>();
    fullClients.forEach((c: any) => {
      if (c.segmentoAtuacao) segments.add(c.segmentoAtuacao);
      if (c.segmento) segments.add(c.segmento);
    });
    return Array.from(segments).sort();
  }, [fullClients]);
  
  const clientTemplate = {
    razao: "",
    fantasia: "",
    cnpj: "",
    segmento: "Serviços",
    subsetor: "Consultoria",
    regime: "Lucro Presumido",
    regimeReal: "Não Cumulativo",
    rbt12: 0,
    faturamentoMensal: 0,
    historicoFaturamento: Array(12).fill(null).map(() => ({ mes: "", ano: "", valor: 0 })),
    porte: "Médio Porte",
    cidade: "",
    endereco: "",
    cnae: "",
    cnaeAnexo: "Anexo I",
    cnaePresuncao: "Venda de produtos / Mercadorias",
    cnaeRegimeReal: "Não Cumulativo",
    cnaesSecundarios: [] as { 
      codigo: string; 
      descricao: string; 
      anexo: string;
      presuncao: string;
      regimeReal: string;
    }[],
    contatosAdicionais: [] as { nome: string; email: string; tel: string; cargo: string }[],
    dataFundacao: "",
    capitalSocial: 0,
    socios: [] as { nome: string; participacao: number }[],
    filiais: [] as { nome: string; cidade: string; cnpj: string }[],
    unidadesNegocio: [] as string[],
    contato: {
      nome: "",
      funcao: "",
      telefone: "",
      email: ""
    },
    status: "Em Implantação",
    notasAdicionais: "",
    website: "",
    socialMedia: [
      { platform: "LinkedIn", url: "" },
      { platform: "Instagram", url: "" }
    ],
    logo: "",
    icon: "",
    segmentoAtuacao: "",
    centroCustosContabil: "",
    folhaFgts: 8,
    folhaInssPatronal: 20,
    folhaInssRat: 2,
    folhaInssTerceiros: 5.8,
    folhaInssFuncionario: 11,
    folhaMultaFgts: 40,
    folhaTabelaIRRF: [
      { base: 2259.20, aliquota: 0, deducao: 0 },
      { base: 2826.65, aliquota: 7.5, deducao: 169.44 },
      { base: 3751.05, aliquota: 15, deducao: 381.44 },
      { base: 4664.68, aliquota: 22.5, deducao: 662.77 },
      { base: 999999999, aliquota: 27.5, deducao: 896.00 }
    ],
    isModel: false,
    modelAxisDescriptions: {
      governanca: "",
      cultura: "",
      financeiro: "",
      inovacao: "",
      marketing: "",
      comercial: "",
      operacional: ""
    },
    partnerId: "",
    approvalStatus: "Approved",
    type: "for-profit", // "for-profit" | "third-sector"
    origin: "nacional", // "nacional" | "internacional"
    currency: "BRL",    // "BRL" | "USD" | "EUR" | "GBP"
    projectBased: false
  };

  const [formData, setFormData] = useState(clientTemplate);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [tempUnit, setTempUnit] = useState("");

  useEffect(() => {
    const el = document.getElementById("debug-clientspage");
    if (el) {
      el.textContent = `ClientsPage State:
view: ${view}
activeFormTab: ${activeFormTab}
editingId: ${editingId}
loading: ${loading}
`;
    }
  });

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "cnpj" && formData.origin === "nacional") {
      const clean = value.replace(/\D/g, "");
      if (clean && !validateCNPJ(clean)) {
        error = "CNPJ inválido. Verifique os dígitos verificadores.";
      }
    } else if (name === "cnpj" && formData.origin === "internacional") {
      if (!value.trim()) error = "ID Fiscal / Registration Number é obrigatório";
    } else if (name === "razao") {
      if (!value.trim()) error = "Razão Social é obrigatória";
    } else if (name === "fantasia") {
      if (!value.trim()) error = "Nome Fantasia é obrigatório";
    } else if (name === "contatoNome") {
      if (value.length > 0 && value.length < 3) {
        error = "Nome muito curto";
      }
    } else if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        error = "Formato de e-mail inválido";
      }
    }
    setValidationErrors(prev => ({ ...prev, [name]: error }));
  };

  const [tempBranch, setTempBranch] = useState({ nome: "", cidade: "", cnpj: "" });
  const [tempContact, setTempContact] = useState({ nome: "", email: "", tel: "", cargo: "" });
  const [activeFormTab, setActiveFormTab] = useState<"dados" | "estrutura" | "fiscal" | "contato" | "usuarios" | "pessoal" | "relatorio_ia" | "importacao" | "acessos" | "auditoria">("dados");
  const [showAllBranches, setShowAllBranches] = useState(false);
  const [partners, setPartners] = useState<any[]>([]);

  // Fetch partners
  useEffect(() => {
    const q = query(collection(db, "partners"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPartners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Auto-fetch CNPJ when 14 digits are typed
  useEffect(() => {
    const cleanCnpj = cnpjQuery.replace(/\D/g, "");
    if (cleanCnpj.length === 14 && !loading && !editingId) {
      fetchCNPJ();
    }
  }, [cnpjQuery]);

  const openAdd = () => {
    setEditingId(null);
    setFormData(clientTemplate);
    setValidationErrors({});
    setCnpjQuery("");
    setError("");
    setView("form");
    setActiveFormTab("dados");
  };

  const openEdit = (client: any) => {
    setEditingId(client.id);
    const data = { ...clientTemplate, ...client };
    setFormData(data);
    setCnpjQuery(client.cnpj);
    setError("");
    setView("form");
    setActiveFormTab("dados");
    
    // Initial validation for editing
    validateField("cnpj", client.cnpj);
    validateField("razao", data.razao);
    validateField("fantasia", data.fantasia);
    validateField("email", data.contato?.email || "");
    validateField("contatoNome", data.contato?.nome || "");
  };

  const fetchCNPJ = async () => {
    if (!cnpjQuery) return;
    setLoading(true);
    setError("");
    try {
      const cleanCnpj = cnpjQuery.replace(/\D/g, "");
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
      if (!response.ok) throw new Error("CNPJ não encontrado ou erro na busca.");
      const data = await response.json();
      
      setFormData({
        ...formData,
        razao: data.razao_social || "",
        fantasia: data.nome_fantasia || data.razao_social || "",
        cnpj: data.cnpj || cleanCnpj,
        cidade: `${data.municipio}/${data.uf}`,
        endereco: `${data.logradouro}, ${data.numero} - ${data.bairro}, ${data.municipio} - ${data.uf}, ${data.cep}`,
        cnae: `${data.cnae_fiscal} (${data.cnae_fiscal_descricao})`,
        cnaeAnexo: "Anexo I",
        cnaePresuncao: "Venda de produtos / Mercadorias",
        cnaeRegimeReal: "Não Cumulativo",
        cnaesSecundarios: (data.cnaes_secundarios || []).map((c: any) => ({
          codigo: c.codigo,
          descricao: c.descricao,
          anexo: "Anexo I",
          presuncao: "Venda de produtos / Mercadorias",
          regimeReal: "Não Cumulativo"
        })),
        rbt12: 0,
        faturamentoMensal: 0,
        historicoFaturamento: Array(12).fill(null).map(() => ({ mes: "", ano: "", valor: 0 })),
        contatosAdicionais: [],
        dataFundacao: data.data_inicio_atividade ? new Date(data.data_inicio_atividade).toLocaleDateString("pt-BR") : "",
        capitalSocial: data.capital_social || 0,
        socios: (data.qsa || []).map((s: any, _: number, arr: any[]) => ({
          nome: s.nome_socio || s.nome || s.nome_socio_pessoa_fisica || "Sócio não identificado",
          participacao: s.percentual_capital || s.percentual_capital_social || s.participacao || s.percentual || (arr.length === 1 ? 100 : 0)
        })),
        porte: data.porte === "DEMAIS" ? "Médio Porte" : data.porte || "Médio Porte",
        segmento: data.cnae_fiscal_descricao || "Serviços",
        // Garantir que novos cadastros via CNPJ sempre iniciem em Implantação
        status: editingId ? formData.status : "Em Implantação",
      });
      
      // Clear validation errors for auto-populated fields
      setValidationErrors(prev => ({
        ...prev,
        cnpj: "",
        razao: "",
        fantasia: ""
      }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "logo" | "icon") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 500KB for Base64 storage)
    if (file.size > 512 * 1024) {
      alert("A imagem é muito grande. Por favor, escolha uma imagem com menos de 500KB para melhor performance.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData(prev => ({ ...prev, [field]: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!auth.currentUser) {
      alert("Você precisa estar logado para salvar um cliente. Clique em 'Entrar com Google' na barra lateral.");
      return;
    }

    setLoading(true);
    try {
      const clientData = {
        ...formData,
        ownerId: auth.currentUser.uid,
        updatedAt: serverTimestamp()
      };

      let clientId = editingId;

      if (editingId) {
        await updateDoc(doc(db, "clients", editingId), clientData);
      } else {
        // Create new client in Firestore
        const clientFinalData = {
          ...clientData,
          approvalStatus: isMaster ? "Approved" : "Pending",
          // Force partnerId if user is a partner
          partnerId: (!isMaster && isPartner && userPartnerIds?.length > 0) ? userPartnerIds[0] : clientData.partnerId,
          createdAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, "clients"), clientFinalData);
        clientId = docRef.id;
        
        // Automate Account Plan creation for the new client from standard plan
        console.log(`Creating default account plan for client ${clientId}...`);
        const batch = DATA.accountPlanPadrão.map(acc => {
           return addDoc(collection(db, "account_plans"), {
            ...acc,
            clientId: clientId,
            planType: "accounting",
            status: acc.status || "Ativa",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            createdBy: auth.currentUser?.uid
          });
        });
        await Promise.all(batch);
      }
      
      setView("list");
      setEditingId(null);
    } catch (error) {
      console.error("Error saving client:", error);
      alert("Erro ao salvar cliente: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!clientToDelete) return;

    setLoading(true);
    try {
      const clientId = clientToDelete.id;
      
      // Collections associated with a client
      const collectionsToClean = [
        "account_plans",
        "financial_entries",
        "client_assumptions",
        "diretrizes",
        "employees",
        "precificacao",
        "diagnostico",
        "okrs",
        "payables",
        "receivables"
      ];

      // Clean up all related documents first
      for (const coll of collectionsToClean) {
        try {
          const q = query(collection(db, coll), where("clientId", "==", clientId));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const deletePromises = snap.docs.map(d => deleteDoc(doc(db, coll, d.id)));
            await Promise.all(deletePromises);
          }
        } catch (e) {
          console.warn(`Erro ao limpar coleção ${coll} (pode não existir dados ou sem permissão):`, e);
        }
      }

      // Finally, delete the client document
      await deleteDoc(doc(db, "clients", clientId));
      
      setClientToDelete(null);
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("Erro ao excluir cliente. Verifique o console para mais detalhes.");
    } finally {
      setLoading(false);
    }
  };

  // handleGenerateModelCompany was replaced by the GenerateAICompanyModal.

  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sort,
    toggleSort,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredData: filteredClients,
    paginatedData: paginatedClients
  } = useDataTable(fullClients, {
    searchFields: ["razao", "fantasia", "cnpj", "segmento", "cidade"],
    initialSort: { key: "fantasia", direction: "asc" },
    itemsPerPage: 5,
    customFilter: (item: any, currentFilters: any) => {
      if (currentFilters.partnerId === "direto") {
        return !item.partnerId;
      }
      if (currentFilters.partnerId && item.partnerId !== currentFilters.partnerId) {
        return false;
      }
      return true;
    }
  });

  const uniqueSegments = useMemo(() => {
    const segments = fullClients.map((c: any) => c.segmento).filter(Boolean);
    return ["Todos", ...(Array.from(new Set(segments)) as string[]).sort()];
  }, [fullClients]);

  if (view === "form") {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Form Header — Premium */}
        <div className="relative overflow-hidden rounded-md border border-border bg-gradient-to-br from-primary/5 to-surface-container p-6 md:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <Button 
                variant="outline"
                onClick={() => setView("list")}
                className="group mb-4 text-[10px] font-medium uppercase tracking-[0.18em]"
              >
                <ChevronLeft size={10} className="mr-2" /> Voltar para lista
              </Button>
              <h2 className="text-h1 font-medium text-foreground tracking-tight">
                {editingId ? "Alterar Cadastro" : "Cadastrar Empresa"}
              </h2>
              <p className="text-muted-foreground text-sm mt-2 font-sans max-w-2xl leading-relaxed text-balance">
                Configure as informações estratégicas, estrutura societária e parâmetros tributários da organização.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 md:mt-4">
              <Button 
                variant="outline"
                onClick={() => setView("list")}
                className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em]"
              >
                Cancelar
              </Button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="group relative px-6 py-2.5 bg-gradient-to-r from-secondary to-[#ff6a33] text-white text-[10px] font-bold uppercase tracking-[0.15em] rounded-md transition-all duration-300 flex items-center gap-2 overflow-hidden shadow-[0_4px_15px_rgba(255,133,82,0.25)] hover:shadow-[0_6px_20px_rgba(255,133,82,0.4)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  {editingId ? "Salvar Alterações" : "Confirmar Cadastro"}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="card-premium p-0 overflow-hidden flex flex-col border-none shadow-floating">
          {/* Executive Tabs Navigation — scrollable com fade nas bordas */}
          <div className="relative bg-surface-container border-b border-border">
            <div className="flex p-1.5 gap-0.5 overflow-x-auto no-scrollbar">
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
                <button
                  key={tab.id}
                  onClick={() => setActiveFormTab(tab.id as any)}
                  className={cn(
                    "relative flex items-center gap-2 px-3 md:px-5 py-2.5 md:py-3 text-[10px] font-medium uppercase tracking-[0.12em] transition-all rounded-button whitespace-nowrap",
                    activeFormTab === tab.id 
                      ? "bg-card text-secondary shadow-md border border-border" 
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-container-high"
                  )}
                >
                  {(() => {
                    const Icon = tab.icon;
                    return <Icon size={13} strokeWidth={1.5} className={cn(activeFormTab === tab.id ? "text-secondary" : "text-muted-foreground/70")} />;
                  })()}
                  <span className="hidden sm:inline">{tab.label}</span>
                  {activeFormTab === tab.id && (
                    <motion.div 
                      layoutId="active-tab-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-secondary rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-10 flex-1 bg-card">
            {activeFormTab === "dados" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                {/* 1. Perfil Estratégico Section */}
                <div className="bg-surface-container/50 p-8 rounded-md border border-border space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-button bg-secondary/10 flex items-center justify-center text-secondary">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h3 className="text-body-sm font-medium text-foreground uppercase tracking-widest">Perfil Estratégico</h3>
                      <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest">Defina a natureza e os parâmetros de gestão</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                      <Label className="text-label">Tipo de Organização</Label>
                      <select 
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                        className="w-full px-5 py-3.5 bg-background border border-border rounded-md text-body-sm font-medium outline-none focus:border-secondary transition-all shadow-sm"
                      >
                        <option value="for-profit">Com Fins Lucrativos</option>
                        <option value="third-sector">Terceiro Setor (ONG/OSC)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-label">Origem da Organização</label>
                      <select 
                        value={formData.origin}
                        onChange={(e) => setFormData({...formData, origin: e.target.value as any})}
                        className="w-full px-5 py-3.5 bg-background border border-border rounded-md text-body-sm font-medium outline-none focus:border-secondary transition-all shadow-sm"
                      >
                        <option value="nacional">Nacional (Brasil)</option>
                        <option value="internacional">Internacional</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-label">Moeda de Gestão</label>
                      <select 
                        value={formData.currency}
                        onChange={(e) => setFormData({...formData, currency: e.target.value as any})}
                        className="w-full px-5 py-3.5 bg-background border border-border rounded-md text-body-sm font-medium outline-none focus:border-secondary transition-all shadow-sm"
                      >
                        <option value="BRL">Real (BRL)</option>
                        <option value="USD">Dólar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                        <option value="GBP">Libra (GBP)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-label">Status da Empresa</label>
                      <select 
                        value={formData.status || "Em Implantação"}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        disabled={!isMaster}
                        className={cn(
                          "w-full px-5 py-3.5 bg-background border border-border rounded-md text-body-sm font-medium outline-none transition-all shadow-sm",
                          isMaster ? "focus:border-secondary" : "opacity-70 bg-surface-container cursor-not-allowed"
                        )}
                      >
                        <option value="Em Implantação">Em Implantação</option>
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
                      </select>
                    </div>
                  </div>

                  {formData.type === "third-sector" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-6 bg-success/10 border border-success/20 rounded-md flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-button bg-success/10 flex items-center justify-center text-success">
                          <LayoutGrid size={20} />
                        </div>
                        <div>
                          <p className="text-body-sm font-medium text-success uppercase tracking-tight">Gestão por Projetos</p>
                          <p className="text-[9px] font-medium text-success/70 uppercase tracking-widest mt-0.5">Segregação automática de registros por projeto</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={formData.projectBased}
                          onChange={(e) => setFormData({...formData, projectBased: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-10">
                  {/* 2. Identificação Section */}
                  <div className="bg-surface-container/50 p-8 rounded-md border border-border space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-button bg-primary/10 flex items-center justify-center text-primary">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <h3 className="text-body-sm font-medium text-foreground uppercase tracking-widest">Identificação Jurídica</h3>
                        <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest">Dados oficiais e vínculos de gestão</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label className="text-label">{formData.origin === "nacional" ? "Número do CNPJ" : "Tax ID / Registration Number"}</Label>
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
                            <button 
                              onClick={fetchCNPJ}
                              disabled={loading || cnpjQuery.replace(/\D/g, "").length !== 14 || !!validationErrors.cnpj}
                              className="btn-executive whitespace-nowrap bg-primary"
                            >
                              {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                              SINCRONIZAR
                            </button>
                          )}
                        </div>
                        {validationErrors.cnpj && <p className="text-[10px] text-destructive font-medium mt-2 uppercase tracking-widest">{validationErrors.cnpj}</p>}
                      </div>
                      {error && (
                        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md flex items-start gap-3">
                          <AlertCircle size={16} className="text-destructive shrink-0 mt-0.5" />
                          <div>
                            <p className="text-body-sm font-medium text-destructive uppercase tracking-widest mb-1">Erro de Sincronização</p>
                            <p className="text-body-sm text-destructive/80 font-medium leading-relaxed">{error}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-label">Razão Social</Label>
                        <Input 
                          type="text" 
                          value={formData.razao}
                          onChange={(e) => {
                            setFormData({...formData, razao: e.target.value});
                            validateField("razao", e.target.value);
                          }}
                          className={cn(
                            "w-full h-12 bg-background",
                            validationErrors.razao ? "border-destructive/50" : "focus:border-secondary"
                          )}
                        />
                      </div>
                      <div>
                        <Label className="text-label">Nome Fantasia</Label>
                        <Input 
                          type="text" 
                          value={formData.fantasia}
                          onChange={(e) => {
                            setFormData({...formData, fantasia: e.target.value});
                            validateField("fantasia", e.target.value);
                          }}
                          className={cn(
                            "w-full h-12 bg-background",
                            validationErrors.fantasia ? "border-destructive/50" : "focus:border-secondary"
                          )}
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <label className="text-label">Parceiro Estratégico Responsável</label>
                        <select 
                          value={formData.partnerId || ""}
                          onChange={(e) => setFormData({...formData, partnerId: e.target.value})}
                          disabled={!isMaster}
                          className={cn(
                            "w-full px-5 py-3.5 bg-background border border-border rounded-sm text-body-sm font-medium outline-none focus:border-secondary transition-all shadow-inner",
                            !isMaster && "opacity-70 bg-surface-container cursor-not-allowed"
                          )}
                        >
                          {isMaster && <option value="">Atendimento Direto (Sem Parceiro)</option>}
                          {!isMaster && isPartner && <option value={userPartnerIds[0]}>Sua Unidade de Negócio</option>}
                          {partners.map(p => (
                            <option key={p.id} value={p.id}>{p.fantasia || p.razao}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-3 bg-background p-4 rounded-sm border border-border shrink-0 shadow-inner">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={formData.isModel}
                            onChange={(e) => setFormData({...formData, isModel: e.target.checked})}
                          />
                          <div className="w-11 h-6 bg-surface-container rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                          <span className="ml-3 text-[10px] font-medium text-muted-foreground uppercase tracking-widest italic">Empresa Modelo</span>
                        </label>
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
                                <h4 className="text-[10px] font-medium text-secondary uppercase tracking-widest flex items-center gap-2">
                                  <Sparkles size={14} /> Parâmetros de Geração IA
                                </h4>
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
                          <label className="text-label mb-0">Quadro Societário</label>
                          <span className="text-[10px] text-muted-foreground font-medium italic">* Percentuais calculados com base no capital social integralizado.</span>
                        </div>
                        <button 
                          onClick={() => setFormData({...formData, socios: [...formData.socios, { nome: "", participacao: 0 }]})}
                          className="text-body-sm font-medium text-secondary uppercase tracking-widest hover:underline flex items-center gap-2"
                        >
                          <Plus size={14} /> Adicionar Sócio
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {formData.socios.map((s, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-4 bg-surface-container border border-border rounded-md relative group/socio hover:border-secondary/20 transition-all">
                            <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground group-hover/socio:text-secondary transition-all shadow-sm shrink-0">
                              <Users size={18} strokeWidth={1.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <input 
                                type="text"
                                value={s.nome}
                                onChange={(e) => {
                                  const newSocios = [...formData.socios];
                                  newSocios[idx].nome = e.target.value;
                                  setFormData({...formData, socios: newSocios});
                                }}
                                placeholder="Nome do Sócio"
                                className="w-full bg-transparent text-body-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/50"
                              />
                              <div className="flex items-center gap-2 mt-1">
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
                            <button 
                              onClick={() => setFormData({...formData, socios: formData.socios.filter((_, i) => i !== idx)})}
                              className="absolute -top-2 -right-2 w-8 h-8 bg-card border border-border text-destructive rounded-full flex items-center justify-center opacity-0 group-hover/socio:opacity-100 transition-all shadow-md hover:bg-destructive/5"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                {/* 3. Localização Section */}
                <div className="bg-white/50 p-8 rounded-[32px] border border-border-main space-y-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <h3 className="text-[11px] font-black text-text-main uppercase tracking-[0.2em]">Presença e Localização</h3>
                      <p className="text-[9px] text-text-dim font-bold uppercase tracking-widest">Endereço e canais digitais</p>
                    </div>
                  </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div>
                        <label className="text-label">Fundação</label>
                        <div className="px-4 md:px-6 py-2.5 md:py-4 bg-bg-surface border border-border-main rounded-standard text-sm text-text-dim font-bold flex items-center gap-3 shadow-inner-soft">
                          <Calendar size={14} strokeWidth={2} />
                          {formData.dataFundacao || "--/--/----"}
                        </div>
                      </div>
                      <div>
                         <label className="text-label">Porte</label>
                         <div className="px-4 md:px-6 py-2.5 md:py-4 bg-bg-surface border border-border-main rounded-standard text-sm text-text-dim font-bold flex items-center gap-3 shadow-inner-soft">
                          <Building2 size={14} strokeWidth={2} />
                          {formData.porte}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-label">Endereço Completo</label>
                      <textarea 
                        rows={3}
                        value={formData.endereco}
                        onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                        className="w-full px-4 md:px-6 py-2.5 md:py-4 bg-bg-card border border-border-main rounded-standard text-sm outline-none focus:border-secondary transition-all leading-relaxed"
                        placeholder="Logradouro, número, bairro, cidade - UF"
                      />
                    </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-border-soft">
                        <div>
                          <label className="text-label">Segmento de Atuação</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              placeholder="Ex: Agronegócio, Tecnologia, Saúde..."
                              value={formData.segmentoAtuacao || ""}
                              onChange={(e) => {
                                setFormData({...formData, segmentoAtuacao: e.target.value});
                                setShowSegmentSuggestions(true);
                              }}
                              onFocus={() => setShowSegmentSuggestions(true)}
                              onBlur={() => setTimeout(() => setShowSegmentSuggestions(false), 200)}
                              className="w-full pl-12 pr-5 py-3 bg-bg-card border border-border-main rounded-standard text-sm outline-none focus:border-secondary transition-all"
                            />
                            <Activity size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" />
                            
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
                        <div>
                          <label className="text-label">Website</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              placeholder="https://exemplo.com.br"
                              value={formData.website}
                              onChange={(e) => setFormData({...formData, website: e.target.value})}
                              className="w-full pl-12 pr-5 py-3 bg-bg-card border border-border-main rounded-standard text-sm outline-none focus:border-secondary transition-all"
                            />
                            <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                        <div className="space-y-4 bg-bg-surface/30 p-6 rounded-2xl border border-border-main">
                          <div className="flex items-center justify-between">
                            <label className="text-label mb-0">Logo da Empresa</label>
                            <label className="cursor-pointer text-[9px] font-black text-secondary uppercase hover:underline flex items-center gap-1.5 transition-all">
                              <Upload size={12} /> Importar Logo
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "logo")} />
                            </label>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white border border-border-main flex items-center justify-center overflow-hidden shrink-0 shadow-sm transition-all group-hover:border-secondary/20">
                              {formData.logo ? (
                                <img src={formData.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                              ) : (
                                <ImageIcon size={24} className="text-text-dim/40" />
                              )}
                            </div>
                            <div className="relative flex-1">
                              <input 
                                type="text" 
                                placeholder="URL da Logo ou Base64"
                                value={formData.logo.startsWith("data:image") ? "Imagem Carregada Localmente" : formData.logo}
                                onChange={(e) => setFormData({...formData, logo: e.target.value})}
                                readOnly={formData.logo.startsWith("data:image")}
                                className={cn(
                                  "w-full px-4 py-3 bg-bg-card border border-border-main rounded-standard text-[11px] font-bold outline-none focus:border-secondary transition-all",
                                  formData.logo.startsWith("data:image") && "text-secondary italic"
                                )}
                              />
                              {formData.logo.startsWith("data:image") && (
                                <button onClick={() => setFormData({...formData, logo: ""})} className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-500 p-1 hover:bg-rose-50 rounded-full transition-all">
                                  <X size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 bg-bg-surface/30 p-6 rounded-2xl border border-border-main">
                          <div className="flex items-center justify-between">
                            <label className="text-label mb-0">Ícone / Avatar</label>
                            <label className="cursor-pointer text-[9px] font-black text-secondary uppercase hover:underline flex items-center gap-1.5 transition-all">
                              <Upload size={12} /> Importar Ícone
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "icon")} />
                            </label>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white border border-border-main flex items-center justify-center overflow-hidden shrink-0 shadow-sm transition-all group-hover:border-secondary/20">
                              {formData.icon ? (
                                <img src={formData.icon} alt="Icon" className="w-full h-full object-contain p-2" />
                              ) : (
                                <ImageIcon size={24} className="text-text-dim/40" />
                              )}
                            </div>
                            <div className="relative flex-1">
                              <input 
                                type="text" 
                                placeholder="URL do Ícone ou Base64"
                                value={formData.icon.startsWith("data:image") ? "Imagem Carregada Localmente" : formData.icon}
                                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                                readOnly={formData.icon.startsWith("data:image")}
                                className={cn(
                                  "w-full px-4 py-3 bg-bg-card border border-border-main rounded-standard text-[11px] font-bold outline-none focus:border-secondary transition-all",
                                  formData.icon.startsWith("data:image") && "text-secondary italic"
                                )}
                              />
                              {formData.icon.startsWith("data:image") && (
                                <button onClick={() => setFormData({...formData, icon: ""})} className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-500 p-1 hover:bg-rose-50 rounded-full transition-all">
                                  <X size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                    <div className="space-y-4 pt-10 border-t border-border-soft">
                      <label className="text-label">Ecossistema Digital</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.socialMedia.map((sm, idx) => (
                          <div key={idx} className="flex gap-2 items-center bg-bg-surface p-2 rounded-standard border border-border-main group/sm">
                            <select 
                              value={sm.platform}
                              onChange={(e) => {
                                const newSM = [...formData.socialMedia];
                                newSM[idx].platform = e.target.value;
                                setFormData({...formData, socialMedia: newSM});
                              }}
                              className="w-28 px-3 py-2 bg-bg-card border border-border-main rounded-compact text-[10px] font-black uppercase tracking-widest outline-none focus:border-secondary transition-all"
                            >
                              <option value="LinkedIn">LinkedIn</option>
                              <option value="Instagram">Instagram</option>
                              <option value="Facebook">Facebook</option>
                              <option value="Twitter">X / Twitter</option>
                              <option value="YouTube">YouTube</option>
                            </select>
                            <input 
                              type="text" 
                              placeholder="URL do perfil"
                              value={sm.url}
                              onChange={(e) => {
                                const newSM = [...formData.socialMedia];
                                newSM[idx].url = e.target.value;
                                setFormData({...formData, socialMedia: newSM});
                              }}
                              className="flex-1 px-4 py-2 bg-bg-card border border-border-main rounded-compact text-xs font-medium outline-none focus:border-secondary transition-all"
                            />
                            <button 
                              onClick={() => {
                                const newSM = formData.socialMedia.filter((_, i) => i !== idx);
                                setFormData({...formData, socialMedia: newSM});
                              }}
                              className="p-2 text-text-dim hover:text-rose-500 hover:bg-rose-50 rounded-compact transition-all"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => setFormData({...formData, socialMedia: [...formData.socialMedia, { platform: "LinkedIn", url: "" }]})}
                        className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] flex items-center gap-2 hover:underline pt-2"
                      >
                        <Plus size={14} /> Adicionar Presença Digital
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeFormTab === "estrutura" && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <div className="card-premium bg-surface-container/50 border-dashed">
                        <h4 className="text-body-sm font-medium text-foreground uppercase tracking-widest mb-6 flex items-center gap-3">
                          <Activity size={18} className="text-secondary" /> Unidades de Negócio
                        </h4>
                        <div className="flex gap-3 mb-6">
                          <input 
                            type="text" 
                            placeholder="Ex: Medicina Laboratorial"
                            value={tempUnit}
                            onChange={(e) => setTempUnit(e.target.value)}
                            className="flex-1 px-5 py-3 bg-card border border-border rounded-md text-body-sm outline-none focus:border-secondary transition-all"
                          />
                          <button 
                            onClick={() => {
                              if (tempUnit) {
                                setFormData({...formData, unidadesNegocio: [...formData.unidadesNegocio, tempUnit]});
                                setTempUnit("");
                              }
                            }}
                            className="btn-accent p-3"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.unidadesNegocio.map((u, i) => (
                            <span key={i} className="px-4 py-2 bg-card border border-border rounded-full text-[10px] font-medium text-muted-foreground flex items-center gap-2 shadow-sm">
                              {u}
                              <button onClick={() => setFormData({...formData, unidadesNegocio: formData.unidadesNegocio.filter((_, idx) => idx !== i)})} className="text-destructive hover:text-destructive/80 transition-colors">
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="card-premium bg-surface-container/50 border-dashed">
                        <h4 className="text-body-sm font-medium text-foreground uppercase tracking-widest mb-6 flex items-center gap-3">
                          <Landmark size={18} className="text-secondary" /> Centro de Custos Contábil
                        </h4>
                        <div className="space-y-4">
                          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest block px-1">Código / Nome do Centro de Custo</label>
                          <input 
                            type="text" 
                            placeholder="Ex: 01.01 - Administração Central"
                            value={formData.centroCustosContabil || ""}
                            onChange={(e) => setFormData({...formData, centroCustosContabil: e.target.value})}
                            className="w-full px-5 py-3 bg-card border border-border rounded-md text-body-sm outline-none focus:border-secondary transition-all"
                          />
                        </div>
                      </div>
                    </div>

                   <div className="space-y-6">
                      <div className="card-premium bg-surface-container/50 border-dashed">
                        <h4 className="text-body-sm font-medium text-foreground uppercase tracking-widest mb-6 flex items-center gap-3">
                          <Building2 size={18} className="text-secondary" /> Filiais e Filas
                        </h4>
                        <div className="space-y-4">
                          <input 
                            type="text" placeholder="Nome da Unidade / Filial"
                            value={tempBranch.nome}
                            onChange={(e) => setTempBranch({...tempBranch, nome: e.target.value})}
                            className="w-full px-5 py-3 bg-card border border-border rounded-md text-body-sm outline-none focus:border-secondary transition-all"
                          />
                          <div className="flex gap-3">
                            <input 
                              type="text" placeholder="Cidade / UF"
                              value={tempBranch.cidade}
                              onChange={(e) => setTempBranch({...tempBranch, cidade: e.target.value})}
                              className="flex-1 px-5 py-3 bg-card border border-border rounded-md text-body-sm outline-none focus:border-secondary transition-all"
                            />
                            <button 
                              onClick={() => {
                                if (tempBranch.nome) {
                                  setFormData({...formData, filiais: [...formData.filiais, tempBranch]});
                                  setTempBranch({ nome: "", cidade: "", cnpj: "" });
                                }
                              }}
                              className="btn-accent"
                            >Adicionar</button>
                          </div>
                        </div>
                        <div className="mt-8 space-y-3">
                          {formData.filiais.map((f, i) => (
                            <div key={i} className="flex justify-between items-center bg-card p-4 rounded-md border border-border shadow-sm group">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-surface-container rounded-md flex items-center justify-center text-muted-foreground group-hover:text-secondary transition-all"><MapPin size={16} /></div>
                                <div>
                                  <p className="text-body-sm font-medium text-foreground">{f.nome}</p>
                                  <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest">{f.cidade}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => setFormData({...formData, filiais: formData.filiais.filter((_, idx) => idx !== i)})} 
                                className="w-8 h-8 rounded-full flex items-center justify-center text-destructive hover:bg-destructive/5 hover:text-destructive transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                          {formData.filiais.length === 0 && (
                            <p className="text-[10px] text-text-dim italic font-medium">Nenhuma filial cadastrada.</p>
                          )}
                        </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
            {activeFormTab === "fiscal" && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
                <div className="card-premium space-y-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-2">
                      <h4 className="text-body-sm font-medium text-foreground uppercase tracking-widest flex items-center gap-3">
                        <Landmark size={20} className="text-secondary" /> Enquadramento Tributário
                      </h4>
                      <p className="text-[11px] text-muted-foreground font-medium lowercase italic">Defina o regime federal principal para automatização dos cálculos de rentabilidade.</p>
                    </div>
                    
                    <div className="flex bg-surface-container p-1.5 rounded-md border border-border">
                      {["Simples Nacional", "Lucro Presumido", "Lucro Real"].map(regime => (
                        <button
                          key={regime}
                          onClick={() => setFormData({...formData, regime})}
                          className={cn(
                            "px-4 md:px-6 py-2 md:py-2.5 rounded-button text-body-sm font-medium uppercase tracking-widest transition-all",
                            formData.regime === regime 
                              ? "bg-card text-secondary shadow-md border border-border" 
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {regime}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10 border-t border-border">
                    {formData.regime === "Lucro Real" && (
                      <div className="space-y-3">
                        <label className="text-label">Método de Apuração (LR)</label>
                        <select 
                          value={formData.regimeReal}
                          onChange={(e) => setFormData({...formData, regimeReal: e.target.value})}
                          className="w-full px-5 py-3 bg-surface-container border border-border rounded-md text-body-sm font-medium outline-none focus:border-secondary transition-all"
                        >
                          <option value="Cumulativo">Cumulativo (654/98)</option>
                          <option value="Não Cumulativo">Não Cumulativo (10.637/10.833)</option>
                          <option value="Híbrido">Híbrido (Misto)</option>
                        </select>
                      </div>
                    )}

                    {formData.regime === "Lucro Presumido" && (
                      <div className="space-y-3">
                        <label className="text-label">Cálculo Padrão IRPJ/CSLL</label>
                        <select 
                          value={formData.cnaePresuncao}
                          onChange={(e) => setFormData({...formData, cnaePresuncao: e.target.value})}
                          className="w-full px-5 py-3 bg-surface-container border border-border rounded-md text-body-sm font-medium outline-none focus:border-secondary transition-all"
                        >
                          <option value="Venda de produtos / Mercadorias">Comércio (8% / 12%)</option>
                          <option value="Prestação de Serviços Genéricos">Serviços (32%)</option>
                          <option value="Serviços de Saúde">Saúde (8% / 12%)</option>
                          <option value="Serviços de Transporte">Transporte (16% / 32%)</option>
                        </select>
                      </div>
                    )}

                    <div className="space-y-3">
                      <label className="text-label">Porte Declarado</label>
                      <div className="px-5 py-3 bg-surface-container border border-border rounded-md text-body-sm font-medium text-muted-foreground">
                        {formData.porte || "Não identificado"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Main Tax Activity Section (Nested Grid) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                  
                  {/* Left Column: Revenue History (Simples only) or Detail Parameters */}
                  <div className="space-y-10">
                    {formData.regime === "Simples Nacional" ? (
                      <div className="card-premium bg-bg-surface/30 space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-secondary/20"></div>
                        
                        <div className="flex items-center justify-between">
                          <h5 className="text-[11px] font-black text-text-main uppercase tracking-widest flex items-center gap-3">
                            <History size={18} className="text-secondary" /> Histórico RBT12
                          </h5>
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
                      </div>
                    ) : (
                    <div className="card-premium space-y-6">
                       <div className="space-y-4">
                          <h5 className="text-[10px] font-black text-text-main uppercase tracking-[0.2em] flex items-center gap-2">
                             <TrendingUp size={16} className="text-secondary" /> Volume de Faturamento
                          </h5>
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
                    </div>
                    )}
                  </div>

                  {/* Right Column: Actitivy & CNAEs */}
                  <div className="space-y-10">
                    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
                       <div className="flex items-center justify-between">
                          <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                             <Activity size={16} className="text-primary" /> Segregação de Atividade
                          </h5>
                          {formData.regime === "Simples Nacional" && (
                             <span className="px-3 py-1 bg-primary/5 text-primary text-[9px] font-black uppercase rounded-full border border-primary/10">Base Anexos I a V</span>
                          )}
                       </div>

                       <div className="space-y-6">
                         {/* Primary CNAE Detail Card */}
                         <div className="bg-slate-50/80 p-6 rounded-[28px] border border-slate-100 space-y-6">
                            <div className="flex items-start gap-4">
                               <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-primary shrink-0 shadow-sm">
                                  <ShieldCheck size={24} />
                               </div>
                               <div className="space-y-1 min-w-0 flex-1">
                                  <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] block">Atividade Principal</label>
                                  <p className="text-[11px] font-bold text-slate-600">{formData.cnae}</p>
                               </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                               {formData.regime === "Simples Nacional" ? (
                                  <div className="space-y-2">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Enquadramento do Anexo</label>
                                     <select 
                                       value={formData.cnaeAnexo}
                                       onChange={(e) => setFormData({...formData, cnaeAnexo: e.target.value})}
                                       className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black outline-none focus:border-primary transition-all"
                                     >
                                        {["Anexo I - Comércio", "Anexo II - Indústria", "Anexo III - Serviços", "Anexo IV - Serviços Esp.", "Anexo V - Serviços F.R"].map((anexo, i) => (
                                           <option key={i} value={`Anexo ${["I","II","III","IV","V"][i]}`}>{anexo}</option>
                                        ))}
                                     </select>
                                  </div>
                               ) : formData.regime === "Lucro Presumido" ? (
                                  <div className="space-y-2">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Presunção IRPJ/CSLL</label>
                                     <input 
                                       type="text"
                                       readOnly
                                       value={formData.cnaePresuncao}
                                       className="w-full px-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-black text-slate-400 outline-none"
                                     />
                                  </div>
                               ) : (
                                  /* Lucro Real */
                                  formData.regimeReal === "Híbrido" ? (
                                    <div className="space-y-2">
                                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Enquadramento PIS/COFINS</label>
                                      <select 
                                        value={formData.cnaeRegimeReal}
                                        onChange={(e) => setFormData({...formData, cnaeRegimeReal: e.target.value})}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black outline-none focus:border-primary transition-all"
                                      >
                                        <option value="Cumulativo">Cumulativo</option>
                                        <option value="Não Cumulativo">Não Cumulativo</option>
                                      </select>
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Enquadramento Automático (LR)</label>
                                      <div className="px-4 py-3 bg-slate-100/50 rounded-2xl text-xs font-black text-slate-500 italic">
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
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">Secundários ({formData.cnaesSecundarios.length})</label>
                               <div className="h-px bg-slate-100 flex-1 mx-4"></div>
                               <button 
                                 onClick={() => {
                                    const newCnae = { codigo: "", descricao: "", anexo: "Anexo I", presuncao: "Venda de produtos / Mercadorias", regimeReal: "Não Cumulativo" };
                                    setFormData({...formData, cnaesSecundarios: [...formData.cnaesSecundarios, newCnae]});
                                 }}
                                 className="text-[9px] font-black text-secondary uppercase hover:underline flex items-center gap-1"
                               >
                                  <Plus size={14} /> Cadastrar Empresa
                               </button>
                            </div>

                            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                               {formData.cnaesSecundarios.map((c, idx) => (
                                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group space-y-4">
                                     <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 text-[10px] font-black text-slate-700 leading-tight">
                                           {c.codigo} - {c.descricao}
                                        </div>
                                        <button 
                                          onClick={() => setFormData({...formData, cnaesSecundarios: formData.cnaesSecundarios.filter((_, i) => i !== idx)})}
                                          className="p-1.5 text-rose-400 hover:bg-rose-50 rounded-lg shrink-0"
                                        >
                                           <X size={14} />
                                        </button>
                                     </div>
                                     
                                     <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-100">
                                        {formData.regime === "Simples Nacional" && (
                                           <select 
                                             value={c.anexo}
                                             onChange={(e) => {
                                                const newList = [...formData.cnaesSecundarios];
                                                newList[idx] = { ...newList[idx], anexo: e.target.value };
                                                setFormData({ ...formData, cnaesSecundarios: newList });
                                             }}
                                             className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[9px] font-black text-slate-500 uppercase outline-none focus:border-primary transition-all"
                                           >
                                              <option value="Anexo I">Anexo I</option>
                                              <option value="Anexo II">Anexo II</option>
                                              <option value="Anexo III">Anexo III</option>
                                              <option value="Anexo IV">Anexo IV</option>
                                              <option value="Anexo V">Anexo V</option>
                                           </select>
                                        )}
                                        {formData.regime === "Lucro Presumido" && (
                                           <select 
                                             value={c.presuncao}
                                             onChange={(e) => {
                                                const newList = [...formData.cnaesSecundarios];
                                                newList[idx] = { ...newList[idx], presuncao: e.target.value };
                                                setFormData({ ...formData, cnaesSecundarios: newList });
                                             }}
                                             className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[9px] font-black text-slate-500 uppercase outline-none focus:border-primary transition-all"
                                           >
                                              <option value="Venda de produtos / Mercadorias">Venda de produtos</option>
                                              <option value="Prestação de Serviços Genéricos">Serviços Genéricos</option>
                                              <option value="Serviços de Saúde">Serviços de Saúde</option>
                                              <option value="Serviços de Transporte">Transporte</option>
                                           </select>
                                        )}
                                        {formData.regime === "Lucro Real" && formData.regimeReal === "Híbrido" && (
                                           <select 
                                             value={c.regimeReal}
                                             onChange={(e) => {
                                                const newList = [...formData.cnaesSecundarios];
                                                newList[idx] = { ...newList[idx], regimeReal: e.target.value };
                                                setFormData({ ...formData, cnaesSecundarios: newList });
                                             }}
                                             className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[9px] font-black text-slate-500 uppercase outline-none focus:border-primary transition-all"
                                           >
                                              <option value="Cumulativo">Cumulativo</option>
                                              <option value="Não Cumulativo">Não Cumulativo</option>
                                           </select>
                                        )}
                                        {formData.regime === "Lucro Real" && formData.regimeReal !== "Híbrido" && (
                                           <div className="px-3 py-1.5 bg-slate-100 rounded-xl text-[8px] font-black text-slate-400 uppercase italic text-center">
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
                <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
                  <div className="space-y-1">
                    <h5 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                       <Users size={20} className="text-secondary" /> Encargos de Folha de Pagamento
                    </h5>
                    <p className="text-[11px] text-slate-400 font-medium lowercase">Configure os encargos incidentes sobre a folha de pagamento para as simulações.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">FGTS (%)</label>
                      <input 
                        type="number"
                        value={formData.folhaFgts}
                        onChange={(e) => setFormData({...formData, folhaFgts: parseFloat(e.target.value) || 0})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-secondary/10 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">INSS Patronal (%)</label>
                      <input 
                        type="number"
                        value={formData.folhaInssPatronal}
                        onChange={(e) => setFormData({...formData, folhaInssPatronal: parseFloat(e.target.value) || 0})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-secondary/10 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">RAT / FAP (%)</label>
                      <input 
                        type="number"
                        step="0.01"
                        value={formData.folhaInssRat}
                        onChange={(e) => setFormData({...formData, folhaInssRat: parseFloat(e.target.value) || 0})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-secondary/10 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Terceiros / Outros (%)</label>
                      <input 
                        type="number"
                        step="0.01"
                        value={formData.folhaInssTerceiros}
                        onChange={(e) => setFormData({...formData, folhaInssTerceiros: parseFloat(e.target.value) || 0})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-secondary/10 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">INSS Funcionário (Médio %)</label>
                      <input 
                        type="number"
                        value={formData.folhaInssFuncionario}
                        onChange={(e) => setFormData({...formData, folhaInssFuncionario: parseFloat(e.target.value) || 0})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-secondary/10 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Multa FGTS (%)</label>
                      <input 
                        type="number"
                        value={formData.folhaMultaFgts}
                        onChange={(e) => setFormData({...formData, folhaMultaFgts: parseFloat(e.target.value) || 0})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-secondary/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-1">Tabela de IRRF (Folha de Pagamento)</label>
                    <div className="bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-100/50">
                            <th className="px-4 md:px-6 py-2 md:py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Base de Cálculo (Até R$)</th>
                            <th className="px-4 md:px-6 py-2 md:py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Alíquota (%)</th>
                            <th className="px-4 md:px-6 py-2 md:py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Dedução (R$)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {formData.folhaTabelaIRRF.map((item, idx) => (
                            <tr key={idx}>
                              <td className="px-4 md:px-6 py-2 md:py-3">
                                <input 
                                  type="number"
                                  value={item.base}
                                  onChange={(e) => {
                                    const newTabela = [...formData.folhaTabelaIRRF];
                                    newTabela[idx] = { ...newTabela[idx], base: parseFloat(e.target.value) || 0 };
                                    setFormData({ ...formData, folhaTabelaIRRF: newTabela });
                                  }}
                                  className="w-full bg-transparent text-xs font-bold outline-none focus:text-secondary transition-all"
                                />
                              </td>
                              <td className="px-4 md:px-6 py-2 md:py-3">
                                <input 
                                  type="number"
                                  value={item.aliquota}
                                  onChange={(e) => {
                                    const newTabela = [...formData.folhaTabelaIRRF];
                                    newTabela[idx] = { ...newTabela[idx], aliquota: parseFloat(e.target.value) || 0 };
                                    setFormData({ ...formData, folhaTabelaIRRF: newTabela });
                                  }}
                                  className="w-full bg-transparent text-xs font-bold outline-none focus:text-secondary transition-all"
                                />
                              </td>
                              <td className="px-4 md:px-6 py-2 md:py-3">
                                <input 
                                  type="number"
                                  value={item.deducao}
                                  onChange={(e) => {
                                    const newTabela = [...formData.folhaTabelaIRRF];
                                    newTabela[idx] = { ...newTabela[idx], deducao: parseFloat(e.target.value) || 0 };
                                    setFormData({ ...formData, folhaTabelaIRRF: newTabela });
                                  }}
                                  className="w-full bg-transparent text-xs font-bold outline-none focus:text-secondary transition-all"
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
                <div className="card-premium bg-primary/5 border-primary/20">
                  <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                    <ShieldCheck size={20} className="text-primary" /> Contato Principal (Decisor)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-3">
                      <label className="text-label">Nome Completo</label>
                      <input 
                        type="text" 
                        value={formData.contato.nome}
                        onChange={(e) => {
                          setFormData({...formData, contato: {...formData.contato, nome: e.target.value}});
                          validateField("contatoNome", e.target.value);
                        }}
                        className={cn(
                          "w-full px-5 py-3 bg-white/50 border rounded-standard text-sm font-bold outline-none transition-all",
                          validationErrors.contatoNome ? "border-rose-300 focus:border-rose-500" : "border-border-main focus:border-primary"
                        )}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-label">Cargo / Função</label>
                      <input 
                        type="text" 
                        value={formData.contato.funcao}
                        onChange={(e) => setFormData({...formData, contato: {...formData.contato, funcao: e.target.value}})}
                        className="w-full px-5 py-3 bg-white/50 border border-border-main rounded-standard text-sm font-bold outline-none focus:border-primary transition-all"
                      />
                    </div>
                     <div className="space-y-3">
                      <label className="text-label">E-mail Corporativo</label>
                      <input 
                        type="email" 
                        value={formData.contato.email}
                        onChange={(e) => {
                          setFormData({...formData, contato: {...formData.contato, email: e.target.value}});
                          validateField("email", e.target.value);
                        }}
                        className={cn(
                          "w-full px-5 py-3 bg-bg-surface border rounded-standard text-sm font-bold outline-none transition-all",
                          validationErrors.email ? "border-rose-300 focus:border-rose-500" : "border-border-main focus:border-secondary"
                        )}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-label">Telefone / WhatsApp</label>
                      <input 
                        type="tel" 
                        value={formData.contato.telefone}
                        onChange={(e) => setFormData({...formData, contato: {...formData.contato, telefone: e.target.value}})}
                        className="w-full px-5 py-3 bg-bg-surface border border-border-main rounded-standard text-sm font-bold outline-none focus:border-secondary transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="card-premium bg-surface-container/50 border-dashed">
                   <h4 className="text-body-sm font-medium text-muted-foreground uppercase tracking-widest mb-10 flex items-center gap-3">
                     <Users size={18} className="text-secondary" /> Contatos Adicionais
                   </h4>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input 
                            type="text" placeholder="Nome" 
                            value={tempContact.nome}
                            onChange={(e) => setTempContact({...tempContact, nome: e.target.value})}
                            className="w-full px-4 py-2.5 bg-card border border-border rounded-md text-body-sm font-medium outline-none focus:border-secondary transition-all"
                          />
                          <input 
                            type="text" placeholder="Cargo" 
                            value={tempContact.cargo}
                            onChange={(e) => setTempContact({...tempContact, cargo: e.target.value})}
                            className="w-full px-4 py-2.5 bg-card border border-border rounded-md text-body-sm font-medium outline-none focus:border-secondary transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input 
                            type="email" placeholder="E-mail" 
                            value={tempContact.email}
                            onChange={(e) => setTempContact({...tempContact, email: e.target.value})}
                            className="w-full px-4 py-2.5 bg-card border border-border rounded-md text-body-sm font-medium outline-none focus:border-secondary transition-all"
                          />
                          <div className="flex gap-2">
                            <input 
                              type="tel" placeholder="Telefone" 
                              value={tempContact.tel}
                              onChange={(e) => setTempContact({...tempContact, tel: e.target.value})}
                              className="flex-1 px-4 py-2.5 bg-card border border-border rounded-md text-body-sm font-medium outline-none focus:border-secondary transition-all"
                            />
                            <button 
                              onClick={() => {
                                if (tempContact.nome) {
                                  setFormData({...formData, contatosAdicionais: [...formData.contatosAdicionais, tempContact]});
                                  setTempContact({ nome: "", email: "", tel: "", cargo: "" });
                                }
                              }}
                              className="btn-accent p-2.5"
                            >
                              <Plus size={18} />
                            </button>
                          </div>
                        </div>
                     </div>

                     <div className="space-y-3">
                        {formData.contatosAdicionais.map((c, i) => (
                          <div key={i} className="flex items-center justify-between bg-card p-4 rounded-md border border-border shadow-sm group">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-surface-container rounded-md flex items-center justify-center text-muted-foreground group-hover:text-secondary transition-all shadow-sm"><Users size={16} /></div>
                              <div>
                                <p className="text-body-sm font-medium text-foreground">{c.nome} <span className="text-muted-foreground font-medium text-[10px] ml-2 uppercase tracking-widest">({c.cargo})</span></p>
                                <p className="text-[11px] text-muted-foreground font-medium italic">{c.email} • {c.tel}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => setFormData({...formData, contatosAdicionais: formData.contatosAdicionais.filter((_, idx) => idx !== i)})}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-destructive hover:bg-destructive/5 hover:text-destructive transition-all"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ))}
                        {formData.contatosAdicionais.length === 0 && (
                          <div className="h-full flex items-center justify-center border-2 border-dashed border-border rounded-md p-8 text-muted-foreground text-[10px] font-medium uppercase tracking-widest italic">
                            Nenhum contato adicional
                          </div>
                        )}
                     </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeFormTab === "usuarios" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
                {editingId ? (
                  <ClientUserManager clientId={editingId} />
                ) : (
                  <div className="card-premium bg-surface-container/50 border-dashed text-center py-24 space-y-8">
                    <div className="w-24 h-24 bg-card rounded-md flex items-center justify-center text-muted-foreground mx-auto shadow-md border border-border">
                        <Key size={40} className="opacity-50" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-h4 font-medium text-foreground uppercase tracking-widest">Aguardando Cadastro</h4>
                      <p className="text-body-sm text-muted-foreground font-medium uppercase tracking-widest max-w-[300px] mx-auto leading-relaxed">Para gerenciar usuários e acessos, conclua primeiro o salvamento dos dados básicos da empresa.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeFormTab === "pessoal" && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                 {editingId ? (
                   <EmployeeManager clientId={editingId} clientConfig={formData} />
                 ) : (
                   <div className="bg-slate-50 border border-slate-100 p-12 rounded-[32px] text-center space-y-4">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mx-auto shadow-sm">
                         <AlertCircle size={32} />
                      </div>
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Salve o cliente primeiro</h4>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest max-w-[200px] mx-auto">Para gerenciar o quadro de pessoal, você precisa primeiro concluir o cadastro básico do cliente.</p>
                   </div>
                 )}
              </motion.div>
            )}

            {activeFormTab === "relatorio_ia" && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                {(formData as any).aiAnalysis ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-10">
                      <div className="card-premium space-y-6">
                        <h4 className="text-body-sm font-medium text-foreground uppercase tracking-widest flex items-center gap-3">
                          <AlertCircle size={18} className="text-destructive" /> Desafios Estratégicos
                        </h4>
                        <div className="space-y-4">
                          {((formData as any).aiAnalysis.challenges || []).map((c: string, i: number) => (
                            <div key={i} className="text-body-sm text-muted-foreground font-medium leading-relaxed bg-surface-container p-4 rounded-md border border-border">
                              <MarkdownText text={c} />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="card-premium space-y-6">
                        <h4 className="text-body-sm font-medium text-foreground uppercase tracking-widest flex items-center gap-3">
                          <TrendingUp size={18} className="text-success" /> Oportunidades de Crescimento
                        </h4>
                        <div className="space-y-4">
                          {((formData as any).aiAnalysis.growthSuggestions || []).map((c: string, i: number) => (
                            <div key={i} className="text-body-sm text-muted-foreground font-medium leading-relaxed bg-surface-container p-4 rounded-md border border-border">
                              <MarkdownText text={c} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-10">
                      <div className="bg-primary p-10 rounded-md text-primary-foreground space-y-6 shadow-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                        <h4 className="text-body-sm font-medium text-primary-foreground/50 uppercase tracking-widest flex items-center gap-2">
                          <ShieldCheck size={14} /> Governança & Estrutura
                        </h4>
                        <div className="text-body-sm font-medium leading-relaxed text-primary-foreground/90 italic">
                          "<MarkdownText text={((formData as any).aiAnalysis?.governance || "N/A")} />"
                        </div>
                      </div>

                      <div className="card-premium space-y-6">
                        <h4 className="text-body-sm font-medium text-foreground uppercase tracking-widest">Fluxo Operacional</h4>
                        <div className="text-body-sm text-muted-foreground font-medium leading-relaxed bg-surface-container p-5 rounded-md border border-border border-dashed italic">
                          <MarkdownText text={((formData as any).aiAnalysis?.operationalFlow || "N/A")} />
                        </div>
                      </div>

                      <div className="card-premium space-y-6">
                        <h4 className="text-body-sm font-medium text-foreground uppercase tracking-widest flex items-center gap-3">
                          <LayoutGrid size={18} className="text-secondary" /> Dashboards Sugeridos
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {((formData as any).aiAnalysis?.dashboardIdeas || []).map((c: string, i: number) => (
                            <span key={i} className="px-4 py-2 bg-secondary/10 text-secondary text-[10px] font-medium uppercase rounded-full border border-secondary/20">
                              <MarkdownText text={c} />
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card-premium bg-surface-container/50 border-dashed text-center py-24 space-y-8">
                    <div className="w-24 h-24 bg-card rounded-md flex items-center justify-center text-muted-foreground mx-auto shadow-md border border-border">
                        <Sparkles size={40} className="opacity-50 text-secondary" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-h4 font-medium text-foreground uppercase tracking-widest">Sem Análise de IA</h4>
                      <p className="text-body-sm text-muted-foreground font-medium uppercase tracking-widest max-w-[300px] mx-auto leading-relaxed">Este cliente não possui um relatório gerencial automatizado vinculado no momento.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {["pessoal", "importacao", "acessos", "auditoria"].map(tab => (
              activeFormTab === tab && !editingId && (
                <div key={tab} className="card-premium bg-surface-container/50 border-dashed text-center py-24 space-y-8">
                  <div className="w-24 h-24 bg-card rounded-md flex items-center justify-center text-muted-foreground mx-auto shadow-md border border-border">
                      <AlertCircle size={40} className="opacity-50" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-h4 font-medium text-foreground uppercase tracking-widest">Aguardando Cadastro</h4>
                    <p className="text-body-sm text-muted-foreground font-medium uppercase tracking-widest max-w-[300px] mx-auto leading-relaxed">Para visualizar esta seção, você precisa primeiro concluir o cadastro básico da empresa.</p>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ─── Helpers de avatar com iniciais coloridas ─── */
  const getClientInitials = (client: any): string => {
    const name = client.fantasia || client.name || client.razao || "";
    return name.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase() || "?";
  };

  const avatarColors = [
    { bg: "bg-secondary/15", text: "text-secondary", border: "border-secondary/20" },
    { bg: "bg-success/15", text: "text-success", border: "border-success/20" },
    { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
    { bg: "bg-warning/15", text: "text-warning", border: "border-warning/20" },
    { bg: "bg-info/10", text: "text-info", border: "border-info/20" },
  ];

  return (
    <div className="space-y-8 pb-32 animate-executive-fade">
      <PageHeader
        title="Gestão de Empresas"
        subtitle="Carteira estratégica de clientes, controle de acesso e parâmetros operacionais."
        icon={Building2}
      />

      {/* ── KPI Banner Premium ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Carteira Total",
            value: clients.length,
            sub: "empresas cadastradas",
            icon: Building2,
            gradient: "from-secondary/12 via-secondary/5 to-transparent",
            ring: "ring-secondary/15",
            iconColor: "text-secondary",
            iconBg: "bg-secondary/12",
            progress: 100,
            progressColor: "bg-secondary",
          },
          {
            label: "Empresas Ativas",
            value: clients.filter((c: any) => c.status === "Ativo").length,
            sub: "em operação",
            icon: ShieldCheck,
            gradient: "from-success/12 via-success/5 to-transparent",
            ring: "ring-success/15",
            iconColor: "text-success",
            iconBg: "bg-success/12",
            progress: clients.length > 0 ? Math.round((clients.filter((c: any) => c.status === "Ativo").length / clients.length) * 100) : 0,
            progressColor: "bg-success",
          },
          {
            label: "Em Implantação",
            value: clients.filter((c: any) => c.status === "Em Implantação").length,
            sub: "em configuração",
            icon: Activity,
            gradient: "from-warning/12 via-warning/5 to-transparent",
            ring: "ring-warning/15",
            iconColor: "text-warning",
            iconBg: "bg-warning/12",
            progress: clients.length > 0 ? Math.round((clients.filter((c: any) => c.status === "Em Implantação").length / clients.length) * 100) : 0,
            progressColor: "bg-warning",
          },
          {
            label: "Segmentos",
            value: Array.from(new Set(clients.map((c: any) => c.segmentoAtuacao || c.segmento))).filter(Boolean).length,
            sub: "setores distintos",
            icon: LayoutGrid,
            gradient: "from-primary/10 via-primary/5 to-transparent",
            ring: "ring-primary/15",
            iconColor: "text-primary",
            iconBg: "bg-primary/10",
            progress: 100,
            progressColor: "bg-primary",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, ease: "easeOut" }}
            className={`relative overflow-hidden rounded-md border bg-gradient-to-br ring-1 shadow-sm group cursor-default select-none ${stat.gradient} ${stat.ring}`}
          >
            {/* Glow blob */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 bg-current transition-all duration-500 group-hover:opacity-30 group-hover:scale-125" />
            
            <div className="relative p-5 md:p-6">
              <div className="flex items-start justify-between mb-4">
                <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                <div className={`w-9 h-9 rounded-md flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md ${stat.iconBg} ${stat.iconColor}`}>
                  {(() => { const Icon = stat.icon; return <Icon size={18} strokeWidth={1.5} />; })()}
                </div>
              </div>
              
              <div className="mb-3">
                <span className="text-[clamp(28px,4vw,40px)] font-semibold text-foreground tabular-nums leading-none">{stat.value}</span>
                <p className="text-[10px] text-muted-foreground/70 mt-1 font-medium">{stat.sub}</p>
              </div>

              {/* Progress bar */}
              <div className="h-1 w-full bg-muted/40 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.progress}%` }}
                  transition={{ delay: i * 0.07 + 0.3, duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${stat.progressColor} opacity-60`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Controls Bar Premium ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {/* Linha 1: Status Pills + Search + Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Status filter pills */}
          <div className="bg-surface-container p-1 rounded-md flex gap-0.5 border border-border shrink-0 self-start sm:self-auto">
            {([
              { label: "Todos", value: "", count: fullClients.length },
              { label: "Ativos", value: "Ativo", count: fullClients.filter((c: any) => c.status === "Ativo").length },
              { label: "Implantação", value: "Em Implantação", count: fullClients.filter((c: any) => c.status === "Em Implantação").length },
            ] as const).map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilters({ ...filters, status: tab.value })}
                className={cn(
                  "relative px-3.5 py-2 rounded-button text-[10px] font-medium uppercase tracking-[0.12em] transition-all whitespace-nowrap flex items-center gap-2",
                  (filters.status ?? "") === tab.value
                    ? "bg-card text-secondary shadow-md border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-container-high"
                )}
              >
                {tab.label}
                <span className={cn(
                  "inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-semibold transition-all",
                  (filters.status ?? "") === tab.value
                    ? "bg-secondary/15 text-secondary"
                    : "bg-muted text-muted-foreground"
                )}>{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Pesquisar por nome, CNPJ, cidade ou segmento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-background border border-border rounded-md text-body-sm font-medium outline-none focus:border-secondary focus:shadow-[0_0_0_3px_rgba(255,133,82,0.1)] transition-all shadow-sm"
            />
            <AnimatePresence>
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted-foreground/20 transition-all"
                >
                  <X size={10} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={openAdd} className="btn-accent whitespace-nowrap py-2.5">
              <Plus size={15} />
              <span className="hidden sm:inline text-[10px] font-medium uppercase tracking-[0.12em]">Novo Cliente</span>
            </button>
          </div>
        </div>

        {/* Linha 2: Filtros adicionais + Resultado */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            <Filter size={12} className="text-muted-foreground shrink-0" />
            <select
              value={filters.segmento || ""}
              onChange={(e) => setFilters({ ...filters, segmento: e.target.value })}
              className="flex-1 min-w-[140px] max-w-[220px] px-3 py-2 bg-background border border-border rounded-md text-[10px] font-medium uppercase tracking-[0.1em] outline-none focus:border-secondary transition-all shadow-sm text-muted-foreground"
            >
              <option value="">Todos os Segmentos</option>
              {uniqueSegments.filter(s => s !== "Todos").map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {isMaster && (
              <select
                value={filters.partnerId || ""}
                onChange={(e) => setFilters({ ...filters, partnerId: e.target.value })}
                className="flex-1 min-w-[140px] max-w-[220px] px-3 py-2 bg-background border border-border rounded-md text-[10px] font-medium uppercase tracking-[0.1em] outline-none focus:border-secondary transition-all shadow-sm text-muted-foreground"
              >
                <option value="">Todos os Parceiros</option>
                <option value="direto">Atendimento Direto</option>
                {partners.map(p => (
                  <option key={p.id} value={p.id}>{p.fantasia || p.razao}</option>
                ))}
              </select>
            )}
          </div>

          {/* Resultado chip */}
          <div className="flex items-center gap-2 shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={filteredClients.length}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/8 border border-secondary/20 rounded-full"
              >
                <span className="text-[11px] font-semibold text-secondary tabular-nums">{filteredClients.length}</span>
                <span className="text-[9px] font-medium text-secondary/70 uppercase tracking-widest">{filteredClients.length === 1 ? "empresa" : "empresas"}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Client List Premium ─────────────────────────────────────────────── */}
      <div className="space-y-2.5">
        {paginatedClients.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-md border border-dashed border-border bg-gradient-to-br from-surface-container/60 to-background flex flex-col items-center justify-center text-center py-24 md:py-32 space-y-6"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] pointer-events-none">
              <Building2 size={240} strokeWidth={0.5} />
            </div>
            <div className="relative">
              <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center shadow-md border border-border mx-auto mb-5">
                <Search size={32} className="text-muted-foreground/40" />
              </div>
              <div className="space-y-2">
                <h3 className="text-h4 font-medium text-foreground">Nenhuma empresa encontrada</h3>
                <p className="text-body-sm text-muted-foreground max-w-xs mx-auto leading-relaxed text-balance">
                  Ajuste os filtros ou o termo de busca para visualizar empresas da carteira.
                </p>
              </div>
              <button
                onClick={() => { setSearchTerm(""); setFilters({}); }}
                className="mt-6 inline-flex items-center gap-2 text-[10px] font-medium text-secondary uppercase tracking-widest hover:opacity-80 transition-opacity"
              >
                <X size={12} /> Limpar filtros
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Column headers — apenas desktop */}
            <div className="hidden lg:grid lg:grid-cols-[56px_minmax(0,2.5fr)_minmax(0,1.2fr)_minmax(0,1fr)_100px_260px] gap-4 px-6 pl-7 py-3 text-[9px] font-bold text-muted-foreground/70 uppercase tracking-[0.2em]">
              <div />
              <div>Empresa</div>
              <div>Documento</div>
              <div className="flex items-center gap-1.5"><MapPin size={10} /> Local</div>
              <div className="text-center">Status</div>
              <div className="text-right">Ações</div>
            </div>

            {paginatedClients.map((client: any, idx: number) => {
              const colorSet = avatarColors[idx % avatarColors.length];
              const initials = getClientInitials(client);
              const statusColor = client.status === "Ativo" ? "bg-success" : client.status === "Em Implantação" ? "bg-warning" : "bg-muted-foreground/30";

              return (
                <motion.div
                  layout
                  key={client.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.035, ease: "easeOut" }}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-secondary/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-all duration-300"
                >
                  {/* Status stripe */}
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 rounded-r-full",
                    statusColor
                  )} />

                  <div className="flex flex-col lg:grid lg:grid-cols-[56px_minmax(0,2.5fr)_minmax(0,1.2fr)_minmax(0,1fr)_100px_260px] items-start lg:items-center gap-4 px-6 py-4 pl-7">
                    
                    {/* Avatar */}
                    <div className={cn(
                      "w-12 h-12 rounded-md border-[1.5px] overflow-hidden shrink-0 transition-all duration-300 relative",
                      client.icon || client.logo
                        ? "bg-card border-border group-hover:border-secondary/30"
                        : `flex items-center justify-center ${colorSet.bg} ${colorSet.border}`
                    )}>
                      {client.icon || client.logo ? (
                        <img
                          src={client.icon || client.logo}
                          alt={client.fantasia}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <span className={`text-sm font-bold select-none ${colorSet.text}`}>{initials}</span>
                      )}
                    </div>

                    {/* Main info */}
                    <div className="min-w-0 flex-1 w-full xl:w-auto">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <h3 className="text-body-sm font-semibold text-foreground group-hover:text-secondary transition-colors leading-tight">
                          {client.fantasia || client.name || "Empresa sem Nome"}
                        </h3>
                        {client.isModel && (
                          <span className="px-1.5 py-0.5 bg-warning/10 text-warning text-[7.5px] font-semibold uppercase rounded-full border border-warning/20 shrink-0 tracking-wider">Modelo</span>
                        )}
                        {client.approvalStatus === "Pending" && (
                          <span className="px-1.5 py-0.5 bg-destructive/10 text-destructive text-[7.5px] font-semibold uppercase rounded-full border border-destructive/20 shrink-0 tracking-wider">Pendente</span>
                        )}
                      </div>
                      <p className="text-[9px] font-medium text-muted-foreground/70 uppercase tracking-widest truncate leading-tight mb-2">{client.razao || "—"}</p>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {(client.segmentoAtuacao || client.segmento) && (
                          <span className="px-2 py-0.5 bg-surface-container text-muted-foreground text-[8px] font-medium uppercase rounded-full border border-border tracking-wide">
                            {client.segmentoAtuacao || client.segmento}
                          </span>
                        )}
                        {client.porte && (
                          <span className="px-2 py-0.5 bg-surface-container text-muted-foreground text-[8px] font-medium uppercase rounded-full border border-border tracking-wide">{client.porte}</span>
                        )}
                        {/* Partner badge */}
                        {(() => {
                          const partner = partners.find((p: any) => p.id === client.partnerId);
                          return partner ? (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-primary/8 text-primary text-[8px] font-semibold uppercase rounded-full border border-primary/20 tracking-wide shrink-0">
                              <Briefcase size={8} />
                              {partner.fantasia || partner.razao}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-secondary/8 text-secondary text-[8px] font-semibold uppercase rounded-full border border-secondary/20 tracking-wide shrink-0">
                              <Briefcase size={8} />
                              Cliente Illumine
                            </span>
                          );
                        })()}
                        {/* Mobile: show location inline */}
                        {client.cidade && (
                          <span className="xl:hidden flex items-center gap-1 text-[8px] text-muted-foreground/60 font-medium">
                            <MapPin size={9} />{client.cidade}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CNPJ / Regime — apenas desktop */}
                    <div className="hidden lg:block min-w-0">
                      <p className="text-[10.5px] font-mono font-medium text-foreground tracking-wide">{formatDoc(client.cnpj) || "—"}</p>
                      {client.regime && (
                        <span className="inline-block mt-1.5 px-2 py-0.5 bg-surface-container text-muted-foreground text-[8px] font-bold uppercase rounded-md border border-border tracking-wider">{client.regime}</span>
                      )}
                    </div>

                    {/* Localização — apenas desktop */}
                    <div className="hidden lg:flex items-center gap-1.5 min-w-0">
                      <MapPin size={11} className="text-muted-foreground/60 shrink-0" />
                      <span className="text-[10.5px] font-medium text-muted-foreground truncate">{client.cidade || "—"}</span>
                    </div>

                    {/* Status badge */}
                    <div className="hidden lg:flex justify-center">
                      <StatusBadge status={client.approvalStatus === "Pending" ? "Pendente" : (client.status || "Em Implantação")} />
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-2 w-full lg:w-auto lg:justify-end">
                      {/* Mobile: status badge inline */}
                      <div className="lg:hidden mr-auto">
                        <StatusBadge status={client.approvalStatus === "Pending" ? "Pendente" : (client.status || "Em Implantação")} />
                      </div>

                      {isMaster && client.approvalStatus === "Pending" && (
                        <button
                          onClick={async () => {
                            if (confirm("Aprovar este novo cliente?")) {
                              await updateDoc(doc(db, "clients", client.id), { approvalStatus: "Approved" });
                            }
                          }}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-success/10 border border-success/20 hover:bg-success hover:text-white text-success text-[8px] font-semibold uppercase tracking-widest rounded-md transition-all whitespace-nowrap"
                        >
                          <ShieldCheck size={11} /> Aprovar
                        </button>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(client)}
                          title="Editar cadastro"
                          className="w-8 h-8 rounded-md bg-surface-container border border-border flex items-center justify-center text-muted-foreground hover:text-secondary hover:border-secondary/40 hover:bg-secondary/5 transition-all"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => setClientToDelete({ id: client.id, name: client.fantasia || client.name })}
                          title="Excluir cliente"
                          className="w-8 h-8 rounded-md bg-surface-container border border-border flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => setSelectedClient(client.id)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-primary/90 text-white text-[9px] font-semibold uppercase tracking-widest rounded-md transition-all whitespace-nowrap shadow-sm hover:shadow-md group/dash"
                      >
                        <Activity size={11} className="group-hover/dash:scale-110 transition-transform" /> 
                        <span className="hidden sm:inline">Dashboard</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </>
        )}

        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between pt-5 border-t border-border"
          >
            <p className="text-[9.5px] font-medium text-muted-foreground/70 uppercase tracking-[0.15em]">
              Mostrando página <span className="text-foreground font-semibold">{currentPage}</span> de <span className="text-foreground font-semibold">{totalPages}</span>
            </p>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="w-8 h-8 rounded-md bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-secondary hover:border-secondary/40 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "w-8 h-8 rounded-md text-[10px] font-semibold transition-all",
                    currentPage === i + 1
                      ? "bg-secondary text-secondary-foreground shadow-md scale-105"
                      : "bg-card text-muted-foreground hover:bg-surface-container border border-border"
                  )}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="w-8 h-8 rounded-md bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-secondary hover:border-secondary/40 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {clientToDelete && (
          <div className="fixed inset-0 bg-primary/20 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="card-premium bg-card max-w-md w-full text-center p-12 space-y-8"
            >
              <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-md flex items-center justify-center mx-auto shadow-inner border border-destructive/20">
                <Trash2 size={36} />
              </div>
              <div className="space-y-3">
                <h3 className="text-h3 font-medium text-foreground uppercase tracking-tight">Remover Cliente?</h3>
                <p className="text-body-sm text-muted-foreground leading-relaxed font-medium">
                  Você está prestes a remover <strong className="text-foreground">{clientToDelete.name}</strong> da sua carteira estratégica. Esta ação desvinculará todos os históricos financeiros.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <button onClick={() => setClientToDelete(null)} className="btn-ghost">Cancelar</button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-3 bg-destructive text-destructive-foreground rounded-md text-body-sm font-medium uppercase tracking-widest shadow-md hover:bg-destructive/90 transition-all"
                >
                  Confirmar Exclusão
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


    </div>
  );
}
