import Link from "next/link";
import { notFound } from "next/navigation";
import { getModule, getTier, lessonsOf, modules, slimModule, tierWritten } from "@/lib/course";
import { md } from "@/lib/md";
import { Crumbs, DocsLinks, Outline, TierIntro } from "@/components/content";
import { LessonList, ModuleCount } from "@/components/ProgressBits";

export const dynamicParams = false;
export const generateStaticParams = () =>
  ["intermediate", "advanced"].flatMap((tier) => modules.map((m) => ({ tier, module: m.id })));

export async function generateMetadata({ params }) {
  const { tier, module } = await params;
  const t = getTier(tier), m = getModule(module);
  return t && m ? { title: `${m.name} · ${t.name}`, description: `${t.name} ${m.name} lessons and topics` } : {};
}

export default async function TierModulePage({ params }) {
  const { tier, module } = await params;
  const t = getTier(tier), m = getModule(module);
  if (!t || !m || t.id === "beginner") notFound();
  const list = lessonsOf(m, t.id);
  const items = list.map((l) => ({ id: l.id, title: l.title, minutes: l.minutes, goalHtml: md(l.goal) }));
  const slim = slimModule(m);

  return (
    <>
      <Crumbs items={[{ label: "Course", href: "/" }, { label: t.name, href: `/tiers/${t.id}` }, { label: m.name }]} />
      <TierIntro t={t} written={tierWritten(t.id)} title={`${m.name} · ${t.name}`} />
      <section className="section">
        <div className="section-head">
          <h2>{list.length ? "Lessons" : "Topics"}</h2>
          {list.length ? <ModuleCount mod={slim} tier={t.id} /> : <Link href={`/learn/${m.id}`}>Beginner lessons →</Link>}
        </div>
        {list.length ? <LessonList moduleId={m.id} lessons={items} /> : <Outline items={m[t.id]} />}
        <DocsLinks mod={m} />
      </section>
    </>
  );
}
