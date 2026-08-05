export interface GroundingPolicy {
  id: string;
  name: string;
  rules: {
    maxDocuments: number;
    maxTokens: number;
    prioritizeRecentDecisions: boolean;
    ignoreArchivedArtifacts: boolean;
    requireApprovedDocumentsOnly: boolean;
    priorityByDomain: Record<string, number>; // e.g. { "financial": 10, "people": 5 }
  };
}
