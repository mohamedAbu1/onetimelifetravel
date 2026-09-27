import { tailorYourTripMetadata } from "@/lib/metadata/tailorYourTrip";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const meta = tailorYourTripMetadata[locale] || tailorYourTripMetadata.en;
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: `/${locale}/tailor-your-trip` },
  };
}

export default function TailorYourTripLayout({ children }) {
  return children;
}
