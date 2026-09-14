-- Migration: 20260813000003_intelligence_domain.sql
-- Description: AI Provenance, Insights, Recommendations, Decisions, Actions, Outcomes.

-------------------------------------------------------------------------------
-- 1. ENUMS & TYPES
-------------------------------------------------------------------------------
CREATE TYPE intelligence.provenance_status AS ENUM ('VERIFIED', 'LEGACY');
CREATE TYPE intelligence.decision_status AS ENUM ('ACTIVE', 'SUPERSEDED', 'ARCHIVED');
CREATE TYPE intelligence.action_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE intelligence.outcome_type AS ENUM ('QUANTITATIVE', 'QUALITATIVE', 'HYBRID');

-------------------------------------------------------------------------------
-- 2. TABLES
-------------------------------------------------------------------------------

-- 2.1 AI Provenance (Audit trail for AI generations)
CREATE TABLE intelligence.ai_provenance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES tenant.companies(id) ON DELETE CASCADE,
    provider VARCHAR(100) NOT NULL, -- e.g., 'GOOGLE', 'OPENAI', 'LEGACY_FIREBASE'
    model VARCHAR(100) NOT NULL,
    prompt_hash VARCHAR(255),
    context_hash VARCHAR(255),
    status intelligence.provenance_status NOT NULL DEFAULT 'VERIFIED',
    generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    generated_by UUID REFERENCES tenant.users(id) ON DELETE RESTRICT
);

-- 2.2 Insights (Observation Layer)
CREATE TABLE intelligence.insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES tenant.companies(id) ON DELETE CASCADE,
    ai_provenance_id UUID REFERENCES intelligence.ai_provenance(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- 2.3 Recommendations (Proposed Actions)
CREATE TABLE intelligence.recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    insight_id UUID NOT NULL REFERENCES intelligence.insights(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    impact_estimation TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- 2.4 Decisions (Executive Choice - IMMUTABLE)
CREATE TABLE intelligence.decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES tenant.companies(id) ON DELETE CASCADE,
    recommendation_id UUID REFERENCES intelligence.recommendations(id) ON DELETE RESTRICT,
    decided_by UUID NOT NULL REFERENCES tenant.users(id) ON DELETE RESTRICT,
    problem_statement TEXT NOT NULL,
    selected_alternative TEXT NOT NULL,
    rationale TEXT NOT NULL,
    status intelligence.decision_status NOT NULL DEFAULT 'ACTIVE',
    decided_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.5 Action Plans (Execution Layer)
CREATE TABLE intelligence.action_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_id UUID NOT NULL REFERENCES intelligence.decisions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    status intelligence.action_status NOT NULL DEFAULT 'PENDING',
    deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.6 Action Items
CREATE TABLE intelligence.action_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_plan_id UUID NOT NULL REFERENCES intelligence.action_plans(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES tenant.users(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    status intelligence.action_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.7 Outcomes (Feedback Loop)
CREATE TABLE intelligence.outcomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_id UUID NOT NULL REFERENCES intelligence.decisions(id) ON DELETE CASCADE,
    type intelligence.outcome_type NOT NULL,
    expected_result TEXT,
    actual_result TEXT,
    executive_review TEXT,
    reviewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_by UUID REFERENCES tenant.users(id) ON DELETE RESTRICT
);

-------------------------------------------------------------------------------
-- 3. INTEGRITY PROTECTIONS (TRIGGERS)
-------------------------------------------------------------------------------

-- Prevent modifying decisions (Historical Integrity)
CREATE OR REPLACE FUNCTION intelligence.prevent_decision_modification()
RETURNS TRIGGER AS $$
BEGIN
    -- Only allow status changes (e.g. archiving/superseding)
    IF NEW.problem_statement != OLD.problem_statement OR NEW.selected_alternative != OLD.selected_alternative OR NEW.rationale != OLD.rationale THEN
        RAISE EXCEPTION 'Decisions are immutable. You must supersede the decision with a new one.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_immutable_decisions
BEFORE UPDATE ON intelligence.decisions
FOR EACH ROW EXECUTE FUNCTION intelligence.prevent_decision_modification();

-- Prevent DELETE on Decisions
CREATE OR REPLACE FUNCTION intelligence.prevent_decision_deletion()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Decisions cannot be deleted. Use status = ARCHIVED or SUPERSEDED.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_no_delete_decisions
BEFORE DELETE ON intelligence.decisions
FOR EACH ROW EXECUTE FUNCTION intelligence.prevent_decision_deletion();

-------------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS)
-------------------------------------------------------------------------------
ALTER TABLE intelligence.ai_provenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence.insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence.decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence.action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence.action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence.outcomes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Access provenance via company" ON intelligence.ai_provenance
    FOR ALL USING (tenant.has_company_access(company_id));

CREATE POLICY "Access insights via company" ON intelligence.insights
    FOR ALL USING (tenant.has_company_access(company_id));

CREATE POLICY "Access recommendations via insight" ON intelligence.recommendations
    FOR ALL USING (
        tenant.has_company_access((SELECT company_id FROM intelligence.insights WHERE id = insight_id))
    );

CREATE POLICY "Access decisions via company" ON intelligence.decisions
    FOR ALL USING (tenant.has_company_access(company_id));

CREATE POLICY "Access action_plans via decision" ON intelligence.action_plans
    FOR ALL USING (
        tenant.has_company_access((SELECT company_id FROM intelligence.decisions WHERE id = decision_id))
    );

CREATE POLICY "Access action_items via action_plan" ON intelligence.action_items
    FOR ALL USING (
        tenant.has_company_access((
            SELECT d.company_id 
            FROM intelligence.action_plans ap 
            JOIN intelligence.decisions d ON d.id = ap.decision_id 
            WHERE ap.id = action_plan_id
        ))
    );

CREATE POLICY "Access outcomes via decision" ON intelligence.outcomes
    FOR ALL USING (
        tenant.has_company_access((SELECT company_id FROM intelligence.decisions WHERE id = decision_id))
    );
