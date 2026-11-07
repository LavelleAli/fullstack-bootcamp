// Server-only syntax highlighting. Runs at build time, so no highlighter ships to the browser.
import hljs from "highlight.js/lib/common";

const LANG = { js: "javascript", jsx: "javascript", ts: "typescript", html: "xml", css: "css", python: "python", sql: "sql" };

const escape = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/**
 * Highlights code one line at a time, so the walkthrough can light up single lines.
 * @param {string} code @param {string} lang @returns {string[]} HTML per line (hljs output is escaped)
 */
export function highlightLines(code, lang) {
  const language = LANG[lang];
  return code.split("\n").map((line) => {
    if (!language || !line) return escape(line);
    try {
      return hljs.highlight(line, { language, ignoreIllegals: true }).value;
    } catch {
      return escape(line);
    }
  });
}

export const LANG_NAMES = { js: "JavaScript", jsx: "JSX", ts: "TypeScript", html: "HTML", css: "CSS", python: "Python", sql: "SQL", text: "Notes" };
