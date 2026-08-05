export interface AIGovernancePolicy {
  domain: string; // e.g. "financial", "governance", "risk"
  allowedProviders: string[]; // IDs of providers permitted for this domain
  requiresHumanApproval: boolean; // Always true for critical domains
  dataClassification: "public" | "internal" | "confidential" | "restricted";
}
