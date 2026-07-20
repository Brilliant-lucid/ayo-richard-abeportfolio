import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, requireAuth, supabaseForCaller, textResult } from "../supabase";

export default defineTool({
  name: "list_blog_posts",
  title: "List my blog posts",
  description: "List blog posts owned by the signed-in user.",
  inputSchema: {
    status: z.enum(["draft", "published"]).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status }, ctx) => {
    const userId = requireAuth(ctx);
    const sb = supabaseForCaller(ctx);
    let q = sb.from("blog_posts").select("id, slug, title, status, excerpt, category, tags, published_at, updated_at")
      .eq("owner_id", userId).order("created_at", { ascending: false });
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    if (error) return errorResult(error.message);
    return textResult(`Found ${data?.length ?? 0} post(s).`, { posts: data ?? [] });
  },
});