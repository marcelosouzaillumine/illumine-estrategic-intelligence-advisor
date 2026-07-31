import { useEffect } from 'react';
import { ExecutiveKnowledgeRegistry } from '../../packages/intelligence/enterprise-knowledge-fabric/src/registry/ExecutiveKnowledgeRegistry';
import { PageKnowledge } from '../../packages/intelligence/executive-copilot/src/store/ExecutiveKnowledgeStore';
import { useExecutiveContextStore } from '../../packages/intelligence/executive-copilot/src/store/ExecutiveContextStore';

interface UseExecutivePageProps extends PageKnowledge {
  companyId?: string;
  period?: string;
  filters?: Record<string, any>;
}

export function useExecutivePage(props: UseExecutivePageProps) {
  const { updateRuntimeContext } = useExecutiveContextStore();

  useEffect(() => {
    // 1. Publish Static Knowledge to Registry
    ExecutiveKnowledgeRegistry.registerPage({
      domain: props.domain,
      module: props.module,
      capability: props.capability,
      title: props.title,
      description: props.description,
      breadcrumbs: props.breadcrumbs
    });

    // 2. Publish Dynamic Runtime Context to ContextStore
    updateRuntimeContext({
      activeCompanyId: props.companyId || null,
      activePeriod: props.period || null,
      activeFilters: props.filters || {}
    });

    return () => {
      // Optional: clear on unmount if it makes sense, or let the next page overwrite it.
      // ExecutiveKnowledgeRegistry.clear();
    };
  }, [props.domain, props.module, props.capability, props.companyId, props.period, JSON.stringify(props.filters)]);
}
