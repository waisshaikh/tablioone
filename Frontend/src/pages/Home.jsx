import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ================= GALLERY ================= */
const InfiniteGallery = ({ images, speed = 0.5 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
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
        className="flex gap-4 w-max"
        style={{ overflowX: "scroll" }}
      >
        {loopImages.map((src, i) => (
          <div key={i} className="w-64 h-64 flex-shrink-0">
            <img
              src={src}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const [fact, setFact] = useState({ en: "", mr: "" });
  const [popularDish, setPopularDish] = useState(null);

  /* ================= FETCH FACT ================= */
  useEffect(() => {
    fetch(`${API_BASE}/api/facts/random`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setFact(data);
        } else {
          setFact({ en: "", mr: "" });
        }
      })
      .catch(() => {
        setFact({ en: "", mr: "" });
      });
  }, []);

  /* ================= FETCH POPULAR DISH ================= */
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/orders`);
        const orders = res.data?.orders || [];

        let count = {};
        let max = 0;
        let popular = null;

        orders.forEach((order) => {
          order.items?.forEach((item) => {
            count[item.name] =
              (count[item.name] || 0) + (item.quantity || 1);

            if (count[item.name] > max) {
              max = count[item.name];
              popular = item; // 🔥 FULL ITEM
            }
          });
        });

        setPopularDish(popular);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPopular();
  }, []);

  const galleryImages = [
    "/images/prawns.jpg",
    "/images/cran.jpg",
    "/images/lobstar.jpg",
    "/images/seafood.png",
    "/images/cran.jpg",
    "/images/prawns.jpg",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#121212] text-white">

      {/* ================= HERO (UNCHANGED) ================= */}
      <section className="relative w-full h-[65vh] md:h-[80vh]">
        <img
          src="/images/seafood.png"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[90%] md:w-96">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 text-center">
            <h4 className="text-sm uppercase">Daily Fact</h4>
            <p>{fact?.en || "Loading..."}</p>
            <p className="text-xs">{fact?.mr || ""}</p>
          </div>
        </div>
      </section>

      {/* ================= BUTTONS (UNCHANGED) ================= */}
      <section className="-mt-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center py-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/10">

          <Link
            to="/menu"
            className="w-full sm:w-auto text-center px-6 py-3 rounded-xl 
    bg-gradient-to-r from-[#00E19E] to-[#00C6FF] 
    text-black font-semibold shadow-md 
    hover:scale-105 hover:shadow-cyan-500/30 transition"
          >
            🍽️ Order Food
          </Link>

          <Link
            to="/table/1"
            className="w-full sm:w-auto text-center px-6 py-3 rounded-xl 
    bg-gradient-to-r from-blue-400 to-indigo-500 
    text-white font-semibold shadow-md 
    hover:scale-105 hover:shadow-indigo-500/30 transition"
          >
            📱 Order via Table QR
          </Link>

          <Link
            to="/reservation"
            className="w-full sm:w-auto text-center px-6 py-3 rounded-xl 
    bg-gradient-to-r from-pink-500 to-rose-500 
    text-white font-semibold shadow-md 
    hover:scale-105 hover:shadow-pink-500/30 transition"
          >
            🪑 Reserve Table
          </Link>

        </div>
      </section>

      {/* ================= DISH OF THE DAY ================= */}
      <section className="mt-16 px-6">
        <h2 className="text-3xl text-center mb-8"> Dish of the Day</h2>

        {popularDish ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-4xl mx-auto rounded-3xl overflow-hidden relative"
          >
            <img
              src={popularDish.image}
              className="w-full h-[400px] object-cover"
            />

            <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6">
              <h3 className="text-3xl font-bold">
                {popularDish.name}
              </h3>

              <Link
                to="/menu"
                className="mt-4 w-fit px-6 py-3 bg-gradient-to-r from-[#00E19E] to-[#00C6FF] rounded-xl text-black"
              >
                Order Now
              </Link>
            </div>
          </motion.div>
        ) : (
          <p className="text-center">Loading...</p>
        )}
      </section>

      {/* ================= GALLERY ================= */}
      <section className="py-16 px-6">
        <h2 className="text-3xl text-center mb-10">Gallery</h2>
        <InfiniteGallery images={galleryImages} />
      </section>

      {/* ================= WHY TABLIOONE ================= */}
      <section className="py-16 px-6">
        <h2 className="text-3xl text-center mb-10">
          Why TablioOne ?
        </h2>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            "QR Ordering",
            "No Waiting",
            "Smart Menu",
            "Fast Checkout",
          ].map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white/10 rounded-xl text-center"
            >
              {t}
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}