"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useQueryFilters } from "./QueryContext";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { useData } from "./DataContext";
import { useTranslation } from "react-i18next";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { data: session } = useSession(); // ✅ جلب المستخدم من جوجل عبر NextAuth
  const [chatUser, setChatUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  const [user, setUser] = useState(null); // بيانات من API
  const [UserToken, setUserToken] = useState(null); // بيانات من التوكين
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { handleSignUpClose } = useData();
  const { updateValue, getEncodedQuery } = useQueryFilters();
  const { t } = useTranslation("common");

  const fetchUserFromServer = async () => {
    try {
      const res = await axios.get("/api/auth/me", { withCredentials: true });
      const currentUser = res.data.user;
      setUser(currentUser);
      setUserToken(currentUser);
      setIsLoggedIn(Boolean(currentUser));
    } catch (err) {
      if (err.response?.status === 401) {
        setUser(null);
        setUserToken(null);
        setIsLoggedIn(false);
        return;
      }
      console.warn("⚠️ Token expired or invalid, trying refresh...");
      try {
        const retry = await axios.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true },
        );
        setUser(retry.data.user);
        setUserToken(retry.data.user);
        setIsLoggedIn(true);
      } catch (refreshErr) {
        console.error("💥 Refresh failed:", refreshErr.message);
        setUser(null);
        setUserToken(null);
        setIsLoggedIn(false);
      }
    }
  };

  // ✅ استدعاء عند تحميل الصفحة
  useEffect(() => {
    fetchUserFromServer();
  }, []);

  // ✅ تسجيل مستخدم جديد يدويًا
  const register = async (email, password, name, gender) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        "/api/auth/register",
        { name, email, password, gender },
        { withCredentials: true },
      );
      const data = res.data;
      if (res.status !== 201)
        throw new Error(data.error || "Registration failed");

      toast.success(`✅ ${t("accountCreated")}`);
      handleSignUpClose();
      return data;
    } catch (err) {
      setError(err.message);
      toast.error("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ تسجيل الدخول يدويًا
  const login = async (email, password, onSuccess) => {
    setLoading(true);
    setError(null);
    try {

      const res = await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true },
      );

      const data = res.data;

      if (res.status !== 200) {
        console.error("❌ فشل تسجيل الدخول:", data.error);
        throw new Error(data.error || "Login failed");
      }

      const user = data.user;

      setUser(user);

      // ✅ جلب بيانات المستخدم من السيرفر بعد تسجيل الدخول
      await fetchUserFromServer();

      setIsLoggedIn(true);

      if (onSuccess) {
        onSuccess();
      }

      const encodedQuery = getEncodedQuery();
      router.push(`/?data=${encodedQuery}`);

      toast.success(`✅ ${t("loggedIn")}`);
      return user;
    } catch (err) {
      console.error("💥 خطأ أثناء تسجيل الدخول:", err.message);
      setError(err.message);
      toast.error("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ تسجيل الدخول بجوجل
  const loginWithGoogle = async () => {
    try {
      const result = await signIn("google", { redirect: false });
      if (result?.error) {
        toast.error("❌ خطأ أثناء تسجيل الدخول بجوجل: " + result.error);
        return;
      }

      const res = await fetch("/api/auth/session");
      const sessionData = await res.json();
      const userData = sessionData?.user;

      if (!userData) {
        toast.error("❌ لم يتم العثور على بيانات المستخدم.");
        return;
      }

      // ✅ استدعاء API route للتعامل مع MySQL
      const dbRes = await axios.post("/api/auth/google", {
        email: userData.email,
        name: userData.name,
      });

      setUser({ ...userData, ...dbRes.data, role: userData.role });
      setIsLoggedIn(true);
      toast.success("✅ تم تسجيل الدخول بجوجل!");
    } catch (err) {
      console.error("OAuth Error:", err);
      toast.error("❌ حدث خطأ غير متوقع أثناء تسجيل الدخول بجوجل.");
    }
  };

  // ✅ تسجيل الخروج
  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("❌ Error clearing cookies on server:", err);
    } finally {
      // A Google account is managed by NextAuth while email accounts use our
      // JWT cookies. Clear both stores so userData cannot remain truthy.
      await signOut({ redirect: false });
    }
    setUser(null);
    setUserToken(null);
    setIsLoggedIn(false);
    toast.info(`🚪 ${t("loggedOut")}`);
  };

  const userData = user || session?.user;
  return (
    <AuthContext.Provider
      value={{
        userData, // بيانات من API أو من Google
        user: userData, // Backwards-compatible alias used by admin contexts
        register,
        login,
        loginWithGoogle, // ✅ تسجيل الدخول بجوجل
        logout,
        loading,
        error,
        isLoggedIn,
        open,
        setOpen,
        handleOpen,
        handleClose,
        fetchUserFromServer,
        chatUser,
        setChatUser,
        chatMessages,
        setChatMessages,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}


