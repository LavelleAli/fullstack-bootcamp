# Full-Stack Bootcamp: Next.js app

The course as a Next.js site. It uses the same content as the published course page: lessons are written once in `../src`, built to `../dist/course.json`, and copied in here.

## Run it
```bash
npm install
npm run dev        # http://localhost:3000 (copies the latest course.json first)
npm test           # Vitest + React Testing Library
npm run build      # static build of all 100+ pages
```
Set `NEXT_PUBLIC_SITE_URL` (for example in `.env.local` or on Vercel) so the sitemap and social tags use your real domain.

## Routes
| URL | Page |
|---|---|
| `/` | Course map, tiers, Continue button |
| `/learn/[module]` | A module: its Beginner, Intermediate and Advanced lessons, and its project |
| `/learn/[module]/[lesson]` | A lesson: walkthrough, diagram, practice, quiz |
| `/tiers/[tier]` and `/tiers/[tier]/[module]` | A tier: its capstone projects and every module's lessons for that tier |
| `/interview` and `/interview/[problem]` | Coding tests with an in-browser test runner |
| `/projects` | Every practice project |

Every page is generated at build time (`generateStaticParams`, `dynamicParams = false`), so unknown URLs return a real 404.

## How it's built
- **Server components by default.** Code highlighting (highlight.js) runs at build time, so no highlighter ships to the browser.
- **Client components only where needed:** the walkthrough player, quiz, reveal buttons, progress, sidebar, theme toggle and test runner.
- **Progress** lives in `localStorage` through `useSyncExternalStore` (`lib/progress.js`). The server renders the empty state, so hydration always matches.
- **The test runner** runs learner code in a Web Worker and stops it after 2 seconds, so an infinite loop can't freeze the page.
- **Fonts are self-hosted** with Fontsource: Archivo, Atkinson Hyperlegible and JetBrains Mono.
- **Theme:** CSS custom properties with light and dark values, plus a toggle saved in `localStorage` and applied before first paint.

## Folders
```
app/          routes, layout, sitemap, robots, 404
components/   Sidebar, Walkthrough, LessonParts, ProgressBits, Interview, content (server pieces)
lib/          course.js (server lookups), progress-math.js (client progress, uses the small lesson index), progress.js, judge.js, highlight.js, md.js, content/{course.json, lesson-index.json}
tests/        course content checks, judge logic, component tests
scripts/      sync-content.mjs
```


**Keep lesson text off the client.** Client components import from `lib/progress-math.js`, which reads `lesson-index.json` (ids and titles only, about 13 KB). Importing `lib/course.js` in a `"use client"` file would ship the whole course (over 600 KB) to every page.
