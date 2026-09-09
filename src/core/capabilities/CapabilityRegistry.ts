export interface CapabilityDefinition {
  id: string;
  layer: "FOUNDATIONAL" | "APPLICATION" | "ADAPTER";
  maturity: "foundation" | "operational" | "deprecated";
  version: string;
  providers: { id: string; enabled: boolean }[];
  governance: {
    humanApprovalRequired: boolean;
    autonomousExecution: boolean;
  };
  capabilities: string[];
}

export const CapabilityRegistry: Record<string, CapabilityDefinition> = {
  "executive.conversation.governance": {
    id: "executive.conversation.governance",
    layer: "FOUNDATIONAL",
    maturity: "foundation",
    version: "1.0",
    providers: [
      { id: "mock", enabled: true }
    ],
    governance: {
      humanApprovalRequired: true,
      autonomousExecution: false
    },
    capabilities: [
      "signal.extraction",
      "insight.generation",
      "recommendation.creation"
    ]
  },
  "knowledge.fabric": {
    id: "knowledge.fabric",
    layer: "FOUNDATIONAL",
    maturity: "foundation",
    version: "1.0",
    providers: [],
    governance: {
      humanApprovalRequired: false, // Core infrastructure, no autonomous actions
      autonomousExecution: false
    },
    capabilities: [
      "KnowledgeArtifacts",
      "KnowledgeRelationships",
      "KnowledgeRetrieval"
    ]
  }
};
