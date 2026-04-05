import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import DishCard from "../components/DishCard";

const API_BASE = "http://localhost:5000";

export default function Menu() {
  const [dishes, setDishes] = useState([]);
  const [cartDraft, setCartDraft] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

 const tableId = sessionStorage.getItem("tableId");

  const [_, dispatch] = useCart();

  useEffect(() => {
    axios.get(`${API_BASE}/api/dishes`).then((res) => {
      setDishes(res.data.dishes || []);
    });
  }, []);

  const updateQuantity = (id, change) => {
    setCartDraft((prev) => {
      const next = { ...prev, [id]: (prev[id] || 0) + change };
      if (next[id] <= 0) delete next[id];
      return next;
    });
  };

  const onAddToCart = (dish, qty) => {
    if (qty <= 0) return;

    dispatch({
      type: "ADD",
      payload: {
        item: {
          id: dish._id,
          name: dish.name,
          price: dish.price,
          image: dish.image,
        },
        qty,
      },
    });
  };

  return (
    <div className="p-6 mt-20">
      <h2 className="text-3xl text-center mb-6">Menu</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {dishes.map((dish) => (
          <DishCard
            key={dish._id}
            dish={dish}
            quantity={cartDraft[dish._id] || 0}
            onIncrease={() => updateQuantity(dish._id, 1)}
            onDecrease={() => updateQuantity(dish._id, -1)}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {/* ✅ CHECKOUT BUTTON FIX */}
      <div className="mt-10 text-center">
        <button
          onClick={() =>
            navigate("/checkout", {
              state: { tableId },
            })
          }
          className="bg-green-500 px-6 py-3 rounded text-black font-bold"
        >
          Go to Checkout
        </button>
      </div>
    </div>
  );
}