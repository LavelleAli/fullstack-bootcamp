import { course, modules } from "@/lib/course";
import { Capstone, Crumbs, ProjectCard } from "@/components/content";

export const metadata = { title: "Practice projects", description: "One project per module, each with steps and a test checklist." };

export default function ProjectsPage() {
  return (
    <>
      <Crumbs items={[{ label: "Course", href: "/" }, { label: "Projects" }]} />
      <header className="lesson-head">
        <h1>Practice projects</h1>
        <p className="goal">One project per module. Each one has steps and a test checklist, so you know when it's really done.</p>
      </header>
      {modules.map((m) => <ProjectCard key={m.id} project={m.beginner.project} heading={`${m.name} · Beginner project`} />)}
      {["intermediate", "advanced"].map((tid) => (
        <section key={tid} className="section">
          <div className="section-head"><h2>{tid === "intermediate" ? "Intermediate" : "Advanced"} capstones</h2></div>
          {course.tierProjects[tid].map((p) => <Capstone key={p.title} project={p} heading={`${tid === "intermediate" ? "Intermediate" : "Advanced"} capstone`} />)}
        </section>
      ))}
    </>
  );
}
