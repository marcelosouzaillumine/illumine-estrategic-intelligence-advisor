// @ts-nocheck
import React from 'react';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
import { BalanceSheetDiagnostics } from '../../../core/runtime/executive-consolidation/BalanceSheetDiagnosticEngine';
import { AlertTriangle, AlertCircle, ShieldAlert } from 'lucide-react';

export type BalanceSheetAccountingRiskSectionProps = {
  diagnostics: BalanceSheetDiagnostics | null;
};

export const BalanceSheetAccountingRiskSection = ({ diagnostics }: BalanceSheetAccountingRiskSectionProps) => {
  if (!diagnostics || !diagnostics.risks || diagnostics.risks.length === 0) {
    return (
      <div className="mb-10 animate-executive-fade relative">
        <ExecutiveHeading as="h4" variant="submoduleTitle" className="mb-4">Accounting Risk Intelligence</ExecutiveHeading>
        <div className="bg-surface p-6 rounded-xl border border-border flex items-center justify-center">
          <ExecutiveText as="p" variant="bodyStandard" className="text-secondary text-center">
            Nenhum red flag patrimonial detectado neste exercício.
          </ExecutiveText>
        </div>
      </div>
    );
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'CRITICAL': return <ShieldAlert className="w-6 h-6 text-critical" />;
      case 'WARNING': return <AlertTriangle className="w-6 h-6 text-warning" />;
      case 'ATTENTION': return <AlertCircle className="w-6 h-6 text-primary" />;
      default: return <AlertCircle className="w-6 h-6 text-secondary" />;
    }
  };

  const getRiskBorder = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'border-critical bg-critical/5';
      case 'WARNING': return 'border-warning bg-warning/5';
      case 'ATTENTION': return 'border-primary bg-primary/5';
      default: return 'border-border bg-surface';
    }
  };

  return (
    <div className="mb-10 animate-executive-fade relative">
      <ExecutiveHeading as="h4" variant="submoduleTitle" className="mb-4">Accounting Risk Intelligence (Red Flags)</ExecutiveHeading>

      <div className="space-y-4">
        {diagnostics.risks.map((risk, index) => (
          <div key={index} className={`p-4 rounded-xl border ${getRiskBorder(risk.level)} flex flex-row items-start gap-4`}>
            <div className="mt-1 flex-shrink-0">
              {getRiskIcon(risk.level)}
            </div>
            <div className="flex flex-col">
              <ExecutiveText as="span" variant="label" className="text-foreground font-semibold mb-1">
                {risk.category} • {risk.metric} ({(risk.value * 100).toFixed(1)}%)
              </ExecutiveText>
              <ExecutiveText as="p" variant="bodyStandard" className="text-secondary">
                {risk.message}
              </ExecutiveText>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
