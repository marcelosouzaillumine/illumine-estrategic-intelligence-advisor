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
import { User } from 'firebase/auth';
import { motion } from 'motion/react';
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
import { login, logout } from '../lib/firebase';

/* ──────────────────────────── Logo ──────────────────────────── */
function Logo({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className={cn('flex items-center gap-0 transition-all duration-1000 justify-center w-full', collapsed ? '' : '')}>
      <div className={cn(
        'flex items-center justify-center transition-all duration-700 relative group',
        collapsed ? 'w-[46px] h-[46px]' : 'sidebar-logo-img w-[64px] h-[64px]'
      )}>
        <img src="/logo.png" alt="Illumine Icon" className="relative z-10 w-full h-full object-contain" />
      </div>
      {!collapsed && (
        <div className="flex flex-col items-center w-fit">
          <span className="sidebar-logo-text" style={{ fontSize: '42px' }}>
            illumine
          </span>
          <div className="sidebar-logo-sub" style={{ fontSize: '8.5px' }}>
            {'Governance'.split('').map((char, i) => (
              <span key={i}>{char === ' ' ? '\u00A0' : char}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────── AppSidebar ──────────────────────────── */
interface AppSidebarProps {
  user: User | null;
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
  const { state, isMobile, setOpenMobile, setOpen } = useSidebar();
  const isCollapsed = state === 'collapsed';

  // Filter groups based on permissions
  const filteredGroups = NAVIGATION_GROUPS.filter(group => {
    if (isMaster) return true;
    if (!userPermissions) return true;
    return group.items.some(item => {
      if (item.masterOnly) return false;
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
              className="absolute right-0 p-1.5 text-slate-400 hover:text-rose-500 transition-colors rounded-lg"
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
            if (isPartner && item.id === 'portfolio') return true;
            if (!userPermissions || isMaster) return true;
            const permissionKey = `${group.group}:${item.label}`;
            return userPermissions.includes(permissionKey);
          });

          if (filteredItems.length === 0) return null;

          return (
            <SidebarGroup key={group.group}>
              {/* Group label — hidden when collapsed */}
              <SidebarGroupLabel
                className={cn(
                  'cursor-pointer select-none hover:text-foreground transition-colors sidebar-group-label-text text-muted-foreground/85 h-7 mb-1',
                  !isCollapsed ? 'flex' : 'hidden'
                )}
                onClick={() => toggleSubmenu(group.group)}
              >
                <span className="flex-1 truncate">{group.group}</span>
                {isOpen ? <ChevronUp size={10} strokeWidth={1} /> : <ChevronDown size={10} strokeWidth={1} />}
              </SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu>
                  {(isCollapsed ? filteredItems : isOpen ? filteredItems : []).map(item => {
                    const hasChildren = item.children && item.children.length > 0;
                    const isChildActive = hasChildren && item.children?.some(child => child.id === currentPage);
                    const isActive = currentPage === item.id || isChildActive;

                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          isActive={isActive}
                          tooltip={isCollapsed ? item.label : undefined}
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
                            'relative group px-2 xl:px-2.5 py-1 xl:py-1.5 rounded-button transition-all duration-300 sidebar-menu-item-button',
                            isActive
                              ? 'text-foreground font-normal bg-surface-container/40 shadow-xs'
                              : 'text-muted-foreground hover:text-foreground hover:bg-surface-container/20'
                          )}
                        >
                          {/* Active pill indicator */}
                          {currentPage === item.id && (
                            <motion.div
                              layoutId="active-pill"
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3.5 bg-primary rounded-full"
                            />
                          )}

                          <item.icon
                            size={isCollapsed ? 18 : 14}
                            strokeWidth={1.25}
                            className={cn(
                              'shrink-0 transition-colors',
                              isActive ? 'text-primary' : 'text-neutral group-hover:text-foreground'
                            )}
                          />

                          {!isCollapsed && (
                            <div className="flex-1 min-w-0 flex items-center justify-between gap-2 overflow-hidden">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="sidebar-menu-item-text truncate">
                                  {item.label}
                                </span>
                                {item.id === 'aprovacoes' && totalPending > 0 && (
                                  <span className="flex h-4 min-w-[16px] px-1 items-center justify-center bg-rose-500 text-white text-[9px] font-black rounded-full animate-pulse">
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
                                    isActive ? 'rotate-90 text-primary' : 'text-neutral'
                                  )}
                                />
                              )}
                            </div>
                          )}

                          {/* Dot badge when collapsed */}
                          {isCollapsed && item.id === 'aprovacoes' && totalPending > 0 && (
                            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
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
                                        ? 'text-primary bg-surface-container'
                                        : 'text-muted-foreground hover:text-foreground'
                                    )}
                                  >
                                    <span className={cn(
                                      'w-1 h-1 rounded-full shrink-0 transition-all',
                                      currentPage === child.id ? 'bg-secondary scale-125' : 'bg-muted/80'
                                    )} />
                                    <span>{child.label}</span>
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
                  title={isCollapsed ? user.displayName || 'Usuário' : undefined}
                />
              ) : (
                <div
                  className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[9px] shrink-0"
                  title={isCollapsed ? user.displayName || 'Usuário' : undefined}
                >
                  {user.displayName?.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
              )}
              {!isCollapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-body-sm font-medium truncate text-foreground">{user.displayName || 'Usuário'}</p>
                  {!userPermissions && (
                    <span className="text-[8px] font-medium uppercase text-secondary tracking-widest block">
                      Master Admin
                    </span>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={logout}
              title={isCollapsed ? 'Sair' : undefined}
              className={cn(
                'flex items-center justify-center gap-2 py-2 text-xs font-medium uppercase tracking-widest text-destructive hover:bg-destructive/5 rounded-button transition-colors border border-destructive/20',
                isCollapsed ? 'w-9 h-9 p-0 mx-auto' : 'w-full'
              )}
            >
              <LogOut size={13} />
              {!isCollapsed && 'Sair'}
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            title={isCollapsed ? 'Entrar com Google' : undefined}
            className={cn(
              'flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-button text-xs font-medium uppercase tracking-widest hover:bg-primary/90 transition-all shadow-sm',
              isCollapsed ? 'w-9 h-9 p-0 mx-auto' : 'w-full py-3'
            )}
          >
            <LogIn size={isCollapsed ? 18 : 14} />
            {!isCollapsed && 'Entrar'}
          </button>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
