"use client";
import CategoryCard from "./components/CategoryCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function CategoriesList({ categories, language }) {
  return (
    <div className="w-full p-8">
      <Swiper
        spaceBetween={20}
        loop={true}
        autoplay={{ delay: 4000 }}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
      >
        {categories.map((cat, idx) => (
          <SwiperSlide key={idx}>
            <CategoryCard cat={cat} language={language} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
