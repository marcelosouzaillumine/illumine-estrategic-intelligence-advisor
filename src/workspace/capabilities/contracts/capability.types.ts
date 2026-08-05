export interface ExecutiveCapability {
  id: string; // e.g., 'cfo.financial-performance'
  office: string; // e.g., 'cfo'
  surfaces: string[]; // List of decision surfaces within this capability
  requiredPermissions: string[]; // Capabilities / Roles needed to view
  intelligenceSources: string[]; // Providers/Engines consumed (e.g., 'enterprise:financial')
}
