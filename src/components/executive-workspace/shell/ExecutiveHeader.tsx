import React from 'react';
import { WorkspaceBreadcrumb } from './WorkspaceBreadcrumb';
import { ExecutiveCommandBar } from './ExecutiveCommandBar';
import { Bell, Search, User, Menu } from 'lucide-react';
import { ExecutiveAvatar } from '../foundation/ExecutiveAvatar';
import { LanguageSelector } from '../../shared/LanguageSelector';
import { ClientSelector } from '../../ClientSelector';
import { useSidebarAuthAdapter } from '../../../adapters/ui/SidebarAuthAdapter';

interface ExecutiveHeaderProps {
  officeName: string;
  surfaceName: string;
  onMobileMenuToggle?: () => void;
}

export function ExecutiveHeader({ officeName, surfaceName, onMobileMenuToggle }: ExecutiveHeaderProps) {
  const { clients, selectedClient, handleSelectClient } = useSidebarAuthAdapter();

  return (
    <header className="flex items-center justify-between h-16 px-6 lg:px-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 border-b border-border/40">
      
      {/* Left: Mobile Toggle & Client Selector */}
      <div className="flex items-center gap-4 shrink-0">
        <button 
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Client Selector */}
        <div className="w-[240px] xl:w-[280px] hidden md:block">
          <ClientSelector 
            clients={clients}
            selectedClient={selectedClient}
            setSelectedClient={handleSelectClient}
            isCollapsed={false}
          />
        </div>
      </div>

      {/* Center: Global Search */}
      <div className="hidden lg:flex flex-1 justify-center items-center px-4">
        <div className="relative w-[360px] xl:w-[500px] shrink-0">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search or jump to..." 
            className="w-full h-10 bg-muted/30 border border-border/40 hover:border-border/80 focus:border-primary/50 rounded-lg pl-10 pr-4 text-[13px] font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
          />
        </div>
      </div>

      {/* Right: Global Actions & Profile */}
      <div className="flex items-center justify-end gap-3 md:gap-5 shrink-0">
        
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Notifications */}
          <button className="relative p-2.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-background" />
          </button>
          
          {/* Language Selector */}
          <div className="flex items-center justify-center">
            <LanguageSelector />
          </div>
        </div>

        <div className="hidden sm:block w-px h-5 bg-border/50 mx-1 shrink-0" />

        {/* Profile */}
        <button className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full hover:bg-muted transition-colors border border-transparent hover:border-border/50">
          <ExecutiveAvatar initials="EA" size="sm" />
          <div className="flex flex-col items-start hidden sm:block pr-1">
            <span className="text-[13px] font-medium text-foreground leading-none">Executive</span>
          </div>
        </button>
      </div>

    </header>
  );
}
