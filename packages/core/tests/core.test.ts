import { DependencyContainer } from '../src/container/dependency-container';
import { EventBus } from '../src/events/event-bus';
import { SecurityContext } from '../src/security/security-context';

export function testCorePackage(): boolean {
  // 1. Test DependencyContainer
  const container = new DependencyContainer();
  container.register('TestService', () => ({ name: 'CoreService' }), 'SINGLETON');
  const service = container.resolve<{ name: string }>('TestService');
  if (service.name !== 'CoreService') {
    throw new Error('Falha no teste do DependencyContainer');
  }

  // 2. Test EventBus
  const bus = new EventBus();
  let eventReceived = false;
  bus.subscribe('MetadataUpdated', (evt) => {
    if (evt.payload.test === true) {
      eventReceived = true;
    }
  });
  bus.publish({
    type: 'MetadataUpdated',
    payload: { test: true },
    timestamp: new Date().toISOString(),
    source: 'CoreTest'
  });

  if (!eventReceived) {
    throw new Error('Falha no teste do EventBus');
  }

  // 3. Test SecurityContext
  const sec = new SecurityContext();
  sec.setCurrentUser({ id: 'u1', tenantId: 't1', roles: ['ADMIN'], permissions: ['WRITE'] });
  if (!sec.hasRole('ADMIN') || !sec.hasPermission('WRITE')) {
    throw new Error('Falha no teste do SecurityContext');
  }

  return true;
}
