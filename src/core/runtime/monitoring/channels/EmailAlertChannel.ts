import { AlertChannel } from './MonitoringChannelTypes';
import { MonitoringAlert } from '../MonitoringTypes';

export class EmailAlertChannel implements AlertChannel {
  async send(alert: MonitoringAlert): Promise<boolean> {
    // Stub Governed.
    console.warn(`[EmailAlertChannel] Envio de E-mail bloqueado por Active Governance na Fase 12. Alert: ${alert.alertId}`);
    return false; // Retorna falso propositalmente no MVP para garantir que não mandamos fora.
  }
}
