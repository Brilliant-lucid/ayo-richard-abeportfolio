export const SITE_URL = "https://portfolio-platform.lovable.app";

/** Default portfolio used by legacy (non-namespaced) URLs. */
export const DEFAULT_USERNAME = "richard";

export function absoluteUrl(path: string) {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Returns an absolute image URL, or undefined when there is no meaningful image. */
export function absoluteImage(url?: string | null) {
  if (!url) return undefined;
  return absoluteUrl(url);
}

export function portfolioPath(username: string, sub = "") {
  return `/u/${username}${sub}`;
}
