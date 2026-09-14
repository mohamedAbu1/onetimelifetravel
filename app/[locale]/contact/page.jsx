/* eslint-disable react-hooks/purity */
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import { useTranslation } from "react-i18next";
import LoginModal from "@/components/home/components/LoginModal";
import SignUpButton from "@/components/home/components/SignUpButton";
import ChatWidget from "@/components/layout/ChatWidget";
import { useAuth } from "@/context/AuthContext";
import DividerWithIcon from "@/components/layout/DividerWithIcon";
import Image from "next/image";

const symbols = [
  "𓂀",
  "𓋹",
  "𓆣",
  "𓇼",
  "𓇯",
  "𓏏",
  "𓎛",
  "𓊽",
  "𓃾",
  "𓅓",
  "𓈇",
  "𓉐",
  "𓊹",
  "𓌙",
  "𓍿",
  "𓎟",
];

export default function ContactPage() {
  const { theme, themeName } = useTheme();
  const { user } = useAuth(); // ✅ جلب المستخدم الحالي
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const { t } = useTranslation("contact");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("➡️ Submitting contact form:", formData);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          // لو فيه بيانات من المستخدم، نرسلها بدل القيم المدخلة
          name: user?.name || formData.name,
          email: user?.email || formData.email,
        }),
      });

      const data = await res.json();
      console.log("📥 Response from API:", data);

      if (data.success) {
        alert("✅ تم إرسال الرسالة بنجاح!");
      } else {
        alert("❌ حدث خطأ أثناء الإرسال: " + data.error);
      }
    } catch (err) {
      console.error("❌ Error submitting form:", err);
    }
  };

  return (
    <>
      <main className="site-page pharaonic-page relative flex flex-col min-h-screen justify-center items-center pt-24">
        <Header />
        {/* خلفية الرموز الفرعونية */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 25 }).map((_, i) => (
            <span
              key={i}
              className={`absolute ${
                themeName === "dark" ? "text-gray-700" : "text-[#4F6D7A]"
              } opacity-20 text-7xl animate-pulse`}
              style={{
                    top: `${8 + ((i * 23) % 86)}%`,
                    left: `${4 + ((i * 31) % 92)}%`,
                    transform: `rotate(${(i * 29) % 360}deg)`,
              }}
            >
                  {symbols[i % symbols.length]}
            </span>
          ))}
        </div>

        {/* المحتوى */}
        <section className="pharaonic-section relative z-10 w-full">
          <div className="contact-grid grid grid-cols-1 lg:grid-cols-[.85fr_1.15fr] gap-8 items-start">
            {/* معلومات التواصل */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`pharaonic-card contact-panel relative ${
                themeName === "dark" ? "card-dark" : "card-light"
              }`}
            >
              {/* ✅ صورة SVG خلفية */}
              <div className="absolute top-80 left-0 w-full h-[450px] opacity-50 pointer-events-none">
                <Image
                  src="/HomePageImage/png-egypt-sculpture-statue-art.png" // ضع ملف SVG هنا
                  alt="Decorative Background"
                  fill
                  className="object-contain"
                />
              </div>
              <h2
                className={`contact-p text-3xl font-bold mb-6 text-gradient ${
                  themeName === "dark"
                    ? "text-stroke-dark"
                    : "text-stroke-light"
                }`}
              >
                {t("h1")}
              </h2>

              <DividerWithIcon />

              <p className="mb-6 opacity-80">{t("p1")}</p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaPhoneAlt className="icon-theme" />
                  <span>+20 1009011178</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="icon-theme" />
                  <span>ontetimelifetravel@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="icon-theme" />
                  <span>{t("sp")}</span>
                </div>
              </div>
            </motion.div>

            {/* فورم التواصل */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`pharaonic-card contact-panel space-y-6 ${
                themeName === "dark" ? "card-dark" : "card-light"
              }`}
            >
              <h2
                className={`contact-p text-3xl font-bold mb-6 text-gradient ${
                  themeName === "dark"
                    ? "text-stroke-dark"
                    : "text-stroke-light"
                }`}
              >
                {t("h2")}
              </h2>

              <DividerWithIcon />

              {/* الاسم */}
              <div>
                <label
                  className={`contact-text block mb-2 font-semibold ${
                    themeName === "dark"
                      ? "text-stroke-dark"
                      : "text-stroke-light"
                  }`}
                >
                  {t("lb")}
                </label>
                <input
                  type="text"
                  name="name"
                  value={user?.user_metadata?.name || formData.name}
                  onChange={handleChange}
                  readOnly={!!user?.user_metadata?.name}
                  className={`input-theme ${
                    user?.user_metadata?.name
                      ? "bg-gray-100 text-gray-600 cursor-not-allowed capitalize"
                      : themeName === "dark"
                        ? "input-dark"
                        : "input-light"
                  }`}
                  placeholder={t("inp")}
                />
              </div>

              {/* الهاتف */}
              <div>
                <label
                  className={`contact-text block mb-2 font-semibold ${
                    themeName === "dark"
                      ? "text-stroke-dark"
                      : "text-stroke-light"
                  }`}
                >
                  {t("lb2")}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={`input-theme ${themeName === "dark" ? "input-dark" : "input-light"}`}
                  placeholder={t("inp2")}
                />
              </div>

              {/* البريد */}
              <div>
                <label
                  className={`contact-text block mb-2 font-semibold ${
                    themeName === "dark"
                      ? "text-stroke-dark"
                      : "text-stroke-light"
                  }`}
                >
                  {t("lb3")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={user?.email || formData.email}
                  onChange={handleChange}
                  readOnly={!!user?.email}
                  className={`input-theme ${
                    user?.email
                      ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                      : themeName === "dark"
                        ? "input-dark"
                        : "input-light"
                  }`}
                  placeholder={t("inp3")}
                />
              </div>

              {/* الرسالة */}
              <div>
                <label
                  className={`contact-text block mb-2 font-semibold ${
                    themeName === "dark"
                      ? "text-stroke-dark"
                      : "text-stroke-light"
                  }`}
                >
                  {t("lb4")}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className={`input-theme ${themeName === "dark" ? "input-dark" : "input-light"}`}
                  placeholder={t("inp4")}
                ></textarea>
              </div>

              {/* زر الإرسال */}
              <button type="submit" className="btn-gradient w-full p-3 rounded-full text-white cursor-pointer font-bold text-lg transition-transform transform hover:scale-105">
                {t("btn")}
              </button>
            </motion.form>
          </div>
        </section>
        <Footer />
        <SignUpButton />
        <LoginModal />
        {user && <ChatWidget />}
      </main>
    </>
  );
}

