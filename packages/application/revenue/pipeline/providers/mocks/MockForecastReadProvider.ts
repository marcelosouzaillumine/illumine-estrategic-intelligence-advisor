import { IForecastReadProvider } from '../IForecastReadProvider';
import { ForecastReadModel } from '../../read-models/ForecastReadModel';
export class MockForecastReadProvider implements IForecastReadProvider {
  async getForecast(): Promise<ForecastReadModel> {
    return {
      forecastCommit: 850000,
      forecastBestCase: 1200000,
      forecastWorstCase: 500000,
      weightedRevenue: 650000,
      expectedArr: 2500000,
      expectedMrr: 208333
    };
  }
}