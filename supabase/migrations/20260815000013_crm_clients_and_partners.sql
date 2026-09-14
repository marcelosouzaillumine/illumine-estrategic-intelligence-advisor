-- Migration: 20260815000013_crm_clients_and_partners.sql
-- Description: Creates the CRM schema and tables for clients and partners, replacing Firestore.

CREATE SCHEMA IF NOT EXISTS crm;

-------------------------------------------------------------------------------
-- 1. CLIENTS TABLE
-------------------------------------------------------------------------------
CREATE TABLE crm.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES tenant.companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    document_number VARCHAR(50), -- CNPJ/CPF
    status VARCHAR(50) DEFAULT 'ACTIVE',
    approval_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES tenant.users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX idx_crm_clients_company ON crm.clients(company_id);
CREATE INDEX idx_crm_clients_status ON crm.clients(company_id, status);

-------------------------------------------------------------------------------
-- 2. PARTNERS TABLE
-------------------------------------------------------------------------------
CREATE TABLE crm.partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES tenant.companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    partner_type VARCHAR(100) DEFAULT 'GENERAL',
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX idx_crm_partners_company ON crm.partners(company_id);

-------------------------------------------------------------------------------
-- 3. RLS POLICIES
-------------------------------------------------------------------------------
ALTER TABLE crm.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm.partners ENABLE ROW LEVEL SECURITY;

-- Clients Policies
CREATE POLICY "Users can view clients of their company" 
    ON crm.clients FOR SELECT 
    USING (tenant.has_company_access(company_id));

CREATE POLICY "Users can insert clients to their company" 
    ON crm.clients FOR INSERT 
    WITH CHECK (tenant.has_company_access(company_id));

CREATE POLICY "Users can update clients of their company" 
    ON crm.clients FOR UPDATE 
    USING (tenant.has_company_access(company_id));

CREATE POLICY "Users can delete clients of their company" 
    ON crm.clients FOR DELETE 
    USING (tenant.has_company_access(company_id));

-- Partners Policies
CREATE POLICY "Users can view partners of their company" 
    ON crm.partners FOR SELECT 
    USING (tenant.has_company_access(company_id));

CREATE POLICY "Users can insert partners to their company" 
    ON crm.partners FOR INSERT 
    WITH CHECK (tenant.has_company_access(company_id));

CREATE POLICY "Users can update partners of their company" 
    ON crm.partners FOR UPDATE 
    USING (tenant.has_company_access(company_id));

CREATE POLICY "Users can delete partners of their company" 
    ON crm.partners FOR DELETE 
    USING (tenant.has_company_access(company_id));
