import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function adminClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

const RESERVED = new Set([
  "admin","auth","api","u","settings","about","projects","case-studies",
  "blog","contact","login","signup","dashboard","user","users"
]);

const usernameSchema = z
  .string()
  .min(2)
  .max(31)
  .regex(/^[a-z0-9][a-z0-9-]{1,30}$/, "Lowercase letters, numbers and dashes only")
  .refine((u) => !RESERVED.has(u), "That username is reserved");

export const getMyPortfolio = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = await adminClient();
    const { data } = await sb
      .from("portfolios")
      .select("*")
      .eq("owner_id", context.userId)
      .maybeSingle();
    return data;
  });

export const createMyPortfolio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      username: usernameSchema,
      display_name: z.string().min(1).max(80),
    }).parse(d)
  )
  .handler(async ({ data, context }) => {
    const sb = await adminClient();
    // Reject if owner already has one
    const { data: existing } = await sb
      .from("portfolios")
      .select("id")
      .eq("owner_id", context.userId)
      .maybeSingle();
    if (existing) throw new Error("You already have a portfolio");

    // Check username free
    const { data: taken } = await sb
      .from("portfolios")
      .select("id")
      .eq("username", data.username)
      .maybeSingle();
    if (taken) throw new Error("That username is taken");

    const { data: created, error } = await sb
      .from("portfolios")
      .insert({
        owner_id: context.userId,
        username: data.username,
        display_name: data.display_name,
        is_published: false,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);

    // Bootstrap an empty hero + site_settings row for them
    await sb.from("hero").insert({
      owner_id: context.userId,
      heading: data.display_name,
      intro: "Welcome to my portfolio.",
    });
    await sb.from("site_settings").insert({
      owner_id: context.userId,
      site_name: data.display_name,
    });

    return created;
  });

export const updateMyPortfolio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      display_name: z.string().min(1).max(80).optional(),
      tagline: z.string().max(160).nullable().optional(),
      avatar_url: z.string().nullable().optional(),
      is_published: z.boolean().optional(),
    }).parse(d)
  )
  .handler(async ({ data, context }) => {
    const sb = await adminClient();
    const { error } = await sb
      .from("portfolios")
      .update(data)
      .eq("owner_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
