import React from "react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#121212] text-white">

      {/* 🔥 HERO */}
      <section className="text-center py-20 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          About <span className="text-[#00E19E]">TablioOne</span>
        </motion.h1>

        <p className="max-w-2xl mx-auto text-lg text-gray-400">
          Revolutionizing restaurant dining with seamless QR-based ordering,
          faster service, and a smarter digital experience.
        </p>
      </section>

      {/* ⚡ WHAT IS TABLIOONE */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

          <motion.img
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            src="https://images.unsplash.com/photo-1556740749-887f6717d7e4"
            alt="QR Ordering"
            className="rounded-2xl shadow-xl"
          />

          <div>
            <h2 className="text-3xl font-bold mb-4">
              Smart Dining Experience 🍽️
            </h2>
            <p className="text-gray-400 mb-4">
              TablioOne eliminates the traditional waiting experience in restaurants.
              Customers can simply scan a QR code, explore the menu, and place orders instantly.
            </p>
            <p className="text-gray-400">
              No waiting for waiters. No confusion. Just fast, smooth, and modern dining.
            </p>
          </div>
        </div>
      </section>

      {/* 🚀 FEATURES */}
      <section className="py-16 px-6 bg-white/5 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">
            Why Choose TablioOne?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {[
              {
                title: "QR-Based Ordering",
                desc: "Scan, browse menu, and order instantly from your phone.",
              },
              {
                title: "Real-Time Menu",
                desc: "Dynamic menus with categories, filters, and live updates.",
              },
              {
                title: "Faster Service",
                desc: "Reduce wait time and improve customer satisfaction.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-2xl bg-white/10 border border-white/10 shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-2 text-[#00FFF7]">
                  {item.title}
                </h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 👨‍💻 BUILDER / VISION */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Built for Modern Restaurants 🚀
          </h2>

          <p className="text-gray-400 max-w-3xl mx-auto">
            TablioOne is designed to help restaurants digitize their ordering system,
            reduce operational overhead, and deliver a premium customer experience.
            Whether it's a small café or a large restaurant, TablioOne adapts seamlessly.
          </p>
        </div>
      </section>

      {/* 📍 CONTACT */}
      <section className="py-16 px-6 bg-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>

          <p className="text-gray-400">
            📍 India <br />
            📞 +91 9657089562 <br />
            📧 tablioone@gmail.com
          </p>

          <button className="mt-6 px-6 py-3 rounded-xl 
          bg-gradient-to-r from-[#00E19E] to-[#00C6FF] 
          text-black font-semibold hover:scale-105 transition">
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
}