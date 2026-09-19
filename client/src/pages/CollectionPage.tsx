import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, LockKeyhole, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import type { ReactNode } from "react";
import { supabase } from "@/lib/supabase";

type CollectionPageProps = {
  family: "Neocaridina" | "Caridina";
  image: string;
  number: string;
  title: ReactNode;
  intro: string;
  details: string;
};

type CatalogLine = {
  id: string;
  name: string;
  description: string;
  availability:
    | "available"
    | "limited"
    | "accepting_requests"
    | "out_of_stock"
    | "coming_soon";
  image_url: string | null;
};

const availabilityLabels: Record<CatalogLine["availability"], string> = {
  available: "In stock",
  limited: "Limited availability",
  accepting_requests: "Accepting requests",
  out_of_stock: "Out of stock",
  coming_soon: "Coming soon",
};

export default function CollectionPage({
  family,
  image,
  number,
  title,
  intro,
  details,
}: CollectionPageProps) {
  const familyKey = family.toLowerCase() as "neocaridina" | "caridina";
  const [lines, setLines] = useState<CatalogLine[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;
    setCatalogLoading(true);
    setCatalogError("");

    supabase
      .from("inventory_items")
      .select("id, name, description, availability, image_url")
      .eq("family", familyKey)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setLines([]);
          setCatalogError(
            "The live catalog could not be loaded right now. No availability information has been substituted."
          );
        } else {
          setLines((data ?? []) as CatalogLine[]);
        }
        setCatalogLoading(false);
      });

    return () => {
      active = false;
    };
  }, [familyKey, retryKey]);

  return (
    <div className="detail-page">
      <section className="detail-hero page-width">
        <Link href="/" className="back-link">
          <ArrowLeft size={15} /> Back to home
        </Link>
        <div className="detail-hero__grid">
          <div className="detail-hero__copy">
            <div className="section-label">
              <span>{number}</span> Collection study / {family}
            </div>
            <h1>{title}</h1>
            <p>{intro}</p>
            <span className="status-pill">
              <span /> Catalog developing / requests welcome
            </span>
          </div>
          <figure className="detail-hero__image">
            <img
              src={image}
              alt={`${family} shrimp in a planted aquarium`}
              width="2176"
              height="1632"
            />
            <figcaption>
              Visual study / {family.toLowerCase()} in planted water
            </figcaption>
          </figure>
        </div>
      </section>
      <section className="detail-body section-pad">
        <div className="page-width detail-body__grid">
          <div className="section-label">
            <span>—</span> A note on the collection
          </div>
          <div>
            <h2>{details}</h2>
            <p>
              The initial {family} lines are listed below as a working catalog.
              Every entry is currently marked out of stock while permits,
              sourcing, and business costs are finalized.
              <br />
              <br />
              Placeholder pricing, quantities, shipping policies, arrival
              policies, and payment information are intentionally marked for
              later revision.
            </p>
            <Link href="/contact" className="text-link">
              Talk to Ebi Tsū <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>
      <section className="catalog-section section-pad">
        <div className="page-width">
          <div className="section-heading">
            <div>
              <span className="section-label">
                <span>03</span> {family} catalog
              </span>
              <h2 className="catalog-heading">
                Browse the
                <br />
                <em>working list.</em>
              </h2>
            </div>
            <span className="section-heading__note">
              {catalogLoading
                ? "Loading live availability"
                : `${lines.length} lines / managed availability`}
            </span>
          </div>

          {catalogLoading && (
            <div className="catalog-state" role="status">
              <span className="catalog-loading">Loading catalog…</span>
            </div>
          )}

          {!catalogLoading && catalogError && (
            <div className="catalog-state catalog-state--error" role="alert">
              <strong>Live availability is temporarily unavailable.</strong>
              <p>{catalogError}</p>
              <button
                className="button button--dark"
                type="button"
                onClick={() => setRetryKey(value => value + 1)}
              >
                <RefreshCw size={14} /> Try again
              </button>
            </div>
          )}

          {!catalogLoading && !catalogError && lines.length === 0 && (
            <div className="catalog-state">
              <strong>No lines are published in this collection yet.</strong>
              <p>Please check back as the catalog develops.</p>
            </div>
          )}

          {!catalogLoading && !catalogError && lines.length > 0 && (
            <div className="catalog-grid">
              {lines.map((line, index) => (
                <article className="catalog-card" key={line.id}>
                  <div className="catalog-card__image">
                    <img
                      src={line.image_url || image}
                      alt={`${line.name} shrimp placeholder`}
                      width="2176"
                      height="1632"
                      loading="lazy"
                      decoding="async"
                    />
                    <span
                      className={`catalog-card__availability catalog-card__availability--${line.availability}`}
                    >
                      {availabilityLabels[line.availability]}
                    </span>
                  </div>
                  <div className="catalog-card__content">
                    <div>
                      <span className="catalog-card__number">
                        {family} / {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3>{line.name}</h3>
                      <p>{line.description}</p>
                      <Link
                        className="catalog-card__details"
                        href={`/catalog/${line.id}`}
                      >
                        View line details <ArrowUpRight size={13} />
                      </Link>
                    </div>
                    <div className="catalog-card__footer">
                      {line.availability === "out_of_stock" ? (
                        <span className="catalog-card__placeholder">
                          <LockKeyhole size={13} /> Currently unavailable
                        </span>
                      ) : (
                        <span className="catalog-card__placeholder">
                          Non-binding requests welcome
                        </span>
                      )}
                      <Link
                        href={`/livestock-request?line=${line.id}`}
                        className="text-link"
                      >
                        Request this line <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="catalog-note">
            <span className="section-label">
              <span>—</span> Before availability
            </span>
            <p>
              Catalog availability is informational and is not an offer to
              purchase. Prices, quantities, shipping rules, live-arrival policy,
              and payment methods will be finalized before ordering is enabled.
            </p>
            <Link href="/ordering" className="text-link">
              Ordering & availability <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
