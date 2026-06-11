import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { 
  Plus,
  UserPlus, 
  Trash2, 
  Edit3, 
  Shield, 
  Loader2, 
  Search,
  X,
  CheckCircle2,
  Mail,
  Briefcase,
  Key,
  ShieldAlert,
  Save,
  UserCheck,
  ArrowRight,
  Copy
} from 'lucide-react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, auth, createSecondaryUser } from '../lib/firebase';
import { cn } from '../lib/utils';
import { PermissaoModulo } from '../types/modules';
import { ExecutiveTable, ExecutiveTableHeader, ExecutiveTableBody, ExecutiveTableRow, ExecutiveTableHead, ExecutiveTableCell } from './ui/executive-table';

import { NAVIGATION_GROUPS } from '../app/navigation';

const PERMISSION_GROUPS = NAVIGATION_GROUPS.map(group => ({
  id: group.group,
  subItems: group.items.map(item => item.label)
}));

const EIXOS: PermissaoModulo[] = PERMISSION_GROUPS.map(g => g.id as PermissaoModulo);

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-critical-soft border border-rose-200 rounded-lg">
          <h2 className="text-xl font-bold text-rose-600 mb-4">Um erro ocorreu na interface</h2>
          <pre className="text-sm bg-white p-4 rounded overflow-auto max-w-full text-rose-800">
            {this.state.error?.toString()}
            {"\n\n"}
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-2 bg-rose-600 text-white rounded font-bold"
          >
            Tentar novamente
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function ClientUserManager(props: { clientId: string }) {
  return (
    <ErrorBoundary>
      <ClientUserManagerInner {...props} />
    </ErrorBoundary>
  );
}

