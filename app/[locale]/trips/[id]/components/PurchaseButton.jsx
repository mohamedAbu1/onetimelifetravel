"use client";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import WhatsAppBookingForm from "@/components/trips/WhatsAppBookingForm";

export default function PurchaseButton({ trip }) {
  const { t } = useTranslation("trips");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 flex-row rounded-[8px] px-6 py-3 bg-transparent backdrop-blur-md 
                   border border-[#C2A878] text-[#C2A878] font-semibold tracking-wide 
                   hover:bg-[#C2A878]/20 hover:text-white transition-all duration-300 
                   shadow-lg cursor-pointer"
      >
        <FaShoppingCart className="w-5 h-5 animate-bounce" />
        {t("btn")}
      </button>
      {isOpen && <WhatsAppBookingForm trip={trip} onClose={() => setIsOpen(false)} />}
    </>
  );
}
