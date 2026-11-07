import Link from "next/link";
import { notFound } from "next/navigation";
import { getModule, modules, problems, questions, slimModule } from "@/lib/course";
import { md } from "@/lib/md";
import { Crumbs, DocsLinks, ProjectCard } from "@/components/content";
import { LessonList, ModuleCount } from "@/components/ProgressBits";

export const dynamicParams = false;
export const generateStaticParams = () => modules.map((m) => ({ module: m.id }));

export async function generateMetadata({ params }) {
  const m = getModule((await params).module);
  return m ? { title: m.name, description: m.blurb } : {};
}

export default async function ModulePage({ params }) {
  const m = getModule((await params).module);
  if (!m) notFound();
  const toItem = (l) => ({ id: l.id, title: l.title, minutes: l.minutes, goalHtml: md(l.goal) });
  const lessons = m.beginner.lessons.map(toItem);
  const intLessons = (m.intermediateLessons ?? []).map(toItem);
  const advLessons = (m.advancedLessons ?? []).map(toItem);
  const slim = slimModule(m);

  return (
    <>
      <Crumbs items={[{ label: "Course", href: "/" }, { label: "Beginner" }, { label: m.name }]} />
      <header className="lesson-head">
        <div className="meta">
          <span className="pill">{m.kind}</span>
          {m.libs?.map((x) => <span key={x} className="pill sun">{x}</span>)}
        </div>
        <h1>{m.name}</h1>
        <p className="goal">{m.blurb}</p>
      </header>

      <section className="section">
        <div className="section-head"><h2>Beginner lessons</h2><ModuleCount mod={slim} /></div>
        <LessonList moduleId={m.id} lessons={lessons} />
      </section>

      {m.id === "interview" && (
        <div className="callout">
          <h3>Coding tests</h3>
          <p>{problems.length} classic problems with a live code editor that runs the tests in your browser, plus {questions.length} concept questions.</p>
          <p><Link className="btn sun" href="/interview">Open the coding tests</Link></p>
        </div>
      )}

      <ProjectCard project={m.beginner.project} />

      {intLessons.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>Intermediate lessons</h2><ModuleCount mod={slim} tier="intermediate" /></div>
          <LessonList moduleId={m.id} lessons={intLessons} />
        </section>
      )}

      {advLessons.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>Advanced lessons</h2><ModuleCount mod={slim} tier="advanced" /></div>
          <LessonList moduleId={m.id} lessons={advLessons} />
        </section>
      )}

      <section className="section">
        <div className="section-head"><h2>Docs and videos</h2></div>
        <DocsLinks mod={m} />
      </section>
    </>
  );
}
