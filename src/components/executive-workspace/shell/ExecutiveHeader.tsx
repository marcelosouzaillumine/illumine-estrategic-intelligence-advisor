import React from 'react';
import { WorkspaceBreadcrumb } from './WorkspaceBreadcrumb';
import { ExecutiveCommandBar } from './ExecutiveCommandBar';
import { Bell, Search, User } from 'lucide-react';
import { ExecutiveAvatar } from '../foundation/ExecutiveAvatar';
import { LanguageSelector } from '../../shared/LanguageSelector';

interface ExecutiveHeaderProps {
  officeName: string;
  surfaceName: string;
  onMobileMenuToggle?: () => void;
}

export function ExecutiveHeader({ officeName, surfaceName, onMobileMenuToggle }: ExecutiveHeaderProps) {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-background border-b border-border">
      
      {/* Left: Breadcrumb */}
      <div className="flex-1 min-w-0">
        <WorkspaceBreadcrumb officeName={officeName} surfaceName={surfaceName} />
      </div>

      {/* Center: Command Bar */}
      <div className="flex-[2] flex justify-center">
        <ExecutiveCommandBar />
      </div>

      {/* Right: Global Actions & Profile */}
      <div className="flex-1 flex items-center justify-end gap-3">
        {/* Mobile Search/Menu Toggle */}
        <button 
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full ring-2 ring-background" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />
        
        {/* Language Selector */}
        <LanguageSelector />

        <div className="w-px h-6 bg-border mx-1" />

        {/* Profile */}
        <button className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <ExecutiveAvatar initials="EA" size="sm" />
          <span className="text-sm font-medium hidden sm:block text-foreground">Executive</span>
        </button>
      </div>

    </header>
  );
}
