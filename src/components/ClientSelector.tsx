import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  ChevronDown, 
  Search, 
  Check, 
  Settings,
  ExternalLink,
  Plus
} from 'lucide-react';
import { cn, formatDoc } from '../lib/utils';

function ClientImage({ src, alt, fallback }: { src: string; alt: string; fallback: React.ReactNode }) {
  const [error, setError] = useState(false);
  if (!src || error) return <>{fallback}</>;
  return <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setError(true)} />;
}

interface ClientSelectorProps {
  clients: any[];
  selectedClient: string;
  setSelectedClient: (id: string) => void;
  onManageClients?: () => void;
  isCollapsed?: boolean;
}

export function ClientSelector({ 
  clients, 
  selectedClient, 
  setSelectedClient,
  onManageClients,
  isCollapsed
}: ClientSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentClient = clients.find(c => c.id === selectedClient);

  const filteredClients = clients.filter(c => 
    (c.fantasia || c.razao || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Active Client Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center rounded-lg transition-all w-full group",
          isCollapsed ? "justify-center p-1" : "gap-2.5 px-2 py-2 text-left",
          isOpen 
            ? "bg-black/[0.04] dark:bg-white/10" 
            : "hover:bg-black/[0.03] dark:hover:bg-white/5"
        )}
        title={isCollapsed ? currentClient?.fantasia : undefined}
      >
        <div className={cn(
          "rounded flex items-center justify-center shrink-0 overflow-hidden shadow-sm border border-border/50 transition-all",
          isCollapsed ? "w-10 h-10" : "w-8 h-8",
          isOpen ? "bg-black/5 dark:bg-white/10" : "bg-background"
        )}>
          <ClientImage 
            src={currentClient?.icon || currentClient?.logo || ''}
            alt={currentClient?.fantasia || ''}
            fallback={
              <Building2 size={16} strokeWidth={1.5} className={cn(
                "transition-colors",
                isOpen ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
              )} />
            }
          />
        </div>
        
        {!isCollapsed && (
          <div className="text-left flex-1 min-w-0">
            <p className="hidden sm:block text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-[0.15em] mb-0.5">
              Cliente Ativo
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-foreground truncate block">
                {currentClient?.fantasia || 'Selecionar Corporação'}
              </span>
              <ChevronDown size={14} strokeWidth={1.5} className={cn(
                "ml-auto shrink-0 transition-transform",
                isOpen ? "rotate-180 text-foreground" : "text-muted-foreground/60 group-hover:text-foreground"
              )} />
            </div>
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-full left-0 mt-2 w-80 bg-background/95 backdrop-blur-xl border border-border rounded-md shadow-lg z-[100] overflow-hidden"
          >
            {/* Search Header */}
            <div className="p-4 border-b border-border bg-surface-container/50">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Pesquisar cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-surface-elevated border border-border rounded-button text-body-sm font-medium outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all"
                />
              </div>
            </div>

            {/* Client List */}
            <div className="max-h-[320px] overflow-y-auto p-2 custom-scrollbar">
              {filteredClients.length > 0 ? (
                <div className="space-y-1">
                  {filteredClients.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => {
                        setSelectedClient(client.id);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl transition-all group",
                        selectedClient === client.id 
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : "hover:bg-primary/5 text-foreground border border-transparent hover:border-border/30"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden",
                        selectedClient === client.id ? "bg-white/10" : "bg-background border border-border"
                      )}>
                        <ClientImage
                          src={client.icon || client.logo || ''}
                          alt={client.fantasia || ''}
                          fallback={<Building2 size={18} className={selectedClient === client.id ? "text-white" : "text-muted-foreground"} />}
                        />
                      </div>
                      <div className="text-left flex-1 min-w-0 pr-3">
                        <p className={cn(
                          "text-xs font-bold tracking-tight truncate",
                          selectedClient === client.id ? "text-primary-foreground" : "text-foreground"
                        )}>{client.fantasia}</p>
                        <p className={cn(
                          "text-[9px] font-bold uppercase tracking-widest truncate",
                          selectedClient === client.id ? "text-primary-foreground/80" : "text-foreground/70"
                        )}>
                          {client.segmento} {client.cnpj ? `• ${formatDoc(client.cnpj)}` : ''}
                        </p>
                        {client.status && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              client.status === 'Ativo' ? "bg-success-soft0" : "bg-critical-soft0"
                            )} />
                            <span className="text-[8px] font-bold uppercase tracking-widest opacity-50">{client.status}</span>
                          </div>
                        )}
                      </div>
                      {selectedClient === client.id && (
                        <div className="w-6 h-6 bg-white/20 text-white rounded-full flex items-center justify-center shrink-0">
                          <Check size={14} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-muted-foreground mx-auto mb-3">
                    <Search size={24} />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Nenhum cliente encontrado</p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-2 border-t border-border bg-surface-container/30 flex gap-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onManageClients?.();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-body-sm font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-surface-elevated border border-transparent rounded-button transition-all"
              >
                <Settings size={14} /> Gerenciar
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onManageClients?.();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 btn-primary w-full text-body-sm font-medium uppercase tracking-widest rounded-button transition-all"
              >
                <Plus size={14} /> Cadastrar Empresa
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
