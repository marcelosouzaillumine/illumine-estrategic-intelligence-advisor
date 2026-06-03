import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { User } from 'firebase/auth';
import { AdminSupportPanel } from './SupportPage/AdminSupportPanel';
import { ClientSupportPanel } from './SupportPage/ClientSupportPanel';
import { ShieldAlert, User as UserIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SupportPageProps {
  selectedClient?: string;
  isMaster?: boolean;
  user?: User | null;
}

export const SupportPage: React.FC<SupportPageProps> = ({ selectedClient, isMaster }) => {
  const { translateLabel: t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'master' | 'client'>('master');

  const switcher = isMaster ? (
    <div className="flex mb-10 -mt-6 xl:ml-[4.5rem]">
      <div className="flex items-center gap-2 p-1.5 bg-surface-container border border-border rounded-full shadow-inner animate-executive-fade">
        <button
          onClick={() => setActiveTab('master')}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-full text-[11px] font-medium uppercase tracking-widest transition-all",
            activeTab === 'master' 
              ? "bg-secondary text-white shadow-premium" 
              : "text-muted-foreground hover:text-foreground hover:bg-black/5"
          )}
        >
          <ShieldAlert size={16} />
          Visão Master
        </button>
        <button
          onClick={() => setActiveTab('client')}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-full text-[11px] font-medium uppercase tracking-widest transition-all",
            activeTab === 'client' 
              ? "bg-primary text-white shadow-premium" 
              : "text-muted-foreground hover:text-foreground hover:bg-black/5"
          )}
        >
          <UserIcon size={16} />
          Meu Suporte
        </button>
      </div>
    </div>
  ) : null;

  if (isMaster) {
    return activeTab === 'master' ? (
      <AdminSupportPanel headerAddon={switcher} />
    ) : (
      <ClientSupportPanel selectedClient={selectedClient} headerAddon={switcher} />
    );
  }
  
  return <ClientSupportPanel selectedClient={selectedClient} />;
};
