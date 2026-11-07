"use client";
import { useProgress } from "@/lib/progress";
import { overallProgress } from "@/lib/progress-math";

export default function OverallProgress() {
  const { done } = useProgress();
  const { pct } = overallProgress(done);
  return (
    <span className="overall" aria-live="polite">
      <span className="txt">{pct}% complete</span>
      <span className="bar" role="progressbar" aria-label="Course progress" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <i style={{ width: `${pct}%` }} />
      </span>
    </span>
  );
}
