import { InstitutionalOutcomeRecord, InstitutionalConversionMetrics } from './institutional-outcomes-types';

export function calculateConversionMetrics(records: InstitutionalOutcomeRecord[]): InstitutionalConversionMetrics {
  const e1 = records.filter(r => r.level === 'E1').length;
  const e2 = records.filter(r => r.level === 'E2').length;
  const e3 = records.filter(r => r.level === 'E3').length;
  const e4 = records.filter(r => r.level === 'E4').length;
  const e5 = records.filter(r => r.level === 'E5').length;
  const e6 = records.filter(r => r.level === 'E6').length;

  return {
    totalInsights: e1,
    totalRecommendations: e2,
    totalDecisions: e3,
    totalActions: e4,
    totalOutcomes: e5,
    totalMeasured: e6,
    insightToDecisionRate: e1 > 0 ? (e3 / e1) : 0,
    decisionToActionRate: e3 > 0 ? (e4 / e3) : 0,
    actionToOutcomeRate: e4 > 0 ? (e5 / e4) : 0,
    outcomeToMeasuredResultRate: e5 > 0 ? (e6 / e5) : 0,
  };
}
