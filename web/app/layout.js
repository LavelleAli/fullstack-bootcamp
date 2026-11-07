import "./globals.css";
import Link from "next/link";
import Sidebar, { MenuButton } from "@/components/Sidebar";
import OverallProgress from "@/components/OverallProgress";
import ThemeToggle from "@/components/ThemeToggle";
import { allLessons, modules, tiers, problems } from "@/lib/course";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Full-Stack Bootcamp", template: "%s · Full-Stack Bootcamp" },
  description:
    "A self-paced bootcamp: HTML, CSS, JavaScript, TypeScript, Tailwind, React, Next.js, Python, PostgreSQL, Express, Firebase, APIs and testing.",
  openGraph: { type: "website", siteName: "Full-Stack Bootcamp" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1621" },
  ],
};

// Only the small slice of course data the sidebar needs goes to the client
const navData = {
  tiers: tiers.map(({ id, name }) => ({ id, name })),
  modules: modules.map((m) => ({
    id: m.id,
    name: m.name,
    lessonIds: { beginner: m.beginner.lessons.map((l) => l.id), intermediate: (m.intermediateLessons ?? []).map((l) => l.id), advanced: (m.advancedLessons ?? []).map((l) => l.id) },
    topics: { intermediate: m.intermediate.length, advanced: m.advanced.length },
  })),
  problemCount: problems.length,
  lessonTiers: Object.fromEntries(allLessons.map((l) => [l.id, l.tier])),
};

// Applies a saved theme before first paint, so there's no flash of the wrong theme
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <header className="topbar">
          <MenuButton />
          <Link className="brand" href="/" aria-label="Full-Stack Bootcamp home">
            <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
              <rect x="2" y="2" width="28" height="28" rx="7" fill="var(--sky)" />
              <path d="M9 21 L14 16 L9 11" fill="none" stroke="#0c2131" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="16" y="19" width="8" height="3" rx="1.5" fill="var(--red)" />
              <circle cx="24" cy="9" r="3" fill="var(--sun)" />
            </svg>
            <span className="brand-name">Full-Stack Bootcamp</span>
          </Link>
          <span className="spacer" />
          <OverallProgress />
          <ThemeToggle />
        </header>
        <div className="shell">
          <Sidebar data={navData} />
          <main id="main" tabIndex={-1}>
            <div className="page">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
