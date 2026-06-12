import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function adminClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function assertAdmin(userId: string) {
  const sb = await adminClient();
  const { data, error } = await sb
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = await adminClient();
    const { data } = await sb
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data, userId: context.userId };
  });

export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("claim_first_admin");
    if (error) throw new Error(error.message);
    return { claimed: !!data };
  });

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
    await assertAdmin(context.userId);
    const sb = await adminClient();
    const { data } = await sb.from("projects").select("*").order("display_order");
    return data ?? [];
  });

export const getProjectById = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const sb = await adminClient();
    const { data: row } = await sb.from("projects").select("*").eq("id", data.id).maybeSingle();
    return row;
  });

export const upsertProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => projectSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const sb = await adminClient();
    const { id, ...rest } = data;
    if (id) {
      const { error } = await sb.from("projects").update(rest).eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }
    const { data: inserted, error } = await sb.from("projects").insert(rest).select("id").single();
    if (error) throw new Error(error.message);
    return { id: inserted.id };
  });

export const deleteProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const sb = await adminClient();
    const { error } = await sb.from("projects").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ===== Hero =====
const heroSchema = z.object({
  id: z.string().uuid(),
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
    await assertAdmin(context.userId);
    const sb = await adminClient();
    const { id, ...rest } = data;
    const { error } = await sb.from("hero").update(rest).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ===== Site settings =====
const settingsSchema = z.object({
  id: z.string().uuid(),
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
    await assertAdmin(context.userId);
    const sb = await adminClient();
    const { id, ...rest } = data;
    const { error } = await sb.from("site_settings").update(rest).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ===== Messages =====
export const listMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const sb = await adminClient();
    const { data } = await sb.from("contact_messages").select("*").order("created_at", { ascending: false });
    return data ?? [];
  });

export const markMessageRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid(), read: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const sb = await adminClient();
    const { error } = await sb.from("contact_messages").update({ read: data.read }).eq("id", data.id);
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
    await assertAdmin(context.userId);
    const file = data.get("file");
    if (!(file instanceof File)) throw new Error("No file");
    const sb = await adminClient();
    const ext = file.name.split(".").pop() || "bin";
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const buf = new Uint8Array(await file.arrayBuffer());
    const { error } = await sb.storage.from("media").upload(path, buf, {
      contentType: file.type || undefined,
      upsert: false,
    });
    if (error) throw new Error(error.message);
    // Bucket is private (workspace blocks public buckets); use a long-lived signed URL.
    const { data: signed, error: signErr } = await sb.storage
      .from("media")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 10); // 10 years
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
    await assertAdmin(context.userId);
    const sb = await adminClient();
    const { data } = await sb.from("blog_posts").select("*").order("created_at", { ascending: false });
    return data ?? [];
  });

export const getBlogPostById = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const sb = await adminClient();
    const { data: row } = await sb.from("blog_posts").select("*").eq("id", data.id).maybeSingle();
    return row;
  });

export const upsertBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => blogSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const sb = await adminClient();
    const { id, ...rest } = data;
    const payload: any = { ...rest };
    if (payload.status === "published" && !payload.published_at) {
      payload.published_at = new Date().toISOString();
    }
    if (id) {
      const { error } = await sb.from("blog_posts").update(payload).eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }
    const { data: inserted, error } = await sb.from("blog_posts").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    return { id: inserted.id };
  });

export const deleteBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const sb = await adminClient();
    const { error } = await sb.from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });