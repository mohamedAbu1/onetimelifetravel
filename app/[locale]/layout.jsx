import { homeMetadata } from "@/lib/metadata/home";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const meta = homeMetadata[locale] || homeMetadata.en;
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: `/${locale}` },
  };
}

export default function LocaleLayout({ children }) {
  return children;
}
