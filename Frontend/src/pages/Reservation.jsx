import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Reservation() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: 2,
    seating: "indoor",
    special: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${API_BASE}/api/reservations`, form);
      setSubmitted(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: 2,
        seating: "indoor",
        special: "",
      });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.error("Reservation submit error:", err);
      setError("❌ Failed to submit reservation. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#00E19E] rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-[#00C6FF] rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse"></div>

      <div className="w-full max-w-2xl backdrop-blur-xl bg-white/10 dark:bg-gray-900/40 border border-white/10 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.3)]">
        <h2 className="text-3xl font-bold text-white text-center mb-6 tracking-wide">
          Reserve a Table 🍽
        </h2>

        {submitted && (
          <div className="mb-4 bg-green-500/20 border border-green-400 text-green-200 p-3 rounded-lg text-center animate-fade-in">
            ✅ Reservation submitted — we'll contact you shortly.
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-400 text-red-200 p-3 rounded-lg text-center animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Full Name"
              className="input-style"
              required
            />
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="Email"
              type="email"
              className="input-style"
            />
          </div>

          {/* Phone */}
          <input
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="Phone"
            className="input-style"
            required
          />

          {/* Date, Time, Guests */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              name="date"
              value={form.date}
              onChange={onChange}
              type="date"
              className="input-style"
              required
            />
            <input
              name="time"
              value={form.time}
              onChange={onChange}
              type="time"
              className="input-style"
              required
            />
            <input
              name="guests"
              value={form.guests}
              onChange={onChange}
              type="number"
              min="1"
              max="20"
              className="input-style"
            />
          </div>

          {/* Special Requests + Seating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <textarea
              name="special"
              value={form.special}
              onChange={onChange}
              placeholder="Special Requests"
              rows="3"
              className="input-style resize-none"
            />
            <select
              name="seating"
              value={form.seating}
              onChange={onChange}
              className="input-style"
            >
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00E19E] to-[#00C6FF] text-black font-semibold shadow-lg hover:scale-[1.02] transition-transform duration-300"
          >
            Submit Reservation
          </button>
        </form>
      </div>

      {/* Extra Styles */}
      <style>{`
        .input-style {
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          outline: none;
          width: 100%;
          transition: all 0.3s ease;
        }
        .input-style:focus {
          border-color: #00E19E;
          box-shadow: 0 0 15px rgba(0, 225, 158, 0.4);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
