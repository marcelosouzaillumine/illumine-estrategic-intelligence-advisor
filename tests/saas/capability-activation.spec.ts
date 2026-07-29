import { capabilityRegistry } from '../../packages/capabilities/src/index';

export function testCapabilityActivation(): boolean {
  const financeCap = capabilityRegistry.getCapability('finance-intelligence');
  const govCap = capabilityRegistry.getCapability('governance-intelligence');

  if (!financeCap || !govCap) {
    throw new Error('Falha no teste de registro e ativação do Capability Marketplace');
  }

  if (!financeCap.features.includes('dre-analysis')) {
    throw new Error('Feature de análise DRE não encontrada na capacidade financeira');
  }

  return true;
}
