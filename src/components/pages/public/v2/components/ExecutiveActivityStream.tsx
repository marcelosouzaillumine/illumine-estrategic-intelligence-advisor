import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle2, TrendingUp, ShieldAlert, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

type StreamItem = {
  id: string;
  type: 'alert' | 'insight' | 'decision' | 'system';
  title: string;
  domain: string;
  time: string;
  icon: React.ElementType;
};

const INITIAL_STREAM: StreamItem[] = [
  { id: '1', type: 'system', title: 'Simulação Sistêmica Concluída: Cenário Expansão Q3', domain: 'Executive Engine™', time: 'Agora', icon: Cpu },
  { id: '2', type: 'alert', title: 'Risco de Liquidez: Projeção de asfixia em 120 dias.', domain: 'Financial Intelligence™', time: '2m atrás', icon: TrendingUp },
  { id: '3', type: 'insight', title: 'Silo Detectado: Fricção entre Vendas e Operações afeta Margem.', domain: 'Operational Intelligence™', time: '15m atrás', icon: Activity },
  { id: '4', type: 'decision', title: 'Aprovação Fiduciária Requerida: Ajuste de Capex', domain: 'Governance Intelligence™', time: '1h atrás', icon: ShieldAlert },
];

const NEW_ITEMS: StreamItem[] = [
  { id: '5', type: 'insight', title: 'Análise de Sensibilidade: Aumento de 5% no custo de capital.', domain: 'Risk Intelligence™', time: 'Agora', icon: AlertTriangle },
  { id: '6', type: 'system', title: 'Atualização do Gêmeo Digital: Novos dados do ERP integrados.', domain: 'Intelligence Foundation™', time: 'Agora', icon: CheckCircle2 },
];

export function ExecutiveActivityStream({ className }: { className?: string }) {
  const [stream, setStream] = useState<StreamItem[]>(INITIAL_STREAM);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // Simulate real-time stream updates
    const interval = setInterval(() => {
      setIsAdding(true);
      setTimeout(() => {
        setStream((prev) => {
          const newItem = NEW_ITEMS[Math.floor(Math.random() * NEW_ITEMS.length)];
          const newStream = [{ ...newItem, id: Math.random().toString(), time: 'Agora' }, ...prev.slice(0, 3)];
          return newStream;
        });
        setIsAdding(false);
      }, 500); // Wait for fade-out before updating
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("w-full max-w-md bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl", className)}>
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-white font-semibold text-sm uppercase tracking-widest flex items-center gap-2">
          <Activity size={16} className="text-primary animate-pulse" />
          Live Platform Feed
        </h4>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
      </div>

      <div className="space-y-4 overflow-hidden relative min-h-[320px]">
        {stream.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <div 
              key={item.id} 
              className={cn(
                "p-4 rounded-xl border transition-all duration-500",
                item.type === 'alert' ? "bg-amber-500/10 border-amber-500/20" :
                item.type === 'decision' ? "bg-red-500/10 border-red-500/20" :
                item.type === 'system' ? "bg-primary/10 border-primary/20" :
                "bg-white/5 border-white/10",
                index === 0 && isAdding ? "opacity-0 translate-y-[-20px]" : "opacity-100 translate-y-0"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-2 rounded-lg shrink-0",
                  item.type === 'alert' ? "bg-amber-500/20 text-amber-400" :
                  item.type === 'decision' ? "bg-red-500/20 text-red-400" :
                  item.type === 'system' ? "bg-primary/20 text-primary" :
                  "bg-white/10 text-white"
                )}>
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white leading-snug mb-1">{item.title}</p>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-400">{item.domain}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-primary">{item.time}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/* Fading overlay at the bottom to give infinite scroll effect */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
