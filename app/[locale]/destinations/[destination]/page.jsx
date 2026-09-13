import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import EgyptianBackground from "@/components/layout/EgyptianBackground";

const destinations = {
  luxor: {
    name: "Luxor",
    eyebrow: "The world's greatest open-air museum",
    title: "Luxor tours shaped around ancient wonder",
    description: "Explore Luxor temples, royal tombs and Nile-side stories with a private Egypt travel experience designed around your pace.",
    image: "/Luxor/Dendera.webp",
    highlights: ["Karnak and Luxor Temples", "Valley of the Kings", "Private Nile-side experiences"],
  },
  aswan: {
    name: "Aswan",
    eyebrow: "A slower, sunnier side of the Nile",
    title: "Aswan tours for unhurried Nile days",
    description: "Discover Nubian culture, island sunsets and the quiet beauty of southern Egypt with a curated Aswan itinerary.",
    image: "/Aswan/chrysanthe-gomree-_nubht5aO2w-unsplash.webp",
    highlights: ["Philae Temple and the islands", "Nubian village encounters", "Nile cruises from Aswan"],
  },
};

export function generateStaticParams() {
  return ["en", "de", "es", "fr", "it", "zh"].flatMap((locale) =>
    Object.keys(destinations).map((destination) => ({ locale, destination }))
  );
}

export async function generateMetadata({ params }) {
  const destination = destinations[params.destination];
  if (!destination) return { title: "Egypt Tours | One Time Life Travel" };
  return {
    title: `${destination.name} Tours in Egypt | One Time Life Travel`,
    description: destination.description,
    keywords: `${destination.name} tours, ${destination.name} Egypt travel, Egypt tours, Nile cruise, private Egypt itinerary`,
    alternates: { canonical: `https://onetimelifetravel.com/${params.locale}/destinations/${params.destination}` },
  };
}

export default function DestinationPage({ params }) {
  const destination = destinations[params.destination];
  if (!destination) return null;

  return (
    <main className="site-page relative min-h-screen overflow-hidden pt-28">
      <EgyptianBackground />
      <Header />
      <section className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-12 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-10 lg:pt-20">
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-[var(--logo-border)]">{destination.eyebrow}</p>
          <h1 className="max-w-3xl font-[Cinzel] text-4xl font-semibold leading-[1.08] text-[var(--heading)] sm:text-6xl">{destination.title}</h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-[var(--sub-text)]">{destination.description}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={`/${params.locale}/trips`} className="dust-interactive rounded-full bg-[var(--logo-border)] px-6 py-3 text-sm font-bold text-[#15120e] transition hover:-translate-y-0.5">Browse Egypt tours</Link>
            <Link href={`/${params.locale}/contact`} className="dust-interactive rounded-full border border-[var(--logo-border)]/50 px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--logo-border)]/10">Plan with an expert</Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] border border-[var(--logo-border)]/40 bg-black/30 p-2 shadow-2xl">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] sm:aspect-[5/4]">
            <Image src={destination.image} alt={`${destination.name} Egypt tours`} fill priority className="object-cover saturate-[0.85]" sizes="(max-width: 1024px) 100vw, 45vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <span className="absolute bottom-6 left-6 font-[Cinzel] text-3xl text-[#f2d083]">{destination.name}</span>
          </div>
        </div>
      </section>
      <section className="relative z-10 mx-auto grid max-w-7xl gap-4 px-6 pb-24 sm:grid-cols-3 lg:px-10" aria-label={`${destination.name} tour highlights`}>
        {destination.highlights.map((highlight, index) => (
          <article key={highlight} className="card-theme rounded-2xl border p-6">
            <span className="text-xs font-bold tracking-[0.2em] text-[var(--logo-border)]">0{index + 1}</span>
            <h2 className="mt-5 font-[Cinzel] text-xl text-[var(--heading)]">{highlight}</h2>
          </article>
        ))}
      </section>
      <Footer />
    </main>
  );
}
