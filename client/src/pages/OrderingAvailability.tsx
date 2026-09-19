import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";

type StorefrontSettings = {
  availability_guidance: string;
  ordering_guidance: string;
  shipping_guidance: string;
  live_arrival_guidance: string;
  payment_guidance: string;
};

export default function OrderingAvailability() {
  const [settings, setSettings] = useState<StorefrontSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    supabase
      .from("storefront_settings")
      .select(
        "availability_guidance, ordering_guidance, shipping_guidance, live_arrival_guidance, payment_guidance"
      )
      .eq("id", true)
      .maybeSingle()
      .then(({ data, error: loadError }) => {
        if (!active) return;
        if (loadError || !data) {
          setError(
            "Current ordering guidance could not be loaded. Please contact Ebi Tsū directly for the most current information."
          );
        } else {
          setSettings(data as StorefrontSettings);
        }
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [retryKey]);

  return (
    <div className="ordering-page">
      <section className="ordering-hero page-width">
        <Link href="/" className="back-link">
          <ArrowLeft size={15} /> Back to home
        </Link>
        <div className="ordering-hero__grid">
          <div>
            <span className="section-label">
              <span>08</span> Reference
            </span>
            <h1>
              Ordering &
              <br />
              <em>availability.</em>
            </h1>
          </div>
          <div className="ordering-hero__copy">
            <p>
              A clear reference for catalog status, livestock requests, and the
              information that will be finalized before Ebi Tsū offers live
              shipping or checkout.
            </p>
            <span className="status-pill">
              <span /> Pre-order guidance / working draft
            </span>
          </div>
        </div>
      </section>

      <section className="ordering-steps section-pad">
        <div className="page-width">
          <div className="section-heading">
            <div className="section-label">
              <span>01</span> How requests work
            </div>
            <span className="section-heading__note">
              A request is not an order
            </span>
          </div>
          <div className="ordering-steps__grid">
            <article>
              <span>01</span>
              <h2>Browse the collection.</h2>
              <p>
                Use each line page to review its current status and catalog
                details. Availability changes line by line as the collection
                develops.
              </p>
            </article>
            <article>
              <span>02</span>
              <h2>Send a focused request.</h2>
              <p>
                Sign in, select a line if you have one in mind, and describe the
                colony, quantity, and location you are considering.
              </p>
            </article>
            <article>
              <span>03</span>
              <h2>Confirm directly.</h2>
              <p>
                Ebi Tsū will review the request before discussing any future
                availability, shipping eligibility, pricing, or ordering steps.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="ordering-guidance section-pad">
        <div className="page-width">
          <div className="section-heading">
            <div>
              <span className="section-label">
                <span>02</span> Current guidance
              </span>
              <h2 className="ordering-guidance__heading">
                Clear now.
                <br />
                <em>Complete later.</em>
              </h2>
            </div>
            {!loading && !error && (
              <span className="section-heading__note">
                Admin-managed / current
              </span>
            )}
          </div>

          {loading && (
            <div className="catalog-state" role="status">
              <span className="catalog-loading">Loading guidance…</span>
            </div>
          )}

          {!loading && error && (
            <div className="catalog-state catalog-state--error" role="alert">
              <strong>Guidance is temporarily unavailable.</strong>
              <p>{error}</p>
              <button
                className="button button--dark"
                type="button"
                onClick={() => setRetryKey(value => value + 1)}
              >
                <RefreshCw size={14} /> Try again
              </button>
            </div>
          )}

          {!loading && settings && (
            <div className="ordering-guidance__grid">
              <article className="ordering-guidance__primary">
                <span className="section-label">
                  <span>—</span> Availability
                </span>
                <p>{settings.availability_guidance}</p>
              </article>
              <article>
                <span>Ordering</span>
                <p>{settings.ordering_guidance}</p>
              </article>
              <article>
                <span>Shipping</span>
                <p>{settings.shipping_guidance}</p>
              </article>
              <article>
                <span>Live arrival</span>
                <p>{settings.live_arrival_guidance}</p>
              </article>
              <article>
                <span>Payment</span>
                <p>{settings.payment_guidance}</p>
              </article>
            </div>
          )}
        </div>
      </section>

      <section className="ordering-cta section-pad">
        <div className="page-width ordering-cta__grid">
          <div>
            <span className="section-label">
              <span>03</span> Find the right line
            </span>
            <h2>
              Start with a
              <br />
              <em>conversation.</em>
            </h2>
          </div>
          <div>
            <p>
              Requests provide useful context while the collection is being
              prepared. They are the right starting point when a line is not yet
              available or when you are planning ahead.
            </p>
            <div className="ordering-cta__actions">
              <Link href="/livestock-request" className="button button--dark">
                Request livestock <ArrowUpRight size={15} />
              </Link>
              <Link href="/contact" className="text-link">
                Start a conversation <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
