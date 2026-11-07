import Link from "next/link";
import { notFound } from "next/navigation";
import { course, getTier, lessonsOf, modules, slimModule, tierWritten } from "@/lib/course";
import { Capstone, Crumbs, TierIntro, TierModuleLessons } from "@/components/content";
import { ModuleCount } from "@/components/ProgressBits";

export const dynamicParams = false;
export const generateStaticParams = () => [{ tier: "intermediate" }, { tier: "advanced" }];

export async function generateMetadata({ params }) {
  const t = getTier((await params).tier);
  return t ? { title: `${t.name} tier`, description: t.blurb } : {};
}

export default async function TierPage({ params }) {
  const t = getTier((await params).tier);
  if (!t || t.id === "beginner") notFound();
  const written = tierWritten(t.id);
  return (
    <>
      <Crumbs items={[{ label: "Course", href: "/" }, { label: t.name }]} />
      <TierIntro t={t} written={written} />
      <section className="section">
        <div className="section-head"><h2>{t.name} capstone projects</h2></div>
        {course.tierProjects[t.id].map((p) => <Capstone key={p.title} project={p} heading={`${t.name} capstone`} />)}
      </section>
      {modules.map((m) => {
        return (
          <section key={m.id} className="section">
            <div className="section-head">
              <h2><Link href={`/tiers/${t.id}/${m.id}`}>{m.name}</Link></h2>
              {lessonsOf(m, t.id).length ? <ModuleCount mod={slimModule(m)} tier={t.id} /> : <Link href={`/learn/${m.id}`}>Beginner lessons →</Link>}
            </div>
            <TierModuleLessons mod={m} tier={t.id} />
          </section>
        );
      })}
    </>
  );
}
