"use client";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import Logo from "./components/Logo";
import NavBar from "./components/NavBar";
import RightBar from "./components/RightBar";
import Button from "@mui/material/Button";
import { useAuth } from "@/context/AuthContext";
import { FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { useData } from "@/context/DataContext";
import MobileHeaderAuth from "./components/MobileHeaderAuth";
import LanguageSwitcher from "./components/LanguageSwitcher";
import AdminDashboardButton from "@/components/layout/AdminDashboardButton";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { theme, themeName } = useTheme();
  const { userData, isLoggedIn, logout } = useAuth();
  const { handleLoginOpen } = useData();
  const { t: tc } = useTranslation("common");
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";
  const mobileLinks = [
    [tc("navHome"), `/${locale}`],
    [tc("navTrips"), `/${locale}/trips`],
    [tc("navAbout"), `/${locale}/about`],
    [tc("navContact"), `/${locale}/contact`],
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed left-0 top-0 z-50 w-full bg-transparent px-2 pt-2 transition-all duration-500 sm:px-3 sm:pt-3"
      style={{
        borderTopRadius: "0px",
      }}
    >
      <div className={`header-journal container mx-auto flex h-[64px] min-w-0 max-w-7xl items-center justify-between gap-2 rounded-2xl border px-3 shadow-lg transition-colors duration-500 sm:h-[70px] sm:gap-4 sm:px-7 lg:h-[76px] lg:px-8 ${theme.border}`}>
        {/* شعار الموقع */}
        <Logo mobileIconOnly />

        {/* روابط التنقل */}
        <NavBar />

        <button
          type="button"
          aria-label={mobileOpen ? tc("closeNavigation") : tc("openNavigation")}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--logo-border)]/50 bg-black/5 text-[var(--primary-color)] transition hover:bg-[var(--logo-border)]/15 lg:hidden"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* مبدّل اللغة ويمين الهيدر */}
        <LanguageSwitcher />

        {/* يمين الهيدر (تبديل الثيم + المستخدم) */}
        <RightBar />
        <AdminDashboardButton compact />

        {/* زر تسجيل الدخول/الخروج */}
        <motion.div whileHover={{ scale: 1.03 }} className="hidden lg:flex">
          <Button
            onClick={userData ? logout : handleLoginOpen}
            className={`dust-interactive flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold uppercase tracking-wide shadow-md transition-all ${
              isLoggedIn ? theme.buttonSecondary : theme.buttonPrimary
            }`}
            style={{
              color: themeName === "dark" ? "#ededed" : theme.inputText,
              borderColor: theme.inputBorder,
            }}
          >
            {isLoggedIn ? (
              <>
                <FaSignOutAlt
                  size={20}
                  className={`${theme.icon} hover:${theme.iconHover}`}
                />
                <span>{tc("logout")}</span>
              </>
            ) : (
              <>
                <FaSignInAlt
                  size={20}
                  className={`${theme.icon} hover:${theme.iconHover}`}
                />
                <span>{tc("signIn")}</span>
              </>
            )}
          </Button>
        </motion.div>
        <MobileHeaderAuth />
      </div>
      {mobileOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="mx-3 mt-2 rounded-2xl border border-[var(--logo-border)]/35 bg-[color-mix(in_srgb,var(--card-bg)_96%,transparent)] p-2 shadow-xl backdrop-blur-xl lg:hidden"
        >
          {mobileLinks.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--logo-border)]/15">
              {label}
            </Link>
          ))}
          {userData?.role?.toLowerCase() === "admin" && (
            <Link href={`/${locale}/admin`} onClick={() => setMobileOpen(false)} className="mt-1 block rounded-xl border-t border-[var(--logo-border)]/20 px-4 py-3 text-sm font-bold text-[var(--primary-color)]">{tc("dashboard")}</Link>
          )}
        </motion.nav>
      )}
    </motion.header>
  );
}


