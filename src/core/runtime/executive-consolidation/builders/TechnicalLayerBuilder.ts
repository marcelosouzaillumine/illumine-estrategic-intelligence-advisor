import { BalanceSheetExecutiveFacts } from '../BalanceSheetExecutiveFactsBuilder';
import { ExecutiveSemanticRegistry } from '../ExecutiveSemanticRegistry';
import { DisplayValueFormatter } from '../../executive-presentation/DisplayValueFormatter';
import { BalanceSheetTechnicalIndicatorCanonicalRegistry } from '../registries/BalanceSheetTechnicalIndicatorCanonicalRegistry';

export class TechnicalLayerBuilder {
  public static build(
    indicators: any[],
    resolveLabel: (key: string) => string,
    decisionPanels?: Record<string, any>,
    facts?: BalanceSheetExecutiveFacts,
    scenario?: string
  ): any[] {
    const families: any[] = [];
    
    const canonicalIndicators = BalanceSheetTechnicalIndicatorCanonicalRegistry.getIndicators();

    const indMap = new Map<string, any>();
    for (const ind of indicators) {
      if (ind && ind.metricName) {
        indMap.set(ind.metricName, ind);
      }
    }

    const formatValue = (val: any, type: string) => {
      if (val === undefined || val === null || val === 'INSUFFICIENT_DATA' || Number.isNaN(val)) return 'INSUFFICIENT_DATA';
      if (typeof val === 'number') {
        if (type === 'percentage') return DisplayValueFormatter.formatPercentage(val * 100, 1);
        if (type === 'currency') return DisplayValueFormatter.formatCurrency(val);
        if (type === 'ratio') return DisplayValueFormatter.formatRatio(val, 2);
        return DisplayValueFormatter.formatNumber(val, 2);
      }
      return String(val);
    };

    const getFactValue = (sourceFactKey: string, factsObj?: BalanceSheetExecutiveFacts) => {
      if (!factsObj) return 'INSUFFICIENT_DATA';
      const val = (factsObj as any)[sourceFactKey];
      return val !== undefined ? val : 'INSUFFICIENT_DATA';
    };

    const familyMap = new Map<string, any[]>();
    
    for (const canonical of canonicalIndicators) {
      let ind = indMap.get(canonical.label);
      if (!ind) ind = indMap.get(canonical.canonicalKey);
      
      let rawVal: any = 'INSUFFICIENT_DATA';
      
      if (ind && ind.value !== 'INSUFFICIENT_DATA' && ind.value !== null && ind.value !== undefined) {
        rawVal = typeof ind.value === 'string' && !isNaN(Number(ind.value)) ? Number(ind.value) : ind.value;
      } else {
        const factVal = getFactValue(canonical.sourceFactKey, facts);
        if (factVal !== 'INSUFFICIENT_DATA' && factVal !== undefined && factVal !== null && !Number.isNaN(factVal)) {
          rawVal = factVal;
        }
      }
      
      const formattedValue = formatValue(rawVal, canonical.valueType);

      // Block raw labels from backend
      let classification = ind?.classification || '';
      if (['Saudável', 'Neutro', 'Excelente'].includes(classification)) {
        classification = ''; // Will be overridden by sovereign panel or default
      }

      const metric = {
        metricName: canonical.label,
        family: canonical.family,
        value: formattedValue,
        rawVal: rawVal,
        classification: classification,
        healthStatus: ind?.healthStatus || 'NEUTRAL',
        confidence: ind?.confidence || 100,
        sovereignPanelKey: canonical.sovereignPanelKey
      };

      if (!familyMap.has(canonical.family)) {
        familyMap.set(canonical.family, []);
      }
      familyMap.get(canonical.family)!.push(metric);
    }

    for (const [family, inds] of familyMap.entries()) {
      const metrics = inds.map(ind => {
        let tone = ind.healthStatus === 'EXCELLENT' || ind.healthStatus === 'HEALTHY' ? 'success' : 
                   ind.healthStatus === 'CRITICAL' ? 'critical' : 'warning';
        
        let classificationLabel = resolveLabel(ind.classification || 'Avaliação técnica padronizada');
        let purpose = ExecutiveSemanticRegistry.getObservation(ind.metricName, null);
        let sourceRule = 'Canonical Mapping';

        if (ind.value === 'INSUFFICIENT_DATA') {
          classificationLabel = 'Não aplicável ao cenário atual';
          tone = 'neutral';
          purpose = 'Sem evidência quantitativa primária disponível para emissão de julgamento técnico.';
          sourceRule = 'SSOT Policy Layer';
        } else if (decisionPanels && facts) {
          const applyPanelStatus = (panel: any) => {
            if (panel) {
              classificationLabel = panel.statusLabel;
              if (panel.statusBadgeVariant === 'success') tone = 'success';
              else if (panel.statusBadgeVariant === 'warning') tone = 'warning';
              else if (panel.statusBadgeVariant === 'critical') tone = 'critical';
              purpose = ExecutiveSemanticRegistry.getObservation(ind.metricName, classificationLabel);
              sourceRule = 'SSOT Policy Layer';
            }
          };

          if (ind.metricName === 'Composição do Endividamento') {
            const shortTermDebtRatio = typeof ind.rawVal === 'number' && !isNaN(ind.rawVal) ? ind.rawVal * 100 : 0;
            const currentLiabilitiesRatio = facts.totalAssets > 0 ? (facts.currentLiabilities / facts.totalAssets) * 100 : 0;
            
            if (
              shortTermDebtRatio > 50 &&
              facts.debtRatio < 15 &&
              (facts.financialAutonomy * 100) > 70 &&
              currentLiabilitiesRatio < 15 &&
              facts.liquidityCurrent > 3 &&
              scenario !== 'CRITICAL_LIQUIDITY_STRESS'
            ) {
              classificationLabel = 'Baixo impacto devido à reduzida alavancagem';
              tone = 'success';
              purpose = ExecutiveSemanticRegistry.getObservation(ind.metricName, classificationLabel);
              sourceRule = 'SSOT Policy Layer';
            } else {
              applyPanelStatus(decisionPanels[ind.sovereignPanelKey]);
            }
          } else {
            applyPanelStatus(decisionPanels[ind.sovereignPanelKey]);
          }
        }

        // Anti-Inheritance Lock for Critical Scenarios by Family
        if (scenario === 'CRITICAL_LIQUIDITY_STRESS' && ind.value !== 'INSUFFICIENT_DATA') {
          if (['Liquidez Excedente', 'Estrutura Patrimonial Muito Sólida', 'Qualidade Estrutural Preservada', 'Atenção à Eficiência da Alocação', 'Saudável', 'Neutro'].includes(classificationLabel)) {
            tone = 'critical';
            purpose = 'Avaliação severamente degradada pelo risco agudo de insolvência de curto prazo.';
            
            if (family === 'Liquidez') classificationLabel = 'Liquidez Crítica';
            else if (family === 'Estrutura de Capital') classificationLabel = 'Estrutura sob Pressão';
            else if (family === 'Capital de Giro') classificationLabel = 'Cobertura de Giro Frágil';
            else if (family === 'Imobilização / Qualidade Estrutural') classificationLabel = 'Qualidade Estrutural Vulnerável';
            else if (family === 'Proteção / Reservas') classificationLabel = 'Proteção Patrimonial sob Stress';
            else if (family === 'Eficiência / Produtividade') classificationLabel = 'Eficiência Suspensa por Prioridade de Caixa';
            else classificationLabel = 'Limitação Crítica';
          }
        }
        
        // Methodological Note for Symbolic Capital
        let finalMethodologicalNotes = '-';
        if (ind.metricName === 'Qualidade do Patrimônio Líquido' && ind.value === 'LIMITED_EVIDENCE') {
          classificationLabel = 'Sólida com Ressalva';
          purpose = 'Análise técnica restrita devido à materialidade insuficiente do capital social em relação ao patrimônio líquido.';
          finalMethodologicalNotes = 'Patrimônio líquido predominantemente formado por lucros acumulados; evidência positiva de retenção de resultados, com ressalva metodológica por capital social simbólico.';
        }
        
        const translateConfidence = (c: any) => c === 'HIGH' || c === 100 ? 'Alta' : c === 'MEDIUM' ? 'Média' : c === 'LOW' ? 'Baixa' : c;

        const resolvedName = resolveLabel(ind.metricName);
        const registryMeta = (BalanceSheetTechnicalIndicatorCanonicalRegistry as any)[resolvedName] || (BalanceSheetTechnicalIndicatorCanonicalRegistry as any)[ind.metricName];

        return {
          familyName: family,
          label: resolvedName,
          formula: registryMeta?.formula || 'Cálculo analítico derivado do balanço patrimonial',
          value: ind.value === 'INSUFFICIENT_DATA' ? '—' : ind.value,
          classificationLabel,
          purpose: registryMeta?.purpose || purpose,
          limitations: registryMeta?.limitations || '',
          referenceRange: registryMeta?.referenceRange || '',
          methodologicalNotes: finalMethodologicalNotes,
          origin: {
            sourceEngine: 'TechnicalLayerBuilder',
            sourceRule,
            confidence: translateConfidence(ind.confidence),
            lastValidatedAt: new Date().toISOString()
          }
        };
      });

      families.push({
        familyName: family,
        indicators: metrics
      });
    }

    return families;
  }
}
