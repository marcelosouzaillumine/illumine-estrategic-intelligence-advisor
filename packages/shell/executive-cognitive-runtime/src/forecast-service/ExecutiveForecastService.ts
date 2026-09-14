import { ExecutiveDecisionPackage } from '../contracts/ExecutiveDecisionPackage';

export class ExecutiveForecastService {
  forecast(pkg: ExecutiveDecisionPackage): ExecutiveDecisionPackage {
    return { ...pkg, state: 'FORECASTED', forecast: { defaultTrend: 'stable' } };
  }
}
