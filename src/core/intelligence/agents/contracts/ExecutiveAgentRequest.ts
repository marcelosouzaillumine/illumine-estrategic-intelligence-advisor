export interface ExecutiveAgentRequest {
  userId: string;
  tenantId: string;
  question: string;
  context: any; // Context retrieved from the platform
  timestamp: string;
}
