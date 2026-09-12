import { 
  useExecutiveKnowledgeStore,
  PageKnowledge,
  MetricKnowledge,
  CapabilityKnowledge,
  ActionKnowledge
} from '../../../executive-copilot/src/store/ExecutiveKnowledgeStore';

export class ExecutiveKnowledgeRegistry {
  
  static registerPage(page: PageKnowledge) {
    useExecutiveKnowledgeStore.getState().setPageKnowledge(page);
  }

  static registerMetric(metric: MetricKnowledge) {
    useExecutiveKnowledgeStore.getState().registerMetric(metric);
  }

  static registerCapability(capability: CapabilityKnowledge) {
    useExecutiveKnowledgeStore.getState().registerCapability(capability);
  }

  static registerAction(action: ActionKnowledge) {
    useExecutiveKnowledgeStore.getState().registerAction(action);
  }

  static clear() {
    useExecutiveKnowledgeStore.getState().clearRegistries();
  }
}
