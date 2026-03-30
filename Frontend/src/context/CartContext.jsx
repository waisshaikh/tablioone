import React, { createContext, useContext, useEffect, useReducer } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";

const CartContext = createContext();
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function reducer(state, action) {
  switch (action.type) {
    case "SET_CART":
      return { ...state, items: action.payload };
    case "ADD": {
      const { item, qty = 1 } = action.payload;
      const existing = state.items.find((i) => i.id === item.id);
      let items;
      if (existing) {
        items = state.items.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + qty } : i
        );
      } else {
        items = [...state.items, { ...item, qty }];
      }
      return { ...state, items };
    }
    case "SET_QTY": {
      const { id, qty } = action.payload;
      const items = state.items
        .map((i) => (i.id === id ? { ...i, qty } : i))
        .filter((i) => i.qty > 0);
      return { ...state, items };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case "CLEAR":
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = React.useReducer(reducer, { items: [], userPhone: null });

  // Load cart from DB on login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user?.phoneNumber) {
        const phone = user.phoneNumber;
        state.userPhone = phone;

        try {
          const res = await axios.get(`${API_BASE}/api/cart/${encodeURIComponent(phone)}`);
          dispatch({ type: "SET_CART", payload: res.data.cart || [] });
        } catch (err) {
          console.error("Cart fetch failed:", err);
        }
      } else {
        state.userPhone = null;
        dispatch({ type: "SET_CART", payload: [] }); // clear on logout
      }
    });
    return () => unsub();
  }, []);

  // Sync cart changes to DB
  useEffect(() => {
    if (state.userPhone) {
      axios.post(`${API_BASE}/api/cart/${encodeURIComponent(state.userPhone)}`, {
        cart: state.items,
      });
    }
  }, [state.items, state.userPhone]);

  return (
    <CartContext.Provider value={[state, dispatch]}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
