import Link from "next/link";

export default function NotFound() {
  return (
    <section className="notfound">
      <span className="label">404</span>
      <h1>That page isn't in the course.</h1>
      <p className="muted">The link may be old, or the lesson may have moved.</p>
      <Link className="btn primary" href="/">Go to the course map</Link>
    </section>
  );
}
