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

export default function Header() {
  const { theme, themeName } = useTheme();
  const { userData, isLoggedIn, logout } = useAuth();
  const { handleLoginOpen } = useData();

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed left-0 top-0 z-50 w-full bg-transparent px-3 pt-3 transition-all duration-500"
      style={{
        borderTopRadius: "0px",
      }}
    >
      <div className={`header-journal container mx-auto flex h-[70px] max-w-7xl items-center justify-between gap-4 rounded-2xl border px-4 shadow-lg transition-colors duration-500 sm:px-7 lg:h-[76px] lg:px-8 ${theme.border}`}>
        {/* شعار الموقع */}
        <Logo />

        {/* روابط التنقل */}
        <NavBar />

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
