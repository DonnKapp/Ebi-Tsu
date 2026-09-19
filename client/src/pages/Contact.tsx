import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Mail, Send } from "lucide-react";
import { Link } from "wouter";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const inquiryOptions = [
  "General inquiry",
  "Request livestock",
  "Inventory / availability",
  "Order information",
  "Import request",
  "Import brokerage",
  "Aquarium or setup question",
  "Other",
];

export default function Contact() {
  const [user, setUser] = useState<User | null>(null);
  const [inquiryEmail, setInquiryEmail] = useState("");
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || busy) return;

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const inquiry = String(form.get("inquiry") || "");
    const message = String(form.get("message") || "").trim();

    setBusy(true);
    setSubmitted(false);
    setError("");
    setDeliveryWarning("");

    try {
      const { data: savedInquiry, error: insertError } = await supabase
        .from("inquiries")
        .insert({
          user_id: user.id,
          name,
          email,
          phone: phone || null,
          inquiry_type: inquiry,
          message,
        })
        .select("id")
        .single();

      if (insertError || !savedInquiry)
        throw (
          insertError ?? new Error("Inquiry was not returned after saving.")
        );

      formElement.reset();
      setInquiryEmail("");
      setSubmitted(true);

      const { error: emailError } = await supabase.functions.invoke(
        "send-inquiry-email",
        {
          body: { recordType: "inquiry", recordId: savedInquiry.id },
        }
      );

      if (emailError) {
        setDeliveryWarning(
          "Your inquiry is safely saved. Email notification is delayed, so please do not submit it again; Ebi Tsū can still review it in the admin inbox."
        );
      }
    } catch {
      setError("We couldn’t save your inquiry. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="contact-page">
      <section className="contact-hero page-width">
        <Link href="/" className="back-link">
          <ArrowLeft size={15} /> Back to home
        </Link>
        <div className="section-label">
          <span>05</span> Start a conversation
        </div>
        <div className="contact-hero__grid">
          <div>
            <h1>
              Let’s talk
              <br />
              <em>shrimp.</em>
            </h1>
            <p>
              Whether you have a question about the collection, are planning an
              order, or want to discuss an import, send a note and we’ll take it
              from there.
            </p>
            <a className="contact-email" href="mailto:Ebi-Tsu@outlook.com">
              <Mail size={16} /> Ebi-Tsu@outlook.com <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="contact-form-wrap">
            {!user && (
              <div className="form-notice" role="status">
                Please <Link href="/account">create an account or log in</Link>{" "}
                before submitting an inquiry. This keeps your conversation
                connected to your customer record.
              </div>
            )}
            {submitted && (
              <div className="form-notice form-notice--success" role="status">
                <strong>Inquiry received.</strong>
                <br />
                Your message is saved to your account and available to the Ebi
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
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    disabled={!user || busy}
                  />
                </label>
              </div>
              <label>
                Email address *
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={inquiryEmail}
                  onChange={event => setInquiryEmail(event.target.value)}
                  disabled={!user || busy}
                />
              </label>
              <label>
                How can we help? *
                <select
                  required
                  name="inquiry"
                  defaultValue=""
                  disabled={!user || busy}
                >
                  <option value="" disabled>
                    Select an inquiry
                  </option>
                  {inquiryOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Tell us a little more *
                <textarea
                  required
                  name="message"
                  rows={5}
                  placeholder="How can we help?"
                  disabled={!user || busy}
                />
              </label>
              <button
                className="form-submit"
                disabled={!user || busy}
                type="submit"
              >
                {busy ? "Sending..." : "Send inquiry"} <Send size={16} />
              </button>
            </form>
            <p className="form-note">
              Your message is securely saved to your account and sent directly
              to Ebi Tsū.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
