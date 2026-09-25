"use client";
import { motion } from "framer-motion";
import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useTheme } from "@/context/ThemeContext";
// لو مش لاقي أيقونات جاهزة ل Viator و Tripadvisor في react-icons
// ممكن تستخدم FaGlobe أو أيقونات عامة أو تضيف SVG مخصص

import { FaGlobe } from "react-icons/fa"; // مؤقت لـ Viator
import { FaTripadvisor } from "react-icons/fa"; // موجود في react-icons

const LeftSocialIcons = () => {
  const { theme } = useTheme();

  const socialLinks = [
    { Icon: FaFacebookF, url: "https://www.facebook.com/share/19mMuVB5AH/", label: "Facebook" },
    { Icon: FaInstagram, url: "https://www.instagram.com/onetimelive8?stkn=eXN0cnFzNXNlNm0w", label: "Instagram" },
    { Icon: FaTiktok, url: "https://vm.tiktok.com/ZS9Ab87NaeXTJ-pZBfp/", label: "TikTok" },
    { Icon: FaWhatsapp, url: "https://wa.me/201009011178", label: "WhatsApp" },
    { Icon: MdEmail, url: "mailto:onetimelifetravel@gmail.com", label: "Email" },
    { Icon: FaGlobe, url: "https://www.viator.com/", label: "Viator" },
    { Icon: FaTripadvisor, url: "https://www.tripadvisor.com/", label: "Tripadvisor" },
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.7 }}
      className="relative z-30 mx-auto mt-2 flex flex-row gap-2.5 pb-5 lg:absolute lg:bottom-8 lg:left-12 lg:mx-0 lg:mt-0 lg:pb-0"
    >
      {socialLinks.map(({ Icon, url, label }) => (
        <motion.a
          whileHover={{ scale: 1.2, rotate: -5 }}
          key={label}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`dust-interactive rounded-full border border-white/15 bg-black/20 p-2.5 backdrop-blur-md ${theme.shadow}`}
        >
          <Icon size={22} className={theme.icon} />
        </motion.a>
      ))}
    </motion.div>
  );
};

export default LeftSocialIcons;
