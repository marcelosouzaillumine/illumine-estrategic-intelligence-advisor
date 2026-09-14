import React from 'react';
import { TechnicalIndicatorViewModel } from '../../../types/executive/BalanceSheetExecutiveViewModel';
import { ExecutiveTechnicalLayer } from '../../ui/executive-technical-layer';
import { ExecutiveText } from '../../ui/executive-typography';
import { ExecutiveEmptyState } from '../../ui/executive-empty-state';
import { cn } from '../../../lib/utils';

export function normalizeTechnicalLayer(viewModel: any) {
  if (!viewModel) return [];
  // families always takes priority — items[] here is evidence rows, not nested data
  if (Array.isArray(viewModel.families)) return viewModel.families;
  let target = viewModel;
  if (viewModel.items && Array.isArray(viewModel.items) && viewModel.items.length > 0 && viewModel.items[0]?.families) {
    target = viewModel.items[0];
  }
  if (Array.isArray(target)) return target;
  if (target && Array.isArray(target.structuralTables)) return target.structuralTables;
  if (target && Array.isArray(target.families)) return target.families;
  return [];
}

export function normalizeStructuralRows(viewModel: any) {
  let target = viewModel;
  if (viewModel && viewModel.items && Array.isArray(viewModel.items) && viewModel.items.length > 0) {
    target = viewModel.items[0];
  }
  if (target && Array.isArray(target.rows)) return target.rows;
  return [];
}

