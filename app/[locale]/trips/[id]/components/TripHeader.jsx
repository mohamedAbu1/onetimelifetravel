/* eslint-disable react-hooks/purity */
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { sites } from "@/constants/images";
import reactStringReplace from "react-string-replace";
import { useTranslation } from "react-i18next";

export default function TripHeader({ trip, lang }) {
  const { t: tc } = useTranslation("common");
  const [activeIndex, setActiveIndex] = useState(0);
  const images = trip?.gallery_images?.length ? trip.gallery_images : [{ url: "/default.jpg", name: {} }];
  const title = trip.title?.[lang] || trip.title?.en || tc("egyptJourney");
  const description = trip.description?.[lang] || trip.description?.en || "";
  const searchWords = sites.map((site) => site.name).filter(Boolean);
  const regex = searchWords.length ? new RegExp(`(${searchWords.join("|")})`, "gi") : null;
  const highlightedDescription = regex ? reactStringReplace(description, regex, (match, index) => <strong key={index}>{match}</strong>) : description;

  useEffect(() => {
    if (images.length < 2) return undefined;
    const interval = setInterval(() => setActiveIndex((index) => (index + 1) % images.length), 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <motion.section className="trip-world-hero" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
      <div className="trip-world-hero-copy">
        <div className="trip-world-eyebrow"><span>𓋹</span> One Time Life Travel <span>·</span> {tc("egyptCurated")}</div>
        <h1>{title}</h1>
        <p className="trip-world-description">{highlightedDescription}</p>
        <div className="trip-world-hero-meta"><span><b>𓂀</b> {images.length} {tc("photos")}</span><span><b>𓏏</b> {tc("privateExperience")}</span></div>
      </div>
      <div className="trip-world-gallery">
        <div className="trip-world-main-image">
          <Image src={images[activeIndex].url || "/default.jpg"} alt={images[activeIndex].name?.[lang] || title} fill priority sizes="(max-width: 1024px) 100vw, 62vw" className="object-cover" />
          <div className="trip-world-image-shade" />
          <span className="trip-world-image-label">{images[activeIndex].name?.[lang] || images[activeIndex].name?.en || "The Nile experience"}</span>
          <span className="trip-world-image-count">{String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
        </div>
        {images.length > 1 && <div className="trip-world-thumbs" aria-label="Trip gallery">{images.map((image, index) => <button key={`${image.url}-${index}`} type="button" onClick={() => setActiveIndex(index)} className={`trip-world-thumb ${activeIndex === index ? "is-active" : ""}`} aria-label={`Show photo ${index + 1}`}><Image src={image.url || "/default.jpg"} alt="" fill sizes="90px" className="object-cover" /></button>)}</div>}
      </div>
    </motion.section>
  );
}
