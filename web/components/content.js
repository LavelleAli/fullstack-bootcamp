// Server components shared by several pages.
import Link from "next/link";
import { highlightLines } from "@/lib/highlight";
import { diagrams, lessonsOf, videoSearchUrl } from "@/lib/course";
import { Md, md } from "@/lib/md";
import { LessonList } from "@/components/ProgressBits";

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="var(--red)" d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5A2.7 2.7 0 0 0 2.4 7.2 28 28 0 0 0 2 12a28 28 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.8z" />
    <path fill="#fff" d="M10 15.5v-7l6 3.5z" />
  </svg>
);
const DocIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" />
  </svg>
);

export function Crumbs({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={i} style={{ display: "contents" }}>
          {i > 0 && <span aria-hidden="true">/</span>}
          {it.href ? <Link href={it.href}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function DocsLinks({ mod, lessonTitle }) {
  return (
    <div className="linkrow">
      <a href={videoSearchUrl(mod, lessonTitle)} target="_blank" rel="noopener noreferrer"><PlayIcon /> Find video explanations</a>
      {mod.docs.map((d) => (
        <a key={d.url} href={d.url} target="_blank" rel="noopener noreferrer"><DocIcon /> {d.label}</a>
      ))}
    </div>
  );
}

export function ProjectCard({ project, heading = "Module project" }) {
  return (
    <section className="project">
      <span className="label">{heading}</span>
      <h2>{project.title}</h2>
      <Md as="p" text={project.brief} />
      <div className="cols">
        <div><h3>Steps</h3><ol>{project.steps.map((s) => <li key={s}><Md text={s} /></li>)}</ol></div>
        <div><h3>Test it</h3><ul className="tests">{project.test.map((s) => <li key={s}><Md text={s} /></li>)}</ul></div>
      </div>
    </section>
  );
}

export function Diagram({ id }) {
  const d = diagrams[id];
  if (!d) return null;
  // The SVG is our own static content from course.json
  return (
    <figure className="diagram">
      <div className="dg" dangerouslySetInnerHTML={{ __html: d.svg }} />
      <figcaption>{d.title}</figcaption>
    </figure>
  );
}

export function StaticCode({ code, lang, output }) {
  const lines = highlightLines(code, lang);
  return (
    <pre className="static">
      <code dangerouslySetInnerHTML={{ __html: lines.join("\n") }} />
      {output ? <span className="out">{output}</span> : null}
    </pre>
  );
}

export function Outline({ items }) {
  return <ul className="outline">{items.map((t) => <li key={t}><span>{t}</span></li>)}</ul>;
}

export function TierIntro({ t, written, title }) {
  return (
    <>
      <header className="lesson-head">
        <div className="meta"><span className={`pill ${t.id === "advanced" ? "red" : "sun"}`}>{t.name} tier</span>{!written && <span className="pill">Outline</span>}</div>
        <h1>{title ?? t.name}</h1>
        <p className="goal">{t.blurb}</p>
      </header>
      {!written && (
        <div className="callout">
          <strong>These lessons are planned, not written yet.</strong>
          <p className="muted">Each topic below becomes a full lesson (walkthrough, practice, quiz) in a later pass.</p>
        </div>
      )}
    </>
  );
}

/** A capstone: a full project card once it has steps, otherwise a short outline card. */
export function Capstone({ project, heading }) {
  if (project.steps) return <ProjectCard project={project} heading={heading} />;
  return (
    <div className="callout">
      <h3>{project.title}</h3><p>{project.brief}</p>
      <div className="linkrow">{project.uses.map((u) => <span key={u} className="pill">{u}</span>)}</div>
    </div>
  );
}

/** Lesson list for one module and tier, or the outline if none are written yet. */
export function TierModuleLessons({ mod, tier }) {
  const list = lessonsOf(mod, tier);
  if (!list.length) return <Outline items={mod[tier]} />;
  const items = list.map((l) => ({ id: l.id, title: l.title, minutes: l.minutes, goalHtml: md(l.goal) }));
  return <LessonList moduleId={mod.id} lessons={items} />;
}
