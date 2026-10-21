import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Sparkles } from "lucide-react";
import { HeroArt } from "@/components/hero-art";
import { ScrollVideoHero } from "@/components/scroll-video-hero";
import { FilmJewelleryEdit } from "@/components/film-jewellery-edit";
import { ClosingCampaign } from "@/components/flagship-stories";
import { FeaturedEdit, Lookbook } from "@/components/art-light-stories";
import { CampaignStage, CollectionStage } from "@/components/editorial-stages";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const collections = [
  {
    title: "Rings",
    subtitle: "Sculptural bands and modern signets.",
    image: "muse-ring-portrait",
    detailImage: "solstice-ring",
    alt: "Editorial portrait of the AURELLE muse wearing a sculptural gold ring beside her face",
    portrait: true,
  },
  {
    title: "Necklaces",
    subtitle: "Fine chains, gold pendants and pearls.",
    image: "living-muse-portrait",
    detailImage: "orbit-necklace",
    alt: "The AURELLE muse wearing the Orbit Pendant and sculptural gold hoops",
    portrait: true,
  },
  {
    title: "Earrings",
    subtitle: "Statement hoops and pearl drops.",
    image: "muse-earring-portrait",
    detailImage: "lune-hoops",
    alt: "Three-quarter portrait of the AURELLE muse wearing sculptural gold crescent earrings",
    portrait: true,
  },
  {
    title: "Bracelets",
    subtitle: "Open cuffs and delicate chain bracelets.",
    image: "muse-bracelet-portrait",
    detailImage: "cuff",
    alt: "Portrait of the AURELLE muse wearing a sculptural gold cuff on her raised wrist",
    portrait: true,
  },
];

const questions = [
  [
    "What is gold vermeil?",
    "Gold vermeil is sterling silver coated with a layer of gold at least 2.5 microns thick. This concept collection features an 18k gold finish. See each product page for its materials.",
  ],
  [
    "How do I find my size?",
    "Rings have an adjustable US size 6–8 band. Necklaces include a 5 cm extender. Check the dimensions on each product page for bracelet measurements and available lengths.",
  ],
  [
    "What are the delivery and returns options?",
    "Delivery and returns are simulated in this portfolio demo. No products are shipped. A live store would display its confirmed shipping and returns policy here.",
  ],
  [
    "Can I place a real order?",
    "No. AURELLE is a portfolio concept. You can browse products, add items to your bag and try checkout without making a payment or creating a real order.",
  ],
];

export default function Home() {
  return (
    <main id="main">
      <ScrollVideoHero />
      <FilmJewelleryEdit />
      <HeroArt />
      <CollectionStage collections={collections} />
      <FeaturedEdit />
      <CampaignStage />
      <ClosingCampaign />
      <Lookbook />
      <section className="care-banner" id="care">
        <Sparkles size={30} strokeWidth={1} />
        <div>
          <p className="eyebrow">Jewellery care</p>
          <h2>Care for your gold vermeil.</h2>
          <p>
            Store each piece in a soft pouch. Avoid water, perfume and lotions.
            Clean gently with a dry, soft cloth and remove before swimming or
            exercising.
          </p>
        </div>
        <Link href="#faq" className="text-link">
          View care FAQs <ArrowRight size={16} />
        </Link>
      </section>
      <section className="faq section-space" id="faq">
        <div>
          <p className="eyebrow">Customer guide</p>
          <h2>Your questions, answered.</h2>
        </div>
        <div className="faq-list">
          {questions.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
