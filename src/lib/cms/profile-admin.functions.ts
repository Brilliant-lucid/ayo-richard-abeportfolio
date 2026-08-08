import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { PROFILE_TABLES, type ProfileTable } from "@/lib/cms/profile-tables";

async function adminClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

const tableEnum = z.enum([
  "experience",
  "skills",
  "certifications",
  "awards",
  "publications",
  "testimonials",
]);

function clean(table: ProfileTable, row: Record<string, unknown>) {
  const spec = PROFILE_TABLES[table];
  const out: Record<string, unknown> = {};
  for (const col of spec.columns) {
    if (col in row) {
      const v = row[col];
      out[col] = v === "" ? null : v;
    }
  }
  return out;
}

export const listProfileRows = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ table: tableEnum }).parse(d))
  .handler(async ({ data, context }) => {
    const sb = await adminClient();
    const { data: rows, error } = await sb
      .from(data.table)
      .select("*")
      .eq("owner_id", context.userId)
      .order("display_order");
    if (error) throw new Error(error.message);
    return (rows ?? []) as Record<string, any>[];
  });

export const upsertProfileRow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      table: tableEnum,
      id: z.string().uuid().optional().nullable(),
      values: z.record(z.string(), z.any()),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const sb = await adminClient();
    const payload = clean(data.table, data.values);
    if (data.id) {
      const { error } = await sb
        .from(data.table)
        .update(payload as never)
        .eq("id", data.id)
        .eq("owner_id", context.userId);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: inserted, error } = await sb
      .from(data.table)
      .insert({ ...payload, owner_id: context.userId } as never)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: (inserted as { id: string }).id };
  });

export const deleteProfileRow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ table: tableEnum, id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const sb = await adminClient();
    const { error } = await sb
      .from(data.table)
      .delete()
      .eq("id", data.id)
      .eq("owner_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reorderProfileRows = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ table: tableEnum, ids: z.array(z.string().uuid()) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const sb = await adminClient();
    await Promise.all(
      data.ids.map((id, i) =>
        sb.from(data.table).update({ display_order: i } as never).eq("id", id).eq("owner_id", context.userId),
      ),
    );
    return { ok: true };
  });
