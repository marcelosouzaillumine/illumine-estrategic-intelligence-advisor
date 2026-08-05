import { ExperienceSectionOrder } from '../governance/ExecutiveHierarchyContract';

export interface ExecutiveSectionSchema {
  type: keyof typeof ExperienceSectionOrder;
  components: string[];
}
