
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  Building2, 
  MapPin, 
  Users, 
  Activity,
  LayoutGrid,
  X,
  ShieldCheck,
  Briefcase,
  DollarSign,
  Landmark,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Save,
  Calendar,
  Globe,
  Key,
  History,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { PageHeader, StatusBadge } from '../Common';
import { cn, formatCurrency, validateCNPJ, validateCPF, formatDoc } from '../../lib/utils';
import { useDataTable } from '../../hooks/useDataTable';
import { ClientImportHistory } from '../ClientImportHistory';
import { ClientAccessLogs } from '../ClientAccessLogs';
import { ClientLoginAudit } from '../ClientLoginAudit';
import { ClientUserManager } from '../ClientUserManager';

export function PartnersPage({ clients, setClients, setSelectedClient, isMaster }: any) {
  const [partners, setPartners] = useState<any[]>([]);
  const [view, setView] = useState<'list' | 'form' | 'dashboard'>('list');
  const [loading, setLoading] = useState(false);
  const [docType, setDocType] = useState<'CNPJ' | 'CPF'>('CNPJ');
  const [docQuery, setDocQuery] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [partnerToDelete, setPartnerToDelete] = useState<{ id: string, name: string } | null>(null);
  const [linkedClientIds, setLinkedClientIds] = useState<string[]>([]);
  const [selectedPartnerForDashboard, setSelectedPartnerForDashboard] = useState<any>(null);
  
  const partnerTemplate = {
    razao: '',
    fantasia: '',
    cnpj: '',
    segmento: 'Serviços',
    cidade: '',
    endereco: '',
    status: 'Ativo',
    linkedClientIds: [] as string[],
    contato: {
      nome: '',
      funcao: '',
      telefone: '',
      email: ''
    },
    socios: [] as { nome: string; participacao: number }[],
    unidadesNegocio: [] as string[],
    contatosAdicionais: [] as { nome: string; email: string; tel: string; cargo: string }[],
    website: '',
    logo: '',
    icon: ''
  };

  const fetchCPF = async () => {
    const cleanCpf = docQuery.replace(/\D/g, '');
    if (!validateCPF(cleanCpf)) {
      setError('CPF inválido. Verifique os números digitados.');
      return;
    }

    setLoading(true);
    setError('');
    
    // Opção 3: Busca Interna
    const existingPartner = partners.find(p => p.cnpj.replace(/\D/g, '') === cleanCpf);
    
    if (existingPartner) {
      setFormData({
        ...partnerTemplate,
        ...existingPartner
      });
      setError('Este parceiro já possui cadastro no sistema. Dados carregados.');
      setLoading(false);
    } else {
      // Opção 2: Campos abertos se for novo
      setFormData(prev => ({
        ...prev,
        razao: '',
        fantasia: '',
        cnpj: cleanCpf,
        cidade: '',
        endereco: '',
        segmento: 'Profissional Liberal'
      }));
      setLoading(false);
    }
  };

  const handleFetch = () => {
    if (docType === 'CNPJ') fetchCNPJ();
    else fetchCPF();
  };

  const fetchCNPJ = async () => {
    const cleanCnpj = docQuery.replace(/\D/g, '');
    if (!validateCNPJ(cleanCnpj)) {
      setError('CNPJ inválido. Verifique os dígitos verificadores.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
      if (!response.ok) throw new Error('Empresa não encontrada');
      
      const data = await response.json();
      
      setFormData(prev => ({
        ...prev,
        razao: data.razao_social || '',
        fantasia: data.nome_fantasia || data.razao_social || '',
        cnpj: cleanCnpj,
        cidade: `${data.municipio}/${data.uf}`,
        endereco: `${data.logradouro}, ${data.numero}${data.complemento ? ` - ${data.complemento}` : ''} - ${data.bairro} - CEP: ${data.cep}`,
        segmento: data.cnae_fiscal_descricao || 'Serviços'
      }));
    } catch (err) {
      setError('Erro ao buscar CNPJ. Verifique se o número está correto.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState(partnerTemplate);
  const [activeFormTab, setActiveFormTab] = useState<'dados' | 'clientes' | 'estrutura' | 'contato' | 'usuarios' | 'importacao' | 'acessos' | 'auditoria'>('dados');
  const [tempContact, setTempContact] = useState({ nome: '', email: '', tel: '', cargo: '' });
  const [tempUnit, setTempUnit] = useState('');

  // Fetch partners
  useEffect(() => {
    const q = query(collection(db, 'partners'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPartners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData(partnerTemplate);
    setDocQuery('');
    setError('');
    setView('form');
    setActiveFormTab('dados');
    setLinkedClientIds([]);
  };

  const openEdit = (partner: any) => {
    setEditingId(partner.id);
    setFormData({ ...partnerTemplate, ...partner });
    setDocQuery(partner.cnpj);
    setError('');
    setView('form');
    setActiveFormTab('dados');
    setLinkedClientIds(partner.linkedClientIds || []);
  };

  const openDashboard = (partner: any) => {
    setSelectedPartnerForDashboard(partner);
    setView('dashboard');
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const partnerData = {
        ...formData,
        linkedClientIds,
        ownerId: auth.currentUser.uid,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, 'partners', editingId), partnerData);
      } else {
        await addDoc(collection(db, 'partners'), {
          ...partnerData,
          createdAt: serverTimestamp()
        });
      }
      setView('list');
    } catch (error) {
      console.error("Error saving partner:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!partnerToDelete) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'partners', partnerToDelete.id));
      setPartnerToDelete(null);
    } catch (error) {
      console.error("Error deleting partner:", error);
    } finally {
      setLoading(false);
    }
  };

  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredData: filteredPartners,
    paginatedData: paginatedPartners
  } = useDataTable(partners, {
    searchFields: ['razao', 'fantasia', 'cnpj', 'cidade'],
    initialSort: { key: 'fantasia', direction: 'asc' },
    itemsPerPage: 6
  });

  if (view === 'form') {
    return (
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <button onClick={() => setView('list')} className="flex items-center gap-2 text-[10px] font-black text-text-dim uppercase tracking-[0.2em] mb-4">
              <ChevronLeft size={12} /> Voltar para lista
            </button>
            <h2 className="text-4xl font-display font-black text-text-main tracking-tight">
              {editingId ? 'Alterar Cadastro' : 'Cadastro de Parceiro Estratégico'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setView('list')} className="btn-ghost">Cancelar</button>
            <button onClick={handleSave} className="btn-accent px-10">
              <Save size={16} /> {editingId ? 'Salvar' : 'Cadastrar'}
            </button>
          </div>
        </div>

        <div className="card-premium p-0 overflow-hidden">
          <div className="flex bg-bg-surface border-b border-border-main p-2 gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'dados', label: 'Parceiro', icon: Building2 },
              { id: 'clientes', label: 'Clientes Vinculados', icon: Users },
              { id: 'estrutura', label: 'Estrutura', icon: LayoutGrid },
              { id: 'contato', label: 'Contatos', icon: Users },
              { id: 'usuarios', label: 'Usuários', icon: Key },
              { id: 'importacao', label: 'Importações', icon: History },
              { id: 'acessos', label: 'Acessos', icon: ShieldCheck },
              { id: 'auditoria', label: 'Auditoria', icon: Activity },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFormTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap",
                  activeFormTab === tab.id 
                    ? "bg-secondary text-white shadow-lg" 
                    : "text-text-dim hover:bg-bg-card"
                )}
              >
                {(() => {
                  const Icon = tab.icon;
                  return <Icon size={14} />;
                })()}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-12">
            {activeFormTab === 'dados' && (
              <div className="space-y-12">
                {!editingId && (
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Busca Automática</h4>
                      <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                        {(['CNPJ', 'CPF'] as const).map(type => (
                          <button
                            key={type}
                            onClick={() => {
                              setDocType(type);
                              setDocQuery('');
                              setError('');
                            }}
                            className={cn(
                              "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                              docType === type ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        placeholder={docType === 'CNPJ' ? "00.000.000/0000-00" : "000.000.000-00"} 
                        value={docQuery}
                        onChange={(e) => setDocQuery(formatDoc(e.target.value))}
                        className="flex-1 px-6 py-4 bg-white border border-border-main rounded-2xl text-sm font-bold outline-none focus:border-secondary" 
                      />
                      <button 
                        onClick={handleFetch}
                        disabled={loading}
                        className="btn-accent px-8"
                      >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : 'Buscar'}
                      </button>
                    </div>
                    {error && <p className="text-rose-500 text-xs font-bold mt-3">{error}</p>}
                    {docType === 'CPF' && !loading && !formData.razao && (
                      <p className="text-[9px] text-slate-400 mt-4 italic font-medium">Nota: A busca por CPF utiliza simulação de perfil para demonstração, devido a restrições de privacidade em APIs públicas.</p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-label">{docType === 'CNPJ' ? 'Razão Social' : 'Nome Completo'}</label>
                    <input 
                      type="text" 
                      value={formData.razao} 
                      onChange={(e) => setFormData({...formData, razao: e.target.value})} 
                      readOnly={!!formData.razao && !editingId}
                      className={cn(
                        "w-full px-6 py-4 bg-bg-surface border border-border-main rounded-2xl text-sm font-bold",
                        formData.razao && !editingId ? "opacity-70 bg-slate-50" : ""
                      )} 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-label">Nome Fantasia / Apelido</label>
                    <input 
                      type="text" 
                      value={formData.fantasia} 
                      onChange={(e) => setFormData({...formData, fantasia: e.target.value})} 
                      className="w-full px-6 py-4 bg-bg-surface border border-border-main rounded-2xl text-sm font-bold" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-label">{docType === 'CNPJ' ? 'CNPJ' : 'CPF'}</label>
                    <input 
                      type="text" 
                      value={formatDoc(formData.cnpj)} 
                      onChange={(e) => setFormData({...formData, cnpj: e.target.value.replace(/\D/g, '')})} 
                      readOnly={!!formData.cnpj && !editingId}
                      className={cn(
                        "w-full px-6 py-4 bg-bg-surface border border-border-main rounded-2xl text-sm font-bold",
                        formData.cnpj && !editingId ? "opacity-70 bg-slate-50" : ""
                      )} 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-label">Segmento</label>
                    <input 
                      type="text" 
                      value={formData.segmento} 
                      onChange={(e) => setFormData({...formData, segmento: e.target.value})} 
                      readOnly={!!formData.segmento && !editingId}
                      className={cn(
                        "w-full px-6 py-4 bg-bg-surface border border-border-main rounded-2xl text-sm font-bold",
                        formData.segmento && !editingId ? "opacity-70 bg-slate-50" : ""
                      )} 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-label">Cidade/UF</label>
                    <input 
                      type="text" 
                      value={formData.cidade} 
                      onChange={(e) => setFormData({...formData, cidade: e.target.value})} 
                      className="w-full px-6 py-4 bg-bg-surface border border-border-main rounded-2xl text-sm font-bold" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-label">Endereço Completo</label>
                    <input 
                      type="text" 
                      value={formData.endereco} 
                      onChange={(e) => setFormData({...formData, endereco: e.target.value})} 
                      className="w-full px-6 py-4 bg-bg-surface border border-border-main rounded-2xl text-sm font-bold" 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeFormTab === 'estrutura' && (
              <div className="space-y-12">
                <div className="card-premium bg-bg-surface border-border-soft">
                  <h3 className="text-sm font-black text-text-main uppercase tracking-widest mb-8">Quadro Societário</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <input 
                        type="text" placeholder="Nome do Sócio" 
                        id="socio-nome"
                        className="flex-1 px-5 py-3 bg-white border border-border-main rounded-xl text-sm font-bold" 
                      />
                      <input 
                        type="number" placeholder="%" 
                        id="socio-part"
                        className="w-24 px-5 py-3 bg-white border border-border-main rounded-xl text-sm font-bold" 
                      />
                      <button 
                        onClick={() => {
                          const nome = (document.getElementById('socio-nome') as HTMLInputElement).value;
                          const part = parseFloat((document.getElementById('socio-part') as HTMLInputElement).value);
                          if (nome && !isNaN(part)) {
                            setFormData({...formData, socios: [...formData.socios, { nome, participacao: part }]});
                            (document.getElementById('socio-nome') as HTMLInputElement).value = '';
                            (document.getElementById('socio-part') as HTMLInputElement).value = '';
                          }
                        }}
                        className="btn-accent px-6"
                      >Adicionar</button>
                    </div>
                    <div className="space-y-3">
                      {formData.socios.map((s, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-bg-card rounded-xl border border-border-soft">
                          <span className="text-sm font-bold text-text-main">{s.nome}</span>
                          <div className="flex items-center gap-6">
                            <span className="text-xs font-black text-secondary">{s.participacao}%</span>
                            <button onClick={() => setFormData({...formData, socios: formData.socios.filter((_, idx) => idx !== i)})} className="text-rose-400 hover:text-rose-600"><X size={16} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card-premium bg-bg-surface border-border-soft">
                  <h3 className="text-sm font-black text-text-main uppercase tracking-widest mb-8">Unidades de Negócio / Filiais</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        placeholder="Nome da Unidade" 
                        value={tempUnit}
                        onChange={(e) => setTempUnit(e.target.value)}
                        className="flex-1 px-5 py-3 bg-white border border-border-main rounded-xl text-sm font-bold" 
                      />
                      <button 
                        onClick={() => {
                          if (tempUnit) {
                            setFormData({...formData, unidadesNegocio: [...formData.unidadesNegocio, tempUnit]});
                            setTempUnit('');
                          }
                        }}
                        className="btn-accent px-6"
                      >Adicionar</button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {formData.unidadesNegocio.map((u, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-2 bg-secondary/5 border border-secondary/20 rounded-lg">
                          <span className="text-[10px] font-black text-secondary uppercase tracking-widest">{u}</span>
                          <button onClick={() => setFormData({...formData, unidadesNegocio: formData.unidadesNegocio.filter((_, idx) => idx !== i)})} className="text-secondary hover:text-rose-500"><X size={12} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeFormTab === 'contato' && (
              <div className="space-y-12">
                 <div className="card-premium bg-bg-surface border-border-soft">
                  <h3 className="text-sm font-black text-text-main uppercase tracking-widest mb-8">Contato Principal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-label">Nome Completo</label>
                      <input type="text" value={formData.contato.nome} onChange={(e) => setFormData({...formData, contato: {...formData.contato, nome: e.target.value}})} className="w-full px-5 py-3 bg-white border border-border-main rounded-xl text-sm font-bold" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-label">Cargo / Função</label>
                      <input type="text" value={formData.contato.funcao} onChange={(e) => setFormData({...formData, contato: {...formData.contato, funcao: e.target.value}})} className="w-full px-5 py-3 bg-white border border-border-main rounded-xl text-sm font-bold" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-label">E-mail</label>
                      <input type="email" value={formData.contato.email} onChange={(e) => setFormData({...formData, contato: {...formData.contato, email: e.target.value}})} className="w-full px-5 py-3 bg-white border border-border-main rounded-xl text-sm font-bold" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-label">Telefone</label>
                      <input type="tel" value={formData.contato.telefone} onChange={(e) => setFormData({...formData, contato: {...formData.contato, telefone: e.target.value}})} className="w-full px-5 py-3 bg-white border border-border-main rounded-xl text-sm font-bold" />
                    </div>
                  </div>
                </div>

                <div className="card-premium bg-bg-surface border-border-soft">
                  <h4 className="text-sm font-black text-text-main uppercase tracking-widest mb-8">Contatos Adicionais</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Nome" value={tempContact.nome} onChange={(e) => setTempContact({...tempContact, nome: e.target.value})} className="px-4 py-2.5 bg-white border border-border-main rounded-xl text-xs font-bold" />
                        <input type="text" placeholder="Cargo" value={tempContact.cargo} onChange={(e) => setTempContact({...tempContact, cargo: e.target.value})} className="px-4 py-2.5 bg-white border border-border-main rounded-xl text-xs font-bold" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="email" placeholder="E-mail" value={tempContact.email} onChange={(e) => setTempContact({...tempContact, email: e.target.value})} className="px-4 py-2.5 bg-white border border-border-main rounded-xl text-xs font-bold" />
                        <div className="flex gap-2">
                          <input type="tel" placeholder="Telefone" value={tempContact.tel} onChange={(e) => setTempContact({...tempContact, tel: e.target.value})} className="flex-1 px-4 py-2.5 bg-white border border-border-main rounded-xl text-xs font-bold" />
                          <button onClick={() => {
                            if (tempContact.nome) {
                              setFormData({...formData, contatosAdicionais: [...formData.contatosAdicionais, tempContact]});
                              setTempContact({ nome: '', email: '', tel: '', cargo: '' });
                            }
                          }} className="btn-accent p-2"><Plus size={18} /></button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {formData.contatosAdicionais.map((c, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-bg-card rounded-xl border border-border-soft">
                          <div>
                            <p className="text-xs font-black text-text-main">{c.nome} <span className="text-[10px] text-text-dim uppercase tracking-widest ml-2">({c.cargo})</span></p>
                            <p className="text-[10px] text-text-muted">{c.email} • {c.tel}</p>
                          </div>
                          <button onClick={() => setFormData({...formData, contatosAdicionais: formData.contatosAdicionais.filter((_, idx) => idx !== i)})} className="text-rose-400 hover:text-rose-600"><X size={16} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeFormTab === 'usuarios' && editingId && (
              <div className="bg-white rounded-3xl p-8 border border-border-soft">
                <ClientUserManager clientId={editingId} />
              </div>
            )}

            {activeFormTab === 'importacao' && editingId && (
              <div className="bg-white rounded-3xl p-8 border border-border-soft">
                <ClientImportHistory clientId={editingId} clientName={formData.fantasia || formData.razao} />
              </div>
            )}

            {activeFormTab === 'acessos' && editingId && (
              <div className="bg-white rounded-3xl p-8 border border-border-soft">
                <ClientAccessLogs clientId={editingId} />
              </div>
            )}

            {activeFormTab === 'auditoria' && editingId && (
              <div className="bg-white rounded-3xl p-8 border border-border-soft">
                <ClientLoginAudit clientId={editingId} />
              </div>
            )}

            {activeFormTab === 'clientes' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-2 no-scrollbar">
                  {clients.map((client: any) => (
                    <label key={client.id} className={cn("flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group", linkedClientIds.includes(client.id) ? "bg-secondary/5 border-secondary shadow-sm" : "bg-bg-surface border-border-main hover:border-secondary/30")}>
                      <input type="checkbox" checked={linkedClientIds.includes(client.id)} onChange={() => {
                        if (linkedClientIds.includes(client.id)) {
                          setLinkedClientIds(linkedClientIds.filter(id => id !== client.id));
                        } else {
                          setLinkedClientIds([...linkedClientIds, client.id]);
                        }
                      }} className="w-5 h-5 rounded-lg border-2 border-border-main text-secondary focus:ring-secondary" />
                      <div>
                        <p className="text-xs font-black text-text-main group-hover:text-secondary transition-colors">{client.fantasia || client.name}</p>
                        <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest">{client.cnpj}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'dashboard' && selectedPartnerForDashboard) {
    const linkedClients = clients.filter((c: any) => selectedPartnerForDashboard.linkedClientIds?.includes(c.id) && !c.isModel);
    const stats = {
      totalRevenue: linkedClients.reduce((acc: number, c: any) => acc + (c.faturamentoMensal || 0), 0),
      totalClients: linkedClients.length,
      totalEmployees: linkedClients.reduce((acc: number, c: any) => acc + (c.pessoal?.totalColaboradores || 0), 0),
      avgHealth: linkedClients.length > 0 
        ? linkedClients.reduce((acc: number, c: any) => acc + (c.healthScore || 85), 0) / linkedClients.length 
        : 0
    };

    return (
      <div className="space-y-12 animate-executive-fade">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => setView('list')} className="w-12 h-12 rounded-2xl bg-bg-surface border border-border-main flex items-center justify-center text-text-dim hover:text-secondary"><ChevronLeft size={24} /></button>
            <div>
              <h2 className="text-4xl font-display font-black text-text-main tracking-tight">{selectedPartnerForDashboard.fantasia || selectedPartnerForDashboard.razao}</h2>
              <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mt-1">Dashboard de Consolidação Estratégica</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-premium">
            <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-2">Receita Sob Gestão</p>
            <p className="text-2xl font-display font-black text-text-main">{formatCurrency(stats.totalRevenue)}</p>
          </div>
          <div className="card-premium">
            <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-2">Empresas</p>
            <p className="text-2xl font-display font-black text-text-main">{stats.totalClients}</p>
          </div>
          <div className="card-premium">
            <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-2">Saúde Média</p>
            <p className="text-2xl font-display font-black text-text-main">{stats.avgHealth.toFixed(1)}%</p>
          </div>
          <div className="card-premium">
            <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-2">Total Colaboradores</p>
            <p className="text-2xl font-display font-black text-text-main">{stats.totalEmployees}</p>
          </div>
        </div>

        <div className="card-premium">
          <h4 className="text-sm font-black text-text-main uppercase tracking-widest mb-8">Performance Detalhada</h4>
          <div className="space-y-4">
            {linkedClients.map((client: any) => (
              <div key={client.id} className="flex items-center justify-between p-6 bg-bg-surface border border-border-main rounded-2xl hover:border-secondary transition-all group">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white rounded-xl border border-border-soft flex items-center justify-center overflow-hidden">
                    <Building2 size={20} className="text-text-dim group-hover:text-secondary transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-text-main">{client.fantasia || client.name}</p>
                    <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest">{client.segmento}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[9px] font-black text-text-dim uppercase tracking-widest mb-1">Faturamento</p>
                    <p className="text-xs font-black text-text-main">{formatCurrency(client.faturamentoMensal || 0)}</p>
                  </div>
                  <button onClick={() => setSelectedClient(client.id)} className="btn-ghost py-2 px-4 text-[9px]">Acessar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-32 animate-executive-fade">
      <PageHeader 
        title="Parceiros Estratégicos"
        subtitle="Gestão de parcerias corporativas e consolidação de resultados para gestores externos."
        icon={Users}
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-white/60 p-4 rounded-3xl border border-slate-200/60 backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Pesquisar por parceiro, CNPJ ou cidade..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:border-secondary transition-all shadow-sm" 
            />
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap px-4 border-r border-slate-100 mr-4">
            <span className="text-primary">{filteredPartners.length}</span> Parceiros
          </p>
          {isMaster && (
            <button 
              onClick={openAdd} 
              className="px-4 md:px-6 py-2 md:py-3 bg-secondary hover:bg-secondary/90 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg shadow-secondary/20"
            >
              <Plus size={18} /> ADICIONAR PARCEIRO
            </button>
          )}
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedPartners.map((partner: any) => (
          <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={partner.id} className="card-premium group hover:border-secondary/40 flex flex-col justify-between">
            <div className="space-y-6">
               <div className="flex items-start justify-between">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-border-main group-hover:border-secondary/20 transition-all shadow-sm">
                    <Building2 size={24} className="text-secondary/40" />
                  </div>
                  <div className="flex gap-2">
                     {isMaster && <button onClick={() => openEdit(partner)} className="p-2 text-text-dim hover:text-secondary transition-colors"><Edit3 size={16} /></button>}
                     {isMaster && <button onClick={() => setPartnerToDelete({ id: partner.id, name: partner.fantasia || partner.razao })} className="p-2 text-text-dim hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>}
                  </div>
               </div>
               <div>
                  <h3 className="text-xl font-display font-black text-text-main group-hover:text-secondary transition-colors">{partner.fantasia || partner.razao}</h3>
                  <div className="flex items-center gap-2 mt-1">
                     <MapPin size={12} className="text-text-dim" />
                     <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{partner.cidade || '---'}</span>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4 py-4 border-t border-border-soft">
                  <div>
                     <p className="text-[9px] font-black text-text-dim uppercase tracking-widest mb-1">Clientes</p>
                     <p className="text-sm font-black text-text-main">{partner.linkedClientIds?.length || 0}</p>
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-text-dim uppercase tracking-widest mb-1">CNPJ / CPF</p>
                     <p className="text-xs font-mono font-bold text-text-muted">{formatDoc(partner.cnpj)}</p>
                  </div>
               </div>
            </div>
            <button onClick={() => openDashboard(partner)} className="w-full mt-6 py-4 bg-bg-surface border border-border-main rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-secondary group-hover:text-white group-hover:border-secondary transition-all shadow-sm flex items-center justify-center gap-3">
              <TrendingUp size={16} /> Ver Dashboard Consolidado
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {partnerToDelete && (
          <div className="fixed inset-0 bg-primary/20 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="card-premium bg-bg-card max-w-md w-full text-center p-12 space-y-8">
                 <div className="w-24 h-24 bg-rose-500/10 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner-soft border border-rose-500/20"><Trash2 size={40} /></div>
                 <div className="space-y-3">
                    <h3 className="text-2xl font-display font-black text-text-main uppercase tracking-tight">Remover Parceiro?</h3>
                    <p className="text-sm text-text-muted leading-relaxed font-medium">Você está prestes a remover <strong className="text-text-main">{partnerToDelete.name}</strong>. Esta ação não removerá os clientes vinculados.</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4 pt-4">
                    <button onClick={() => setPartnerToDelete(null)} className="px-6 py-4 bg-bg-surface text-text-dim rounded-2xl text-[10px] font-black uppercase tracking-widest border border-border-main">Cancelar</button>
                    <button onClick={handleDelete} className="px-4 md:px-6 py-2.5 md:py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-rose-700 transition-all">Excluir</button>
                 </div>
              </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
