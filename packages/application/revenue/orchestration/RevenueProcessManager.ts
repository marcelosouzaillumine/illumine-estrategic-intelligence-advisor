import { RevenueEventRegistry } from './RevenueEventRegistry';
import { RevenueSagaState, RevenueSagaStatus, RevenueSagaStep } from './RevenueSagaState';
import { RevenueIntegrationEvent } from '../events/RevenueIntegrationEvents';

/**
 * Port to dispatch asynchronous commands to Use Cases.
 */
export interface CommandBusPort {
  dispatch(commandName: string, payload: any): Promise<void>;
}

export class RevenueProcessManager {
  constructor(
    private readonly eventRegistry: RevenueEventRegistry,
    private readonly commandBus: CommandBusPort,
    // In a real implementation, we would inject a SagaRepository to load/save the SagaState
  ) {}

  public async onEvent(event: RevenueIntegrationEvent): Promise<void> {
    // 1. Idempotency Check
    if (this.eventRegistry.isProcessed(event.id)) {
      console.log(`[Idempotency] Event ${event.id} (${event.eventName}) already processed. Skipping.`);
      return;
    }

    try {
      // 2. Route Event to Happy Path or Compensation Path
      switch (event.eventName) {
        // --- HAPPY PATH ---
        case 'ProposalAccepted':
          await this.commandBus.dispatch('CreateContractCommand', event.payload);
          break;
        case 'ContractActivated':
          await this.commandBus.dispatch('CreateSubscriptionCommand', event.payload);
          break;
        case 'SubscriptionActivated':
          await this.commandBus.dispatch('GenerateInvoiceCommand', event.payload);
          break;
        case 'PaymentConfirmed':
          await this.commandBus.dispatch('IssueLicenseCommand', event.payload);
          break;
        case 'LicenseActivated':
          await this.commandBus.dispatch('GrantEntitlementCommand', event.payload);
          break;
        case 'EntitlementGranted':
          await this.commandBus.dispatch('ProvisionTenantCommand', event.payload);
          break;
        case 'TenantReadyForAccess':
          // Saga Complete!
          console.log(`[RevenueSaga] End-to-end provision complete for ${event.payload.customerId}`);
          break;

        // --- COMPENSATION / EXCEPTION PATH ---
        case 'PaymentFailed':
          // Start tearing down access
          await this.commandBus.dispatch('SuspendLicenseCommand', event.payload);
          await this.commandBus.dispatch('RevokeEntitlementCommand', event.payload);
          await this.commandBus.dispatch('SuspendTenantCommand', event.payload);
          break;
        
        case 'CustomerCancelled':
          await this.commandBus.dispatch('TerminateSubscriptionCommand', event.payload);
          await this.commandBus.dispatch('RevokeLicenseCommand', event.payload);
          await this.commandBus.dispatch('RevokeEntitlementCommand', event.payload);
          await this.commandBus.dispatch('DecommissionTenantCommand', event.payload);
          break;
      }

      // 3. Mark Processed
      this.eventRegistry.markAsProcessed(event.id, event.eventName, 'SUCCESS');

    } catch (error) {
      console.error(`[RevenueSaga] Failed to process event ${event.eventName}:`, error);
      this.eventRegistry.markAsProcessed(event.id, event.eventName, 'FAILED');
      // A mechanism to retry failed events would be implemented here
    }
  }
}
