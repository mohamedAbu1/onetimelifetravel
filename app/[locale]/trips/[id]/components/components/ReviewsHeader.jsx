"use client";
import { FaStar } from "react-icons/fa";

export default function ReviewsHeader({ title, averageRating,average, reviewsCount, theme, t }) {
  return (
    <div className="trip-reviews-header">
      <div><span className="trip-reviews-eyebrow">✦ Traveller voices</span><h2 className={`trip-reviews-title ${theme.title}`}>{title}</h2><p className={`trip-reviews-subtitle ${theme.subText}`}>Real stories from guests who experienced this journey.</p></div>
      {reviewsCount > 0 && (
        <div className="trip-reviews-score">
          <strong>{averageRating}</strong>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={20}
                className={
                  i < Math.round(averageRating)
                    ? theme.icon
                    : "text-gray-400"
                }
              />
            ))}
          </div>
          <span className={`trip-reviews-count ${theme.subText}`}>{reviewsCount} reviews</span>
        </div>
      )}
    </div>
  );
}
