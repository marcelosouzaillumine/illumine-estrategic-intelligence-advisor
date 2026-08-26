-- Migration: 20260813000001_identity_and_tenant.sql
-- Description: Identity, Tenant, Company and Membership architecture with RLS.

-------------------------------------------------------------------------------
-- 1. ENUMS & TYPES
-------------------------------------------------------------------------------
CREATE TYPE tenant.tenant_status AS ENUM ('ACTIVE', 'SUSPENDED', 'ARCHIVED');
CREATE TYPE tenant.company_status AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');
CREATE TYPE tenant.membership_status AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE audit.impersonation_status AS ENUM ('ACTIVE', 'TERMINATED');

-------------------------------------------------------------------------------
-- 2. TABLES
-------------------------------------------------------------------------------

-- 2.1 Users (Canonical Identity, decoupled from Auth provider)
CREATE TABLE tenant.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_auth_id VARCHAR(255) NOT NULL UNIQUE, -- Firebase UID
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- 2.2 Roles
CREATE TABLE tenant.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'EXECUTIVE', 'ADVISOR', 'OPERATOR'
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- 2.3 Tenants (Workspace / Billing boundary)
CREATE TABLE tenant.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    status tenant.tenant_status NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- 2.4 Companies (Business Analysis boundary)
CREATE TABLE tenant.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant.tenants(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50),
    status tenant.company_status NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- 2.5 Memberships (M:N User to Tenant + Role)
CREATE TABLE tenant.memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES tenant.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenant.tenants(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES tenant.roles(id) ON DELETE RESTRICT,
    status tenant.membership_status NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, tenant_id)
);

-------------------------------------------------------------------------------
-- 3. EXPLICIT IMPERSONATION (Audit Foundation)
-------------------------------------------------------------------------------
CREATE TABLE audit.impersonation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_user_id UUID NOT NULL REFERENCES tenant.users(id) ON DELETE RESTRICT,
    target_tenant_id UUID NOT NULL REFERENCES tenant.tenants(id) ON DELETE RESTRICT,
    reason TEXT NOT NULL,
    status audit.impersonation_status NOT NULL DEFAULT 'ACTIVE',
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ended_at TIMESTAMPTZ
);

---------------------------------------------------------------------------------
-- 4. HELPER FUNCTIONS
-------------------------------------------------------------------------------
-- These functions are used extensively in Row Level Security (RLS) policies.
-- They must run as SECURITY DEFINER to bypass RLS and prevent infinite recursion.

CREATE OR REPLACE FUNCTION tenant.current_external_user_id()
RETURNS TEXT AS $$
BEGIN
    RETURN COALESCE(
        NULLIF(current_setting('request.jwt.claim.sub', true), ''),
        (NULLIF(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION tenant.current_canonical_user_id()
RETURNS UUID AS $$
    SELECT id 
    FROM tenant.users 
    WHERE external_auth_id = tenant.current_external_user_id()
      AND deleted_at IS NULL
    LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION tenant.is_impersonating(p_tenant_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_operator_id UUID;
    v_is_impersonating BOOLEAN;
BEGIN
    v_operator_id := tenant.current_canonical_user_id();
    
    SELECT EXISTS (
        SELECT 1 
        FROM audit.impersonation_sessions 
        WHERE operator_user_id = v_operator_id
          AND target_tenant_id = p_tenant_id
          AND status = 'ACTIVE'
    ) INTO v_is_impersonating;

    RETURN v_is_impersonating;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION tenant.has_active_membership(p_tenant_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_user_id UUID;
    v_is_active BOOLEAN;
BEGIN
    v_user_id := tenant.current_canonical_user_id();
    
    SELECT EXISTS (
        SELECT 1 
        FROM tenant.memberships 
        WHERE user_id = v_user_id 
          AND tenant_id = p_tenant_id
          AND status = 'ACTIVE'
    ) INTO v_is_active;

    IF v_is_active THEN
        RETURN TRUE;
    END IF;

    -- Check impersonation fallback
    RETURN tenant.is_impersonating(p_tenant_id);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION tenant.has_company_access(p_company_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_user_id UUID;
    v_has_access BOOLEAN;
BEGIN
    v_user_id := tenant.current_canonical_user_id();
    
    -- Check if user is a member of the requested company
    SELECT EXISTS (
        SELECT 1 
        FROM tenant.memberships 
        WHERE user_id = v_user_id 
          AND company_id = p_company_id
          AND status = 'ACTIVE'
    ) INTO v_has_access;

    IF v_has_access THEN
        RETURN TRUE;
    END IF;

    -- Check if it's an operator impersonating the tenant
    RETURN tenant.is_impersonating(
        (SELECT tenant_id FROM tenant.companies WHERE id = p_company_id)
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '';

-------------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS)
-------------------------------------------------------------------------------
-- Enable RLS
ALTER TABLE tenant.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant.roles ENABLE ROW LEVEL SECURITY;

-- 5.1 Users: Can read their own record.
CREATE POLICY "Users can read own profile" ON tenant.users
    FOR SELECT USING (id = tenant.current_canonical_user_id());

-- 5.2 Roles: All authenticated users can read roles (it's a dictionary)
CREATE POLICY "Roles are readable by authenticated users" ON tenant.roles
    FOR SELECT USING (tenant.current_external_user_id() IS NOT NULL);

-- 5.3 Tenants: Users can read tenants where they have an active membership OR are impersonating
CREATE POLICY "Users can read their tenants" ON tenant.tenants
    FOR SELECT USING (tenant.has_active_membership(id) AND deleted_at IS NULL);

-- 5.4 Companies: Users can read/write companies if they have access to the parent tenant
CREATE POLICY "Users can read companies in their tenants" ON tenant.companies
    FOR SELECT USING (tenant.has_active_membership(tenant_id) AND deleted_at IS NULL);

CREATE POLICY "Users can insert companies in their tenants" ON tenant.companies
    FOR INSERT WITH CHECK (tenant.has_active_membership(tenant_id));

CREATE POLICY "Users can update companies in their tenants" ON tenant.companies
    FOR UPDATE USING (tenant.has_active_membership(tenant_id));

CREATE POLICY "Users can delete (soft) companies in their tenants" ON tenant.companies
    FOR DELETE USING (tenant.has_active_membership(tenant_id));

-- 5.5 Memberships: Users can see memberships for their tenants
CREATE POLICY "Users can see memberships of their tenants" ON tenant.memberships
    FOR SELECT USING (tenant.has_active_membership(tenant_id));
