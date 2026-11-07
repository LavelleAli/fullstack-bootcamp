import { describe, it, expect } from "vitest";
import { lessonIndex } from "@/lib/progress-math";
import { allLessons, course, diagrams, getLesson, modules, moduleProgress, neighbours, nextLesson, overallProgress, problems } from "@/lib/course";

describe("course content", () => {
  it("has unique lesson and problem ids", () => {
    const ids = [...allLessons.map((l) => l.id), ...problems.map((p) => p.id)];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("points every walkthrough step at real lines", () => {
    for (const l of allLessons) {
      const count = l.example.code.split("\n").length;
      for (const step of l.demo) {
        for (const n of step.lines) expect(n, `${l.id} line ${n}`).toBeGreaterThanOrEqual(1);
        for (const n of step.lines) expect(n, `${l.id} line ${n}`).toBeLessThanOrEqual(count);
      }
    }
  });

  it("has a valid answer for every quiz question", () => {
    for (const l of allLessons) for (const q of l.check) expect(q.options[q.answer], l.id).toBeDefined();
  });

  it("only references diagrams that exist", () => {
    for (const l of allLessons) if (l.diagram) expect(diagrams[l.diagram], l.id).toBeDefined();
  });

  it("gives every module a project with steps and tests", () => {
    for (const m of modules) {
      expect(m.beginner.project.steps.length, m.id).toBeGreaterThan(0);
      expect(m.beginner.project.test.length, m.id).toBeGreaterThan(0);
    }
  });
});

describe("lookups", () => {
  it("finds a lesson only under its own module", () => {
    expect(getLesson("js", "js-dom")?.title).toBe("The DOM and events");
    expect(getLesson("css", "js-dom")).toBeNull();
  });

  it("crosses module boundaries for next and previous", () => {
    const lastHtml = modules[0].beginner.lessons.at(-1);
    expect(neighbours(lastHtml.id).next.moduleId).toBe(modules[1].id);
    expect(neighbours(allLessons[0].id).prev).toBeNull();
    expect(neighbours(allLessons.at(-1).id).next).toBeNull();
  });
});

describe("tiers", () => {
  it("orders the tiers Beginner, then Intermediate, then Advanced", () => {
    const rank = { beginner: 0, intermediate: 1, advanced: 2 };
    for (let i = 1; i < allLessons.length; i++) expect(rank[allLessons[i].tier]).toBeGreaterThanOrEqual(rank[allLessons[i - 1].tier]);
    expect(allLessons.at(-1).tier).toBe("advanced");
  });

  it("keeps the small client lesson index in step with the full course", () => {
    expect(lessonIndex.map((l) => l.id + l.tier + l.title)).toEqual(allLessons.map((l) => l.id + l.tier + l.title));
  });

  it("writes Advanced lessons for every module", () => {
    for (const m of modules) expect(m.advancedLessons.length, m.id).toBeGreaterThan(0);
  });

  it("moves from the last Intermediate lesson into the first Advanced one", () => {
    const firstAdv = allLessons.findIndex((l) => l.tier === "advanced");
    expect(neighbours(allLessons[firstAdv - 1].id).next.tier).toBe("advanced");
  });

  it("moves from the last Beginner lesson into the first Intermediate one", () => {
    const firstInt = allLessons.findIndex((l) => l.tier === "intermediate");
    expect(neighbours(allLessons[firstInt - 1].id).next.tier).toBe("intermediate");
  });

  it("counts progress per tier", () => {
    const m = modules.find((x) => x.id === "react");
    const done = { [m.intermediateLessons[0].id]: true };
    expect(moduleProgress(m, done, "intermediate").count).toBe(1);
    expect(moduleProgress(m, done, "beginner").count).toBe(0);
    const adv = { [m.advancedLessons[0].id]: true };
    expect(moduleProgress(m, adv, "advanced").count).toBe(1);
    expect(moduleProgress(m, adv, "intermediate").count).toBe(0);
  });

  it("gives every capstone steps and a test list", () => {
    for (const tid of ["intermediate", "advanced"]) for (const p of course.tierProjects[tid]) {
      expect(p.steps.length, p.title).toBeGreaterThan(0);
      expect(p.test.length, p.title).toBeGreaterThan(0);
    }
  });
});

describe("progress maths", () => {
  it("counts module and overall completion", () => {
    const m = modules[0];
    const done = { [m.beginner.lessons[0].id]: true, "old-removed-lesson": true };
    expect(moduleProgress(m, done).count).toBe(1);
    expect(overallProgress(done).count).toBe(1); // ignores ids that no longer exist
  });

  it("continues the last unfinished lesson, otherwise the first unfinished", () => {
    expect(nextLesson({}, null).id).toBe(allLessons[0].id);
    expect(nextLesson({}, "js-dom").id).toBe("js-dom");
    expect(nextLesson({ "js-dom": true }, "js-dom").id).toBe(allLessons[0].id);
    const everything = Object.fromEntries(allLessons.map((l) => [l.id, true]));
    expect(nextLesson(everything, null)).toBeNull();
  });
});
