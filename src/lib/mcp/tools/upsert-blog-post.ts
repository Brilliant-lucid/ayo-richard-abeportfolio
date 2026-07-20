import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, requireAuth, supabaseForCaller, textResult } from "../supabase";

export default defineTool({
  name: "upsert_blog_post",
  title: "Create or update blog post",
  description: "Create a new blog post or update an existing one (by id) for the signed-in user.",
  inputSchema: {
    id: z.string().uuid().optional(),
    title: z.string().optional(),
    slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
    excerpt: z.string().optional(),
    content: z.string().optional().describe("Markdown body."),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    featured_image_url: z.string().optional(),
    status: z.enum(["draft", "published"]).optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    const userId = requireAuth(ctx);
    const sb = supabaseForCaller(ctx);
    const { id, ...rest } = input;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = { ...rest };
    if (rest.status === "published") payload.published_at = new Date().toISOString();
    if (id) {
      const { error } = await sb.from("blog_posts").update(payload).eq("id", id).eq("owner_id", userId);
      if (error) return errorResult(error.message);
      return textResult(`Updated post ${id}.`, { id });
    }
    if (!rest.slug || !rest.title) return errorResult("slug and title are required to create a post.");
    const { data, error } = await sb.from("blog_posts")
      .insert({ ...payload, owner_id: userId } as any)
      .select("id, slug").single();
    if (error) return errorResult(error.message);
    return textResult(`Created post ${data.slug}.`, { id: data.id, slug: data.slug });
  },
});