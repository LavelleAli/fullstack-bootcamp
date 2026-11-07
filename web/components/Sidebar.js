"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { useProgress } from "@/lib/progress";

// Tiny shared store for the phone drawer, so the menu button in the header and the drawer stay in sync
let open = false;
const subs = new Set();
const setOpen = (v) => { open = v; subs.forEach((f) => f()); };
const useOpen = () => useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => open, () => false);

export function MenuButton() {
  const isOpen = useOpen();
  return (
    <button type="button" className="menu-btn" aria-expanded={isOpen} aria-controls="side" onClick={() => setOpen(!isOpen)}>
      {isOpen ? "Close" : "Menu"}
    </button>
  );
}

function tierFromPath(path, lessonTiers) {
  const m = path.match(/^\/tiers\/(intermediate|advanced)/);
  if (m) return m[1];
  const lesson = path.match(/^\/learn\/[^/]+\/([^/]+)/);
  return (lesson && lessonTiers[lesson[1]]) || "beginner";
}

export default function Sidebar({ data }) {
  const path = usePathname();
  const router = useRouter();
  const progress = useProgress();
  const isOpen = useOpen();
  const sideRef = useRef(null);
  const tier = tierFromPath(path, data.lessonTiers);

  // Close the drawer on navigation and on Escape
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    if (!isOpen) return;
    sideRef.current?.querySelector("a,button")?.focus();
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const solved = Object.keys(progress.solved).length;
  const cur = (href) => (path === href ? { "aria-current": "page" } : {});

  return (
    <>
      <nav className={`side ${isOpen ? "open" : ""}`} id="side" aria-label="Course map" ref={sideRef}>
        <div className="tier-tabs" role="group" aria-label="Tier">
          {data.tiers.map((t) => (
            <button key={t.id} type="button" aria-pressed={t.id === tier}
              onClick={() => router.push(t.id === "beginner" ? "/" : `/tiers/${t.id}`)}>
              {t.name}
            </button>
          ))}
        </div>
        <div className="navgroup">
          <Link className="navlink" href="/" {...cur("/")}><span>Start here</span></Link>
          <Link className="navlink" href="/projects" {...cur("/projects")}><span>All practice projects</span></Link>
          <Link className="navlink" href="/interview" {...(path.startsWith("/interview") ? { "aria-current": "page" } : {})}>
            <span>Interview coding tests</span><span className="count">{solved}/{data.problemCount}</span>
          </Link>
        </div>
        <div className="navgroup">
          <span className="label">{data.tiers.find((t) => t.id === tier).name} modules</span>
          {data.modules.map((m) => {
            const href = tier === "beginner" ? `/learn/${m.id}` : `/tiers/${tier}/${m.id}`;
            const ids = m.lessonIds[tier] ?? [];
            const done = ids.filter((id) => progress.done[id]).length;
            const total = ids.length;
            const active = path === href || path.startsWith(`/learn/${m.id}/`);
            return (
              <Link key={m.id} className="navlink" href={href} {...(active ? { "aria-current": "page" } : {})}>
                <span>{m.name}</span>
                {total
                  ? <span className={`count ${done === total ? "full" : ""}`}>{done}/{total}</span>
                  : <span className="count">{m.topics[tier]} topics</span>}
              </Link>
            );
          })}
        </div>
      </nav>
      {isOpen && <div className="scrim" onClick={() => setOpen(false)} />}
    </>
  );
}

