import { IntelligenceCapabilityDescriptor } from './IntelligenceCapabilityDescriptor';

export interface IntelligenceRouteContract {
  readonly routeId: string;
  readonly targetCapability: IntelligenceCapabilityDescriptor;
  readonly routeReason: string;
  readonly isRouteActive: boolean;
}
