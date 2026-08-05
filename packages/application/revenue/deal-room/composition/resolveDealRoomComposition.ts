import { FirebaseDealRoomQueryAdapter } from '../../../../infrastructure/firebase/revenue/deal-room/FirebaseDealRoomQueryAdapter';
import { FirebaseOpportunityRepository } from '../../../../infrastructure/firebase/revenue/deal-room/FirebaseOpportunityRepository';
import { MockProjectionProvider } from '../../../../infrastructure/firebase/revenue/deal-room/MockProjectionProvider';
import { InMemoryEventBusPublisher } from '../../../../infrastructure/event-bus/InMemoryEventBusPublisher';
import { OpportunityCommandHandler } from '../handlers/OpportunityCommandHandler';
import { RevenueProcessManager } from '../../sagas/RevenueProcessManager';

// Singleton instances for the Composition Root (Simulation of DI Container)
const eventBus = new InMemoryEventBusPublisher();
const repository = new FirebaseOpportunityRepository();
const projectionProvider = new MockProjectionProvider();
const queryPort = new FirebaseDealRoomQueryAdapter(projectionProvider);
const commandHandler = new OpportunityCommandHandler(repository, eventBus);

// Initialize Sagas
new RevenueProcessManager(eventBus);

export function resolveDealRoomComposition() {
  return {
    queryPort,
    commandHandler
  };
}
