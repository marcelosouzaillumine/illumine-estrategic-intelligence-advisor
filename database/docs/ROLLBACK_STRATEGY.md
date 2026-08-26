# Rollback Strategy

## Production Rollback
As specified, **Phase 5 does not connect to production**. If an attempt was made to run this in staging and it fails, the rollback strategy is:
1. Since the original source of truth remains Firebase (No Dual-Write initially), we simply destroy the PostgreSQL staging schemas and restart the ETL pipeline.
2. The `legacy` schema acts as a buffer. If transformations fail, we drop `tenant`, `finance`, `intelligence`, and `audit`, leaving the extracted `legacy` intact to debug the SQL scripts.

## Database Downgrades
The migrations are sequentially numbered. A standard Supabase `migration down` or destroying the Docker volume locally will reset the environment.
