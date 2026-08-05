import { ForecastReadModel } from '../read-models/ForecastReadModel';
export interface IForecastReadProvider { getForecast(): Promise<ForecastReadModel>; }