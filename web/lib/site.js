// The site's public URL: NEXT_PUBLIC_SITE_URL if set (e.g. a custom domain),
// else the production URL Vercel provides at build time, else localhost.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
