"use client";
import { useReviews } from "@/context/ReviewsContext";
import { useTheme } from "@/context/ThemeContext";
import { FaStar, FaUserCircle, FaQuoteLeft, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { useState } from "react";
import DividerWithIcon from "@/components/layout/DividerWithIcon";
import Decor from "@/components/layout/Decor";

export default function TopReviewsSection() {
  const { allReviews, likes } = useReviews();
  const { theme } = useTheme();
  const { t } = useTranslation("home");

  const safeReviews = Array.isArray(allReviews) ? allReviews : [];

  const topLikedReviews = safeReviews
    .map((rev) => ({
      ...rev,
      likesCount: likes[rev.id]?.count || 0,
    }))
    .filter((rev) => rev.likesCount > 0)
    .sort((a, b) => b.likesCount - a.likesCount)
    .slice(0, 5);

  const [expandedIds, setExpandedIds] = useState([]);
  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 3, // ✅ الكمبيوتر: 3 كروت
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024, // أقل من 1024px (تابلت)
        settings: {
          slidesToShow: 2, // ✅ يعرض 2 كروت
        },
      },
      {
        breakpoint: 640, // أقل من 640px (موبايل)
        settings: {
          slidesToShow: 1, // ✅ يعرض كارت واحد
        },
      },
    ],
  };

  return (
    <section
      className={`reviews-journal site-section ${theme.text} flex w-screen max-w-full flex-col items-center justify-center overflow-hidden bg-cover bg-center`}
      //  style={{
      //   backgroundImage:
      //     "url('/HomePageImage/421009550_cc929d60-b9e0-426e-84d8-74d70ab10d55.svg')",
      // }}
    >
      <EgyptianBackground />
      <h2
        className="sc-title-first text-5xl font-extrabold tracking-wide drop-shadow-md text-left text-gradient"
        style={{ textAlign: "center" }}
      >
        <span className="inline-block transform scale-x-[-1] mr-4">𓅓</span>
        {t("h6")}
        <span className="inline-block ml-4">𓅓</span>
      </h2>

      <DividerWithIcon />

      {topLikedReviews.length > 0 ? (
        <Slider {...settings}>
          {topLikedReviews.map((rev, idx) => {
            const expanded = expandedIds.includes(rev.id);
            const comment =
              rev.comment?.length > 150 && !expanded
                ? rev.comment.slice(0, 150) + "..."
                : rev.comment;

            return (
              <motion.div
                key={rev.id || idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="editorial-card dust-interactive mx-3 my-4 flex min-h-[280px] flex-col gap-6 rounded-2xl border p-7"
                style={{
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: `1px solid ${theme.logoBorder}`,
                  boxShadow: theme.shadow,
                }}
              >
                {/* Header */}
                <div className="flex items-center gap-4 border-b pb-3">
                  {rev.avatar_url ? (
                    <img
                      src={rev.avatar_url}
                      alt={rev.name}
                      className="w-16 h-16 rounded-full border-2 object-cover"
                      style={{ borderColor: theme.logoBorder }}
                    />
                  ) : (
                    <FaUserCircle size={64} className={theme.icon} />
                  )}
                  <div>
                    <h3
                      className="font-[Cinzel] text-lg font-semibold capitalize text-[var(--heading)]"
                    >
                      {rev.name || "Anonymous"}
                    </h3>
                    <div className="flex gap-1">
                      {[...Array(rev.rating || 0)].map((_, i) => (
                        <FaStar key={i} className={theme.icon} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="relative flex-1 mt-6">
                  <FaQuoteLeft
                    className={`absolute top-0 left-0 text-3xl opacity-20 ${theme.icon}`}
                  />
                  <p
                    className="pl-10 text-base italic leading-relaxed text-[var(--sub-text)]"
                    style={{ textAlign: "justify" }}
                  >
                    {comment}
                  </p>
                  {rev.comment?.length > 150 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleExpand(rev.id)}
                      className={`text-sm mt-2 font-semibold tracking-wide cursor-pointer transition-all duration-300 ${theme.buttonPrimary}`}
                      style={{ border: `1px solid ${theme.logoBorder}` }}
                    >
                      {expanded ? "إخفاء" : "اقرأ المزيد"}
                    </motion.button>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-6 border-t pt-4">
                  <div
                    className={`flex items-center gap-2 text-sm ${theme.subText}`}
                  >
                    <span>
                      {rev.created_at
                        ? format(new Date(rev.created_at), "dd MMM yyyy")
                        : "Unknown date"}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-2 font-semibold text-sm px-3 py-1 rounded-full shadow-sm ${theme.buttonPrimary}`}
                  >
                    <FaHeart />
                    <span>{rev.likesCount}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </Slider>
      ) : (
        <div className="editorial-card reviews-empty mx-6 mt-8 flex w-full max-w-2xl flex-col items-center rounded-2xl border px-8 py-10 text-center">
          <FaQuoteLeft className="mb-5 text-3xl text-[var(--logo-border)]/70" />
          <p className="font-[Cinzel] text-2xl font-semibold text-[var(--heading)]">Your story belongs here</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-[var(--sub-text)]">{t("p6")}</p>
          <span className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-[var(--logo-border)]">Travel. Remember. Share.</span>
        </div>
      )}
      <Decor pos={"bottom"} />
    </section>
  );
}
