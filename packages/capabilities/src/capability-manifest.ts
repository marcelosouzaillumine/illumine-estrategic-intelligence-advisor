export interface CapabilityManifest {
  name: string;
  version: string;
  domain: 'finance' | 'governance' | 'strategy' | 'people';
  features: string[];
  permissions: string[];
}
