// Runs every code example in the course and reports problems.
import { execFileSync, spawn } from "node:child_process";
import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { course } from "../src/course.js";

const V = new URL(".", import.meta.url).pathname;
const TMP = join(V, "tmp"); rmSync(TMP, { recursive: true, force: true }); mkdirSync(TMP);
const PG = { host: join(V, "..", "pg"), port: "54329" };
const problems = [];
const ran = { node: 0, ts: 0, python: 0, pytest: 0, sql: 0, check: 0, jsx: 0, vitest: 0, server: 0, interview: 0 };
const sqlOut = [];

const norm = (s) => s.replace(/\r/g, "").trimEnd();
function sh(cmd, args, opts = {}) {
  try { return { ok: true, out: execFileSync(cmd, args, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"], timeout: 60000, ...opts }) }; }
  catch (e) { return { ok: false, out: (e.stdout || "") + (e.stderr || "") + e.message }; }
}
let n = 0;
const file = (ext, code) => { const p = join(TMP, `f${n++}.${ext}`); writeFileSync(p, code); return p; };

async function runServer(code, label) {
  const p = join(V, `srv${n++}.mjs`); writeFileSync(p, code);
  const child = spawn("node", [p], { cwd: V, env: { ...process.env, PORT: "3000" } });
  let log = ""; child.stdout.on("data", (d) => (log += d)); child.stderr.on("data", (d) => (log += d));
  await new Promise((r) => setTimeout(r, 900));
  const hits = [];
  for (const [method, path, body] of [["GET", "/"], ["GET", "/api/status"], ["GET", "/api/books"], ["GET", "/api/books/1"], ["GET", "/api/books/99"], ["POST", "/api/books", { title: "Kindred", author: "Butler" }], ["POST", "/api/books", {}], ["GET", "/api/ping"], ["GET", "/healthz"], ["POST", "/api/login", { email: "a@b.c" }],
    ["GET", "/api/notes"], ["POST", "/api/notes", { title: "Proof dough" }], ["PATCH", "/api/notes/2", { done: true }], ["GET", "/api/notes/2"], ["DELETE", "/api/notes/1"], ["DELETE", "/api/notes/99"]]) {
    try {
      const r = await fetch("http://localhost:3000" + path, { method, headers: { "content-type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
      hits.push(`${method} ${path} -> ${r.status} ${(await r.text()).slice(0, 80)}`);
    } catch (e) { hits.push(`${method} ${path} -> ERR ${e.cause?.code || e.message}`); }
  }
  child.kill(); rmSync(p);
  await new Promise((r) => setTimeout(r, 200));
  if (!hits.some((h) => / -> 2\d\d/.test(h))) problems.push(`${label}: server never answered\n${log}`);
  sqlOut.push(`### SERVER ${label}\n${hits.join("\n")}\nLOG: ${log.trim()}`);
}

async function runCode(c, label) {
  if (!c || !c.run) return;
  const lang = c.lang;
  let res;
  if (c.run === "node") { ran.node++; res = sh("node", [file("mjs", c.code)]); }
  else if (c.run === "ts") { ran.ts++; res = sh("node", ["--experimental-strip-types", "--no-warnings", file("ts", c.code)]); }
  else if (c.run === "python") { ran.python++; res = sh("python3", [file("py", c.code)]); }
  else if (c.run === "pytest") { ran.pytest++; const p = join(TMP, `test_${n++}.py`); writeFileSync(p, c.code); res = sh("python3", ["-m", "pytest", "-q", p]); if (res.ok) res.out = (res.out.match(/(\d+ passed)/) || [res.out])[0]; }
  else if (c.run === "sql") {
    ran.sql++;
    const db = "db" + Date.now() + "_" + n++;
    sh("psql", ["-h", PG.host, "-p", PG.port, "-U", "postgres", "-c", `CREATE DATABASE ${db}`]);
    if (c.setup) { const s = sh("psql", ["-h", PG.host, "-p", PG.port, "-U", "postgres", "-d", db, "-v", "ON_ERROR_STOP=1", "-q", "-c", c.setup]); if (!s.ok) problems.push(`${label}: SQL setup failed\n${s.out}`); }
    res = sh("psql", ["-h", PG.host, "-p", PG.port, "-U", "postgres", "-d", db, "-v", "ON_ERROR_STOP=1", "-f", file("sql", c.code)]);
    sqlOut.push(`### ${label}\n${res.out}`);
  }
  else if (c.run === "check") {
    if (lang === "python") { ran.check++; res = sh("python3", ["-m", "py_compile", file("py", c.code)]); res.out = res.ok ? "" : res.out; }
    else if (lang === "jsx") { ran.jsx++; res = sh(join(V, "node_modules/.bin/esbuild"), [file("jsx", c.code), "--loader:.jsx=jsx", "--log-level=error"]); res.out = res.ok ? "" : res.out; }
    else { ran.check++; res = sh("node", ["--check", file("mjs", c.code)]); }
  }
  else if (c.run === "check-tsx") { ran.jsx++; res = sh(join(V, "node_modules/.bin/esbuild"), [file("tsx", c.code), "--loader:.tsx=tsx", "--log-level=error"]); res.out = res.ok ? "" : res.out; }
  else if (c.run === "vitest") { ran.vitest++; const p = join(TMP, `t${n++}.test.mjs`); writeFileSync(p, c.code); res = sh(join(V, "node_modules/.bin/vitest"), ["run", p, "--root", TMP], { cwd: V }); }
  else if (c.run === "server") { ran.server++; await runServer(c.code, label); return; }
  else { problems.push(`${label}: unknown run ${c.run}`); return; }

  if (!res.ok) { problems.push(`${label}: FAILED (${c.run})\n${res.out.slice(0, 800)}`); return; }
  if (c.output != null && c.output !== "" && norm(res.out) !== norm(c.output)) {
    problems.push(`${label}: OUTPUT MISMATCH\n--- expected\n${c.output}\n--- got\n${res.out}`);
  }
}

for (const m of course.modules) {
  for (const l of [...m.beginner.lessons, ...m.intermediateLessons, ...m.advancedLessons]) {
    const lines = l.example.code.split("\n").length;
    for (const s of l.demo) for (const ln of s.lines) if (ln < 1 || ln > lines) problems.push(`${l.id}: demo line ${ln} out of range (${lines})`);
    for (const q of l.check) if (q.answer < 0 || q.answer >= q.options.length) problems.push(`${l.id}: bad answer index`);
    await runCode(l.example, `${l.id} example`);
    await runCode(l.practice.solution, `${l.id} practice`);
  }
}
// interview problems
for (const p of course.interview.problems) {
  ran.interview++;
  const fn = new Function(p.solution + `\nreturn ${p.fn};`)();
  for (const [args, want] of p.tests) {
    const got = fn(...structuredClone(args));
    if (!isDeepStrictEqual(got, want)) problems.push(`interview ${p.id}: ${JSON.stringify(args)} expected ${JSON.stringify(want)} got ${JSON.stringify(got)}`);
  }
}
writeFileSync(join(V, "sql-and-server-output.txt"), sqlOut.join("\n\n"));
console.log("ran:", JSON.stringify(ran));
console.log(problems.length ? `${problems.length} PROBLEMS:\n\n` + problems.join("\n\n") : "ALL CLEAN");
