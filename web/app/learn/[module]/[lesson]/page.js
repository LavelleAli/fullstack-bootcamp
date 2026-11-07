import Link from "next/link";
import { notFound } from "next/navigation";
import { allLessons, getLesson, getModule, lessonHref, neighbours, tierName, tierPill } from "@/lib/course";
import { highlightLines, LANG_NAMES } from "@/lib/highlight";
import { Md } from "@/lib/md";
import { Crumbs, Diagram, DocsLinks, StaticCode } from "@/components/content";
import Walkthrough from "@/components/Walkthrough";
import { CompleteRow, DonePill, Quiz, Reveal } from "@/components/LessonParts";

export const dynamicParams = false;
export const generateStaticParams = () => allLessons.map((l) => ({ module: l.moduleId, lesson: l.id }));

export async function generateMetadata({ params }) {
  const { module, lesson } = await params;
  const l = getLesson(module, lesson);
  return l ? { title: l.title, description: l.goal.replace(/[`*]/g, "") } : {};
}

const EXT = { python: "py", text: "txt" };

export default async function LessonPage({ params }) {
  const { module, lesson } = await params;
  const l = getLesson(module, lesson);
  const m = getModule(module);
  if (!l || !m) notFound();
  const { prev, next } = neighbours(l.id);
  const ex = l.example;
  const sol = l.practice.solution;

  return (
    <>
      <Crumbs items={[
        { label: "Course", href: "/" },
        { label: m.name, href: l.tier === "beginner" ? `/learn/${m.id}` : `/tiers/${l.tier}/${m.id}` },
        { label: `${tierName(l.tier)} lesson ${l.index + 1}` },
      ]} />
      <header className="lesson-head">
        <div className="meta"><span className={`pill ${tierPill(l.tier)}`}>{tierName(l.tier)}</span><span className="pill sun">{l.minutes} min</span><DonePill lessonId={l.id} /></div>
        <h1>{l.title}</h1>
        <p className="goal"><strong>Goal:</strong> <Md text={l.goal} /></p>
      </header>

      <section className="prose">{l.body.map((p, i) => <Md key={i} as="p" text={p} />)}</section>

      {l.diagram && <Diagram id={l.diagram} />}

      <section className="section">
        <div className="section-head"><h2>Walkthrough</h2><span className="muted">Press Play, or step through it line by line</span></div>
        <Walkthrough
          lines={highlightLines(ex.code, ex.lang)}
          steps={l.demo}
          code={ex.code}
          file={ex.file || `example.${EXT[ex.lang] || ex.lang}`}
          langName={LANG_NAMES[ex.lang] || ex.lang}
        />
        <DocsLinks mod={m} lessonTitle={l.title} />
      </section>

      <section className="practice">
        <span className="label">Practice</span>
        <Md as="p" text={l.practice.task} />
        <div className="actions">
          <Reveal showLabel="Show hint" hideLabel="Hide hint"><Md as="p" className="hint" text={l.practice.hint} /></Reveal>
        </div>
        <div className="actions">
          <Reveal showLabel="Show solution" hideLabel="Hide solution"><StaticCode code={sol.code} lang={sol.lang} output={sol.output} /></Reveal>
        </div>
      </section>

      <section className="section">
        <div className="section-head"><h2>Check yourself</h2></div>
        <Quiz lessonId={l.id} questions={l.check} />
      </section>

      <CompleteRow lessonId={l.id} />

      <nav className="pager" aria-label="Lessons">
        {prev ? <Link href={lessonHref(prev)}><span className="label">Previous</span><span>{prev.title}</span></Link> : <span />}
        {next && (
          <Link className="next" href={lessonHref(next)}>
            <span className="label">Next{next.tier !== l.tier ? ` · ${tierName(next.tier)} tier` : next.moduleId !== m.id ? ` · ${next.moduleName}` : ""}</span><span>{next.title}</span>
          </Link>
        )}
      </nav>
    </>
  );
}
