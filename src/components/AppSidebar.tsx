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
    <div className={cn('flex items-center gap-1 transition-all duration-1000 justify-center w-full', collapsed ? '' : '')}>
      <div className={cn(
        'flex items-center justify-center transition-all duration-700 relative group',
        collapsed ? 'w-[46px] h-[46px]' : 'w-[60px] h-[60px] -translate-y-[4px]'
      )}>
        <img src="/logo.png" alt="Illumine Icon" className="relative z-10 w-full h-full object-contain" />
      </div>
      {!collapsed && (
        <div className="flex flex-col w-fit">
          <span
            className="text-[42px] tracking-[-0.06em] text-text-main leading-[0.8]"
            style={{ fontFamily: '"Tilt Warp", sans-serif' }}
          >
            illumine
          </span>
          <div
            className="flex justify-between w-full text-[11px] text-secondary uppercase mt-0"
            style={{ fontFamily: '"Work Sans", sans-serif' }}
          >
            {'Business Intelligence'.split('').map((char, i) => (
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
  const { state, isMobile, setOpenMobile } = useSidebar();
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
    <Sidebar collapsible="icon" className="border-r border-border-main">
      {/* Header: Logo */}
      <SidebarHeader className={cn('py-3', isCollapsed ? 'px-2 items-center' : 'px-4')}>
        <div className={cn('flex items-center', isCollapsed ? 'justify-center' : 'justify-between')}>
          <Logo collapsed={isCollapsed} />
          {isMobile && (
            <button
              onClick={() => setOpenMobile(false)}
              className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors rounded-lg"
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
                  'cursor-pointer select-none hover:text-text-main transition-colors',
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
                            if (isCollapsed && hasChildren) return;
                            setCurrentPage(item.id);
                            if (isMobile) setOpenMobile(false);
                          }}
                          className={cn(
                            'relative group h-9',
                            isActive
                              ? 'text-text-main font-semibold'
                              : 'text-text-muted hover:text-text-main'
                          )}
                        >
                          {/* Active pill indicator */}
                          {currentPage === item.id && (
                            <motion.div
                              layoutId="active-pill"
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full"
                            />
                          )}

                          <item.icon
                            size={isCollapsed ? 18 : 16}
                            strokeWidth={1}
                            className={cn(
                              'shrink-0 transition-colors',
                              isActive ? 'text-primary' : 'text-text-dim group-hover:text-text-main'
                            )}
                          />

                          {!isCollapsed && (
                            <div className="flex-1 min-w-0 flex items-center justify-between gap-2 overflow-hidden">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="tracking-wide text-[11.5px] whitespace-nowrap truncate">
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
                                    isActive ? 'rotate-90 text-primary' : 'text-text-dim'
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
                          <SidebarMenuSub>
                            {item.children?.map(child => (
                              <SidebarMenuSubItem key={child.id}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={currentPage === child.id}
                                  size="sm"
                                >
                                  <button
                                    onClick={() => {
                                      setCurrentPage(child.id);
                                      if (isMobile) setOpenMobile(false);
                                    }}
                                    className={cn(
                                      'w-full text-left',
                                      currentPage === child.id
                                        ? 'text-primary font-bold bg-bg-surface'
                                        : 'text-text-muted hover:text-text-main'
                                    )}
                                  >
                                    <span className={cn(
                                      'w-1 h-1 rounded-full shrink-0',
                                      currentPage === child.id ? 'bg-secondary scale-125' : 'bg-slate-300'
                                    )} />
                                    <span className="tracking-tight whitespace-nowrap">{child.label}</span>
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
      <SidebarFooter className={cn('border-t border-border-main', isCollapsed ? 'px-2 py-4' : 'p-6')}>
        {authLoading ? (
          <div className="flex justify-center py-2">
            <Loader2 className="animate-spin text-secondary" size={18} />
          </div>
        ) : user ? (
          <div className="flex flex-col gap-3">
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
                  <p className="text-xs font-bold truncate text-text-main">{user.displayName || 'Usuário'}</p>
                  {!userPermissions && (
                    <span className="text-[8px] font-black uppercase text-secondary tracking-widest block">
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
                'flex items-center justify-center gap-2 py-2 text-xs font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-100',
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
              'flex items-center justify-center gap-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20',
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
