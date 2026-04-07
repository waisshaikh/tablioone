import React, { useEffect, useMemo, useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";
import { useCart } from "../context/CartContext";


const API_BASE = import.meta.env.VITE_API_URL;


//RAZORPAY LOADER

function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Razorpay SDK failed"));

    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const navigate = useNavigate();
  const [state, dispatch] = useCart();
  const cartItems = state.items || [];

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });


  // TABLE DETECTION (FINAL FIX)

  const [tableId, setTableId] = useState(null);

useEffect(() => {
  const table = sessionStorage.getItem("tableId");
  if (table) {
    setTableId(table);
  } else {
    setTableId(null);
  }
}, []);


  const isDineIn = !!tableId;

  console.log("TABLE ID:", tableId);

  // TOTAL PRICE

  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.price * (item.qty ?? item.quantity ?? 1),
      0
    );
  }, [cartItems]);


  // AUTH + CART CHECK

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

    setLoading(false);
  }, [navigate, cartItems.length]);


  // AUTO NAME FILL
  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.displayName || "",
      }));
    }
  }, []);

  // INPUT HANDLER

  const onField = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  // VALIDATION

  const validate = () => {
    const { name, phone, address } = formData;

    if (!name) {
      alert("Name required");
      return false;
    }

    if (!isDineIn) {
      if (!phone) {
        alert("Phone required");
        return false;
      }

      if (!/^[0-9]{10}$/.test(phone)) {
        alert("Enter valid 10 digit phone number");
        return false;
      }

      if (!address) {
        alert("Address required");
        return false;
      }
    }

    return true;
  };


  // PAYMENT HANDLER

  const handlePayment = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);
      await loadRazorpay();

      const user = auth.currentUser;
      const email = user.email;

      /* CREATE ORDER */
      const { data } = await axios.post(`${API_BASE}/api/orders/create`, {
        totalPrice,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Restaurant",
        description: "Order Payment",
        order_id: data.id,

        handler: async function (response) {
          try {
            await axios.post(`${API_BASE}/api/orders/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,

              cartItems: cartItems.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.qty ?? item.quantity ?? 1,
                image: item.image,
              })),
              totalPrice,
              email,

              customer: {
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
              },

              table: tableId || null,
              channel: tableId ? "table" : "online",
            });

            dispatch({ type: "CLEAR" });

            alert("Order placed successfully!");
            navigate("/");
          } catch (err) {
            console.error(err);
            alert("Payment success but order save failed ");
          }
        },

        prefill: {
          name: formData.name,
          contact: formData.phone,
        },

        theme: { color: "#00C6FF" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    } finally {
      setSubmitting(false);
    }
  };


  //LOADING

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300">
        Loading...
      </div>
    );
  }


  //UI

  return (
    <div className="max-w-5xl mx-auto px-4 mt-24 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-6">

        {/* ORDER SUMMARY */}
        <div className="md:col-span-2 bg-white/5 p-6 rounded-xl">
          {cartItems.map((item) => {
            const qty = item.qty ?? item.quantity ?? 1;

            return (
              <div key={item.id} className="flex justify-between mb-3">
                <span>{item.name} x {qty}</span>
                <span>₹{item.price * qty}</span>
              </div>
            );
          })}

          <hr className="my-4 border-white/10" />

          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>

        {/* CUSTOMER FORM */}
        <div className="bg-white/5 p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">
            {isDineIn ? "Table Order 🍽️" : "Delivery Details 🚚"}
          </h2>

          {/* NAME (ALWAYS) */}
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={onField}
            className="w-full p-2 mb-3 rounded bg-gray-900"
          />

          {/* PHONE (ONLY ONLINE) */}
          {!isDineIn && (
            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={onField}
              className="w-full p-2 mb-3 rounded bg-gray-900"
            />
          )}

          {/* ADDRESS (ONLY ONLINE) */}
          {!isDineIn && (
            <textarea
              name="address"
              placeholder="Delivery Address"
              value={formData.address}
              onChange={onField}
              className="w-full p-2 mb-3 rounded bg-gray-900"
            />
          )}

          <button
            onClick={handlePayment}
            disabled={submitting}
            className="w-full py-3 rounded bg-gradient-to-r from-[#00E19E] to-[#00C6FF] text-black font-semibold"
          >
            {submitting ? "Processing..." : `Pay ₹${totalPrice}`}
          </button>
        </div>
      </div>
    </div>
  );
}