"use client";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import Logo from "./components/Logo";
import NavBar from "./components/NavBar";
import RightBar from "./components/RightBar";
import Button from "@mui/material/Button";
import { useAuth } from "@/context/AuthContext";
import { FaSignOutAlt, FaUserPlus } from "react-icons/fa";
import { useData } from "@/context/DataContext";
import MobileHeaderAuth from "./components/MobileHeaderAuth";
import LanguageSwitcher from "./components/LanguageSwitcher";

export default function Header() {
  const { theme, themeName } = useTheme();
  const { userData, isLoggedIn, logout } = useAuth();
  const { handleLoginOpen } = useData();

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
        <Logo />

        {/* روابط التنقل */}
        <NavBar />

        {/* مبدّل اللغة ويمين الهيدر */}
        <LanguageSwitcher />

        {/* يمين الهيدر (تبديل الثيم + المستخدم) */}
        <RightBar />

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
                <span>Logout</span>
              </>
            ) : (
              <>
                <FaUserPlus
                  size={20}
                  className={`${theme.icon} hover:${theme.iconHover}`}
                />
                <span>Sign Up</span>
              </>
            )}
          </Button>
        </motion.div>
        <MobileHeaderAuth />
      </div>
    </motion.header>
  );
}


