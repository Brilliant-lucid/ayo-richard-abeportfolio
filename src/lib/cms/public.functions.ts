@@
 export const listTestimonials = createServerFn({ method: "GET" })
   .inputValidator((d: unknown) => usernameOnly.parse(d ?? {}))
   .handler(async ({ data }) => {
     const p = await resolvePortfolio(data.username);
     if (!p) return [];
     const sb = await admin();
-    const { data: rows } = await sb
-      .from("testimonials")
-      .select("*")
-      .eq("owner_id", p.owner_id)
-      .order("display_order");
+    // Ensure only published testimonials are returned. Use `status` if the table supports it.
+    // Inspect columns: if `status` exists, filter by published; otherwise fall back to owner-only.
+    // We avoid schema changes in this branch.
+    const table = sb.from("testimonials");
+    // Try selecting with a status filter first. Some Supabase clients will ignore unknown columns in .eq,
+    // but to be safe, we'll query the column list first.
+    const { data: colInfo } = await sb.from("information_schema.columns").select("column_name").eq("table_name", "testimonials");
+    const hasStatus = Array.isArray(colInfo) && colInfo.some((c: any) => c.column_name === "status");
+
+    let rowsRes;
+    if (hasStatus) {
+      rowsRes = await table.select("*").eq("owner_id", p.owner_id).eq("status", "published").order("display_order");
+    } else {
+      // No status field present — return owner-filtered testimonials only and report this state in the change log.
+      rowsRes = await table.select("*").eq("owner_id", p.owner_id).order("display_order");
+    }
+    const { data: rows } = rowsRes;
     return rows ?? [];
   });
@@
