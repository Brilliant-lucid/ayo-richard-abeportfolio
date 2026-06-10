
DROP POLICY IF EXISTS "anyone submits contact" ON public.contact_messages;
CREATE POLICY "anyone submits contact" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(trim(name)) BETWEEN 1 AND 200
    AND length(trim(message)) BETWEEN 1 AND 5000
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;
