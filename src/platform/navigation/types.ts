import { SystemCapability } from '../../domain/authorization/Capabilities';

export type OfficeAvailability = 'foundation' | 'beta' | 'active' | 'future';
export type NavigationMode = 'legacy' | 'hybrid' | 'executive';
export type NavigationIntent = 'monitor' | 'analyze' | 'decide' | 'operate' | 'plan';

export interface ExecutiveOffice {
  id: string;
  nameKey: string;
  descriptionKey: string;
  availability: OfficeAvailability;
}

export interface NavigationItem {
  id: string;
  officeId: string;
  capability: SystemCapability;
  route: string;
  labelKey: string;
  iconKey: string;
  intent: NavigationIntent;
  availability?: 'available' | 'preview' | 'future';
  visibility?: 'visible' | 'hidden';
  children?: Omit<NavigationItem, 'officeId'>[];
}

export interface CapabilityRegistryEntry {
  capability: SystemCapability;
  officeId: string;
  engineKey: string;
  route: string;
}
