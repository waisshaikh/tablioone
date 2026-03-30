import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Profile() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  const addressInputRef = useRef(null);

  // Detect logged-in user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      const p = u?.phoneNumber || localStorage.getItem("userPhone") || "";
      setPhone(p || "");
    });
    return () => unsub();
  }, []);

  // Fetch Profile
  useEffect(() => {
    if (!phone) {
      setLoading(false);
      return;
    }
    let cancelled = false;

    (async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/users/${encodeURIComponent(phone)}`
        );
        const user = res.data?.user;
        if (user && !cancelled) {
          setForm({
            name: user.name || "",
            email: user.email || "",
            address: user.address || "",
          });
          if (addressInputRef.current)
            addressInputRef.current.value = user.address || "";
          if (user.profileImage) setPreview(user.profileImage);
        }
      } catch (err) {
        if (err?.response?.status !== 404) {
          console.error("Fetch user failed:", err);
          setMessage("⚠️ Couldn't load profile");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [phone]);

  // Fetch Orders
  useEffect(() => {
    if (activeTab === "orders" && phone) {
      (async () => {
        try {
          const res = await axios.get(
            `${API_BASE}/api/orders/user/${encodeURIComponent(phone)}`
          );
          setOrders(res.data?.orders || []);
        } catch (err) {
          console.error("Error fetching orders:", err);
        }
      })();
    }
  }, [activeTab, phone]);

  // Form handlers
  const handleFieldChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleAddressTyping = (e) =>
    setForm((prev) => ({ ...prev, address: e.target.value }));
  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : preview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!phone) {
      setMessage("❌ No phone number. Please login again.");
      return;
    }

    try {
      setSaving(true);
      const fd = new FormData();
      fd.append("phone", phone);
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("address", addressInputRef.current?.value ?? form.address);
      if (image) fd.append("avatar", image);

      const res = await axios.post(`${API_BASE}/api/users`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        setMessage("✅ Profile saved successfully!");
        const savedUser = res.data.user;
        if (savedUser?.profileImage) setPreview(savedUser.profileImage);
        setImage(null);
      } else {
        setMessage("⚠️ Saved, but server did not return success flag.");
      }
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "❌ Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  // UI
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading profile…</p>
      </div>
    );
  }
  if (!phone) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">
          You need to login with phone to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 mt-15">
      <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-lg p-6">
        {/* Tabs */}
        <div className="flex gap-6 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-2 px-4 font-semibold ${
              activeTab === "profile"
                ? "border-b-2 border-blue-500 text-blue-400"
                : "text-gray-400"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-2 px-4 font-semibold ${
              activeTab === "orders"
                ? "border-b-2 border-green-500 text-green-400"
                : "text-gray-400"
            }`}
          >
            📦 My Orders
          </button>
        </div>

        {/* Profile Form */}
        {activeTab === "profile" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-sm text-gray-400">Phone: {phone}</div>
            {preview && (
              <div className="flex justify-center mb-4">
                <img
                  src={preview}
                  alt="Profile"
                  className="w-24 h-24 object-cover rounded-full border"
                />
              </div>
            )}
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleFieldChange}
              placeholder="Name"
              className="w-full p-2 border rounded bg-gray-800"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleFieldChange}
              placeholder="Email"
              className="w-full p-2 border rounded bg-gray-800"
            />
            <input
              type="text"
              name="address"
              ref={addressInputRef}
              defaultValue={form.address}
              onChange={handleAddressTyping}
              placeholder="Address"
              className="w-full p-2 border rounded bg-gray-800"
            />
            <label className="block cursor-pointer">
              <span className="text-white">Profile Picture</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="mt-2 p-2 border rounded bg-gray-700 text-center">
                {image ? image.name : "Choose an image"}
              </div>
            </label>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
            {message && <p className="mt-2 text-center">{message}</p>}
          </form>
        )}

        {/* Orders Section */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-xl font-bold mb-4">My Orders</h2>

            {/* Filters */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded ${
                  filter === "all" ? "bg-blue-600" : "bg-gray-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("normal")}
                className={`px-3 py-1 rounded ${
                  filter === "normal" ? "bg-blue-600" : "bg-gray-700"
                }`}
              >
                Online Orders
              </button>
              <button
                onClick={() => setFilter("dinein")}
                className={`px-3 py-1 rounded ${
                  filter === "dinein" ? "bg-blue-600" : "bg-gray-700"
                }`}
              >
                Dine-in Orders
              </button>
            </div>

            {orders.length === 0 ? (
              <p className="text-gray-400">You have no orders yet.</p>
            ) : (
              <div className="space-y-4">
                {orders
                  .filter((o) =>
                    filter === "all"
                      ? true
                      : filter === "normal"
                      ? !o.table
                      : !!o.table
                  )
                  .map((o) => (
                    <div key={o._id} className="bg-gray-800 p-4 rounded-lg relative">
                      {o.table && (
                        <div className="absolute top-2 right-2 text-xs bg-teal-600 px-2 py-1 rounded-full">
                          🍽 Table {o.table}
                        </div>
                      )}

                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-lg">
                          ₹{o.totalPrice}
                        </span>
                        <span className="text-sm text-gray-400">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-300">
                        {o.items
                          .map((i) => `${i.name} × ${i.quantity}`)
                          .join(", ")}
                      </div>
                      <div className="mt-2">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            o.status === "delivered"
                              ? "bg-green-600"
                              : o.status === "pending"
                              ? "bg-yellow-600"
                              : "bg-blue-600"
                          }`}
                        >
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
