"use client";
import { useEffect, useRef, useState } from "react";
import { md } from "@/lib/md";

const STEP_MS = 3800;

/**
 * Animated code walkthrough: highlights the lines for each step, narrates them, and builds up the output.
 * `lines` are pre-highlighted HTML strings from the server.
 */
export default function Walkthrough({ lines, steps, file, langName, code }) {
  const [cur, setCur] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState("Copy");
  const codeRef = useRef(null);
  const step = cur >= 0 ? steps[cur] : null;
  const last = steps.length - 1;

  // Autoplay: advance every few seconds, stop at the end
  useEffect(() => {
    if (!playing) return;
    if (cur >= last) { setPlaying(false); return; }
    const t = setTimeout(() => setCur((c) => c + 1), cur < 0 ? 0 : STEP_MS);
    return () => clearTimeout(t);
  }, [playing, cur, last]);

  // Keep the highlighted lines in view inside the code panel
  useEffect(() => {
    if (!step || !codeRef.current) return;
    const el = codeRef.current.querySelector(`[data-n="${step.lines[0]}"]`);
    if (!el) return;
    const box = codeRef.current;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    box.scrollTo({ top: Math.max(0, el.offsetTop - box.clientHeight / 3), behavior: reduce ? "auto" : "smooth" });
  }, [step]);

  const go = (i) => { setPlaying(false); setCur(Math.max(0, Math.min(last, i))); };
  const play = () => { if (cur >= last) setCur(-1); setPlaying(true); };
  const output = steps.slice(0, cur + 1).map((s) => s.out).filter(Boolean).join("\n");

  async function copy() {
    try { await navigator.clipboard.writeText(code); setCopied("Copied"); }
    catch {
      const r = document.createRange(); r.selectNodeContents(codeRef.current);
      const s = getSelection(); s.removeAllRanges(); s.addRange(r); setCopied("Selected");
    }
    setTimeout(() => setCopied("Copy"), 1500);
  }

  return (
    <div className={`player ${cur >= 0 ? "stepping" : ""} ${playing ? "playing" : ""}`} aria-label="Code walkthrough">
      <div className="player-bar">
        <span className="dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="file">{file}</span>
        <span className="spacer" />
        <span className="lang">{langName}</span>
        <button type="button" className="copy" onClick={copy}>{copied}</button>
      </div>
      <div className="code" role="region" aria-label="Code" tabIndex={0} ref={codeRef}>
        {lines.map((html, i) => (
          <div key={i} data-n={i + 1} className={`ln ${step && step.lines.includes(i + 1) ? "on" : ""}`}>
            <span>{i + 1}</span>
            <code dangerouslySetInnerHTML={{ __html: html || " " }} />
          </div>
        ))}
      </div>
      <div className="narration" aria-live="polite">
        <span className="stepno">{step ? `step ${cur + 1}/${steps.length}` : "ready"}</span>
        <p dangerouslySetInnerHTML={{ __html: step ? md(step.say || "") : `${steps.length} steps. Press Play to watch, or use Next to go at your own pace.` }} />
      </div>
      <div className="console" aria-label="Output">{output}</div>
      <div className="controls">
        <button type="button" onClick={() => go(cur - 1)} disabled={cur <= 0} aria-label="Previous step">◀ Back</button>
        <button type="button" className="play" onClick={() => (playing ? setPlaying(false) : play())}>{playing ? "❚❚ Pause" : "▶ Play"}</button>
        <button type="button" onClick={() => go(cur + 1)} disabled={cur >= last} aria-label="Next step">Next ▶</button>
        <div className="track" role="group" aria-label="Jump to step">
          {steps.map((_, i) => (
            <button key={i} type="button" aria-label={`Step ${i + 1}`} className={i === cur ? "cur" : i < cur ? "seen" : ""} onClick={() => go(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}
