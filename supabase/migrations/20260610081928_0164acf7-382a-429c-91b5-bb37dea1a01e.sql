
-- Bootstrap function: lets the first authenticated user claim admin role
CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_count int;
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RETURN false;
  END IF;
  SELECT count(*) INTO admin_count FROM public.user_roles WHERE role = 'admin';
  IF admin_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (uid, 'admin')
      ON CONFLICT (user_id, role) DO NOTHING;
    RETURN true;
  END IF;
  RETURN false;
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;

-- Storage RLS for media bucket
DO $$ BEGIN
  CREATE POLICY "Public read media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Admins write media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Admins update media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Admins delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
