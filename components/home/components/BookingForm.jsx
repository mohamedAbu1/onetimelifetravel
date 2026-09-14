"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaArrowRight, FaCalendarAlt, FaCompass, FaMapMarkerAlt, FaTags } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";
import { useRouter } from "next/navigation";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import { useQueryFilters } from "@/context/QueryContext";
import CitiesInput from "./components/CitiesInput";
import CategoriesInput from "./components/CategoriesInput";
import { useTranslation } from "react-i18next";

const encodeData = (obj) => btoa(JSON.stringify(obj));

export default function BookingForm({ setShowTrips }) {
  const { cities, categories } = useCitiesCategories();
  const { updateValue } = useQueryFilters();
  const router = useRouter();
  const { t } = useTranslation("common");
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [arrival, setArrival] = useState(null);
  const [departure, setDeparture] = useState(null);
  const toggle = (setItems) => (item) => setItems((current) => current.some((x) => x.id === item.id) ? current.filter((x) => x.id !== item.id) : [...current, item]);
  const handleSearch = () => {
    const query = { city: selectedCities.length ? selectedCities.map((city) => city.name?.en || city.name) : ["all"], category: selectedCategories.length ? selectedCategories.map((category) => category.name?.en || category.name) : ["all"], price: "All", popular: false };
    Object.entries(query).forEach(([key, value]) => updateValue(key, value));
    router.push(`/trips?data=${encodeData(query)}`);
  };
  const DateField = ({ selected, onChange, minDate, label }) => (
    <DatePicker selected={selected} onChange={onChange} onCalendarOpen={() => setShowTrips?.(true)} onCalendarClose={() => setShowTrips?.(false)} minDate={minDate} dateFormat="dd MMM yyyy" placeholderText={label} calendarClassName="booking-calendar" popperClassName="booking-calendar-popper" popperPlacement="bottom-start" showPopperArrow={false} portalId="booking-calendar-portal" customInput={<button type="button" aria-label={`${t("chooseDate")} ${label.toLowerCase()}`} className="booking-date-control group"><span className="booking-icon"><FaCalendarAlt /></span><span className="min-w-0 text-left"><small>{label}</small><strong>{selected ? selected.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }) : t("chooseDate")}</strong></span><span className="booking-chevron">⌄</span></button>} />
  );
  return (
    <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }} className="booking-panel w-full max-w-[660px]">
      <div className="mb-6 flex items-start justify-between gap-4"><div><span className="booking-kicker"><FaCompass /> {t("curateEscape")}</span><h2 className="booking-title">{t("bookingTitle")}</h2><p className="mt-2 max-w-md text-sm leading-6 text-[var(--sub-text)]">{t("bookingCopy")}</p></div><span className="booking-mark" aria-hidden="true">𓂀</span></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="booking-control"><span className="booking-icon"><FaMapMarkerAlt /></span><CitiesInput selectedCities={selectedCities} toggleCity={toggle(setSelectedCities)} cities={cities} /></div>
        <div className="booking-control"><span className="booking-icon"><FaTags /></span><CategoriesInput selectedCategories={selectedCategories} toggleCategory={toggle(setSelectedCategories)} categories={categories} /></div>
        <DateField selected={arrival} onChange={setArrival} minDate={addDays(new Date(), 2)} label={t("arrival")} />
        <DateField selected={departure} onChange={setDeparture} minDate={arrival ? addDays(arrival, 1) : addDays(new Date(), 3)} label={t("departure")} />
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-[var(--sub-text)]"><span className="mr-1 inline-block h-2 w-2 rounded-full bg-[var(--primary-color)]" />{t("flexiblePlanning")}</p><motion.button whileHover={{ y: -2 }} whileTap={{ scale: .98 }} type="button" onClick={handleSearch} className="booking-submit">{t("exploreTrips")} <FaArrowRight /></motion.button></div>
    </motion.section>
  );
}
