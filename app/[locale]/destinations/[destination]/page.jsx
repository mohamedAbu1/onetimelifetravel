import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import en from "@/locales/en/translation.json";
import es from "@/locales/es/translation.json";
import fr from "@/locales/fr/translation.json";
import de from "@/locales/de/translation.json";
import it from "@/locales/it/translation.json";
import zh from "@/locales/zh/translation.json";

const localizedDestinations = { en: en.destinations, es: es.destinations, fr: fr.destinations, de: de.destinations, it: it.destinations, zh: zh.destinations };
const localizedUi = { en: en.footer, es: es.footer, fr: fr.footer, de: de.footer, it: it.footer, zh: zh.footer };
const destinationMedia = {
  luxor: { image: "/Luxor/Dendera.webp" },
  aswan: { image: "/Aswan/chrysanthe-gomree-_nubht5aO2w-unsplash.webp" },
};

export function generateStaticParams() {
  return ["en", "de", "es", "fr", "it", "zh"].flatMap((locale) => Object.keys(destinationMedia).map((destination) => ({ locale, destination })));
}

export async function generateMetadata({ params }) {
  const { locale, destination: destinationKey } = await params;
  const destination = localizedDestinations[locale]?.[destinationKey] || localizedDestinations.en[destinationKey];
  if (!destination) return { title: "Egypt Tours | One Time Life Travel" };
  return {
    title: `${destination.name} Tours in Egypt | One Time Life Travel`,
    description: destination.description,
    keywords: `${destination.name} tours, Egypt travel, Nile cruise, private Egypt itinerary`,
    alternates: { canonical: `https://onetimelifetravel.com/${locale}/destinations/${destinationKey}` },
  };
}

export default async function DestinationPage({ params }) {
  const { locale: requestedLocale, destination: destinationKey } = await params;
  const locale = localizedDestinations[requestedLocale] ? requestedLocale : "en";
  const destination = localizedDestinations[locale]?.[destinationKey];
  const ui = localizedUi[locale];
  const media = destinationMedia[destinationKey];
  if (!destination || !media) return null;

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
            <Link href={`/${locale}/trips`} className="dust-interactive rounded-full bg-[var(--logo-border)] px-6 py-3 text-sm font-bold text-[#15120e] transition hover:-translate-y-0.5">{ui.browseTours}</Link>
            <Link href={`/${locale}/contact`} className="dust-interactive rounded-full border border-[var(--logo-border)]/50 px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--logo-border)]/10">{ui.planExpert}</Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] border border-[var(--logo-border)]/40 bg-black/30 p-2 shadow-2xl">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] sm:aspect-[5/4]">
            <Image src={media.image} alt={`${destination.name} Egypt tours`} fill priority className="object-cover saturate-[0.85]" sizes="(max-width: 1024px) 100vw, 45vw" />
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



