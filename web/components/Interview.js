"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { markSolved, useProgress } from "@/lib/progress";
import { stubFor, summarize, WORKER_SOURCE } from "@/lib/judge";

const levelPill = (level) => (level === "Hard" ? "red" : level === "Medium" ? "sun" : "");

export function SolvedCount({ total }) {
  const { solved } = useProgress();
  return <span className="pill sun">{Object.keys(solved).length}/{total} solved</span>;
}

export function ProblemList({ problems }) {
  const { solved } = useProgress();
  const [level, setLevel] = useState("All");
  const levels = ["All", ...new Set(problems.map((p) => p.level))];
  return (
    <section className="section">
      <div className="section-head">
        <h2>Problems</h2>
        <div className="filter" role="group" aria-label="Filter by level">
          {levels.map((lv) => (
            <button key={lv} type="button" aria-pressed={lv === level} onClick={() => setLevel(lv)}>{lv}</button>
          ))}
        </div>
      </div>
      <div className="problems">
        {problems.filter((p) => level === "All" || p.level === level).map((p) => (
          <Link key={p.id} href={`/interview/${p.id}`}>
            <span><strong>{p.title}</strong><br /><span className="muted">{p.topic}</span></span>
            <span className={`pill ${levelPill(p.level)}`}>{p.level}</span>
            {solved[p.id] ? <span className="pill ok">Solved</span> : <span className="pill">{p.tierName}</span>}
          </Link>
        ))}
      </div>
    </section>
  );
}

const TIME_LIMIT_MS = 2000;

export function TestRunner({ problem }) {
  const draftKey = "fsb-draft-" + problem.id;
  const [code, setCode] = useState(() => stubFor(problem.solution));
  const [result, setResult] = useState(null); // { error } | { rows, passed, total, allPassed } | "running"
  const workerUrl = useRef(null);

  // Load a saved draft after mount (localStorage isn't available on the server)
  useEffect(() => {
    try { const d = localStorage.getItem(draftKey); if (d) setCode(d); } catch { /* no draft */ }
    workerUrl.current = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: "text/javascript" }));
    return () => URL.revokeObjectURL(workerUrl.current);
  }, [draftKey]);

  // Save the draft shortly after typing stops (only on edits, so loading never overwrites it)
  const saveTimer = useRef(null);
  function edit(value) {
    setCode(value);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => { try { localStorage.setItem(draftKey, value); } catch { /* not saved */ } }, 400);
  }

  function run() {
    setResult("running");
    const w = new Worker(workerUrl.current);
    const kill = setTimeout(() => { w.terminate(); setResult({ error: "Stopped after 2 seconds. Check for an infinite loop." }); }, TIME_LIMIT_MS);
    w.onmessage = (e) => {
      clearTimeout(kill); w.terminate();
      if (e.data.error) return setResult({ error: e.data.error });
      const s = summarize(problem.fn, e.data.runs);
      setResult(s);
      if (s.allPassed) markSolved(problem.id);
    };
    w.onerror = (e) => { clearTimeout(kill); w.terminate(); e.preventDefault(); setResult({ error: e.message || "Error running code" }); };
    w.postMessage({ code, fn: problem.fn, tests: problem.tests });
  }

  function onKeyDown(e) {
    if (e.key === "Tab" && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      const el = e.currentTarget, s = el.selectionStart;
      el.setRangeText("  ", s, el.selectionEnd, "end");
      edit(el.value);
    }
  }

  return (
    <section className="section">
      <div className="section-head"><h2>Your solution</h2><span className="muted">JavaScript · runs in your browser</span></div>
      <label className="sr" htmlFor="editor">Code editor</label>
      <textarea className="editor" id="editor" spellCheck={false} autoCapitalize="off" autoComplete="off"
        value={code} onChange={(e) => edit(e.target.value)} onKeyDown={onKeyDown} />
      <div className="linkrow">
        <button type="button" className="btn primary" onClick={run} disabled={result === "running"}>Run tests</button>
        <button type="button" className="btn" onClick={() => { edit(stubFor(problem.solution)); setResult(null); }}>Reset</button>
      </div>
      <ul className="results" aria-live="polite">
        {result === null && <li>{problem.tests.length} tests will run against <code>{problem.fn}</code>.</li>}
        {result === "running" && <li>Running…</li>}
        {result && result.error && <li className="fail">{result.error}</li>}
        {result && result.rows && (
          <>
            {result.rows.map((r, i) => <li key={i} className={r.pass ? "pass" : "fail"}>{r.pass ? "✓" : "✕"} {r.label} {r.detail}</li>)}
            <li className={result.allPassed ? "pass" : "fail"}><strong>{result.passed}/{result.total} passed</strong>{result.allPassed ? " · nice work" : ""}</li>
          </>
        )}
      </ul>
    </section>
  );
}
