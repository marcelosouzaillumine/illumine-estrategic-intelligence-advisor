import React from 'react';
import { Building2 } from 'lucide-react';
import { HoldingRoleAnalysis } from '../../../../services/FiduciaryRuntimeAdapter';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { useLanguage } from '../../../../contexts/LanguageContext';

export function EntityRoleInterpretationTable({ roles }: { roles: HoldingRoleAnalysis[] }) {
  const { t } = useLanguage();
  if (!roles || roles.length === 0) return null;

  return (
    <ExecutiveSurface className="p-8 overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
          <Building2 size={20} className="text-primary" />
        </div>
        <div>
          <ExecutiveHeading as="h3" variant="submoduleTitle" className="uppercase tracking-widest">
            Interpretação por Entidade
          </ExecutiveHeading>
          <ExecutiveText variant="caption" className="text-muted-foreground uppercase font-bold tracking-widest mt-0.5">
            Papel Institucional Inferido
          </ExecutiveText>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 px-2">
                <ExecutiveText variant="caption" className="font-bold uppercase text-muted-foreground tracking-widest">
                  Entidade
                </ExecutiveText>
              </th>
              <th className="py-3 px-2">
                <ExecutiveText variant="caption" className="font-bold uppercase text-muted-foreground tracking-widest">
                  Papel Inferido
                </ExecutiveText>
              </th>
              <th className="py-3 px-2">
                <ExecutiveText variant="caption" className="font-bold uppercase text-muted-foreground tracking-widest">
                  Justificativa Runtime
                </ExecutiveText>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {roles.map((role, idx) => (
              <tr key={idx} className="hover:bg-muted/20 transition-colors">
                <td className="py-4 px-2">
                  <ExecutiveText variant="bodyStandard" className="font-bold">
                    {role.entityId}
                  </ExecutiveText>
                </td>
                <td className="py-4 px-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-muted border border-border shrink-0 whitespace-nowrap">
                    <ExecutiveText variant="caption" className="font-bold uppercase text-foreground whitespace-nowrap">
                      {t(`executive:role.${role.inferredRole}`, role.inferredRole.replace(/_/g, ' '))}
                    </ExecutiveText>
                  </span>
                </td>
                <td className="py-4 px-2 max-w-xs">
                  <ExecutiveText variant="bodyStandard" className="text-muted-foreground font-medium">
                    {role.justification}
                  </ExecutiveText>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ExecutiveSurface>
  );
}

