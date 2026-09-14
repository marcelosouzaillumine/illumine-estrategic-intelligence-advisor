CREATE OR REPLACE FUNCTION tenant.get_my_external_id()
RETURNS text AS $$
BEGIN
    RETURN current_setting('request.jwt.claims', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
