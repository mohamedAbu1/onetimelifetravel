"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // ✅ استدعاء مكتبة UUID

const TripIDContext = createContext();

const STANDARD_EXCLUSIONS = [
  {
    exclusions_translations: {
      en: "Personal expenses, shopping, and services not listed in the itinerary.",
      es: "Gastos personales, compras y servicios no incluidos en el itinerario.",
      fr: "Dépenses personnelles, achats et services non mentionnés dans l'itinéraire.",
      de: "Persönliche Ausgaben, Einkäufe und nicht im Reiseplan aufgeführte Leistungen.",
      it: "Spese personali, acquisti e servizi non indicati nell'itinerario.",
      zh: "个人开支、购物以及行程中未列出的服务。",
    },
  },
  {
    exclusions_translations: {
      en: "Tips and gratuities for guides and drivers.",
      es: "Propinas para guías y conductores.",
      fr: "Pourboires et gratifications pour les guides et les chauffeurs.",
      de: "Trinkgelder für Reiseleiter und Fahrer.",
      it: "Mance e gratifiche per guide e autisti.",
      zh: "导游和司机的小费。",
    },
  },
  {
    exclusions_translations: {
      en: "Optional tours and activities not listed in the itinerary.",
      es: "Excursiones y actividades opcionales no incluidas en el itinerario.",
      fr: "Excursions et activités facultatives non mentionnées dans l'itinéraire.",
      de: "Optionale Ausflüge und Aktivitäten, die nicht im Reiseplan aufgeführt sind.",
      it: "Escursioni e attività opzionali non indicate nell'itinerario.",
      zh: "行程中未列出的可选游览和活动。",
    },
  },
];

export function TripIDProvider({ children }) {
  const [tripData, setTripData] = useState(null);
  const [tripsList, setTripsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ استدعاء جميع الرحلات مع Cache-Control + تخزين محلي
  const fetchAllTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const cached = localStorage.getItem("tripsList");
      if (cached) {
        setTripsList(JSON.parse(cached));
      }

      const res = await fetch("/api/trips", {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      });

      const data = await res.json();

      if (res.ok) {
        const titles = (data.trips || []).map((trip) => ({
          id: trip.id,
          title:
            typeof trip.title === "object"
              ? trip.title.en || Object.values(trip.title)[0]
              : trip.title || "Untitled",
        }));
        setTripsList(titles);
        localStorage.setItem("tripsList", JSON.stringify(titles));
      } else {
        setError(data.error || "Failed to fetch trips");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ استدعاء رحلة واحدة بالـ ID مع Cache-Control
  const fetchTripById = async (id) => {
    if (!id) {
      setError("No trip ID provided");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/trips/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      });

      const data = await res.json();

      if (res.ok) {
        setTripData({
          ...data.trip,
            discountPercent: data.trip.discount_percent, // ✅ تحويل الاسم
          title:
            typeof data.trip.title === "string"
              ? JSON.parse(data.trip.title)
              : data.trip.title,
          description:
            typeof data.trip.description === "string"
              ? JSON.parse(data.trip.description)
              : data.trip.description,
          gallery_images: Array.isArray(data.trip.gallery_images)
            ? data.trip.gallery_images
            : JSON.parse(data.trip.gallery_images || "[]"),
          includes: Array.isArray(data.trip.includes)
            ? data.trip.includes.map((inc) => ({
                id: inc.id, // ✅ لازم نحافظ على الـ id القادم من الـ backend
                include_translations:
                  typeof inc.include_translations === "string"
                    ? JSON.parse(inc.include_translations)
                    : inc.include_translations,
              }))
            : [],
          exclusions: Array.isArray(data.trip.exclusions)
            ? data.trip.exclusions.map((item) => ({
                id: item.id,
                exclusions_translations:
                  typeof item.exclusions_translations === "string"
                    ? JSON.parse(item.exclusions_translations)
                    : item.exclusions_translations,
              }))
            : [],
        });
      } else {
        setError(data.error || "Failed to fetch trip");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (id) => {
    try {
      const res = await fetch(`/api/trips/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setTripsList((prev) => prev.filter((trip) => trip.id !== id));
        localStorage.setItem(
          "tripsList",
          JSON.stringify(tripsList.filter((trip) => trip.id !== id)),
        );
      }

      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateTripField = (field, value) => {
    setTripData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ إضافة include جديد مع UUID
  const addInclude = (translationObj) => {
    setTripData((prev) => ({
      ...prev,
      includes: [
        ...(prev.includes || []),
        {
          id: uuidv4(), // توليد UUID صالح
          include_translations: translationObj,
        },
      ],
    }));
  };

  const saveTrip = async () => {
    if (!tripData?.id) return { success: false, error: "No trip ID" };

    const tripPayload = {
      title: tripData.title,
      description: tripData.description,
      duration: tripData.duration,
      priceLevel: tripData.priceLevel,
      cover_image: tripData.cover_image,
      gallery_images: tripData.gallery_images,
      solo_price: tripData.solo_price,
      group_price: tripData.group_price,
      discountPercent: tripData.discountPercent,

      categories: (tripData.categories || [])
        .map((c) => (typeof c === "string" ? c : c?.category_id || c?.id))
        .filter(Boolean),

      cities: (tripData.cities || [])
        .map((c) => (typeof c === "string" ? c : c?.city_id || c?.id))
        .filter(Boolean),

      // ✅ إرسال includes مع UUID
      includes: (tripData.includes || []).map((inc) => ({
        id: inc.id,
        include_translations: inc.include_translations,
      })),

      exclusions: (tripData.exclusions?.length ? tripData.exclusions : STANDARD_EXCLUSIONS).map((item) => ({
        id: item.id,
        exclusions_translations: item.exclusions_translations,
      })),

      itinerary: tripData.itinerary || [],
    };

    try {
      const res = await fetch(`/api/trips/${tripData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripPayload),
      });
      const data = await res.json();

      if (data.success) {
        setTripData(null);
      }

      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchAllTrips();
  }, []);
console.log("123object123",tripData)
  return (
    <TripIDContext.Provider
      value={{
        tripData,
        tripsList,
        setTripData,
        fetchTripById,
        fetchAllTrips,
        updateTripField,
        addInclude, // ✅ متاح للاستخدام في أي كومبوننت
        saveTrip,
        deleteTrip,
        loading,
        error,
      }}
    >
      {children}
    </TripIDContext.Provider>
  );
}

export const useTripID = () => useContext(TripIDContext);
