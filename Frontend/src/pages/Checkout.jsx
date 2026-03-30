import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";
import { useCart } from "../context/CartContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// helper: load Razorpay script only once
function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Razorpay SDK failed to load"));
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const navigate = useNavigate();
  const [state, dispatch] = useCart();
  const cartItems = state.items || [];
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    orderType: "delivery",
  });

  // ✅ get tableId if scanned via QR
  const tableId = sessionStorage.getItem("activeTable") || null;

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (s, i) => s + i.price * (i.qty ?? i.quantity ?? 1),
        0
      ),
    [cartItems]
  );

  // Require login, fetch profile, and prefill
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login", { replace: true, state: { from: "/checkout" } });
      return;
    }
    if (!cartItems.length) {
      navigate("/cart", { replace: true });
      return;
    }

    // Prefill phone from Firebase
    const phone = user.phoneNumber || "";
    setFormData((prev) => ({ ...prev, phone }));

    // Fetch Mongo profile (if exists)
    (async () => {
      try {
        setFetchingProfile(true);
        const res = await axios.get(
          `${API_BASE}/api/users/${encodeURIComponent(phone)}`,
          { withCredentials: true }
        );
        const u = res.data?.user;
        if (u) {
          setFormData((prev) => ({
            ...prev,
            name: u.name || "",
            email: u.email || "",
            address: u.address || "",
          }));
        }
      } catch (err) {
        if (err?.response?.status !== 404)
          console.error("Profile fetch failed:", err);
      } finally {
        setFetchingProfile(false);
        setLoading(false);
      }
    })();
  }, [navigate, cartItems.length]);

  const onField = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    const { name, email, phone, address } = formData;
    return name?.trim() && email?.trim() && phone?.trim() && address?.trim();
  };

  const handlePayment = async () => {
    if (!validate()) {
      alert("Please fill all the fields.");
      return;
    }

    try {
      setSubmitting(true);
      await loadRazorpay();

      // Step 1: Create order on backend
      const { data } = await axios.post(
        `${API_BASE}/api/orders/create`,
        {
          cartItems: cartItems.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.qty ?? i.quantity ?? 1,
            image: i.image,
          })),
          totalPrice,
          customer: formData,
          table: tableId, // ✅ send dine-in table if present
        },
        { withCredentials: true }
      );

      // Step 2: Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Seafood Restaurant",
        description: "Order Payment",
        order_id: data.id,
        handler: async function (response) {
          try {
            // Step 3: Verify payment + save order
            await axios.post(`${API_BASE}/api/orders/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              cartItems,
              totalPrice,
              customer: formData,
              phone: formData.phone,
              table: tableId,
            });

            // Step 4: Clear cart + table
            dispatch({ type: "CLEAR" });
            sessionStorage.removeItem("activeTable"); // ✅ clear after dine-in order

            alert("✅ Payment Successful! Order placed.");
            navigate("/");
          } catch (err) {
            console.error("Verify error:", err);
            alert("Payment succeeded but order verification failed.");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#00C6FF" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300">
        Loading checkout…
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 mt-24 mb-10 text-white">
      <h1 className="text-3xl font-extrabold mb-6 text-center">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Summary */}
        <section className="md:col-span-2 bg-white/5 rounded-2xl border border-white/10 p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="space-y-4">
            {cartItems.map((item) => {
              const qty = item.qty ?? item.quantity ?? 1;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-white/5 rounded-xl p-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-300">
                      ₹{item.price} × {qty}
                    </div>
                  </div>
                  <div className="font-bold text-teal-300">
                    ₹{item.price * qty}
                  </div>
                </div>
              );
            })}
          </div>

          <hr className="my-4 border-white/10" />

          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">Total</div>
            <div className="text-2xl font-extrabold text-[#00FFF7]">
              ₹{totalPrice.toFixed(2)}
            </div>
          </div>
        </section>

        {/* Customer Details */}
        <section className="bg-white/5 rounded-2xl border border-white/10 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Customer Details</h2>
            <button
              onClick={() => setEditing((e) => !e)}
              className="text-sm px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
              disabled={fetchingProfile}
            >
              {editing ? "Done" : "Edit"}
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={onField}
              className="w-full p-2 rounded bg-gray-900 border border-gray-700"
              disabled={!editing}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={onField}
              className="w-full p-2 rounded bg-gray-900 border border-gray-700"
              disabled={!editing}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={onField}
              className="w-full p-2 rounded bg-gray-900 border border-gray-700"
              disabled
            />
            <textarea
              name="address"
              placeholder="Delivery Address"
              value={formData.address}
              onChange={onField}
              className="w-full p-2 rounded bg-gray-900 border border-gray-700"
              disabled={!editing}
              rows={3}
            />
            <select
              name="orderType"
              value={formData.orderType}
              onChange={onField}
              className="w-full p-2 rounded bg-gray-900 border border-gray-700"
              disabled={!editing}
            >
              <option value="delivery">Delivery</option>
              <option value="pickup">Pickup</option>
            </select>
          </div>

          <button
            onClick={handlePayment}
            disabled={submitting}
            className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-[#00E19E] to-[#00C6FF] text-black font-semibold disabled:opacity-60"
          >
            {submitting ? "Processing..." : `Pay ₹${totalPrice.toFixed(2)}`}
          </button>
        </section>
      </div>
    </div>
  );
}
