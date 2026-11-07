"use client";
import { useSyncExternalStore } from "react";

// Reads the theme from <html data-theme>, which the inline script in layout.js sets before paint
const getTheme = () => document.documentElement.dataset.theme
  || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
const subscribe = (fn) => {
  const obs = new MutationObserver(fn);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const mq = matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", fn);
  return () => { obs.disconnect(); mq.removeEventListener("change", fn); };
};

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => null);
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button type="button" className="theme-btn" aria-label={`Switch to ${next} theme`}
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try { localStorage.setItem("theme", next); } catch { /* not saved */ }
      }}>
      {theme === null ? "Theme" : theme === "dark" ? "☀ Light" : "☾ Dark"}
    </button>
  );
}
