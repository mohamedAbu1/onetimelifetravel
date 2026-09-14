"use client";

import { useEffect, useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { FaArrowUp, FaClipboardList, FaDollarSign, FaSuitcase, FaUsers } from "react-icons/fa";
import { useUsers } from "../context/UserContext";
import { useTrip } from "../context/TripContext";
import { usePurchase } from "../context/PurchaseContext";

const chartTheme = { text: { fill: "#8f9a96", fontSize: 11 }, axis: { domain: { line: { stroke: "rgba(209,176,106,.22)" } }, ticks: { line: { stroke: "rgba(209,176,106,.16)" }, text: { fill: "#8f9a96" } } }, grid: { line: { stroke: "rgba(209,176,106,.1)" } }, tooltip: { container: { background: "#111b1d", color: "#f2eadb", borderRadius: 8 } } };

export default function DashboardHome() {
  const { users, fetchUsers } = useUsers();
  const { trips, fetchTrips } = useTrip();
  const { purchases, fetchPurchases } = usePurchase();

  // Context loaders are intentionally called once when the overview mounts.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchTrips(); fetchPurchases(); fetchUsers(); }, []);

  const bookingByDay = useMemo(() => {
    const grouped = purchases.reduce((result, purchase) => { const key = purchase.created_at ? new Date(purchase.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "Recent"; result[key] = (result[key] || 0) + 1; return result; }, {});
    return Object.entries(grouped).slice(-8).map(([day, count]) => ({ day, bookings: count }));
  }, [purchases]);
  const stats = [{ label: "Total users", value: users.length, note: "Registered accounts", icon: FaUsers }, { label: "Trip catalogue", value: trips.length, note: "Published experiences", icon: FaSuitcase }, { label: "Bookings", value: purchases.length, note: "All-time requests", icon: FaClipboardList }, { label: "Revenue tracked", value: "$25K", note: "Connect payment reports", icon: FaDollarSign }];

  return <div className="admin-overview"><div className="admin-welcome"><div><span className="admin-eyebrow">Live operations snapshot</span><h2>Good to see you, <em>administrator.</em></h2><p>Here is what is moving across One Time Life Travel today.</p></div><span className="admin-overview-date">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</span></div><div className="admin-stat-grid">{stats.map(({ label, value, note, icon: Icon }) => <article className="admin-stat-card" key={label}><div className="admin-stat-icon"><Icon /></div><span>{label}</span><strong>{value}</strong><small><FaArrowUp /> {note}</small></article>)}</div><div className="admin-chart-grid"><article className="admin-chart-card admin-chart-wide"><div className="admin-chart-head"><div><span className="admin-eyebrow">Demand pulse</span><h3>Bookings activity</h3></div><span className="admin-chart-badge">Last available records</span></div><div className="admin-chart"><ResponsiveBar data={bookingByDay.length ? bookingByDay : [{ day: "No data", bookings: 0 }]} keys={["bookings"]} indexBy="day" margin={{ top: 15, right: 15, bottom: 35, left: 35 }} padding={.45} borderRadius={5} colors={["#d1b06a"]} enableLabel={false} theme={chartTheme} axisBottom={{ tickSize: 0, tickPadding: 10 }} axisLeft={{ tickSize: 0, tickPadding: 8 }} enableGridX={false} /></div></article><article className="admin-chart-card"><div className="admin-chart-head"><div><span className="admin-eyebrow">Portfolio</span><h3>Catalogue mix</h3></div></div><div className="admin-chart"><ResponsiveBar data={[{ type: "Users", value: users.length }, { type: "Trips", value: trips.length }, { type: "Bookings", value: purchases.length }]} keys={["value"]} indexBy="type" margin={{ top: 15, right: 10, bottom: 35, left: 35 }} padding={.55} borderRadius={5} colors={["#6ea2a0"]} enableLabel={false} theme={chartTheme} axisBottom={{ tickSize: 0, tickPadding: 10 }} axisLeft={{ tickSize: 0, tickPadding: 8 }} enableGridX={false} /></div></article></div></div>;
}
