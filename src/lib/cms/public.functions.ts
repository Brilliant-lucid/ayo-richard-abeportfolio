import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const slugSchema = z.object({ slug: z.string().min(1) });

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const getSiteData = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await admin();
  const [settings, nav, hero, stats] = await Promise.all([
    sb.from("site_settings").select("*").limit(1).maybeSingle(),
    sb.from("nav_links").select("*").eq("visible", true).order("display_order"),
    sb.from("hero").select("*").limit(1).maybeSingle(),
    sb.from("stats").select("*").order("display_order"),
  ]);
  return {
    settings: settings.data,
    nav: nav.data ?? [],
    hero: hero.data,
    stats: stats.data ?? [],
  };
});

export const listProjects = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await admin();
  const { data } = await sb
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("display_order");
  return data ?? [];
});

export const getProjectBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => slugSchema.parse(d))
  .handler(async ({ data }) => {
    const sb = await admin();
    const { data: row } = await sb
      .from("projects")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    return row;
  });

export const listCaseStudies = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await admin();
  const { data } = await sb
    .from("case_studies")
    .select("*")
    .eq("status", "published")
    .order("display_order");
  return data ?? [];
});

export const getCaseStudyBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => slugSchema.parse(d))
  .handler(async ({ data }) => {
    const sb = await admin();
    const { data: row } = await sb
      .from("case_studies")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    return row;
  });

export const listBlogPosts = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await admin();
  const { data } = await sb
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return data ?? [];
});

export const getBlogPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => slugSchema.parse(d))
  .handler(async ({ data }) => {
    const sb = await admin();
    const { data: row } = await sb
      .from("blog_posts")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    return row;
  });

export const listTestimonials = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await admin();
  const { data } = await sb.from("testimonials").select("*").order("display_order");
  return data ?? [];
});

const contactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  subject: z.string().max(200).optional().default(""),
  message: z.string().min(5).max(5000),
});

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => contactSchema.parse(d))
  .handler(async ({ data }) => {
    const sb = await admin();
    const { error } = await sb.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      subject: data.subject || null,
      message: data.message,
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