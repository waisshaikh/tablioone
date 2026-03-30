import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Filter } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom"; // 👈 added useSearchParams
import { auth } from "../firebase";
import { useCart } from "../context/CartContext";
import DishCard from "../components/DishCard";

const API_BASE = "http://localhost:5000";

export default function Menu() {
  const [dishes, setDishes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cartDraft, setCartDraft] = useState({}); // dishId -> qty
  const [_, dispatch] = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // 👈

  // ✅ Check if ?table= exists → store in sessionStorage
  useEffect(() => {
    const tableId = searchParams.get("table");
    if (tableId) {
      sessionStorage.setItem("activeTable", tableId);
    }
  }, [searchParams]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/dishes`);
        setDishes(res.data?.dishes || []);
      } catch (e) {
        console.error("Fetch dishes failed:", e);
      }
    })();
  }, []);

  const updateQuantity = (id, change) => {
    setCartDraft((prev) => {
      const next = { ...prev, [id]: Math.max(0, (prev[id] || 0) + change) };
      if (next[id] === 0) delete next[id];
      return next;
    });
  };

  const onAddToCart = (dish, qty) => {
    if (qty <= 0) return;
    const user = auth.currentUser;
    if (!user) {
      sessionStorage.setItem(
        "pendingAdd",
        JSON.stringify({ id: dish._id, qty })
      );
      navigate("/login", { replace: true, state: { from: "/menu" } });
      return;
    }

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

  // categories for filter
  const categories = ["All", ...new Set(dishes.map((d) => d.category))];

  const filtered = dishes.filter((d) => {
    const matchSearch = d.name?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || d.category === category;
    return matchSearch && matchCategory;
  });

  // ✅ Process a pending add after login
  useEffect(() => {
    const pending = sessionStorage.getItem("pendingAdd");
    if (auth.currentUser && pending) {
      const parsed = JSON.parse(pending);
      const dish = dishes.find((d) => d._id === parsed.id);
      if (dish) {
        dispatch({
          type: "ADD",
          payload: {
            item: {
              id: dish._id,
              name: dish.name,
              price: dish.price,
              image: dish.image,
            },
            qty: parsed.qty,
          },
        });
      }
      sessionStorage.removeItem("pendingAdd");
    }
  }, [dishes]);

  return (
    <div className="p-6 max-w-7xl mx-auto mt-20">
      <h2 className="text-3xl font-bold mb-6 text-center">🍤 Our Menu</h2>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-2 bg-white/10 dark:bg-gray-800 px-3 py-2 rounded-lg flex-1 border border-white/10">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes..."
            className="bg-transparent flex-1 outline-none text-sm text-gray-200 placeholder-gray-400"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter size={18} className="text-gray-400 shrink-0" />
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition ${
                category === c
                  ? "bg-gradient-to-r from-[#00E19E] to-[#00C6FF] text-black font-semibold"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400">No dishes match your filters.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dish) => (
            <DishCard
              key={dish._id}
              dish={dish}
              quantity={cartDraft[dish._id] || 0}
              onIncrease={() => updateQuantity(dish._id, +1)}
              onDecrease={() => updateQuantity(dish._id, -1)}
              onAddToCart={(d, qty) => onAddToCart(d, qty)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
  