"use client";

import Link from "next/link";
import { FaArrowRight, FaCompass } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useSeasonalEvent } from "./useSeasonalEvent";

export default function SeasonalCampaignCard() {
  const pathname = usePathname();
  const { i18n } = useTranslation();
  const event = useSeasonalEvent();

  if (!event || pathname.includes("/admin")) return null;

  const language = i18n.language?.startsWith("ar") ? "ar" : "en";
  const locale = pathname.split("/")[1] || "en";

  return (
    <article className={`seasonal-campaign-panel seasonal-${event.theme}`} style={{ "--campaign-image": `url(${event.heroImage})` }}>
      <div className="seasonal-campaign-art" aria-hidden="true" />
      <div className="seasonal-campaign-content">
        <span className="seasonal-campaign-overline"><FaCompass /> {event.title[language]}</span>
        <h2>{event.campaign[language]}</h2>
        <p>{event.copy[language]}</p>
        <Link href={`/${locale}/trips`} className="seasonal-campaign-cta">
          {language === "ar" ? "اكتشف الرحلات" : "Explore journeys"} <FaArrowRight />
        </Link>
      </div>
      <div className="seasonal-campaign-offer"><strong>{event.discount}%</strong><span>{language === "ar" ? "خصم موسمي" : "seasonal offer"}</span></div>
    </article>
  );
}
