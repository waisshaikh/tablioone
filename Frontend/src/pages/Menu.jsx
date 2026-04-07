import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import DishCard from "../components/DishCard";

const API_BASE = "https://second-brain-huvx.onrender.com";

export default function Menu() {
  const [dishes, setDishes] = useState([]);
  const [cartDraft, setCartDraft] = useState({});
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigate = useNavigate();
  const tableId = sessionStorage.getItem("tableId");
  const [_, dispatch] = useCart();

  useEffect(() => {
    axios.get(`${API_BASE}/api/dishes`).then((res) => {
      setDishes(res.data.dishes || []);
    });
  }, []);

  //  Dynamic categories
  const categories = [
    "All",
    ...new Set(dishes.map((dish) => dish.category)),
  ];

  //  Filter logic
  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch = dish.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      dish.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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
      <h2 className="text-3xl text-center mb-6 font-bold">Menu</h2>

      {/*  Search +  Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

        {/* Search */}
        <input
          type="text"
          placeholder="Search dishes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full border transition ${
                selectedCategory === cat
                  ? "bg-green-500 text-black font-semibold"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/*  Dishes */}
      {filteredDishes.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredDishes.map((dish) => (
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
      ) : (
        <p className="text-center text-gray-500 mt-10 text-lg">
          No dishes found 😔
        </p>
      )}

      {/* 🛒 Checkout */}
      <div className="mt-10 text-center">
        <button
          onClick={() =>
            navigate("/checkout", {
              state: { tableId },
            })
          }
          className="bg-green-500 px-6 py-3 rounded text-black font-bold hover:scale-105 transition"
        >
          Go to Checkout
        </button>
      </div>
    </div>
  );
}