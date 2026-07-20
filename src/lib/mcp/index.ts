import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProjects from "./tools/list-projects";
import getProject from "./tools/get-project";
import upsertProject from "./tools/upsert-project";
import deleteProject from "./tools/delete-project";
import listBlogPosts from "./tools/list-blog-posts";
import upsertBlogPost from "./tools/upsert-blog-post";
import deleteBlogPost from "./tools/delete-blog-post";
import listMessages from "./tools/list-messages";
import updateHero from "./tools/update-hero";
import getPortfolio from "./tools/get-portfolio";

// Direct Supabase host (not the .lovable.cloud proxy) — required for RFC 8414
// issuer match. VITE_SUPABASE_PROJECT_ID is inlined at build time.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "portfolio-platform-mcp",
  title: "Portfolio Platform",
  version: "0.1.0",
  instructions:
    "Tools to manage the signed-in user's portfolio: projects, case studies, blog posts, contact messages, hero, and site settings. Every tool acts as the authenticated user.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    getPortfolio,
    listProjects,
    getProject,
    upsertProject,
    deleteProject,
    listBlogPosts,
    upsertBlogPost,
    deleteBlogPost,
    listMessages,
    updateHero,
  ],
});