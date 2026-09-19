import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Mail, Send } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type SelectedLine = {
  id: string;
  name: string;
  family: "neocaridina" | "caridina";
};

export default function LivestockRequest() {
  const [location] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [selectedLine, setSelectedLine] = useState<SelectedLine | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [preferredLine, setPreferredLine] = useState("");
  const [lineLoading, setLineLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [deliveryWarning, setDeliveryWarning] = useState("");

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setUser(data.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) setUser(session?.user ?? null);
      }
    );
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;
    const lineId = new URLSearchParams(window.location.search).get("line");

    setSelectedLine(null);
    setPreferredLine("");
    setSelectedSpecies("");
    setError("");

    if (!lineId)
      return () => {
        active = false;
      };

    setLineLoading(true);
    supabase
      .from("inventory_items")
      .select("id, name, family")
      .eq("id", lineId)
      .maybeSingle()
      .then(({ data, error: lineError }) => {
        if (!active) return;
        if (lineError || !data) {
          setError(
            "We couldn’t load that breeding line. You can still complete a general livestock request below."
          );
        } else {
          const line = data as SelectedLine;
          setSelectedLine(line);
          setPreferredLine(line.name);
          setSelectedSpecies(line.family);
        }
        setLineLoading(false);
      });

    return () => {
      active = false;
    };
  }, [location]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || busy) return;

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const species = selectedLine?.family || String(form.get("species") || "");
    const quantityValue = String(form.get("quantity") || "").trim();
    const quantity = quantityValue ? Number(quantityValue) : null;
    const shippingLocation = String(form.get("shipping_location") || "").trim();
    const timeframe = String(form.get("timeframe") || "").trim();
    const notes = String(form.get("notes") || "").trim();
    const requestedLine = selectedLine?.name || preferredLine.trim();
    const requestNotes = [
      `Preferred line: ${requestedLine || "Not specified"}`,
      `Preferred timeframe: ${timeframe || "Not specified"}`,
      "",
      notes,
    ].join("\n");

    setBusy(true);
    setSubmitted(false);
    setError("");
    setDeliveryWarning("");

    try {
      const { data: savedRequest, error: insertError } = await supabase
        .from("livestock_requests")
        .insert({
          user_id: user.id,
          name,
          email,
          phone: phone || null,
          species,
          quantity,
          shipping_location: shippingLocation || null,
          inventory_item_id: selectedLine?.id || null,
          selected_line: requestedLine || null,
          notes: requestNotes,
        })
        .select("id")
        .single();

      if (insertError || !savedRequest)
        throw (
          insertError ??
          new Error("Livestock request was not returned after saving.")
        );

      formElement.reset();
      setEmail("");
      setSelectedLine(null);
      setSelectedSpecies("");
      setPreferredLine("");
      setSubmitted(true);

      const { error: emailError } = await supabase.functions.invoke(
        "send-inquiry-email",
        {
          body: { recordType: "livestock_request", recordId: savedRequest.id },
        }
      );

      if (emailError) {
        setDeliveryWarning(
          "Your request is safely saved. Email notification is delayed, so please do not submit it again; Ebi Tsū can still review it in the admin inbox."
        );
      }
    } catch {
      setError("We couldn’t save your livestock request. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="contact-page livestock-page">
      <section className="contact-hero page-width">
        <Link href="/" className="back-link">
          <ArrowLeft size={15} /> Back to home
        </Link>
        <div className="section-label">
          <span>07</span> Livestock request
        </div>
        <div className="contact-hero__grid">
          <div>
            <h1>
              Find your
              <br />
              <em>colony.</em>
            </h1>
            <p>
              {selectedLine ? (
                <>
                  You are requesting <strong>{selectedLine.name}</strong>.{" "}
                </>
              ) : null}
              Tell us what you’re looking for. Requests help us understand your
              needs and match future availability thoughtfully—no payment is
              taken here.
            </p>
            <a className="contact-email" href="mailto:Ebi-Tsu@outlook.com">
              <Mail size={16} /> Ebi-Tsu@outlook.com <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="contact-form-wrap">
            {!user && (
              <div className="form-notice" role="status">
                Please <Link href="/account">create an account or log in</Link>{" "}
                before submitting a livestock request.
              </div>
            )}
            {lineLoading && (
              <div className="form-notice" role="status">
                Loading selected breeding line…
              </div>
            )}
            {submitted && (
              <div className="form-notice form-notice--success" role="status">
                <strong>Request received.</strong>
                <br />
                Your request is saved to your account and available to the Ebi
                Tsū team.
              </div>
            )}
            {deliveryWarning && (
              <div className="form-notice form-notice--warning" role="status">
                {deliveryWarning}
              </div>
            )}
            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label>
                  Name *
                  <input
                    required
                    name="name"
                    autoComplete="name"
                    disabled={!user || busy}
                  />
                </label>
                <label>
                  Phone number
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    disabled={!user || busy}
                  />
                </label>
              </div>
              <label>
                Email address *
                <input
                  required
                  name="email"
                  type="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  autoComplete="email"
                  disabled={!user || busy}
                />
              </label>
              <div className="form-row">
                <label>
                  Species *
                  <select
                    required
                    name="species"
                    value={selectedSpecies}
                    onChange={event => setSelectedSpecies(event.target.value)}
                    disabled={!user || busy || Boolean(selectedLine)}
                  >
                    <option value="" disabled>
                      Select species
                    </option>
                    <option value="neocaridina">Neocaridina</option>
                    <option value="caridina">Caridina</option>
                    <option value="either">Either</option>
                    <option value="not_sure">Not sure yet</option>
                  </select>
                </label>
                <label>
                  Quantity
                  <input
                    name="quantity"
                    type="number"
                    min="1"
                    inputMode="numeric"
                    disabled={!user || busy}
                  />
                </label>
              </div>
              <label>
                Preferred breeding line
                <input
                  name="preferred_line"
                  value={preferredLine}
                  onChange={event => setPreferredLine(event.target.value)}
                  readOnly={Boolean(selectedLine)}
                  placeholder="Optional — if you have one in mind"
                  disabled={!user || busy}
                />
              </label>
              <label>
                Shipping location *
                <input
                  required
                  name="shipping_location"
                  placeholder="City, state, or country"
                  autoComplete="country-name"
                  disabled={!user || busy}
                />
              </label>
              <label>
                Preferred timeframe
                <input
                  name="timeframe"
                  placeholder="Optional"
                  disabled={!user || busy}
                />
              </label>
              <label>
                Additional notes
                <textarea
                  name="notes"
                  rows={5}
                  placeholder="Tell us what you’re looking for."
                  disabled={!user || busy}
                />
              </label>
              <button
                className="form-submit"
                disabled={!user || busy || lineLoading}
                type="submit"
              >
                {busy ? "Sending..." : "Send livestock request"}{" "}
                <Send size={16} />
              </button>
            </form>
            <p className="form-note">
              This is a non-binding request, not a purchase. We’ll review
              availability and follow up directly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
