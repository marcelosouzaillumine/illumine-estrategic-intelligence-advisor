import { BalanceSheetWaterfallInputPoint, BalanceSheetCompositionInputPoint, BalanceSheetEvolutionInputPoint, BalanceSheetMajorChangeInput, BalanceSheetComparativeRowInput, BalanceSheetSummaryInput } from '../../../../components/pages/balance-sheet/types';
import { BalanceSheetFinancialAnalyticsViewModel, BalanceSheetHighlightTone, BalanceSheetStructuralSectionTone } from '../../../../components/pages/balance-sheet/view-models';

export class FinancialAnalyticsBuilder {
  public static build(
    waterfallData: BalanceSheetWaterfallInputPoint[],
    ativoData: BalanceSheetCompositionInputPoint[],
    passivoData: BalanceSheetCompositionInputPoint[],
    chartData: BalanceSheetEvolutionInputPoint[],
    majorChanges: BalanceSheetMajorChangeInput[],
    comparativeAnalysis: {
      ativo: BalanceSheetComparativeRowInput[];
      passivo: BalanceSheetComparativeRowInput[];
      patrimonioLiquido: BalanceSheetComparativeRowInput[];
    },
    bpSummary: BalanceSheetSummaryInput,
    translateLabel: (key: string) => string,
    formatCurrency: (value: number) => string
  ): BalanceSheetFinancialAnalyticsViewModel {
    
    const equityToAssetsPercentage = bpSummary.ativoTotal > 0 
      ? (bpSummary.patrimonioLiquido / bpSummary.ativoTotal) * 100 
      : 0;

    const evolutionHighlights = majorChanges.map(change => {
      let tone: BalanceSheetHighlightTone = 'neutral';
      if (change.ah > 0) tone = 'positive';
      else if (change.ah < 0) tone = 'negative';

      return {
        label: change.name || change.conta || '',
        valueFormatted: formatCurrency(change.val),
        horizontalAnalysis: change.ah,
        tone
      };
    });

    const mapStructuralSection = (
      data: BalanceSheetComparativeRowInput[], 
      titleKey: string, 
      tone: BalanceSheetStructuralSectionTone
    ) => {
      return {
        titleLabel: translateLabel(titleKey),
        tone,
        rows: data.map(row => ({
          label: translateLabel((row.name || row.conta) === 'Patrimônio Líquido' ? 'Patrimônio' : (row.name || row.conta || '')),
          valueFormatted: formatCurrency(row.val),
          verticalAnalysis: row.av,
          horizontalAnalysis: row.ah,
          level: row.level
        })).filter(r => r.label !== '')
      };
    };

    const hasStructuralData = 
      comparativeAnalysis.ativo.length > 0 || 
      comparativeAnalysis.passivo.length > 0 || 
      comparativeAnalysis.patrimonioLiquido.length > 0;

    return {
      waterfall: {
        data: waterfallData.map(d => ({ name: d.name, value: d.value, variant: d.variant })),
        equityToAssetsPercentage
      },
      composition: {
        assetsData: ativoData.map(d => ({ name: d.name, value: d.value, fill: d.fill })),
        liabilitiesData: passivoData.map(d => ({ name: d.name, value: d.value, fill: d.fill }))
      },
      evolution: {
        hasEnoughData: chartData.length >= 2,
        chartData: chartData.map(d => ({
          year: d.year,
          ativo: d.ativo,
          passivo: d.passivo,
          patrimonioLiquido: d.pl
        })),
        highlights: evolutionHighlights
      },
      structuralTables: {
        isEmpty: !hasStructuralData,
        sections: hasStructuralData ? [
          mapStructuralSection(comparativeAnalysis.ativo, 'Ativo', 'assets'),
          mapStructuralSection(comparativeAnalysis.passivo, 'Passivo', 'liabilities'),
          mapStructuralSection(comparativeAnalysis.patrimonioLiquido, 'Patrimônio Líquido', 'equity')
        ] : []
      }
    };
  }
}
