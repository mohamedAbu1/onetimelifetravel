// file: context/CitiesCategoriesContext.js
"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { normalizeImageUrl } from "@/lib/imageUrl";

const CitiesCategoriesContext = createContext();

export function CitiesCategoriesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestVersion, setRequestVersion] = useState(0);

  const { i18n } = useTranslation(); // اللغة الحالية للموقع
  const getLangKey = (lang) => lang.split("-")[0];
  const normalizedLang = getLangKey(i18n.language);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [citiesRes, categoriesRes] = await Promise.all([
          fetch("/api/cities"),
          fetch("/api/categories"),
        ]);

        const citiesData = await citiesRes.json();
        const categoriesData = await categoriesRes.json();

        if (!citiesRes.ok || !categoriesRes.ok || !citiesData.success || !categoriesData.success) {
          throw new Error("Unable to load travel data");
        }

        if (citiesData.success) setCities(citiesData.cities);
        if (categoriesData.success) setCategories(categoriesData.categories);
      } catch (err) {
        console.error("Error fetching cities/categories:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [requestVersion]);

  // ✅ فلترة المدن وتحويل الحقول من JSON string إلى كائن/مصفوفة
 // ✅ فلترة المدن وتحويل الحقول من JSON string إلى كائن/مصفوفة
const localizedCities = cities.map((city) => {
  let parsedName = {};
  let parsedImages = [];

  try {
    parsedName = JSON.parse(city.name); // ← استخدم name بدل translations
  } catch {
    parsedName = { en: city.name };
  }

  try {
    parsedImages = JSON.parse(city.images);
  } catch {
    parsedImages = ["/fallback.jpg"];
  }

  return {
    ...city,
    name:
      parsedName?.[normalizedLang] ||
      parsedName?.["en"] ||
      Object.values(parsedName)[0] ||
      city.name,
    images: (Array.isArray(parsedImages) ? parsedImages : ["/fallback.jpg"]).map((image) => normalizeImageUrl(image)),
  };
});


  // ✅ فلترة الكاتجري بنفس الأسلوب
  const localizedCategories = categories.map((cat) => {
    let parsedName = {};
    let parsedImages = [];

    try {
      parsedName = JSON.parse(cat.name);
    } catch {
      parsedName = { en: cat.name };
    }

    try {
      parsedImages = JSON.parse(cat.images);
    } catch {
      parsedImages = ["/fallback.jpg"];
    }

    return {
      ...cat,
      name:
        parsedName?.[normalizedLang] ||
        parsedName?.["en"] ||
        Object.values(parsedName)[0] ||
        cat.name,
    images: (Array.isArray(parsedImages) ? parsedImages : ["/fallback.jpg"]).map((image) => normalizeImageUrl(image)),
    };
  });

  return (
    <CitiesCategoriesContext.Provider
      value={{
        cities: localizedCities,
        categories: localizedCategories,
        loading,
        error,
        reload: () => {
          setLoading(true);
          setRequestVersion((version) => version + 1);
        },
      }}
    >
      {children}
    </CitiesCategoriesContext.Provider>
  );
}

export const useCitiesCategories = () => useContext(CitiesCategoriesContext);
