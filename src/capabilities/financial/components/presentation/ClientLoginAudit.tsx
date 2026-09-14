import React from 'react';

import { 
  ShieldAlert, 
  LogIn, 
  LogOut, 
  Clock, 
  Globe, 
  Smartphone, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../../../../lib/utils';

export function ClientLoginAudit({ clientId }: { clientId: string }) {
  // Mock data for login audit
  const audits = [
    { id: 1, user: 'João Silva', type: 'login', time: '12 Mai 2026, 09:15', ip: '189.12.34.56', status: 'success', method: 'Google OAuth' },
    { id: 2, user: 'Maria Souza', type: 'login', time: '11 Mai 2026, 14:30', ip: '177.45.22.11', status: 'success', method: 'Google OAuth' },
    { id: 3, user: 'João Silva', type: 'failed', time: '10 Mai 2026, 22:10', ip: '45.122.33.10', status: 'error', method: 'Tentativa Inválida' },
    { id: 4, user: 'Carlos Oliveira', type: 'login', time: '10 Mai 2026, 08:00', ip: '201.2.3.4', status: 'success', method: 'Google OAuth' },
    { id: 5, user: 'João Silva', type: 'logout', time: '09 Mai 2026, 18:45', ip: '189.12.34.56', status: 'success', method: 'Manual' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-2xl border border-border">
        <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
          <ShieldAlert size={14} className="text-rose-500" /> Auditoria de Logins e Segurança
        </h4>

        <div className="space-y-3">
          {audits.map((audit) => (
            <div key={audit.id} className={cn(
              "flex items-center justify-between p-4 rounded-xl border transition-all",
              audit.status === 'success' ? "bg-white border-border" : "bg-critical-soft/50 border-rose-100"
            )}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  audit.type === 'login' ? "bg-success-soft text-emerald-500" : 
                  audit.type === 'logout' ? "bg-slate-100 text-muted-foreground" : "bg-rose-100 text-rose-500"
                )}>
                  {audit.type === 'login' ? <LogIn size={18} /> : 
                   audit.type === 'logout' ? <LogOut size={18} /> : <AlertCircle size={18} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-muted-foreground">
                    {audit.user} 
                    <span className={cn(
                      "ml-2 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                      audit.type === 'login' ? "bg-success-soft text-emerald-600 border-emerald-100" : 
                      audit.type === 'logout' ? "bg-slate-50 text-muted-foreground border-border" : "bg-critical-soft text-rose-600 border-rose-100"
                    )}>
                      {audit.type === 'login' ? 'Login' : audit.type === 'logout' ? 'Logout' : 'Falha'}
                    </span>
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                      <Clock size={10} /> {audit.time}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                      <Globe size={10} /> IP: {audit.ip}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Método</p>
                <p className="text-[11px] font-bold text-muted-foreground">{audit.method}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-warning-soft p-6 rounded-2xl border border-amber-100 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
          <ShieldAlert size={24} />
        </div>
        <div className="space-y-1">
          <h5 className="text-sm font-black text-amber-900 uppercase tracking-widest">Alerta de Segurança</h5>
          <p className="text-xs text-amber-800/80 font-medium leading-relaxed">
            Detectamos 1 tentativa de login malsucedida nos últimos 7 dias vinda de um IP não reconhecido. Recomendamos revisar as permissões dos usuários deste cliente.
          </p>
        </div>
      </div>
    </div>
  );
}
