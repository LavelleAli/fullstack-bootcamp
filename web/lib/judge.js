// Compares a learner's results to the expected ones. Pure, so it's unit-tested.

/** Deep equality for JSON-like values (what the interview tests return). */
export function sameValue(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * @param {{args: unknown[], want: unknown, got: unknown, threw?: string}[]} runs
 * @returns {{passed: number, total: number, allPassed: boolean, rows: {label: string, pass: boolean, detail: string}[]}}
 */
export function summarize(fnName, runs) {
  const rows = runs.map((r) => {
    const call = `${fnName}(${r.args.map((a) => JSON.stringify(a)).join(", ")})`;
    if (r.threw) return { label: call, pass: false, detail: `threw: ${r.threw}` };
    const pass = sameValue(r.got, r.want);
    const got = r.got === undefined ? "undefined" : JSON.stringify(r.got);
    return { label: call, pass, detail: pass ? `→ ${got}` : `→ ${got}, expected ${JSON.stringify(r.want)}` };
  });
  const passed = rows.filter((r) => r.pass).length;
  return { passed, total: rows.length, allPassed: rows.length > 0 && passed === rows.length, rows };
}

/** Worker source: runs learner code off the main thread so an infinite loop can be stopped. */
export const WORKER_SOURCE = `self.onmessage = (e) => {
  const { code, fn, tests } = e.data;
  let f;
  try { f = new Function(code + "\\n;return typeof " + fn + " === 'function' ? " + fn + " : undefined;")(); }
  catch (err) { self.postMessage({ error: "Your code has a syntax error: " + err.message }); return; }
  if (typeof f !== "function") { self.postMessage({ error: "Couldn't find a function named " + fn + "." }); return; }
  const runs = tests.map(([args, want]) => {
    try { return { args, want, got: f(...structuredClone(args)) }; }
    catch (err) { return { args, want, threw: String(err && err.message || err) }; }
  });
  self.postMessage({ runs });
};`;

/** First line of the solution plus an empty body, e.g. "function twoSum(nums, target) {". */
export const stubFor = (solution) => solution.split("\n")[0] + "\n  // your code here\n}\n";
