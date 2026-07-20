import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, requireAuth, supabaseForCaller, textResult } from "../supabase";

export default defineTool({
  name: "upsert_project",
  title: "Create or update project",
  description: "Create a new project or update an existing one (by id) for the signed-in user. Only provided fields are written.",
  inputSchema: {
    id: z.string().uuid().optional().describe("Existing project id to update. Omit to create."),
    title: z.string().optional(),
    slug: z.string().regex(/^[a-z0-9-]+$/).optional().describe("URL slug. Required on create."),
    summary: z.string().optional(),
    category: z.string().optional(),
    role: z.string().optional(),
    roles: z.array(z.string()).optional(),
    tools: z.array(z.string()).optional(),
    overview: z.string().optional(),
    challenge: z.string().optional(),
    solution: z.string().optional(),
    process: z.string().optional(),
    results: z.string().optional(),
    learnings: z.string().optional(),
    live_link: z.string().optional(),
    case_study_link: z.string().optional(),
    featured_image_url: z.string().optional(),
    featured: z.boolean().optional(),
    status: z.enum(["draft", "published", "unlisted", "archived"]).optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    const userId = requireAuth(ctx);
    const sb = supabaseForCaller(ctx);
    const { id, ...rest } = input;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = { ...rest };
    if (rest.title) payload.name = rest.title;
    if (rest.roles) payload.role = rest.roles.join(", ");
    if (rest.overview !== undefined) payload.description = rest.overview;
    if (rest.challenge !== undefined) payload.problem = rest.challenge;
    if (id) {
      const { error } = await sb.from("projects").update(payload).eq("id", id).eq("owner_id", userId);
      if (error) return errorResult(error.message);
      return textResult(`Updated project ${id}.`, { id });
    }
    if (!rest.slug || !rest.title) return errorResult("slug and title are required to create a project.");
    const { data, error } = await sb.from("projects")
      .insert({ ...payload, owner_id: userId } as any)
      .select("id, slug").single();
    if (error) return errorResult(error.message);
    return textResult(`Created project ${data.slug}.`, { id: data.id, slug: data.slug });
  },
});