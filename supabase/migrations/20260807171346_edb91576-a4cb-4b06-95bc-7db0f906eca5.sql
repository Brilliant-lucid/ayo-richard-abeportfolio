CREATE TYPE public.service_category AS ENUM ('consultation','freelance','coaching','mentorship','training','workshop','speaking','audit','creative','technical','custom');
CREATE TYPE public.service_pricing_type AS ENUM ('fixed','starting_from','custom_quote','free');
CREATE TYPE public.service_location AS ENUM ('online','onsite','hybrid');
CREATE TYPE public.service_status AS ENUM ('active','disabled','archived');

CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  category public.service_category NOT NULL DEFAULT 'custom',
  short_description text,
  detailed_description text,
  cover_image_url text,
  starting_price numeric,
  currency text NOT NULL DEFAULT 'USD',
  pricing_type public.service_pricing_type NOT NULL DEFAULT 'custom_quote',
  duration text,
  delivery_time text,
  location public.service_location NOT NULL DEFAULT 'online',
  availability text,
  featured boolean NOT NULL DEFAULT false,
  accepting_requests boolean NOT NULL DEFAULT true,
  action_label text,
  status public.service_status NOT NULL DEFAULT 'active',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "services_public_read" ON public.services FOR SELECT
  USING (status = 'active' AND public.is_portfolio_published(owner_id));
CREATE POLICY "services_owner_read" ON public.services FOR SELECT TO authenticated
  USING (auth.uid() = owner_id);
CREATE POLICY "services_owner_insert" ON public.services FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "services_owner_update" ON public.services FOR UPDATE TO authenticated
  USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "services_owner_delete" ON public.services FOR DELETE TO authenticated
  USING (auth.uid() = owner_id);

CREATE TRIGGER touch_services BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX services_owner_idx ON public.services (owner_id, display_order);

CREATE TABLE public.service_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  kind text NOT NULL DEFAULT 'general',
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.service_inquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_inquiries TO authenticated;
GRANT ALL ON public.service_inquiries TO service_role;
ALTER TABLE public.service_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inquiries_public_insert" ON public.service_inquiries FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = portfolio_id AND p.is_published));
CREATE POLICY "inquiries_owner_read" ON public.service_inquiries FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = portfolio_id AND p.owner_id = auth.uid()));
CREATE POLICY "inquiries_owner_update" ON public.service_inquiries FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = portfolio_id AND p.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = portfolio_id AND p.owner_id = auth.uid()));
CREATE POLICY "inquiries_owner_delete" ON public.service_inquiries FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = portfolio_id AND p.owner_id = auth.uid()));

CREATE TRIGGER touch_service_inquiries BEFORE UPDATE ON public.service_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX service_inquiries_portfolio_idx ON public.service_inquiries (portfolio_id, created_at DESC);
CREATE INDEX service_inquiries_service_idx ON public.service_inquiries (service_id);