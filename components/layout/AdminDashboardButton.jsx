"use client";
import React from "react";
import { FaTachometerAlt } from "react-icons/fa"; // أيقونة الداش بورد
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminDashboardButton({ compact = false }) {
  const { userData } = useAuth();
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";
  // ✅ تحقق من أن المستخدم أدمن
  const isAdmin = userData?.role?.toLowerCase() === "admin";

  if (!isAdmin) return null; // الزر يظهر فقط للأدمن

  return (
     <motion.div
      style={{ zIndex: 2 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={compact ? "hidden lg:block" : "fixed bottom-6 right-6 z-40"}
    >
      <Link
        href={`/${locale}/admin`}
        aria-label="Open admin dashboard"
        className={compact
          ? "flex items-center gap-2 rounded-full border border-[var(--logo-border)]/60 bg-[var(--primary-gradient)] px-4 py-2 text-xs font-extrabold uppercase tracking-[.12em] text-[#18262b] shadow-lg transition hover:-translate-y-0.5"
          : "flex items-center gap-3 rounded-full border border-[var(--logo-border)]/60 bg-[var(--primary-gradient)] px-5 py-3 font-bold tracking-wide text-[#18262b] shadow-xl transition hover:-translate-y-0.5"}
      >
        <FaTachometerAlt size={compact ? 15 : 20} />
        <span>{compact ? "Dashboard" : "Dashboard"}</span>
      </Link>
    </motion.div>
  );
}
