import React from 'react';
import { ExecutiveAccordion } from '../../ui/executive-accordion';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveHeading } from '../../ui/executive-heading';

export const GovernanceRolesPanel: React.FC = () => {
  const roles = [
    { title: 'Chief Executive Officer (CEO)', category: 'Direção', desc: 'Responsável pela visão estratégica global e execução.' },
    { title: 'Chief Financial Officer (CFO)', category: 'Direção', desc: 'Guardião da saúde financeira, compliance e auditoria.' },
    { title: 'Conselheiro Independente', category: 'Conselho', desc: 'Visão externa imparcial, alinhada com os acionistas.' }
  ];

  return (
    <ExecutiveSurface className="p-6 space-y-6">
      <ExecutiveHeading as="h3" className="text-h3">
        Papéis Executivos & Mapeamento de Competências
      </ExecutiveHeading>

      {roles.map((role) => (
        <ExecutiveAccordion key={role.title} title={role.title} subtitle={`Categoria: ${role.category}`}>
          <div className="p-4 text-sm text-executive-secondary space-y-2">
            <p>{role.desc}</p>

            <div className="flex gap-2 text-xs font-semibold text-primary pt-2">
              <span>Competências Essenciais: Visão Sistêmica, Liderança, Integridade</span>
            </div>
          </div>
        </ExecutiveAccordion>
      ))}
    </ExecutiveSurface>
  );
};
