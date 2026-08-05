export interface AIContext {
  tenantId: string;
  workspaceId: string;
  userRole: string;
  allowedKnowledge: string[]; // Topics this user is permitted to retrieve
  restrictions: string[]; // Topics explicitly blocked
  knowledgeScope: {
    entities: string[];
    domains: string[];
  };
}
