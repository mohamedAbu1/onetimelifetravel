import { aboutMetadata } from "@/lib/metadata/about";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const meta = aboutMetadata[locale] || aboutMetadata.en;
  return { title: meta.title, description: meta.description, keywords: meta.keywords, alternates: { canonical: `/${locale}/about` } };
}

export default function AboutLayout({ children }) { return children; }
