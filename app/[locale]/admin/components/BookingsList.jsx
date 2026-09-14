"use client";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { FaCheckCircle, FaTimesCircle, FaClipboardList } from "react-icons/fa";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import { usePurchase } from "../context/PurchaseContext";
import { motion } from "framer-motion";
import DividerWithIcon from "@/components/layout/DividerWithIcon";
import { useTranslation } from "react-i18next";
import AdminModuleHeader from "./AdminModuleHeader";
import { FaCalendarCheck } from "react-icons/fa";
export default function BookingsList() {
  const { themeName } = useTheme();
  const { purchases, loading, error, fetchPurchases, handleStatusChange } =
    usePurchase();
  const { i18n } = useTranslation();
  const getStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
        return <FaCheckCircle className="text-green-500" />;
      case "Pending":
        return <FaTimesCircle className="text-yellow-500" />;
      case "Cancelled":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  if (loading) return <p className="text-center">⏳ Loading bookings...</p>;
  if (error)
    return <p className="text-center text-red-500">❌ Error: {error}</p>;

  return (
    <div
      className={`admin-module admin-module-table rounded-xl shadow-lg p-6 ${
        themeName === "dark"
          ? "bg-black/40 border border-gold/30 text-white"
          : "bg-white/70 border border-[#c9a34a]/30 text-[#3a2c0a] backdrop-blur-sm"
      }`}
    >
      <EgyptianBackground />

      <AdminModuleHeader icon={FaCalendarCheck} eyebrow="Operations / reservations" title="Bookings" description="Review guest reservations, dates and payment status from one workspace." actions={<span className="admin-metric-pill"><FaClipboardList /> {purchases.length} total</span>} />

      <button
        onClick={fetchPurchases}
        className="admin-action-button mb-4 px-4 py-2 rounded-lg bg-gradient-to-r from-[#c9a34a] to-[#eab308] text-white hover:scale-105 transition-transform shadow-md"
      >
        🔄 Refresh Bookings
      </button>

      {purchases.length > 0 ? (
        <motion.table
          className="w-full text-left border-collapse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <thead>
            <tr
              className={`${
                themeName === "dark"
                  ? "bg-gold/20 text-gold"
                  : "bg-[#fdf6e3] text-[#3a2c0a]"
              }`}
            >
              <th className="p-3">👤 User</th>
              <th className="p-3">🗺️ Trip</th>
              <th className="p-3">👥 Persons</th>
              <th className="p-3">👶 Children</th>
              <th className="p-3">📅 Arrival</th>
              <th className="p-3">📅 Departure</th>
              <th className="p-3">📱 Platform</th>
              <th className="p-3">📌 Status</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase, i) => (
              <>
                <DividerWithIcon />
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`transition hover:scale-[1.02] ${
                    themeName === "dark"
                      ? "hover:bg-gold/10"
                      : "hover:bg-[#fdf6e3]/50"
                  }`}
                >
                  <td className="p-3 font-semibold capitalize">
                    {purchase.userName || "Unknown User"}
                  </td>
                  <td className="p-3">
                    {(() => {
                      try {
                        const titleObj =
                          typeof purchase.tripTitle === "string"
                            ? JSON.parse(purchase.tripTitle)
                            : purchase.tripTitle;

                        return (
                          titleObj[i18n.language] ||
                          titleObj.en ||
                          "Unknown Trip"
                        );
                      } catch {
                        return purchase.tripTitle || "Unknown Trip";
                      }
                    })()}
                  </td>

                  <td className="p-3">{purchase.num_persons}</td>
                  <td className="p-3">{purchase.num_children}</td>
                  <td className="p-3">
                    {purchase.arrival_date
                      ? new Date(purchase.arrival_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-3">
                    {purchase.departure_date
                      ? new Date(purchase.departure_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-3">{purchase.platform}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(purchase.status)}

                      {purchase.status === "Cancelled" ? (
                        // ✅ حالة الإلغاء: نص ثابت فقط
                        <span className="text-red-600 font-semibold">
                          ❌ Cancelled
                        </span>
                      ) : (
                        // ✅ باقي الحالات: قائمة منسدلة للتغيير
                        <select
                          value={purchase.status}
                          onChange={(e) =>
                            handleStatusChange(purchase.id, e.target.value)
                          }
                          className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 
          text-sm font-medium text-gray-700 dark:text-gray-200 
          border border-gray-300 dark:border-gray-600 
          rounded-lg px-3 py-2 shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
          transition duration-200 ease-in-out"
                        >
                          <option
                            value="Pending"
                            className="text-yellow-600 font-semibold"
                          >
                            ⏳ Pending
                          </option>
                          <option
                            value="Confirmed"
                            className="text-green-600 font-semibold"
                          >
                            ✅ Confirmed
                          </option>
                        </select>
                      )}
                    </div>
                  </td>
                </motion.tr>
                <DividerWithIcon />
              </>
            ))}
          </tbody>
        </motion.table>
      ) : (
        <motion.p
          className="opacity-70 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          No bookings available.
        </motion.p>
      )}
    </div>
  );
}
