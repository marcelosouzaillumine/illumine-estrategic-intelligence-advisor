export interface KnowledgeLineage {
  artifactId: string;
  originType: string; // e.g. "ExecutiveConversation"
  originId: string; // ID of the chat or document
  derivedFrom: string[]; // Other artifact IDs this was based upon
  createdBy: string;
  transformations: string[]; // Notes on normalization/extraction logic used
}
