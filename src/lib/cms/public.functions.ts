import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const DEFAULT_USERNAME = "richard";

const slugSchema = z.object({
  slug: z.string().min(1),
  username: z.string().optional(),
});
const usernameOnly = z.object({ username: z.string().optional() });

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function resolvePortfolio(username?: string) {
  const sb = await admin();
  const u = username || DEFAULT_USERNAME;
  const { data } = await sb
    .from("portfolios")
    .select("*")
    .eq("username", u)
    .eq("is_published", true)
    .maybeSingle();
  return data;
}

export const listFeaturedPortfolios = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await admin();
  const { data } = await sb
    .from("portfolios")
    .select("username, display_name, tagline, avatar_url")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(12);
  return data ?? [];
});

export const getSiteData = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => usernameOnly.parse(d ?? {}))
  .handler(async ({ data }) => {
    const p = await resolvePortfolio(data.username);
    if (!p) return { portfolio: null, settings: null, nav: [], hero: null, stats: [] };
    const sb = await admin();
    const [settings, nav, hero, stats] = await Promise.all([
      sb.from("site_settings").select("*").eq("owner_id", p.owner_id).limit(1).maybeSingle(),
      sb.from("nav_links").select("*").eq("owner_id", p.owner_id).eq("visible", true).order("display_order"),
      sb.from("hero").select("*").eq("owner_id", p.owner_id).limit(1).maybeSingle(),
      sb.from("stats").select("*").eq("owner_id", p.owner_id).order("display_order"),
    ]);
    return {
      portfolio: p,
      settings: settings.data,
      nav: nav.data ?? [],
      hero: hero.data,
      stats: stats.data ?? [],
    };
  });

export const listProjects = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => usernameOnly.parse(d ?? {}))
  .handler(async ({ data }) => {
    const p = await resolvePortfolio(data.username);
    if (!p) return [];
    const sb = await admin();
    const { data: rows } = await sb
      .from("projects")
      .select("*")
      .eq("owner_id", p.owner_id)
      .eq("status", "published")
      .order("display_order");
    return rows ?? [];
  });

export const getProjectBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => slugSchema.parse(d))
  .handler(async ({ data }) => {
    const p = await resolvePortfolio(data.username);
    if (!p) return null;
    const sb = await admin();
    const { data: row } = await sb
      .from("projects")
      .select("*")
      .eq("owner_id", p.owner_id)
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    return row;
  });

export const listCaseStudies = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => usernameOnly.parse(d ?? {}))
  .handler(async ({ data }) => {
    const p = await resolvePortfolio(data.username);
    if (!p) return [];
    const sb = await admin();
    const { data: rows } = await sb
      .from("case_studies")
      .select("*")
      .eq("owner_id", p.owner_id)
      .eq("status", "published")
      .order("display_order");
    return rows ?? [];
  });

export const getCaseStudyBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => slugSchema.parse(d))
  .handler(async ({ data }) => {
    const p = await resolvePortfolio(data.username);
    if (!p) return null;
    const sb = await admin();
    const { data: row } = await sb
      .from("case_studies")
      .select("*")
      .eq("owner_id", p.owner_id)
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    return row;
  });

export const listBlogPosts = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => usernameOnly.parse(d ?? {}))
  .handler(async ({ data }) => {
    const p = await resolvePortfolio(data.username);
    if (!p) return [];
    const sb = await admin();
    const { data: rows } = await sb
      .from("blog_posts")
      .select("*")
      .eq("owner_id", p.owner_id)
      .eq("status", "published")
      .order("published_at", { ascending: false });
    return rows ?? [];
  });

export const getBlogPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => slugSchema.parse(d))
  .handler(async ({ data }) => {
    const p = await resolvePortfolio(data.username);
    if (!p) return null;
    const sb = await admin();
    const { data: row } = await sb
      .from("blog_posts")
      .select("*")
      .eq("owner_id", p.owner_id)
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    return row;
  });

