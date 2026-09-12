-- Migration: 20260813000000_create_schemas.sql
-- Description: Create the foundational schemas for Illumine's Canonical Data Model.

-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create canonical schemas
CREATE SCHEMA IF NOT EXISTS tenant;
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS intelligence;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS legacy;

-- Grant usage on schemas
GRANT USAGE ON SCHEMA tenant TO authenticated, anon, service_role;
GRANT USAGE ON SCHEMA finance TO authenticated, anon, service_role;
GRANT USAGE ON SCHEMA intelligence TO authenticated, anon, service_role;
GRANT USAGE ON SCHEMA audit TO authenticated, anon, service_role;
GRANT USAGE ON SCHEMA legacy TO authenticated, anon, service_role;

-- Grant default privileges so new tables are accessible
ALTER DEFAULT PRIVILEGES IN SCHEMA tenant GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA finance GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA intelligence GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA audit GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA legacy GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA tenant GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA finance GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA intelligence GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA audit GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA legacy GRANT ALL ON TABLES TO service_role;

-- Grant default privileges on sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA tenant GRANT USAGE, SELECT ON SEQUENCES TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA finance GRANT USAGE, SELECT ON SEQUENCES TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA intelligence GRANT USAGE, SELECT ON SEQUENCES TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA audit GRANT USAGE, SELECT ON SEQUENCES TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA legacy GRANT USAGE, SELECT ON SEQUENCES TO authenticated, service_role;

-- Set default search path
ALTER DATABASE postgres SET search_path TO public, tenant, finance, intelligence, audit, legacy;
