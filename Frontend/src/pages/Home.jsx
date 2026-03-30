import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DishCard from "../components/DishCard";

// --- Mini Infinite Gallery ---
const InfiniteGallery = ({ images, speed = 0.5 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let pos = 0;
    let rafId;

    const step = () => {
      pos += speed;
      const half = el.scrollWidth / 2;
      if (pos >= half) pos = 0;
      el.scrollLeft = pos;
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [speed]);

  const loopImages = [...images, ...images];

  return (
    <div className="overflow-hidden relative w-full">
      <div
        ref={containerRef}
        className="flex gap-4 w-max select-none"
        style={{ overflowX: "scroll", scrollBehavior: "auto" }}
      >
        {loopImages.map((src, i) => (
          <div key={i} className="flex-shrink-0 w-64 h-64">
            <img
              src={src}
              alt={`Gallery ${i}`}
              className="w-full h-full object-cover rounded-xl shadow-lg"
              draggable="false"
            />
          </div>
        ))}
      </div>
      <style>{`div::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
};

// --- temporary dishes (replace with real later) ---
const dishes = [
  { id: 1, name: "Butter Garlic Prawns", price: 420, image: "/images/prawns.jpg", rating: 4.8, category: "Prawns" },
  { id: 2, name: "Chilli Crab", price: 900, image: "/images/cran.jpg", rating: 4.7, category: "Crab" },
  { id: 3, name: "Grilled Lobster", price: 1500, image: "/images/lobstar.jpg", rating: 4.9, category: "Lobster" },
  { id: 4, name: "Crispy Fish Tacos", price: 320, image: "/images/cran.jpg", rating: 4.6, category: "Snacks" },
];

export default function Home() {
  const [fact, setFact] = useState({ en: "", mr: "" });
  const [searchTerm, setSearchTerm] = useState("");

  // fetch random fact from backend
  useEffect(() => {
    const fetchFact = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/facts/random");
        const data = await res.json();
        setFact(data || { en: "", mr: "" });
      } catch (err) {
        console.error("Error fetching fact:", err);
      }
    };
    fetchFact();
  }, []);

  const filteredDishes = dishes.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (dish) => {
    console.log("add to cart", dish);
  };

  const galleryImages = [
    "/images/prawns.jpg",
    "/images/cran.jpg",
    "/images/lobstar.jpg",
    "/images/seafood.png",
    "/images/cran.jpg",
    "/images/prawns.jpg",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* HERO SECTION */}
      <section className="relative w-full h-[65vh] md:h-[80vh]">
        <img
          src="/images/seafood.png"
          alt="SeaBite hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[90%] md:w-96"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 shadow-lg border border-white/20 text-center text-black">
            <h4 className="text-sm font-semibold tracking-wide uppercase">
              Daily Seafood Fact
            </h4>
            <p className="mt-2 text-lg font-medium">
              {fact.en || "Loading…"}
            </p>
            <p className="text-xs opacity-80 mt-1">
              {fact.mr || ""}
            </p>
          </div>
        </motion.div>
      </section>

      {/* ACTION BUTTONS */}
      <section className="relative z-10 px-4 md:px-8 lg:px-16 -mt-10 md:-mt-14">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center py-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <Link to="/menu" className="w-full sm:w-auto text-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#00E19E] to-[#00C6FF] text-black font-semibold shadow-md hover:scale-105 transition-transform">
            🍽️ Order Food
          </Link>
          <Link to="/table/1" className="w-full sm:w-auto text-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-semibold shadow-md hover:scale-105 transition-transform">
            📱 Order via Table QR
          </Link>
          <Link to="/reservation" className="w-full sm:w-auto text-center px-6 py-3 rounded-xl bg-gradient-to-r from	pink-500 to-rose-500 text-white font-semibold shadow-md hover:scale-105 transition-transform">
            🪑 Reserve Table
          </Link>
        </div>
      </section>

      {/* SEARCH + POPULAR DISHES */}
      <section className="mt-12 px-4 md:px-8 lg:px-16 pb-16">
        <div className="max-w-7xl mx-auto">
          <input
            type="text"
            placeholder="Search for a dish..."
            className="w-full p-3 mb-6 rounded-xl bg-white/10 backdrop-blur-md text-black dark:text-white placeholder-black/50 dark:placeholder-white/70 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Popular Dishes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDishes.map((d) => (
              <DishCard key={d.id} dish={d} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* TODAY’S SPECIAL */}
      <section className="px-4 md:px-8 lg:px-16 py-16 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Today’s Special</h2>
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/images/wave.svg')] bg-cover"></div>
            <div className="md:flex items-center relative z-10">
              <img src="/images/lobstar.jpg" alt="Special Dish" className="w-full md:w-1/2 object-cover" />
              <div className="p-6 md:p-10 text-left">
                <h3 className="text-2xl font-bold">Grilled Lobster with Garlic Butter</h3>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  Freshly caught lobster, grilled to perfection and served with creamy garlic butter sauce.
                </p>
                <p className="mt-4 text-lg font-semibold">₹1500</p>
                <button
                  onClick={() => console.log("Add to cart: Lobster")}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-[#00E19E] to-[#00C6FF] rounded-xl text-black font-semibold hover:scale-105 transition-transform"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INFINITE GALLERY */}
      <section className="px-4 md:px-8 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Gallery</h2>
          <InfiniteGallery images={galleryImages} />
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="px-4 md:px-8 lg:px-16 py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Why Choose Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: "🐟", title: "Fresh Catch Daily" },
              { icon: "🍲", title: "Authentic Recipes" },
              { icon: "🏠", title: "Cozy Ambience" },
              { icon: "⚡", title: "Fast Service" },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-white/10 backdrop-blur rounded-xl shadow-md">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION & HOURS */}
      <section className="px-4 md:px-8 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-6">Find Us</h2>
            <iframe
              title="Map"
              src="https://www.google.com/maps/embed?pb=!1m18..."
              width="100%"
              height="300"
              className="rounded-xl"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Opening Hours</h2>
            <ul className="space-y-2">
              <li>Mon–Fri: 11:00 AM – 10:00 PM</li>
              <li>Sat: 12:00 PM – 11:00 PM</li>
              <li>Sun: 12:00 PM – 11:30 PM</li>
            </ul>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="px-4 md:px-8 lg:px-16 py-16 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get Exclusive Offers</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Subscribe to our newsletter for the latest seafood specials and events.
          </p>
          <div className="flex gap-2 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-xl w-full max-w-xs bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-[#00E19E] to-[#00C6FF] rounded-xl text-black font-semibold hover:scale-105 transition-transform">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
  