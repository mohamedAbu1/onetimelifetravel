/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUsers } from "react-icons/fa";
import { useUsers } from "../context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import UserCard from "./components/UserCard";
import UserActions from "./components/UserActions";
import UserDetails from "./components/UserDetails";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import AdminModuleHeader from "./AdminModuleHeader";

const UsersSection = () => {
  const { users, fetchUsers, setUsers } = useUsers();
  const { theme } = useTheme();
  const [activeUser, setActiveUser] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  const handleToggle = (userId, tab) => {
    if (activeUser === userId && activeTab === tab) {
      setActiveUser(null);
      setActiveTab(null);
    } else {
      setActiveUser(userId);
      setActiveTab(tab);
    }
  };

  // ✅ تغيير الدور (USER ⇄ ADMIN)
  const handleToggleRole = async (user) => {
    const newRole = user?.role === "ADMIN" ? "USER" : "ADMIN";

    const res = await fetch("/api/updateRole", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, newRole }),
    });

    if (!res.ok) {
      console.error("❌ Server error:", res.status);
      return;
    }

    let data;
    try {
      data = await res.json();
    } catch (err) {
      console.error("❌ Failed to parse JSON:", err);
      return;
    }

    if (data.error) {
      console.error("❌ Error updating role:", data.error);
    } else {
      console.log(`✅ Role updated to ${data.role} for user ${user.id}`);

      // ✅ تحديث محلي سريع باستخدام العمود role مباشرة
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, role: data.role } : u
        )
      );

      // ✅ إعادة تحميل للتأكد من التزامن مع قاعدة البيانات
      fetchUsers();
    }
  };

  return (
    <motion.div
      className={`admin-module admin-module-users p-6 rounded-lg shadow-lg ${theme.card} ${theme.text}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <EgyptianBackground />

      <AdminModuleHeader icon={FaUsers} eyebrow="People / access control" title="Users" description="Review customer profiles, activity and access roles from one place." actions={<span className="admin-metric-pill"><FaUsers /> {users.length} users</span>} />

      <ul className={`admin-users-list mt-6 divide-y ${theme.border}`}>
        {users.map((user) => (
          <motion.li
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="admin-user-row py-4 px-4 flex items-center gap-4"
          >
            {/* ✅ صورة المستخدم */}
            <img
              src={user?.avatar_url || "/default-avatar.png"}
              alt={user?.name || "User"}
              className="w-12 h-12 rounded-full border"
            />

            <div className="flex-1">
              {/* ✅ عرض الاسم والإيميل */}
              <p className="text-sm font-medium">
                Name: {user?.name || "Unknown"}
              </p>
              <p className="text-sm font-medium">
                Email: {user?.email || "No email"}
              </p>

              {/* ✅ عرض الدور الحالي */}
              <p className="text-sm font-medium mt-2">
                Role: {user?.role || "USER"}
              </p>

              {/* ✅ زر لتغيير الدور */}
              <button
                onClick={() => handleToggleRole(user)}
                className="mt-2 px-3 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                {user?.role === "ADMIN" ? "Make User" : "Make Admin"}
              </button>
            </div>

            <UserActions user={user} handleToggle={handleToggle} />
            {activeUser === user.id && (
              <UserDetails user={user} activeTab={activeTab} />
            )}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default UsersSection;
