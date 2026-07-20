import { defineTool } from "@lovable.dev/mcp-js";
import { errorResult, requireAuth, supabaseForCaller, textResult } from "../supabase";

export default defineTool({
  name: "get_portfolio",
  title: "Get my portfolio",
  description: "Fetch the signed-in user's portfolio settings (username, published status, hero, site info).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    const userId = requireAuth(ctx);
    const sb = supabaseForCaller(ctx);
    const [portfolio, hero, settings] = await Promise.all([
      sb.from("portfolios").select("*").eq("owner_id", userId).maybeSingle(),
      sb.from("hero").select("*").eq("owner_id", userId).maybeSingle(),
      sb.from("site_settings").select("*").eq("owner_id", userId).maybeSingle(),
    ]);
    if (portfolio.error) return errorResult(portfolio.error.message);
    return textResult(
      portfolio.data ? `Portfolio: ${portfolio.data.username}` : "No portfolio yet.",
      { portfolio: portfolio.data, hero: hero.data, site_settings: settings.data },
    );
  },
});