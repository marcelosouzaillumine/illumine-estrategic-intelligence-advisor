import { AlertChannel } from './MonitoringChannelTypes';
import { MonitoringAlert } from '../MonitoringTypes';

export class WebhookAlertChannel implements AlertChannel {
  async send(alert: MonitoringAlert): Promise<boolean> {
    // Stub Governed.
    console.warn(`[WebhookAlertChannel] Envio de Webhook externo bloqueado na Fase 12 para garantir Tenant Scope. Alert: ${alert.alertId}`);
    return false;
  }
}
