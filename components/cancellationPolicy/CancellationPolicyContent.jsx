"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function CancellationPolicyContent() {
  const { t } = useTranslation("cancellationPolicy");
  const { t: tc } = useTranslation("common");
  const list = (key) => { const value = t(key, { returnObjects: true }); return Array.isArray(value) ? value : []; };
  const sections = [
    { title: t("cancellationPolicy"), body: t("cancellationText"), items: list("cancellationRules") },
    { title: t("refunds"), body: t("refundsText") },
    { title: t("accommodation"), body: t("accommodationText") },
    { title: t("responsibility"), body: t("responsibilityText"), items: list("responsibilityList") },
    { title: t("specialRequests"), body: t("specialRequestsText") },
    { title: t("childrenPolicy"), items: [...list("packagesList"), ...list("toursList")] },
    { title: t("tipping"), body: t("tippingText") },
    { title: t("complaints"), body: t("complaintsText") },
    { title: t("acceptance"), body: t("acceptanceText") },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="policy-content-modern">
      <div className="policy-document-head"><div><p className="policy-kicker">{tc("guestCare")}</p><h2>{t("title")}</h2></div><span className="policy-status">{tc("important")}</span></div>
      <p className="policy-effective"><strong>{t("effectiveDateLabel", { defaultValue: "Effective date:" })}</strong> {t("effectiveDate")}</p>
      <div className="policy-callout">{tc("beforeConfirm")}</div>
      <div className="policy-section-list">
        {sections.map((section) => (
          <section key={section.title} className="policy-section-card"><h3>{section.title}</h3>{section.body && <p>{section.body}</p>}{section.items?.length > 0 && <ul>{section.items.map((item, index) => <li key={`${section.title}-${index}`}>{item}</li>)}</ul>}{section.title === t("cancellationPolicy") && <p className="policy-note"><strong>{t("noteLabel", { defaultValue: "Note:" })}</strong> {t("note")}</p>}</section>
        ))}
      </div>
      <section className="policy-contact-card"><p className="policy-kicker">{tc("questionsBooking")}</p><h3>{t("contact")}</h3><ul><li><strong>{t("ownerLabel")}</strong> {t("owner")}</li><li><strong>{t("emailLabel")}</strong> {t("email")}</li><li><strong>{t("phoneLabel")}</strong> {t("phone")}</li></ul></section>
    </motion.div>
  );
}
