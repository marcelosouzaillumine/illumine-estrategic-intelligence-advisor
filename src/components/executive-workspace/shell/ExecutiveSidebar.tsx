import React, { useState, useMemo, useRef, useEffect } from 'react';
import { PanelLeftClose, PanelLeftOpen, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../lib/firebase';
import { resolveExecutiveNavigation, resolveOfficeNavigation } from '../../../core/navigation/navigation.resolver';
import { WorkspaceNavigationGroup } from '../../../core/navigation/navigation.types';
import { ClientSelector } from '../../ClientSelector';
import { useSidebarAuthAdapter } from '../../../adapters/ui/SidebarAuthAdapter';
import { useLanguage } from '../../../contexts/LanguageContext';
import { cn } from '../../../lib/utils';

interface ExecutiveSidebarProps {
  currentOfficeId: string;
  onOfficeChange: (officeId: string) => void;
  currentSurfaceId: string;
  onSurfaceChange: (surfaceId: string) => void;
}

export function ExecutiveSidebar({ currentOfficeId, onOfficeChange, currentSurfaceId, onSurfaceChange }: ExecutiveSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { clients, selectedClient, handleSelectClient } = useSidebarAuthAdapter();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/pt/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  
  // Extract complete navigation architecture
  const nav = useMemo(() => resolveExecutiveNavigation(), []);

  // Persist scroll state across renders
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      const savedScroll = sessionStorage.getItem('executiveSidebarScroll');
      if (savedScroll) {
        scrollRef.current.scrollTop = parseInt(savedScroll, 10);
      }
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    sessionStorage.setItem('executiveSidebarScroll', e.currentTarget.scrollTop.toString());
  };

  // Determine if a group is currently active
  const isGroupActive = (groupKey: string, officeId?: string) => {
    if (officeId && officeId === currentOfficeId) return true;
    if (groupKey === currentOfficeId) return true;
    
    // Map currentOfficeId (which could be a legacy ID) to a group to check if it matches
    const currentOffice = resolveOfficeNavigation(currentOfficeId);
    return currentOffice?.groupKey === groupKey || (currentOffice?.officeId && currentOffice.officeId === officeId);
  };

  return (
    <div className={`flex flex-col h-screen bg-background border-r border-border transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Top area: Logo and Toggle */}
      <div className={`flex items-center h-16 border-b border-border px-4 ${isCollapsed ? 'justify-center' : 'justify-between'} relative group`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 relative shrink-0 flex items-center justify-center">
            <img src="/logo.png" alt="Illumine Icon" className="relative z-10 w-full h-full object-contain" />
          </div>
          {!isCollapsed && (
            <span 
              className="text-2xl tracking-[-0.04em] text-foreground leading-[0.8] block" 
              style={{ fontFamily: '"Tilt Warp", sans-serif' }}
            >
              illumine
            </span>
          )}
        </div>
        {!isCollapsed && (
          <button type="button" 
            onClick={() => setIsCollapsed(true)}
            className="p-1 text-muted-foreground/30 hover:text-foreground transition-colors absolute right-3 opacity-0 group-hover:opacity-100"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Client Selector Area */}
      <div className={cn("border-b border-border transition-all", isCollapsed ? "p-3 flex flex-col items-center gap-3" : "px-3 py-3")}>
        <ClientSelector 
          clients={clients}
          selectedClient={selectedClient}
          setSelectedClient={handleSelectClient}
          isCollapsed={isCollapsed}
        />
        {isCollapsed && (
          <button type="button" 
            onClick={() => setIsCollapsed(false)}
            className="p-1.5 text-muted-foreground/40 hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground rounded-md transition-colors flex justify-center"
            title={t('navigation.action.expand', 'Expandir menu')}
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Scrollable Navigation */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 flex flex-col gap-6"
      >
        
        {/* Render a section helper */}
        {(() => {
          const renderSection = (title: string, groups: WorkspaceNavigationGroup[]) => {
            if (groups.length === 0) return null;
            return (
              <div className="flex flex-col gap-1">
                {!isCollapsed && (
                  <h4 className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-[0.15em] mb-2 mt-5 px-3 flex items-center gap-2">
                    {title}
                  </h4>
                )}
                {groups.map(group => {
                  const currentOfficeSlug = group.officeId || group.groupKey;
                  const isActive = isGroupActive(group.groupKey, group.officeId);
                  const Icon = group.icon || LayoutDashboard;
                  
                  return (
                    <div key={group.groupKey} className="flex flex-col gap-0.5 relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          onOfficeChange(currentOfficeSlug);
                        }}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all w-full text-left group
                          ${isActive 
                            ? 'bg-black/[0.04] dark:bg-white/10 text-foreground font-medium' 
                            : 'text-muted-foreground hover:bg-black/[0.03] dark:hover:bg-white/5 hover:text-foreground'}
                          ${isCollapsed ? 'justify-center' : 'justify-start'}
                        `}
                        title={isCollapsed ? group.group : undefined}
                      >
                        <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`} />
                        {!isCollapsed && <span className="text-[13px] tracking-tight truncate">{group.groupKey ? t(group.groupKey, group.group) : group.group}</span>}
                      </button>
                      
                      {/* Expanded surfaces */}
                      {isActive && !isCollapsed && group.items.length > 0 && (
                        <div className="ml-[22px] pl-4 border-l border-border/40 flex flex-col gap-0.5 mt-1.5 mb-3">
                          {group.items.map(surface => {
                            if (surface.children && surface.children.length > 0) {
                              return (
                                <div key={surface.id} className="mt-2 mb-1 flex flex-col gap-0.5">
                                  <div className="px-3 py-1 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest flex items-center gap-2">
                                    <surface.icon className="w-3 h-3" />
                                    {surface.labelKey ? t(surface.labelKey, surface.label) : surface.label}
                                  </div>
                                  {surface.children.map(child => {
                                    const isChildActive = currentSurfaceId === child.id;
                                    return (
                                      <button
                                        type="button"
                                        key={child.id}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          onSurfaceChange(child.id);
                                        }}
                                        className={`text-left text-[12px] py-1.5 px-3 rounded-md transition-all truncate relative
                                          ${isChildActive 
                                            ? 'text-foreground font-medium bg-black/[0.03] dark:bg-white/5' 
                                            : 'text-muted-foreground hover:text-foreground hover:bg-black/[0.02] dark:hover:bg-white/5'
                                          }
                                        `}
                                      >
                                        {isChildActive && (
                                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3 bg-foreground/30 rounded-r-full -ml-[17px]" />
                                        )}
                                        {child.labelKey ? t(child.labelKey, child.label) : child.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              );
                            }

                            const isSurfaceActive = currentSurfaceId === surface.id;
                            return (
                              <button
                                type="button"
                                key={surface.id}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  onSurfaceChange(surface.id);
                                }}
                                className={`text-left text-[12px] py-1.5 px-3 rounded-md transition-all truncate relative
                                  ${isSurfaceActive 
                                    ? 'text-foreground font-medium bg-black/[0.03] dark:bg-white/5' 
                                    : 'text-muted-foreground hover:text-foreground hover:bg-black/[0.02] dark:hover:bg-white/5'
                                  }
                                `}
                              >
                                {isSurfaceActive && (
                                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3 bg-foreground/30 rounded-r-full -ml-[17px]" />
                                )}
                                {surface.labelKey ? t(surface.labelKey, surface.label) : surface.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          };

          return (
            <>
              {renderSection(t('navigation.category.command', 'Command Center'), nav.command)}
              {renderSection(t('navigation.category.board', 'Board & Governance'), nav.board)}
              {renderSection(t('navigation.category.executive', 'Executive Offices'), nav.offices)}
              {renderSection(t('navigation.category.intelligence', 'Enterprise Intelligence'), nav.intelligence)}
              {renderSection(t('navigation.category.partner', 'Advisor Network'), nav.partner)}
              {renderSection(t('navigation.category.foundation', 'Data Foundation'), nav.foundation)}
              {renderSection(t('navigation.category.administration', 'Administration'), nav.administration)}
              {renderSection(t('navigation.category.platform', 'Platform Layer'), nav.platform)}
            </>
          );
        })()}
      </div>

      {/* Footer Settings */}
      <div className="p-4 border-t border-border flex flex-col gap-1">
        <button type="button"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-left text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground
            ${isCollapsed ? 'justify-center' : 'justify-start'}
          `}
          title={isCollapsed ? t('navigation.page.settings', 'Configurações') : undefined}
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="text-[13px]">{t('navigation.page.settings', 'Configurações')}</span>}
        </button>
        <button type="button"
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-left text-muted-foreground hover:bg-red-500/10 hover:text-red-500 dark:hover:bg-red-500/20 dark:hover:text-red-400
            ${isCollapsed ? 'justify-center' : 'justify-start'}
          `}
          title={isCollapsed ? t('navigation.page.logout', 'Sair') : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="text-[13px]">{t('navigation.page.logout', 'Sair')}</span>}
        </button>
      </div>
    </div>
  );
}
