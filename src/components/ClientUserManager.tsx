import React, { useState, useEffect } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { cn } from '../lib/utils';
import { PermissaoModulo } from '../types/modules';
import { motion, AnimatePresence } from 'motion/react';
import { NAVIGATION_GROUPS } from '../app/navigation';

const PERMISSION_GROUPS = NAVIGATION_GROUPS.map(group => ({
  id: group.group,
  subItems: group.items.map(item => item.label)
}));

const EIXOS: PermissaoModulo[] = PERMISSION_GROUPS.map(g => g.id as PermissaoModulo);

export function ClientUserManager({ clientId }: { clientId: string }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const initialForm = {
    nome: '',
    email: '',
    cargo: '',
    nivelAcesso: 'Visualizador' as 'Admin' | 'Gerente' | 'Visualizador',
    permissoes: [] as string[],
    status: 'Ativo' as 'Ativo' | 'Inativo'
  };

  const [formData, setFormData] = useState(initialForm);

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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.email) return;
    
    setLoading(true);
    try {
      const payload = {
        ...formData,
        clientId,
        updatedAt: serverTimestamp(),
      };

      const docId = `${formData.email}_${clientId}`;
      await setDoc(doc(db, 'client_users', docId), payload);
      
      setIsAdding(false);
      setEditingId(null);
      setFormData(initialForm);
      fetchUsers();
    } catch (e) {
      console.error(e);
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
    const newPerms = formData.permissoes.includes(item)
      ? formData.permissoes.filter(p => p !== item)
      : [...formData.permissoes, item];
    setFormData({ ...formData, permissoes: newPerms });
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) ? prev.filter(g => g !== groupId) : [...prev, groupId]
    );
  };

  const isGroupSelected = (group: typeof PERMISSION_GROUPS[0]) => {
    return group.subItems.every(sub => formData.permissoes.includes(`${group.id}:${sub}`));
  };

  const toggleFullGroup = (group: typeof PERMISSION_GROUPS[0]) => {
    const allSelected = isGroupSelected(group);
    let newPerms = [...formData.permissoes];
    
    group.subItems.forEach(sub => {
      const key = `${group.id}:${sub}`;
      if (allSelected) {
        newPerms = newPerms.filter(p => p !== key);
      } else if (!newPerms.includes(key)) {
        newPerms.push(key);
      }
    });

    setFormData({ ...formData, permissoes: newPerms });
  };

  return (
    <div className="space-y-10">
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
            className="btn-executive px-6 py-3 shadow-floating-primary"
          >
            <Plus size={16} /> Adicionar Usuário
          </button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card-premium space-y-10 border-secondary/20"
          >
             <div className="flex items-center justify-between">
                <h5 className="text-[11px] font-black text-text-main uppercase tracking-[0.2em] flex items-center gap-3">
                   {editingId ? <Edit3 size={18} className="text-secondary" /> : <UserPlus size={18} className="text-secondary" />} 
                   {editingId ? 'Editar Parâmetros de Acesso' : 'Configurar Novo Usuário'}
                </h5>
                <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="w-8 h-8 rounded-full flex items-center justify-center text-text-dim hover:bg-rose-50 hover:text-rose-600 transition-all">
                   <X size={20} />
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    onChange={e => setFormData({...formData, email: e.target.value})}
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
                          "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-3",
                          formData.status === status 
                            ? (status === 'Ativo' ? "bg-emerald-500 text-white border-emerald-500 shadow-floating-success" : "bg-rose-500 text-white border-rose-500 shadow-floating-danger")
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
                      const allSubItems = PERMISSION_GROUPS.flatMap(g => g.subItems.map(s => `${g.id}:${s}`));
                      setFormData({...formData, permissoes: formData.permissoes.length === allSubItems.length ? [] : allSubItems});
                    }}
                    className="text-[10px] font-black text-secondary uppercase hover:underline tracking-widest"
                  >
                    {formData.permissoes.length === PERMISSION_GROUPS.flatMap(g => g.subItems).length ? 'Limpar Todos' : 'Selecionar Tudo'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {PERMISSION_GROUPS.map((group) => {
                    const selectedCount = group.subItems.filter(s => formData.permissoes.includes(`${group.id}:${s}`)).length;
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

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-bg-card/50 border-t border-border-soft"
                            >
                              <div className="p-5 space-y-3">
                                {group.subItems.map((sub) => (
                                  <label key={sub} className="flex items-center gap-4 cursor-pointer select-none group/item">
                                    <input 
                                      type="checkbox"
                                      className="sr-only peer"
                                      checked={formData.permissoes.includes(`${group.id}:${sub}`)}
                                      onChange={() => togglePermission(`${group.id}:${sub}`)}
                                    />
                                    <div className="w-4 h-4 rounded border border-border-main bg-bg-card peer-checked:bg-secondary peer-checked:border-secondary flex items-center justify-center transition-all group-hover/item:border-secondary/50">
                                      <div className="w-1.5 h-1.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                                    </div>
                                    <span className="text-[10px] font-bold text-text-muted group-hover/item:text-text-main transition-colors">{sub}</span>
                                  </label>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
             </div>

             <div className="flex justify-end gap-5 pt-8 border-t border-border-soft">
                <button 
                  onClick={() => { setIsAdding(false); setEditingId(null); }}
                  className="px-8 py-3 text-[10px] font-black uppercase text-text-dim hover:text-text-main tracking-widest transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  disabled={loading || !formData.nome || !formData.email}
                  className="btn-executive px-12 py-3 shadow-floating-primary"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : editingId ? <Save size={16} /> : <CheckCircle2 size={16} />}
                  {editingId ? 'Confirmar Alterações' : 'Liberar Acesso'}
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="card-premium p-0 overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full text-left">
             <thead className="bg-bg-surface border-b border-border-main">
               <tr>
                 <th className="px-8 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest">Identificação / Função</th>
                 <th className="px-8 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest">Nível Global</th>
                 <th className="px-8 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest">Módulos</th>
                 <th className="px-8 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest">Status</th>
                 <th className="px-8 py-5 text-right text-[10px] font-black text-text-dim uppercase tracking-widest">Ações</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-border-soft">
               {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-24 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-bg-surface rounded-2xl flex items-center justify-center text-text-dim border border-border-main">
                            <ShieldAlert size={32} className="opacity-30" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-black text-text-main uppercase tracking-widest">Nenhum usuário vinculado</p>
                            <p className="text-[11px] text-text-dim font-medium uppercase tracking-widest">Inicie o cadastro para conceder acesso externo a este cliente.</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map(u => (
                      <tr key={u.id} className="hover:bg-bg-surface/30 transition-colors group">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-5">
                             <div className="w-10 h-10 rounded-xl bg-secondary/5 border border-secondary/10 flex items-center justify-center text-secondary font-black text-sm group-hover:bg-secondary group-hover:text-white transition-all">
                               {u.nome.substring(0, 1).toUpperCase()}
                             </div>
                             <div>
                               <p className="text-sm font-black text-text-main group-hover:text-secondary transition-colors">{u.nome}</p>
                               <p className="text-[11px] text-text-dim font-medium italic mt-0.5">{u.email}</p>
                               <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1 opacity-60">{u.cargo}</p>
                             </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className={cn(
                             "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-inner-soft",
                             u.nivelAcesso === 'Admin' ? "bg-primary/10 text-primary border-primary/20" : 
                             u.nivelAcesso === 'Gerente' ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-bg-surface text-text-dim border-border-main"
                           )}>
                             {u.nivelAcesso}
                           </span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex flex-wrap gap-2 max-w-[240px]">
                             {(() => {
                               const selectedGroups = [...new Set((u.permissoes || []).map((p: string) => p.split(':')[0]))];
                               if (selectedGroups.length === PERMISSION_GROUPS.length) return <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1"><UserCheck size={14} /> Full Access</span>;
                               return selectedGroups.map((g: any, idx: number) => (
                                 <span key={idx} className="px-2 py-1 bg-bg-surface border border-border-main rounded text-[9px] font-bold text-text-muted uppercase tracking-widest">{g}</span>
                               ));
                             })()}
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                             <div className={cn("w-2 h-2 rounded-full shadow-sm", u.status === 'Ativo' ? "bg-emerald-500" : "bg-rose-500")} />
                             <span className="text-[10px] font-black text-text-main uppercase tracking-widest">{u.status}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => {
                                   setEditingId(u.id);
                                   setFormData({ ...initialForm, ...u });
                                   setIsAdding(true);
                                }}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-text-dim hover:bg-bg-surface hover:text-secondary transition-all"
                              >
                                 <Edit3 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDelete(u.id)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-text-dim hover:bg-rose-50 hover:text-rose-600 transition-all"
                              >
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))
                  )}
             </tbody>
           </table>
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
