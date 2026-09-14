import React from 'react';
import { AlertOctagon } from 'lucide-react';
import { RuntimeViolation } from '../../../../runtime/types';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { useLanguage } from '../../../../contexts/LanguageContext';

export function GovernanceViolationsPanel({ violations }: { violations: RuntimeViolation[] }) {
  const { t } = useLanguage();
  if (!violations || violations.length === 0) return null;

  return (
    <ExecutiveSurface variant="critical" className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertOctagon size={16} className="text-critical shrink-0" />
        <ExecutiveHeading as="h3" variant="submoduleTitle" className="uppercase tracking-widest text-critical">
          Violações de Governança
        </ExecutiveHeading>
      </div>
      <div className="space-y-3">
        {violations.map((v, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-critical-soft border border-critical/20">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-critical/10 border border-critical/20">
                <ExecutiveText variant="caption" className="font-bold uppercase text-critical">
                  {t(`executive:severity.${v.severity}`, v.severity)}
                </ExecutiveText>
              </span>
              <ExecutiveText variant="bodyStandard" className="font-bold text-foreground">
                {v.rule}
              </ExecutiveText>
            </div>
            <ExecutiveText variant="bodyStandard" className="text-critical font-medium">
              {v.message}
            </ExecutiveText>
          </div>
        ))}
      </div>
    </ExecutiveSurface>
  );
}

