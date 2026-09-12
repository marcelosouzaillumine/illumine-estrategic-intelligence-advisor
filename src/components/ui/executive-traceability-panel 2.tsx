import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { ExecutiveText } from './executive-typography';
import { IntelligenceTraceability } from '../../capabilities/financial/contracts/IntelligenceTraceability';
import { cn } from '../../lib/utils';

export interface ExecutiveTraceabilityPanelProps {
  traceability?: IntelligenceTraceability;
  className?: string;
}

export function ExecutiveTraceabilityPanel({ traceability, className }: ExecutiveTraceabilityPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!traceability) return null;

  const { evidenceLevel, metric, period, account, calculation, sourceType } = traceability;
  
  const evidenceTypeLabel = evidenceLevel === 'direct' ? 'Evidência Contábil' :
                            evidenceLevel === 'derived' ? 'Evidência Derivada' : 'Evidência Agregada';
                            
  const formattedSource = sourceType === 'balance_sheet' ? 'Balanço Patrimonial' :
                          sourceType === 'income_statement' ? 'DRE' : 'Fluxo de Caixa';

  return (
    <div className={cn("border-t border-border mt-4 pt-4", className)}>
      {/* CLOSED STATE */}
      <div className="flex items-center justify-between group">
        <div>
          <ExecutiveText variant="microLabel" className="uppercase tracking-wider font-semibold text-muted-foreground mb-1">
            {evidenceTypeLabel}
          </ExecutiveText>
          <div className="flex items-center gap-2 text-foreground">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <ExecutiveText variant="bodyStandard" className="font-medium">
              {metric?.name || account?.name} · {period.fiscalYear} · {metric?.formattedValue || account?.formattedValue}
            </ExecutiveText>
          </div>
        </div>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {isExpanded ? 'Ocultar origem' : 'Ver origem'}
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* EXPANDED STATE */}
      {isExpanded && (
        <div className="mt-4 p-4 bg-surface-container rounded-md border border-border animate-in fade-in slide-in-from-top-2 duration-200">
          <ExecutiveText variant="microLabel" className="uppercase tracking-wider font-semibold text-primary mb-3">
            Origem da Informação
          </ExecutiveText>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <ExecutiveText variant="microLabel" className="text-muted-foreground">Documento</ExecutiveText>
              <ExecutiveText variant="bodyStandard" className="font-medium">{formattedSource}</ExecutiveText>
            </div>
            <div>
              <ExecutiveText variant="microLabel" className="text-muted-foreground">Exercício</ExecutiveText>
              <ExecutiveText variant="bodyStandard" className="font-medium">{period.fiscalYear}</ExecutiveText>
            </div>
            {account && (
              <div>
                <ExecutiveText variant="microLabel" className="text-muted-foreground">Conta Contábil</ExecutiveText>
                <ExecutiveText variant="bodyStandard" className="font-medium">{account.name}</ExecutiveText>
              </div>
            )}
            {metric && (
              <div>
                <ExecutiveText variant="microLabel" className="text-muted-foreground">Métrica</ExecutiveText>
                <ExecutiveText variant="bodyStandard" className="font-medium">{metric.name}</ExecutiveText>
              </div>
            )}
            {metric && (
              <div>
                <ExecutiveText variant="microLabel" className="text-muted-foreground">Resultado</ExecutiveText>
                <ExecutiveText variant="bodyStandard" className="font-medium text-state-info-foreground">{metric.formattedValue}</ExecutiveText>
              </div>
            )}
            <div>
              <ExecutiveText variant="microLabel" className="text-muted-foreground">Nível da Evidência</ExecutiveText>
              <ExecutiveText variant="bodyStandard" className="font-medium capitalize">
                {evidenceLevel === 'direct' ? 'Direta' : evidenceLevel === 'derived' ? 'Derivada' : 'Agregada'}
              </ExecutiveText>
            </div>
          </div>

          {calculation && (
            <div className="mt-4 pt-4 border-t border-border">
              <ExecutiveText variant="microLabel" className="text-muted-foreground mb-2">Cálculo</ExecutiveText>
              <div className="bg-background border border-border rounded p-3 font-mono text-sm">
                <div className="text-foreground font-semibold mb-2">{calculation.formula}</div>
                <div className="flex flex-col gap-1 text-muted-foreground text-xs">
                  {calculation.inputs.map((input, idx) => (
                    <span key={idx}>• {input}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
