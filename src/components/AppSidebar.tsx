import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  LogIn,
  LogOut,
  Loader2,
} from 'lucide-react';
import { useSidebarAuthAdapter, SidebarUser } from '../adapters/ui/SidebarAuthAdapter';
import { cn } from '../lib/utils';
import { NAVIGATION_GROUPS, type Page } from '../app/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
  useSidebar,
} from './ui/sidebar';
import { ClientSelector } from './ClientSelector';
import { useLanguage } from '../contexts/LanguageContext';

/* ──────────────────────────── Logo ──────────────────────────── */
function Logo({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className={cn('flex items-center transition-all duration-500 w-full', collapsed ? 'justify-center' : 'justify-start px-2 gap-2')}>
      <div className={cn(
        'flex items-center justify-center transition-all duration-500 relative group shrink-0',
        collapsed ? 'w-8 h-8' : 'w-8 h-8'
      )}>
        <img src="/logo.png" alt="Illumine Icon" className="relative z-10 w-full h-full object-contain" />
      </div>
      {!collapsed && (
        <span 
          className="text-3xl tracking-[-0.04em] text-white leading-[0.8] block" 
          style={{ fontFamily: '"Tilt Warp", sans-serif' }}
        >
          illumine
        </span>
      )}
    </div>
  );
}

/* ──────────────────────────── AppSidebar ──────────────────────────── */
interface AppSidebarProps {
  user: SidebarUser | null;
  authLoading: boolean;
  clients: any[];
  selectedClient: string;
  handleSelectClient: (id: string) => Promise<void>;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  openSubmenus: Record<string, boolean>;
  toggleSubmenu: (name: string) => void;
  userPermissions: string[] | null;
  isPartner: boolean;
  isMaster: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (v: boolean) => void;
  totalPending: number;
}

