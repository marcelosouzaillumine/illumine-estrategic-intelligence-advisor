
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
  Upload
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
  const [activeFormTab, setActiveFormTab] = useState<'dados' | 'estrutura' | 'contato' | 'relatorio_ia'>('dados');
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
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v2/${cleanCnpj}`);
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
        socios: (data.qsa || []).map((s: any) => ({
          nome: s.nome_socio || s.nome,
          participacao: s.percentual_capital || s.participacao || s.percentual || 0
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
        <div className="flex items-center justify-between">
          <div>
            <button 
              onClick={() => setView('list')}
              className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-secondary flex items-center gap-1 mb-2 transition-colors"
            >
              <ChevronLeft size={14} /> Voltar para lista
            </button>
            <h2 className="text-3xl font-display text-primary tracking-tight">
              {editingId ? 'Alterar Cadastro' : 'Novo Cliente'}
            </h2>
            <p className="text-slate-500 text-sm mt-1 font-sans">Preencha as informações detalhadas da empresa e contatos.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setView('list')}
              className="px-6 py-2.5 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              className="px-8 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              {editingId ? 'Salvar Alterações' : 'Confirmar Cadastro'}
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[600px] flex flex-col">
          {/* Tabs Navigation */}
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            {[
              { id: 'dados', label: 'Informações da Empresa', icon: FileText },
              { id: 'estrutura', label: 'Unidades & Filiais', icon: LayoutGrid },
              { id: 'contato', label: 'Pessoas de Contato', icon: Users },
              { id: 'relatorio_ia', label: 'Relatório Estratégico', icon: Sparkles },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFormTab(tab.id as any)}
                className={cn(
                  "flex-1 px-6 py-4 text-xs font-black uppercase tracking-widest flex items-center justify-start gap-3 border-b-2 transition-all",
                  activeFormTab === tab.id 
                    ? "border-secondary text-secondary bg-white" 
                    : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-white/50"
                )}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-10 flex-1">
            {activeFormTab === 'dados' && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Busca por CNPJ</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="00.000.000/0000-00"
                          value={cnpjQuery}
                          onChange={(e) => {
                            setCnpjQuery(e.target.value);
                            validateField('cnpj', e.target.value);
                          }}
                          className={cn(
                            "flex-1 px-4 py-2 bg-slate-50 border rounded-lg text-sm outline-none transition-all",
                            validationErrors.cnpj ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-200 focus:ring-blue-500/20"
                          )}
                        />
                        <button 
                          onClick={fetchCNPJ}
                          disabled={loading}
                          className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-900 transition-colors flex items-center gap-2"
                        >
                          {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                          Carregar
                        </button>
                      </div>
                      {validationErrors.cnpj && <p className="text-[10px] text-rose-500 font-bold mt-1 uppercase tracking-tight">{validationErrors.cnpj}</p>}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Razão Social</label>
                        <input 
                          type="text" 
                          value={formData.razao}
                          onChange={(e) => {
                            setFormData({...formData, razao: e.target.value});
                            validateField('razao', e.target.value);
                          }}
                          className={cn(
                            "w-full px-4 py-2 bg-white border rounded-lg text-sm outline-none transition-all",
                            validationErrors.razao ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-blue-500"
                          )}
                        />
                        {validationErrors.razao && <p className="text-[9px] text-rose-500 font-bold mt-1 uppercase tracking-tight">{validationErrors.razao}</p>}
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Nome Fantasia</label>
                        <input 
                          type="text" 
                          value={formData.fantasia}
                          onChange={(e) => {
                            setFormData({...formData, fantasia: e.target.value});
                            validateField('fantasia', e.target.value);
                          }}
                          className={cn(
                            "w-full px-4 py-2 bg-white border rounded-lg text-sm outline-none transition-all",
                            validationErrors.fantasia ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-blue-500"
                          )}
                        />
                        {validationErrors.fantasia && <p className="text-[9px] text-rose-500 font-bold mt-1 uppercase tracking-tight">{validationErrors.fantasia}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Fundação</label>
                        <input 
                          type="text" 
                          value={formData.dataFundacao}
                          readOnly
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 outline-none"
                        />
                      </div>
                      <div>
                         <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Porte</label>
                         <input 
                          type="text" 
                          value={formData.porte}
                          readOnly
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Endereço Completo</label>
                      <textarea 
                        rows={3}
                        value={formData.endereco}
                        onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                      />
                    </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Website</label>
                          <input 
                            type="text" 
                            placeholder="https://exemplo.com.br"
                            value={formData.website}
                            onChange={(e) => setFormData({...formData, website: e.target.value})}
                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Logo</label>
                              <label className="cursor-pointer text-[9px] font-black text-secondary uppercase hover:underline flex items-center gap-1">
                                <Upload size={10} /> Importar
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logo')} />
                              </label>
                            </div>
                            <div className="flex gap-2">
                              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                {formData.logo ? (
                                  <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" />
                                ) : (
                                  <ImageIcon size={16} className="text-slate-300" />
                                )}
                              </div>
                              <input 
                                type="text" 
                                placeholder="URL da Logomarca"
                                value={formData.logo.startsWith('data:image') ? 'Imagem Importada' : formData.logo}
                                onChange={(e) => setFormData({...formData, logo: e.target.value})}
                                readOnly={formData.logo.startsWith('data:image')}
                                className={cn(
                                  "flex-1 px-3 py-1 bg-white border border-slate-200 rounded-lg text-[11px] outline-none focus:border-blue-500",
                                  formData.logo.startsWith('data:image') && "bg-slate-50 text-slate-400 italic"
                                )}
                              />
                              {formData.logo.startsWith('data:image') && (
                                <button onClick={() => setFormData({...formData, logo: ''})} className="text-rose-500 p-1 hover:bg-rose-50 rounded">
                                  <X size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Ícone</label>
                              <label className="cursor-pointer text-[9px] font-black text-secondary uppercase hover:underline flex items-center gap-1">
                                <Upload size={10} /> Importar
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'icon')} />
                              </label>
                            </div>
                            <div className="flex gap-2">
                              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                {formData.icon ? (
                                  <img src={formData.icon} alt="Icon" className="w-full h-full object-contain" />
                                ) : (
                                  <ImageIcon size={16} className="text-slate-300" />
                                )}
                              </div>
                              <input 
                                type="text" 
                                placeholder="URL do Ícone"
                                value={formData.icon.startsWith('data:image') ? 'Imagem Importada' : formData.icon}
                                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                                readOnly={formData.icon.startsWith('data:image')}
                                className={cn(
                                  "flex-1 px-3 py-1 bg-white border border-slate-200 rounded-lg text-[11px] outline-none focus:border-blue-500",
                                  formData.icon.startsWith('data:image') && "bg-slate-50 text-slate-400 italic"
                                )}
                              />
                              {formData.icon.startsWith('data:image') && (
                                <button onClick={() => setFormData({...formData, icon: ''})} className="text-rose-500 p-1 hover:bg-rose-50 rounded">
                                  <X size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                    <div className="pt-6 border-t border-slate-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sócios e Participação (%)</label>
                        <button 
                          onClick={() => setFormData({...formData, socios: [...formData.socios, { nome: '', participacao: 0 }]})}
                          className="text-[9px] font-black text-secondary uppercase hover:underline flex items-center gap-1"
                        >
                          <Plus size={12} /> Adicionar Sócio
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.socios.map((s, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl relative group/socio">
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400"><Users size={14} /></div>
                            <div className="flex-1 space-y-1">
                              <input 
                                type="text"
                                value={s.nome}
                                onChange={(e) => {
                                  const newSocios = [...formData.socios];
                                  newSocios[idx].nome = e.target.value;
                                  setFormData({...formData, socios: newSocios});
                                }}
                                placeholder="Nome do Sócio"
                                className="w-full bg-transparent text-[11px] font-black text-slate-800 outline-none border-b border-transparent focus:border-slate-200"
                              />
                              <div className="flex items-center gap-2">
                                <input 
                                  type="number"
                                  value={s.participacao}
                                  onChange={(e) => {
                                    const newSocios = [...formData.socios];
                                    newSocios[idx].participacao = parseFloat(e.target.value) || 0;
                                    setFormData({...formData, socios: newSocios});
                                  }}
                                  placeholder="%"
                                  className="w-12 bg-transparent text-[10px] font-bold text-secondary outline-none"
                                />
                                <span className="text-[10px] text-slate-400 font-bold">% de participação</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => setFormData({...formData, socios: formData.socios.filter((_, i) => i !== idx)})}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-200 text-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover/socio:opacity-100 transition-opacity shadow-sm"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Mídias Sociais</label>
                      {formData.socialMedia.map((sm, idx) => (
                        <div key={idx} className="flex gap-2">
                          <select 
                            value={sm.platform}
                            onChange={(e) => {
                              const newSM = [...formData.socialMedia];
                              newSM[idx].platform = e.target.value;
                              setFormData({...formData, socialMedia: newSM});
                            }}
                            className="w-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                          >
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Twitter">Twitter/X</option>
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
                            className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                          />
                          <button 
                            onClick={() => {
                              const newSM = formData.socialMedia.filter((_, i) => i !== idx);
                              setFormData({...formData, socialMedia: newSM});
                            }}
                            className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => setFormData({...formData, socialMedia: [...formData.socialMedia, { platform: 'LinkedIn', url: '' }]})}
                        className="text-[10px] font-black text-secondary uppercase tracking-widest flex items-center gap-1 hover:underline"
                      >
                        <Plus size={12} /> Adicionar Rede Social
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeFormTab === 'estrutura' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Activity size={14} className="text-secondary" /> Unidades de Negócio
                        </h4>
                        <div className="flex gap-2 mb-4">
                          <input 
                            type="text" 
                            placeholder="Ex: Medicina Laboratorial"
                            value={tempUnit}
                            onChange={(e) => setTempUnit(e.target.value)}
                            className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-secondary/20"
                          />
                          <button 
                            onClick={() => {
                              if (tempUnit) {
                                setFormData({...formData, unidadesNegocio: [...formData.unidadesNegocio, tempUnit]});
                                setTempUnit('');
                              }
                            }}
                            className="p-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-all shadow-sm"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.unidadesNegocio.map((u, i) => (
                            <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-600 flex items-center gap-2">
                              {u}
                              <button onClick={() => setFormData({...formData, unidadesNegocio: formData.unidadesNegocio.filter((_, idx) => idx !== i)})} className="text-rose-400 hover:text-rose-600">
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Building2 size={14} className="text-primary" /> Filiais Disponíveis
                        </h4>
                        <div className="space-y-3">
                          <input 
                            type="text" placeholder="Nome da Filial"
                            value={tempBranch.nome}
                            onChange={(e) => setTempBranch({...tempBranch, nome: e.target.value})}
                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none"
                          />
                          <div className="flex gap-2">
                            <input 
                              type="text" placeholder="Cidade/UF"
                              value={tempBranch.cidade}
                              onChange={(e) => setTempBranch({...tempBranch, cidade: e.target.value})}
                              className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none"
                            />
                            <button 
                              onClick={() => {
                                if (tempBranch.nome) {
                                  setFormData({...formData, filiais: [...formData.filiais, tempBranch]});
                                  setTempBranch({ nome: '', cidade: '', cnpj: '' });
                                }
                              }}
                              className="px-4 bg-primary text-white rounded-lg text-xs font-bold"
                            >Adicionar</button>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          {formData.filiais.map((f, i) => (
                            <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400"><MapPin size={14} /></div>
                                <div>
                                  <p className="text-xs font-black text-slate-900">{f.nome}</p>
                                  <p className="text-[10px] text-slate-500">{f.cidade}</p>
                                </div>
                              </div>
                              <button onClick={() => setFormData({...formData, filiais: formData.filiais.filter((_, idx) => idx !== i)})} className="text-rose-400 p-1"><Trash2 size={14} /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
            {activeFormTab === 'fiscal' && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
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
                          onClick={() => setFormData({...formData, regime})}
                          className={cn(
                            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            formData.regime === regime 
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
                    {/* Regime-specific sub-options */}
                    {formData.regime === 'Lucro Real' && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Método de Apuração (LR)</label>
                        <select 
                          value={formData.regimeReal}
                          onChange={(e) => setFormData({...formData, regimeReal: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-secondary/10 transition-all"
                        >
                          <option value="Cumulativo">Cumulativo (654/98)</option>
                          <option value="Não Cumulativo">Não Cumulativo (10.637/10.833)</option>
                          <option value="Híbrido">Híbrido (Misto)</option>
                        </select>
                      </div>
                    )}

                    {formData.regime === 'Lucro Presumido' && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Cálculo Padrão IRPJ/CSLL</label>
                        <select 
                          value={formData.cnaePresuncao}
                          onChange={(e) => setFormData({...formData, cnaePresuncao: e.target.value})}
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
                        value={formData.porte}
                        readOnly
                        className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-sm font-bold text-slate-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Main Tax Activity Section (Nested Grid) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                  
                  {/* Left Column: Revenue History (Simples only) or Detail Parameters */}
                  <div className="space-y-10">
                    {formData.regime === 'Simples Nacional' ? (
                      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-secondary/60"></div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                              <History size={16} className="text-secondary" /> Histórico RBT12
                            </h5>
                          </div>
                          <label className="cursor-pointer px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
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
                                {(formData.historicoFaturamento || Array(12).fill({ mes: '', ano: '', valor: 0 })).map((item, idx) => (
                                  <tr key={idx} className="hover:bg-white transition-colors group">
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-2">
                                        <select 
                                          value={item.mes}
                                          onChange={(e) => {
                                            const newHist = [...formData.historicoFaturamento];
                                            newHist[idx] = { ...newHist[idx], mes: e.target.value };
                                            setFormData({ ...formData, historicoFaturamento: newHist });
                                          }}
                                          className="bg-transparent text-[11px] font-black text-slate-700 uppercase outline-none cursor-pointer focus:text-secondary"
                                        >
                                          <option value="">Mês</option>
                                          {['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'].map(m => (
                                            <option key={m} value={m}>{m}</option>
                                          ))}
                                        </select>
                                        <span className="text-slate-300">/</span>
                                        <select 
                                          value={item.ano}
                                          onChange={(e) => {
                                            const newHist = [...formData.historicoFaturamento];
                                            newHist[idx] = { ...newHist[idx], ano: e.target.value };
                                            setFormData({ ...formData, historicoFaturamento: newHist });
                                          }}
                                          className="bg-transparent text-[11px] font-black text-slate-700 uppercase outline-none cursor-pointer focus:text-secondary"
                                        >
                                          <option value="">An</option>
                                          {['24', '23', '25', '26'].sort().map(y => (
                                            <option key={y} value={`20${y}`}>20{y}</option>
                                          ))}
                                        </select>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center justify-end gap-2 group">
                                        <span className="text-[10px] font-black text-slate-300 group-focus-within:text-secondary">R$</span>
                                        <input 
                                          type="number"
                                          value={item.valor}
                                          onChange={(e) => {
                                            const newHist = [...formData.historicoFaturamento];
                                            newHist[idx] = { ...newHist[idx], valor: parseFloat(e.target.value) || 0 };
                                            const newRbt12 = newHist.reduce((acc, curr) => acc + (curr.valor || 0), 0);
                                            setFormData({ ...formData, historicoFaturamento: newHist, rbt12: newRbt12 });
                                          }}
                                          className="w-32 bg-transparent text-xs font-black text-slate-800 text-right outline-none border-b border-transparent hover:border-slate-200 focus:border-secondary transition-all py-1"
                                          placeholder="0,00"
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="bg-slate-900 p-6 rounded-2xl relative overflow-hidden group space-y-4">
                           <div className="relative z-10 space-y-4 pb-4 border-b border-white/5">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block opacity-70">Faturamento do Mês Atual</label>
                              <div className="relative">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-emerald-400/50 font-black text-[10px]">R$</div>
                                <input 
                                  type="number"
                                  value={formData.faturamentoMensal}
                                  onChange={(e) => setFormData({...formData, faturamentoMensal: parseFloat(e.target.value) || 0})}
                                  className="w-full bg-transparent pl-6 pr-2 py-1 text-xl font-black text-white outline-none border-b border-white/10 focus:border-emerald-400 transition-all"
                                  placeholder="0,00"
                                />
                              </div>
                           </div>

                           <div className="relative z-10 flex items-center justify-between">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block opacity-70">Total RBT12 (Acumulado)</label>
                              <div className="text-2xl font-black text-emerald-400 font-display tracking-tight">
                                {formatCurrency(formData.rbt12 || 0)}
                              </div>
                           </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
                        <div className="space-y-4">
                           <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                              <TrendingUp size={16} className="text-primary" /> Faturamento Base
                           </h5>
                           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center space-y-3">
                              <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest block px-1">
                                Receita do Mês de Referência
                              </label>
                              <div className="relative">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-3 text-slate-400 border-r border-slate-100 pr-4">
                                  <DollarSign size={20} />
                                  <span className="text-[10px] font-black uppercase tracking-widest">BRL</span>
                                </div>
                                <input 
                                  type="number"
                                  value={formData.faturamentoMensal}
                                  onChange={(e) => setFormData({...formData, faturamentoMensal: parseFloat(e.target.value) || 0})}
                                  className="w-full pl-24 pr-8 py-5 bg-white border border-slate-200 rounded-2xl text-2xl font-black text-slate-900 outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary/20 transition-all shadow-sm"
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
                                  <Plus size={12} /> Adicionar
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
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
                <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10">
                  <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
                    <ShieldCheck size={18} /> Contato Principal (Decisor)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Nome Completo</label>
                      <input 
                        type="text" 
                        value={formData.contato.nome}
                        onChange={(e) => {
                          setFormData({...formData, contato: {...formData.contato, nome: e.target.value}});
                          validateField('contatoNome', e.target.value);
                        }}
                        className={cn(
                          "w-full px-4 py-2 bg-white border rounded-lg text-sm font-bold outline-none transition-all",
                          validationErrors.contatoNome ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-primary"
                        )}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Cargo / Função</label>
                      <input 
                        type="text" 
                        value={formData.contato.funcao}
                        onChange={(e) => setFormData({...formData, contato: {...formData.contato, funcao: e.target.value}})}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-primary"
                      />
                    </div>
                     <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">E-mail Corporativo</label>
                      <input 
                        type="email" 
                        value={formData.contato.email}
                        onChange={(e) => {
                          setFormData({...formData, contato: {...formData.contato, email: e.target.value}});
                          validateField('email', e.target.value);
                        }}
                        className={cn(
                          "w-full px-4 py-2 bg-white border rounded-lg text-sm font-bold outline-none transition-all",
                          validationErrors.email ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-primary"
                        )}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Telefone / WhatsApp</label>
                      <input 
                        type="tel" 
                        value={formData.contato.telefone}
                        onChange={(e) => setFormData({...formData, contato: {...formData.contato, telefone: e.target.value}})}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 border-dashed">
                   <div className="flex items-center justify-between mb-6">
                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Contatos Adicionais</h4>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <input 
                            type="text" placeholder="Nome" 
                            value={tempContact.nome}
                            onChange={(e) => setTempContact({...tempContact, nome: e.target.value})}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold outline-none"
                          />
                          <input 
                            type="text" placeholder="Cargo" 
                            value={tempContact.cargo}
                            onChange={(e) => setTempContact({...tempContact, cargo: e.target.value})}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input 
                            type="email" placeholder="E-mail" 
                            value={tempContact.email}
                            onChange={(e) => setTempContact({...tempContact, email: e.target.value})}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold outline-none"
                          />
                          <div className="flex gap-2">
                            <input 
                              type="tel" placeholder="Telefone" 
                              value={tempContact.tel}
                              onChange={(e) => setTempContact({...tempContact, tel: e.target.value})}
                              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold outline-none"
                            />
                            <button 
                              onClick={() => {
                                if (tempContact.nome) {
                                  setFormData({...formData, contatosAdicionais: [...formData.contatosAdicionais, tempContact]});
                                  setTempContact({ nome: '', email: '', tel: '', cargo: '' });
                                }
                              }}
                              className="p-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 shadow-sm"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                     </div>

                     <div className="space-y-2">
                        {formData.contatosAdicionais.map((c, i) => (
                          <div key={i} className="flex items-center justify-between bg-slate-50/50 p-3 rounded-xl border border-slate-100 group/item">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400"><Users size={14} /></div>
                              <div>
                                <p className="text-[11px] font-black text-slate-800">{c.nome} <span className="text-slate-400 font-bold ml-1">({c.cargo})</span></p>
                                <p className="text-[9px] text-slate-400">{c.email} | {c.tel}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => setFormData({...formData, contatosAdicionais: formData.contatosAdicionais.filter((_, idx) => idx !== i)})}
                              className="p-1.5 text-rose-400 opacity-0 group-hover/item:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                     </div>
                   </div>
                </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-8">
                      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                          <AlertCircle size={14} className="text-rose-500" /> Principais Desafios
                        </h4>
                        <ul className="space-y-3">
                          {((formData as any).aiAnalysis.challenges || []).map((c: string, i: number) => (
                            <li key={i} className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                          <TrendingUp size={14} className="text-emerald-500" /> Oportunidades & Crescimento
                        </h4>
                        <ul className="space-y-3">
                          {((formData as any).aiAnalysis.growthSuggestions || []).map((c: string, i: number) => (
                            <li key={i} className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-sm space-y-4">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                          Estrutura de Governança
                        </h4>
                        <p className="text-xs font-medium leading-relaxed opacity-90 text-slate-300">
                          {((formData as any).aiAnalysis.governance || 'N/A')}
                        </p>
                      </div>

                      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                          Fluxo Operacional
                        </h4>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          {((formData as any).aiAnalysis.operationalFlow || 'N/A')}
                        </p>
                      </div>

                      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                          <LayoutGrid size={14} className="text-blue-500" /> Ideias de Dashboards
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {((formData as any).aiAnalysis.dashboardIdeas || []).map((c: string, i: number) => (
                            <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black rounded-lg border border-blue-100">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 p-12 rounded-[32px] text-center space-y-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-300 mx-auto shadow-sm">
                        <Sparkles size={32} />
                    </div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Sem Análise Gerencial</h4>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest max-w-[250px] mx-auto">Este cliente não foi gerado via inteligência artificial ou não possui relatório estratégico associado.</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <PageHeader 
            title="Carteira de Clientes" 
            description="Gestão centralizada de empresas, filiais e unidades de negócio sob consultoria."
          />
        </div>
        <div className="flex items-center gap-4">
           <div className="flex bg-slate-100 p-1 rounded-xl">
             <button onClick={() => setFilters({...filters, status: ''})} className={cn("px-4 py-2 text-xs font-bold rounded-lg transition-all", !filters.status ? "bg-white text-primary shadow-sm" : "text-slate-500")}>Todos</button>
             <button onClick={() => setFilters({...filters, status: 'Ativo'})} className={cn("px-4 py-2 text-xs font-bold rounded-lg transition-all", filters.status === 'Ativo' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500")}>Ativos</button>
             <button onClick={() => setFilters({...filters, status: 'Suspenso'})} className={cn("px-4 py-2 text-xs font-bold rounded-lg transition-all", filters.status === 'Suspenso' ? "bg-white text-rose-600 shadow-sm" : "text-slate-500")}>Suspensos</button>
           </div>
           
           <button 
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all shadow-lg active:scale-95 whitespace-nowrap"
          >
            <Sparkles size={16} />
            GERAR EMPRESA MODELO
          </button>

           <button 
            onClick={openAdd}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary/90 transition-all shadow-lg active:scale-95 whitespace-nowrap"
          >
            <Plus size={16} /> NOVO CLIENTE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <div className="relative mb-6">
                <input 
                  type="text" 
                  placeholder="Pesquisar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                />
                <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
             </div>

             <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Segmento</label>
                  <select 
                    value={filters.segmento || 'Todos'}
                    onChange={(e) => setFilters({...filters, segmento: e.target.value === 'Todos' ? '' : e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-600 outline-none"
                  >
                    {uniqueSegments.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
               </div>
               
               <div className="pt-4 border-t border-slate-100">
                  <div className="bg-primary/5 p-4 rounded-xl">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Total na Carteira</p>
                    <p className="text-3xl font-display text-primary">{clients.length}</p>
                  </div>
               </div>
             </div>
           </div>
           
           <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 opacity-60">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Integridade de Dados</h4>
             <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Os cadastros aqui vinculados alimentam automaticamente as páginas de DRE, Fluxo de Caixa e Viabilidade.</p>
           </div>
        </div>

        <div className="md:col-span-3 space-y-6">
           {paginatedClients.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 flex flex-col items-center text-center">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4"><Filter size={32} /></div>
                 <h3 className="text-lg font-bold text-slate-900 mb-1">Nenhum cliente encontrado</h3>
                 <p className="text-sm text-slate-500 font-sans">Ajuste os filtros ou o termo de busca.</p>
              </div>
           ) : (
             <div className="space-y-4">
                {paginatedClients.map((client: any) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={client.id} 
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group relative overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="flex items-start gap-5">
                          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary border border-slate-100 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all shrink-0 overflow-hidden">
                             {client.icon || client.logo ? (
                               <img src={client.icon || client.logo} alt={client.fantasia} className="w-full h-full object-contain p-2" />
                             ) : (
                               <Building2 size={24} />
                             )}
                          </div>
                          <div>
                             <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-primary transition-colors">{client.fantasia}</h3>
                                <StatusBadge status={client.status} />
                             </div>
                             <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">{client.segmento}</span>
                                {client.website && (
                                  <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-secondary hover:underline flex items-center gap-1">
                                     <Link2 size={10} /> {client.website.replace(/^https?:\/\//, '')}
                                  </a>
                                )}
                                <span className="text-xs flex items-center gap-1"><MapPin size={12} className="text-slate-300" /> {client.cidade}</span>
                                <span className="text-xs font-mono">{client.cnpj}</span>
                             </div>
                             {client.unidadesNegocio?.length > 0 && (
                               <div className="mt-3 flex flex-wrap gap-2">
                                 {client.unidadesNegocio.map((u: string, idx: number) => (
                                   <span key={idx} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                                     {u}
                                   </span>
                                 ))}
                                 {client.filiais?.length > 0 && (
                                   <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-[9px] font-black text-blue-600 uppercase tracking-tighter">
                                     +{client.filiais.length} Filia{client.filiais.length > 1 ? 'is' : 'l'}
                                   </span>
                                 )}
                               </div>
                             )}
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openEdit(client)}
                            className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                            title="Editar Cadastro"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => setClientToDelete({ id: client.id, name: client.fantasia })}
                            className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                            title="Remover Cliente"
                          >
                            <Trash2 size={18} />
                          </button>
                          <div className="h-8 w-px bg-slate-100 mx-2" />
                          <button className="flex items-center gap-2 pl-4 pr-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all active:scale-95">
                             Dashboard <ChevronRight size={14} />
                          </button>
                       </div>
                    </div>
                  </motion.div>
                ))}
             </div>
           )}

           {totalPages > 1 && (
             <div className="flex items-center justify-between pt-6 border-t border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Página {currentPage} de {totalPages}</p>
               <div className="flex gap-2">
                 <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:border-primary disabled:opacity-30 transition-all shadow-sm"
                 >
                   <ChevronLeft size={20} />
                 </button>
                 <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:border-primary disabled:opacity-30 transition-all shadow-sm"
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
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
             <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
             >
                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Trash2 size={36} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Excluir Cliente?</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  Você está prestes a remover <strong>{clientToDelete.name}</strong> da sua carteira. Todos os dados financeiros vinculados deixarão de ser exibidos.
                </p>
                <div className="grid grid-cols-2 gap-4">
                   <button 
                    onClick={() => setClientToDelete(null)}
                    className="py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase"
                   >Cancelar</button>
                   <button 
                    onClick={handleDelete}
                    className="py-3 bg-rose-500 text-white rounded-xl font-black text-xs uppercase shadow-lg shadow-rose-200"
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
