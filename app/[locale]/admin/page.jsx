"use client";

import { useEffect, useState } from "react";
import { FaBell, FaBars, FaLock, FaSearch } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import DashboardHome from "./components/DashboardHome";
import AddTrip from "./components/AddTrip";
import TripsList from "./components/TripsList";
import BookingsList from "./components/BookingsList";
import Reports from "./components/Reports";
import MessagesList from "./components/MessagesList";
import EditTrip from "./components/EditTrip";
import UsersSection from "./components/UsersSection";
import CurrencyRates from "./components/CurrencyRates";
import SeasonalEvents from "./components/SeasonalEvents";

const sections = { dashboard: ["Overview", DashboardHome], addTrip: ["Create trip", AddTrip], trips: ["Trip catalogue", TripsList], editTrip: ["Edit trips", EditTrip], users: ["Users", UsersSection], bookings: ["Bookings", BookingsList], reports: ["Reports", Reports], messages: ["Inbox", MessagesList], currency: ["Currency", CurrencyRates], seasonal: ["Seasonal events", SeasonalEvents] };

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userData } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";
  const isAdmin = userData?.role?.toLowerCase() === "admin";
  const [title, Component] = sections[activeSection];

  useEffect(() => {
    if (userData && !isAdmin) router.replace(`/${locale}`);
  }, [userData, isAdmin, locale, router]);

  if (!userData || !isAdmin) return <main className="admin-gate"><div className="admin-gate-card"><FaLock /><h1>Secured workspace</h1><p>Verifying your administrator session…</p><span className="admin-loader" /></div></main>;

  return <main className="admin-shell"><Sidebar activeSection={activeSection} setActiveSection={setActiveSection} open={sidebarOpen} onClose={() => setSidebarOpen(false)} locale={locale} /><section className="admin-main"><header className="admin-topbar"><button type="button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)} className="admin-menu-button lg:hidden"><FaBars /></button><div><span className="admin-eyebrow">Control centre / {locale.toUpperCase()}</span><h1>{title}</h1></div><div className="admin-topbar-actions"><label className="admin-search"><FaSearch /><input aria-label="Search dashboard" placeholder="Search workspace" /></label><button type="button" aria-label="Notifications" className="admin-icon-button"><FaBell /><i /></button><div className="admin-topbar-avatar">{(userData.name || "A").slice(0, 1).toUpperCase()}</div></div></header><div className="admin-content admin-surface"><Component themeName="dark" /></div></section></main>;
}
