import { RevenueIntegrationEvent } from '../../events/RevenueIntegrationEvents';
import { RevenueAuditRecord } from './RevenueAuditRecord';

export interface AuditRepository {
  save(record: RevenueAuditRecord): Promise<void>;
}

export class RevenueAuditService {
  constructor(private readonly repository: AuditRepository) {}

  /**
   * Translates technical integration events into human-readable business compliance audit logs.
   */
  public async processEvent(event: RevenueIntegrationEvent): Promise<void> {
    let narrative = '';

    // Transform technical events into Executive Business Language
    switch (event.eventName) {
      case 'ProposalAccepted':
        narrative = `Customer (ID: ${event.payload.customerId}) accepted the commercial proposal (ID: ${event.payload.proposalId}).`;
        break;
      case 'ContractActivated':
        narrative = `Contract (ID: ${event.payload.contractId}) formally activated for plan: ${event.payload.plan}.`;
        break;
      case 'PaymentConfirmed':
        narrative = `Payment confirmed for invoice ${event.payload.invoiceId}. Financial obligation fulfilled.`;
        break;
      case 'PaymentFailed':
        narrative = `Payment FAILED for invoice ${event.payload.invoiceId}. Reason: ${event.payload.reason}.`;
        break;
      case 'LicenseActivated':
        narrative = `License (ID: ${event.payload.licenseId}) officially issued and activated for customer.`;
        break;
      case 'TenantReadyForAccess':
        narrative = `Workspace environment (ID: ${event.payload.tenantId}) provisioned and accessible. End-to-end activation completed.`;
        break;
      case 'CustomerCancelled':
        narrative = `Customer initiated cancellation. Reason: ${event.payload.reason}. Commencing teardown.`;
        break;
      default:
        narrative = `System milestone reached: ${event.eventName}.`;
    }

    const record: RevenueAuditRecord = {
      id: `AUD-${Date.now()}`,
      customerId: event.payload.customerId ?? 'UNKNOWN',
      timestamp: event.occurredAt,
      sourceEventId: event.id,
      sourceEventType: event.eventName,
      executiveNarrative: narrative,
      metadata: event.payload
    };

    await this.repository.save(record);
  }
}
