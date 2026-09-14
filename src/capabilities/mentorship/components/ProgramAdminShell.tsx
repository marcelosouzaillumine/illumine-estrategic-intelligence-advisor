import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, GitMerge, BarChart3, Users,
  ChevronLeft, ChevronRight, Shield, Bell, Settings,
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const NAV: NavItem[] = [
  { label: 'Visão Geral',  icon: LayoutDashboard, path: '/admin/programa' },
  { label: 'Matching',     icon: GitMerge,         path: '/admin/programa/matching' },
  { label: 'Relatórios',   icon: BarChart3,        path: '/admin/programa/relatorios' },
  { label: 'Participantes',icon: Users,            path: '/admin/programa/participantes' },
];

interface ProgramAdminShellProps {
  adminName?: string;
  programName?: string;
}

export const ProgramAdminShell: React.FC<ProgramAdminShellProps> = ({
  adminName = 'Admin',
  programName = 'Programa de Mentoria',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) =>
    path === '/admin/programa'
      ? location.pathname === path
      : location.pathname.startsWith(path);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className={`flex flex-col border-r border-border bg-card transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
        <div className={`flex items-center gap-3 px-4 h-16 border-b border-border ${collapsed ? 'justify-center' : ''}`}>
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">Program Admin</p>
              <p className="text-[10px] text-muted-foreground truncate">{programName}</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {NAV.map(item => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-violet-600/10 text-violet-600 dark:text-violet-400'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={18} className="flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-border p-2">
          {!collapsed && (
            <div className="flex items-center gap-2 px-2 py-2 mb-1">
              <div className="w-7 h-7 rounded-full bg-violet-600/20 flex items-center justify-center text-xs font-bold text-violet-600">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground truncate">{adminName}</p>
                <p className="text-[10px] text-muted-foreground">Program Admin</p>
              </div>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Settings size={14} />
              </button>
            </div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex items-center justify-between h-16 px-6 border-b border-border bg-card">
          <div>
            <h1 className="text-sm font-semibold text-foreground">
              {NAV.find(n => isActive(n.path))?.label ?? 'Program Admin'}
            </h1>
            <p className="text-xs text-muted-foreground">{programName}</p>
          </div>
          <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Bell size={18} />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
