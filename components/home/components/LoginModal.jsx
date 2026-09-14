"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import { MdEmail, MdLock } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { useData } from "@/context/DataContext";
import { useTheme } from "@/context/ThemeContext"; // ✅ جلب الثيم
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useSecurity } from "@/context/SecurityContext";
import { useTranslation } from "react-i18next";
import DividerWithIcon from "@/components/layout/DividerWithIcon";

export default function LoginModal() {
  const { loginOpen, handleLoginClose, handleSignUpOpen } = useData();
  const { theme ,themeName} = useTheme(); // ✅ يرجع DarkTheme أو LightTheme

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation("home");
  const { t: tc } = useTranslation("common");

  const { login, loginWithGoogle, loading, handleClose } = useAuth();
  const { validateField } = useSecurity();

  const handleSubmit = useCallback(async () => {
    const emailError = validateField("email", email);
    const passwordError = validateField("password", password);

    if (emailError || passwordError) {
      toast.error(emailError || passwordError);
      return;
    }

    try {
      await login(email, password);
      toast.success(`✅ ${tc("loggedIn")}`);
      handleLoginClose();
      handleClose();
    } catch (err) {
      toast.error(`❌ ${tc("invalidCredentials")}`);
    }
  }, [email, password, validateField, login, handleLoginClose, handleClose]);

  return (
  <Dialog
  open={loginOpen}
  onClose={handleLoginClose}
  fullWidth
  maxWidth="sm"
  PaperProps={{
    className: "auth-journal",
    sx: {
      borderRadius: "20px",
      backdropFilter: "blur(16px)",
      background: themeName === "dark"
        ? "linear-gradient(135deg, rgba(20,20,20,0.9), rgba(40,40,40,0.8))"
        : "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,240,240,0.8))",
      boxShadow: theme.shadow,
    },
  }}
>
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="auth-shell overflow-hidden rounded-2xl"
  >
    {/* Header */}
    <div className="text-center py-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--logo-border)]">{tc("welcomeBack")}</p>
      <h2 className="mt-2 font-[Cinzel] text-3xl font-semibold tracking-[-0.02em] text-[var(--heading)]">{t("Login")}</h2>
    </div>
    <DividerWithIcon />

    {/* Content */}
    <DialogContent className="auth-content flex flex-col gap-5 p-6 sm:p-8">
      {/* Email */}
      <TextField
        label={t("Email")}
        type="email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MdEmail className="text-[#A68B5B]" />
            </InputAdornment>
          ),
        }}
      />

      {/* Password */}
      <TextField
        label={t("Password")}
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MdLock className="text-[#A68B5B]" />
            </InputAdornment>
          ),
        }}
      />

      <DividerWithIcon />

      {/* Google Button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: "flex", justifyContent: "center" }}>
        <IconButton
          onClick={loginWithGoogle}
          style={{ borderRadius: "12px" }}
        className="auth-google flex h-14 w-full max-w-[320px] items-center gap-3 bg-white font-semibold text-black shadow-md transition-all hover:bg-[#f5ecd9]"
        >
          <FcGoogle size={28} />
          <span className="text-[#A68B5B]">{tc("signInGoogle")}</span>
        </IconButton>
      </motion.div>

      {/* Login Button */}
      <motion.div whileHover={{ scale: 1.05 }}>
        <Button
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
          className="auth-primary rounded-full px-6 py-3 font-bold shadow-lg transition-all"
        >
          {loading ? t("Loggingin") : t("Login")}
        </Button>
      </motion.div>

      {/* SignUp Button */}
      <Button
        fullWidth
        onClick={() => {
          handleLoginClose();
          handleSignUpOpen();
        }}
        className="auth-secondary rounded-full px-6 py-3 font-semibold transition-all"
      >
        {t("Don’thaveanaccount?SignUp")}
      </Button>
    </DialogContent>
  </motion.div>
</Dialog>

  );
}