export const listTestimonials = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => usernameOnly.parse(d ?? {}))
  .handler(async ({ data }) => {
    const p = await resolvePortfolio(data.username);
    if (!p) return [];
    const sb = await admin();
    const { data: rows } = await sb
      .from("testimonials")
      .select("*")
      .eq("owner_id", p.owner_id)
      .order("display_order");
    return rows ?? [];
  });

const contactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  subject: z.string().max(200).optional().default(""),
  message: z.string().min(5).max(5000),
  username: z.string().optional(),
});

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => contactSchema.parse(d))
  .handler(async ({ data }) => {
    const sb = await admin();
    const { data: portfolio } = await sb
      .from("portfolios")
      .select("id")
      .eq("username", data.username || DEFAULT_USERNAME)
      .maybeSingle();
    if (!portfolio) throw new Error("Portfolio not found");

    const { error } = await sb.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      subject: data.subject || null,
      message: data.message,
      portfolio_id: portfolio.id,
    });
    if (error) throw new Error(error.message);

    // Fire-and-forget email notification via Gmail connector
    try {
      await sendContactNotification(data);
    } catch (e) {
      console.error("Contact email notification failed:", e);
    }

    return { ok: true };
  });

const NOTIFY_EMAIL = "Abeayo6@gmail.com";

async function sendContactNotification(d: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const gmailKey = process.env.GOOGLE_MAIL_API_KEY;
  if (!lovableKey || !gmailKey) {
    console.warn("Gmail/Lovable keys missing — skipping notification email.");
    return;
  }

  const subjectLine = `New contact form message${d.subject ? ": " + d.subject : ""}`;
  const body = [
    `New message from your portfolio contact form.`,
    ``,
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    `Subject: ${d.subject || "(none)"}`,
    ``,
    `Message:`,
    d.message,
  ].join("\n");

  const raw = [
    `To: ${NOTIFY_EMAIL}`,
    `Reply-To: ${d.email}`,
    `Subject: ${subjectLine}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    ``,
    body,
  ].join("\r\n");

  const encoded = Buffer.from(raw, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await fetch(
    "https://connector-gateway.lovable.dev/google_mail/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": gmailKey,
      },
      body: JSON.stringify({ raw: encoded }),
    },
  );
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Gmail send failed (${res.status}): ${txt}`);
  }
}

const visitSchema = z.object({
  username: z.string().min(1),
  referrer: z.string().max(500).optional().default(""),
  userAgent: z.string().max(500).optional().default(""),
});

export const notifyPortfolioVisit = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => visitSchema.parse(d))
  .handler(async ({ data }) => {
    const sb = await admin();
    const { data: portfolio } = await sb
      .from("portfolios")
      .select("owner_id, username, display_name")
      .eq("username", data.username)
      .eq("is_published", true)
      .maybeSingle();
    if (!portfolio) return { ok: false };

    const lovableKey = process.env.LOVABLE_API_KEY;
    const gmailKey = process.env.GOOGLE_MAIL_API_KEY;
    if (!lovableKey || !gmailKey) return { ok: false };

    // Lookup owner email via Auth Admin API
    const { data: userRes } = await sb.auth.admin.getUserById(portfolio.owner_id);
    const toEmail = userRes?.user?.email;
    if (!toEmail) return { ok: false };

    const when = new Date().toISOString();
    const body = [
      `Someone just visited your portfolio.`,
      ``,
      `Portfolio: /u/${portfolio.username}`,
      `Time: ${when}`,
      `Referrer: ${data.referrer || "(direct)"}`,
      `User agent: ${data.userAgent || "(unknown)"}`,
    ].join("\n");

    const raw = [
      `To: ${toEmail}`,
      `Subject: New visitor on your portfolio`,
      `Content-Type: text/plain; charset="UTF-8"`,
      ``,
      body,
    ].join("\r\n");

    const encoded = Buffer.from(raw, "utf-8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    try {
      await fetch(
        "https://connector-gateway.lovable.dev/google_mail/gmail/v1/users/me/messages/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${lovableKey}`,
            "X-Connection-Api-Key": gmailKey,
          },
          body: JSON.stringify({ raw: encoded }),
        },
      );
    } catch (e) {
      console.error("Visit notification failed:", e);
    }
    return { ok: true };
  });