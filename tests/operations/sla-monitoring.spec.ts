import { ServiceRegistry, ComplianceRegistry } from '../../packages/infrastructure/src/index';

export function testSLAMonitoring(): boolean {
  const registry = new ServiceRegistry();
  registry.register('SEE-ExecutionBus');

  const health = registry.checkHealth('SEE-ExecutionBus');
  if (!health || health.status !== 'HEALTHY' || health.latencyMs > 10) {
    throw new Error('Falha no teste de SLA e monitoramento de saúde de serviços');
  }

  const compliance = ComplianceRegistry.getStatus();
  if (!compliance.soc2Readiness || !compliance.iso27001Readiness || !compliance.lgpdCompliant) {
    throw new Error('Falha no teste de registros de conformidade e compliance');
  }

  return true;
}
