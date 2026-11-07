"use client";
// Small client components that show progress inside otherwise static pages.
import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { lessonHref, moduleProgress, nextLesson } from "@/lib/progress-math";

export function ContinueButton() {
  const { done, last } = useProgress();
  const target = nextLesson(done, last);
  if (!target) return <span className="pill ok">Every lesson complete</span>;
  const started = Object.keys(done).length > 0;
  return <Link className="btn primary" href={lessonHref(target)}>{started ? "Continue" : "Start"}: {target.title}</Link>;
}

export function ModuleBar({ mod }) {
  const { done } = useProgress();
  const { count, total, pct } = moduleProgress(mod, done);
  return (
    <>
      <div className="bar" role="progressbar" aria-label={`${mod.name}: ${count} of ${total} lessons done`} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <i style={{ width: `${pct}%` }} />
      </div>
      {count === total && <span className="pill ok done-pill">Done</span>}
    </>
  );
}

export function ModuleCount({ mod, tier = "beginner" }) {
  const { done } = useProgress();
  const { count, total } = moduleProgress(mod, done, tier);
  return <span className="muted">{count} of {total} done</span>;
}

export function LessonList({ moduleId, lessons }) {
  const { done } = useProgress();
  return (
    <ol className="lesson-list">
      {lessons.map((l, i) => (
        <li key={l.id} className={done[l.id] ? "done" : ""}>
          <Link href={`/learn/${moduleId}/${l.id}`}>
            <span className="num" aria-hidden="true">{done[l.id] ? "✓" : i + 1}</span>
            <span>
              <strong>{l.title}</strong>{done[l.id] && <span className="sr"> (completed)</span>}
              <br /><span className="meta" dangerouslySetInnerHTML={{ __html: l.goalHtml }} />
            </span>
            <span className="meta">{l.minutes} min</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
