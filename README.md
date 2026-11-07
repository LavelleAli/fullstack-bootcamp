# Full-Stack Bootcamp (course source)

The content behind both versions of the course: the published course page (`dist/index.html`) and the Next.js app (`web/`). Lessons are written once in `src/` and shared by both.

**Status:** all three tiers are written and verified: Beginner (41 lessons), Intermediate (42) and Advanced (42), plus 21 interview problems and 6 capstone projects.

## What's here
| Path | What it is |
|---|---|
| `src/map.js` | The course map: 14 modules, tier descriptions, topic outlines, and capstone projects |
| `src/lessons-*.js` | Beginner lessons (41), module projects, interview problems and questions |
| `src/int-*.js` | Intermediate lessons (42) and 6 more interview problems |
| `src/adv-*.js` | Advanced lessons (42) and 5 more interview problems |
| `web/` | The Next.js version (see `web/README.md`) |
| `src/diagrams.js` | The 8 SVG diagrams |
| `src/course.js` | Combines everything into one `course` object |
| `src/template.html` | The app UI (vanilla JS) |
| `src/build.mjs` | Builds `dist/index.html` (the app) and `dist/course.json` (all content as JSON) |
| `verify/verify.mjs` | Runs every code example and checks its output |

## Lesson shape
```js
{
  id, title, minutes, goal,
  body: ["paragraph with `code` and **bold**"],
  diagram: "box-model",                 // optional, a key in diagrams.js
  example: { lang, code, file?, run?, output? },
  demo: [{ lines: [1, 2], say: "narration", out: "optional output" }],  // walkthrough steps, 1-based lines
  practice: { task, hint, solution: { lang, code, run?, output? } },
  check: [{ q, options: [], answer: 0, why }],
}
```
`run` tells the verifier how to test the code: `node`, `ts`, `python`, `pytest`, `sql`, `vitest`, `server` (starts it and sends requests), or `check` (syntax only).

## Commands
```bash
cd src && node build.mjs                                  # rebuild the app
cd verify && npm i vitest esbuild express morgan helmet express-rate-limit jsonwebtoken bcryptjs supertest zod @reduxjs/toolkit && node verify.mjs   # run every example
```
The SQL checks need a local PostgreSQL. The verifier expects one on a Unix socket at `pg/`, port 54329; change `PG` in `verify.mjs` to point at yours.

## Adding a tier or lesson
1. Write lessons in `src/` (same shape as above) and add them in `src/course.js`.
2. `node verify/verify.mjs` until it says ALL CLEAN.
3. `cd src && node build.mjs`, which updates `dist/index.html` and `dist/course.json`.
4. In `web/`, `npm run build` copies the new `course.json` in automatically.
# fullstack-bootcamp
