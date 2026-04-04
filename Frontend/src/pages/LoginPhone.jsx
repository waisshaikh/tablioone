import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      console.log("Logged in:", result.user);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      alert("Google login failed ❌");
    }
  };

  // 🔥 EMAIL LOGIN
  const handleEmailLogin = async () => {
    if (!email || !password) {
      alert("Enter email & password");
      return;
    }

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      console.log("Email login:", res.user);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      alert("Invalid credentials ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0A0A0A] to-[#121212] text-white">

      <div className="w-[350px] p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl text-center">

        <h1 className="text-3xl font-bold mb-2">Welcome 👋</h1>
        <p className="text-gray-400 mb-6">
          Login to continue
        </p>

        {/* 🔥 EMAIL LOGIN */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-gray-800 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-gray-800 outline-none"
        />

        <button
          onClick={handleEmailLogin}
          className="w-full bg-blue-600 py-2 rounded mb-4 hover:bg-blue-700"
        >
          Login with Email
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2 my-4 text-gray-500 text-sm">
          <div className="flex-1 h-px bg-gray-700"></div>
          OR
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* 🔥 GOOGLE LOGIN */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <p className="text-xs text-gray-500 mt-6">
          Secure login powered by Firebase
        </p>
      </div>
    </div>
  );
}