import React from 'react';
import { cn } from '../lib/utils';

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-10">
      <h2 className="text-4xl font-display font-extrabold text-slate-900 tracking-tighter leading-none mb-3">{title}</h2>
      <div className="h-1 w-16 bg-secondary rounded-full"></div>
      <p className="text-sm text-slate-500 mt-6 max-w-2xl font-medium leading-relaxed">{description}</p>
    </div>
  );
}

export function Semaphore({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    'Verde': 'verde',
    'Amarelo': 'amarelo',
    'Vermelho': 'vermelho'
  };
  return <span className={cn("semaforo", colorMap[status] || 'verde')} />;
}

export function StatusBadge({ status }: { status: string }) {
  const classMap: Record<string, string> = {
    'Verde': 'badge-verde',
    'Amarelo': 'badge-amarelo',
    'Vermelho': 'badge-vermelho',
    'Validado': 'badge-verde',
    'Ativo': 'badge-verde',
    'Implantação': 'badge-amarelo',
    'Viável': 'badge-verde',
    'Ativa': 'badge-verde',
    'Inativa': 'badge-vermelho'
  };
  return (
    <span className={cn("badge font-sans", classMap[status] || 'badge-verde')}>
      {status}
    </span>
  );
}

export function SectionHeader({ icon: Icon, title, subtitle, tone = 'blue' }: any) {
    const tones: any = {
        blue: 'bg-blue-50 text-blue-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
        rose: 'bg-rose-50 text-rose-600',
        primary: 'bg-slate-100 text-slate-900'
    };

    return (
        <div className="flex items-center gap-4 mb-6">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", tones[tone] || tones.blue)}>
                <Icon size={24} />
            </div>
            <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{title}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{subtitle}</p>
            </div>
        </div>
    );
}
