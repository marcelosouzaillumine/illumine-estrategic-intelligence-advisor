
import { UnknownRecord } from "../safety";

export interface FirestoreDocument extends UnknownRecord {
  id?: string;
  clientId?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  status?: string;
}

export type FirestoreSnapshotLike = FirestoreDocument;
export type TenantDocument = FirestoreDocument;
