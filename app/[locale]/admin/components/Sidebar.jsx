"use client";

import Link from "next/link";
import { FaCalendarAlt, FaChartBar, FaChartLine, FaClipboardList, FaEnvelope, FaHome, FaMapMarkedAlt, FaPlus, FaSignOutAlt, FaSuitcase, FaTimes, FaUsers } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const items = [
  ["dashboard", "Overview", FaHome],
  ["addTrip", "Create trip", FaPlus],
  ["trips", "Trip catalogue", FaMapMarkedAlt],
  ["editTrip", "Edit trips", FaSuitcase],
  ["users", "Users", FaUsers],
  ["bookings", "Bookings", FaClipboardList],
  ["reports", "Reports", FaChartLine],
  ["messages", "Inbox", FaEnvelope],
  ["currency", "Currency", FaChartBar],
  ["seasonal", "Seasonal events", FaCalendarAlt],
];

export default function Sidebar({ activeSection, setActiveSection, open, onClose, locale }) {
  const { userData, logout } = useAuth();
  return <>
    {open && <button type="button" aria-label="Close menu" onClick={onClose} className="admin-sidebar-backdrop lg:hidden" />}
    <aside className={`admin-sidebar ${open ? "is-open" : ""}`}>
      <div className="admin-brand"><span className="admin-brand-mark">𓂀</span><span><strong>ONE TIME LIFE</strong><small>TRAVEL / CONTROL</small></span><button type="button" aria-label="Close menu" onClick={onClose} className="admin-mobile-close lg:hidden"><FaTimes /></button></div>
      <div className="admin-workspace"><span className="admin-status-dot" /> Operations workspace</div>
      <nav className="admin-nav" aria-label="Admin navigation">{items.map(([section, label, Icon]) => <button type="button" key={section} onClick={() => { setActiveSection(section); onClose?.(); }} className={`admin-nav-item ${activeSection === section ? "is-active" : ""}`}><Icon /><span>{label}</span>{activeSection === section && <i />}</button>)}</nav>
      <div className="admin-sidebar-footer"><Link href={`/${locale}`} className="admin-nav-item"><FaHome /><span>Back to website</span></Link><button type="button" onClick={logout} className="admin-nav-item admin-logout"><FaSignOutAlt /><span>Sign out</span></button><div className="admin-user-mini"><span className="admin-avatar">{(userData?.name || "A").slice(0, 1).toUpperCase()}</span><span><strong>{userData?.name || "Administrator"}</strong><small>{userData?.email || "Secure session"}</small></span></div></div>
    </aside>
  </>;
}
