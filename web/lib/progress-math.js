// Progress helpers for client components. They read a small lesson index
// (ids, titles, modules, tiers) instead of the whole course, so the lesson
// text isn't downloaded on every page.
import index from "./content/lesson-index.json";

/** Every written lesson in course order: { id, title, moduleId, tier }. */
export const lessonIndex = index.lessons;

/** The written lessons of a module for one tier. Works on full or slim modules. */
export const lessonsOf = (m, tier) =>
  tier === "beginner" ? m.beginner.lessons
  : tier === "intermediate" ? m.intermediateLessons ?? []
  : tier === "advanced" ? m.advancedLessons ?? []
  : [];

/** URL of a lesson. */
export const lessonHref = (l) => `/learn/${l.moduleId}/${l.id}`;

/** Share of a module's lessons (for one tier) that are done. */
export function moduleProgress(m, done, tier = "beginner") {
  const list = lessonsOf(m, tier);
  const total = list.length;
  const count = list.filter((l) => done[l.id]).length;
  return { count, total, pct: total ? Math.round((count / total) * 100) : 0 };
}

/** Overall completion across every written lesson, ignoring ids that no longer exist. @param {Record<string, boolean>} done */
export function overallProgress(done) {
  const count = lessonIndex.filter((l) => done[l.id]).length;
  return { count, total: lessonIndex.length, pct: Math.round((count / lessonIndex.length) * 100) };
}

/** Where "Continue" should go: the last lesson opened if unfinished, else the first unfinished one. */
export function nextLesson(done, lastId) {
  const last = lastId && lessonIndex.find((l) => l.id === lastId);
  if (last && !done[last.id]) return last;
  return lessonIndex.find((l) => !done[l.id]) ?? null;
}
