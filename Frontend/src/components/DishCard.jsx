
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function DishCard({
  dish,
  quantity = 0,
  onIncrease,
  onDecrease,
  onAddToCart, 
}) {
  const [expanded, setExpanded] = useState(false);
  const inStock = dish?.inStock !== false;

  const handleAddClick = () => {
    if (!inStock) return;
    if (!expanded) setExpanded(true);
    if (quantity === 0) onIncrease?.(); // ensure at least 1 selected
  };

  return (
    <motion.article
      layout
      whileHover={{ scale: 1.01 }}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-white/10 flex flex-col"
    >
      {/* Image */}
      <div className="relative w-full h-44 sm:h-56">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {dish.category && (
          <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
            {dish.category}
          </div>
        )}
        {!inStock && (
          <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
            Out of stock
          </div>
        )}
      </div>

      {/* Name + Price */}
      <div className="px-4 pt-3 pb-2 flex items-start justify-between gap-3">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
          {dish.name}
        </h3>
        <div className="shrink-0 text-teal-500 font-bold text-sm sm:text-base">
          ₹{dish.price}
        </div>
      </div>

      {/* Description */}
      {(expanded || quantity > 0) && dish.description && (
        <p className="px-4 pb-2 text-sm text-slate-600 dark:text-slate-300">
          {dish.description}
        </p>
      )}

      {/* Bottom Controls */}
      <div className="mt-auto px-4 pt-2 pb-4 border-t border-white/10">
        {quantity === 0 ? (
          <button
            disabled={!inStock}
            onClick={handleAddClick}
            className={`w-full py-2 rounded-lg font-medium transition
              ${
                inStock
                  ? "bg-gradient-to-r from-[#00E19E] to-[#00C6FF] text-black hover:opacity-95"
                  : "bg-slate-300 text-slate-600 cursor-not-allowed"
              }`}
          >
            + Add
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Quantity controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={onDecrease}
                className="px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                −
              </button>
              <span className="min-w-[2ch] text-center font-semibold text-slate-900 dark:text-white">
                {quantity}
              </span>
              <button
                onClick={onIncrease}
                className="px-3 py-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600"
              >
                +
              </button>
            </div>

            {/* Separate Add to Cart */}
            <button
              onClick={() => onAddToCart?.(dish, quantity)}
              className="w-full px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-[#00E19E] to-[#00C6FF] text-black hover:opacity-95 transition"
            >
              Add to Cart • {quantity} × ₹{dish.price} = ₹{dish.price * quantity}
            </button>
          </div>
        )}
      </div>
    </motion.article>
  );
}
