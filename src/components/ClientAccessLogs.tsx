
import React from 'react';
import { 
  Eye, 
  Clock, 
  MapPin, 
  Laptop, 
  Globe,
  UserCheck
} from 'lucide-react';
import { cn } from '../lib/utils';

export function ClientAccessLogs({ clientId }: { clientId: string }) {
  // Mock data for access logs
  const logs = [
    { id: 1, user: 'João Silva', action: 'Visualizou DRE Gerencial', time: 'Há 5 minutos', location: 'São Paulo, SP', device: 'Chrome / MacOS', status: 'success' },
    { id: 2, user: 'Maria Souza', action: 'Editou Premissas de Cliente', time: 'Há 2 horas', location: 'Belo Horizonte, MG', device: 'Firefox / Windows', status: 'success' },
    { id: 3, user: 'João Silva', action: 'Exportou Relatório Executivo', time: 'Hoje, 10:45', location: 'São Paulo, SP', device: 'Chrome / MacOS', status: 'success' },
    { id: 4, user: 'Carlos Oliveira', action: 'Visualizou Quadro de Pessoal', time: 'Ontem, 16:20', location: 'Curitiba, PR', device: 'Safari / iOS', status: 'success' },
    { id: 5, user: 'Maria Souza', action: 'Importou Balanço Patrimonial', time: '10 Mai, 14:10', location: 'Belo Horizonte, MG', device: 'Edge / Windows', status: 'success' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-2xl border border-border">
        <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
          <Eye size={14} className="text-blue-500" /> Registro de Acessos Recentes
        </h4>

        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-border">
                <th className="px-4 md:px-6 py-2.5 md:py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Usuário</th>
                <th className="px-4 md:px-6 py-2.5 md:py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ação / Módulo</th>
                <th className="px-4 md:px-6 py-2.5 md:py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Data / Hora</th>
                <th className="px-4 md:px-6 py-2.5 md:py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Localização</th>
                <th className="px-4 md:px-6 py-2.5 md:py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Dispositivo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 md:px-6 py-2.5 md:py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-muted-foreground text-[10px] font-black">
                        {log.user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-xs font-bold text-muted-foreground">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-2.5 md:py-4">
                    <div className="flex items-center gap-2">
                      <UserCheck size={12} className="text-emerald-500" />
                      <span className="text-xs font-medium text-muted-foreground">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-2.5 md:py-4">
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{log.time}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-2.5 md:py-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{log.location}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-2.5 md:py-4">
                    <div className="flex items-center gap-2">
                      <Laptop size={12} className="text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground font-medium uppercase">{log.device}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-2">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Total de Visualizações</p>
          <h5 className="text-2xl font-black text-blue-700 font-display">1.240</h5>
          <p className="text-[10px] text-blue-600/60 font-medium">+12% em relação ao mês anterior</p>
        </div>
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 space-y-2">
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Exportações de Relatórios</p>
          <h5 className="text-2xl font-black text-emerald-700 font-display">48</h5>
          <p className="text-[10px] text-emerald-600/60 font-medium">Todos concluídos com sucesso</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl space-y-2">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Último Acesso</p>
          <h5 className="text-2xl font-black text-white font-display">Agora mesmo</h5>
          <p className="text-[10px] text-muted-foreground font-medium">Usuário: João Silva</p>
        </div>
      </div>
    </div>
  );
}