export function AppSidebar({
  user,
  authLoading,
  clients,
  selectedClient,
  handleSelectClient,
  currentPage,
  setCurrentPage,
  openSubmenus,
  toggleSubmenu,
  userPermissions,
  isPartner,
  isMaster,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  totalPending,
}: AppSidebarProps) {
  const { t, language } = useLanguage();
  const { state, isMobile, setOpenMobile, setOpen } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const { session, login, logout } = useSidebarAuthAdapter();

  const sortNavItems = (items: any[]): any[] => {
    return [...items]
      .map(item => ({
        ...item,
        children: item.children ? sortNavItems(item.children) : undefined
      }))
      .sort((a, b) => {
        if (a.id === 'consolidated_executive') return -1;
        if (b.id === 'consolidated_executive') return 1;

        const labelA = t(a.labelKey, a.label);
        const labelB = t(b.labelKey, b.label);

        const isADashboard = labelA.toLowerCase().includes('dashboard');
        const isBDashboard = labelB.toLowerCase().includes('dashboard');

        if (isADashboard && !isBDashboard) return -1;
        if (!isADashboard && isBDashboard) return 1;

        return labelA.localeCompare(labelB, language);
      });
  };

  // Filter groups based on permissions
  const filteredGroups = NAVIGATION_GROUPS.filter(group => {
    if (isMaster) return true;
    return group.items.some(item => {
      if (item.masterOnly) return false;
      if (item.id === 'observability_console') {
        const hasAccess = session?.role === 'SUPER_ADMIN' || session?.permissions?.includes('VIEW_OBSERVABILITY');
        if (!hasAccess) return false;
      }
      if (!userPermissions) return true;
      const permissionKey = `${group.group}:${item.label}`;
      return userPermissions.includes(permissionKey);
    });
  });

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      {/* Header: Logo */}
      <SidebarHeader className={cn('py-3', isCollapsed ? 'px-2 items-center' : 'px-4')}>
        <div className="flex items-center justify-center w-full relative">
          <Logo collapsed={isCollapsed} />
          {isMobile && (
            <button
              onClick={() => setOpenMobile(false)}
              className="absolute right-0 p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Client Selector — visible only on mobile (expanded) */}
        {isMobile && !isCollapsed && (
          <div className="mt-4 px-2">
            <ClientSelector
              clients={clients}
              selectedClient={selectedClient}
              setSelectedClient={handleSelectClient}
              onManageClients={() => {
                setCurrentPage('clientes');
                setOpenMobile(false);
              }}
            />
          </div>
        )}
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        {filteredGroups.map(group => {
          const isOpen = openSubmenus[group.group] !== false;

          const filteredItems = group.items.filter(item => {
            if (item.masterOnly && !isMaster) return false;
            if (item.id === 'observability_console') {
              const hasAccess = session?.role === 'SUPER_ADMIN' || session?.permissions?.includes('VIEW_OBSERVABILITY');
              if (!hasAccess) return false;
            }
            if (isPartner && item.id === 'portfolio') return true;
            if (!userPermissions || isMaster) return true;
            const permissionKey = `${group.group}:${item.label}`;
            return userPermissions.includes(permissionKey);
          });

          if (filteredItems.length === 0) return null;

          const sortedItems = sortNavItems(filteredItems);

          return (
            <SidebarGroup key={group.group}>
              {/* Group label — hidden when collapsed */}
              <SidebarGroupLabel
                className={cn(
                  'cursor-pointer select-none hover:text-primary transition-colors sidebar-group-label-text text-foreground/70 font-semibold uppercase tracking-[0.14em] text-[9px] h-7 mb-1',
                  !isCollapsed ? 'flex' : 'hidden'
                )}
                onClick={() => toggleSubmenu(group.group)}
              >
                <span className="flex-1 truncate">{t(group.groupKey, group.group)}</span>
                {isOpen ? <ChevronUp size={10} strokeWidth={1} /> : <ChevronDown size={10} strokeWidth={1} />}
              </SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu>
                  {(isCollapsed ? sortedItems : isOpen ? sortedItems : []).map(item => {
                    const hasChildren = item.children && item.children.length > 0;
                    const isChildActive = hasChildren && item.children?.some(child => child.id === currentPage);
                    const isActive = currentPage === item.id || isChildActive;

                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          isActive={isActive}
                          tooltip={isCollapsed ? t(item.labelKey || `navigation.page.${item.id}`, item.label) : undefined}
                          onClick={() => {
                            if (isCollapsed && hasChildren) {
                               setOpen(true);
                               setCurrentPage(item.id);
                               return;
                            }
                            setCurrentPage(item.id);
                            if (isMobile) setOpenMobile(false);
                          }}
                          className={cn(
                            'relative group px-2 xl:px-2.5 py-1.5 xl:py-2 rounded-button transition-all duration-300 sidebar-menu-item-button overflow-hidden',
                            isActive
                              ? 'text-primary font-semibold bg-primary/10'
                              : 'text-foreground/65 hover:text-primary hover:bg-primary/5 bg-transparent'
                          )}
                        >
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-full" />
                          )}

                          <item.icon
                            size={isCollapsed ? 18 : 14}
                            strokeWidth={1.25}
                            className={cn(
                              'shrink-0 transition-colors',
                              isActive ? 'text-primary' : 'text-foreground/50 group-hover:text-primary'
                            )}
                          />

                          {!isCollapsed && (
                            <div className="flex-1 min-w-0 flex items-center justify-between gap-2 overflow-hidden">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="sidebar-menu-item-text truncate">
                                  {t(item.labelKey || `navigation.page.${item.id}`, item.label)}
                                </span>
                                {item.id === 'aprovacoes' && totalPending > 0 && (
                                  <span className="flex h-4 min-w-[16px] px-1 items-center justify-center bg-critical-soft0 text-white text-[9px] font-black rounded-full animate-pulse">
                                    {totalPending}
                                  </span>
                                )}
                              </div>
                              {hasChildren && (
                                <ChevronRight
                                  size={10}
                                  strokeWidth={1}
                                  className={cn(
                                    'shrink-0 transition-transform duration-300',
                                    isActive ? 'rotate-90 text-primary' : 'text-foreground/50 group-hover:text-primary'
                                  )}
                                />
                              )}
                            </div>
                          )}

                          {/* Dot badge when collapsed */}
                          {isCollapsed && item.id === 'aprovacoes' && totalPending > 0 && (
                            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-critical-soft0 rounded-full animate-pulse" />
                          )}
                        </SidebarMenuButton>

                        {/* Sub-items */}
                        {hasChildren && isActive && !isCollapsed && (
                          <SidebarMenuSub className="my-0.5 py-0">
                            {item.children?.map(child => (
                              <SidebarMenuSubItem key={child.id}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={currentPage === child.id}
                                  size="sm"
                                  className="sidebar-submenu-item-button"
                                >
                                  <button
                                    onClick={() => {
                                      setCurrentPage(child.id);
                                      if (isMobile) setOpenMobile(false);
                                    }}
                                    className={cn(
                                      'w-full text-left flex items-center gap-1.5 xl:gap-2.5 py-0.5 xl:py-1 px-1.5 xl:px-2 rounded-sm font-normal leading-none transition-colors sidebar-submenu-item-text',
                                      currentPage === child.id
                                        ? 'text-primary bg-primary/5 font-semibold border border-transparent'
                                        : 'text-foreground/65 hover:text-primary hover:bg-primary/5 bg-transparent'
                                    )}
                                  >
                                    <span className={cn(
                                      'w-1 h-1 rounded-full shrink-0 transition-all',
                                      currentPage === child.id ? 'bg-primary scale-125' : 'bg-muted/80'
                                    )} />
                                    <span>{t(child.labelKey || `navigation.page.${child.id}`, child.label)}</span>
                                  </button>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      {/* Footer: User info + logout */}
      <SidebarFooter className={cn('border-t border-border', isCollapsed ? 'px-2 py-4' : 'p-4 xl:p-6')}>
        {authLoading ? (
          <div className="flex justify-center py-2">
            <Loader2 className="animate-spin text-secondary" size={18} />
          </div>
        ) : user ? (
          <div className="flex flex-col gap-2 xl:gap-3">
            <div className={cn('flex items-center transition-all', isCollapsed ? 'justify-center' : 'gap-2 px-1')}>
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || ''}
                  className="w-6 h-6 rounded-full border border-secondary shrink-0"
                  title={isCollapsed ? user.displayName || t('common.user') : undefined}
                />
              ) : (
                <div
                  className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[9px] shrink-0"
                  title={isCollapsed ? user.displayName || t('common.user') : undefined}
                >
                  {user.displayName?.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
              )}
              {!isCollapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-body-sm font-medium truncate text-foreground">{user.displayName || t('common.user')}</p>
                  {!userPermissions && (
                    <span className="text-[8px] font-medium uppercase text-secondary tracking-widest block">
                      {t('common.master_admin')}
                    </span>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={logout}
              title={isCollapsed ? t('buttons.logout') : undefined}
              className={cn(
                'flex items-center justify-center gap-2 py-2 text-xs font-medium uppercase tracking-widest text-destructive hover:bg-destructive/5 rounded-button transition-colors border border-destructive/20',
                isCollapsed ? 'w-9 h-9 p-0 mx-auto' : 'w-full'
              )}
            >
              <LogOut size={13} />
              {!isCollapsed && t('buttons.logout')}
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            title={isCollapsed ? t('buttons.login') : undefined}
            className={cn(
              'flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-button text-xs font-medium uppercase tracking-widest hover:bg-primary/90 transition-all shadow-sm',
              isCollapsed ? 'w-9 h-9 p-0 mx-auto' : 'w-full py-3'
            )}
          >
            <LogIn size={isCollapsed ? 18 : 14} />
            {!isCollapsed && t('buttons.login')}
          </button>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
