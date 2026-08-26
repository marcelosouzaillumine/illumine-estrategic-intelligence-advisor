# Risks and Limitations

## Known Limitations
1. **UUIDv7 Native Support**: Current PostgreSQL 15 (Supabase default) does not natively support UUIDv7 without a custom C extension or plpgsql function. We have defaulted to `gen_random_uuid()` (UUIDv4) in the DDL to avoid non-standard plpgsql implementations that degrade insert performance.
2. **Firebase Auth Coupling**: While decoupled at the DB layer via `external_auth_id`, the frontend currently passes a Firebase JWT. The Supabase local testing environment parses this JWT payload to extract `sub`.

## Implementation Risks
1. **Migration Constraint Failures**: Legacy Firebase data lacks referential integrity. Inserting `financial_entries` during migration will likely fail if the parent `client` no longer exists but wasn't cascaded properly in NoSQL.
2. **Cross-Tenant JOIN testing**: We proved RLS works, but complex nested views require `security_invoker = true` in Postgres 15+ to ensure the views don't leak data when queried. This must be monitored.
