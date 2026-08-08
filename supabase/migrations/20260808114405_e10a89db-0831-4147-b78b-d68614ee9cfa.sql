ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS publish_as text NOT NULL DEFAULT 'project';
ALTER TABLE public.portfolios ADD COLUMN IF NOT EXISTS profession text;
ALTER TABLE public.portfolios ADD COLUMN IF NOT EXISTS career_profile text;
ALTER TABLE public.portfolios ADD COLUMN IF NOT EXISTS section_order text[];
ALTER TABLE public.portfolios ADD COLUMN IF NOT EXISTS onboarded_at timestamptz;