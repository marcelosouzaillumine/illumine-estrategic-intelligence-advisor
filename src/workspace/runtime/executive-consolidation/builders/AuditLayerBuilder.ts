import { BalanceSheetStructuralRestrictionsInput, BalanceSheetGovernanceConsistencyInput } from '../../../../components/pages/balance-sheet/types';
import { BalanceSheetAuditLayerViewModel, BalanceSheetAuditStructuralRestrictionsViewModel, BalanceSheetAuditOverrideViewModel, BalanceSheetAuditConsistencyViewModel, BalanceSheetAuditConsistencyIssueViewModel, BalanceSheetCriticalOffenderViewModel } from '../../../../components/pages/balance-sheet/view-models';

export class AuditLayerBuilder {
  public static build(
    structuralRestrictions: BalanceSheetStructuralRestrictionsInput | undefined,
    governanceConsistency: BalanceSheetGovernanceConsistencyInput | undefined,
    globalScore: number | undefined,
    criticalOffenders: BalanceSheetCriticalOffenderViewModel[] | undefined,
    resolveLabel: (key: string) => string
  ): BalanceSheetAuditLayerViewModel {
    const normalizeSeverity = (severity: string): string => {
      const upper = severity.toUpperCase();
      if (['NENHUM', 'NONE'].includes(upper)) return 'Sem restrições relevantes';
      if (['HIGH', 'ALTO'].includes(upper)) return 'Elevada';
      if (['MEDIUM', 'MÉDIO'].includes(upper)) return 'Moderada';
      if (['LOW', 'BAIXO'].includes(upper)) return 'Baixa';
      if (upper === 'MINOR_WARNINGS') return 'Pequenas ressalvas identificadas';
      if (upper === 'RESILIENT') return 'Resiliente';
      if (upper === 'NEUTRAL') return 'Neutro';
      return resolveLabel(severity);
    };

    const normalizeFinalResult = (result: string): string => {
      const upper = result.toUpperCase();
      if (['NENHUM', 'NONE'].includes(upper)) return 'Classificação preservada';
      return resolveLabel(result);
    };

    let restrictionsViewModel: BalanceSheetAuditStructuralRestrictionsViewModel | undefined;
    
    if (structuralRestrictions) {
      const hardcodedOverrides = [
        'Liquidity Fragility Override', 
        'Treasury Stress Override', 
        'Short-Term Debt Concentration Override', 
        'Capital Dependency Override', 
        'Earnings Quality Override'
      ];

      const overrides: BalanceSheetAuditOverrideViewModel[] = [];
      
      hardcodedOverrides.forEach(overrideName => {
        const activeOverride = structuralRestrictions.appliedOverrides?.find(o => o.name === overrideName);
        if (activeOverride) {
          overrides.push({
            overrideNameLabel: resolveLabel(overrideName),
            severityLabel: normalizeSeverity(activeOverride.severity)
          });
        }
      });

      restrictionsViewModel = {
        overrides,
        originalClassificationLabel: resolveLabel(structuralRestrictions.originalClassification),
        classificationCeilingLabel: normalizeFinalResult(structuralRestrictions.classificationCeiling || 'NENHUM')
      };
    }

    let consistencyViewModel: BalanceSheetAuditConsistencyViewModel | undefined;

    if (governanceConsistency) {
      let statusTone: 'success' | 'critical' | 'warning' | 'attention' | 'neutral' = 'neutral';
      if (governanceConsistency.consistencyStatus === 'CONSISTENT' || governanceConsistency.consistencyStatus === 'HEALTHY') {
        statusTone = 'success';
      } else if (governanceConsistency.consistencyStatus === 'FAIL_CLOSED' || governanceConsistency.consistencyStatus === 'CRITICAL') {
        statusTone = 'critical';
      } else if (governanceConsistency.consistencyStatus === 'ATTENTION' || governanceConsistency.consistencyStatus === 'DISCLOSURE') {
        statusTone = 'attention';
      } else if (governanceConsistency.consistencyStatus === 'WARNING') {
        statusTone = 'warning';
      }

      const issues: BalanceSheetAuditConsistencyIssueViewModel[] = [];

      governanceConsistency.detectedIssues?.forEach(issue => {
        issues.push({ 
          type: 'critical', 
          typeLabel: 'Falha Crítica', 
          message: issue,
          severity: 'critical',
          severityLabel: normalizeSeverity('CRITICAL')
        });
      });
      
      governanceConsistency.warnings?.forEach(warning => {
        issues.push({ 
          type: 'warning', 
          typeLabel: 'Alerta', 
          message: warning,
          severity: 'warning',
          severityLabel: normalizeSeverity('HIGH')
        });
      });

      governanceConsistency.forcedDisclosures?.forEach(disclosure => {
        issues.push({ 
          type: 'disclosure', 
          typeLabel: 'Comunicação Prudencial Obrigatória', 
          message: disclosure,
          severity: 'attention',
          severityLabel: normalizeSeverity('MEDIUM')
        });
      });

      consistencyViewModel = {
        statusLabel: normalizeSeverity(governanceConsistency.consistencyStatus),
        statusTone,
        hasIssues: issues.length > 0,
        issues
      };
    }

    return {
      structuralRestrictions: restrictionsViewModel,
      governanceConsistency: consistencyViewModel,
      globalScore,
      criticalOffenders
    };
  }
}
