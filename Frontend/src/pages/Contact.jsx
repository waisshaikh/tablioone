import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
<div className="min-h-screen pt-40 p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Glowing background accents */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#00E19E] rounded-full blur-[120px] opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-[#00C6FF] rounded-full blur-[120px] opacity-30 animate-pulse"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
        
        {/* Left Section */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white">Get in Touch</h1>
          <p className="text-gray-300">
            Questions? Reservations? Reach out and we'll reply quickly.
          </p>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-white/10 backdrop-blur-lg">
            <iframe
              title="location"
              src="https://www.google.com/maps/embed?pb=!1m18..."
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>

          {/* Contact Info */}
          <div className="mt-4 space-y-2 text-gray-300">
            <div className="flex items-center gap-2">
              <span className="text-xl">📞</span> +91 9657089562
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📧</span> hello@tablioone.com
            </div>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/40 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.3)] border border-white/10">
          <h2 className="text-2xl font-semibold mb-5 text-white">
            Send us a message
          </h2>

          {submitted && (
            <div className="mb-3 p-3 rounded-lg bg-green-500/20 border border-green-400 text-green-200 text-center animate-fade-in">
              ✅ Message sent!
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Your name"
              className="input-style"
              required
            />
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="Your email"
              type="email"
              className="input-style"
              required
            />
            <textarea
              name="message"
              value={form.message}
              onChange={onChange}
              placeholder="Message"
              rows="5"
              className="input-style resize-none"
              required
            />
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00E19E] to-[#00C6FF] text-black font-semibold shadow-lg hover:scale-[1.02] transition-transform duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .input-style {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          outline: none;
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
