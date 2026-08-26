CREATE OR REPLACE FUNCTION tenant.get_my_external_id()
RETURNS text AS $$
BEGIN
    RETURN current_setting('request.jwt.claim.sub', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
