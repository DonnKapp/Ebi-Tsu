import { ArrowLeft, ArrowUpRight, RefreshCw } from "lucide-react";
import { Link, useRoute } from "wouter";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Line = {
  id: string;
  family: "neocaridina" | "caridina";
  name: string;
  description: string;
  availability:
    | "available"
    | "limited"
    | "accepting_requests"
    | "out_of_stock"
    | "coming_soon";
  availability_note: string;
  price: number;
  quantity: number;
  minimum_order: number;
  image_url: string | null;
  shipping_placeholder: string;
  live_arrival_placeholder: string;
  payment_placeholder: string;
};

const labels: Record<Line["availability"], string> = {
  available: "In stock",
  limited: "Limited availability",
  accepting_requests: "Accepting requests",
  out_of_stock: "Out of stock",
  coming_soon: "Coming soon",
};

const familyImages = {
  neocaridina: "/assets/ebi-tsu-neocaridina.webp",
  caridina: "/assets/ebi-tsu-caridina.webp",
};

export default function LineDetail() {
  const [, params] = useRoute("/catalog/:id");
  const [line, setLine] = useState<Line | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;
    if (!params?.id) {
      setLoading(false);
      return () => {
        active = false;
      };
    }

    setLoading(true);
    setLoadError("");
    setLine(null);

    supabase
      .from("inventory_items")
      .select(
        "id, family, name, description, availability, availability_note, price, quantity, minimum_order, image_url, shipping_placeholder, live_arrival_placeholder, payment_placeholder"
      )
      .eq("id", params.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error)
          setLoadError("The live line details could not be loaded right now.");
        else setLine(data as Line | null);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [params?.id, retryKey]);

  if (loading) {
    return (
      <div className="catalog-detail">
        <section className="catalog-detail__hero page-width">
          <div className="catalog-state" role="status">
            <span className="catalog-loading">Loading line details…</span>
          </div>
        </section>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="catalog-detail">
        <section className="catalog-detail__hero page-width">
          <Link href="/" className="back-link">
            <ArrowLeft size={15} /> Back to home
          </Link>
          <div className="catalog-state catalog-state--error" role="alert">
            <strong>Line details are temporarily unavailable.</strong>
            <p>{loadError}</p>
            <button
              className="button button--dark"
              type="button"
              onClick={() => setRetryKey(value => value + 1)}
            >
              <RefreshCw size={14} /> Try again
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (!line) {
    return (
      <div className="catalog-detail">
        <section className="catalog-detail__hero page-width">
          <Link href="/" className="back-link">
            <ArrowLeft size={15} /> Back to home
          </Link>
          <div className="catalog-state">
            <span className="section-label">
              <span>404</span> Catalog line
            </span>
            <h1>Line not found.</h1>
            <p>
              This catalog entry may have been removed or is no longer public.
            </p>
            <Link href="/neocaridina" className="text-link">
              Return to collections <ArrowUpRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const image = line.image_url || familyImages[line.family];

  return (
    <div className="catalog-detail">
      <section className="catalog-detail__hero page-width">
        <Link href={`/${line.family}`} className="back-link">
          <ArrowLeft size={15} /> Back to {line.family}
        </Link>
        <div className="catalog-detail__grid">
          <figure>
            <img
              src={image}
              alt={`${line.name} shrimp placeholder`}
              width="2176"
              height="1632"
            />
            <figcaption>{line.family} / visual placeholder</figcaption>
          </figure>
          <div>
            <span className="section-label">
              <span>—</span> {line.family} line
            </span>
            <h1>{line.name}</h1>
            <p>{line.description}</p>
            <span
              className={`catalog-detail__status catalog-detail__status--${line.availability}`}
            >
              <span /> {labels[line.availability]}
            </span>
            <p className="catalog-detail__availability-note">
              {line.availability_note}
            </p>
            <div className="catalog-detail__facts">
              <span>
                <small>Price</small>
                {line.price === 0
                  ? "$0 placeholder"
                  : `$${Number(line.price).toFixed(2)}`}
              </span>
              <span>
                <small>Quantity</small>
                {line.quantity}
              </span>
              <span>
                <small>Minimum order</small>
                {line.minimum_order}
              </span>
            </div>
            <Link
              href={`/livestock-request?line=${line.id}`}
              className="button button--dark"
            >
              Request {line.name} <ArrowUpRight size={15} />
            </Link>
            <p className="catalog-detail__request-note">
              Availability is informational. Submitting a request does not place
              an order or reserve livestock.
            </p>
          </div>
        </div>
      </section>
      <section className="catalog-detail__policies section-pad">
        <div className="page-width">
          <span className="section-label">
            <span>—</span> Before availability
          </span>
          <div className="catalog-detail__policy-intro">
            <div>
              <h2>Know the process.</h2>
              <p>
                Shipping, live-arrival, payment, and ordering terms will be
                published before live livestock checkout is enabled. Until then,
                catalog information and requests are designed for thoughtful
                planning—not purchase or reservation.
              </p>
            </div>
            <Link href="/ordering" className="button button--light">
              Ordering & availability <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
