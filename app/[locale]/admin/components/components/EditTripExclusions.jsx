"use client";

import React from "react";
import { FaTimesCircle } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { useTripID } from "../../context/TripIDContext";
import { v4 as uuidv4 } from "uuid";

const languages = ["en", "es", "fr", "de", "it", "zh"];

export default function EditTripExclusions() {
  const { themeName } = useTheme();
  const { tripData, updateTripField } = useTripID();
  const exclusions = tripData?.exclusions || [];

  const updateExclusion = (index, lang, value) => {
    const updated = [...exclusions];
    updated[index] = {
      ...updated[index],
      exclusions_translations: {
        ...updated[index].exclusions_translations,
        [lang]: value,
      },
    };
    updateTripField("exclusions", updated);
  };

  const addExclusion = () => {
    updateTripField("exclusions", [
      ...exclusions,
      {
        id: uuidv4(),
        exclusions_translations: { en: "", es: "", fr: "", de: "", it: "", zh: "" },
      },
    ]);
  };

  return (
    <section>
      <h3 className={`mb-3 text-xl font-bold ${themeName === "dark" ? "text-gold" : "text-[#3a2c0a]"}`}>
        Trip Exclusions / Not Included
      </h3>
      {exclusions.map((item, index) => (
        <div key={item.id ?? index} className={`mb-4 rounded-lg border p-3 ${themeName === "dark" ? "border-red-300/30 bg-[#0f0f0f] text-white" : "border-red-700/30 bg-[#fff8f5] text-[#3a2c0a]"}`}>
          <div className="mb-2 flex items-center gap-2">
            <FaTimesCircle className="text-xl text-[#c97567]" />
            <span className="font-semibold">Exclusion {index + 1}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {languages.map((lang) => (
              <input key={lang} type="text" value={item.exclusions_translations?.[lang] ?? ""} onChange={(event) => updateExclusion(index, lang, event.target.value)} placeholder={`Not included (${lang.toUpperCase()})`} className={`rounded-lg border p-2 outline-none ${themeName === "dark" ? "border-red-300/30 bg-[#1a1a1a] text-white" : "border-red-700/30 bg-white text-[#3a2c0a]"}`} />
            ))}
          </div>
        </div>
      ))}
      <button type="button" onClick={addExclusion} className={`rounded-lg px-4 py-2 font-bold ${themeName === "dark" ? "bg-[#c97567] text-black" : "bg-[#c97567] text-white"}`}>
        + Add Exclusion
      </button>
    </section>
  );
}
