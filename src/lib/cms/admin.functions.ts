import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function adminClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

// ===== Projects =====
const projectSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  summary: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  problem: z.string().nullable().optional(),
  solution: z.string().nullable().optional(),
  process: z.string().nullable().optional(),
  results: z.string().nullable().optional(),
  tools: z.array(z.string()).nullable().optional(),
  role: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  live_link: z.string().nullable().optional(),
  case_study_link: z.string().nullable().optional(),
  featured_image_url: z.string().nullable().optional(),
  featured: z.boolean().default(false),
  display_order: z.number().int().default(0),
  bento_size: z.enum(["small", "medium", "large", "wide", "tall"]).default("small"),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const listAllProjects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = await adminClient();
    const { data } = await sb
      .from("projects")
      .select("*")
      .eq("owner_id", context.userId)
      .order("display_order");
    return data ?? [];
  });

export const getProjectById = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const sb = await adminClient();
    const { data: row } = await sb
      .from("projects")
      .select("*")
      .eq("id", data.id)
      .eq("owner_id", context.userId)
      .maybeSingle();
    return row;
  });

export const upsertProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => projectSchema.parse(d))
  .handler(async ({ data, context }) => {
    const sb = await adminClient();
    const { id, ...rest } = data;
    if (id) {
      const { error } = await sb
        .from("projects")
        .update(rest)
        .eq("id", id)
        .eq("owner_id", context.userId);
      if (error) throw new Error(error.message);
      return { id };
    }
    const { data: inserted, error } = await sb
      .from("projects")
      .insert({ ...rest, owner_id: context.userId })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: inserted.id };
  });

export const deleteProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const sb = await adminClient();
    const { error } = await sb
      .from("projects")
      .delete()
      .eq("id", data.id)
      .eq("owner_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ===== Hero =====
const heroSchema = z.object({
  id: z.string().uuid().optional(),
  eyebrow: z.string().nullable().optional(),
  heading: z.string().min(1),
  intro: z.string().nullable().optional(),
  profile_image_url: z.string().nullable().optional(),
  cta_primary_label: z.string().nullable().optional(),
  cta_primary_href: z.string().nullable().optional(),
  cta_secondary_label: z.string().nullable().optional(),
  cta_secondary_href: z.string().nullable().optional(),
});

export const updateHero = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => heroSchema.parse(d))
  .handler(async ({ data, context }) => {
    const sb = await adminClient();
    const { id: _ignore, ...rest } = data;
    const { data: existing } = await sb
      .from("hero")
      .select("id")
      .eq("owner_id", context.userId)
      .maybeSingle();
    if (existing) {
      const { error } = await sb
        .from("hero")
        .update(rest)
        .eq("id", existing.id)
        .eq("owner_id", context.userId);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await sb
        .from("hero")
        .insert({ ...rest, owner_id: context.userId });
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

// ===== Site settings =====
const settingsSchema = z.object({
  id: z.string().uuid().optional(),
  site_name: z.string().min(1),
  email: z.string().nullable().optional(),
  linkedin_url: z.string().nullable().optional(),
  github_url: z.string().nullable().optional(),
  twitter_url: z.string().nullable().optional(),
  whatsapp_url: z.string().nullable().optional(),
  default_seo_title: z.string().nullable().optional(),
  default_seo_description: z.string().nullable().optional(),
  logo_url: z.string().nullable().optional(),
});

export const updateSiteSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => settingsSchema.parse(d))
  .handler(async ({ data, context }) => {
    const sb = await adminClient();
    const { id: _ignore, ...rest } = data;
    const { data: existing } = await sb
      .from("site_settings")
      .select("id")
      .eq("owner_id", context.userId)
      .maybeSingle();
    if (existing) {
      const { error } = await sb
        .from("site_settings")
        .update(rest)
        .eq("id", existing.id)
        .eq("owner_id", context.userId);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await sb
        .from("site_settings")
        .insert({ ...rest, owner_id: context.userId });
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

// ===== Messages =====
async function ownerPortfolioId(sb: any, userId: string): Promise<string | null> {
  const { data } = await sb
    .from("portfolios")
    .select("id")
    .eq("owner_id", userId)
    .maybeSingle();
  return data?.id ?? null;
}

export const listMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = await adminClient();
    const pid = await ownerPortfolioId(sb, context.userId);
    if (!pid) return [];
    const { data } = await sb
      .from("contact_messages")
      .select("*")
      .eq("portfolio_id", pid)
      .order("created_at", { ascending: false });
    return data ?? [];
  });

export const markMessageRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid(), read: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    const sb = await adminClient();
    const pid = await ownerPortfolioId(sb, context.userId);
    if (!pid) throw new Error("No portfolio");
    const { error } = await sb
      .from("contact_messages")
      .update({ read: data.read })
      .eq("id", data.id)
      .eq("portfolio_id", pid);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ===== Media upload =====
export const uploadMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => {
    if (!(d instanceof FormData)) throw new Error("Expected FormData");
    return d;
  })
  .handler(async ({ data, context }) => {
    const file = data.get("file");
    if (!(file instanceof File)) throw new Error("No file");
    const sb = await adminClient();
    const ext = file.name.split(".").pop() || "bin";
    const path = `${context.userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const buf = new Uint8Array(await file.arrayBuffer());
    const { error } = await sb.storage.from("media").upload(path, buf, {
      contentType: file.type || undefined,
      upsert: false,
    });
    if (error) throw new Error(error.message);
    const { data: signed, error: signErr } = await sb.storage
      .from("media")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    if (signErr) throw new Error(signErr.message);
    return { url: signed.signedUrl, path };
  });

// ===== Blog =====
const blogSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  featured_image_url: z.string().nullable().optional(),
  seo_title: z.string().nullable().optional(),
  seo_description: z.string().nullable().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  published_at: z.string().nullable().optional(),
});

export const listAllBlogPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = await adminClient();
    const { data } = await sb
      .from("blog_posts")
      .select("*")
      .eq("owner_id", context.userId)
      .order("created_at", { ascending: false });
    return data ?? [];
  });

export const getBlogPostById = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const sb = await adminClient();
    const { data: row } = await sb
      .from("blog_posts")
      .select("*")
      .eq("id", data.id)
      .eq("owner_id", context.userId)
      .maybeSingle();
    return row;
  });

export const upsertBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => blogSchema.parse(d))
  .handler(async ({ data, context }) => {
    const sb = await adminClient();
    const { id, ...rest } = data;
    const payload: any = { ...rest };
    if (payload.status === "published" && !payload.published_at) {
      payload.published_at = new Date().toISOString();
    }
    if (id) {
      const { error } = await sb
        .from("blog_posts")
        .update(payload)
        .eq("id", id)
        .eq("owner_id", context.userId);
      if (error) throw new Error(error.message);
      return { id };
    }
    const { data: inserted, error } = await sb
      .from("blog_posts")
      .insert({ ...payload, owner_id: context.userId })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: inserted.id };
  });

export const deleteBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const sb = await adminClient();
    const { error } = await sb
      .from("blog_posts")
      .delete()
      .eq("id", data.id)
      .eq("owner_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ===== Own hero / settings for editors =====
export const getMyHero = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = await adminClient();
    const { data } = await sb.from("hero").select("*").eq("owner_id", context.userId).maybeSingle();
    return data;
  });

export const getMySiteSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = await adminClient();
    const { data } = await sb.from("site_settings").select("*").eq("owner_id", context.userId).maybeSingle();
    return data;
  });
