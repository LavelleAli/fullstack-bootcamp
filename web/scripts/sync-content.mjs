// Copies the course content built by ../src/build.mjs into this app.
// The lessons are written once in ../src and shared by the web page and this Next.js app.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const from = new URL("../../dist/course.json", import.meta.url);
const to = new URL("../lib/content/course.json", import.meta.url);

if (!existsSync(from)) {
  if (existsSync(to)) {
    console.log("sync-content: ../dist/course.json not found, using the existing copy");
    writeIndex();
    process.exit(0);
  }
  console.error("sync-content: run `node build.mjs` in ../src first");
  process.exit(1);
}
mkdirSync(new URL("../lib/content/", import.meta.url), { recursive: true });
copyFileSync(from, to);
writeIndex();
console.log("sync-content: copied course.json and wrote lesson-index.json");

// A small index (ids, titles, modules, tiers) for client-side progress, so pages don't ship every lesson.
function writeIndex() {
  const { course } = JSON.parse(readFileSync(to, "utf8"));
  const pick = { beginner: (m) => m.beginner.lessons, intermediate: (m) => m.intermediateLessons ?? [], advanced: (m) => m.advancedLessons ?? [] };
  const lessons = Object.entries(pick).flatMap(([tier, get]) =>
    course.modules.flatMap((m) => get(m).map((l) => ({ id: l.id, title: l.title, moduleId: m.id, tier }))));
  writeFileSync(new URL("../lib/content/lesson-index.json", import.meta.url), JSON.stringify({ lessons }));
}
