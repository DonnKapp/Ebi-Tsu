import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="not-found-page">
      <section className="not-found-page__inner page-width">
        <span className="section-label">
          <span>404</span> Page not found
        </span>
        <h1>
          Nothing lives
          <br />
          <em>in this water.</em>
        </h1>
        <p>
          The page may have moved, or the address may no longer be part of the
          Ebi Tsū study.
        </p>
        <div className="not-found-page__actions">
          <Link href="/" className="button button--dark">
            <ArrowLeft size={15} /> Return home
          </Link>
          <Link href="/contact" className="text-link">
            Start a conversation <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
