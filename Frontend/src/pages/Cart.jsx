import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function Cart() {
  const [state, dispatch] = useCart();
  const cartItems = state.items || [];
  const navigate = useNavigate();

  // require login to view cart
  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login", { replace: true, state: { from: "/cart" } });
    }
  }, []);

  const total = cartItems.reduce(
    (s, i) => s + i.price * (i.qty ?? i.quantity ?? 1),
    0
  );

  const updateQuantity = (id, qty) => {
    if (qty < 1) return;
    dispatch({ type: "SET_QTY", payload: { id, qty } });
  };

  const remove = (id) => dispatch({ type: "REMOVE", payload: id });

  if (!cartItems.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 " >
        <div className="text-center">
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <button
            onClick={() => navigate("/menu")}
            className="mt-3 px-6 py-2 bg-[#00E19E] rounded-lg"
          >
            Go to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#0A0A0A] to-[#121212] text-white mt-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-lg">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-300">₹{item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.id, (item.qty ?? item.quantity ?? 1) - 1)
                  }
                  className="px-2 py-1 bg-white/10 rounded"
                >
                  -
                </button>
                <div className="px-3">{item.qty ?? item.quantity ?? 1}</div>
                <button
                  onClick={() =>
                    updateQuantity(item.id, (item.qty ?? item.quantity ?? 1) + 1)
                  }
                  className="px-2 py-1 bg-white/10 rounded"
                >
                  +
                </button>
                <button onClick={() => remove(item.id)} className="text-red-400 ml-3">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-white/5 p-4 rounded-lg">
          <div className="text-sm text-gray-300">Summary</div>
          <div className="mt-3 flex items-center justify-between">
            <div className="font-semibold">Total</div>
            <div className="text-2xl font-bold text-[#00FFF7]">₹{total.toFixed(2)}</div>
          </div>

          <button
            onClick={() => navigate("/checkout", { state: { cartItems, totalPrice: total } })}
            className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-[#00E19E] to-[#00C6FF] text-black font-semibold"
          >
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </div>
  );
}
