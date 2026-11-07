import Link from "next/link";
import { notFound } from "next/navigation";
import { getProblem, levelPill, problems } from "@/lib/course";
import { Md } from "@/lib/md";
import { Crumbs, StaticCode } from "@/components/content";
import { TestRunner } from "@/components/Interview";
import { Reveal } from "@/components/LessonParts";

export const dynamicParams = false;
export const generateStaticParams = () => problems.map((p) => ({ problem: p.id }));

export async function generateMetadata({ params }) {
  const p = getProblem((await params).problem);
  return p ? { title: p.title, description: p.prompt.replace(/[`*]/g, "") } : {};
}

export default async function ProblemPage({ params }) {
  const p = getProblem((await params).problem);
  if (!p) notFound();
  const i = problems.indexOf(p);
  const prev = problems[i - 1], next = problems[i + 1];
  return (
    <>
      <Crumbs items={[{ label: "Course", href: "/" }, { label: "Interview coding tests", href: "/interview" }, { label: p.title }]} />
      <header className="lesson-head">
        <div className="meta"><span className={`pill ${levelPill(p.level)}`}>{p.level}</span><span className="pill">{p.topic}</span></div>
        <h1>{p.title}</h1>
        <p className="goal"><Md text={p.prompt} /></p>
      </header>
      <TestRunner problem={{ id: p.id, fn: p.fn, tests: p.tests, solution: p.solution }} />
      <section className="practice">
        <span className="label">Stuck?</span>
        <div className="actions"><Reveal showLabel="Show approach" hideLabel="Hide approach"><Md as="p" className="hint" text={p.approach} /></Reveal></div>
        <div className="actions">
          <Reveal showLabel="Show solution" hideLabel="Hide solution">
            <StaticCode code={p.solution} lang="js" />
            <p className="muted" style={{ marginTop: 10 }}><strong>Follow-up the interviewer may ask:</strong> <Md text={p.followUp} /></p>
          </Reveal>
        </div>
      </section>
      <nav className="pager" aria-label="Problems">
        {prev ? <Link href={`/interview/${prev.id}`}><span className="label">Previous</span><span>{prev.title}</span></Link> : <span />}
        {next && <Link className="next" href={`/interview/${next.id}`}><span className="label">Next</span><span>{next.title}</span></Link>}
      </nav>
    </>
  );
}
