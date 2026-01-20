"use client"; 
import { useState } from "react";

export default function RateBook() {
  const [rating, setRating] = useState(0); 
  const [hover, setHover] = useState(0);   

  return (
    <div className="mb-8 p-6 border border-dashed border-gray-300 rounded-2xl bg-gray-50/50">
      <h3 className="font-bold text-[#202020] text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
        <span className="material-icons text-gray-400 text-sm">thumb_up</span>
        Sen de Puan Ver
      </h3>
      
      <div className="flex items-center gap-2">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <button
              key={index}
              type="button"
              className="focus:outline-none transition-transform hover:scale-110"
              onClick={() => setRating(ratingValue)}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
            >
              <span 
                className={`material-icons text-3xl transition-colors ${
                  ratingValue <= (hover || rating) 
                    ? "text-yellow-400" 
                    : "text-gray-300"
                }`}
              >
                star
              </span>
            </button>
          );
        })}
        {rating > 0 && (
          <span className="ml-2 text-sm font-bold text-[#00537d] animate-pulse">
            {rating} Puan!
          </span>
        )}
      </div>
    </div>
  );
}