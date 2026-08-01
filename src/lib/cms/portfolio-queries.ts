import { queryOptions } from "@tanstack/react-query";
import {
  getSiteData,
  listProjects,
  listCaseStudies,
  listBlogPosts,
  listTestimonials,
  getProjectBySlug,
  getCaseStudyBySlug,
  getBlogPostBySlug,
} from "@/lib/cms/public.functions";

export const siteQO = (username: string) =>
  queryOptions({
    queryKey: ["u", username, "site"],
    queryFn: () => getSiteData({ data: { username } }),
    staleTime: 60_000,
  });

export const projectsQO = (username: string) =>
  queryOptions({
    queryKey: ["u", username, "projects"],
    queryFn: () => listProjects({ data: { username } }),
  });

export const caseStudiesQO = (username: string) =>
  queryOptions({
    queryKey: ["u", username, "case-studies"],
    queryFn: () => listCaseStudies({ data: { username } }),
  });

export const blogQO = (username: string) =>
  queryOptions({
    queryKey: ["u", username, "blog"],
    queryFn: () => listBlogPosts({ data: { username } }),
  });

export const testimonialsQO = (username: string) =>
  queryOptions({
    queryKey: ["u", username, "testimonials"],
    queryFn: () => listTestimonials({ data: { username } }),
  });

export const projectQO = (username: string, slug: string) =>
  queryOptions({
    queryKey: ["u", username, "project", slug],
    queryFn: () => getProjectBySlug({ data: { username, slug } }),
  });

export const caseStudyQO = (username: string, slug: string) =>
  queryOptions({
    queryKey: ["u", username, "case-study", slug],
    queryFn: () => getCaseStudyBySlug({ data: { username, slug } }),
  });

export const blogPostQO = (username: string, slug: string) =>
  queryOptions({
    queryKey: ["u", username, "post", slug],
    queryFn: () => getBlogPostBySlug({ data: { username, slug } }),
  });
