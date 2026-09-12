export interface KnowledgeVersioning {
  readonly id: string;
  readonly version: string;
  readonly createdAt: string;
  readonly deprecatedAt: string | null;
  readonly supersededBy: string | null; // ID of the superseding node
  readonly validFrom: string;
  readonly validUntil: string | null;
}
