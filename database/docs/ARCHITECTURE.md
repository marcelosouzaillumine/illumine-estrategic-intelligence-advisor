# Architecture

## Overview
This defines the Phase 5 local PostgreSQL/Supabase database foundation. The architecture is split into five canonical schemas:
1. `tenant`: Multitenancy and identity (Tenants, Companies, Users, Memberships, Roles).
2. `finance`: Canonical financial domains (COA, Periods, Entries, Adjustments).
3. `governance`: Decision governance (AI Provenance, Insights, Recommendations, Decisions, Actions, Outcomes).
4. `audit`: System audit logs and explicit impersonation sessions.
5. `legacy`: Staging area for initial Firebase import/cleansing.

## Identity & Authorization
Firebase UID is an external identity string (`external_auth_id`). The system abstracts this through `tenant.current_canonical_user_id()`. 
Row-Level Security (RLS) policies govern all data access strictly at the database level.

## Financial Integrity
- **Periods**: Can be `OPEN` or `CLOSED`. Closed periods cannot accept direct updates/deletes to `financial_entries`.
- **Adjustments**: Corrections to closed periods require inserting an `adjustment_entries` record.
- **Views**: `v_financial_statements` nets `financial_entries` against `adjustment_entries`.

## Governance Immutability
- **Decisions**: Strongly immutable. Can only change status (Archived, Superseded).
- **AI Provenance**: Tracks the hash and model of AI-generated insights.
