import { contactMetadata } from "@/lib/metadata/contact";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const meta = contactMetadata[locale] || contactMetadata.en;
  return { title: meta.title, description: meta.description, keywords: meta.keywords, alternates: { canonical: `/${locale}/contact` } };
}

export default function ContactLayout({ children }) { return children; }
