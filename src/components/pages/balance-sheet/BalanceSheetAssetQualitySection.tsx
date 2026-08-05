import React from 'react';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
import { formatCurrency } from '../../../lib/utils';
import { ExecutiveIntelligenceOutput } from '../../../core/intelligence/contracts/ExecutiveIntelligenceOutput';
import { ExecutiveExposureCard } from '../../ui/executive-exposure-card';

export type BalanceSheetAssetQualitySectionProps = {
  bpSummary: any;
  diagnostics: ExecutiveIntelligenceOutput | null;
};

export const BalanceSheetAssetQualitySection = ({ bpSummary, diagnostics }: BalanceSheetAssetQualitySectionProps) => {
  if (!bpSummary || !diagnostics) return null;

  const { ativoTotal, caixaEquivalentes, estoques, clientes, imobilizado } = bpSummary;

  const getRatio = (value: number) => ativoTotal > 0 ? (value / ativoTotal) * 100 : 0;

  return (
    <div className="mb-10 animate-executive-fade relative">
      <ExecutiveHeading as="h4" variant="submoduleTitle" className="mb-4">Asset Quality Intelligence</ExecutiveHeading>

      <ExecutiveExposureCard
        title="Composição e Liquidez dos Ativos"
        subtitle="Mapeamento da velocidade de conversão e imobilização do capital."
        metrics={[
          {
            label: 'Disponibilidades / Ativo Total',
            percentage: getRatio(caixaEquivalentes),
            colorClass: 'bg-success'
          },
          {
            label: 'Clientes / Ativo Total',
            percentage: getRatio(clientes),
            colorClass: 'bg-insight'
          },
          {
            label: 'Estoques / Ativo Total',
            percentage: getRatio(estoques),
            colorClass: 'bg-warning'
          },
          {
            label: 'Imobilizado / Ativo Total',
            percentage: getRatio(imobilizado || 0),
            colorClass: 'bg-primary'
          }
        ]}
      />

      <div className="bg-surface-container/30 p-4 mt-6 rounded-xl border border-border/50">
        <ExecutiveText as="p" variant="bodyStandard" className="text-primary italic">
          "{((diagnostics.indicators.find(i => i.id === 'asset_liquidity')?.value || 0) * 100).toFixed(1)}% dos ativos apresentam elevada liquidez imediata (Caixa + Clientes), definindo o grau de realização rápida do ativo total."
        </ExecutiveText>
      </div>
    </div>
  );
};
