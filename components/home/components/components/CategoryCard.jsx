"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

const encodeData = (obj) => btoa(JSON.stringify(obj));

export default function CategoryCard({ cat, language }) {
  const [imgIndex, setImgIndex] = useState(0);
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % (cat.images?.length || 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [cat.images]);

  const displayName =
    typeof cat.name === "object"
      ? cat.name?.[language] || cat.name?.en || cat.name
      : cat.name;

  const luxuryNames = ["Luxury Tours", "Luxusreisen", "Tours de lujo"];

  const handleClick = () => {
    const queryObj = {
      city: "all",
      category: [displayName],
      price: luxuryNames.includes(displayName) ? "Luxury" : "All",
      popular: false,
    };
    router.push(`/trips?data=${encodeData(queryObj)}`);
  };

  return (
    <motion.div
      onClick={handleClick}
      whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5 }}
      className={`relative group cursor-pointer 
                  w-full max-w-[320px] 
                  h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] 
                  mx-auto rounded-[40px] 
                  perspective-1000 ${theme.card} ${theme.shadow}`}
    >
      <div className="absolute inset-0 flex items-center justify-center rounded-[40px]">
        <div
          className={`w-full h-full relative overflow-hidden rounded-[40px] 
                      shadow-2xl transform transition-transform duration-500`}
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={imgIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <Image
                src={cat.images?.[imgIndex] || "/fallback.jpg"}
                alt={displayName}
                fill
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Overlay + انعكاس سفلي */}
          <div
            className={`absolute inset-0 ${theme.overlay} flex items-end justify-center pb-6`}
          >
            <p className={`${theme.title} text-lg font-bold`}>
              {displayName}
            </p>
          </div>

          {/* انعكاس سفلي */}
          <div className="absolute bottom-[-40%] inset-x-0 opacity-30 scale-y-[-1]">
            <Image
              src={cat.images?.[imgIndex] || "/fallback.jpg"}
              alt={`${displayName} reflection`}
              fill
              className="object-cover rounded-b-[40px]"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
