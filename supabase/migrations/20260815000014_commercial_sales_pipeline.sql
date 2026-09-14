-- Migration: 20260815000014_commercial_sales_pipeline.sql
-- Description: Creates the commercial schema and sales pipeline table, replacing Firestore.

CREATE SCHEMA IF NOT EXISTS commercial;

-------------------------------------------------------------------------------
-- 1. SALES PIPELINE TABLE
-------------------------------------------------------------------------------
CREATE TABLE commercial.sales_pipeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES tenant.companies(id) ON DELETE CASCADE,
    client_id UUID REFERENCES crm.clients(id) ON DELETE SET NULL,
    seller_name VARCHAR(255),
    unit VARCHAR(100),
    branch VARCHAR(100),
    stage VARCHAR(100) DEFAULT 'PROSPECTING',
    projected_value NUMERIC(15,2) DEFAULT 0.00,
    customer_name VARCHAR(255), -- for leads without formal client id
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX idx_commercial_sales_company ON commercial.sales_pipeline(company_id);
CREATE INDEX idx_commercial_sales_client ON commercial.sales_pipeline(client_id);
CREATE INDEX idx_commercial_sales_stage ON commercial.sales_pipeline(company_id, stage);

-------------------------------------------------------------------------------
-- 2. RLS POLICIES
-------------------------------------------------------------------------------
ALTER TABLE commercial.sales_pipeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sales of their company" 
    ON commercial.sales_pipeline FOR SELECT 
    USING (tenant.has_company_access(company_id));

CREATE POLICY "Users can insert sales to their company" 
    ON commercial.sales_pipeline FOR INSERT 
    WITH CHECK (tenant.has_company_access(company_id));

CREATE POLICY "Users can update sales of their company" 
    ON commercial.sales_pipeline FOR UPDATE 
    USING (tenant.has_company_access(company_id));

CREATE POLICY "Users can delete sales of their company" 
    ON commercial.sales_pipeline FOR DELETE 
    USING (tenant.has_company_access(company_id));
