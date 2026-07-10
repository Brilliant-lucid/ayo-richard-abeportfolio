
-- Extend content_status enum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel='unlisted' AND enumtypid = 'public.content_status'::regtype) THEN
    ALTER TYPE public.content_status ADD VALUE 'unlisted';
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel='archived' AND enumtypid = 'public.content_status'::regtype) THEN
    ALTER TYPE public.content_status ADD VALUE 'archived';
  END IF;
END $$;

-- Additive columns on projects
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS roles text[],
  ADD COLUMN IF NOT EXISTS image_alt text,
  ADD COLUMN IF NOT EXISTS gallery jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS start_date date,
  ADD COLUMN IF NOT EXISTS end_date date,
  ADD COLUMN IF NOT EXISTS ongoing boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS additional_links jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS overview text,
  ADD COLUMN IF NOT EXISTS challenge text,
  ADD COLUMN IF NOT EXISTS goals text,
  ADD COLUMN IF NOT EXISTS constraints text,
  ADD COLUMN IF NOT EXISTS learnings text,
  ADD COLUMN IF NOT EXISTS metrics jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS visibility text DEFAULT 'public',
  ADD COLUMN IF NOT EXISTS publish_date timestamptz,
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS social_image_url text,
  ADD COLUMN IF NOT EXISTS canonical_url text,
  ADD COLUMN IF NOT EXISTS index_allowed boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz;

-- Backfill new fields from legacy columns
UPDATE public.projects SET title = name WHERE title IS NULL;
UPDATE public.projects SET overview = description WHERE overview IS NULL AND description IS NOT NULL;
UPDATE public.projects SET challenge = problem WHERE challenge IS NULL AND problem IS NOT NULL;
UPDATE public.projects
  SET roles = ARRAY(SELECT trim(x) FROM regexp_split_to_table(role, ',') AS x WHERE trim(x) <> '')
  WHERE roles IS NULL AND role IS NOT NULL AND role <> '';
