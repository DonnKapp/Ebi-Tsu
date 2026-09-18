import { FormEvent, useState } from "react";
import { ArrowLeft, ArrowUpRight, Mail, Send } from "lucide-react";
import { Link } from "wouter";

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
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const inquiry = String(form.get("inquiry") || "");
    const message = String(form.get("message") || "").trim();
    const subject = `${inquiry || "Ebi Tsū inquiry"} — ${name}`;
    const body = [`Name: ${name}`, `Email: ${email}`, `Phone: ${phone || "Not provided"}`, `Inquiry: ${inquiry || "Not selected"}`, "", message].join("\n");
    setSubmitted(true);
    window.location.href = `mailto:Ebi-Tsu@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="contact-page">
      <section className="contact-hero page-width">
        <Link href="/" className="back-link"><ArrowLeft size={15} /> Back to home</Link>
        <div className="section-label"><span>05</span> Start a conversation</div>
        <div className="contact-hero__grid">
          <div>
            <h1>Let’s talk<br /><em>shrimp.</em></h1>
            <p>Whether you have a question about the collection, are planning an order, or want to discuss an import, send a note and we’ll take it from there.</p>
            <a className="contact-email" href="mailto:Ebi-Tsu@outlook.com"><Mail size={16} /> Ebi-Tsu@outlook.com <ArrowUpRight size={15} /></a>
          </div>
          <div className="contact-form-wrap">
            {submitted && <div className="form-notice" role="status">Your email client should open with the inquiry prepared. Thank you for reaching out.</div>}
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row"><label>Name<input required name="name" autoComplete="name" /></label><label>Phone number<input type="tel" name="phone" autoComplete="tel" /></label></div>
              <label>Email address<input required type="email" name="email" autoComplete="email" /></label>
              <label>How can we help?<select required name="inquiry" defaultValue=""><option value="" disabled>Select an inquiry</option>{inquiryOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
              <label>Tell us a little more<textarea required name="message" rows={5} placeholder="How can we help?" /></label>
              <button className="form-submit" type="submit">Prepare inquiry <Send size={16} /></button>
            </form>
            <p className="form-note">This form opens your default email application with your message prepared for Ebi Tsū.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
