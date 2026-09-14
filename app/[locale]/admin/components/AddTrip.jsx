"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useTrip } from "../context/TripContext";

// استدعاء الكومبوننتات
import BasicInfo from "./components/BasicInfo";
import CoverImageUpload from "./components/CoverImageUpload";
import GalleryUpload from "./components/GalleryUpload";
import TripIncludes from "./components/TripIncludes";
import DailyItinerary from "./components/DailyItinerary";
import SaveButton from "./components/SaveButton";
import TripClassification from "./components/TripClassification";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import AdminModuleHeader from "./AdminModuleHeader";
import { FaPlus } from "react-icons/fa";

export default function AddTrip() {
  const { themeName } = useTheme();
  const { tripData, updateTripField, saveTrip } = useTrip();

  return (
    <motion.form
      onSubmit={async (e) => {
        e.preventDefault();
        console.log("➡️ Saving tripData:", tripData);
        const result = await saveTrip();
        console.log("✅ Save result:", result);
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`admin-module admin-module-form space-y-8 mx-auto p-8 rounded-2xl shadow-2xl ${
        themeName === "dark"
          ? "bg-black/40 border border-gold/30"
          : "bg-white/70 border border-[#c9a34a]/30 backdrop-blur-sm"
      }`}
    >
      <EgyptianBackground />

      <AdminModuleHeader icon={FaPlus} eyebrow="Catalogue / creation" title="Add new trip" description="Create a complete journey with pricing, media, inclusions and itinerary details." />

      {/* معلومات أساسية */}
      <BasicInfo />

      {/* التصنيف (مدن + فئات + مستوى السعر) */}
      <TripClassification
        category={tripData.categories}
        setCategory={(val) => updateTripField("categories", val)}
        city={tripData.cities}
        setCity={(val) => updateTripField("cities", val)}
        priceLevel={tripData.priceLevel}
        setPriceLevel={(val) => updateTripField("priceLevel", val)}
      />

      {/* صورة الغلاف */}
      <CoverImageUpload
        coverImage={tripData.cover_file}
        setCoverImage={(file) => updateTripField("cover_file", file)}
        coverName={tripData.cover_name}
        setCoverName={(name) => updateTripField("cover_name", name)}
      />

      {/* صور المعرض */}
      <GalleryUpload
        galleryImages={tripData.gallery_files}
        setGalleryImages={(files) => updateTripField("gallery_files", files)}
      />

      {/* ما تحتوي عليه الرحلة */}
      <TripIncludes />

      {/* البرنامج اليومي */}
      <DailyItinerary />

      {/* زر الحفظ */}
      <SaveButton />
    </motion.form>
  );
}
