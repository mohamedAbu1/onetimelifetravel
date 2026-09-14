"use client";

import { createContext, useContext } from "react";
import { useAuth as useSiteAuth } from "@/context/AuthContext";

const AdminAuthContext = createContext(null);

/** The admin area must use the same httpOnly-cookie session as the public app. */
export function AuthProvider({ children }) {
  const auth = useSiteAuth();
  const value = {
    ...auth,
    user: auth.userData,
    userData: auth.userData,
    isLoggedIn: Boolean(auth.userData),
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AdminAuthContext);
  if (!value) throw new Error("useAuth must be used inside the admin AuthProvider");
  return value;
}
