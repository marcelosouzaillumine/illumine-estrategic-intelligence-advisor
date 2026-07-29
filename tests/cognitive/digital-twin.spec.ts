import { DigitalTwinEngine } from '../../packages/digital-twin/src/index';

export function testDigitalTwin(): boolean {
  const twin = DigitalTwinEngine.generateTwin('org-holding-alpha');

  if (twin.organizationId !== 'org-holding-alpha' || twin.maturityScore !== 94.5) {
    throw new Error('Falha no teste do Executive Digital Twin');
  }

  return true;
}
