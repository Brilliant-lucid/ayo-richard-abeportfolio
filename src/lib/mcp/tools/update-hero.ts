import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, requireAuth, supabaseForCaller, textResult } from "../supabase";

export default defineTool({
  name: "update_hero",
  title: "Update hero section",
  description: "Update the hero (headline, intro, CTAs, profile image) on the signed-in user's portfolio.",
  inputSchema: {
    eyebrow: z.string().optional(),
    heading: z.string().optional(),
    intro: z.string().optional(),
    profile_image_url: z.string().optional(),
    cta_primary_label: z.string().optional(),
    cta_primary_href: z.string().optional(),
    cta_secondary_label: z.string().optional(),
    cta_secondary_href: z.string().optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    const userId = requireAuth(ctx);
    const sb = supabaseForCaller(ctx);
    const { data: existing } = await sb.from("hero").select("id").eq("owner_id", userId).maybeSingle();
    if (existing) {
      const { error } = await sb.from("hero").update(input).eq("id", existing.id).eq("owner_id", userId);
      if (error) return errorResult(error.message);
    } else {
      if (!input.heading) return errorResult("heading is required when creating a hero.");
      const { error } = await sb.from("hero").insert({ ...input, heading: input.heading, owner_id: userId });
      if (error) return errorResult(error.message);
    }
    return textResult("Hero updated.");
  },
});