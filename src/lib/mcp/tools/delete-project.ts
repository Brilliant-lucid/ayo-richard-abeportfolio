import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, requireAuth, supabaseForCaller, textResult } from "../supabase";

export default defineTool({
  name: "delete_project",
  title: "Delete project",
  description: "Permanently delete one of the signed-in user's projects by id.",
  inputSchema: { id: z.string().uuid() },
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id }, ctx) => {
    const userId = requireAuth(ctx);
    const sb = supabaseForCaller(ctx);
    const { error } = await sb.from("projects").delete().eq("id", id).eq("owner_id", userId);
    if (error) return errorResult(error.message);
    return textResult(`Deleted project ${id}.`);
  },
});