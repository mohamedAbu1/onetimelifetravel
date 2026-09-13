import React from "react";
import { motion } from "framer-motion";
import Logo from "@/components/header/components/Logo";
const NameWeb = () => {
  return (
    <section className="hidden container lg:flex w-full h-[15vh] relative bg-cover bg-center flex-col items-center justify-center p-1">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
        }}
        className="z-[1] rounded-2xl border border-[var(--logo-border)]/25 bg-black/10 px-8 py-4 backdrop-blur-sm"
      >
        <Logo compact />
      </motion.div>
    </section>
  );
};

export default NameWeb;
