import { MonitoringAlert } from '../MonitoringTypes';

export interface AlertChannel {
  send(alert: MonitoringAlert): Promise<boolean>;
}
