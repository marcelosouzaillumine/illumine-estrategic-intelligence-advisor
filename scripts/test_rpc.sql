CREATE OR REPLACE FUNCTION tenant.get_my_external_id()
RETURNS text AS $$
BEGIN
    RETURN tenant.current_external_user_id();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
