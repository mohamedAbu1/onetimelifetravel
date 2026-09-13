// app/layout.tsx
import "./style/globals.css";

import Providers from "./providers";

export const metadata = {
  metadataBase: new URL("https://onetimelifetravel.com"),
  title: { default: "One Time Life Travel | Explore Egypt", template: "%s | One Time Life Travel" },
  description: "Discover unforgettable Egypt tours, Nile cruises, desert safaris, Red Sea escapes, and tailor-made travel experiences.",
  applicationName: "One Time Life Travel",
  keywords: ["Egypt tours", "Nile cruise", "Egypt travel", "desert safari"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "One Time Life Travel", url: "/" },
  robots: { index: true, follow: true },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TravelAgency",
      "@id": "https://onetimelifetravel.com/#organization",
      name: "One Time Life Travel",
      url: "https://onetimelifetravel.com",
      description: "Private Egypt tours, Luxor and Aswan tours, Nile cruises and curated travel experiences.",
      areaServed: [
        { "@type": "City", name: "Luxor" },
        { "@type": "City", name: "Aswan" },
        { "@type": "Country", name: "Egypt" },
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://onetimelifetravel.com/#website",
      url: "https://onetimelifetravel.com",
      name: "One Time Life Travel",
      publisher: { "@id": "https://onetimelifetravel.com/#organization" },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
