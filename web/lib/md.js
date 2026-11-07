// The course text uses two bits of markdown: `code` and **bold**. Everything else is escaped.
export function md(s) {
  return String(s)
    .replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c])
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

/** Renders course text with the two markdown marks. Content comes from our own course.json. */
export function Md({ text, as: Tag = "span", className }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: md(text) }} />;
}
