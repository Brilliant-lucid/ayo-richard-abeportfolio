
ALTER TABLE public.hero
  ADD COLUMN IF NOT EXISTS headline text,
  ADD COLUMN IF NOT EXISTS availability text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS years_experience integer,
  ADD COLUMN IF NOT EXISTS industries text[],
  ADD COLUMN IF NOT EXISTS expertise text[],
  ADD COLUMN IF NOT EXISTS mission text,
  ADD COLUMN IF NOT EXISTS bio text;

ALTER TABLE public.testimonials
  ADD COLUMN IF NOT EXISTS company text,
  ADD COLUMN IF NOT EXISTS rating integer;

ALTER TABLE public.certifications
  ADD COLUMN IF NOT EXISTS expires_on date,
  ADD COLUMN IF NOT EXISTS credential_id text;

ALTER TABLE public.experience
  ADD COLUMN IF NOT EXISTS employment_type text,
  ADD COLUMN IF NOT EXISTS achievements text[];

CREATE TABLE IF NOT EXISTS public.awards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  organization text,
  awarded_on date,
  description text,
  image_url text,
  link text,
  display_order integer NOT NULL DEFAULT 0,
  status public.content_status NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.awards TO authenticated;
GRANT SELECT ON public.awards TO anon;
GRANT ALL ON public.awards TO service_role;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_awards" ON public.awards FOR SELECT USING ((auth.uid() = owner_id) OR (public.is_portfolio_published(owner_id) AND status = 'published'::public.content_status));
CREATE POLICY "owner_insert_awards" ON public.awards FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "owner_update_awards" ON public.awards FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "owner_delete_awards" ON public.awards FOR DELETE TO authenticated USING (auth.uid() = owner_id);

CREATE TABLE IF NOT EXISTS public.publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  kind text NOT NULL DEFAULT 'article',
  outlet text,
  published_on date,
  description text,
  url text,
  image_url text,
  display_order integer NOT NULL DEFAULT 0,
  status public.content_status NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.publications TO authenticated;
GRANT SELECT ON public.publications TO anon;
GRANT ALL ON public.publications TO service_role;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_publications" ON public.publications FOR SELECT USING ((auth.uid() = owner_id) OR (public.is_portfolio_published(owner_id) AND status = 'published'::public.content_status));
CREATE POLICY "owner_insert_publications" ON public.publications FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "owner_update_publications" ON public.publications FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "owner_delete_publications" ON public.publications FOR DELETE TO authenticated USING (auth.uid() = owner_id);
