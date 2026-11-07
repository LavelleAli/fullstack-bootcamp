import Link from "next/link";
import { getModule, problems, questions, tierName } from "@/lib/course";
import { Md } from "@/lib/md";
import { Crumbs, ProjectCard } from "@/components/content";
import { ProblemList, SolvedCount } from "@/components/Interview";

export const metadata = { title: "Interview coding tests", description: "Classic junior developer coding problems with in-browser tests, plus concept questions." };

export default function InterviewPage() {
  const slim = problems.map(({ id, title, level, topic, tier }) => ({ id, title, level, topic, tierName: tierName(tier) }));
  return (
    <>
      <Crumbs items={[{ label: "Course", href: "/" }, { label: "Interview coding tests" }]} />
      <header className="lesson-head">
        <div className="meta"><span className="pill">Interview Prep</span><SolvedCount total={problems.length} /></div>
        <h1>Interview coding tests</h1>
        <p className="goal">
          Write your solution in the editor and run the tests right here in your browser. Use the 6-step method from{" "}
          <Link href="/learn/interview/int-how">How junior coding interviews work</Link>, and say each step out loud.
        </p>
      </header>
      <ProblemList problems={slim} />
      <section className="section">
        <div className="section-head"><h2>Concept questions</h2><span className="muted">Answer out loud, then open to check</span></div>
        <div className="qas">
          {questions.map((q) => (
            <details key={q.q} className="qa"><summary><Md text={q.q} /></summary><Md as="p" text={q.a} /></details>
          ))}
        </div>
      </section>
      <ProjectCard project={getModule("interview").beginner.project} heading="Practice" />
    </>
  );
}
