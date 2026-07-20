import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, requireAuth, supabaseForCaller, textResult } from "../supabase";

export default defineTool({
  name: "list_contact_messages",
  title: "List contact messages",
  description: "List contact-form messages sent to the signed-in user's portfolio.",
  inputSchema: {
    unread_only: z.boolean().optional().describe("If true, return only unread messages."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ unread_only }, ctx) => {
    const userId = requireAuth(ctx);
    const sb = supabaseForCaller(ctx);
    const { data: portfolio } = await sb.from("portfolios").select("id").eq("owner_id", userId).maybeSingle();
    if (!portfolio) return textResult("No portfolio yet — no messages.", { messages: [] });
    let q = sb.from("contact_messages").select("*").eq("portfolio_id", portfolio.id)
      .order("created_at", { ascending: false });
    if (unread_only) q = q.eq("read", false);
    const { data, error } = await q;
    if (error) return errorResult(error.message);
    return textResult(`Found ${data?.length ?? 0} message(s).`, { messages: data ?? [] });
  },
});