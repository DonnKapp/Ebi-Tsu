import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Mail,
  MessageCircle,
  Send,
  Sparkles,
  Youtube,
} from "lucide-react";
import { Link } from "wouter";

const socials = [
  {
    label: "YouTube",
    detail: "@Ebi-Tsū",
    href: "https://www.youtube.com/@Ebi-Tsū",
    icon: Youtube,
  },
  {
    label: "Facebook",
    detail: "Ebi Tsū",
    href: "https://www.facebook.com/profile.php?id=61594344066783",
    icon: Facebook,
  },
  {
    label: "Instagram",
    detail: "@Ebi_Tsu",
    href: "https://www.instagram.com/Ebi_Tsu/",
    icon: Instagram,
  },
  {
    label: "WhatsApp",
    detail: "850-776-4979",
    href: "https://wa.me/18507764979",
    icon: MessageCircle,
  },
  {
    label: "Telegram",
    detail: "@Ebi_Tsu",
    href: "https://t.me/Ebi_Tsu",
    icon: Send,
  },
];

export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero page-width">
        <Link href="/" className="back-link">
          ← Back to home
        </Link>
        <div className="section-label">
          <span>04</span> About Ebi Tsū
        </div>
        <h1>
          A practice built
          <br />
          around <em>attention.</em>
        </h1>
        <p>
          海老通 — Ebi Tsū — is a name for fluency in shrimp. This is the
          beginning of a professional home for aquatic livestock, breeding
          knowledge, and the quiet craft of keeping.
        </p>
      </section>

      <section className="about-principles section-pad">
        <div className="page-width">
          <div className="section-heading">
            <div className="section-label">
              <span>01</span> Working principles
            </div>
            <span className="section-heading__note">
              A point of view, not a promise list
            </span>
          </div>
          <div className="principle-grid">
            <article>
              <span>01</span>
              <h2>
                Observe
                <br />
                <em>first.</em>
              </h2>
              <p>
                We pay attention to form, movement, environment, and the subtle
                signals of a healthy aquatic life.
              </p>
            </article>
            <article>
              <span>02</span>
              <h2>
                Share
                <br />
                <em>clearly.</em>
              </h2>
              <p>
                As the catalog grows, information should be easy to understand
                and honest about what is known.
              </p>
            </article>
            <article>
              <span>03</span>
              <h2>
                Build
                <br />
                <em>slowly.</em>
              </h2>
              <p>
                Strong collections take time. This site will expand as the work
                is ready, not before.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="about-contact section-pad" id="contact">
        <div className="page-width about-contact__grid">
          <div>
            <Sparkles size={21} />
            <h2>
              The next chapter
              <br />
              <em>starts here.</em>
            </h2>
          </div>
          <div>
            <p>
              For questions about Ebi Tsū, the collection, or what may be coming
              next, reach out directly. We’ll be glad to hear from you.
            </p>
            <a
              className="contact-placeholder"
              href="mailto:Ebi-Tsu@outlook.com"
            >
              <Mail size={16} /> Ebi-Tsu@outlook.com <ArrowUpRight size={15} />
            </a>
            <span className="about-contact__note">
              © 2026 Ebi Tsū. All rights reserved.
              <br />
              The Shrimp Connoisseur.
            </span>

            <div
              className="about-socials"
              aria-labelledby="about-socials-heading"
            >
              <div className="about-socials__heading">
                <span className="section-label" id="about-socials-heading">
                  Stay connected
                </span>
              </div>
              <div className="about-socials__grid">
                {socials.map(({ label, detail, href, icon: Icon }) => (
                  <a
                    key={label}
                    className="about-social about-social--icon"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${label}: ${detail}`}
                    title={label}
                  >
                    <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
