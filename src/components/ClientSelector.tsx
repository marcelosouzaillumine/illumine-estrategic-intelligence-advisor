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
import { cn } from '../lib/utils';

interface ClientSelectorProps {
  clients: any[];
  selectedClient: string;
  setSelectedClient: (id: string) => void;
  onManageClients?: () => void;
}

export function ClientSelector({ 
  clients, 
  selectedClient, 
  setSelectedClient,
  onManageClients
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
          "flex items-center gap-4 px-6 py-3 rounded-standard transition-all duration-700 group relative overflow-hidden",
          isOpen 
            ? "bg-primary text-white shadow-floating" 
            : "hover:bg-bg-surface/50"
        )}
      >
        <div className={cn(
          "w-8 h-8 flex items-center justify-center shrink-0 transition-all duration-700 overflow-hidden",
          isOpen 
            ? "bg-white shadow-sm" 
            : "bg-white shadow-sm"
        )}>
          {currentClient?.icon || currentClient?.logo ? (
            <img 
              src={currentClient.icon || currentClient.logo} 
              alt={currentClient.fantasia} 
              className="w-full h-full object-contain"
            />
          ) : (
            <Building2 size={24} strokeWidth={1} className={cn(
              "transition-colors",
              isOpen ? "text-primary" : "text-text-dim group-hover:text-accent"
            )} />
          )}
        </div>
        
        <div className="text-left hidden md:block relative z-10">
          <p className={cn(
            "text-[10px] font-bold uppercase tracking-[0.4em] mb-1.5 transition-colors duration-500",
            isOpen ? "text-white/60" : "text-accent"
          )}>
            Cliente Ativo
          </p>
          <div className="flex items-center gap-3">
            <span className={cn(
              "text-[15px] font-bold tracking-tight transition-all duration-500 block leading-tight",
              isOpen ? "!text-white" : "text-text-main"
            )}>
              {currentClient?.fantasia || 'Selecionar Corporação'}
            </span>
            <ChevronDown size={14} strokeWidth={1} className={cn(
              "transition-transform duration-500 shrink-0",
              isOpen ? "rotate-180 !text-white" : "text-text-dim group-hover:text-accent"
            )} />
          </div>
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[24px] shadow-2xl z-[100] overflow-hidden"
          >
            {/* Search Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Pesquisar cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all"
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
                          ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10" 
                          : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden",
                        selectedClient === client.id ? "bg-white/10" : "bg-white border border-slate-100"
                      )}>
                        {client.icon || client.logo ? (
                          <img 
                            src={client.icon || client.logo} 
                            alt={client.fantasia} 
                            className="w-full h-full object-contain p-1.5"
                          />
                        ) : (
                          <Building2 size={18} className={selectedClient === client.id ? "text-white" : "text-slate-400"} />
                        )}
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-xs font-bold truncate tracking-tight">{client.fantasia}</p>
                        <p className={cn(
                          "text-[9px] font-bold uppercase tracking-widest opacity-60",
                          selectedClient === client.id ? "text-slate-400" : "text-slate-400"
                        )}>
                          {client.segmento}
                        </p>
                      </div>
                      {selectedClient === client.id && (
                        <div className="w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center">
                          <Check size={14} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-3">
                    <Search size={24} />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nenhum cliente encontrado</p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-2 border-t border-slate-100 bg-slate-50/30 flex gap-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onManageClients?.();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary hover:bg-white rounded-xl transition-all"
              >
                <Settings size={14} /> Gerenciar
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onManageClients?.();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white rounded-xl transition-all"
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