function ClientUserManagerInner({ clientId }: { clientId: string }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [createdCredentials, setCreatedCredentials] = useState<{email: string, pass: string} | null>(null);

  const initialForm = {
    nome: '',
    email: '',
    cpf: '',
    cargo: '',
    nivelAcesso: 'Visualizador' as 'Admin' | 'Gerente' | 'Visualizador',
    permissoes: [] as string[],
    status: 'Ativo' as 'Ativo' | 'Inativo'
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    // Component mounted
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [clientId]);

  const fetchUsers = async () => {
    if (!clientId) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'client_users'), 
        where('clientId', '==', clientId)
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(data);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.email || !formData.cpf) {
      alert('Por favor, preencha todos os campos obrigatórios (Nome, E-mail e CPF).');
      return;
    }
    
    setLoading(true);
    try {
      const emailLower = formData.email.toLowerCase().trim();
      let generatedPass = null;

      const payload: any = {
        ...formData,
        email: emailLower,
        clientId,
        updatedAt: serverTimestamp(),
      };

      if (!editingId) {
        // New user creation
        generatedPass = Math.random().toString(36).substring(2, 8).toUpperCase() + '@123';
        await createSecondaryUser(emailLower, generatedPass);
        payload.requirePasswordChange = true;
      }

      const docId = `${emailLower}_${clientId}`;
      await setDoc(doc(db, 'client_users', docId), payload, { merge: true });
      
      setIsAdding(false);
      setEditingId(null);
      setFormData(initialForm);
      fetchUsers();

      if (generatedPass) {
        setCreatedCredentials({ email: emailLower, pass: generatedPass });
      }
    } catch (e: any) {
      console.error(e);
      if (e.code === 'auth/email-already-in-use') {
        alert('Este e-mail já possui uma conta. Apenas vinculamos ao cliente atual.');
        // Still link the user to the client
        const emailLower = formData.email.toLowerCase().trim();
        const payload: any = {
          ...formData,
          email: emailLower,
          clientId,
          updatedAt: serverTimestamp(),
        };
        const docId = `${emailLower}_${clientId}`;
        await setDoc(doc(db, 'client_users', docId), payload, { merge: true });
        setIsAdding(false);
        setEditingId(null);
        setFormData(initialForm);
        fetchUsers();
      } else {
        alert('Erro ao salvar usuário: ' + e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remover acesso deste usuário?')) return;
    try {
      await deleteDoc(doc(db, 'client_users', id));
      fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const togglePermission = (item: string) => {
    setFormData(prev => {
      const perms = Array.isArray(prev.permissoes) ? [...prev.permissoes] : [];
      const idx = perms.indexOf(item);
      if (idx !== -1) {
        perms.splice(idx, 1);
      } else {
        perms.push(item);
      }
      return { ...prev, permissoes: perms };
    });
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) ? prev.filter(g => g !== groupId) : [...prev, groupId]
    );
  };

  const isGroupSelected = (group: typeof PERMISSION_GROUPS[0]) => {
    const currentPerms = Array.isArray(formData.permissoes) ? formData.permissoes : [];
    return group.subItems.every(sub => currentPerms.includes(`${group.id}:${sub}`));
  };

  const toggleFullGroup = (group: typeof PERMISSION_GROUPS[0]) => {
    setFormData(prev => {
      const perms = Array.isArray(prev.permissoes) ? [...prev.permissoes] : [];
      const allSelected = group.subItems.every(sub => perms.includes(`${group.id}:${sub}`));
      let newPerms = [...perms];
      
      group.subItems.forEach(sub => {
        const key = `${group.id}:${sub}`;
        if (allSelected) {
          const idx = newPerms.indexOf(key);
          if (idx !== -1) newPerms.splice(idx, 1);
        } else if (!newPerms.includes(key)) {
          newPerms.push(key);
        }
      });
      return { ...prev, permissoes: newPerms };
    });
  };

  return (
    <div className="space-y-10">
      {createdCredentials && createPortal(
          <div className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
            <div 
              className="w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl p-6 sm:p-8 relative"
              style={{ width: '100%', maxWidth: '448px', minWidth: '320px' }}
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-success-soft0/10 text-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={32} />
                </div>
              </div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground">Usuário Criado!</h2>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  A conta foi gerada com sucesso. Por favor, envie as credenciais abaixo para que o usuário realize o primeiro acesso.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-surface-container/50 border border-border rounded-xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">E-mail</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{createdCredentials.email}</p>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(createdCredentials.email);
                        alert('E-mail copiado!');
                      }}
                      className="p-2 text-muted-foreground hover:text-secondary transition-colors"
                      title="Copiar e-mail"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="bg-surface-container/50 border border-border rounded-xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Senha Provisória</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground select-all">{createdCredentials.pass}</p>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(createdCredentials.pass);
                        alert('Senha copiada!');
                      }}
                      className="p-2 text-muted-foreground hover:text-secondary transition-colors"
                      title="Copiar senha"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setCreatedCredentials(null)}
                className="w-full py-3 bg-secondary text-white font-bold rounded-standard shadow-premium hover:shadow-lg transition-all"
              >
                Concluir
              </button>
            </div>
          </div>,
          document.body
        )}

      <div className="flex items-center justify-between pb-8 border-b border-border-soft">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-bg-surface rounded-2xl flex items-center justify-center text-secondary border border-border-main shadow-sm">
            <Key size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black text-text-main uppercase tracking-[0.2em]">Gestão de Acessos Externos</h4>
            <p className="text-[11px] text-text-dim font-medium uppercase tracking-widest mt-1">Configure quem tem autorização para visualizar ou editar dados desta organização.</p>
          </div>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="btn-executive shadow-floating-primary"
          >
            <Plus size={16} /> Adicionar Usuário
          </button>
        )}
      </div>

      {isAdding && (
          <div 
            className="card-premium space-y-10 border-secondary/20"
          >
             <div className="flex items-center justify-between">
                <h5 className="text-[11px] font-black text-text-main uppercase tracking-[0.2em] flex items-center gap-3">
                   {editingId ? <Edit3 size={18} className="text-secondary" /> : <UserPlus size={18} className="text-secondary" />} 
                   {editingId ? 'Editar Parâmetros de Acesso' : 'Configurar Novo Usuário'}
                </h5>
                <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="w-8 h-8 rounded-full flex items-center justify-center text-text-dim hover:bg-critical-soft hover:text-rose-600 transition-all">
                   <X size={20} />
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-label px-1">CPF (Obrigatório)</label>
                  <input 
                    type="text" 
                    value={formData.cpf}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').substring(0, 11);
                      const masked = val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
                      setFormData({...formData, cpf: val.length === 11 ? masked : val});
                    }}
                    placeholder="000.000.000-00"
                    className="w-full px-5 py-3 bg-bg-surface border border-border-main rounded-standard text-sm font-bold outline-none focus:border-secondary transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-label px-1">Nome Completo</label>
                  <input 
                    type="text" 
                    value={formData.nome}
                    onChange={e => setFormData({...formData, nome: e.target.value})}
                    placeholder="Ex: João Silva"
                    className="w-full px-5 py-3 bg-bg-surface border border-border-main rounded-standard text-sm font-bold outline-none focus:border-secondary transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-label px-1">E-mail de Acesso</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value.toLowerCase().trim()})}
                    placeholder="usuario@empresa.com.br"
                    className="w-full px-5 py-3 bg-bg-surface border border-border-main rounded-standard text-sm font-bold outline-none focus:border-secondary transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-label px-1">Cargo / Função</label>
                  <input 
                    type="text" 
                    value={formData.cargo}
                    onChange={e => setFormData({...formData, cargo: e.target.value})}
                    placeholder="Ex: Diretor de Operações"
                    className="w-full px-5 py-3 bg-bg-surface border border-border-main rounded-standard text-sm font-bold outline-none focus:border-secondary transition-all"
                  />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-border-soft">
                <div className="space-y-5">
                  <label className="text-label px-1">Perfil de Permissão</label>
                  <div className="flex bg-bg-surface p-1.5 rounded-2xl border border-border-main">
                    {(['Visualizador', 'Gerente', 'Admin'] as const).map((nivel) => (
                      <button
                        key={nivel}
                        onClick={() => setFormData({...formData, nivelAcesso: nivel})}
                        className={cn(
                          "flex-1 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                          formData.nivelAcesso === nivel 
                            ? "bg-bg-card text-secondary shadow-premium border border-border-main" 
                            : "text-text-dim hover:text-text-main"
                        )}
                      >
                        {nivel}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                  <label className="text-label px-1">Status do Registro</label>
                  <div className="flex gap-4">
                    {(['Ativo', 'Inativo'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setFormData({...formData, status: status})}
                        className={cn(
                          "px-5 md:px-8 py-2 md:py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-3",
                          formData.status === status 
                            ? (status === 'Ativo' ? "bg-success-soft0 text-white border-emerald-500 shadow-floating-success" : "bg-critical-soft0 text-white border-rose-500 shadow-floating-danger")
                            : "bg-bg-surface text-text-dim border-border-main hover:bg-bg-card"
                        )}
                      >
                        {status === 'Ativo' ? <CheckCircle2 size={16} /> : <X size={16} />}
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
             </div>

             <div className="space-y-6 pt-10 border-t border-border-soft">
                <div className="flex items-center justify-between">
                  <label className="text-label px-1">Autorizações por Módulo</label>
                  <button 
                    onClick={() => {
                      const allSubItems = PERMISSION_GROUPS.reduce((acc, g) => {
                        return acc.concat(g.subItems.map(s => `${g.id}:${s}`));
                      }, [] as string[]);
                      setFormData(prev => {
                        const currentPerms = Array.isArray(prev.permissoes) ? prev.permissoes : [];
                        return { ...prev, permissoes: currentPerms.length === allSubItems.length ? [] : allSubItems };
                      });
                    }}
                    className="text-[10px] font-black text-secondary uppercase hover:underline tracking-widest"
                  >
                    {(Array.isArray(formData.permissoes) ? formData.permissoes : []).length === PERMISSION_GROUPS.reduce((acc, g) => acc + g.subItems.length, 0) ? 'Limpar Todos' : 'Selecionar Tudo'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {PERMISSION_GROUPS.map((group) => {
                    const currentPerms = Array.isArray(formData.permissoes) ? formData.permissoes : [];
                    const selectedCount = group.subItems.filter(s => currentPerms.includes(`${group.id}:${s}`)).length;
                    const isExpanded = expandedGroups.includes(group.id);

                    return (
                      <div key={group.id} className="bg-bg-surface/50 border border-border-main rounded-standard overflow-hidden transition-all hover:border-secondary/20 group/card">
                        <div 
                          onClick={() => toggleGroup(group.id)}
                          className="p-5 flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleFullGroup(group); }}
                              className={cn(
                                "w-5 h-5 rounded border flex items-center justify-center transition-all",
                                selectedCount === group.subItems.length ? "bg-secondary border-secondary text-white shadow-premium" : 
                                selectedCount > 0 ? "bg-secondary/10 border-secondary/30 text-secondary" : "bg-bg-card border-border-main"
                              )}
                            >
                              {selectedCount === group.subItems.length ? <CheckCircle2 size={12} /> : selectedCount > 0 ? <div className="w-2 h-0.5 bg-secondary" /> : null}
                            </button>
                            <span className={cn("text-[11px] font-black uppercase tracking-widest transition-colors", selectedCount > 0 ? "text-secondary" : "text-text-muted group-hover/card:text-text-main")}>
                              {group.id}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-text-dim bg-bg-card px-2 py-0.5 rounded-full border border-border-main">{selectedCount}/{group.subItems.length}</span>
                            <div className={cn("transition-transform duration-300", isExpanded ? "rotate-180" : "")}>
                              <ArrowDown size={14} className="text-text-dim" />
                            </div>
                          </div>
                        </div>

                          {isExpanded && (
                            <div className="overflow-hidden bg-bg-card/50 border-t border-border-soft">
                              <div className="p-5 space-y-3">
                                {group.subItems.map((sub) => (
                                  <label key={sub} className="flex items-center gap-4 cursor-pointer select-none group/item">
                                    <input 
                                      type="checkbox"
                                      className="w-4 h-4 rounded border-border-main text-secondary focus:ring-secondary/50 cursor-pointer"
                                      checked={(Array.isArray(formData.permissoes) ? formData.permissoes : []).includes(`${group.id}:${sub}`)}
                                      onChange={() => togglePermission(`${group.id}:${sub}`)}
                                    />
                                    <span className="text-[10px] font-bold text-text-muted group-hover/item:text-text-main transition-colors">{sub}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
             </div>

             <div className="flex justify-end gap-5 pt-8 border-t border-border-soft">
                <button 
                  onClick={() => { setIsAdding(false); setEditingId(null); }}
                  className="px-5 md:px-8 py-2 md:py-3 text-[10px] font-black uppercase text-text-dim hover:text-text-main tracking-widest transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  disabled={loading || !formData.nome || !formData.email || !formData.cpf}
                  className="btn-executive shadow-floating-primary"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : editingId ? <Save size={16} /> : <CheckCircle2 size={16} />}
                  {editingId ? 'Confirmar Alterações' : 'Liberar Acesso'}
                </button>
             </div>
          </div>
        )}

      <div className="card-premium p-0 overflow-hidden">
         <div className="overflow-x-auto">
           <ExecutiveTable className="w-full text-left">
             <ExecutiveTableHeader className="bg-bg-surface border-b border-border-main">
               <ExecutiveTableRow>
                 <ExecutiveTableHead className="px-5 md:px-8 py-3 md:py-5 text-[10px] font-black text-text-dim uppercase tracking-widest">Identificação / Função</ExecutiveTableHead>
                 <ExecutiveTableHead className="px-5 md:px-8 py-3 md:py-5 text-[10px] font-black text-text-dim uppercase tracking-widest">Nível Global</ExecutiveTableHead>
                 <ExecutiveTableHead className="px-5 md:px-8 py-3 md:py-5 text-[10px] font-black text-text-dim uppercase tracking-widest">Módulos</ExecutiveTableHead>
                 <ExecutiveTableHead className="px-5 md:px-8 py-3 md:py-5 text-[10px] font-black text-text-dim uppercase tracking-widest">Status</ExecutiveTableHead>
                 <ExecutiveTableHead className="px-5 md:px-8 py-3 md:py-5 text-right text-[10px] font-black text-text-dim uppercase tracking-widest">Ações</ExecutiveTableHead>
               </ExecutiveTableRow>
             </ExecutiveTableHeader>
             <ExecutiveTableBody className="divide-y divide-border-soft">
               {users.length === 0 ? (
                    <ExecutiveTableRow>
                      <ExecutiveTableCell colSpan={5} className="px-8 py-24 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-bg-surface rounded-2xl flex items-center justify-center text-text-dim border border-border-main">
                            <ShieldAlert size={32} className="opacity-30" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-black text-text-main uppercase tracking-widest">Nenhum usuário vinculado</p>
                            <p className="text-[11px] text-text-dim font-medium uppercase tracking-widest">Inicie o cadastro para conceder acesso externo a este cliente.</p>
                          </div>
                        </div>
                      </ExecutiveTableCell>
                    </ExecutiveTableRow>
                  ) : (
                    users.map(u => (
                      <ExecutiveTableRow key={u.id} className="hover:bg-bg-surface/30 transition-colors group">
                        <ExecutiveTableCell className="px-8 py-6">
                           <div className="flex items-center gap-5">
                             <div className="w-10 h-10 rounded-xl bg-secondary/5 border border-secondary/10 flex items-center justify-center text-secondary font-black text-sm group-hover:bg-secondary group-hover:text-white transition-all">
                               {u.nome.substring(0, 1).toUpperCase()}
                             </div>
                             <div>
                               <p className="text-sm font-black text-text-main group-hover:text-secondary transition-colors">{u.nome}</p>
                               <p className="text-[11px] text-text-dim font-medium italic mt-0.5">{u.email} • {u.cpf || 'Sem CPF'}</p>
                               <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1 opacity-60">{u.cargo}</p>
                             </div>
                           </div>
                        </ExecutiveTableCell>
                        <ExecutiveTableCell className="px-8 py-6">
                           <span className={cn(
                             "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-inner-soft",
                             u.nivelAcesso === 'Admin' ? "bg-primary/10 text-primary border-primary/20" : 
                             u.nivelAcesso === 'Gerente' ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-bg-surface text-text-dim border-border-main"
                           )}>
                             {u.nivelAcesso}
                           </span>
                        </ExecutiveTableCell>
                        <ExecutiveTableCell className="px-8 py-6">
                           <div className="flex flex-wrap gap-2 max-w-[240px]">
                             {(() => {
                               const safePerms = Array.isArray(u.permissoes) ? u.permissoes : [];
                               const selectedGroups = [...new Set(safePerms.map((p: string) => p.split(':')[0]))];
                               if (selectedGroups.length === PERMISSION_GROUPS.length) return <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1"><UserCheck size={14} /> Full Access</span>;
                               return selectedGroups.map((g: any, idx: number) => (
                                 <span key={idx} className="px-2 py-1 bg-bg-surface border border-border-main rounded text-[9px] font-bold text-text-muted uppercase tracking-widest">{g}</span>
                               ));
                             })()}
                           </div>
                        </ExecutiveTableCell>
                        <ExecutiveTableCell className="px-8 py-6">
                           <div className="flex items-center gap-2">
                             <div className={cn("w-2 h-2 rounded-full shadow-sm", u.status === 'Ativo' ? "bg-success-soft0" : "bg-critical-soft0")} />
                             <span className="text-[10px] font-black text-text-main uppercase tracking-widest">{u.status}</span>
                           </div>
                        </ExecutiveTableCell>
                        <ExecutiveTableCell className="px-8 py-6 text-right">
                           <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => {
                                   setEditingId(u.id);
                                   setFormData({ ...initialForm, ...u, permissoes: Array.isArray(u.permissoes) ? u.permissoes : [] });
                                   setIsAdding(true);
                                }}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-text-dim hover:bg-bg-surface hover:text-secondary transition-all"
                              >
                                 <Edit3 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDelete(u.id)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-text-dim hover:bg-critical-soft hover:text-rose-600 transition-all"
                              >
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        </ExecutiveTableCell>
                      </ExecutiveTableRow>
                    ))
                  )}
             </ExecutiveTableBody>
           </ExecutiveTable>
         </div>
      </div>

      <div className="card-premium bg-bg-surface/30 border-dashed p-8 flex flex-col md:flex-row items-center gap-8 group">
         <div className="w-16 h-16 rounded-[1.5rem] bg-bg-card border border-border-main flex items-center justify-center text-text-dim group-hover:text-secondary transition-all shadow-premium shrink-0">
            <Shield size={32} className="opacity-40" />
         </div>
         <div className="flex-1 space-y-2">
            <h5 className="text-[10px] font-black text-text-main uppercase tracking-[0.2em] flex items-center gap-2">Protocolo de Segurança Estrutural</h5>
            <p className="text-[11px] text-text-muted leading-relaxed font-medium">
              Os acessos configurados nesta camada são restritos à visualização dos módulos específicos desta unidade de negócio. O nível de privilégio determina a capacidade de alteração de parâmetros e exclusão de históricos operacionais.
            </p>
         </div>
         <div className="shrink-0 flex items-center gap-2 text-[10px] font-black text-secondary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
           Saber mais <ArrowRight size={14} />
         </div>
        </div>
    </div>
  );
}

function ArrowDown(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
