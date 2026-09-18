import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import type { ReactNode } from "react";

type CollectionPageProps = { family: "Neocaridina" | "Caridina"; image: string; number: string; title: ReactNode; intro: string; details: string };

export default function CollectionPage({ family, image, number, title, intro, details }: CollectionPageProps) {
  return <div className="detail-page"><section className="detail-hero page-width"><Link href="/" className="back-link"><ArrowLeft size={15} /> Back to home</Link><div className="detail-hero__grid"><div className="detail-hero__copy"><div className="section-label"><span>{number}</span> Collection study / {family}</div><h1>{title}</h1><p>{intro}</p><span className="status-pill"><span /> Detailed catalog / coming soon</span></div><figure className="detail-hero__image"><img src={image} alt={`${family} shrimp in a planted aquarium`} /><figcaption>Visual study / {family.toLowerCase()} in planted water</figcaption></figure></div></section><section className="detail-body section-pad"><div className="page-width detail-body__grid"><div className="section-label"><span>—</span> A note on the collection</div><div><h2>{details}</h2><p>Specific lines, genetics, availability, and ordering information will be added as the collection is ready to share. We would rather publish a considered catalog than a hurried one.</p><Link href="/about#contact" className="text-link">Talk to Ebi Tsū <ArrowUpRight size={15} /></Link></div></div></section></div>;
}
