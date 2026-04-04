// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { auth } from "../firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

const API_BASE = "http://localhost:5000"; // change if different

export default function Navbar({ theme, setTheme }) {
  const [open, setOpen] = useState(false);
  const [state] = useCart();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // { name, profileImage }
  const navigate = useNavigate();

  const count =
    state?.items?.reduce((s, i) => s + (i.qty ?? i.quantity ?? 1), 0) || 0;

  const isAdmin = user?.email === ADMIN_EMAIL;

  // Listen to Firebase Auth state (no Firestore)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      setProfile(null);

      // If logged in, fetch profile from your MongoDB API using email number
      const email = u?.email || localStorage.getItem("useremail");
      if (email) {
        try {
          const res = await axios.get(
            `${API_BASE}/api/users/${encodeURIComponent(email)}`,
            { withCredentials: true }
          );
          const doc = res.data?.user;
          if (doc) {
            setProfile({
              name: doc.name || u.displayName || "User",
              dp: doc.profileImage || u.photoURL || "",
            });
          }
        } catch {
          // 404 is fine on first login (no profile yet)
        }
      }
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("useremail");
    setUser(null);
    setProfile(null);
    navigate("/login");
  };

  const ProfileButton = () => (
    <Link
      to="/profile"
      className="flex items-center gap-2 px-3 py-2 rounded bg-green-500 text-white hover:bg-green-600"
    >
      {profile?.dp ? (
        <img
          src={profile.dp}
          alt="Profile"
          className="w-6 h-6 rounded-full border"
        />
      ) : (
        <span className="font-medium">👤</span>
      )}
      <span>{profile?.name?.trim() || "My Profile"}</span>
    </Link>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="backdrop-blur bg-white/60 dark:bg-black/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-xl font-extrabold tracking-tight">
                TabliOne
              </Link>

              {/* Desktop links */}
              <div className="hidden md:flex items-center gap-2 text-sm">
                <Link to="/" className="px-3 py-2 rounded hover:bg-white/20">
                  Home
                </Link>
                <Link to="/menu" className="px-3 py-2 rounded hover:bg-white/20">
                  Menu
                </Link>
                <Link
                  to="/reservation"
                  className="px-3 py-2 rounded hover:bg-white/20"
                >
                  Reserve
                </Link>
                <Link
                  to="/about"
                  className="px-3 py-2 rounded hover:bg-white/20"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="px-3 py-2 rounded hover:bg-white/20"
                >
                  Contact
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <button
                onClick={() =>
                  setTheme((prev) => (prev === "dark" ? "light" : "dark"))
                }
                className="hidden sm:inline-flex items-center px-3 py-2 rounded bg-white/10 hover:bg-white/20"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? "Light" : "Dark"}
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative px-3 py-2 rounded hover:bg-white/10"
              >
                Cart
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </Link>

              {/*  Auth Buttons (no Firestore) */}
              {!user ? (
                <Link
                  to="/login"
                  className="px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Login
                </Link>
              ) : (
                <>
                  <ProfileButton />

                  {/* ADMIN BUTTON*/}
                  {isAdmin && (
                    <button
                      onClick={() => navigate("/admin")}
                      className="px-3 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
                    >
                      Admin
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                  >
                    Logout
                  </button>
                </>
              )}

              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2"
                onClick={() => setOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                {open ? <HiX size={20} /> : <HiOutlineMenu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`${open ? "max-h-screen" : "max-h-0"
            } md:hidden overflow-hidden transition-all`}
        >
          <div className="px-4 py-3 space-y-2 border-t border-white/10 bg-white/60 dark:bg-black/60">
            <Link onClick={() => setOpen(false)} to="/menu" className="block px-3 py-2 rounded">
              Menu
            </Link>
            <Link onClick={() => setOpen(false)} to="/reservation" className="block px-3 py-2 rounded">
              Reserve
            </Link>
            <Link onClick={() => setOpen(false)} to="/about" className="block px-3 py-2 rounded">
              About
            </Link>
            <Link onClick={() => setOpen(false)} to="/contact" className="block px-3 py-2 rounded">
              Contact
            </Link>

            {!user ? (
              <Link
                onClick={() => setOpen(false)}
                to="/login"
                className="block px-3 py-2 rounded bg-blue-500 text-white"
              >
                Login
              </Link>
            ) : (
              <>
                <div onClick={() => setOpen(false)}>
                  <ProfileButton />
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="w-full px-3 py-2 rounded bg-red-500 text-white"
                >
                  Logout
                </button>
              </>
            )}

            <button
              onClick={() => {
                setTheme((prev) => (prev === "dark" ? "light" : "dark"));
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded"
            >
              Toggle Theme
            </button>
          </div>
        </div>
      </nav>

      {/* toolbar spacer so content is visible below fixed navbar */}
      <div className="h-16 md:h-16" aria-hidden />
    </header>
  );
}