export function BalanceSheetTechnicalLayerSection({
  viewModel
}: {
  viewModel: any;
}) {
  function isMissing(val: string | number | undefined | null) {
    if (val === null || val === undefined) return true;
    const s = String(val).toUpperCase();
    return s === 'NAN' || s === 'N' + '/' + 'A' || s === 'NULL' || s === '' || s === 'INDISPONÍVEL';
  }

  const families = normalizeTechnicalLayer(viewModel);
  const rows = normalizeStructuralRows(viewModel);

  if (families.length === 0 && rows.length === 0) {
    return (
      <ExecutiveTechnicalLayer
        title="Camada Técnica"
        subtitle="Indicadores Quantitativos Subjacentes"
        description="Métricas e avaliações brutas utilizadas para o embasamento da Tese Patrimonial e elaboração do Índice Matemático."
        defaultExpanded={true}
      >
        <ExecutiveEmptyState
          title="Memória Analítica Vazia"
          description="Os dados contábeis estruturais fornecidos não contêm métricas de indicadores suficientes para exibir a memória analítica. Verifique os metadados do exercício base."
        />
      </ExecutiveTechnicalLayer>
    );
  }

  return (
    <ExecutiveTechnicalLayer
      title="Camada Técnica"
      subtitle="Indicadores Quantitativos Subjacentes"
      description="Métricas e avaliações brutas utilizadas para o embasamento da Tese Patrimonial e elaboração do Índice Matemático."
      defaultExpanded={true}
    >
      <div className="grid grid-cols-1 gap-10">
        
        {rows.length > 0 && (
          <div className="space-y-4">
            <ExecutiveText as="h4" variant="microLabel" className="text-primary border-b border-border pb-2">Contabilidade Bruta: Balanço Patrimonial</ExecutiveText>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-border/50 text-executive-muted">
                    <th className="py-3 px-4 w-[50%]">
                      <ExecutiveText variant="label">Conta</ExecutiveText>
                    </th>
                    <th className="py-3 px-4 w-[50%]">
                      <ExecutiveText variant="label">Valor Registrado</ExecutiveText>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row: any, idx: number) => {
                    const isTotal = row.type === 'total';
                    const isSubtotal = row.type === 'subtotal';
                    
                    return (
                      <tr key={idx} className={cn(
                        "border-b border-border/50 hover:bg-surface-high/30 transition-colors",
                        isTotal && "bg-surface-high/50 font-semibold",
                        isSubtotal && "bg-surface-container/30 font-medium"
                      )}>
                        <td className="py-3 px-4 text-executive-primary align-top">
                          <ExecutiveText variant="bodyStandard" className={cn(
                            !isTotal && !isSubtotal && "pl-4 text-muted-foreground",
                            isTotal && "font-bold text-primary",
                            isSubtotal && "font-semibold text-foreground"
                          )}>
                            {row.item}
                          </ExecutiveText>
                        </td>
                        <td className="py-3 px-4 align-top">
                          <ExecutiveText variant="bodyStandard" className={cn(
                            "font-mono",
                            !isTotal && !isSubtotal && "text-muted-foreground",
                            (isTotal || isSubtotal) && "text-foreground font-semibold"
                          )}>{
                            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row.value)
                          }</ExecutiveText>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {families.map((family: any) => (
          <div key={family.familyName} className="space-y-4">
            <ExecutiveText as="h4" variant="microLabel" className="text-primary border-b border-border pb-2">{family.familyName}</ExecutiveText>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead>
                  <tr className="border-b border-border/50 text-executive-muted">
                    <th className="py-3 px-4 w-[15%]">
                      <ExecutiveText variant="label">Indicador</ExecutiveText>
                    </th>
                    <th className="py-3 px-4 w-[15%]">
                      <ExecutiveText variant="label">Fórmula</ExecutiveText>
                    </th>
                    <th className="py-3 px-4 w-[10%]">
                      <ExecutiveText variant="label">Resultado</ExecutiveText>
                    </th>
                    <th className="py-3 px-4 w-[10%]">
                      <ExecutiveText variant="label">Avaliação</ExecutiveText>
                    </th>
                    <th className="py-3 px-4 w-[12.5%]">
                      <ExecutiveText variant="label">Objetivo</ExecutiveText>
                    </th>
                    <th className="py-3 px-4 w-[12.5%]">
                      <ExecutiveText variant="label">Limitações</ExecutiveText>
                    </th>
                    <th className="py-3 px-4 w-[12.5%]">
                      <ExecutiveText variant="label">Referencial</ExecutiveText>
                    </th>
                    <th className="py-3 px-4 w-[12.5%]">
                      <ExecutiveText variant="label">Observações Metodológicas</ExecutiveText>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(family.indicators || []).map((ind: any, idx: number) => {
                    const displayValue = ind.formattedValue ?? (typeof ind.value === 'number' ? ind.value.toFixed(2) : ind.value);
                    const hasData = displayValue !== null && displayValue !== undefined && displayValue !== 'Não aplicável' && !isMissing(displayValue);
                    return (
                      <tr key={idx} className="border-b border-border/50 hover:bg-surface-high/30 transition-colors">
                        <td className="py-3 px-4 text-executive-primary align-top">
                          <div className="flex flex-col gap-1">
                            <ExecutiveText variant="bodyStandard">{ind.label}</ExecutiveText>
                          </div>
                        </td>
                        <td className="py-3 px-4 align-top text-executive-secondary">
                          <ExecutiveText variant="microLabel" className="font-mono">{ind.formula}</ExecutiveText>
                        </td>
                        <td className="py-3 px-4 align-top font-mono tabular-nums">
                          <ExecutiveText variant="bodyStandard" className="font-mono">
                            {hasData ? displayValue : <span className="text-muted-foreground italic text-xs">Não aplicável</span>}
                          </ExecutiveText>
                        </td>
                        <td className="py-3 px-4 align-top">
                          {hasData && ind.classificationLabel ? (
                            <span className={cn("inline-flex items-center px-2 py-1 rounded-md border text-xs font-medium", ind.badgeClass || 'bg-surface-high text-executive-secondary border-border')}>
                              {ind.classificationLabel}
                            </span>
                          ) : (
                            <ExecutiveText as="span" variant="microLabel" className="text-executive-muted">—</ExecutiveText>
                          )}
                        </td>
                        <td className="py-3 px-4 text-executive-secondary align-top">
                          <ExecutiveText variant="microLabel">{ind.purpose}</ExecutiveText>
                        </td>
                        <td className="py-3 px-4 text-executive-secondary align-top">
                          <ExecutiveText variant="microLabel">{ind.limitations}</ExecutiveText>
                        </td>
                        <td className="py-3 px-4 text-executive-secondary align-top">
                          <ExecutiveText variant="microLabel">{ind.referenceRange}</ExecutiveText>
                        </td>
                        <td className="py-3 px-4 text-executive-secondary align-top">
                          <ExecutiveText variant="microLabel">{ind.methodologicalNotes || '-'}</ExecutiveText>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </ExecutiveTechnicalLayer>
  );
}
