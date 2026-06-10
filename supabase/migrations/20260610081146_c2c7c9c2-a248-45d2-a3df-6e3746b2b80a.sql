
-- =========================================================
-- ROLES
-- =========================================================
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin'::public.app_role)
$$;

-- shared updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END $$;

-- =========================================================
-- SITE SETTINGS (singleton)
-- =========================================================
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text NOT NULL DEFAULT 'Ayo Richard Abe',
  logo_url text,
  favicon_url text,
  primary_color text DEFAULT '#3b82f6',
  email text,
  linkedin_url text,
  github_url text,
  twitter_url text,
  whatsapp_url text,
  default_seo_title text,
  default_seo_description text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads site settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write site settings" ON public.site_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER touch_site_settings BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================================
-- HERO (singleton)
-- =========================================================
CREATE TABLE public.hero (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  eyebrow text DEFAULT 'Product Manager · Developer · Marketer',
  heading text NOT NULL DEFAULT 'Ayo Richard Abe builds products that define market categories.',
  intro text DEFAULT 'Merging technical depth with growth frameworks to bridge engineering complexity and user desire.',
  profile_image_url text,
  cta_primary_label text DEFAULT 'View My Work',
  cta_primary_href text DEFAULT '/projects',
  cta_secondary_label text DEFAULT 'Contact Me',
  cta_secondary_href text DEFAULT '/contact',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hero TO anon, authenticated;
GRANT ALL ON public.hero TO service_role;
ALTER TABLE public.hero ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads hero" ON public.hero FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write hero" ON public.hero FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER touch_hero BEFORE UPDATE ON public.hero FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================================
-- STATS
-- =========================================================
CREATE TABLE public.stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.stats TO anon, authenticated;
GRANT ALL ON public.stats TO service_role;
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads stats" ON public.stats FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write stats" ON public.stats FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- =========================================================
-- PROJECTS
-- =========================================================
CREATE TYPE public.content_status AS ENUM ('draft', 'published');

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  featured_image_url text,
  summary text,
  description text,
  problem text,
  solution text,
  process text,
  results text,
  tools text[],
  role text,
  category text,
  live_link text,
  case_study_link text,
  related_projects uuid[],
  featured boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 0,
  bento_size text NOT NULL DEFAULT 'small',
  status public.content_status NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT ALL ON public.projects TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.projects TO authenticated;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads published projects" ON public.projects FOR SELECT TO anon, authenticated USING (status = 'published' OR public.is_admin());
CREATE POLICY "admins write projects" ON public.projects FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER touch_projects BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================================
-- CASE STUDIES
-- =========================================================
CREATE TABLE public.case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  cover_image_url text,
  summary text,
  challenge text,
  research text,
  strategy text,
  execution text,
  outcome text,
  lessons text,
  related_projects uuid[],
  external_links jsonb,
  category text,
  status public.content_status NOT NULL DEFAULT 'draft',
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.case_studies TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.case_studies TO authenticated;
GRANT ALL ON public.case_studies TO service_role;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads published case studies" ON public.case_studies FOR SELECT TO anon, authenticated USING (status = 'published' OR public.is_admin());
CREATE POLICY "admins write case studies" ON public.case_studies FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER touch_case_studies BEFORE UPDATE ON public.case_studies FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================================
-- BLOG POSTS
-- =========================================================
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  featured_image_url text,
  excerpt text,
  content text,
  category text,
  tags text[],
  related_project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  related_case_study_id uuid REFERENCES public.case_studies(id) ON DELETE SET NULL,
  seo_title text,
  seo_description text,
  status public.content_status NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads published blog" ON public.blog_posts FOR SELECT TO anon, authenticated USING (status = 'published' OR public.is_admin());
CREATE POLICY "admins write blog" ON public.blog_posts FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER touch_blog_posts BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================================
-- TESTIMONIALS
-- =========================================================
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  quote text NOT NULL,
  relationship text,
  image_url text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- =========================================================
-- NAV LINKS
-- =========================================================
CREATE TABLE public.nav_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  href text NOT NULL,
  display_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.nav_links TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.nav_links TO authenticated;
GRANT ALL ON public.nav_links TO service_role;
ALTER TABLE public.nav_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads nav links" ON public.nav_links FOR SELECT TO anon, authenticated USING (visible OR public.is_admin());
CREATE POLICY "admins write nav links" ON public.nav_links FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- =========================================================
-- EXPERIENCE
-- =========================================================
CREATE TABLE public.experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization text NOT NULL,
  role text NOT NULL,
  start_date date,
  end_date date,
  description text,
  responsibilities text[],
  skills_gained text[],
  logo_url text,
  display_order int NOT NULL DEFAULT 0,
  status public.content_status NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.experience TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.experience TO authenticated;
GRANT ALL ON public.experience TO service_role;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads published experience" ON public.experience FOR SELECT TO anon, authenticated USING (status = 'published' OR public.is_admin());
CREATE POLICY "admins write experience" ON public.experience FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- =========================================================
-- SKILLS
-- =========================================================
CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  description text,
  proficiency int,
  icon_url text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.skills TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.skills TO authenticated;
GRANT ALL ON public.skills TO service_role;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads skills" ON public.skills FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write skills" ON public.skills FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- =========================================================
-- CERTIFICATIONS
-- =========================================================
CREATE TABLE public.certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  issuer text NOT NULL,
  issued_on date,
  credential_url text,
  description text,
  image_url text,
  display_order int NOT NULL DEFAULT 0,
  status public.content_status NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.certifications TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.certifications TO authenticated;
GRANT ALL ON public.certifications TO service_role;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads published certifications" ON public.certifications FOR SELECT TO anon, authenticated USING (status = 'published' OR public.is_admin());
CREATE POLICY "admins write certifications" ON public.certifications FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- =========================================================
-- MARKETING WORK
-- =========================================================
CREATE TABLE public.marketing_work (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text,
  summary text,
  description text,
  metrics jsonb,
  image_url text,
  external_link text,
  display_order int NOT NULL DEFAULT 0,
  status public.content_status NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.marketing_work TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.marketing_work TO authenticated;
GRANT ALL ON public.marketing_work TO service_role;
ALTER TABLE public.marketing_work ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads published marketing" ON public.marketing_work FOR SELECT TO anon, authenticated USING (status = 'published' OR public.is_admin());
CREATE POLICY "admins write marketing" ON public.marketing_work FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER touch_marketing_work BEFORE UPDATE ON public.marketing_work FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================================
-- CONTACT MESSAGES
-- =========================================================
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone submits contact" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read contact" ON public.contact_messages FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admins manage contact" ON public.contact_messages FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
