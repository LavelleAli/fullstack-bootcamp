import Link from "next/link";
import { allLessons, modules, tiers } from "@/lib/course";
import { ContinueButton, ModuleBar } from "@/components/ProgressBits";

const readyCount = (tier) => allLessons.filter((l) => l.tier === tier).length;

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <span className="label">Self-paced · {modules.length} modules · 3 tiers</span>
        <h1>Learn to build the whole web app: page, server and database.</h1>
        <p className="lede">
          Every lesson has an animated code walkthrough, a diagram where it helps, a practice task with a solution, a quick
          check, and links to free video explanations. Each module ends with a project, and every project has a test checklist.
        </p>
        <div className="hero-actions">
          <ContinueButton />
          <Link className="btn" href="/interview">Practice interview tests</Link>
        </div>
      </section>

      <section className="section">
        <div className="section-head"><h2>Three tiers</h2></div>
        <div className="tiers">
          {tiers.map((t) => (
            <Link key={t.id} className={`tier-card t-${t.id}`} href={t.id === "beginner" ? `/learn/${modules[0].id}` : `/tiers/${t.id}`}>
              <span className="stripe" />
              <h3>{t.name}</h3>
              <p className="muted">{t.blurb}</p>
              <span>{readyCount(t.id)
                ? <span className="pill sun">{readyCount(t.id)} lessons ready</span>
                : <span className="pill">Outline · lessons coming</span>}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head"><h2>Beginner learning path</h2><span className="muted">Take them in order, or jump to what you need</span></div>
        <div className="path">
          {modules.map((m, i) => (
            <Link key={m.id} className="mod-card" href={`/learn/${m.id}`}>
              <div className="top"><span className="step">{String(i + 1).padStart(2, "0")} · {m.kind}</span></div>
              <h3>{m.name}</h3>
              <p>{m.blurb}</p>
              <ModuleBar mod={{ name: m.name, beginner: { lessons: m.beginner.lessons.map((l) => ({ id: l.id })) } }} />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
