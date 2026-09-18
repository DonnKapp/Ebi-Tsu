import { ArrowUpRight, Mail, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero page-width"><Link href="/" className="back-link">← Back to home</Link><div className="section-label"><span>04</span> About Ebi Tsū</div><h1>A practice built<br />around <em>attention.</em></h1><p>海老通 — Ebi Tsū — is a name for fluency in shrimp. This is the beginning of a professional home for aquatic livestock, breeding knowledge, and the quiet craft of keeping.</p></section>
      <section className="about-principles section-pad"><div className="page-width"><div className="section-heading"><div className="section-label"><span>01</span> Working principles</div><span className="section-heading__note">A point of view, not a promise list</span></div><div className="principle-grid"><article><span>01</span><h2>Observe<br /><em>first.</em></h2><p>We pay attention to form, movement, environment, and the subtle signals of a healthy aquatic life.</p></article><article><span>02</span><h2>Share<br /><em>clearly.</em></h2><p>As the catalog grows, information should be easy to understand and honest about what is known.</p></article><article><span>03</span><h2>Build<br /><em>slowly.</em></h2><p>Strong collections take time. This site will expand as the work is ready, not before.</p></article></div></div></section>
      <section className="about-contact section-pad" id="contact"><div className="page-width about-contact__grid"><div><Sparkles size={21} /><h2>The next chapter<br /><em>starts here.</em></h2></div><div><p>Business details and contact channels are intentionally left open in this first build. Add the preferred email, social link, or inquiry workflow here when ready.</p><a className="contact-placeholder" href="mailto:hello@example.com"><Mail size={16} /> hello@example.com <ArrowUpRight size={15} /></a><span className="placeholder-note">Placeholder contact / replace before launch</span></div></div></section>
    </div>
  );
}
