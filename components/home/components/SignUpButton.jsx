"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { motion } from "framer-motion";
import { useData } from "@/context/DataContext";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "react-toastify";
import { useSecurity } from "@/context/SecurityContext";
import { useTranslation } from "react-i18next";
import HeaderComponent from "./components/HeaderComponent";
import FormComponent from "./components/FormComponent";
import ActionsComponent from "./components/ActionsComponent";
import DividerWithIcon from "@/components/layout/DividerWithIcon";

export default function SignUpModal() {
  const { handleLoginOpen, signUpOpen, handleSignUpClose } = useData();
  const { theme, themeName } = useTheme();
  const { validateField } = useSecurity();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const { t } = useTranslation("home");
  const { register, loading, loginWithGoogle, handleClose } = useAuth();

  const handleSubmit = async () => {
    const nameError = validateField("Full Name", fullName);
    const emailError = validateField("Email", email);
    const passwordError = validateField("Password", password);
    if (nameError || emailError || passwordError || !gender) {
      toast.error(
        nameError || emailError || passwordError || "Gender is required",
      );
      return;
    }
    try {
      await register(email, password, fullName, gender);
      toast.success("✅ A confirmation message has been sent to your account.");
      handleClose();
    } catch (err) {
      toast.error("❌ Error: " + err.message);
    }
  };

  return (
    <Dialog
      open={signUpOpen}
      onClose={handleSignUpClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "20px",
          backdropFilter: "blur(16px)",
          background:
            themeName === "dark"
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
        className="rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <HeaderComponent theme={theme} />
        <DividerWithIcon />

        {/* Content */}
        <DialogContent className="flex flex-col gap-6 p-8">
          <FormComponent
            t={t}
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            gender={gender}
            setGender={setGender}
            theme={theme}
          />

          <DividerWithIcon />

          <ActionsComponent
            t={t}
            loginWithGoogle={loginWithGoogle}
            handleSubmit={handleSubmit}
            loading={loading}
            handleLoginOpen={handleLoginOpen}
          />
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}
