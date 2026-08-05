export interface SecurityContext {
  userId: string;
  roles: string[]; // e.g., ["admin", "viewer"]
  permissions: string[]; // granular permissions e.g. ["approve_intelligence", "view_financials"]
  clearanceLevel: "executive" | "advisor" | "operator";
}
