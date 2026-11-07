import { allLessons, modules, problems } from "@/lib/course";

import { SITE_URL as base } from "@/lib/site";

export default function sitemap() {
  const paths = ["/", "/projects", "/interview", "/tiers/intermediate", "/tiers/advanced",
    ...modules.map((m) => `/learn/${m.id}`),
    ...allLessons.map((l) => `/learn/${l.moduleId}/${l.id}`),
    ...problems.map((p) => `/interview/${p.id}`)];
  return paths.map((p) => ({ url: base + p }));
}
