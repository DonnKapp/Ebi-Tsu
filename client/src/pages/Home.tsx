import { ArrowDown, ArrowUpRight, CircleDot, Waves } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { CSSProperties, MouseEvent } from "react";

const heroImage = "/assets/ebi-tsu-hero.png";
const neoImage = "/assets/ebi-tsu-neocaridina.png";
const caridinaImage = "/assets/ebi-tsu-caridina.png";

export default function Home() {
  const [, navigate] = useLocation();

  function openCollection(event: MouseEvent<HTMLAnchorElement>, path: string) {
    event.preventDefault();
    window.history.scrollRestoration = "manual";
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    navigate(path);
  }

  return <div className="home-page">
    <section className="hero" style={{ "--hero-image": `url(${heroImage})` } as CSSProperties}><div className="hero__wash" /><div className="hero__inner page-width"><div className="hero__eyebrow"><span className="eyebrow-line" /> Independent aquatic livestock <span className="hero__year">/ 2026</span></div><div className="hero__content"><p className="hero__kicker">Quietly obsessive.<br />Deeply aquatic.</p><h1>Keep the<br /><em>exceptional.</em></h1><p className="hero__lede">Ebi Tsū is a considered home for beautiful shrimp, thoughtful breeding, and the details that make a planted aquarium feel alive.</p><div className="hero__actions"><a href="#collections" className="button button--light">Explore the collections <ArrowUpRight size={16} /></a><a href="#ethos" className="text-link text-link--light">Our point of view <ArrowDown size={15} /></a></div></div><div className="hero__side-note"><span>01</span><span>Water / form / patience</span></div></div><div className="hero__bottom-line page-width"><span>海老通</span><span>Scroll to explore</span></div></section>
    <section className="intro section-pad" id="ethos"><div className="page-width intro__grid"><div className="section-label"><span>01</span> The Ebi Tsū approach</div><div className="intro__copy"><h2>Good shrimp are<br /><em>the beginning,</em><br />not the whole story.</h2><p>We believe in the small things: a clear line of sight through the tank, a color that holds its own in natural light, the rhythm of a healthy colony, and the patience behind getting there.</p><Link href="/about" className="text-link">Read our point of view <ArrowUpRight size={15} /></Link></div><div className="intro__signal"><CircleDot size={17} /><span>Precision is a form<br />of care.</span></div></div></section>
    <section className="collections section-pad" id="collections"><div className="page-width"><div className="section-heading"><div className="section-label"><span>02</span> Collections</div><span className="section-heading__note">The first study / two directions</span></div><div className="collection-grid"><Link href="/neocaridina" onClick={(event) => openCollection(event, "/neocaridina")} className="collection-card collection-card--neo"><img src={neoImage} alt="Red neocaridina shrimp on aquatic moss" /><div className="collection-card__veil" /><div className="collection-card__top"><span>01 / Neocaridina</span><ArrowUpRight size={18} /></div><div className="collection-card__bottom"><h3>Color<br /><em>with conviction.</em></h3><span>Explore the study</span></div></Link><Link href="/caridina" onClick={(event) => openCollection(event, "/caridina")} className="collection-card collection-card--caridina"><img src={caridinaImage} alt="Blue-black caridina shrimp among aquatic foliage" /><div className="collection-card__veil" /><div className="collection-card__top"><span>02 / Caridina</span><ArrowUpRight size={18} /></div><div className="collection-card__bottom"><h3>Detail<br /><em>in the water.</em></h3><span>Explore the study</span></div></Link></div></div></section>
    <section className="manifesto section-pad"><div className="page-width manifesto__grid"><div className="manifesto__mark"><Waves size={22} /><span>EBI TSŪ<br />MANIFESTO</span></div><blockquote>“The best aquariums do not ask to be noticed. They reward attention.”</blockquote><p>In a culture of more, we are interested in better: fewer distractions, stronger animals, and a practice that respects the pace of living things.</p></div></section>
    <section className="availability section-pad"><div className="page-width availability__grid"><div><div className="section-label"><span>03</span> What is next</div><h2>A living catalog,<br /><em>in progress.</em></h2></div><div className="availability__copy"><p>Individual lines, genetics, availability, and ordering will arrive here as the collection takes shape. For now, this is a place to understand the point of view before the inventory.</p><span className="status-pill"><span /> Catalog development / underway</span></div></div></section>
  </div>;
}
