CREATE OR REPLACE FUNCTION public.debug_jwt()
RETURNS jsonb AS $$
BEGIN
    RETURN current_setting('request.jwt.claims', true)::jsonb;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
