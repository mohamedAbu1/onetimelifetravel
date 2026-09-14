"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function PrivacyContent() {
  const { t } = useTranslation("privacyPolicy");
  const { t: tc } = useTranslation("common");
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";
  const sections = [
    { title: t("informationCollection"), body: t("informationCollectionText") },
    { title: t("useOfData"), items: ["provideService", "notifyChanges", "interactiveFeatures", "customerCare", "monitorUsage", "preventIssues"] },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="policy-content-modern">
      <div className="policy-document-head"><div><p className="policy-kicker">OneTimeLifeTravel · Privacy</p><h2>{t("title")}</h2></div><span className="policy-status">{tc("updated")}</span></div>
      <p className="policy-effective"><strong>{t("effectiveDate", { defaultValue: "Effective date:" })}</strong> {t("effectiveDate")}</p>
      <p className="policy-lead">{t("intro")}</p>
      <div className="policy-callout">{t("dataUsage")} {t("consent")} <Link href={`/${locale}/cancellationPolicy`}>{tc("cancellationPolicy")}</Link></div>
      <div className="policy-grid">
        {sections.map((section) => (
          <section key={section.title} className="policy-section-card"><h3>{section.title}</h3>{section.body && <p>{section.body}</p>}{section.items && <ul>{section.items.map((item) => <li key={item}>{t(item)}</li>)}</ul>}</section>
        ))}
      </div>
      <section className="policy-section-card"><h3>{t("typesOfData")}</h3><h4>{t("personalData")}</h4><ul><li>{t("emailAddress")}</li><li>{t("fullName")}</li><li>{t("phoneNumber")}</li><li>{t("address")}</li><li>{t("cookiesUsage")}</li></ul><h4>{t("usageData")}</h4><p>{t("usageDataText")}</p><h4>{t("cookiesData")}</h4><p>{t("cookiesDataText")}</p></section>
      <section className="policy-contact-card"><p className="policy-kicker">{tc("needClarification")}</p><h3>{t("contactUs")}</h3><ul><li><strong>{t("ownerLabel")}</strong> {t("owner")}</li><li><strong>{t("emailLabel")}</strong> {t("email")}</li><li><strong>{t("phoneLabel")}</strong> {t("phone")}</li></ul></section>
    </motion.div>
  );
}
