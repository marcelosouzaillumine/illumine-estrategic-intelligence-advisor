import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { collection, query, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db, auth, sendPasswordResetEmail, MASTER_ADMINS } from '../../../lib/firebase';
import { PageHeader } from '../../Common';
import { Users, Search, Mail, Loader2, ShieldCheck, Clock, Key } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AppUser {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  lastAccess: Timestamp | null;
  userType?: string;
  associatedCompanies?: { id: string; name: string; type: 'client' | 'partner' | 'global' }[];
}

export function GestaoUsuariosPage({ setSelectedClient, setCurrentPage }: any) {
  const { translateLabel: t } = useLanguage();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [usersSnap, clientsSnap, partnersSnap, clientUsersSnap] = await Promise.all([
        getDocs(query(collection(db, 'users'), orderBy('lastAccess', 'desc'))),
        getDocs(collection(db, 'clients')),
        getDocs(collection(db, 'partners')),
        getDocs(collection(db, 'client_users'))
      ]);

      const clientsData = clientsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const partnersData = partnersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const clientUsersData = clientUsersSnap.docs.map(d => d.data());

      const data = usersSnap.docs.map(doc => {
        const u = { id: doc.id, ...doc.data() } as AppUser;
        const emailLower = (u.email || '').toLowerCase().trim();
        
        let userType = 'Indefinido';
        const companiesMap = new Map<string, { id: string; name: string; type: 'client' | 'partner' | 'global' }>();
        let fallbackName = u.displayName;

        // Check Master
        if (MASTER_ADMINS.some(m => m.toLowerCase().trim() === emailLower)) {
          userType = 'Master Admin';
          companiesMap.set('global', { id: 'global', name: 'Acesso Global', type: 'global' });
        } else {
          // Check Partner
          const ownedPartners = partnersData.filter((p: any) => p.ownerId === u.uid);
          if (ownedPartners.length > 0) {
            userType = 'Parceiro Master';
            ownedPartners.forEach((p: any) => {
              if (p.responsavel && !fallbackName) fallbackName = p.responsavel;
              companiesMap.set(p.id, { id: p.id, name: p.name || p.fantasia || 'Parceiro', type: 'partner' });
            });
          }

          // Check Client Owner
          const ownedClients = clientsData.filter((c: any) => c.ownerId === u.uid);
          if (ownedClients.length > 0) {
            if (userType === 'Indefinido') userType = 'Proprietário de Cliente';
            ownedClients.forEach((c: any) => {
              if (c.responsavel && !fallbackName) fallbackName = c.responsavel;
              companiesMap.set(c.id, { id: c.id, name: c.fantasia || c.name || 'Empresa', type: 'client' });
            });
          }

          // Check Client Users
          const associatedClientUsers = clientUsersData.filter((cu: any) => (cu.email || '').toLowerCase().trim() === emailLower);
          if (associatedClientUsers.length > 0) {
            if (userType === 'Indefinido') userType = 'Usuário de Cliente';
            associatedClientUsers.forEach((cu: any) => {
              if (cu.nome && !fallbackName) fallbackName = cu.nome;
              const clientId = cu.clientId;
              const clientMatch = clientsData.find(c => c.id === clientId);
              if (clientMatch) {
                companiesMap.set(clientId, { id: clientId, name: (clientMatch as any).fantasia || (clientMatch as any).name || 'Empresa', type: 'client' });
              } else {
                const partnerMatch = partnersData.find(p => p.id === clientId);
                if (partnerMatch) {
                  companiesMap.set(clientId, { id: clientId, name: (partnerMatch as any).name || (partnerMatch as any).fantasia || 'Parceiro', type: 'partner' });
                }
              }
            });
          }
        }

        return {
          ...u,
          displayName: fallbackName || '',
          userType,
          associatedCompanies: Array.from(companiesMap.values())
        };
      }).filter(u => u.userType !== 'Indefinido');
      setUsers(data);
    } catch (error) {
      console.error("Error fetching global users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (email: string, userId: string) => {
    if (!email) return;
    setResettingUserId(userId);
    setSuccessMessage(null);
    try {
      await sendPasswordResetEmail(email);
      setSuccessMessage(`E-mail de recuperação enviado para ${email}`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error("Error sending reset email:", error);
      alert("Erro ao enviar e-mail de redefinição.");
    } finally {
      setResettingUserId(null);
    }
  };

  const filteredUsers = users.filter(u => {
    const term = searchTerm.toLowerCase();
    return (u.displayName || '').toLowerCase().includes(term) || (u.email || '').toLowerCase().includes(term);
  });

  const handleCompanyClick = (companyId: string, type: 'client' | 'partner' | 'global') => {
    if (type === 'global') return;
    
    if (type === 'client' && setSelectedClient && setCurrentPage) {
      window.sessionStorage.setItem('pendingClientTab', 'usuarios');
      window.sessionStorage.setItem('pendingClientId', companyId);
      setSelectedClient(companyId);
      setCurrentPage('clientes');
    } else if (type === 'partner' && setCurrentPage) {
      // Assuming you might want to navigate to partners or just clients page?
      // For now, let's navigate to parceiros if that page exists
      setCurrentPage('parceiros');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <PageHeader 
          title={t("admin.users.title")}
          subtitle={t("admin.users.subtitle")}
          icon={Users}
        />

        <div className="flex items-center gap-4">
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search size={16} strokeWidth={2} />
            </span>
            <input
              type="text"
              placeholder={t("admin.users.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-3 bg-surface-container/40 border border-border rounded-button text-sm font-bold text-foreground focus:border-secondary transition-all w-full md:w-80 outline-none placeholder:text-muted-foreground placeholder:font-medium"
            />
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-success-soft0/10 border border-emerald-500/20 text-emerald-500 text-sm font-bold uppercase tracking-widest rounded-button flex items-center gap-2">
          <ShieldCheck size={18} />
          {successMessage}
        </div>
      )}

      <div className="card-premium p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-surface border-b border-border-main">
              <tr>
                <th className="px-5 md:px-8 py-4 text-[10px] font-black text-text-dim uppercase tracking-widest">{t("admin.users.col.id")}</th>
                <th className="px-5 md:px-8 py-4 text-[10px] font-black text-text-dim uppercase tracking-widest">E-mail de Acesso</th>
                <th className="px-5 md:px-8 py-4 text-[10px] font-black text-text-dim uppercase tracking-widest">{t("admin.users.col.type")}</th>
                <th className="px-5 md:px-8 py-4 text-[10px] font-black text-text-dim uppercase tracking-widest">{t("admin.users.col.companies")}</th>
                <th className="px-5 md:px-8 py-4 text-[10px] font-black text-text-dim uppercase tracking-widest">{t("admin.users.col.last_login")}</th>
                <th className="px-5 md:px-8 py-4 text-right text-[10px] font-black text-text-dim uppercase tracking-widest">Ações de Segurança</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <Loader2 size={32} className="mx-auto text-secondary animate-spin opacity-50" />
                    <p className="text-[11px] text-text-dim font-medium uppercase tracking-widest mt-4">{t("admin.users.syncing")}</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <p className="text-sm font-black text-text-main uppercase tracking-widest">{t("admin.users.empty_title")}</p>
                    <p className="text-[11px] text-text-dim font-medium uppercase tracking-widest mt-1">{t("admin.users.empty_subtitle")}</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-bg-surface/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        {u.photoURL ? (
                          <img src={u.photoURL} alt={u.displayName} className="w-10 h-10 rounded-xl border border-border-main" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm">
                            {(u.displayName || u.email || '?').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-black text-text-main group-hover:text-primary transition-colors">
                            {u.displayName || t('admin.users.undefined_user') || 'Usuário Indefinido'}
                          </p>
                          <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5">ID: {u.uid.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-[11px] text-text-dim font-medium">
                        <Mail size={14} className="text-text-muted" />
                        {u.email}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-inner-soft whitespace-nowrap",
                        u.userType === 'Master Admin' ? "bg-primary/10 text-primary border-primary/20" : 
                        u.userType === 'Parceiro Master' ? "bg-primary text-primary border-primary" :
                        u.userType === 'Proprietário de Cliente' ? "bg-secondary/10 text-secondary border-secondary/20" :
                        "bg-bg-surface text-text-dim border-border-main"
                      )}>
                        {u.userType}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {u.associatedCompanies && u.associatedCompanies.length > 0 ? (
                          u.associatedCompanies.map((company, idx) => (
                            <span 
                              key={idx} 
                              onClick={() => handleCompanyClick(company.id, company.type)}
                              className={cn(
                                "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest truncate max-w-full transition-colors",
                                company.type === 'global' ? "bg-primary/10 text-primary border border-primary/20" :
                                "bg-bg-surface border border-border-main text-text-muted hover:border-secondary hover:text-secondary cursor-pointer"
                              )}
                              title={company.name}
                            >
                              {company.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] font-medium text-text-muted italic">{t("admin.users.no_company")}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className={cn("text-text-muted", u.lastAccess && "text-emerald-500/70")} />
                        <span className="text-[11px] font-bold text-text-main">
                          {u.lastAccess 
                            ? format(u.lastAccess.toDate(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                            : t('admin.users.never_accessed') || 'Nunca acessou'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => handleResetPassword(u.email, u.id)}
                        disabled={resettingUserId === u.id}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-critical-soft0/10 text-rose-600 hover:bg-critical-soft0 hover:text-white border border-rose-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                      >
                        {resettingUserId === u.id ? <Loader2 size={14} className="animate-spin" /> : <Key size={14} />}
                        Reset de Senha
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
