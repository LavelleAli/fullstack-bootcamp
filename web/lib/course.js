// Read-only helpers over the full course content. Use these in Server Components;
// client components should import from ./progress-math so lesson text isn't shipped to the browser.
import data from "./content/course.json";
import { lessonsOf } from "./progress-math";

export const course = data.course;
export const diagrams = data.diagrams;
export const modules = course.modules;
export const tiers = course.tiers;
export const problems = course.interview.problems;
export const questions = course.interview.questions;

export { lessonHref, lessonsOf, moduleProgress, nextLesson, overallProgress } from "./progress-math";

/** Pill color for a tier: none, yellow, red. */
export const tierPill = (tier) => (tier === "advanced" ? "red" : tier === "intermediate" ? "sun" : "");

/** Pill color for a problem level. */
export const levelPill = (level) => (level === "Hard" ? "red" : level === "Medium" ? "sun" : "");

/** Just the lesson ids of a module, small enough to pass to client components. */
export const slimModule = (m) => ({
  name: m.name,
  beginner: { lessons: m.beginner.lessons.map((l) => ({ id: l.id })) },
  intermediateLessons: (m.intermediateLessons ?? []).map((l) => ({ id: l.id })),
  advancedLessons: (m.advancedLessons ?? []).map((l) => ({ id: l.id })),
});

/** Every written lesson in course order (all Beginner, then all Intermediate, then all Advanced), with module, tier and position. */
export const allLessons = ["beginner", "intermediate", "advanced"].flatMap((tier) =>
  modules.flatMap((m) => lessonsOf(m, tier).map((l, index) => ({ ...l, moduleId: m.id, moduleName: m.name, tier, index })))
);

/** @param {string} id */
export const tierName = (id) => tiers.find((t) => t.id === id)?.name ?? id;

/** Is any lesson written for this tier yet? */
export const tierWritten = (tier) => allLessons.some((l) => l.tier === tier);

/** @param {string} id */
export const getModule = (id) => modules.find((m) => m.id === id) ?? null;

/** @param {string} moduleId @param {string} lessonId */
export function getLesson(moduleId, lessonId) {
  const l = allLessons.find((x) => x.id === lessonId);
  return l && l.moduleId === moduleId ? l : null;
}

/** Previous and next lessons across module boundaries. @param {string} lessonId */
export function neighbours(lessonId) {
  const i = allLessons.findIndex((l) => l.id === lessonId);
  return { prev: i > 0 ? allLessons[i - 1] : null, next: i >= 0 && i < allLessons.length - 1 ? allLessons[i + 1] : null };
}

/** @param {string} id */
export const getProblem = (id) => problems.find((p) => p.id === id) ?? null;

/** @param {string} id */
export const getTier = (id) => tiers.find((t) => t.id === id) ?? null;

/** YouTube search for a module, optionally narrowed to a lesson. */
export function videoSearchUrl(m, lessonTitle) {
  const base = lessonTitle ? m.video.replace(/ for beginners.*$/, "") + " " + lessonTitle : m.video;
  return "https://www.youtube.com/results?search_query=" + encodeURIComponent(base);
}
