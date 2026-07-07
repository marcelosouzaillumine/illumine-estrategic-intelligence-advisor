import { useState, useEffect, useMemo } from "react";
import { auth } from '../../lib/firebase';
import { ClientsApplicationService } from './clients/ClientsApplicationService';
import { validateCNPJ, formatDoc } from '../../lib/utils';
import { useDataTable } from '../../hooks/useDataTable';

export function useClientsPageViewModel({ clients, setClients, setSelectedClient, isMaster, isPartner, userPartnerIds }: any) {
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
    const unsubscribe = ClientsApplicationService.subscribeToClients(isMaster, clients, setFullClients);
    return () => unsubscribe && unsubscribe();
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
    const unsubscribe = ClientsApplicationService.subscribeToPartners(setPartners);
    return () => unsubscribe && unsubscribe();
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
      const { data, cleanCnpj } = await ClientsApplicationService.fetchCNPJData(cnpjQuery);
      
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
      setError("A imagem é muito grande. Por favor, escolha uma imagem com menos de 500KB para melhor performance.");
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
      setError("Você precisa estar logado para salvar um cliente. Clique em 'Entrar com Google' na barra lateral.");
      return;
    }

    setLoading(true);
    try {
      await ClientsApplicationService.saveClient(
        formData,
        editingId,
        auth.currentUser.uid,
        isMaster,
        isPartner,
        userPartnerIds
      );
      
      setView("list");
      setEditingId(null);
    } catch (error) {
      console.error("Error saving client:", error);
      setError("Erro ao salvar cliente: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!clientToDelete) return;

    setLoading(true);
    try {
      await ClientsApplicationService.deleteClient(clientToDelete.id);
      setClientToDelete(null);
    } catch (error) {
      console.error("Error deleting client:", error);
      setError("Erro ao excluir cliente. Verifique o console para mais detalhes.");
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


  return {
    state: {
      view, loading, cnpjQuery, error, editingId, clientToDelete, showSegmentSuggestions, fullClients,
      formData, validationErrors, tempUnit, tempBranch, tempContact, activeFormTab, showAllBranches, partners,
      searchTerm, filters, sort, currentPage, totalPages, filteredClients, paginatedClients,
      clientTemplate
    },
    computed: {
      allSegments, uniqueSegments
    },
    actions: {
      setView, setLoading, setCnpjQuery, setError, setEditingId, setClientToDelete, setShowSegmentSuggestions, setFullClients,
      setFormData, setValidationErrors, setTempUnit, setTempBranch, setTempContact, setActiveFormTab, setShowAllBranches, setPartners,
      validateField, openAdd, openEdit, fetchCNPJ, handleImageUpload, handleSave, handleDelete,
      setSearchTerm, setFilters, toggleSort, setCurrentPage
    }
  };
}
