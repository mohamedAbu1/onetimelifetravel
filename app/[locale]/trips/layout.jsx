import { tripsMetadata } from "@/lib/metadata/trips";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const meta = tripsMetadata[locale] || tripsMetadata.en;
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: `/${locale}/trips` },
  };
}

export default function TripsLayout({ children }) {
  return children;
}
