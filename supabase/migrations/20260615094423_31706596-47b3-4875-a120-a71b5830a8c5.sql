
-- ====== Portfolios table ======
CREATE TABLE public.portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL UNIQUE,
  display_name text NOT NULL,
  tagline text,
  avatar_url text,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT username_format CHECK (username ~ '^[a-z0-9][a-z0-9-]{1,30}$'),
  CONSTRAINT username_not_reserved CHECK (username NOT IN ('admin','auth','api','u','settings','about','projects','case-studies','blog','contact','login','signup','dashboard','user','users'))
);

GRANT SELECT ON public.portfolios TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolios TO authenticated;
GRANT ALL ON public.portfolios TO service_role;

ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone reads published portfolios" ON public.portfolios
  FOR SELECT USING (is_published OR auth.uid() = owner_id);
CREATE POLICY "owners insert own portfolio" ON public.portfolios
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "owners update own portfolio" ON public.portfolios
  FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "owners delete own portfolio" ON public.portfolios
  FOR DELETE TO authenticated USING (auth.uid() = owner_id);

CREATE TRIGGER portfolios_touch_updated_at BEFORE UPDATE ON public.portfolios
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ====== Seed Richard ======
INSERT INTO public.portfolios (owner_id, username, display_name, tagline, is_published)
VALUES ('76b010aa-1103-4061-9a36-8d7988ef5b71', 'richard', 'Richard Abe', 'Product Designer & Strategist', true);

-- ====== Add owner_id to CMS tables ======
DO $$
DECLARE
  richard uuid := '76b010aa-1103-4061-9a36-8d7988ef5b71';
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'hero','projects','case_studies','blog_posts','experience','certifications',
    'skills','stats','testimonials','marketing_work','nav_links','site_settings'
  ]
  LOOP
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE', t);
    EXECUTE format('UPDATE public.%I SET owner_id = %L', t, richard);
    EXECUTE format('ALTER TABLE public.%I ALTER COLUMN owner_id SET NOT NULL', t);
    EXECUTE format('CREATE INDEX %I ON public.%I(owner_id)', t || '_owner_id_idx', t);
  END LOOP;
END $$;

-- Contact messages: route per portfolio
ALTER TABLE public.contact_messages
  ADD COLUMN portfolio_id uuid REFERENCES public.portfolios(id) ON DELETE CASCADE;
UPDATE public.contact_messages SET portfolio_id = (SELECT id FROM public.portfolios WHERE username = 'richard');
ALTER TABLE public.contact_messages ALTER COLUMN portfolio_id SET NOT NULL;
CREATE INDEX contact_messages_portfolio_id_idx ON public.contact_messages(portfolio_id);

-- Composite uniques on slug per owner
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['projects','case_studies','blog_posts']
  LOOP
    BEGIN
      EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT IF EXISTS %I', t, t || '_slug_key');
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
    EXECUTE format('CREATE UNIQUE INDEX %I ON public.%I(owner_id, slug)', t || '_owner_slug_uidx', t);
  END LOOP;
END $$;

-- ====== Replace policies: ownership + published-portfolio public read ======
DO $$
DECLARE
  t text;
  pol record;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'hero','projects','case_studies','blog_posts','experience','certifications',
    'skills','stats','testimonials','marketing_work','nav_links','site_settings'
  ]
  LOOP
    FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename=t LOOP
      EXECUTE format('DROP POLICY %I ON public.%I', pol.policyname, t);
    END LOOP;
  END LOOP;
END $$;

-- Helper: does this owner have a published portfolio?
CREATE OR REPLACE FUNCTION public.is_portfolio_published(_owner uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.portfolios WHERE owner_id = _owner AND is_published)
$$;

-- Per-table policies
-- Projects / case_studies / blog_posts / experience / certifications / marketing_work
--   public read = portfolio published AND row status published
-- Hero / site_settings / skills / stats / testimonials / nav_links
--   public read = portfolio published (no status column or status not used)
DO $$
DECLARE
  t text;
  has_status boolean;
  has_visible boolean;
  read_qual text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'hero','projects','case_studies','blog_posts','experience','certifications',
    'skills','stats','testimonials','marketing_work','nav_links','site_settings'
  ]
  LOOP
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=t AND column_name='status') INTO has_status;
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=t AND column_name='visible') INTO has_visible;

    read_qual := 'auth.uid() = owner_id OR public.is_portfolio_published(owner_id)';
    IF has_status THEN
      read_qual := 'auth.uid() = owner_id OR (public.is_portfolio_published(owner_id) AND status = ''published'')';
    ELSIF has_visible THEN
      read_qual := 'auth.uid() = owner_id OR (public.is_portfolio_published(owner_id) AND visible)';
    END IF;

    EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT USING (%s)', 'public_read_' || t, t, read_qual);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id)', 'owner_insert_' || t, t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id)', 'owner_update_' || t, t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING (auth.uid() = owner_id)', 'owner_delete_' || t, t);
  END LOOP;
END $$;

-- Contact messages: anyone inserts to any portfolio; only owner reads/updates own
DROP POLICY IF EXISTS "admins manage contact" ON public.contact_messages;
DROP POLICY IF EXISTS "admins read contact" ON public.contact_messages;
DROP POLICY IF EXISTS "anyone submits contact" ON public.contact_messages;

CREATE POLICY "anyone submits contact" ON public.contact_messages
  FOR INSERT WITH CHECK (
    length(btrim(name)) BETWEEN 1 AND 200
    AND length(btrim(message)) BETWEEN 1 AND 5000
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = portfolio_id)
  );
CREATE POLICY "owners read contact" ON public.contact_messages
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = portfolio_id AND p.owner_id = auth.uid())
  );
CREATE POLICY "owners update contact" ON public.contact_messages
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = portfolio_id AND p.owner_id = auth.uid())
  );
CREATE POLICY "owners delete contact" ON public.contact_messages
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = portfolio_id AND p.owner_id = auth.uid())
  );
