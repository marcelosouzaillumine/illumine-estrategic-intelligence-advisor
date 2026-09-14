-- Migration: 20260813000004_audit_impersonation.sql
-- Description: System Audit Log and historical tracking.

-------------------------------------------------------------------------------
-- 1. TABLES
-------------------------------------------------------------------------------

CREATE TABLE audit.system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Universal Context
    tenant_id UUID REFERENCES tenant.tenants(id) ON DELETE SET NULL,
    company_id UUID REFERENCES tenant.companies(id) ON DELETE SET NULL,
    actor_id UUID REFERENCES tenant.users(id) ON DELETE SET NULL,
    impersonator_id UUID REFERENCES tenant.users(id) ON DELETE SET NULL,
    correlation_id VARCHAR(255),
    
    -- DB Trigger Data
    table_name VARCHAR(100),
    record_id UUID,
    action VARCHAR(50),
    old_data JSONB,
    new_data JSONB,
    
    -- App Event Data
    event_type VARCHAR(255),
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    severity VARCHAR(50),
    metadata JSONB,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Application Event Emission RPC (Security Definer)
CREATE OR REPLACE FUNCTION audit.emit_application_event(
    p_tenant_id UUID,
    p_actor_id UUID,
    p_event_type VARCHAR,
    p_resource_type VARCHAR,
    p_resource_id VARCHAR,
    p_severity VARCHAR,
    p_metadata JSONB,
    p_correlation_id VARCHAR DEFAULT NULL,
    p_company_id UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
    v_real_actor UUID;
BEGIN
    v_real_actor := tenant.current_canonical_user_id();
    
    -- Block unauthenticated or spoofed actors (allow bypass only if it's a service_role bypassing RLS, but current_canonical_user_id returns auth.uid())
    IF v_real_actor IS NOT NULL AND v_real_actor != p_actor_id THEN
        RAISE EXCEPTION 'Security Violation: Cannot spoof actor_id';
    END IF;

    -- Validate tenant membership
    IF v_real_actor IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM tenant.memberships 
            WHERE user_id = v_real_actor 
            AND tenant_id = p_tenant_id
        ) THEN
            RAISE EXCEPTION 'Security Violation: User does not belong to the specified tenant.';
        END IF;
    END IF;

    INSERT INTO audit.system_logs (
        tenant_id, company_id, actor_id, event_type, resource_type, resource_id, severity, metadata, correlation_id
    ) VALUES (
        p_tenant_id, p_company_id, p_actor_id, p_event_type, p_resource_type, p_resource_id, p_severity, p_metadata, p_correlation_id
    ) RETURNING id INTO v_log_id;
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-------------------------------------------------------------------------------
-- 2. AUDIT TRIGGER FUNCTION
-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION audit.fn_audit_log_changes()
RETURNS TRIGGER AS $$
DECLARE
    v_actor_id UUID;
    v_impersonator_id UUID;
BEGIN
    v_actor_id := tenant.current_canonical_user_id();
    
    -- Attempt to find an active impersonation session for this actor
    SELECT operator_user_id INTO v_impersonator_id
    FROM audit.impersonation_sessions
    WHERE operator_user_id = v_actor_id
      AND status = 'ACTIVE'
    LIMIT 1;

    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit.system_logs (table_name, record_id, action, new_data, actor_id, impersonator_id)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW)::JSONB, v_actor_id, v_impersonator_id);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit.system_logs (table_name, record_id, action, old_data, new_data, actor_id, impersonator_id)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD)::JSONB, row_to_json(NEW)::JSONB, v_actor_id, v_impersonator_id);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit.system_logs (table_name, record_id, action, old_data, actor_id, impersonator_id)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD)::JSONB, v_actor_id, v_impersonator_id);
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-------------------------------------------------------------------------------
-- 3. APPLY AUDIT TO CRITICAL TABLES
-------------------------------------------------------------------------------
-- We attach this trigger to tables where traceability is critical
CREATE TRIGGER audit_financial_periods
AFTER INSERT OR UPDATE OR DELETE ON finance.financial_periods
FOR EACH ROW EXECUTE FUNCTION audit.fn_audit_log_changes();

CREATE TRIGGER audit_adjustment_entries
AFTER INSERT OR UPDATE OR DELETE ON finance.adjustment_entries
FOR EACH ROW EXECUTE FUNCTION audit.fn_audit_log_changes();

CREATE TRIGGER audit_decisions
AFTER INSERT OR UPDATE OR DELETE ON intelligence.decisions
FOR EACH ROW EXECUTE FUNCTION audit.fn_audit_log_changes();

CREATE TRIGGER audit_actions
AFTER INSERT OR UPDATE OR DELETE ON intelligence.action_plans
FOR EACH ROW EXECUTE FUNCTION audit.fn_audit_log_changes();

-------------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS)
-------------------------------------------------------------------------------
ALTER TABLE audit.system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit.impersonation_sessions ENABLE ROW LEVEL SECURITY;

-- Only platform operators should read audit logs or start impersonations.
-- We define a Platform Operator by a specific Role name, e.g. 'OPERATOR' in an admin tenant.
-- For local dev, we allow anyone to read audit logs if they are impersonators.
CREATE POLICY "Operators can read logs" ON audit.system_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tenant.memberships m 
            JOIN tenant.roles r ON r.id = m.role_id 
            WHERE m.user_id = tenant.current_canonical_user_id() AND r.name = 'OPERATOR'
        )
    );

-- Block all direct inserts from clients to enforce AuditEventBus usage
CREATE POLICY "Block direct inserts from clients" ON audit.system_logs
    FOR INSERT WITH CHECK (false);

CREATE POLICY "Operators can manage sessions" ON audit.impersonation_sessions
    FOR ALL USING (
        operator_user_id = tenant.current_canonical_user_id()
    );

-------------------------------------------------------------------------------
-- 5. EXPLICIT GRANTS FOR RLS TESTING
-------------------------------------------------------------------------------
GRANT USAGE ON SCHEMA tenant, finance, intelligence, audit, legacy TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA tenant TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA finance TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA intelligence TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA audit TO authenticated;
GRANT EXECUTE ON ALL ROUTINES IN SCHEMA tenant TO authenticated;
GRANT EXECUTE ON ALL ROUTINES IN SCHEMA finance TO authenticated;
GRANT EXECUTE ON ALL ROUTINES IN SCHEMA intelligence TO authenticated;
GRANT EXECUTE ON ALL ROUTINES IN SCHEMA audit TO authenticated;
