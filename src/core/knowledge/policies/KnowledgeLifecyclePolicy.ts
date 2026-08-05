export type KnowledgeLifecycleState = 
  | "Captured" 
  | "Normalized" 
  | "Validated" 
  | "Published" 
  | "Superseded" 
  | "Archived" 
  | "Rejected";

export class KnowledgeLifecyclePolicy {
  canTransition(current: KnowledgeLifecycleState, next: KnowledgeLifecycleState): boolean {
    const transitions: Record<KnowledgeLifecycleState, KnowledgeLifecycleState[]> = {
      "Captured": ["Normalized", "Rejected"],
      "Normalized": ["Validated", "Rejected"],
      "Validated": ["Published", "Rejected"],
      "Published": ["Superseded", "Archived"],
      "Superseded": ["Archived"],
      "Archived": [],
      "Rejected": []
    };

    return transitions[current]?.includes(next) ?? false;
  }
}
