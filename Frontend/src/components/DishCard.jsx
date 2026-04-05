import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    setExpanded(true);
    if (quantity === 0) onIncrease?.();
  };

  const totalPrice = (dish?.price || 0) * quantity;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-2xl overflow-hidden 
      bg-white/10 backdrop-blur-lg border border-white/10 
      shadow-xl flex flex-col"
    >
      {/* 🔥 FIX: pointer-events-none so it doesn't block clicks */}
      <div className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition bg-gradient-to-r from-[#00E19E]/20 to-[#00C6FF]/20 blur-xl"></div>

      {/* Image */}
      <div className="relative w-full h-48 overflow-hidden">
        <motion.img
          src={dish.image}
          alt={dish.name}
          loading="lazy"
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
        />

        {dish.category && (
          <div className="absolute top-3 left-3 bg-black/60 px-2 py-1 text-xs text-white rounded-md">
            {dish.category}
          </div>
        )}

        {!inStock && (
          <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
            Out of stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-white">
            {dish.name}
          </h3>
          <span className="text-[#00E19E] font-bold">
            ₹{dish.price}
          </span>
        </div>

        <AnimatePresence>
          {(expanded || quantity > 0) && dish.description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="text-sm text-gray-300"
            >
              {dish.description}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="mt-auto p-4 pt-0">
        {quantity === 0 ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddClick}
            disabled={!inStock}
            className={`w-full py-2 rounded-xl font-medium transition
              ${
                inStock
                  ? "bg-gradient-to-r from-[#00E19E] to-[#00C6FF] text-black"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
          >
            + Add
          </motion.button>
        ) : (
          <div className="flex flex-col gap-3">

            {/* Quantity */}
            <div className="flex items-center justify-between bg-black/30 rounded-xl px-3 py-2">
              <button
                onClick={() => onDecrease?.()}
                className="text-red-400 text-lg px-2"
              >
                −
              </button>

              <span className="text-white font-semibold text-lg">
                {quantity}
              </span>

              <button
                onClick={() => onIncrease?.()}
                className="text-green-400 text-lg px-2"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onAddToCart?.(dish, quantity)}
              className="w-full py-2 rounded-xl font-semibold 
              bg-gradient-to-r from-[#00E19E] to-[#00C6FF] 
              text-black"
            >
              Add • ₹{totalPrice}
            </motion.button>
          </div>
        )}
      </div>
    </motion.article>
  );
}