import { EnterpriseLogger, MetricCollector, TraceContext } from '../../packages/observability/src/index';

export function testObservabilityFlow(): boolean {
  // 1. Logger
  EnterpriseLogger.log({
    eventId: 'EVT-TEST-001',
    tenantId: 'tnt-test',
    service: 'ObservabilityTest',
    severity: 'INFO',
    timestamp: new Date().toISOString(),
    correlationId: 'corr-1234'
  });

  // 2. Metrics
  const metrics = MetricCollector.getMetrics();
  if (metrics.errorRatePercentage > 0.05 || metrics.averageLatencyMs > 20) {
    throw new Error('Falha no teste de coletor de métricas');
  }

  // 3. Tracing
  const tracer = new TraceContext();
  const endSpan = tracer.startSpan('MetadataResolution');
  endSpan(5.4);

  if (tracer.getSpans().length !== 1) {
    throw new Error('Falha no teste de tracing distribuído');
  }

  return true;
}
