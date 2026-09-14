import { AlertChannel } from './MonitoringChannelTypes';
import { MonitoringAlert } from '../MonitoringTypes';

export class InAppAlertChannel implements AlertChannel {
  async send(alert: MonitoringAlert): Promise<boolean> {
    // In-app Notification Trigger.
    // Como a persistência já ocorre no Registry, esta classe
    // seria usada para despachar um Push Notification WebSockets ou Toast UI.
    console.log(`[InAppAlertChannel] Notificação despachada: ${alert.message}`);
    return true;
  }
}
