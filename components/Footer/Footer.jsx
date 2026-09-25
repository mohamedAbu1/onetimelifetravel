"use client";
import React from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTripadvisor } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../header/components/Logo";

const Footer = () => {
  const { t } = useTranslation("footer");
  const { t: tc } = useTranslation("common");

  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const internalLinks = [
    ["Home", `/${locale}`],
    ["Tours", `/${locale}/trips`],
    ["LuxorTours", `/${locale}/destinations/luxor`],
    ["AswanTours", `/${locale}/destinations/aswan`],
    ["AboutUs", `/${locale}/about`],
    ["Contact", `/${locale}/contact`],
    ["privacyPolicy", `/${locale}/privacyPolicy`],
  ];
  const socialLinks = [
    [FaFacebookF, "https://www.facebook.com/profile.php?id=61591222981163", "Facebook"],
    [FaInstagram, "https://www.instagram.com/ismailharoun225/", "Instagram"],
    [FaWhatsapp, "https://wa.me/201100507802", "WhatsApp"],
    [MdEmail, "mailto:onetimelifetravel@gmail.com", "Email"],
    [FaTripadvisor, "https://www.tripadvisor.com/", "Tripadvisor"],
  ];

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="footer-journal relative w-full px-6 py-16 lg:px-10"
    >
      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.25fr_0.8fr_0.8fr]">
        <motion.div variants={fadeUp}>
          <div className="inline-flex rounded-2xl border border-[var(--logo-border)]/35 bg-black/10 px-6 py-4 backdrop-blur-sm"><Logo compact /></div>
          <h2 className="mt-7 max-w-md font-[Cinzel] text-2xl font-semibold leading-tight text-[var(--text)]">{t("heroTitle")}</h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--sub-text)]">{t("p")}</p>
          <p className="mt-5 flex items-center gap-2 text-sm text-[var(--sub-text)]"><MdLocationOn className="text-xl text-[var(--logo-border)]" /> {t("location")}</p>
        </motion.div>

        <motion.nav variants={fadeUp} aria-label="Footer navigation">
          <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-[var(--logo-border)]">{t("explore")}</h3>
          <div className="flex flex-col gap-3 text-sm text-[var(--sub-text)]">
            {internalLinks.map(([label, href]) => <Link key={href} href={href} className="transition hover:text-[var(--logo-border)]">{t(label)}</Link>)}
          </div>
        </motion.nav>

        <motion.div variants={fadeUp}>
          <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-[var(--logo-border)]">{t("planJourney")}</h3>
          <p className="text-sm leading-7 text-[var(--sub-text)]">{t("journeyDescription")}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {socialLinks.map(([Icon, href, label]) => <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} whileHover={{ scale: 1.08 }} className="dust-interactive rounded-full border border-[var(--logo-border)]/30 bg-black/10 p-3 text-[var(--logo-border)] transition hover:bg-[var(--logo-border)]/15"><Icon size={17} /></motion.a>)}
          </div>
          <a href="mailto:onetimelifetravel@gmail.com" className="mt-5 flex items-center gap-2 text-sm text-[var(--sub-text)] hover:text-[var(--logo-border)]"><MdEmail className="text-lg text-[var(--logo-border)]" /> onetimelifetravel@gmail.com</a>
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-[var(--logo-border)]/20 pt-5 text-xs text-[var(--sub-text)] sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} One Time Life Travel. {t("rightsReserved")}</span>
        <span>{tc("travelEgypt")}</span>
      </div>
    </motion.footer>
  );
};

export default Footer;


