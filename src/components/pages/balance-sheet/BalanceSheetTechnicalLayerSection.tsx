import React from 'react';
import { TechnicalIndicatorViewModel } from '../../../types/executive/BalanceSheetExecutiveViewModel';
import { ExecutiveTechnicalLayer } from '../../ui/executive-technical-layer';
import { ExecutiveText } from '../../ui/executive-typography';
import { ExecutiveEmptyState } from '../../ui/executive-empty-state';

export function normalizeTechnicalLayer(viewModel: any) {
  if (Array.isArray(viewModel)) return viewModel;
  if (viewModel && Array.isArray(viewModel.families)) return viewModel.families;
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

  if (families.length === 0) {
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
                    const hasData = !isMissing(ind.value) && ind.value !== '0.00' && ind.value !== '0,00';
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
                        <td className="py-3 px-4 align-top">
                          <ExecutiveText variant="bodyStandard">{ind.value}</ExecutiveText>
                        </td>
                        <td className="py-3 px-4 align-top">
                          {hasData && ind.classificationLabel ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-surface-high text-executive-secondary border border-border">
                              <ExecutiveText as="span" variant="microLabel">{ind.classificationLabel}</ExecutiveText>
                            </span>
                          ) : (
                            <ExecutiveText as="span" variant="microLabel" className="text-executive-muted">Não aplicável</ExecutiveText>
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
