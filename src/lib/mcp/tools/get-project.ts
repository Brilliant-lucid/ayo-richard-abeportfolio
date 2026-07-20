import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, requireAuth, supabaseForCaller, textResult } from "../supabase";

export default defineTool({
  name: "get_project",
  title: "Get project",
  description: "Fetch full details of one of the signed-in user's projects by slug or id.",
  inputSchema: {
    slug: z.string().optional().describe("Project slug (preferred)."),
    id: z.string().uuid().optional().describe("Project UUID."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug, id }, ctx) => {
    if (!slug && !id) return errorResult("Provide slug or id.");
    const userId = requireAuth(ctx);
    const sb = supabaseForCaller(ctx);
    let q = sb.from("projects").select("*").eq("owner_id", userId);
    q = id ? q.eq("id", id) : q.eq("slug", slug!);
    const { data, error } = await q.maybeSingle();
    if (error) return errorResult(error.message);
    if (!data) return errorResult("Project not found.");
    return textResult(`Project: ${data.title || data.name}`, { project: data });
  },
});