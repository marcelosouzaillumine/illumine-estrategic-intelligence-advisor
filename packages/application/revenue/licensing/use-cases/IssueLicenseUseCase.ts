import { 
  License, 
  LicenseStatus, 
  LicenseCapacity, 
  LicenseScope 
} from '@domain/licensing';

interface IssueLicenseCommand {
  customerId: string;
  subscriptionId: string;
  scope: {
    capabilities: string[];
    modules: string[];
  };
  capacity: {
    seats: number;
    environments: number;
  };
  startDate: string;
  endDate?: string;
}

export class IssueLicenseUseCase {
  /**
   * Acts upon a PaymentConfirmed payload to instantiate a PENDING License.
   * This decoupled flow means Licensing does not know who processed the payment.
   */
  public execute(command: IssueLicenseCommand): License {
    
    const scope: LicenseScope = {
      capabilities: command.scope.capabilities,
      modules: command.scope.modules,
    };

    const capacity: LicenseCapacity = {
      seats: command.capacity.seats,
      environments: command.capacity.environments,
    };

    const license: License = {
      id: `LIC-${Date.now()}`,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customer: command.customerId,
      subscription: command.subscriptionId,
      licenseKey: `LIC-EXEC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
      scope,
      capacity,
      period: { startDate: command.startDate, endDate: command.endDate },
      status: LicenseStatus.PENDING,
    };

    // Next steps: Save to Repository, Dispatch Domain Event (LicenseCreated)

    return license;
  }
}
