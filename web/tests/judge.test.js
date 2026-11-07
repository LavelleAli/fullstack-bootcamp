import { describe, it, expect } from "vitest";
import { sameValue, stubFor, summarize } from "@/lib/judge";
import { problems } from "@/lib/course";

describe("summarize", () => {
  it("passes matching results and explains failures", () => {
    const s = summarize("add", [
      { args: [1, 2], want: 3, got: 3 },
      { args: [2, 2], want: 4, got: 5 },
      { args: [0, 0], want: 0, threw: "boom" },
    ]);
    expect(s.passed).toBe(1);
    expect(s.allPassed).toBe(false);
    expect(s.rows[1].detail).toBe("→ 5, expected 4");
    expect(s.rows[2].detail).toBe("threw: boom");
  });

  it("compares arrays and null by value", () => {
    expect(sameValue([0, 1], [0, 1])).toBe(true);
    expect(sameValue(null, undefined)).toBe(false);
  });

  it("is not all-passed with zero tests", () => {
    expect(summarize("f", []).allPassed).toBe(false);
  });
});

describe("interview problems", () => {
  it.each(problems.map((p) => [p.id, p]))("%s: the model solution passes its own tests", (_id, p) => {
    const fn = new Function(p.solution + `\nreturn ${p.fn};`)();
    const runs = p.tests.map(([args, want]) => ({ args, want, got: fn(...structuredClone(args)) }));
    expect(summarize(p.fn, runs).allPassed).toBe(true);
  });

  it("builds a stub from the solution's first line", () => {
    expect(stubFor("function twoSum(nums, target) {\n  return null;\n}")).toBe("function twoSum(nums, target) {\n  // your code here\n}\n");
  });
});
