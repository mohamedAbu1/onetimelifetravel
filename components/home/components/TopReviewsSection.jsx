"use client";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaHeart, FaQuoteLeft, FaStar, FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { format } from "date-fns";
import { useReviews } from "@/context/ReviewsContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import Decor from "@/components/layout/Decor";

export default function TopReviewsSection() {
  const { allReviews, likes } = useReviews();
  const { theme } = useTheme();
  const { t } = useTranslation("home");
  const { t: tc } = useTranslation("common");
  const [expanded, setExpanded] = useState([]);
  const reviews = (Array.isArray(allReviews) ? allReviews : []).map((review) => ({ ...review, likesCount: likes[review.id]?.count || 0 })).sort((a, b) => b.likesCount - a.likesCount || (b.rating || 0) - (a.rating || 0)).slice(0, 6);
  const settings = { dots: true, arrows: true, infinite: reviews.length > 3, speed: 600, slidesToShow: 3, slidesToScroll: 1, autoplay: true, autoplaySpeed: 5500, pauseOnHover: true, prevArrow: <button type="button" aria-label={tc("previousReview")} className="review-arrow"><FaArrowLeft /></button>, nextArrow: <button type="button" aria-label={tc("nextReview")} className="review-arrow"><FaArrowRight /></button>, responsive: [{ breakpoint: 1024, settings: { slidesToShow: 2 } }, { breakpoint: 640, settings: { slidesToShow: 1, arrows: false } }] };
  const toggle = (id) => setExpanded((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  return <section className={`reviews-journal site-section relative w-full self-stretch overflow-hidden ${theme.text}`}><EgyptianBackground /><div className="relative container z-10 mx-auto w-full max-w-[82rem] px-4 sm:px-6 lg:px-8"><div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><span className="booking-kicker">𓅓 {tc("voices")}</span><h2 className="mt-3 max-w-2xl font-[Cinzel] text-4xl font-semibold leading-tight text-[var(--heading)] sm:text-5xl">{tc("reviewsTitle")}</h2><p className="mt-3 max-w-xl text-sm leading-7 text-[var(--sub-text)]">{tc("reviewsCopy")}</p></div><div className="review-trust"><span className="flex items-center gap-1 text-[var(--primary-color)]"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></span><strong>{reviews.length ? tc("lovedByTravellers") : tc("yourStoryMatters")}</strong></div></div>{reviews.length ? <div className="reviews-slider"><Slider {...settings}>{reviews.map((review, index) => { const isExpanded = expanded.includes(review.id); const text = review.comment || tc("reviewFallback"); return <motion.article key={review.id || index} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="review-card"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3">{review.avatar_url ? <img src={review.avatar_url} alt={review.name || tc("anonymousTraveller")} className="h-12 w-12 rounded-full border-2 object-cover" style={{ borderColor: theme.logoBorder }} /> : <FaUserCircle className="text-5xl text-[var(--primary-color)]" />}<div><h3 className="font-[Cinzel] text-base font-semibold text-[var(--heading)]">{review.name || tc("anonymousTraveller")}</h3><div className="mt-1 flex gap-0.5 text-xs text-[var(--primary-color)]">{Array.from({ length: Math.max(0, review.rating || 0) }, (_, i) => <FaStar key={i} />)}</div></div></div><FaQuoteLeft className="text-2xl text-[var(--primary-color)]/35" /></div><p className="review-copy">{isExpanded || text.length <= 150 ? text : `${text.slice(0, 150)}…`}</p>{text.length > 150 && <button type="button" onClick={() => toggle(review.id)} className="review-more">{isExpanded ? tc("showLess") : tc("readMore")}</button>}<div className="mt-auto flex items-center justify-between border-t border-[var(--card-border)]/50 pt-4 text-xs text-[var(--sub-text)]"><span>{review.created_at ? format(new Date(review.created_at), "dd MMM yyyy") : tc("verifiedJourney")}</span><span className="flex items-center gap-1.5 rounded-full bg-[var(--logo-border)]/10 px-2.5 py-1 font-bold text-[var(--primary-color)]"><FaHeart /> {review.likesCount}</span></div></motion.article>})}</Slider></div> : <div className="review-empty"><FaQuoteLeft className="text-3xl text-[var(--primary-color)]/50" /><h3>{t("h6")}</h3><p>{t("p6")}</p></div>}</div><Decor pos="bottom" /></section>;
}
