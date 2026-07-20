import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, requireAuth, supabaseForCaller, textResult } from "../supabase";

export default defineTool({
  name: "list_projects",
  title: "List my projects",
  description: "List all portfolio projects owned by the signed-in user, including drafts.",
  inputSchema: {
    status: z.enum(["draft", "published", "unlisted", "archived"]).optional()
      .describe("Filter by status. Omit to return all."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status }, ctx) => {
    const userId = requireAuth(ctx);
    const sb = supabaseForCaller(ctx);
    let q = sb.from("projects").select("id, slug, name, title, status, summary, category, featured, display_order, live_link, updated_at")
      .eq("owner_id", userId).order("display_order");
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    if (error) return errorResult(error.message);
    return textResult(`Found ${data?.length ?? 0} project(s).`, { projects: data ?? [] });
  },
});