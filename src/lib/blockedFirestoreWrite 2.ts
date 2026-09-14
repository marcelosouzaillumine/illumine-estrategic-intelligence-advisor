// Phase 7.2: Firestore writes are blocked — the write path has moved to PostgreSQL.
// A separate (non-inlined) function with an explicit `any` return type is used
// instead of an inline `(() => { throw ... })()` so that TypeScript does not mark
// the calling statement's continuation as unreachable and narrow local variables
// (e.g. `const batch = ...`) to `never`.
export function blockedFirestoreWrite(): any {
  throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");
}
