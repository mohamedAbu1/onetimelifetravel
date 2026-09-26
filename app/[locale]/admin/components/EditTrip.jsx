"use client";
import React from "react";
import EditTripBasicInfo from "./components/EditTripBasicInfo";
import EditTripCoverImageUpload from "./components/EditTripCoverImageUpload";
import EditTripGalleryUpload from "./components/EditTripGalleryUpload";
import EditTripClassification from "./components/EditTripClassification";
import EditTripIncludes from "./components/EditTripIncludes";
import EditTripExclusions from "./components/EditTripExclusions";
import EditTripDailyItinerary from "./components/EditTripDailyItinerary";
import EditTripSaveButton from "./components/EditTripSaveButton";
import TripSelector from "./components/TripSelector";
import AdminModuleHeader from "./AdminModuleHeader";
import { FaEdit } from "react-icons/fa";

export default function EditTripFull({ themeName }) {
  return (
    <div
      className={`admin-module admin-module-form p-6 ${
        themeName === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      } rounded-lg`}
    >
      <AdminModuleHeader icon={FaEdit} eyebrow="Catalogue / maintenance" title="Edit trip" description="Select a journey, update its content and publish the changes safely." />
      <TripSelector />
      {/* المعلومات الأساسية */}
      <EditTripBasicInfo />

      {/* صورة الغلاف */}
      <EditTripCoverImageUpload />

      {/* معرض الصور */}
      <EditTripGalleryUpload />

      {/* التصنيفات والمدن */}
      <EditTripClassification />

      {/* المتضمنات */}
      <EditTripIncludes />

      <EditTripExclusions />

      {/* الجدول اليومي */}
      <EditTripDailyItinerary />

      {/* زر الحفظ */}
      <EditTripSaveButton />
    </div>
  );
}
