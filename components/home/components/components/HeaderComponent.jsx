import React from "react";
import Logo from "@/components/header/components/Logo";
import { useTranslation } from "react-i18next";

export default function HeaderComponent({ theme }) {
  const { t } = useTranslation("common");
  return (
    <div className="auth-header flex flex-col items-center gap-4 px-6 pb-2 pt-8 text-center">
      <Logo compact />
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--logo-border)]">{t("beginStory")}</p>
        <h1 className="mt-2 font-[Cinzel] text-3xl font-semibold tracking-[-0.02em] text-[var(--heading)]">{t("createAccount")}</h1>
      </div>
    </div>
  );
}
