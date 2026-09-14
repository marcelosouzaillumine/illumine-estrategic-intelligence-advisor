import React from 'react';
import { ExecutivePageTemplate } from '../../../../components/ui/executive-page-template';
import { StatusBadge } from '../../../../components/Common';
import { Settings, Users, Shield, Database, LayoutDashboard } from 'lucide-react';

export function AdministrationWorkspacePage(props?: any) {
  return (
    <ExecutivePageTemplate
      header={{
        title: 'Administration Workspace',
        subtitle: 'Global Platform Settings, User Management & System Observability',
        badge: 'SUPER ADMIN'
      }}
    >
      {/* Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <StatusBadge status="Ativo" label="Platform Operations Active" />
          <StatusBadge status="Verde" label="System Healthy" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Placeholder cards for administration actions */}
        
        <div className="bg-[#050506] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-medium mb-1">User Management</h3>
            <p className="text-muted-foreground text-sm">Manage tenants, roles, and platform access</p>
          </div>
        </div>

        <div className="bg-[#050506] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-medium mb-1">Security & Audit</h3>
            <p className="text-muted-foreground text-sm">Review access logs and security policies</p>
          </div>
        </div>

        <div className="bg-[#050506] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-medium mb-1">System Topology</h3>
            <p className="text-muted-foreground text-sm">Manage database connections and architecture</p>
          </div>
        </div>

        <div className="bg-[#050506] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-medium mb-1">Platform Config</h3>
            <p className="text-muted-foreground text-sm">Global features, feature flags and integrations</p>
          </div>
        </div>

      </div>
    </ExecutivePageTemplate>
  );
}
