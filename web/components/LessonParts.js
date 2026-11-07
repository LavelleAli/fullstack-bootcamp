"use client";
// Interactive pieces of a lesson page: quiz, hint/solution reveal, mark complete.
import { useEffect, useRef, useState } from "react";
import { md } from "@/lib/md";
import { answerQuiz, setLast, toggleDone, useProgress } from "@/lib/progress";

export function Quiz({ lessonId, questions }) {
  const { quiz } = useProgress();
  const answers = quiz[lessonId] || {};
  const whyRefs = useRef([]);
  const [justAnswered, setJustAnswered] = useState(null);

  useEffect(() => {
    if (justAnswered != null) whyRefs.current[justAnswered]?.focus({ preventScroll: true });
  }, [justAnswered]);

  return (
    <div className="quiz">
      {questions.map((q, qi) => {
        const chosen = answers[qi];
        const answered = chosen !== undefined;
        return (
          <div className="q" key={qi}>
            <fieldset>
              <legend><span dangerouslySetInnerHTML={{ __html: `${qi + 1}. ${md(q.q)}` }} /></legend>
              {q.options.map((o, oi) => {
                const state = answered ? (oi === q.answer ? "right" : oi === chosen ? "wrong" : "") : "";
                const mark = answered && oi === q.answer ? "✓" : answered && oi === chosen ? "✕" : String.fromCharCode(65 + oi);
                return (
                  <button key={oi} type="button" className={`opt ${state}`} disabled={answered}
                    onClick={() => { answerQuiz(lessonId, qi, oi); setJustAnswered(qi); }}>
                    <span className="mark">{mark}</span><span dangerouslySetInnerHTML={{ __html: md(o) }} />
                  </button>
                );
              })}
            </fieldset>
            {answered && (
              <p className="why" tabIndex={-1} ref={(el) => (whyRefs.current[qi] = el)}
                dangerouslySetInnerHTML={{ __html: (chosen === q.answer ? "<strong>Correct.</strong> " : "<strong>Not quite.</strong> ") + md(q.why) }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/** A "Show X / Hide X" toggle around some content. */
export function Reveal({ showLabel, hideLabel, children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="btn" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? hideLabel : showLabel}</button>
      {open && <div className="reveal-body">{children}</div>}
    </>
  );
}

export function CompleteRow({ lessonId }) {
  const { done } = useProgress();
  const isDone = !!done[lessonId];
  useEffect(() => { setLast(lessonId); }, [lessonId]);
  return (
    <div className="complete-row">
      <div>
        <strong>{isDone ? "Lesson complete." : "Finished the lesson?"}</strong>
        <p className="muted">{isDone ? "It counts toward your progress." : "Mark it done to track your progress."}</p>
      </div>
      <button type="button" className={`btn ${isDone ? "" : "primary"}`} onClick={() => toggleDone(lessonId)}>
        {isDone ? "Mark as not done" : "Mark complete"}
      </button>
    </div>
  );
}

export function DonePill({ lessonId }) {
  const { done } = useProgress();
  return done[lessonId] ? <span className="pill ok">Completed</span> : null;
}
