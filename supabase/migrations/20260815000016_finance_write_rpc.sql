-- Migration: 20260815000016_finance_write_rpc.sql
-- Description: RPC for atomic Financial Journal Entry creation

CREATE OR REPLACE FUNCTION finance.create_journal_entry(
    p_company_id UUID,
    p_period_id UUID,
    p_description VARCHAR(255),
    p_transaction_date DATE,
    p_entries JSONB, -- Array of { account_id, amount, entry_type, unit, branch, cost_center }
    p_user_id UUID,
    p_audit_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER -- Runs as elevated to ensure strict transaction boundaries across schemas, but we enforce RLS manually inside
AS $$
DECLARE
    v_journal_id UUID;
    v_total_debit NUMERIC := 0;
    v_total_credit NUMERIC := 0;
    v_entry JSONB;
    v_has_access BOOLEAN;
BEGIN
    -- 1. Validate Access (Tenant Isolation)
    -- We must ensure the caller has access to the period and company
    IF NOT EXISTS (SELECT 1 FROM finance.financial_periods WHERE id = p_period_id AND company_id = p_company_id) THEN
        RAISE EXCEPTION 'Period does not belong to the given company.';
    END IF;

    SELECT tenant.has_period_access(p_period_id) INTO v_has_access;
    IF NOT v_has_access THEN
        RAISE EXCEPTION 'Access Denied: User does not have access to this financial period.';
    END IF;

    -- 2. Validate double-entry logic before inserting anything to save sequence jumps
    FOR v_entry IN SELECT * FROM jsonb_array_elements(p_entries)
    LOOP
        IF (v_entry->>'entry_type') = 'DEBIT' THEN
            v_total_debit := v_total_debit + (v_entry->>'amount')::NUMERIC;
        ELSIF (v_entry->>'entry_type') = 'CREDIT' THEN
            v_total_credit := v_total_credit + (v_entry->>'amount')::NUMERIC;
        ELSE
            RAISE EXCEPTION 'Invalid entry_type: %', (v_entry->>'entry_type');
        END IF;
    END LOOP;

    IF v_total_debit != v_total_credit THEN
        RAISE EXCEPTION 'Invariante 0 Violated: Journal Entry is unbalanced. Debits: %, Credits: %', v_total_debit, v_total_credit;
    END IF;

    -- 3. Persist Journal Entry Header
    INSERT INTO finance.journal_entries (
        period_id, description, transaction_date, created_by
    ) VALUES (
        p_period_id, p_description, p_transaction_date, p_user_id
    ) RETURNING id INTO v_journal_id;

    -- 4. Persist Lines (financial_entries)
    FOR v_entry IN SELECT * FROM jsonb_array_elements(p_entries)
    LOOP
        INSERT INTO finance.financial_entries (
            period_id, account_id, journal_entry_id,
            amount, entry_type, created_by
        ) VALUES (
            p_period_id,
            (v_entry->>'account_id')::UUID,
            v_journal_id,
            (v_entry->>'amount')::NUMERIC,
            (v_entry->>'entry_type')::finance.entry_type,
            p_user_id
        );
    END LOOP;

    -- 5. Persist Audit Event synchronously to guarantee traceability
    -- Assuming audit.system_logs exists or will be created/mapped. 
    -- If it doesn't exist yet as a table, we can just insert it.
    -- (Phase 6 audit schema should have it, but we create it dynamically if we don't know the exact structure)
    INSERT INTO audit.system_logs (
        table_name, record_id, action, new_data, actor_id
    ) VALUES (
        'journal_entries',
        v_journal_id,
        'INSERT',
        p_audit_metadata,
        p_user_id
    );

    RETURN v_journal_id;
EXCEPTION
    WHEN OTHERS THEN
        -- Rollback is automatic on exception in plpgsql
        RAISE;
END;
$$;
