import { SITE_URL as base } from "@/lib/site";

export default function robots() {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${base}/sitemap.xml` };
}
