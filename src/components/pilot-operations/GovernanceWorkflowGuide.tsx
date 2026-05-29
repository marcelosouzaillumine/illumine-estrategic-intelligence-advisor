// src/components/pilot-operations/GovernanceWorkflowGuide.tsx

import React from 'react';
import { Compass, ShieldCheck, Scale, ZapOff } from 'lucide-react';

export const GovernanceWorkflowGuide: React.FC = () => {
  const principles = [
    {
      title: 'Limites de Simulação (Simulation Boundaries)',
      icon: ZapOff,
      description: 'O ambiente é 100% determinístico. Não é utilizada IA generativa, previsões especulativas ou interpretações caixa-preta. Todos os cenários dependem de nexos causais fiduciários provados.'
    },
    {
      title: 'Isolamento de Tenants (Strict Isolation)',
      icon: ShieldCheck,
      description: 'A linhagem de memória e os rastros de observabilidade são mantidos sob isolamento lógico estrito. Não existe contaminação cruzada de dados sob nenhuma condição operacional.'
    },
    {
      title: 'Garantia de Fail-Closed (Fail-Closed Governance)',
      icon: Scale,
      description: 'Se a integridade do runtime decair, o sistema suspende ações de escrita, desativa submissões de feedback e degrada a UI visivelmente para preservar a verdade contábil.'
    }
  ];

  return (
    <div className="card-premium p-8 space-y-6 relative overflow-hidden group hover:border-secondary/20 transition-all duration-300">
      <div className="flex items-center gap-3 border-b border-border/40 pb-4">
        <div className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center text-secondary">
          <Compass size={16} />
        </div>
        <div>
          <h3 className="text-base font-medium text-foreground tracking-tight">Manual de Diretrizes de Governança</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Normas e limites regulatórios aplicados ao piloto fiduciário.</p>
        </div>
      </div>

      <div className="space-y-4">
        {principles.map((pr, idx) => {
          const Icon = pr.icon;
          return (
            <div key={idx} className="p-4 bg-surface-container/40 border border-border/40 rounded-xl flex gap-3.5 hover:bg-surface-container/60 transition-all duration-300">
              <div className="p-2 bg-secondary/10 text-secondary rounded-lg shrink-0 h-fit">
                <Icon size={14} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-foreground">{pr.title}</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{pr.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
