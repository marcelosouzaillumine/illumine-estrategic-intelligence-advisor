// src/core/runtime/shared/lineage-types.ts

/**
 * All fiduciarily significant hashes MUST use these branded types,
 * avoiding generic strings that can lead to cross-contamination.
 */

export type LineageHash = string & { readonly __brand: unique symbol };
export type EvidenceHash = string & { readonly __brand: unique symbol };
export type RuntimeLineageHash = string & { readonly __brand: unique symbol };
export type SnapshotHash = string & { readonly __brand: unique symbol };
export type BoardPackLineageHash = string & { readonly __brand: unique symbol };
export type TreasuryLineageHash = string & { readonly __brand: unique symbol };
export type ScenarioLineageHash = string & { readonly __brand: unique symbol };
export type GovernanceLineageHash = string & { readonly __brand: unique symbol };

export interface LineageSource {
  sourceId: string;
  sourceType: 'SYSTEM' | 'USER' | 'EXTERNAL_API' | 'RUNTIME_ENGINE';
  timestamp: string;
}

export interface LineageRecord {
  hash: LineageHash;
  parentHashes: LineageHash[];
  sources: LineageSource[];
  generationTimestamp: string;
}

export type LineageIntegrityStatus = 
  | 'INTACT'
  | 'BROKEN_CHAIN'
  | 'ORPHANED_HASH'
  | 'UNVERIFIABLE';
