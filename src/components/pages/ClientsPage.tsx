
import React, { useState, useEffect, useMemo } from 'react';
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
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { PageHeader, StatusBadge } from '../Common';
import { DATA } from '../../data';
import { cn, formatCurrency } from '../../lib/utils';
import { useDataTable } from '../../hooks/useDataTable';
import { EmployeeManager } from '../EmployeeManager';
import { GenerateAICompanyModal } from '../modals/GenerateAICompanyModal';
import { ClientImportHistory } from '../ClientImportHistory';
import { ClientAccessLogs } from '../ClientAccessLogs';
import { ClientLoginAudit } from '../ClientLoginAudit';
import { ClientUserManager } from '../ClientUserManager';

export function ClientsPage({ clients, setClients, setSelectedClient }: any) {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [loading, setLoading] = useState(false);
  const [cnpjQuery, setCnpjQuery] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [clientToDelete, setClientToDelete] = useState<{ id: string, name: string } | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  
  const clientTemplate = {
    razao: '',
    fantasia: '',
    cnpj: '',
    segmento: 'Serviços',
    subsetor: 'Consultoria',
    regime: 'Lucro Presumido',
    regimeReal: 'Não Cumulativo',
    rbt12: 0,
    faturamentoMensal: 0,
    historicoFaturamento: Array(12).fill(null).map(() => ({ mes: '', ano: '', valor: 0 })),
    porte: 'Médio Porte',
    cidade: '',
    endereco: '',
    cnae: '',
    cnaeAnexo: 'Anexo I',
    cnaePresuncao: 'Venda de produtos / Mercadorias',
    cnaeRegimeReal: 'Não Cumulativo',
    cnaesSecundarios: [] as { 
      codigo: string; 
      descricao: string; 
      anexo: string;
      presuncao: string;
      regimeReal: string;
    }[],
    contatosAdicionais: [] as { nome: string; email: string; tel: string; cargo: string }[],
    dataFundacao: '',
    capitalSocial: 0,
    socios: [] as { nome: string; participacao: number }[],
    filiais: [] as { nome: string; cidade: string; cnpj: string }[],
    unidadesNegocio: [] as string[],
    contato: {
      nome: '',
      funcao: '',
      telefone: '',
      email: ''
    },
    status: 'Ativo',
    notasAdicionais: '',
    website: '',
    socialMedia: [
      { platform: 'LinkedIn', url: '' },
      { platform: 'Instagram', url: '' }
    ],
    logo: '',
    icon: '',
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
    ]
  };

  const [formData, setFormData] = useState(clientTemplate);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [tempUnit, setTempUnit] = useState('');

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'cnpj') {
      const clean = value.replace(/\D/g, '');
      if (value && clean.length !== 14) {
        error = 'CNPJ inválido (deve conter 14 dígitos)';
      }
    } else if (name === 'razao') {
      if (!value.trim()) error = 'Razão Social é obrigatória';
    } else if (name === 'fantasia') {
      if (!value.trim()) error = 'Nome Fantasia é obrigatório';
    } else if (name === 'contatoNome') {
      if (value.length > 0 && value.length < 3) {
        error = 'Nome muito curto';
      }
    } else if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        error = 'Formato de e-mail inválido';
      }
    }
    setValidationErrors(prev => ({ ...prev, [name]: error }));
  };

  const [tempBranch, setTempBranch] = useState({ nome: '', cidade: '', cnpj: '' });
  const [tempContact, setTempContact] = useState({ nome: '', email: '', tel: '', cargo: '' });
  const [activeFormTab, setActiveFormTab] = useState<'dados' | 'estrutura' | 'fiscal' | 'contato' | 'usuarios' | 'pessoal' | 'relatorio_ia' | 'importacao' | 'acessos' | 'auditoria'>('dados');
  const [showAllBranches, setShowAllBranches] = useState(false);

  // Auto-fetch CNPJ when 14 digits are typed
  useEffect(() => {
    const cleanCnpj = cnpjQuery.replace(/\D/g, '');
    if (cleanCnpj.length === 14 && !loading && !editingId) {
      fetchCNPJ();
    }
  }, [cnpjQuery]);

  const openAdd = () => {
    setEditingId(null);
    setFormData(clientTemplate);
    setValidationErrors({});
    setCnpjQuery('');
    setError('');
    setView('form');
    setActiveFormTab('dados');
  };

  const openEdit = (client: any) => {
    setEditingId(client.id);
    const data = { ...clientTemplate, ...client };
    setFormData(data);
    setCnpjQuery(client.cnpj);
    setError('');
    setView('form');
    setActiveFormTab('dados');
    
    // Initial validation for editing
    validateField('cnpj', client.cnpj);
    validateField('razao', data.razao);
    validateField('fantasia', data.fantasia);
    validateField('email', data.contato?.email || '');
    validateField('contatoNome', data.contato?.nome || '');
  };

  const fetchCNPJ = async () => {
    if (!cnpjQuery) return;
    setLoading(true);
    setError('');
    try {
      const cleanCnpj = cnpjQuery.replace(/\D/g, '');
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
      if (!response.ok) throw new Error('CNPJ não encontrado ou erro na busca.');
      const data = await response.json();
      
      setFormData({
        ...formData,
        razao: data.razao_social || '',
        fantasia: data.nome_fantasia || data.razao_social || '',
        cnpj: data.cnpj || cleanCnpj,
        cidade: `${data.municipio}/${data.uf}`,
        endereco: `${data.logradouro}, ${data.numero} - ${data.bairro}, ${data.municipio} - ${data.uf}, ${data.cep}`,
        cnae: `${data.cnae_fiscal} (${data.cnae_fiscal_descricao})`,
        cnaeAnexo: 'Anexo I',
        cnaePresuncao: 'Venda de produtos / Mercadorias',
        cnaeRegimeReal: 'Não Cumulativo',
        cnaesSecundarios: (data.cnaes_secundarios || []).map((c: any) => ({
          codigo: c.codigo,
          descricao: c.descricao,
          anexo: 'Anexo I',
          presuncao: 'Venda de produtos / Mercadorias',
          regimeReal: 'Não Cumulativo'
        })),
        rbt12: 0,
        faturamentoMensal: 0,
        historicoFaturamento: Array(12).fill(null).map(() => ({ mes: '', ano: '', valor: 0 })),
        contatosAdicionais: [],
        dataFundacao: data.data_inicio_atividade ? new Date(data.data_inicio_atividade).toLocaleDateString('pt-BR') : '',
        capitalSocial: data.capital_social || 0,
        socios: (data.qsa || []).map((s: any, _: number, arr: any[]) => ({
          nome: s.nome_socio || s.nome || s.nome_socio_pessoa_fisica || 'Sócio não identificado',
          participacao: s.percentual_capital || s.percentual_capital_social || s.participacao || s.percentual || (arr.length === 1 ? 100 : 0)
        })),
        porte: data.porte === 'DEMAIS' ? 'Médio Porte' : data.porte || 'Médio Porte'
      });
      
      // Clear validation errors for auto-populated fields
      setValidationErrors(prev => ({
        ...prev,
        cnpj: '',
        razao: '',
        fantasia: ''
      }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'icon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 500KB for Base64 storage)
    if (file.size > 512 * 1024) {
      alert('A imagem é muito grande. Por favor, escolha uma imagem com menos de 500KB para melhor performance.');
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
      alert('Você precisa estar logado para salvar um cliente. Clique em "Entrar com Google" na barra lateral.');
      return;
    }

    setLoading(true);
    try {
      const clientData = {
        ...formData,
        ownerId: auth.currentUser.uid,
        updatedAt: serverTimestamp(),
        status: 'Ativo'
      };

      let clientId = editingId;

      if (editingId) {
        await updateDoc(doc(db, 'clients', editingId), clientData);
      } else {
        // Create new client in Firestore
        const docRef = await addDoc(collection(db, 'clients'), {
          ...clientData,
          createdAt: serverTimestamp()
        });
        clientId = docRef.id;
        
        // Automate Account Plan creation for the new client from standard plan
        console.log(`Creating default account plan for client ${clientId}...`);
        const batch = DATA.accountPlanPadrão.map(acc => {
           return addDoc(collection(db, 'account_plans'), {
            ...acc,
            clientId: clientId,
            planType: 'accounting',
            status: acc.status || 'Ativa',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            createdBy: auth.currentUser?.uid
          });
        });
        await Promise.all(batch);
      }
      
      setView('list');
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
        'account_plans',
        'financial_entries',
        'client_assumptions',
        'diretrizes',
        'employees',
        'precificacao',
        'diagnostico',
        'okrs',
        'payables',
        'receivables'
      ];

      // Clean up all related documents first
      for (const coll of collectionsToClean) {
        try {
          const q = query(collection(db, coll), where('clientId', '==', clientId));
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
      await deleteDoc(doc(db, 'clients', clientId));
      
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
  } = useDataTable(clients, {
    searchFields: ['razao', 'fantasia', 'cnpj', 'segmento', 'cidade'],
    initialSort: { key: 'fantasia', direction: 'asc' },
    itemsPerPage: 5
  });

  const uniqueSegments = useMemo(() => {
    const segments = clients.map((c: any) => c.segmento).filter(Boolean);
    return ['Todos', ...Array.from(new Set(segments)).sort()];
  }, [clients]);

  if (view === 'form') {
    return (
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <button 
              onClick={() => setView('list')}
              className="group flex items-center gap-2 text-[10px] font-black text-text-dim uppercase tracking-[0.2em] hover:text-secondary transition-all mb-4"
            >
              <div className="w-6 h-6 rounded-full border border-border-main flex items-center justify-center group-hover:border-secondary transition-all">
                <ChevronLeft size={12} />
              </div>
              Voltar para lista
            </button>
            <h2 className="text-4xl font-display font-black text-text-main tracking-tight">
              {editingId ? 'Alterar Cadastro' : 'Cadastrar Empresa'}
            </h2>
            <p className="text-text-muted text-sm mt-3 font-sans max-w-xl leading-relaxed">
              Configure as informações estratégicas, estrutura societária e parâmetros tributários da organização.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('list')}
              className="btn-ghost"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              className="btn-accent px-10"
            >
              <Save size={16} />
              {editingId ? 'Salvar Alterações' : 'Confirmar Cadastro'}
            </button>
          </div>
        </div>

        <div className="card-premium p-0 overflow-hidden flex flex-col border-none shadow-floating">
          {/* Executive Tabs Navigation */}
          <div className="flex bg-bg-surface border-b border-border-main p-2 gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'dados', label: 'Empresa', icon: Building2 },
              { id: 'estrutura', label: 'Estrutura', icon: LayoutGrid },
              { id: 'fiscal', label: 'Fiscal', icon: Landmark },
              { id: 'contato', label: 'Contatos', icon: Users },
              { id: 'usuarios', label: 'Usuários', icon: Key },
              { id: 'importacao', label: 'Importações', icon: History },
              { id: 'acessos', label: 'Acessos', icon: ShieldCheck },
              { id: 'auditoria', label: 'Auditoria', icon: Activity },
              { id: 'relatorio_ia', label: 'Insights IA', icon: Sparkles },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFormTab(tab.id as any)}
                className={cn(
                  "relative flex items-center gap-3 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-standard whitespace-nowrap",
                  activeFormTab === tab.id 
                    ? "bg-bg-card text-secondary shadow-premium border border-border-main" 
                    : "text-text-dim hover:text-text-main hover:bg-bg-card/50"
                )}
              >
                <tab.icon size={14} strokeWidth={1.5} className={cn(activeFormTab === tab.id ? "text-secondary" : "text-text-dim")} />
                {tab.label}
                {activeFormTab === tab.id && (
                  <motion.div 
                    layoutId="active-tab-indicator"
                    className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-1 h-1 bg-secondary rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="p-12 flex-1 bg-bg-card">
            {activeFormTab === 'dados' && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div>
                      <label className="text-label">Busca por CNPJ</label>
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <input 
                            type="text" 
                            placeholder="00.000.000/0000-00"
                            value={cnpjQuery}
                            onChange={(e) => {
                              setCnpjQuery(e.target.value);
                              validateField('cnpj', e.target.value);
                            }}
                            className={cn(
                              "w-full px-5 py-3 bg-bg-surface border border-border-main rounded-standard text-sm outline-none transition-all focus:bg-bg-card",
                              validationErrors.cnpj ? "border-rose-300 focus:ring-rose-500/10" : "focus:ring-secondary/10"
                            )}
                          />
                        </div>
                        <button 
                          onClick={fetchCNPJ}
                          disabled={loading}
                          className="btn-executive py-3 px-8"
                        >
                          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                          Carregar Dados
                        </button>
                      </div>
                      {validationErrors.cnpj && <p className="text-[10px] text-rose-500 font-black mt-2 uppercase tracking-widest">{validationErrors.cnpj}</p>}
                      {error && (
                        <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-standard flex items-start gap-3">
                          <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10px] font-black text-rose-700 uppercase tracking-widest mb-1">Erro de Sincronização</p>
                            <p className="text-xs text-rose-600/80 font-medium leading-relaxed">{error}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-label">Razão Social</label>
                        <input 
                          type="text" 
                          value={formData.razao}
                          onChange={(e) => {
                            setFormData({...formData, razao: e.target.value});
                            validateField('razao', e.target.value);
                          }}
                          className={cn(
                            "w-full px-5 py-3 bg-bg-card border border-border-main rounded-standard text-sm outline-none transition-all",
                            validationErrors.razao ? "border-rose-300 focus:border-rose-500" : "focus:border-secondary"
                          )}
                        />
                        {validationErrors.razao && <p className="text-[10px] text-rose-500 font-black mt-2 uppercase tracking-widest">{validationErrors.razao}</p>}
                      </div>
                      <div>
                        <label className="text-label">Nome Fantasia</label>
                        <input 
                          type="text" 
                          value={formData.fantasia}
                          onChange={(e) => {
                            setFormData({...formData, fantasia: e.target.value});
                            validateField('fantasia', e.target.value);
                          }}
                          className={cn(
                            "w-full px-5 py-3 bg-bg-card border border-border-main rounded-standard text-sm outline-none transition-all",
                            validationErrors.fantasia ? "border-rose-300 focus:border-rose-500" : "focus:border-secondary"
                          )}
                        />
                        {validationErrors.fantasia && <p className="text-[10px] text-rose-500 font-black mt-2 uppercase tracking-widest">{validationErrors.fantasia}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-label">Fundação</label>
                        <div className="px-5 py-3 bg-bg-surface border border-border-main rounded-standard text-sm text-text-dim font-bold flex items-center gap-3">
                          <Calendar size={14} strokeWidth={2} />
                          {formData.dataFundacao || '--/--/----'}
                        </div>
                      </div>
                      <div>
                         <label className="text-label">Porte</label>
                         <div className="px-5 py-3 bg-bg-surface border border-border-main rounded-standard text-sm text-text-dim font-bold flex items-center gap-3">
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
                        className="w-full px-5 py-3 bg-bg-card border border-border-main rounded-standard text-sm outline-none focus:border-secondary transition-all leading-relaxed"
                        placeholder="Logradouro, número, bairro, cidade - UF"
                      />
                    </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-border-soft">
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
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="text-label mb-0">Logo</label>
                              <label className="cursor-pointer text-[9px] font-black text-secondary uppercase hover:underline flex items-center gap-1.5 transition-all">
                                <Upload size={12} /> Importar
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logo')} />
                              </label>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-bg-surface border border-border-main flex items-center justify-center overflow-hidden shrink-0 shadow-sm transition-all group-hover:border-secondary/20">
                                {formData.logo ? (
                                  <img src={formData.logo} alt="Logo" className="w-full h-full object-contain p-1" />
                                ) : (
                                  <ImageIcon size={20} className="text-text-dim/40" />
                                )}
                              </div>
                              <div className="relative flex-1">
                                <input 
                                  type="text" 
                                  placeholder="URL ou Nome"
                                  value={formData.logo.startsWith('data:image') ? 'Imagem Local' : formData.logo}
                                  onChange={(e) => setFormData({...formData, logo: e.target.value})}
                                  readOnly={formData.logo.startsWith('data:image')}
                                  className={cn(
                                    "w-full px-4 py-2.5 bg-bg-surface border border-border-main rounded-standard text-[10px] font-bold outline-none focus:border-secondary transition-all",
                                    formData.logo.startsWith('data:image') && "text-secondary italic"
                                  )}
                                />
                                {formData.logo.startsWith('data:image') && (
                                  <button onClick={() => setFormData({...formData, logo: ''})} className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-500 p-1 hover:bg-rose-50 rounded-full transition-all">
                                    <X size={12} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="text-label mb-0">Ícone</label>
                              <label className="cursor-pointer text-[9px] font-black text-secondary uppercase hover:underline flex items-center gap-1.5 transition-all">
                                <Upload size={12} /> Importar
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'icon')} />
                              </label>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-bg-surface border border-border-main flex items-center justify-center overflow-hidden shrink-0 shadow-sm transition-all group-hover:border-secondary/20">
                                {formData.icon ? (
                                  <img src={formData.icon} alt="Icon" className="w-full h-full object-contain p-1" />
                                ) : (
                                  <ImageIcon size={20} className="text-text-dim/40" />
                                )}
                              </div>
                              <div className="relative flex-1">
                                <input 
                                  type="text" 
                                  placeholder="URL ou Nome"
                                  value={formData.icon.startsWith('data:image') ? 'Imagem Local' : formData.icon}
                                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                                  readOnly={formData.icon.startsWith('data:image')}
                                  className={cn(
                                    "w-full px-4 py-2.5 bg-bg-surface border border-border-main rounded-standard text-[10px] font-bold outline-none focus:border-secondary transition-all",
                                    formData.icon.startsWith('data:image') && "text-secondary italic"
                                  )}
                                />
                                {formData.icon.startsWith('data:image') && (
                                  <button onClick={() => setFormData({...formData, icon: ''})} className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-500 p-1 hover:bg-rose-50 rounded-full transition-all">
                                    <X size={12} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    <div className="pt-10 border-t border-border-soft space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-label mb-0">Quadro Societário</label>
                          <span className="text-[10px] text-text-dim font-medium italic">* Percentuais calculados com base no capital social integralizado.</span>
                        </div>
                        <button 
                          onClick={() => setFormData({...formData, socios: [...formData.socios, { nome: '', participacao: 0 }]})}
                          className="text-[10px] font-black text-secondary uppercase tracking-widest hover:underline flex items-center gap-2"
                        >
                          <Plus size={14} /> Adicionar Sócio
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.socios.map((s, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-4 bg-bg-surface border border-border-main rounded-standard relative group/socio hover:border-secondary/20 transition-all">
                            <div className="w-10 h-10 rounded-full bg-bg-card border border-border-main flex items-center justify-center text-text-dim group-hover/socio:text-secondary transition-all shadow-sm shrink-0">
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
                                className="w-full bg-transparent text-sm font-black text-text-main outline-none placeholder:text-text-dim/50"
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
                                  className="w-16 bg-transparent text-[11px] font-black text-secondary outline-none border-b border-transparent focus:border-secondary/30"
                                />
                                <span className="text-[10px] text-text-dim font-bold uppercase tracking-widest">% participação</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => setFormData({...formData, socios: formData.socios.filter((_, i) => i !== idx)})}
                              className="absolute -top-2 -right-2 w-8 h-8 bg-bg-card border border-border-main text-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover/socio:opacity-100 transition-all shadow-floating hover:bg-rose-50"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
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
                        onClick={() => setFormData({...formData, socialMedia: [...formData.socialMedia, { platform: 'LinkedIn', url: '' }]})}
                        className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] flex items-center gap-2 hover:underline pt-2"
                      >
                        <Plus size={14} /> Adicionar Presença Digital
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeFormTab === 'estrutura' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <div className="card-premium bg-bg-surface/50 border-dashed">
                        <h4 className="text-sm font-black text-text-main uppercase tracking-widest mb-6 flex items-center gap-3">
                          <Activity size={18} className="text-secondary" /> Unidades de Negócio
                        </h4>
                        <div className="flex gap-3 mb-6">
                          <input 
                            type="text" 
                            placeholder="Ex: Medicina Laboratorial"
                            value={tempUnit}
                            onChange={(e) => setTempUnit(e.target.value)}
                            className="flex-1 px-5 py-3 bg-bg-card border border-border-main rounded-standard text-sm outline-none focus:border-secondary transition-all"
                          />
                          <button 
                            onClick={() => {
                              if (tempUnit) {
                                setFormData({...formData, unidadesNegocio: [...formData.unidadesNegocio, tempUnit]});
                                setTempUnit('');
                              }
                            }}
                            className="btn-accent p-3"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.unidadesNegocio.map((u, i) => (
                            <span key={i} className="px-4 py-2 bg-bg-card border border-border-main rounded-full text-[10px] font-black text-text-muted flex items-center gap-2 shadow-sm">
                              {u}
                              <button onClick={() => setFormData({...formData, unidadesNegocio: formData.unidadesNegocio.filter((_, idx) => idx !== i)})} className="text-rose-400 hover:text-rose-600 transition-colors">
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                          {formData.unidadesNegocio.length === 0 && (
                            <p className="text-[10px] text-text-dim italic font-medium">Nenhuma unidade cadastrada.</p>
                          )}
                        </div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="card-premium bg-bg-surface/50 border-dashed">
                        <h4 className="text-sm font-black text-text-main uppercase tracking-widest mb-6 flex items-center gap-3">
                          <Building2 size={18} className="text-secondary" /> Filiais e Filas
                        </h4>
                        <div className="space-y-4">
                          <input 
                            type="text" placeholder="Nome da Unidade / Filial"
                            value={tempBranch.nome}
                            onChange={(e) => setTempBranch({...tempBranch, nome: e.target.value})}
                            className="w-full px-5 py-3 bg-bg-card border border-border-main rounded-standard text-sm outline-none focus:border-secondary transition-all"
                          />
                          <div className="flex gap-3">
                            <input 
                              type="text" placeholder="Cidade / UF"
                              value={tempBranch.cidade}
                              onChange={(e) => setTempBranch({...tempBranch, cidade: e.target.value})}
                              className="flex-1 px-5 py-3 bg-bg-card border border-border-main rounded-standard text-sm outline-none focus:border-secondary transition-all"
                            />
                            <button 
                              onClick={() => {
                                if (tempBranch.nome) {
                                  setFormData({...formData, filiais: [...formData.filiais, tempBranch]});
                                  setTempBranch({ nome: '', cidade: '', cnpj: '' });
                                }
                              }}
                              className="btn-accent px-6"
                            >Adicionar</button>
                          </div>
                        </div>
                        <div className="mt-8 space-y-3">
                          {formData.filiais.map((f, i) => (
                            <div key={i} className="flex justify-between items-center bg-bg-card p-4 rounded-standard border border-border-main shadow-sm group">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-bg-surface rounded-xl flex items-center justify-center text-text-dim group-hover:text-secondary transition-all"><MapPin size={16} /></div>
                                <div>
                                  <p className="text-sm font-black text-text-main">{f.nome}</p>
                                  <p className="text-[11px] text-text-dim font-bold uppercase tracking-widest">{f.cidade}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => setFormData({...formData, filiais: formData.filiais.filter((_, idx) => idx !== i)})} 
                                className="w-8 h-8 rounded-full flex items-center justify-center text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
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
            {activeFormTab === 'fiscal' && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
                <div className="card-premium space-y-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-2">
                      <h4 className="text-sm font-black text-text-main uppercase tracking-widest flex items-center gap-3">
                        <Landmark size={20} className="text-secondary" /> Enquadramento Tributário
                      </h4>
                      <p className="text-[11px] text-text-dim font-medium lowercase italic">Defina o regime federal principal para automatização dos cálculos de rentabilidade.</p>
                    </div>
                    
                    <div className="flex bg-bg-surface p-1.5 rounded-2xl border border-border-main">
                      {['Simples Nacional', 'Lucro Presumido', 'Lucro Real'].map(regime => (
                        <button
                          key={regime}
                          onClick={() => setFormData({...formData, regime})}
                          className={cn(
                            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            formData.regime === regime 
                              ? "bg-bg-card text-secondary shadow-premium border border-border-main" 
                              : "text-text-dim hover:text-text-main"
                          )}
                        >
                          {regime}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10 border-t border-border-soft">
                    {formData.regime === 'Lucro Real' && (
                      <div className="space-y-3">
                        <label className="text-label">Método de Apuração (LR)</label>
                        <select 
                          value={formData.regimeReal}
                          onChange={(e) => setFormData({...formData, regimeReal: e.target.value})}
                          className="w-full px-5 py-3 bg-bg-surface border border-border-main rounded-standard text-sm font-bold outline-none focus:border-secondary transition-all"
                        >
                          <option value="Cumulativo">Cumulativo (654/98)</option>
                          <option value="Não Cumulativo">Não Cumulativo (10.637/10.833)</option>
                          <option value="Híbrido">Híbrido (Misto)</option>
                        </select>
                      </div>
                    )}

                    {formData.regime === 'Lucro Presumido' && (
                      <div className="space-y-3">
                        <label className="text-label">Cálculo Padrão IRPJ/CSLL</label>
                        <select 
                          value={formData.cnaePresuncao}
                          onChange={(e) => setFormData({...formData, cnaePresuncao: e.target.value})}
                          className="w-full px-5 py-3 bg-bg-surface border border-border-main rounded-standard text-sm font-bold outline-none focus:border-secondary transition-all"
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
                      <div className="px-5 py-3 bg-bg-surface border border-border-main rounded-standard text-sm font-black text-text-dim">
                        {formData.porte || 'Não identificado'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Main Tax Activity Section (Nested Grid) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                  
                  {/* Left Column: Revenue History (Simples only) or Detail Parameters */}
                  <div className="space-y-10">
                    {formData.regime === 'Simples Nacional' ? (
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
                                  const lines = text.split('\n').filter(l => l.trim());
                                  const newHistory = [...formData.historicoFaturamento];
                                  lines.slice(0, 12).forEach((line, i) => {
                                    const parts = line.split(/[,;]/);
                                    if (parts.length >= 3) {
                                      newHistory[i] = {
                                        mes: parts[0].trim().toUpperCase(),
                                        ano: parts[1].trim(),
                                        valor: parseFloat(parts[2].replace(/[R$ \.]/g, '').replace(',', '.')) || 0
                                      };
                                    }
                                  });
                                  const newRbt12 = newHistory.reduce((acc, curr) => acc + (curr.valor || 0), 0);
                                  setFormData({ ...formData, historicoFaturamento: newHistory, rbt12: newRbt12 });
                                };
                                reader.readAsText(file, 'UTF-8');
                              }}
                            />
                          </label>
                        </div>

                        <div className="bg-bg-card rounded-2xl border border-border-main overflow-hidden shadow-sm">
                          <div className="max-h-[460px] overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                              <thead className="sticky top-0 bg-bg-surface/95 backdrop-blur-md z-10 border-b border-border-main">
                                <tr>
                                  <th className="px-6 py-4 text-[10px] font-black text-text-dim uppercase tracking-widest">Referência</th>
                                  <th className="px-6 py-4 text-[10px] font-black text-text-dim uppercase tracking-widest text-right">Faturamento Bruto</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border-soft">
                                {(formData.historicoFaturamento || Array(12).fill({ mes: '', ano: '', valor: 0 })).map((item, idx) => (
                                  <tr key={idx} className="hover:bg-bg-surface/50 transition-colors group">
                                    <td className="px-6 py-4">
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
                                          {['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'].map(m => (
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
                                          {['2023', '2024', '2025', '2026'].map(y => (
                                            <option key={y} value={y}>{y}</option>
                                          ))}
                                        </select>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
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
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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
                          {formData.regime === 'Simples Nacional' && (
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
                                  <p className="text-[11px] font-bold text-slate-600 truncate">{formData.cnae}</p>
                               </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                               {formData.regime === 'Simples Nacional' ? (
                                  <div className="space-y-2">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Enquadramento do Anexo</label>
                                     <select 
                                       value={formData.cnaeAnexo}
                                       onChange={(e) => setFormData({...formData, cnaeAnexo: e.target.value})}
                                       className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black outline-none focus:border-primary transition-all"
                                     >
                                        {['Anexo I - Comércio', 'Anexo II - Indústria', 'Anexo III - Serviços', 'Anexo IV - Serviços Esp.', 'Anexo V - Serviços F.R'].map((anexo, i) => (
                                           <option key={i} value={`Anexo ${['I','II','III','IV','V'][i]}`}>{anexo}</option>
                                        ))}
                                     </select>
                                  </div>
                               ) : formData.regime === 'Lucro Presumido' ? (
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
                                  formData.regimeReal === 'Híbrido' ? (
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
                                    const newCnae = { codigo: '', descricao: '', anexo: 'Anexo I', presuncao: 'Venda de produtos / Mercadorias', regimeReal: 'Não Cumulativo' };
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
                                        {formData.regime === 'Simples Nacional' && (
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
                                        {formData.regime === 'Lucro Presumido' && (
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
                                        {formData.regime === 'Lucro Real' && formData.regimeReal === 'Híbrido' && (
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
                                        {formData.regime === 'Lucro Real' && formData.regimeReal !== 'Híbrido' && (
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
                            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Base de Cálculo (Até R$)</th>
                            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Alíquota (%)</th>
                            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Dedução (R$)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {formData.folhaTabelaIRRF.map((item, idx) => (
                            <tr key={idx}>
                              <td className="px-6 py-3">
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
                              <td className="px-6 py-3">
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
                              <td className="px-6 py-3">
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

            {activeFormTab === 'contato' && (
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
                          validateField('contatoNome', e.target.value);
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
                          validateField('email', e.target.value);
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

                <div className="card-premium bg-bg-surface/50 border-dashed">
                   <h4 className="text-sm font-black text-text-dim uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                     <Users size={18} className="text-secondary" /> Contatos Adicionais
                   </h4>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input 
                            type="text" placeholder="Nome" 
                            value={tempContact.nome}
                            onChange={(e) => setTempContact({...tempContact, nome: e.target.value})}
                            className="w-full px-4 py-2.5 bg-bg-card border border-border-main rounded-standard text-xs font-bold outline-none focus:border-secondary transition-all"
                          />
                          <input 
                            type="text" placeholder="Cargo" 
                            value={tempContact.cargo}
                            onChange={(e) => setTempContact({...tempContact, cargo: e.target.value})}
                            className="w-full px-4 py-2.5 bg-bg-card border border-border-main rounded-standard text-xs font-bold outline-none focus:border-secondary transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input 
                            type="email" placeholder="E-mail" 
                            value={tempContact.email}
                            onChange={(e) => setTempContact({...tempContact, email: e.target.value})}
                            className="w-full px-4 py-2.5 bg-bg-card border border-border-main rounded-standard text-xs font-bold outline-none focus:border-secondary transition-all"
                          />
                          <div className="flex gap-2">
                            <input 
                              type="tel" placeholder="Telefone" 
                              value={tempContact.tel}
                              onChange={(e) => setTempContact({...tempContact, tel: e.target.value})}
                              className="flex-1 px-4 py-2.5 bg-bg-card border border-border-main rounded-standard text-xs font-bold outline-none focus:border-secondary transition-all"
                            />
                            <button 
                              onClick={() => {
                                if (tempContact.nome) {
                                  setFormData({...formData, contatosAdicionais: [...formData.contatosAdicionais, tempContact]});
                                  setTempContact({ nome: '', email: '', tel: '', cargo: '' });
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
                          <div key={i} className="flex items-center justify-between bg-bg-card p-4 rounded-standard border border-border-main shadow-sm group">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-bg-surface rounded-xl flex items-center justify-center text-text-dim group-hover:text-secondary transition-all shadow-sm"><Users size={16} /></div>
                              <div>
                                <p className="text-sm font-black text-text-main">{c.nome} <span className="text-text-dim font-bold text-[10px] ml-2 uppercase tracking-widest">({c.cargo})</span></p>
                                <p className="text-[11px] text-text-muted font-medium italic">{c.email} • {c.tel}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => setFormData({...formData, contatosAdicionais: formData.contatosAdicionais.filter((_, idx) => idx !== i)})}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ))}
                        {formData.contatosAdicionais.length === 0 && (
                          <div className="h-full flex items-center justify-center border-2 border-dashed border-border-main rounded-standard p-8 text-text-dim text-[10px] font-black uppercase tracking-widest italic">
                            Nenhum contato adicional
                          </div>
                        )}
                     </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeFormTab === 'usuarios' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                {editingId ? (
                  <ClientUserManager clientId={editingId} />
                ) : (
                  <div className="card-premium bg-bg-surface/50 border-dashed text-center py-24 space-y-8">
                    <div className="w-24 h-24 bg-bg-card rounded-[2rem] flex items-center justify-center text-text-dim mx-auto shadow-premium border border-border-main">
                        <Key size={40} className="opacity-50" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-display font-black text-text-main uppercase tracking-widest">Aguardando Cadastro</h4>
                      <p className="text-xs text-text-muted font-medium uppercase tracking-[0.2em] max-w-[300px] mx-auto leading-relaxed">Para gerenciar usuários e acessos, conclua primeiro o salvamento dos dados básicos da empresa.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeFormTab === 'pessoal' && (
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

            {activeFormTab === 'relatorio_ia' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                {(formData as any).aiAnalysis ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-10">
                      <div className="card-premium space-y-6">
                        <h4 className="text-sm font-black text-text-main uppercase tracking-[0.2em] flex items-center gap-3">
                          <AlertCircle size={18} className="text-rose-500" /> Desafios Estratégicos
                        </h4>
                        <div className="space-y-4">
                          {((formData as any).aiAnalysis.challenges || []).map((c: string, i: number) => (
                            <div key={i} className="text-xs text-text-muted font-medium leading-relaxed bg-bg-surface p-4 rounded-standard border border-border-soft">
                              {c}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="card-premium space-y-6">
                        <h4 className="text-sm font-black text-text-main uppercase tracking-[0.2em] flex items-center gap-3">
                          <TrendingUp size={18} className="text-emerald-500" /> Oportunidades de Crescimento
                        </h4>
                        <div className="space-y-4">
                          {((formData as any).aiAnalysis.growthSuggestions || []).map((c: string, i: number) => (
                            <div key={i} className="text-xs text-text-muted font-medium leading-relaxed bg-bg-surface p-4 rounded-standard border border-border-soft">
                              {c}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-10">
                      <div className="bg-primary p-10 rounded-standard text-white space-y-6 shadow-floating-primary relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                        <h4 className="text-[11px] font-black text-white/50 uppercase tracking-[0.3em] flex items-center gap-2">
                          <ShieldCheck size={14} /> Governança & Estrutura
                        </h4>
                        <p className="text-sm font-medium leading-relaxed text-white/90 italic">
                          "{((formData as any).aiAnalysis?.governance || 'N/A')}"
                        </p>
                      </div>

                      <div className="card-premium space-y-6">
                        <h4 className="text-sm font-black text-text-main uppercase tracking-[0.2em]">Fluxo Operacional</h4>
                        <div className="text-xs text-text-muted font-medium leading-relaxed bg-bg-surface p-5 rounded-standard border border-border-soft border-dashed italic">
                          {((formData as any).aiAnalysis?.operationalFlow || 'N/A')}
                        </div>
                      </div>

                      <div className="card-premium space-y-6">
                        <h4 className="text-sm font-black text-text-main uppercase tracking-[0.2em] flex items-center gap-3">
                          <LayoutGrid size={18} className="text-secondary" /> Dashboards Sugeridos
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {((formData as any).aiAnalysis?.dashboardIdeas || []).map((c: string, i: number) => (
                            <span key={i} className="px-4 py-2 bg-secondary/5 text-secondary text-[10px] font-black uppercase rounded-lg border border-secondary/10">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card-premium bg-bg-surface/50 border-dashed text-center py-24 space-y-8">
                    <div className="w-24 h-24 bg-bg-card rounded-[2rem] flex items-center justify-center text-text-dim mx-auto shadow-premium border border-border-main">
                        <Sparkles size={40} className="opacity-50 text-secondary" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-display font-black text-text-main uppercase tracking-widest">Sem Análise de IA</h4>
                      <p className="text-xs text-text-muted font-medium uppercase tracking-[0.2em] max-w-[300px] mx-auto leading-relaxed">Este cliente não possui um relatório gerencial automatizado vinculado no momento.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {['pessoal', 'importacao', 'acessos', 'auditoria'].map(tab => (
              activeFormTab === tab && !editingId && (
                <div key={tab} className="card-premium bg-bg-surface/50 border-dashed text-center py-24 space-y-8">
                  <div className="w-24 h-24 bg-bg-card rounded-[2rem] flex items-center justify-center text-text-dim mx-auto shadow-premium border border-border-main">
                      <AlertCircle size={40} className="opacity-50" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-display font-black text-text-main uppercase tracking-widest">Aguardando Cadastro</h4>
                    <p className="text-xs text-text-muted font-medium uppercase tracking-[0.2em] max-w-[300px] mx-auto leading-relaxed">Para visualizar esta seção, você precisa primeiro concluir o cadastro básico da empresa.</p>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-32 animate-executive-fade">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
        <PageHeader 
          title="Dados de Cadastro"
          subtitle="Gestão centralizada de empresas, filiais e unidades de negócio sob consultoria estratégica."
          icon={Building2}
          color="bg-primary"
        />
        <div className="flex flex-wrap items-center gap-6">
           <div className="flex bg-bg-surface p-1.5 rounded-2xl border border-border-main shadow-sm">
             <button onClick={() => setFilters({...filters, status: ''})} className={cn("px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all", !filters.status ? "bg-bg-card text-text-main shadow-premium border border-border-main" : "text-text-dim hover:text-text-main")}>Todos</button>
             <button onClick={() => setFilters({...filters, status: 'Ativo'})} className={cn("px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all", filters.status === 'Ativo' ? "bg-bg-card text-emerald-600 shadow-premium border border-border-main" : "text-text-dim hover:text-text-main")}>Ativos</button>
             <button onClick={() => setFilters({...filters, status: 'Suspenso'})} className={cn("px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all", filters.status === 'Suspenso' ? "bg-bg-card text-rose-600 shadow-premium border border-border-main" : "text-text-dim hover:text-text-main")}>Suspensos</button>
           </div>
           
           <button 
            onClick={() => setIsAIModalOpen(true)}
            className="px-8 py-4 bg-bg-card text-text-main rounded-2xl text-[10px] font-black uppercase tracking-widest border border-border-main hover:bg-bg-surface transition-all flex items-center gap-3 shadow-premium"
          >
            <Sparkles size={18} className="text-secondary" />
            Empresa Modelo
          </button>

           <button 
            onClick={openAdd}
            className="btn-executive px-8 py-4 shadow-floating-primary"
          >
            <Plus size={18} /> ADICIONAR CLIENTE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-1 space-y-8">
           <div className="card-premium space-y-8">
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="PESQUISAR CLIENTE..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-bg-surface border border-border-main rounded-standard text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:bg-bg-card focus:border-secondary transition-all shadow-inner-soft"
                />
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" />
             </div>

             <div className="space-y-8">
               <div className="space-y-3">
                  <label className="text-label px-1">Segmento</label>
                  <select 
                    value={filters.segmento || 'Todos'}
                    onChange={(e) => setFilters({...filters, segmento: e.target.value === 'Todos' ? '' : e.target.value})}
                    className="w-full px-5 py-3 bg-bg-surface border border-border-main rounded-standard text-sm font-bold text-text-main outline-none focus:border-secondary transition-all cursor-pointer"
                  >
                    {uniqueSegments.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
               </div>
               
               <div className="pt-8 border-t border-border-soft">
                  <div className="bg-bg-surface p-6 rounded-standard border border-border-main relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <p className="text-label text-text-dim mb-2 relative z-10">Total na Carteira</p>
                    <p className="text-5xl font-display font-black text-text-main relative z-10 tracking-tighter">{clients.length}</p>
                  </div>
               </div>
             </div>
           </div>
           
           <div className="p-8 bg-bg-surface/30 rounded-executive border border-border-soft border-dashed space-y-3">
             <h4 className="text-[10px] font-black text-text-main uppercase tracking-[0.2em] flex items-center gap-2">
               <ShieldCheck size={14} className="text-secondary" /> Integridade
             </h4>
             <p className="text-[11px] text-text-muted leading-relaxed font-medium">Os cadastros aqui vinculados alimentam automaticamente as páginas de DRE, Fluxo de Caixa e Viabilidade Estratégica.</p>
           </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
           {paginatedClients.length === 0 ? (
              <div className="card-premium border-2 border-dashed flex flex-col items-center justify-center text-center p-20">
                 <div className="w-20 h-20 bg-bg-surface rounded-full flex items-center justify-center text-text-dim mb-6"><Filter size={36} /></div>
                 <h3 className="text-xl font-bold text-text-main mb-2">Nenhum cliente encontrado</h3>
                 <p className="text-sm text-text-muted font-sans max-w-xs">Ajuste os filtros ou o termo de busca para localizar a empresa.</p>
              </div>
           ) : (
              <div className="space-y-6">
                 {paginatedClients.map((client: any) => (
                   <motion.div 
                     layout
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     key={client.id} 
                     className="card-premium hover:border-secondary/40 group relative overflow-hidden"
                   >
                     <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 relative z-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                          <div className="w-16 h-16 bg-bg-surface rounded-2xl flex items-center justify-center border border-border-main group-hover:bg-secondary/5 group-hover:border-secondary/20 transition-all shrink-0 overflow-hidden shadow-sm">
                             {client.icon || client.logo ? (
                               <img src={client.icon || client.logo} alt={client.fantasia} className="w-full h-full object-contain p-2" />
                             ) : (
                               <Building2 size={28} className="text-text-muted group-hover:text-secondary transition-colors" />
                             )}
                          </div>
                          <div className="min-w-0">
                             <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h3 className="text-2xl font-display font-black tracking-tight text-text-main group-hover:text-secondary transition-colors truncate">{client.fantasia}</h3>
                                <StatusBadge status={client.status} />
                             </div>
                             <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">{client.segmento}</span>
                                {client.website && (
                                  <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-secondary transition-all flex items-center gap-1.5 border-b border-border-main hover:border-secondary pb-0.5">
                                     <Link2 size={12} /> {client.website.replace(/^https?:\/\//, '')}
                                  </a>
                                )}
                                <span className="text-xs font-medium text-text-muted flex items-center gap-1.5"><MapPin size={14} className="text-text-dim" /> {client.cidade}</span>
                                <span className="text-xs font-mono font-bold text-text-dim tracking-tight">{client.cnpj}</span>
                             </div>
                             {client.unidadesNegocio?.length > 0 && (
                               <div className="mt-4 flex flex-wrap gap-2">
                                 {client.unidadesNegocio.map((u: string, idx: number) => (
                                   <span key={idx} className="px-3 py-1 bg-bg-surface border border-border-main rounded-full text-[9px] font-black text-text-muted uppercase tracking-widest">
                                     {u}
                                   </span>
                                 ))}
                                 {client.filiais?.length > 0 && (
                                   <span className="px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full text-[9px] font-black text-secondary uppercase tracking-widest">
                                     +{client.filiais.length} Filia{client.filiais.length > 1 ? 'is' : 'l'}
                                   </span>
                                 )}
                               </div>
                             )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-end gap-3 pt-6 xl:pt-0 border-t xl:border-t-0 border-border-soft">
                          <button 
                            onClick={() => openEdit(client)}
                            className="p-3 text-text-dim hover:text-text-main hover:bg-bg-surface rounded-standard border border-transparent hover:border-border-main transition-all"
                            title="Editar Cadastro"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => setClientToDelete({ id: client.id, name: client.fantasia })}
                            className="p-3 text-text-dim hover:text-rose-500 hover:bg-rose-500/10 rounded-standard border border-transparent hover:border-rose-500/20 transition-all"
                            title="Remover Cliente"
                          >
                            <Trash2 size={18} />
                          </button>
                          <div className="h-8 w-px bg-border-main mx-2" />
                          <button className="btn-accent px-8">
                             Dashboard <ChevronRight size={14} />
                          </button>
                        </div>
                     </div>
                   </motion.div>
                 ))}
              </div>
           )}

           {totalPages > 1 && (
             <div className="flex items-center justify-between pt-8 border-t border-border-soft">
               <p className="text-label text-text-dim">Página {currentPage} de {totalPages}</p>
               <div className="flex gap-3">
                 <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-3 bg-bg-card border border-border-main rounded-xl text-text-dim hover:text-secondary hover:border-secondary disabled:opacity-20 transition-all shadow-premium"
                 >
                   <ChevronLeft size={20} />
                 </button>
                 <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="p-3 bg-bg-card border border-border-main rounded-xl text-text-dim hover:text-secondary hover:border-secondary disabled:opacity-20 transition-all shadow-premium"
                 >
                   <ChevronRight size={20} />
                 </button>
               </div>
             </div>
           )}
        </div>
      </div>

      <AnimatePresence>
        {clientToDelete && (
          <div className="fixed inset-0 bg-primary/20 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="card-premium bg-bg-card max-w-md w-full text-center p-12 space-y-8"
              >
                 <div className="w-24 h-24 bg-rose-500/10 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner-soft border border-rose-500/20">
                    <Trash2 size={40} />
                 </div>
                 <div className="space-y-3">
                    <h3 className="text-2xl font-display font-black text-text-main uppercase tracking-tight">Remover Cliente?</h3>
                    <p className="text-sm text-text-muted leading-relaxed font-medium">
                      Você está prestes a remover <strong className="text-text-main">{clientToDelete.name}</strong> da sua carteira estratégica. Esta ação desvinculará todos os históricos financeiros.
                    </p>
                 </div>
                 <div className="grid grid-cols-2 gap-4 pt-4">
                    <button 
                     onClick={() => setClientToDelete(null)}
                     className="px-6 py-4 bg-bg-surface text-text-dim rounded-2xl text-[10px] font-black uppercase tracking-widest border border-border-main hover:bg-bg-card transition-all"
                    >Cancelar</button>
                    <button 
                     onClick={handleDelete}
                     className="px-6 py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-floating-danger hover:bg-rose-700 transition-all"
                    >Confirmar Exclusão</button>
                 </div>
              </motion.div>
          </div>
        )}
      </AnimatePresence>

      <GenerateAICompanyModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
        onSuccess={(newClientId) => {
          setView('list'); // Refresh the list
          if (newClientId && setSelectedClient) {
            setSelectedClient(newClientId);
          }
        }} 
      />
    </div>
  );
}
